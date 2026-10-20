"""Generate resumable local Kokoro/Piper neural speech files, with an MP3 audit.

Python 3.12. Dependencies: kokoro-onnx==0.5.0, misaki[en,ja]==0.9.4,
unidic-lite, piper-tts, soundfile, lameenc. See SYNTHETIC-AUDIO-NOTES.md for setup.
"""
from __future__ import annotations
import argparse
import concurrent.futures
import hashlib
import io
import json
import os
from pathlib import Path
import sys
import time
import traceback

PROJECT = Path(__file__).resolve().parents[1]
MODEL_NAME = "Kokoro-82M v1.0 (ONNX int8)"
MODEL_SHA = "6e742170d309016e5891a994e1ce1559c702a2ccd0075e67ef7157974f6406cb"
VOICES_SHA = "bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d"
VOICES = {"ja": "jf_alpha", "en": "af_heart"}
PIPER_MODEL = "Piper VITS en_US-ljspeech-medium"
PIPER_SHA = "6f52a751e2349abe7a76735eb09dc1875298c77ea2342ffd2fef79ff81b87f22"
ENGINE_VERSION = "moru-kokoro-v1"
STATE = {}

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def json_read(path: Path, default=None):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return default

def save_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    os.replace(temp, path)

def hiragana(text):
    return "".join(chr(ord(c)-96) if "ァ" <= c <= "ヶ" else c for c in text)

def initialize(model_dir: str, threads: int, public: str):
    os.environ["OMP_NUM_THREADS"] = str(threads)
    os.environ["MKL_NUM_THREADS"] = str(threads)
    os.environ["TOKENIZERS_PARALLELISM"] = "false"
    # All automatically downloaded language resources stay in the task workspace.
    cache = Path(model_dir).parent / "tts-cache"
    os.environ.setdefault("HF_HOME", str(cache / "huggingface"))
    os.environ.setdefault("XDG_CACHE_HOME", str(cache))
    import numpy as np
    import onnxruntime as ort
    from kokoro_onnx import Kokoro
    import lameenc
    import unidic_lite
    import misaki.cutlet as cutlet
    from fugashi import Tagger
    dictionary=Path(unidic_lite.DICDIR)
    cutlet.Tagger=lambda: Tagger(f'-r "{dictionary / "mecabrc"}" -d "{dictionary}"')
    options = ort.SessionOptions()
    options.intra_op_num_threads = threads
    options.inter_op_num_threads = 1
    options.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
    options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    session = ort.InferenceSession(str(Path(model_dir)/"kokoro-v1.0.int8.onnx"), sess_options=options, providers=["CPUExecutionProvider"])
    kokoro = Kokoro.from_session(session, str(Path(model_dir)/"voices-v1.0.bin"))
    STATE.update(np=np, kokoro=kokoro, lameenc=lameenc, public=Path(public), ja=None, en=None, piper=None, model_dir=Path(model_dir), options=options)

def phonemize(job):
    lang, text, character = job["lang"], job["text"], job["character"]
    if lang == "ja":
        from misaki import ja
        if character:
            # Preserve kana letter readings: は/へ are ha/he, not particle wa/e.
            # M2P belongs to Misaki's alternate frontend and contains symbols
            # absent from Kokoro v1's vocabulary. Use its supported Cutlet table.
            from misaki.cutlet import HEPBURN
            value = "ɴ" if text == "ん" else HEPBURN.get(text)
        else:
            # UniDic may normalize isolated かう to the historical spelling of
            # こう. These cards explicitly mean 買う/飼う and retain /kaɯ/.
            if text == "かう":
                return "kaɯ."
            if STATE["ja"] is None:
                STATE["ja"] = ja.JAG2P()
            value, _ = STATE["ja"](text + "。")
        if not value or "❓" in value:
            raise ValueError(f"Japanese phonemization incomplete for {text!r}: {value!r}")
        return value.rstrip(".。 ") + "."
    # Use the package's bundled eSpeak phonemizer; no paid service or remote TTS.
    # It is reliable for isolated English words and gives Kokoro its expected IPA.
    core_pronunciations={"live":"lˈɪv.","use":"jˈuːz.","excuse me":"ɪkskjˈuːz miː.","work":"wˈɜːɹk.","learn":"lˈɜːɹn."}
    if text in core_pronunciations:
        return core_pronunciations[text]
    value = STATE["kokoro"].tokenizer.phonemize(text + ".", lang="en-us")
    # Keep the same reviewed pronunciation in the corresponding core examples.
    value=value.replace("ɛkskjˈuːs m", "ɪkskjˈuːz m").replace("wˈɜːk", "wˈɜːɹk").replace("lˈɜːn", "lˈɜːɹn")
    if not value or "❓" in value:
        raise ValueError(f"English phonemization incomplete for {text!r}")
    return value

def generate(job):
    started = time.monotonic()
    try:
        np, kokoro = STATE["np"], STATE["kokoro"]
        filename = f"audio/synthetic/{job['lang']}/{job['key'][:2]}/{job['key']}.mp3"
        output = STATE["public"] / filename
        # A terminated run may have written a valid clip just before its checkpoint.
        if output.is_file() and not job.get("force"):
            try:
                import soundfile as sf
                recovered,sr=sf.read(output,dtype="float32")
                if not len(recovered) or not np.isfinite(recovered).all() or float(np.sqrt(np.mean(recovered**2)))<0.001:
                    raise ValueError("Incomplete cached MP3")
                payload=output.read_bytes()
                entry={"localPath":filename,"sha256":digest(payload),"kind":"synthetic","voice":"en_US-ljspeech-medium" if job.get("piper") else VOICES[job["lang"]],"model":PIPER_MODEL if job.get("piper") else MODEL_NAME,"duration":round(len(recovered)/sr,3),"bytes":len(payload),"sampleRate":sr,"recoveredFromCheckpoint":True}
                return {"ok":True,"job":job,"entry":entry,"elapsed":time.monotonic()-started}
            except Exception:
                pass  # Rebuild a corrupt/incomplete clip rather than accepting it.
        if job.get("piper"):
            if STATE["piper"] is None:
                import onnxruntime as ort
                from piper.voice import PiperVoice
                from piper.config import PiperConfig
                config=json_read(STATE["model_dir"]/"en_US-ljspeech-medium.onnx.json")
                session=ort.InferenceSession(str(STATE["model_dir"]/"en_US-ljspeech-medium.onnx"),sess_options=STATE["options"],providers=["CPUExecutionProvider"])
                STATE["piper"]=PiperVoice(session=session,config=PiperConfig.from_dict(config))
            chunks=list(STATE["piper"].synthesize(job["text"]+"."))
            if not chunks: raise ValueError("Piper returned no speech")
            samples=np.concatenate([c.audio_float_array for c in chunks]);sr=chunks[0].sample_rate
            phonemes=" ".join("".join(c.phonemes) for c in chunks)
        else:
            phonemes = phonemize(job)
            unsupported = set(phonemes) - set(kokoro.tokenizer.vocab)
            if unsupported:
                raise ValueError(f"Unsupported Kokoro phonemes: {sorted(unsupported)!r}")
            samples, sr = kokoro.create(phonemes, voice=VOICES[job["lang"]], speed=0.95, is_phonemes=True, trim=False)
        samples = np.asarray(samples, dtype=np.float32).reshape(-1)
        if not len(samples) or not np.isfinite(samples).all():
            raise ValueError("Audio is empty or non-finite")
        peak = float(np.max(np.abs(samples)))
        rms = float(np.sqrt(np.mean(samples**2)))
        active = np.flatnonzero(np.abs(samples) > max(0.003, peak*0.006))
        if peak < 0.01 or rms < 0.001 or len(active) < sr*0.025:
            raise ValueError(f"Audio failed non-silence check: peak={peak}, rms={rms}, active={len(active)}")
        # Keep a generous margin around the signal; never cut at a spoken boundary.
        left = max(0, int(active[0])-int(sr*0.08))
        right = min(len(samples), int(active[-1])+int(sr*0.16))
        samples = samples[left:right]
        samples = np.concatenate((np.zeros(int(sr*0.06), np.float32), samples, np.zeros(int(sr*0.12), np.float32)))
        # Normalize peak conservatively to -2dBFS, preserving natural within-word dynamics.
        samples *= min(2.5, 0.794/max(peak,0.001))
        import soundfile as sf
        for attempt in range(3):
            pcm = (np.clip(samples,-1,1)*32767).astype("<i2").tobytes()
            encoder = STATE["lameenc"].Encoder()
            encoder.set_bit_rate(48)
            encoder.set_in_sample_rate(sr)
            encoder.set_channels(1)
            encoder.set_quality(2)
            payload = bytes(encoder.encode(pcm)) + bytes(encoder.flush())
            decoded, _ = sf.read(io.BytesIO(payload), dtype="float32")
            encoded_peak = float(np.max(np.abs(decoded)))
            if encoded_peak < 0.98:
                break
            # Lossy encoding can overshoot even when source samples are safe.
            # Re-encode from the original waveform with additional headroom.
            samples *= 0.9/encoded_peak
        else:
            raise ValueError("Encoded MP3 could not meet peak headroom check")
        if len(payload) < 600:
            raise ValueError("Encoded MP3 unexpectedly small")
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(payload)
        entry = {"localPath":filename,"sha256":digest(payload),"kind":"synthetic","voice":"en_US-ljspeech-medium" if job.get("piper") else VOICES[job["lang"]],"model":PIPER_MODEL if job.get("piper") else MODEL_NAME,"duration":round(len(samples)/sr,3),"bytes":len(payload),"sampleRate":sr,"phonemes":phonemes}
        return {"ok":True,"job":job,"entry":entry,"elapsed":time.monotonic()-started}
    except Exception as exc:
        return {"ok":False,"job":job,"error":f"{type(exc).__name__}: {exc}","elapsed":time.monotonic()-started}

def audit():
    """Decode every distinct delivered MP3, verify its hash, and count coverage."""
    import numpy as np
    import soundfile as sf
    from kokoro_onnx.config import DEFAULT_VOCAB
    public=PROJECT/"public"
    manifest=json_read(public/"data/synthetic-audio.json",{"ja":{},"en":{}})
    human=json_read(public/"data/audio.json",{})
    unique={}; invalid=[]
    for lang in ["ja","en"]:
        for ident, entry in manifest.get(lang,{}).items():
            previous=unique.get(entry["localPath"])
            if previous and previous["sha256"]!=entry["sha256"]:
                invalid.append({"id":ident,"error":"Shared file has inconsistent manifest hashes"})
            unique[entry["localPath"]]=entry
    durations=[]; rms_values=[]; peaks=[]; size=0; phonemes_checked=0
    for local,entry in unique.items():
        try:
            p=(public/local).resolve()
            if public.resolve() not in p.parents: raise ValueError("Path escapes public directory")
            payload=p.read_bytes();size+=len(payload)
            if digest(payload)!=entry["sha256"]: raise ValueError("SHA-256 mismatch")
            if entry["model"]==MODEL_NAME and entry.get("phonemes"):
                unsupported=set(entry["phonemes"])-set(DEFAULT_VOCAB)
                if unsupported: raise ValueError(f"Unsupported model phonemes: {sorted(unsupported)!r}")
                phonemes_checked+=1
            audio,sr=sf.read(p,dtype="float32")
            if not len(audio) or not np.isfinite(audio).all(): raise ValueError("Empty/non-finite decoded audio")
            rms=float(np.sqrt(np.mean(audio**2)))
            peak=float(np.max(np.abs(audio)))
            if rms<0.001 or peak<0.01: raise ValueError("Decoded signal is effectively silent")
            if peak>=1: invalid.append({"localPath":local,"error":"Decoded MP3 exceeds full scale","peak":peak})
            durations.append(len(audio)/sr);rms_values.append(rms);peaks.append(peak)
        except Exception as exc: invalid.append({"localPath":local,"error":str(exc)})
    covered={};missing=[]
    for lang in ["ja","en"]:
        rows=json_read(public/f"data/{lang}.json",[])
        covered[lang]={"words":0,"examples":0,"syntheticWords":0,"localHumanWords":0}
        for r in rows:
            entry=manifest.get(lang,{}).get(r["id"])
            h=human.get(lang,{}).get(r["word"],{})
            has_synth=bool(entry and (public/entry["localPath"]).is_file())
            has_human=bool(h.get("localPath") and (public/h["localPath"]).is_file())
            covered[lang]["syntheticWords"]+=has_synth
            covered[lang]["localHumanWords"]+=has_human
            if has_synth or has_human: covered[lang]["words"]+=1
            else: missing.append(r["id"])
            if r.get("example"):
                e=manifest.get(lang,{}).get(r["id"]+"-example")
                if e and (public/e["localPath"]).is_file(): covered[lang]["examples"]+=1
                else: missing.append(r["id"]+"-example")
    report={"coverage":covered,"uniqueFiles":len(unique),"decodedFiles":len(durations),"kokoroPhonemeFilesChecked":phonemes_checked,"bytes":size,"minimumDuration":min(durations,default=0),"maximumDuration":max(durations,default=0),"minimumRms":min(rms_values,default=0),"maximumPeak":max(peaks,default=0),"filesAtOrAboveFullScale":sum(p>=1 for p in peaks),"invalid":invalid,"missing":missing}
    save_json(PROJECT/"work/synthetic-audio-audit.json",report)
    print(json.dumps(report,ensure_ascii=False),flush=True)
    return 1 if invalid or missing else 0

def main():
    parser = argparse.ArgumentParser()
    default_models = PROJECT.parents[1]/"work/tts-model"
    parser.add_argument("--model-dir", type=Path, default=default_models)
    parser.add_argument("--workers", type=int, default=2)
    parser.add_argument("--threads", type=int, default=2)
    parser.add_argument("--limit", type=int, default=0, help="Maximum unique missing clips this run, 0 means all")
    parser.add_argument("--lang", choices=["ja","en","all"], default="all")
    parser.add_argument("--include-human", action="store_true", help="Also synthesize words with a verified local human clip")
    parser.add_argument("--only-longtail", action="store_true", help="Only English non-core words; useful for Piper benchmarks")
    parser.add_argument("--ids", nargs="*", help="Only these card IDs, for targeted corrections")
    parser.add_argument("--force", action="store_true", help="Regenerate selected clips even when their hashes match")
    parser.add_argument("--audit", action="store_true", help="Decode/hash-check every current MP3 and report coverage without generation")
    parser.add_argument("--log", type=Path, help="Write line-buffered progress JSONL to this file")
    parser.add_argument("--checkpoint", type=int, default=25)
    args = parser.parse_args()
    if args.log:
        args.log.parent.mkdir(parents=True,exist_ok=True)
        sys.stdout=args.log.open("a",encoding="utf-8",buffering=1)
    if args.audit: return audit()
    for name, expected in [("kokoro-v1.0.int8.onnx",MODEL_SHA),("voices-v1.0.bin",VOICES_SHA),("en_US-ljspeech-medium.onnx",PIPER_SHA),("en_US-ljspeech-medium.onnx.json","141d612cc0a95ed7efc1ca936b845c2364967f2e9217c5dbfcf69fc4d6c65860")]:
        content=(args.model_dir/name).read_bytes()
        if digest(content)!=expected:
            raise ValueError(f"Model integrity mismatch: {name}")
    public=PROJECT/"public"
    manifest_path=public/"data/synthetic-audio.json"
    manifest=json_read(manifest_path,{"ja":{},"en":{}})
    human=json_read(public/"data/audio.json",{})
    errors_path=PROJECT/"work/synthetic-audio-errors.json"
    failures=json_read(errors_path,{})
    rows=[]; all_rows=[]
    for lang in ["ja","en"]:
        language_rows=json_read(public/f"data/{lang}.json",[])
        language_rows += [{**r,"id":r["id"]+"-example","word":r["example"],"reading":r["example"],"tags":["example"],"isExample":True} for r in language_rows if r.get("example")]
        all_rows += language_rows
        if args.lang in ["all",lang]: rows += language_rows
    rows.sort(key=lambda r:(0 if "essential" in r["tags"] or "conversation" in r["tags"] else 1 if "example" in r["tags"] else 2 if "hiragana" in r["tags"] or "katakana" in r["tags"] else 3 if "frequent" in r["tags"] else 4 if "advanced" in r["tags"] else 5,r["rank"],r["lang"]))
    if args.only_longtail: rows=[r for r in rows if r["lang"]=="en" and "essential" not in r["tags"] and "example" not in r["tags"]]
    if args.ids: rows=[r for r in rows if r["id"] in set(args.ids)]
    grouped={}; skipped_human=0; resumed=0
    for row in rows:
        lang, ident=row["lang"],row["id"]
        previous=manifest.get(lang,{}).get(ident)
        if previous and not args.force:
            p=public/previous["localPath"]
            if p.is_file() and digest(p.read_bytes())==previous["sha256"]:
                resumed+=1; continue
            manifest[lang].pop(ident,None)
        human_entry=human.get(lang,{}).get(row["word"],{})
        if not args.include_human and human_entry.get("localPath"):
            p=public/human_entry["localPath"]
            if p.is_file() and (not human_entry.get("sha256") or digest(p.read_bytes())==human_entry["sha256"]):
                skipped_human+=1; continue
        text=hiragana(row["reading"]) if lang=="ja" else row["word"]
        character=bool(set(row["tags"])&{"hiragana","katakana"})
        use_piper=lang=="en" and not row.get("curated",False) and not row.get("isExample",False)
        key=digest(f"{ENGINE_VERSION}|{lang}|{text}|{character}|{PIPER_MODEL if use_piper else VOICES[lang]}".encode())[:32]
        if key not in grouped:
            grouped[key]={"lang":lang,"text":text,"character":character,"key":key,"ids":[],"piper":use_piper,"force":args.force}
        grouped[key]["ids"].append(ident)
    jobs=list(grouped.values())
    pending_total=len(jobs)
    if args.limit: jobs=jobs[:args.limit]
    start=time.monotonic(); generated=0; failed=0; seconds=0; done=0
    print(json.dumps({"event":"start","cards":len(rows),"resumed":resumed,"localHumanSkipped":skipped_human,"pendingUnique":pending_total,"thisRunUnique":len(jobs),"workers":args.workers,"threadsPerWorker":args.threads}),flush=True)
    def checkpoint():
        missing=[]
        for r in all_rows:
            if r["id"] in manifest.get(r["lang"],{}): continue
            h=human.get(r["lang"],{}).get(r["word"],{})
            if h.get("localPath") and (public/h["localPath"]).is_file(): continue
            missing.append(r["id"])
        manifest["_meta"]={"engine":ENGINE_VERSION,"models":[MODEL_NAME,PIPER_MODEL],"modelSha256":MODEL_SHA,"voicesSha256":VOICES_SHA,"piperSha256":PIPER_SHA,"voices":{**VOICES,"enExtended":"en_US-ljspeech-medium"},"generatedAt":"2026-10-20","counts":{lang:len(manifest.get(lang,{})) for lang in ["ja","en"]},"wordCounts":{lang:sum(r["id"] in manifest.get(lang,{}) for r in all_rows if r["lang"]==lang and not r.get("isExample")) for lang in ["ja","en"]},"exampleCounts":{lang:sum(r["id"] in manifest.get(lang,{}) for r in all_rows if r["lang"]==lang and r.get("isExample")) for lang in ["ja","en"]},"failedUnique":len(failures),"missingCards":len(missing),"complete":not missing and not failures,"note":"AI 합성 음성 · 실제 사람의 녹음이 아닙니다. 일본어·기초 영어·예문 Kokoro, 영어 확장 Piper VITS."}
        save_json(manifest_path,manifest)
        save_json(errors_path,failures)
    checkpoint()
    with concurrent.futures.ProcessPoolExecutor(max_workers=args.workers,initializer=initialize,initargs=(str(args.model_dir),args.threads,str(public))) as pool:
        future_jobs={pool.submit(generate,job):job for job in jobs}
        for future in concurrent.futures.as_completed(future_jobs):
            result=future.result(); job=result["job"]; done+=1
            if result["ok"]:
                if args.force:
                    # Different cards can share the same kana-reading clip.
                    # A correction must replace every reference and its hash.
                    for lang_entries in (manifest["ja"],manifest["en"]):
                        for ident, old in list(lang_entries.items()):
                            if old["localPath"]==result["entry"]["localPath"]:
                                lang_entries[ident]=result["entry"]
                for ident in job["ids"]: manifest[job["lang"]][ident]=result["entry"]
                generated+=len(job["ids"]); seconds+=result["entry"]["duration"]
                failures.pop(job["key"],None)
            else:
                failures[job["key"]]={"lang":job["lang"],"text":job["text"],"ids":job["ids"],"error":result["error"]};failed+=1
                print(json.dumps({"event":"error","text":job["text"],"lang":job["lang"],"error":result["error"]},ensure_ascii=False),flush=True)
            if done%args.checkpoint==0 or done==len(jobs):
                checkpoint()
                elapsed=time.monotonic()-start
                print(json.dumps({"event":"progress","doneUnique":done,"totalUnique":len(jobs),"generatedCards":generated,"failed":failed,"elapsedSeconds":round(elapsed,1),"secondsPerClip":round(elapsed/done,3),"etaSeconds":round((len(jobs)-done)*elapsed/done,1),"counts":manifest["_meta"]["counts"]}),flush=True)
    checkpoint()
    print(json.dumps({"event":"finished","cardsWritten":generated,"failed":failed,"seconds":round(time.monotonic()-start,2),"counts":manifest["_meta"]["counts"]}),flush=True)
    return 1 if failed else 0

if __name__=="__main__":
    sys.exit(main())
