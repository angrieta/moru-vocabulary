# 한자 쓰기 데이터

- 획순 원본: [KanjiVG](https://kanjivg.tagaini.net/) / [GitHub](https://github.com/KanjiVG/kanjivg)
- 저작자: Ulrich Apel 및 KanjiVG 기여자
- 라이선스: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)
- [원본 라이선스 전문](KANJIVG-COPYING.txt)
- 고정 원본 리비전: `70a0b7ae0c18ceb5cb358274b029cce0234a43bc`

모루는 기초 학습용 한자 117자와 사이트 필수 단어에 쓰이는 100자의 합집합인 **162자**를 선택했습니다. 공식 JLPT 급수나 통계적 빈도 순위가 아닙니다.

`scripts/build-kanji.mjs`에서 원본 SVG의 획 경로와 획순 번호 좌표를 추출하여 `public/data/kanji.json`으로 변환했습니다. 획 모양과 순서는 변경하지 않았고, 화면에서는 크기·색·재생 방식과 쓰기 격자를 추가했습니다. 이 변환 획순 자료도 CC BY-SA 3.0으로 제공합니다.

한글 대표 뜻은 입문 학습을 위한 모루의 편집 정보이며 한자의 모든 뜻을 포함하지 않습니다. 단어 예시는 기존 일본어 단어장과 연결하며 단어별 읽는 법과 뜻을 표시합니다. 해당 단어장의 출처와 라이선스는 [DATA-NOTES.md](DATA-NOTES.md)에 있습니다.

필기는 자동 인식·자동 채점하지 않습니다. 사용자가 정답과 자신의 글씨를 비교하여 확인한 연습 횟수·자가 평가만 브라우저에 저장합니다. 필기 이미지나 펜 궤적은 저장·전송하지 않으며, 단어 퀴즈 정답률·복습 일정·하루 학습 단어 수에 합산하지 않습니다. 설정의 JSON 백업에 쓰기 기록이 포함됩니다.
