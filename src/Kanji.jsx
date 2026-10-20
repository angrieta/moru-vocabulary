import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Eye, PencilLine, Play, RotateCcw, Search, Square, Undo2, Volume2 } from 'lucide-react';
import { playWord, stopAudio } from './audio.js';
import { penPoint, recordWriting } from './writing.js';
import './kanji.css';

function StrokeGuide({entry, step = entry.strokes.length, animate = false, numbers = false}) {
  return <svg viewBox="0 0 109 109" className="stroke-guide" aria-hidden="true">
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
      {entry.strokes.map((d,i) => <path key={`ghost-${i}`} d={d} className="stroke-ghost"/>)}
      {entry.strokes.slice(0, step).map((d,i) => <path key={`${entry.char}-${i}-${step}`} d={d} pathLength="1" className={animate && i === step - 1 ? 'stroke-ink stroke-draw' : 'stroke-ink'}/>)}
    </g>
    {numbers && entry.numbers.slice(0,step).map(([x,y,n]) => <text key={n} x={x} y={y} className="stroke-number">{n}</text>)}
  </svg>;
}

function WritingPad({entry, mode, onInkChange}) {
  const canvas = useRef(null);
  const strokes = useRef([]);
  const active = useRef(null);
  const [count, setCount] = useState(0);
  const ctx = () => {
    const context = canvas.current.getContext('2d');
    context.setTransform(6, 0, 0, 6, 0, 0);
    context.strokeStyle = '#285b46'; context.lineWidth = 2.4; context.lineCap = 'round'; context.lineJoin = 'round';
    return context;
  };
  const draw = points => {
    const context = ctx();
    context.beginPath(); context.moveTo(...points[0]);
    for (const p of points.slice(1)) context.lineTo(...p);
    context.stroke();
  };
  const redraw = () => { const context = ctx(); context.clearRect(0,0,109,109); strokes.current.forEach(draw); };
  const report = () => {
    setCount(strokes.current.length);
    const length = strokes.current.reduce((total,stroke) => total + stroke.slice(1).reduce((n,p,i) => n + Math.hypot(p[0]-stroke[i][0],p[1]-stroke[i][1]),0),0);
    onInkChange(length > 4);
  };
  const start = event => {
    if (!event.isPrimary || event.button !== 0 || mode === 'check') return;
    event.preventDefault();
    const point = penPoint(event.clientX,event.clientY,event.currentTarget.getBoundingClientRect());
    if (!point) return;
    active.current = {id:event.pointerId,points:[point]};
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = event => {
    if (!active.current || active.current.id !== event.pointerId) return;
    event.preventDefault();
    const point = penPoint(event.clientX,event.clientY,event.currentTarget.getBoundingClientRect());
    if (!point) return;
    const points = active.current.points;
    draw([points.at(-1),point]); points.push(point);
  };
  const end = event => {
    if (!active.current || active.current.id !== event.pointerId) return;
    if (event.type === 'pointerup') { move(event); if (active.current.points.length > 1) strokes.current.push(active.current.points); }
    active.current = null; redraw(); report();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <div className="writing-area">
    <div className={`writing-paper ${mode === 'check' ? 'show-overlay' : ''}`}>
      {mode !== 'recall' && <StrokeGuide entry={entry}/>}
      <canvas ref={canvas} width={654} height={654} aria-label="한자 쓰기 연습장" role="img"
        onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}>
        마우스나 터치로 한자를 쓰는 공간입니다. 종이에 쓴 다음 아래 확인란을 선택해도 됩니다.
      </canvas>
    </div>
    <div className="writing-tools"><span>{mode === 'check' ? '초록: 내가 쓴 글씨 · 주황: 정답' : `내가 쓴 획 ${count}개`}</span>
      <button type="button" disabled={!count || mode === 'check'} onClick={()=>{strokes.current.pop();redraw();report();}}><Undo2 size={15}/>한 획 취소</button>
      <button type="button" disabled={!count || mode === 'check'} onClick={()=>{strokes.current=[];redraw();report();}}><RotateCcw size={15}/>지우기</button>
    </div>
  </div>;
}

function KanjiPractice({entry, examples, saved, setSaved, audioIndex, onNext, onPrevious, position, total}) {
  const [mode, setMode] = useState('trace');
  const [revision, setRevision] = useState(0);
  const [hasInk, setHasInk] = useState(false);
  const [paper, setPaper] = useState(false);
  const [step, setStep] = useState(entry.strokes.length);
  const [playing, setPlaying] = useState(false);
  const [recalled, setRecalled] = useState(false);
  const [audioStatus, setAudioStatus] = useState('');
  const completed = useRef(false);
  useEffect(()=>()=>stopAudio(),[]);
  useEffect(()=>{
    if (!playing) return;
    const timer = setTimeout(()=>{
      if (step >= entry.strokes.length) setPlaying(false);
      else setStep(step+1);
    },800);
    return ()=>clearTimeout(timer);
  },[playing,step,entry]);
  const reset = nextMode => {
    setMode(nextMode);setRevision(r=>r+1);setHasInk(false);setPaper(false);
    setPlaying(false);setAudioStatus('');stopAudio();completed.current=false;
  };
  const finish = rating => {
    if (completed.current) return;
    completed.current=true;
    setSaved(state=>recordWriting(state,entry.char,rating,recalled));
    if (rating === 'again') { reset('trace');setStep(entry.strokes.length); }
    else onNext();
  };
  const example = examples[0];
  const canCheck = hasInk || paper;
  return <section className="kanji-lesson" aria-label="한자 쓰기 연습">
    <div className="kanji-lesson-top">
      <span><PencilLine size={18}/>{position + 1} / {total}<b>{mode === 'trace' ? '1. 따라 쓰기' : mode === 'recall' ? '2. 안 보고 쓰기' : '3. 내 글씨 확인'}</b></span>
      <div><button aria-label="이전 한자" onClick={onPrevious}><ChevronLeft size={19}/></button><button aria-label="다음 한자" onClick={onNext}><ChevronRight size={19}/></button></div>
    </div>
    <div className="kanji-practice-grid">
      <div className="kanji-reference">
        <span className="eyebrow">{mode === 'recall' ? '기억에서 꺼내볼까요?' : '한 획씩, 천천히'}</span>
        <h2>{entry.label || (example ? `‘${example.meaning}’에 쓰는 한자` : '단어 속 한자')}</h2>
        {mode === 'recall' ? <div className="kanji-memory-cue">
          <span aria-hidden="true">?</span>
          {example && <><strong lang="ja">{example.word.replaceAll(entry.char,'□')}</strong><p lang="ja">{example.reading}</p><p>{example.meaning}</p></>}
          <p>방금 익힌 모양을 떠올려 써보세요.<br/>확인할 때 정답이 다시 나타나요.</p>
        </div> : <>
          <div className="kanji-model" aria-label={`${entry.char} 획순 그림`}><StrokeGuide entry={entry} step={step} animate={playing} numbers/></div>
          <div className="stroke-controls">
            <button className="secondary-button" onClick={()=>{if(playing)setPlaying(false);else {setStep(1);setPlaying(true);}}}>{playing ? <Square size={16}/> : <Play size={16}/>} {playing ? '멈추기' : '획순 재생'}</button>
            <button aria-label="이전 획" disabled={step===0} onClick={()=>{setPlaying(false);setStep(s=>s-1);}}><ChevronLeft size={17}/></button>
            <span aria-live="polite">{step} / {entry.strokes.length}획</span>
            <button aria-label="다음 획" disabled={step===entry.strokes.length} onClick={()=>{setPlaying(false);setStep(s=>s+1);}}><ChevronRight size={17}/></button>
          </div>
          <details className="kanji-examples"><summary>단어 속 읽는 법 보기<ChevronRight size={15}/></summary>{examples.length ? examples.map(word=><div key={word.id}>
            <div><strong lang="ja">{word.word}</strong><small lang="ja">{word.reading}</small><span>{word.meaning}</span></div>
            <button aria-label={`${word.word} 발음 듣기`} onClick={()=>playWord(word,audioIndex,saved.speed,setAudioStatus)}><Volume2 size={18}/></button>
          </div>) : <p>모양과 획순부터 익혀보세요.</p>}
          <p className="kanji-reading-note">한자의 읽는 법은 함께 쓰는 단어에 따라 달라져요.</p>
          <p className="audio-live" role="status">{audioStatus}</p></details>
        </>}
      </div>
      <div className="kanji-writing">
        <div className="writing-heading"><strong>{mode === 'trace' ? '연한 글씨를 따라 써보세요' : mode === 'recall' ? '가이드 없이 직접 써보세요' : '획의 위치와 모양을 비교해요'}</strong><p>마우스·터치·펜으로 쓸 수 있어요.</p></div>
        <WritingPad key={`${entry.char}-${revision}`} entry={entry} mode={mode} onInkChange={setHasInk}/>
        {mode !== 'check' && <label className="paper-option"><input type="checkbox" checked={paper} onChange={e=>setPaper(e.target.checked)}/>종이에 직접 썼어요</label>}
        <div className="writing-actions">
          {mode === 'trace' && <button className="primary-button" disabled={!canCheck} onClick={()=>{setRecalled(true);reset('recall');}}>가이드 숨기고 다시 쓰기<ArrowRight size={17}/></button>}
          {mode === 'recall' && <><button className="primary-button" disabled={!canCheck} onClick={()=>{setMode('check');setStep(entry.strokes.length);}}><Eye size={17}/>정답과 겹쳐 보기</button><button className="text-button" onClick={()=>{setRecalled(false);reset('trace');setStep(entry.strokes.length);}}>기억이 안 나요 · 다시 따라 쓰기</button></>}
          {mode === 'check' && <><p className="writing-self-check">자동 채점 대신, 정답과 비교하며 직접 확인해요.</p><div className="writing-rating"><button className="secondary-button" onClick={()=>finish('again')}><RotateCcw size={17}/>다시 연습</button><button className="primary-button" onClick={()=>finish('good')}><Check size={17}/>기억했어요 · 다음</button></div></>}
        </div>
      </div>
    </div>
    <p className="kanji-credit">획순: <a href="https://kanjivg.tagaini.net/" target="_blank" rel="noreferrer">KanjiVG · Ulrich Apel</a> · <a href={`${import.meta.env.BASE_URL}licenses/KANJI-NOTES.md`} target="_blank" rel="noreferrer">CC BY-SA 3.0 · 출처와 가공 내역</a></p>
  </section>;
}

export default function Kanji({words,saved,setSaved,audioIndex}) {
  const [data,setData]=useState(null);
  const [error,setError]=useState(false);
  const [retry,setRetry]=useState(0);
  const [filter,setFilter]=useState('basic');
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState(null);
  const [session,setSession]=useState(null);
  const [position,setPosition]=useState(0);
  const [round,setRound]=useState(0);
  useEffect(()=>{
    let active=true;
    setError(false);
    fetch(`${import.meta.env.BASE_URL}data/kanji.json?v=${__MORU_BUILD__}`).then(r=>{if(!r.ok)throw Error();return r.json();}).then(value=>{
      if(!Array.isArray(value.entries)||!value.entries.length||value.entries.some(e=>!e.strokes?.length))throw Error();
      if(active)setData(value);
    }).catch(()=>{if(active)setError(true);});
    return()=>{active=false;};
  },[retry]);
  const wordMap=useMemo(()=>new Map(words.map(w=>[w.id,w])),[words]);
  const filtered=useMemo(()=>(data?.entries||[]).filter(e=>{
    if(filter==='basic'&&!e.basic || filter==='essential'&&!e.essential || filter==='again'&&saved.writing?.[e.char]?.lastRating!=='again')return false;
    const term=query.trim();
    return !term || [e.char,e.label,...e.wordIds.flatMap(id=>{const w=wordMap.get(id);return w?[w.word,w.reading,w.meaning]:[];})].some(text=>text.includes(term));
  }),[data,filter,query,saved.writing,wordMap]);
  const practice= session?.[position];
  if(error)return <div className="empty-state"><h2>획순 자료를 불러오지 못했어요</h2><p>연결을 확인하고 다시 시도해 주세요.</p><button className="primary-button" onClick={()=>setRetry(r=>r+1)}>다시 불러오기</button></div>;
  if(!data)return <div className="loading-state">한자 연습장을 펼치는 중이에요…</div>;
  const start=entry=>{setSelected(entry.char);setSession(filtered);setPosition(filtered.indexOf(entry));window.scrollTo(0,0);};
  const move=direction=>{setPosition(p=>(p+direction+session.length)%session.length);setRound(r=>r+1);window.scrollTo(0,0);};
  return <div className="kanji-page">
    {practice ? <><button className="text-button kanji-back" onClick={()=>setSession(null)}><ChevronLeft size={17}/>한자 목록으로</button>
      <KanjiPractice key={`${practice.char}-${round}`} entry={practice} examples={practice.wordIds.map(id=>wordMap.get(id)).filter(Boolean)} saved={saved} setSaved={setSaved} audioIndex={audioIndex} position={position} total={session.length} onNext={()=>move(1)} onPrevious={()=>move(-1)}/>
    </> : <>
      <div className="kanji-overview"><div><span className="eyebrow">WRITE IT, REMEMBER IT</span><h2>눈으로 익히고, 손으로 기억해요.</h2><p>획순을 보고 따라 쓴 뒤, 안 보고 한 번 더 써보세요.</p></div><div className="kanji-progress-count"><strong>{data.entries.filter(e=>saved.writing?.[e.char]?.attempts>0).length}<small> / {data.entries.length}</small></strong><span>직접 확인한 한자</span></div></div>
      <div className="kanji-catalog-toolbar"><div className="category-tabs" role="group" aria-label="한자 분류">{[['basic','기초부터'],['essential','필수 단어 속 한자'],['again','다시 쓸 한자'],['all','전체']].map(([id,label])=><button key={id} aria-pressed={filter===id} className={filter===id?'active':''} onClick={()=>setFilter(id)}>{label}</button>)}</div><label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="한자 검색" placeholder="한자, 뜻, 단어로 검색"/></label></div>
      <p className="kanji-count">{filtered.length}자 · 처음에는 획이 적은 글자부터 천천히 시작해요.</p>
      {filtered.length ? <div className="kanji-catalog">{filtered.map(e=><button key={e.char} className={selected===e.char?'last-practiced':''} onClick={()=>start(e)}>
        <span className="kanji-tile-meta">{e.strokes.length}획{saved.writing?.[e.char]?.lastRating==='good'&&<Check size={15} aria-label="연습 기록 있음"/>}</span>
        <strong lang="ja">{e.char}</strong><span>{e.label || wordMap.get(e.wordIds[0])?.meaning || '단어 속 한자'}</span>
      </button>)}</div> : <div className="empty-state"><h2>{query?'찾는 한자가 없어요':'다시 쓸 한자가 없어요'}</h2><p>{query?'다른 한자나 한국어 뜻으로 찾아보세요.':'연습 후 ‘다시 연습’을 선택한 한자가 여기에 모여요.'}</p></div>}
      <p className="kanji-credit">기초 목록은 학습용 추천이며 공식 시험 등급이 아니에요. 획순은 <a href="https://kanjivg.tagaini.net/" target="_blank" rel="noreferrer">KanjiVG</a> 자료를 사용해요. <a href={`${import.meta.env.BASE_URL}licenses/KANJI-NOTES.md`} target="_blank" rel="noreferrer">출처 보기</a></p>
    </>}
  </div>;
}
