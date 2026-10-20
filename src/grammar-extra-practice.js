import { choice as q } from './grammar-data.js';

// Extra situations for the original course. Appended after its stable question IDs.
export default {
  'word-order': q('서울에 산다고 답해요.', [
    ['I live in Seoul.', 'I(나는) → live(살아요) → in Seoul(서울에) 순서예요. 장소는 행동 뒤에 붙여요.'],
    ['I in Seoul live.', '한국어 순서를 그대로 옮겼어요. 기본 어순에서는 live를 I 뒤에, in Seoul을 그 뒤에 놓아요.'],
    ['Seoul lives in me.', '주인공이 Seoul로 바뀌어 ‘서울이 내 안에 산다’는 시적인 다른 뜻이 돼요. 내 거주지를 말하려면 I live in Seoul.이에요.'],
  ], 0, ['Where do you live?', '어디에 살아요?']),
  be: q('집에 있다고 알려 줘요.', [
    ["I'm at home.", 'I’m은 I am이에요. 장소 at home을 am 뒤에 붙여 지금 있는 곳을 알려 줘요.'],
    ['I at home.', '기본 문장에서는 I와 장소 사이에 am이 필요해요. 채팅의 짧은 At home.과 완전한 문장을 구분해요.'],
    ['I are at home.', 'I에 맞는 be동사는 are가 아니라 am이에요.'],
  ], 0, ['Where are you now?', '지금 어디예요?']),
  'be-question': q('아직 준비되지 않았다고 답해요.', [
    ["No, I'm not ready yet.", '상태를 부정하려면 am 뒤에 not을 넣어요. yet은 여기서 ‘아직’이에요.'],
    ["No, I don't ready yet.", 'ready는 동작이 아니라 상태예요. don’t 대신 am not으로 연결해요.'],
    ["No, I'm ready yet.", 'not이 빠져 준비되지 않았다는 뜻이 전달되지 않아요. I’m not ready yet.이라고 해요.'],
  ], 0, ['Are you ready?', '준비됐어요?']),
  present: q('친구가 매일 영어를 공부한다고 소개해요.', [
    ['She studies English every day.', 'She가 주인공인 현재 긍정문에서는 study가 studies로 바뀌어요. every day는 매일이에요.'],
    ['She study English every day.', 'She와 현재 습관을 말하므로 study에 맞는 형태 studies를 써요.'],
    ['She is study English every day.', 'study로 습관을 말할 때 is를 덧붙이지 않아요. She studies…로 말해요.'],
  ], 0, ['What does your friend do every day?', '친구는 매일 뭘 해요?']),
  negative: q('고기를 먹지 않는다고 알려 줘요.', [
    ["I don't eat meat.", 'I의 평소 행동을 부정할 때 don’t + 원형 eat을 써요. meat는 고기예요.'],
    ["I am not eat meat.", 'eat라는 행동을 부정하므로 am not이 아니라 don’t를 써요.'],
    ["I doesn't eat meat.", 'I에는 don’t를 써요. doesn’t는 he / she / it 같은 주인공에 써요.'],
  ], 0, ['Do you eat meat?', '고기 먹어요?']),
  'do-question': q('상대도 게임을 하는지 물어봐요.', [
    ['Do you play games too?', 'Do → you → play → games 순서로 행동을 물어요. too는 ‘너도’라는 뜻을 더해요.'],
    ['Are you play games too?', '평소 play하는지 묻는 질문에는 Are 대신 Do를 써요.'],
    ['Do play you games too?', 'Do 다음에는 행동의 주인공 you, 그 뒤에 play를 놓아요.'],
  ], 0, ['I like online games.', '난 온라인 게임을 좋아해요.']),
  'wh-question': q('친구가 어떤 음악을 좋아하는지 물어요.', [
    ['What music do you like?', '궁금한 대상 What music을 먼저, 그다음 do → you → like 순서예요.'],
    ['What music you like?', '기본 질문을 완성하려면 you 앞에 질문을 돕는 do가 필요해요.'],
    ['What do music you like?', 'What music(어떤 음악)을 한 덩어리로 두고 그 뒤에 do you like를 붙여요.'],
  ], 0, ['I listen to music a lot.', '음악을 많이 들어요.']),
  nouns: q('처음 소개하는 고양이가 한 마리 있다고 답해요.', [
    ['I have a cat.', '처음 소개하는 셀 수 있는 한 마리이므로 a cat이라고 해요.'],
    ['I have cat.', '고양이 한 마리를 뜻하는 단수 cat 앞에는 여기서 a가 필요해요.'],
    ['I have an cat.', 'cat은 자음 소리 /k/로 시작하므로 an이 아니라 a를 써요.'],
  ], 0, ['Do you have a pet?', '반려동물이 있어요?']),
  pronouns: q('사진을 나에게 보내 달라고 부탁해요.', [
    ['Please send it to me.', 'it은 그 사진, to me는 나에게예요. to 뒤에는 I가 아니라 me를 써요.'],
    ['Please send it to I.', 'I는 주인공 자리의 모양이에요. to 뒤에서 받는 사람은 me라고 해요.'],
    ['Please send it to my.', 'my는 my phone처럼 명사 앞에서 ‘내’를 뜻해요. 여기서 나에게는 to me예요.'],
  ], 0, ['I took a photo of us!', '우리 사진 찍었어요!']),
  can: q('내가 도와줄 수 있다고 말해요.', [
    ['I can help you.', 'I → can → help → you 순서예요. can 뒤에 help를 원형 그대로 써요.'],
    ['I can to help you.', 'can 뒤에는 to 없이 help를 바로 써요.'],
    ['I can helping you.', 'can 뒤에는 helping이 아니라 기본 모양 help가 와요.'],
  ], 0, ["I don't understand this word.", '이 단어를 모르겠어요.']),
  'to-infinitive': q('만나서 반갑다고 인사해요.', [
    ["I'm happy to meet you.", 'happy 뒤에 to meet you를 붙여 ‘너를 만나서 기쁘다’고 이유를 덧붙였어요.'],
    ["I'm happy meet you.", 'happy와 행동 meet을 연결할 to가 필요해요.'],
    ["I'm happy to meeting you.", '이 to부정사의 to 뒤에는 meeting이 아니라 원형 meet을 써요.'],
  ], 0, ["Hi! I'm Alex. Nice to meet you.", '안녕! 알렉스예요. 만나서 반가워요.']),
  ing: q('요리하는 것을 즐긴다고 답해요.', [
    ['I enjoy cooking.', 'enjoy 뒤에 활동을 붙일 때는 cooking처럼 -ing를 써요.'],
    ['I enjoy to cook.', 'enjoy는 활동을 이을 때 to cook이 아니라 cooking을 써요.'],
    ['I enjoy cook.', 'enjoy 뒤에 원형 cook을 바로 놓지 않고 cooking으로 바꿔요.'],
  ], 0, ['What do you enjoy doing?', '어떤 활동을 즐겨요?']),
  continuous: q('지금 버스를 기다리는 중이라고 답해요.', [
    ["I'm waiting for the bus.", 'I am + waiting으로 지금 기다리는 중임을 말해요. wait for는 ‘~을 기다리다’라는 덩어리예요.'],
    ['I waiting for the bus.', 'waiting과 함께 진행형을 만드는 am이 빠졌어요.'],
    ["I'm wait for the bus.", 'am 뒤에는 원형 wait가 아니라 waiting을 써요.'],
  ], 0, ['What are you doing?', '뭐 하고 있어요?']),
  past: q('어젯밤 일찍 잠자리에 들었다고 답해요.', [
    ['I went to bed early.', '이미 끝난 일을 말하므로 go의 과거형 went를 써요. go to bed는 잠자리에 들다는 뜻이에요.'],
    ['I go to bed early.', '평소 습관에는 가능한 문장이지만 어젯밤 일을 말하는 여기서는 went로 바꿔요.'],
    ['I did went to bed early.', '강조하려고 did를 쓰더라도 뒤에는 원형 go예요. went와 함께 쓰지 않아요.'],
  ], 0, ['What did you do last night?', '어젯밤에 뭐 했어요?']),
  plans: q('나중에 사진을 보내겠다고 약속해요.', [
    ["I'll send you a photo later.", 'I’ll은 I will이에요. will 뒤에는 send를 원형 그대로 써요.'],
    ["I'll to send you a photo later.", 'will 뒤에는 to를 더하지 않아요. I’ll send…로 시작해요.'],
    ["I'll sent you a photo later.", 'sent는 send의 과거형·과거분사예요. 여기서는 will 뒤의 원형 send가 필요해요.'],
  ], 0, ['Can I see a photo?', '사진 볼 수 있어요?']),
  time: q('일요일에 만나자고 답해요.', [
    ["Let's meet on Sunday.", '요일 Sunday 앞에는 on을 써요. on Sunday를 한 덩어리로 익혀요.'],
    ["Let's meet at Sunday.", 'at은 at six 같은 시각에 써요. 요일 Sunday에는 on이에요.'],
    ["Let's meet in Sunday.", 'in은 월·연도 등에 써요. 일요일이라는 요일에는 on을 써요.'],
  ], 0, ['When should we meet?', '우리 언제 만날까요?']),
  connectors: q('피곤해서 집에 있고 싶다고 이유까지 답해요.', [
    ["I want to stay home because I'm tired.", '하고 싶은 일 뒤에 because + I’m tired로 이유를 연결했어요.'],
    ['I want to stay home because tired.', '기본 문장에서는 because 뒤에 주인공과 상태를 잇는 I’m을 넣어요.'],
    ["I want to stay home because I'm tire.", '피곤한 상태는 tired예요. tire는 여기서 필요한 상태 표현이 아니에요.'],
  ], 0, ['Why do you want to stay home?', '왜 집에 있고 싶어요?']),
  invitations: q('오늘은 어렵지만 내일 만나자는 대안을 줘요.', [
    ["I'm busy today. How about tomorrow?", '오늘의 사정을 알려 주고 내일이라는 대안을 물었어요. How about 뒤에 tomorrow를 바로 붙일 수 있어요.'],
    ["I'm busy today.", '문법은 맞고 사정도 전해져요. 다만 이 문제의 목표인 ‘내일 만나자는 대안’은 아직 없어요.'],
    ['How tomorrow you?', '내일을 제안하려면 How about tomorrow?를 써요. 이 단어 배열만으로는 제안이 전달되지 않아요.'],
  ], 0, ['Would you like to meet today?', '오늘 만날래요?']),
};
