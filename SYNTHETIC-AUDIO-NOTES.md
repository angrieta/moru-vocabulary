# 로컬 AI 합성 발음 파일

이 파일들은 **Kokoro 또는 Piper VITS 신경망 음성 합성으로 생성한 MP3**입니다. 실제 화자의 녹음이 아니며, 브라우저의 음성 합성을 파일인 것처럼 표시한 것도 아닙니다. 사람 녹음과 구분하여 **AI 합성**으로 표시하세요. 최종 재생은 다운로드가 끝난 사람 녹음이 있으면 그것을 우선할 수 있습니다.

## 생성 모델과 출처

- 모델: [hexgrad/Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M), v1.0, Apache License 2.0.
- 실행: [thewh1teagle/kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx), Python package 0.5.0, ONNX Runtime CPU.
- 모델 배포 파일: [공식 ONNX model-files-v1.0 릴리스](https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0)의 `kokoro-v1.0.int8.onnx`, `voices-v1.0.bin`.
- 일본어 음소화: [Misaki](https://github.com/hexgrad/misaki) 0.9.4 `JAG2P` / Cutlet. 단어 카드의 가나 읽기를 입력하여 한자 다독음 혼동을 줄입니다. 문자 카드의 は/へ는 조사 발음이 아니라 글자 발음이 되도록 별도 처리합니다.
- 영어 음소화: Kokoro ONNX에 포함된 eSpeak NG 음소화. 출력은 Kokoro의 미국 영어 `af_heart` 음성입니다.
- 일본어 음성: `jf_alpha`. [공식 음성 안내](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md)에 따르면 일본어는 영어보다 학습량과 품질 평가가 낮은 언어입니다. 확장 어휘와 매우 짧은 글자의 발음에는 오류가 남을 수 있습니다.
- 영어 확장 어휘: [Piper VITS en_US-ljspeech-medium](https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/ljspeech/medium). [모델 카드](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ljspeech/medium/MODEL_CARD)는 공개 도메인 [LJ Speech Dataset](https://keithito.com/LJ-Speech-Dataset/)에서 처음부터 학습한 미국 영어 여성 음성이라고 설명합니다. 영어 기초 추천과 256개 일본어·영어 예문에는 Kokoro를 유지하며, 영어 확장에는 CPU 생성 속도가 빠른 Piper를 사용합니다. 확장 어휘를 들을 때 목소리가 달라질 수 있습니다.
- Piper 모델 학습자: [Bryce Beattie의 원본 배포 안내](https://brycebeattie.com/files/tts/)에서 LJSpeech medium 모델 자체의 라이선스도 **public domain**으로 명시합니다. Hugging Face의 Piper 음성 모음은 MIT로 표시되며, 개별 모델 안내를 우선 확인했습니다.
- Piper 실행: [OHF-Voice/piper1-gpl](https://github.com/OHF-Voice/piper1-gpl), `piper-tts==1.4.1`, GPL-3.0. 런타임과 모델은 웹사이트 파일에 포함하지 않고 개발 환경에서 음성 생성에만 사용합니다. 음성 파일을 실제 화자의 녹음으로 표시하면 안 됩니다.
- MP3 인코딩: `lameenc` / LAME, Kokoro 24 kHz / Piper 22.05 kHz 모노, 48 kbps. 모델과 실행 라이브러리 자체는 사이트에 배포하지 않습니다. 원본 라이브러리 사용 조건은 각 저장소를 확인하세요.

## 확인 범위

생성기는 모든 파일의 신호가 비어 있지 않은지, 유한한 값인지, 음량과 유효 신호 구간이 있는지 확인합니다. 무음 판정 파일은 성공 목록에 넣지 않습니다. Kokoro 입력 음소가 모델의 문자표에 모두 포함되는지도 검사합니다. 앞뒤 여백을 보존하며 피크를 제한해 잘림과 과도한 음량을 줄였습니다. 이 검사는 발음의 정확성을 자동으로 보장하는 검사가 아닙니다. 모든 파일을 사람이 청취한 것은 아닙니다.

가나 문자 208장은 Cutlet의 Kokoro 호환 음소 표로 생성하며, `は/へ`를 조사로 읽는 문제와 일부 보조 음소 기호가 누락되는 문제를 피합니다. 필수 단어의 음소를 검토하여 `買う`의 `かう`, 영어 동사 `live/use`, 부탁 표현 `excuse me`, 미국식 `work/learn` 및 해당 예문은 생성기에 발음 보정을 저장했습니다.

2026-10-20 최종 검증 결과:

| 언어 | 로컬 발음이 있는 단어·문자 카드 | 합성 파일이 있는 카드 | 합성 예문 |
| --- | ---: | ---: | ---: |
| 일본어 | 8,130 / 8,130 | 8,124 | 129 |
| 영어 | 20,004 / 20,004 | 20,002 | 127 |
| 합계 | 28,134 / 28,134 | 28,126 | 256 |

합성 파일이 없는 8개 단어는 로컬 사람 녹음으로 들을 수 있습니다. 사람 녹음과 합성 파일이 모두 있는 카드도 있으므로 두 종류의 개수를 단순히 더하면 안 됩니다. 같은 읽기를 공유한 결과 고유 MP3는 **26,810개**, 총 **169,631,609바이트(약 161.8 MiB)**입니다. 모델별 파일 수는 Kokoro 일본어 6,681개, Kokoro 영어 252개, Piper 영어 19,877개입니다.

전수 `--audit` 검사는 26,810개 모두 SHA-256 일치와 실제 MP3 디코딩을 확인했고 누락·무음·손상 0개, 최대 피크 0.9952, 풀 스케일(1.0) 이상 0개였습니다. 재생 길이는 0.496~2.520초, 최소 RMS는 0.0427입니다. 보존된 음소 정보가 있는 Kokoro 파일 6,784개는 모델의 지원 기호 검사도 통과했습니다. 초기 인코딩에서 발견한 피크 초과 5개는 여유를 더 주어 재생성했으며, 생성기에도 인코딩 후 피크 검사와 재조정을 넣었습니다. 이 수치는 음성 파일의 기술적 검증 결과이며 전 단어의 청취·언어학적 정확성 검증을 뜻하지 않습니다.

`public/data/synthetic-audio.json`의 `ja`/`en`은 **카드 ID**를 키로 사용합니다. 예문은 `${카드ID}-example`을 사용합니다. 일본어 129개와 영어 127개 예문을 따로 생성합니다. 각 항목은 `localPath`, `sha256`, `kind: "synthetic"`, `voice`, `model`, `duration`, `bytes`, `sampleRate`와 가능한 경우 `phonemes`를 포함합니다. 중단 직후 디스크에서 복구한 MP3는 `recoveredFromCheckpoint:true`이며 음소 필드가 없을 수 있습니다. 같은 읽기의 카드가 같은 파일을 공유하므로 카드 수와 MP3 파일 수는 다릅니다. 실제 범위는 이 파일의 `_meta.wordCounts`, `_meta.exampleCounts`와 디스크 파일을 기준으로 판단해야 합니다. URL만 있고 다운로드가 안 된 사람 음성은 합성 생성 생략의 근거로 사용하지 않습니다.

## 재생성과 이어 만들기

프로젝트 외부 또는 프로젝트의 `work/` 아래 가상 환경을 사용합니다. 시스템 Python을 변경하지 않아도 됩니다. Python 3.12에서 다음 라이브러리가 필요합니다.

```sh
python -m pip install kokoro-onnx==0.5.0 "misaki[en,ja]==0.9.4" unidic-lite==1.0.8 piper-tts==1.4.1 onnxruntime==1.31.0 soundfile==0.14.0 lameenc==1.9.0
python scripts/build-synthetic-audio.py --model-dir /path/to/tts-model --workers 4 --threads 1
```

Windows에서는 pyopenjtalk의 빌드 도구나 호환 휠이 필요할 수 있습니다. Kokoro 모델 파일 두 개와 Piper의 `en_US-ljspeech-medium.onnx`, `en_US-ljspeech-medium.onnx.json`을 위 공식 배포처에서 내려받아 같은 모델 폴더에 둡니다. 생성 전 고정된 SHA-256을 검증합니다. 일본어 형태소 분석은 별도 대형 UniDic 다운로드 없이 동봉된 UniDic-lite 사전을 명시적으로 선택합니다.

| 파일 | SHA-256 |
| --- | --- |
| kokoro-v1.0.int8.onnx | `6e742170d309016e5891a994e1ce1559c702a2ccd0075e67ef7157974f6406cb` |
| voices-v1.0.bin | `bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d` |
| en_US-ljspeech-medium.onnx | `6f52a751e2349abe7a76735eb09dc1875298c77ea2342ffd2fef79ff81b87f22` |
| en_US-ljspeech-medium.onnx.json | `141d612cc0a95ed7efc1ca936b845c2364967f2e9217c5dbfcf69fc4d6c65860` |

`--limit 20 --checkpoint 5`로 작은 시험을 할 수 있습니다. 다시 실행하면 완료 파일의 SHA-256을 확인하고 이어서 만듭니다. `--lang ja` 또는 `--lang en`으로 언어를 고를 수 있습니다. `--include-human`은 이미 로컬 사람 녹음이 있는 단어도 합성 파일을 만들 때 씁니다. 오류는 `work/synthetic-audio-errors.json`에 남습니다. 필수·회화, 문자, 자주 쓰는 단어, 고급, 나머지 확장 순서로 생성합니다. `--workers`와 `--threads`를 지나치게 늘리면 오히려 느려질 수 있습니다.

현재 `_meta.complete`가 false면 진행 중이거나 확인이 필요한 실패가 있다는 뜻입니다. 부분 생성 상태에서도 성공한 항목만 재생에 사용할 수 있으며, 완료되지 않은 항목에 가짜 로컬 경로나 합성 완료 표시를 붙이지 않습니다.

완료 후 `python scripts/build-synthetic-audio.py --audit`로 모든 고유 MP3의 해시와 디코딩·무음 검사를 실행할 수 있습니다. 결과는 `work/synthetic-audio-audit.json`에 저장됩니다. `--ids en-live en-use --force`처럼 특정 카드만 다시 합성할 수 있습니다. 완료 파일은 저장된 해시로 보존하지만, 모델이 다시 추론하면 난수나 실행 환경에 따라 바이트 단위 결과가 달라질 수 있습니다.
