// Editorial fixes after reviewing the first 500 cards of each language.
// Representative beginner meanings; not an exhaustive list of dictionary senses.
const map = text => Object.fromEntries(text.trim().split('\n').map(line => {
  const [word,meaning] = line.split('|'); return [word,{meaning}];
}));
export const jaCorrections = map(`
方|방향 · 방법 · 분(사람을 높이는 말)
目|눈 · 눈으로 보는 기관
雪|눈 · 하늘에서 내리는 눈
年|해 · 년 · 나이
嫌|싫음 · 싫다
所|곳 · 장소
前|앞 · 이전
後|뒤 · 이후 · 나중
物|물건 · 사물
橋|다리 · 강이나 도로 등을 건너는 구조물
零|영 · 0
かける|걸다 · 전화를 걸다 · 시간을 들이다
ない|없다 · ~하지 않다
着る|입다 · 옷을 몸에 걸치다
辺|주변 · 근처 · 가장자리
帽子|모자
上着|겉옷 · 상의
はく|신다 · 바지나 치마를 입다
ちょっと|조금 · 잠깐 · 실례지만
喫茶店|찻집 · 카페
どうぞ|어서 · 부디 · 정중하게 권하는 말
どうも|정말 · 고마워요 등 인사에 쓰는 말
ゼロ|영 · 0
半|반 · 절반 · 30분
授業|수업
先|앞 · 먼저 · 앞으로의 일
交差点|교차로 · 사거리
泳ぐ|수영하다 · 헤엄치다
テレビ|텔레비전 · TV
もっと|더 · 더욱
背|키 · 등
お風呂|목욕 · 욕조 · 욕실
部屋|방
もう|이미 · 벌써 · 더
便利|편리함 · 편리하다
休み|휴식 · 휴일 · 쉬는 시간
つける|붙이다 · 전등이나 기기를 켜다
かかる|시간이나 돈이 들다 · 걸리다
出す|내다 · 꺼내다 · 내놓다
漢字|한자
元気|건강함 · 활기 · 기운
ええ|네 · 예
去年|작년
段々|점점 · 차츰차츰
皆さん|여러분
アパート|아파트 · 소규모 공동주택
公園|공원
大好き|매우 좋아함 · 정말 좋아하다
困る|곤란하다 · 난처하다
こちら|이쪽 · 여기 · 이분
この|이 · 뒤에 명사가 오는 지시어
その|그 · 뒤에 명사가 오는 지시어
あの|저 · 뒤에 명사가 오는 지시어
どの|어느 · 뒤에 명사가 오는 지시어
そっち|그쪽 · 거기
五日|닷새 · 5일
町|마을 · 동네 · 시가지
電気|전기 · 전등
乗る|타다 · 올라타다
持つ|가지다 · 들다 · 소유하다
では|그럼 · 그러면 · ~에서는
一月|한 달 · ひとつき로 읽을 때
同じ|같음 · 같은
一日|하루 · いちにち로 읽을 때
二日|이틀 · 2일
三日|사흘 · 3일
四日|나흘 · 4일
六日|엿새 · 6일
七日|이레 · 7일
八日|여드레 · 8일
九日|아흐레 · 9일
十日|열흘 · 10일
在る|있다 · 존재하다
有る|있다 · 사물이 존재하다
静か|조용함 · 조용하다
小さな|작은
洋服|양복 · 서양식 옷
先生|선생님 · 교사
うち|집 · 우리 집 · 안쪽
姉|언니 · 누나
辛い|맵다 · からい로 읽을 때
磨く|닦다 · 갈고닦다
なる|~이 되다
座る|앉다
下手|서투름 · 잘하지 못함
多分|아마 · 아마도
弟|남동생
結構|훌륭함 · 괜찮음 · 충분함
`);

export const enCorrections = map(`
mean|의미하다 · 뜻하다 · 못된
really|정말 · 실제로
down|아래로 · 아래에
off|떨어져 · 꺼진 · 쉬는
course|과정 · 강좌 · 진로
during|~동안
without|~없이
against|~에 반대하여 · ~에 맞서 · ~에 기대어
job|일 · 직업
away|떨어져 · 멀리
thank|감사하다 · 고마워하다
hour|시간 · 한 시간
less|더 적은 · 덜
once|한 번 · 한때 · 일단 ~하면
member|구성원 · 회원
whether|~인지 아닌지 · ~이든
present|현재의 · 선물 · 제시하다
term|용어 · 기간 · 학기
least|가장 적은 · 최소한
low|낮은 · 낮게
train|기차 · 훈련하다
actually|실제로 · 사실은
rather|오히려 · 꽤 · 차라리
view|견해 · 경치 · 보다
concern|걱정 · 관심사 · 관련되다
almost|거의
whole|전체의 · 온전한
yet|아직 · 벌써 · 하지만
rate|비율 · 속도 · 요금
sort|종류 · 분류하다
ever|언젠가 · 지금까지 · 언제라도
cause|원인 · 일으키다
deal|거래 · 다루다
soon|곧 · 머지않아
base|기초 · 기반 · 근거를 두다
past|과거 · 지난 · ~을 지나서
test|시험 · 검사 · 시험하다
visit|방문하다 · 방문
nothing|아무것도 ~않다 · 아무것도 없음
matter|문제 · 일 · 중요하다 · 물질
record|기록 · 기록하다
stay|머무르다 · 계속 ~한 상태이다
bit|조금 · 작은 조각
figure|숫자 · 인물 · 모습
subject|주제 · 과목 · 대상
class|수업 · 학급 · 계층
minute|분 · 60초
either|둘 중 하나 · 어느 쪽이든
per|~마다 · ~당
top|맨 위 · 꼭대기 · 최고의
among|~사이에 · ~중에서
note|메모 · 주의 · 적어 두다 · 음표
moment|순간 · 잠깐
sale|판매 · 할인 판매
further|더 먼 · 추가의 · 더
toward|~쪽으로 · ~을 향하여
everything|모든 것
staff|직원 · 직원들
decision|결정 · 판단
forward|앞으로 · 앞쪽의
rise|오르다 · 상승하다
girl|여자아이 · 소녀
container|용기 · 컨테이너
they|그들 · 그것들
by|~에 의해 · ~옆에 · ~까지
as|~로서 · ~처럼 · ~할 때
just|단지 · 막 · 바로
then|그때 · 그러면 · 그다음에
way|방법 · 길
over|~위에 · ~을 넘어 · 끝난
most|가장 많은 · 대부분의 · 가장
back|뒤 · 등 · 돌아와서
last|마지막의 · 지난 · 지속되다
too|또한 · 너무
lot|많음 · 많은 양
kind|종류 · 친절한
since|~이후로 · ~이므로
order|순서 · 주문 · 주문하다
issue|문제 · 쟁점 · 발행하다
close|닫다 · 가까운
spend|돈을 쓰다 · 시간을 보내다
hard|어려운 · 단단한 · 열심히
care|돌봄 · 신경 쓰다
watch|보다 · 지켜보다 · 손목시계
return|돌아오다 · 돌려주다 · 반환
share|공유하다 · 나누다
break|깨뜨리다 · 쉬는 시간
free|자유로운 · 무료의
account|계정 · 계좌 · 설명
above|~위에 · ~보다 높은
bear|곰 · 견디다
action|행동 · 조치 · 동작
step|걸음 · 단계
`);

enCorrections.traditional = {meaning:'전통적인',reading:'/trəˈdɪʃənəl/',hint:'트러디셔널',hintAuto:false};
enCorrections.container = {...enCorrections.container,reading:'/kənˈteɪnər/',hint:'컨테이너',hintAuto:false};

export const conversation = {
  ja: new Set('こんにちは|ありがとう|すみません|お願いします|はい|いいえ|おはよう|こんばんは|さようなら|またね|ごめんなさい|大丈夫|わかる|わからない|ください|どこ|何|誰|いつ|どうして|どう|いくら|おいしい|好き|いい|行く|来る|欲しい|待つ|会う|水|ご飯|お茶|コーヒー|駅|ホテル|トイレ|少し|一緒に|ゆっくり|もう一度|助けて|予約|お会計|好きです|お疲れさま|いただきます|ごちそうさま'.split('|')),
  en: new Set('hello|thank you|please|sorry|yes|no|excuse me|goodbye|good|what|who|where|when|why|how|want|need|like|know|understand|speak|listen|hear|buy|pay|help|wait|meet|can|would|should|today|tomorrow|name|food|water|coffee|price|station|hotel|restroom|slowly|again|question|answer|problem'.split('|')),
};
