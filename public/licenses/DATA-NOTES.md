# MORU 어휘 데이터 · 출처와 사용 조건

작성일: 2026-10-20. 데이터 수정·필터링·추천 순서·한글 발음 보조·기초 예문은 이 프로젝트에서 추가했습니다.

## 실제 포함 범위

| 언어 | 어휘·표현 | 문자 카드 | 합계 | 기초 추천과 예문 |
| --- | ---: | ---: | ---: | ---: |
| 일본어 | 7,922 | 208 | 8,130 | 129 |
| 영어 | 20,004 | 0 | 20,004 | 127 |
| 합계 | 27,926 | 208 | 28,134 | 256 |

히라가나 104장, 가타카나 104장은 각각 기본 46음, 탁음·반탁음 25음, 요음 33음입니다. 단어와 구분되는 문자 카드이며 뜻 대신 소리를 설명합니다. 글자 수가 둘인 요음도 한 카드로 셉니다. 어휘 수는 철자 기준이며 일본어의 한자/가나 표기나 영어 활용형이 각각 포함될 수 있습니다. 서로 다른 의미의 수나 기본형만의 수는 아닙니다.

일본어 129개·영어 127개는 일상 대화의 시작에 맞춰 뜻·한글 발음·짧은 예문과 번역을 직접 편집한 기초 목록입니다. 전문 번역가·원어민의 전체 검수를 완료했다는 뜻은 아닙니다. 나머지는 공개사전의 확장 목록이며 잘못된 뜻, 오래된 표현, 좁은 전문 의미가 남아 있을 수 있습니다.

## 출처

1. **영어:** [Open English-Korean Dictionary](https://github.com/jhseo1211/open-english-korean-dict), jhseo1211 / LexiSnap project team 및 상위 데이터 기여자. Commit `92cbfe63deee1ccead2c42677027d8b4a305b2c7`, `dict/words.json`. 제공된 48,037개 중 철자·한국어 뜻·길이 필터를 거친 빈도 순 상위 20,000개에 기초 표현을 보강했습니다. 원본 프로젝트는 사람이 편집한 번역과 LLM 보조 번역을 함께 사용했다고 밝힙니다. CC BY-SA 4.0으로 배포됩니다. 원본의 [CREDITS.md](https://github.com/jhseo1211/open-english-korean-dict/blob/92cbfe63deee1ccead2c42677027d8b4a305b2c7/CREDITS.md)를 `public/licenses/EN-UPSTREAM-CREDITS.md`에도 보존했습니다.
2. **일본어 한국어 풀이:** 한국어 위키낱말사전 기여자, [Kaikki 일본어 추출](https://kaikki.org/kowiktionary/%EC%9D%BC%EB%B3%B8%EC%96%B4/index.html), Tatu Ylonen / Wiktextract. 한국어 뜻이 있고 읽기를 확인할 수 있는 항목만 남겼습니다. 한 항목에서 최대 두 풀이를 사용하며, 뜻이 아닌 어간 설명·활용 안내 등을 걸러냈습니다. 각 JSON 행의 `source`는 원래 낱말 페이지로 연결됩니다. [위키낱말사전](https://ko.wiktionary.org/)의 CC BY-SA 라이선스와 저작자표시를 유지합니다.
3. **일본어 읽기·수준 참고:** [Ringoo open-vocabularies](https://github.com/ringooai/open-vocabularies), Copyright (c) 2026 Ringoo, MIT. Commit `8ab476e12142e0bd70b7e92247a6c8c0e8648fac`, `data/ja/jlpt-n1.csv`부터 `jlpt-n5.csv`. 원래 영어 풀이는 사용하지 않고 읽기와 학습 수준 참고만 사용했습니다. 원문 MIT 고지는 `public/licenses/RINGOO-MIT.txt`에 보존했습니다.

영어 상위 출처의 원출처에는 [kengdic](https://github.com/garfieldnate/kengdic), [cc-kedict](https://github.com/mhagiwara/cc-kedict), [ipa-dict](https://github.com/open-dict-data/ipa-dict), [CMU Pronouncing Dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict), NGSL, NAWL, [CEFR-J](https://github.com/openlanguageprofiles/olp-en-cefrj), Wiktionary가 포함됩니다. 상세 고지는 동봉한 원본 CREDITS를 확인하세요.

## 순서와 수준의 의미

- `essential`: 일본어 129개·영어 127개의 기초 추천 어휘입니다. 첫 카드는 일본어 `こんにちは`, 영어 `hello`이며, 두 번째는 `ありがとう`, `thank you`입니다.
- `conversation`: 기초 추천 중 인사·부탁·의문사·즉시 사용하는 생활 표현으로 다시 좁힌 일본어 48개·영어 46개입니다. 필수 탭과 구성이 다릅니다.
- `frequent`: 기초 추천 및 공개사전 빈도/JLPT 입문 단계로 선별합니다. 실제 회화 말뭉치를 이 프로젝트에서 집계한 공식 빈도 순위가 아닙니다.
- `advanced`: 일본어 비공식 N1·N2 참고 목록과 영어 공개사전 C1·C2 분류입니다. 원본 CEFR 값에는 추정치가 많습니다.
- `rank`: 앱 안의 학습 추천 정렬용 숫자입니다. 언어 사이 또는 다른 사전과 통계적으로 비교하면 안 됩니다.
- `level`: 일본어 N5→입문, N4→초급, N3→중급, N2/N1→고급으로 매핑합니다. 영어 A1→입문, A2→초급, B1/B2→중급, C1/C2→고급입니다. 분류되지 않은 일본어 어휘는 확장입니다. 공식 시험 출제 범위를 보장하지 않습니다.
- `curated`: 기초 내용 편집 여부입니다. `true`는 공인 검수나 오류 없음 보증을 뜻하지 않습니다.

## 발음과 예문

한글은 다른 언어의 소리를 완전하게 표현할 수 없습니다. 기초 어휘의 한글은 학습 보조 근사치입니다. `hintAuto:true`는 가나 또는 IPA를 규칙으로 바꾼 **자동 근사 표기**이며, 강세·연음·모음 길이·일부 자음 차이가 손실됩니다. 특히 확장 영어는 IPA와 음성을 우선 확인하세요. 일본어 `ː` 표시는 앞소리를 길게 내는 장음입니다. IPA가 없는 영어의 `reading` 및 변환하지 못한 발음의 `hint`는 빈 문자열로 둡니다. 실제로 모든 항목에 한글 발음이 있다는 주장을 하지 않습니다.

영어 17,182개에 IPA가 있고 16,445개에 한글 보조가 있습니다. 일본어는 8,130개 모두 읽기와 한글 보조가 있습니다. 예문 256쌍은 이 프로젝트에서 새로 작성했습니다. 발음 데이터에 녹음 파일은 포함되어 있지 않습니다. 앱에서 제공하는 브라우저 음성 합성은 녹음 음성과 구별해서 표시해야 합니다.

## 재배포

`public/data/ja.json`, `public/data/en.json`, 편집한 기초 어휘와 예문 등 이 어휘 데이터의 변경분은 **[Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)** 조건으로 제공합니다. 원본 저작자·출처·라이선스 링크와 수정 사실을 유지하고, 수정한 데이터도 동일한 조건으로 공유하세요. 라이선스 전문은 `public/licenses/CC-BY-SA-4.0.txt`에 있습니다. 원본 스냅샷의 원래 라이선스 고지도 유지합니다. 이 조건은 어휘 데이터에 대한 것으로, 앱 코드의 별도 라이선스와 구분됩니다.

사이트 배포 시에도 이 출처 안내, 라이선스, 원본 링크에 접근할 수 있게 유지하세요. 화면에는 `위키낱말사전 · Kaikki · Open English-Korean Dictionary · Ringoo / CC BY-SA 4.0 · MIT / 편집·가공됨` 같은 간단한 표시와 상세 안내 링크를 둘 수 있습니다.

## 재현 방법

Node.js 22 이상에서 프로젝트 폴더에서 실행합니다.

```sh
node scripts/build-data.mjs
```

동봉한 `scripts/source-snapshots/*.gz`를 해제하고 `scripts/source-lock.json`의 SHA-256을 검증하므로 네트워크 없이 같은 결과를 재현합니다. 원본을 직접 내려받아 둔 경우 `node scripts/build-data.mjs /path/to/sources`를 사용합니다. 원본 및 스냅샷이 없을 때 `--download`를 붙이면 lock 파일의 URL로 받습니다. GitHub 출처는 commit으로 고정되어 있습니다. Kaikki의 라이브 다운로드가 갱신되어 해시가 달라지면 스크립트는 조용히 대체하지 않고 오류로 중단합니다. 원본 스냅샷 또는 검토 후 갱신한 lock 파일이 필요합니다.

내용 수정은 `scripts/core-vocabulary.mjs`, `scripts/vocabulary-corrections.mjs` 또는 빌더의 필터에서 하고 다시 빌드합니다. 각 언어 상위 500카드의 대표 뜻을 추가로 살펴보고 눈에 띄는 오역·부차적 뜻·오타를 수정 맵에 저장했습니다. 예를 들어 mean의 잘못된 풀이를 ‘의미하다’, train을 ‘기차·훈련하다’, container를 ‘용기·컨테이너’로, 結構의 오타를 ‘훌륭함·괜찮음·충분함’으로 고쳤습니다. 이 편집은 전체 확장 사전의 정확성 검수를 뜻하지 않습니다. 수정된 행에는 `meaningEdited:true`가 있습니다.

`public/data/stats.json`은 실제 JSON 배열에서 계산한 개수입니다. 카드 ID는 단어에서 결정적으로 생성되므로 단순한 정렬 변경으로 학습 기록의 ID가 바뀌지 않습니다.
