// Original Korean explanations and exercises. References check the grammar;
// examples are authored for Moru's beginner conversation course.
export const grammarSources = {
  be: ['British Council · be동사', 'https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/present-simple-be'],
  present: ['British Council · 현재형', 'https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/present-simple'],
  questions: ['British Council · 질문의 어순', 'https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/question-forms'],
  infinitive: ['British Council · 동사 뒤의 -ing / to', 'https://learnenglishteens.britishcouncil.org/grammar/a1-a2-grammar/verb-ing-or-verb-infinitive'],
  continuous: ['British Council · 현재진행형', 'https://learnenglishteens.britishcouncil.org/grammar/a1-a2-grammar/present-continuous'],
  past: ['British Council · 과거형', 'https://learnenglishteens.britishcouncil.org/grammar/a1-a2-grammar/past-simple-irregular-verbs'],
  basics: ['British Council · 기초 문법 안내', 'https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2'],
  future: ['British Council · 미래 표현', 'https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/talking-about-future'],
  time: ['British Council · 시간의 at / in / on', 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar/prepositions-of-time-at-in-on'],
  connectors: ['British Council · 문장 연결하기', 'https://learnenglishteens.britishcouncil.org/grammar/a1-a2-grammar/conjunctions-or-so-because-although'],
  invitations: ['British Council · 제안과 초대', 'https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/requests-offers-invitations'],
  nouns: ['British Council · a / an / the', 'https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2-grammar/articles-a-an-the'],
  pronouns: ['British Council · I / me / my', 'https://learnenglishteens.britishcouncil.org/grammar/a1-a2-grammar/personal-pronouns-possessives'],
  can: ['British Council · can / can’t', 'https://learnenglishkids.britishcouncil.org/grammar-vocabulary/grammar-practice/modals-can-cant'],
};

export const grammarGroups = ['말의 순서부터', '내 일상 말하기', '질문하고 소개하기', '하고 싶은 일', '시간을 바꿔 말하기', '친구와 약속 잡기'];
const chunk = (en, ko, role, why) => ({ en, ko, role, why });
const example = (en, ko, situation) => ({ en, ko, situation });
const mistake = (wrong, right, why) => ({ wrong, right, why });
// Each option has its own explanation, including the correct choice.
const choice = (prompt, options, correct = 0, chat = null) => ({ type: 'choice', prompt, options: options.map(([text, why], i) => ({ text, why, correct: i === correct })), chat });
const order = (prompt, chunks, punctuation = '.', alternatives = []) => ({ type: 'order', prompt, chunks, punctuation, alternatives });

const lessons = [
  {
    id: 'word-order', title: '영어는 누구부터 말할까요?', term: '기본 어순', goal: '내가 좋아하는 것을 한 문장으로 말해요.', group: 0,
    intro: '어순은 단어를 놓는 순서예요. 한국어를 한 단어씩 영어로 바꾸기 전에, 말할 내용을 작은 덩어리로 나눠 봐요.',
    rules: [
      ['누가?', '먼저 이야기의 주인공을 말해요. 나 = I, 너 = you예요. 문법책에서는 이 자리를 ‘주어’라고 불러요.'],
      ['무엇을 한다?', '그다음 행동을 말해요. like는 ‘좋아하다’, watch는 ‘보다’예요. 이런 말을 ‘동사’라고 해요.'],
      ['무엇을?', '그 행동의 대상을 뒤에 붙여요. I like music.은 ‘나는 / 좋아해 / 음악을’ 순서예요. 질문이나 상태를 말하는 문장은 뒤 수업에서 따로 배워요.'],
    ],
    koOrder: ['나는', '음악을', '좋아해요'],
    chunks: [chunk('I', '나는', '누가', '이야기의 주인공 I를 먼저 말해요.'), chunk('like', '좋아해요', '행동', '영어에서는 무엇을 좋아하는지 말하기 전에 like를 놓아요.'), chunk('music', '음악을', '무엇을', '좋아하는 대상 music은 like 뒤예요.')],
    note: '한국어의 ‘을/를’을 따로 번역하지 않아요. 여기서는 단어의 자리가 역할을 알려줘요.',
    examples: [example('I watch movies.', '나는 영화를 봐요.', '취미 소개'), example('We play games.', '우리는 게임을 해요.', '친구와 하는 일')],
    mistakes: [mistake('I music like.', 'I like music.', '한국어 순서를 그대로 옮겼어요. 영어에서 like의 대상 music은 like 뒤에 놓아요.'), mistake('Like music.', 'I like music.', '채팅에서는 말을 줄이기도 하지만, ‘내가 좋아한다’는 기본 문장을 연습할 때는 I를 넣어 주인공을 알려줘요.')],
    questions: [
      choice('“나는 커피를 좋아해요.”에 맞는 기본 문장은?', [['I like coffee.', 'I(나는) → like(좋아해요) → coffee(커피를) 순서예요.'], ['I coffee like.', 'coffee가 행동인 like보다 먼저 왔어요. I like coffee. 순서로 말해요.'], ['Coffee likes me.', '문장 구조는 가능하지만 ‘커피가 나를 좋아해요’라는 다른 뜻이 돼요. 주인공을 I로 시작해요.']]),
      order('“우리는 영화를 봐요.”를 만들어요.', [chunk('We', '우리는', '누가', '보는 사람 We를 먼저 놓아요.'), chunk('watch', '봐요', '행동', '무엇을 보는지 말하기 전에 watch를 놓아요.'), chunk('movies', '영화를', '무엇을', '보는 대상 movies는 watch 뒤에 와요.')]),
      choice('내 취미가 게임이라고 답해 보세요.', [['I play games.', '내가 하는 활동을 I → play → games 순서로 말했어요.'], ['I games play.', 'games를 play 뒤로 보내요. 한국어의 ‘게임을 해요’와 순서가 달라요.'], ['Games play I.', '주인공 I가 맨 뒤에 있어요. I play games.로 시작해요.']], 0, ['What do you do for fun?', '뭐 하면서 즐거운 시간을 보내요?']),
    ], sources: ['present'],
  },
  {
    id: 'be', title: '나는 학생이에요. 지금 피곤해요.', term: 'be동사 · am / is / are', goal: '내 소개와 지금 상태를 말해요.', group: 0,
    intro: '‘학생이다’, ‘피곤하다’, ‘집에 있다’처럼 누구인지, 어떤 상태인지, 어디 있는지 말할 때 be동사를 써요. 현재형에서는 am, is, are로 모양이 바뀌어요.',
    rules: [
      ['I에는 am', 'I am tired. = 나는 피곤해요. I am은 채팅에서 I’m으로 줄일 수 있어요.'],
      ['한 사람·한 사물에는 is', 'he(그), she(그녀), it(그것), Mina 같은 한 사람 이름에는 is를 써요. She is busy. = 그녀는 바빠요.'],
      ['you / we / they에는 are', 'you(너/여러분), we(우리), they(그들)에는 are를 써요. 너 한 명에게 말해도 You are예요. 모든 동사 앞에 be를 붙이는 것은 아니에요.'],
    ],
    koOrder: ['나는', '피곤해요'],
    chunks: [chunk('I', '나는', '누가', '상태의 주인공 I가 먼저예요.'), chunk('am', '~인 상태예요', '연결', 'I의 현재 상태를 연결할 때 am을 써요.'), chunk('tired', '피곤한', '어떤 상태', 'tired는 행동이 아닌 상태를 나타내므로 am 뒤에 와요.')],
    note: 'be를 항상 ‘이다’ 한 단어로 해석하지 않아도 돼요. I am here.는 ‘나는 여기 있어요’예요.',
    examples: [example("I'm a student.", '나는 학생이에요.', '처음 인사할 때'), example("We're at home.", '우리는 집에 있어요.', '지금 있는 곳')],
    mistakes: [mistake('I tired.', 'I am tired.', 'tired는 ‘피곤한’이라는 상태예요. 기본 문장에는 I와 tired를 잇는 am이 필요해요.'), mistake('You is kind.', 'You are kind.', 'you 뒤에는 상대가 한 명이어도 are를 써요. kind는 ‘친절한’이라는 뜻이에요.')],
    questions: [
      choice('“나는 학생이에요.”를 골라요.', [['I am a student.', 'I에는 am을 써요. a student는 ‘학생 한 명’이라는 소개예요.'], ['I is a student.', 'is는 he, she, it 등에 써요. I에는 am이 맞아요.'], ['I a student.', 'I와 a student를 연결할 am이 빠졌어요.']]),
      order('“너는 친절해요.”를 만들어요.', [chunk('You', '너는', '누가', '말을 듣는 사람 You를 먼저 써요.'), chunk('are', '~예요', '연결', 'You의 짝은 are예요.'), chunk('kind', '친절한', '어떤 상태', '성질을 나타내는 kind를 are 뒤에 놓아요.')]),
      choice('지금 피곤하다고 답해 보세요.', [["I'm tired.", 'I’m은 I am을 줄인 말이에요. 내 상태를 자연스럽게 답했어요.'], ["I'm tire.", 'tire는 동사 등으로 쓰여요. ‘피곤한 상태’라는 뜻에는 tired를 써요.'], ["I'm like tired.", '이 기본 문장에서는 like가 필요 없어요. I’m tired.로 상태를 바로 말해요.']], 0, ['How are you?', '기분이 어때요?']),
    ], sources: ['be'],
  },
  {
    id: 'be-question', title: '지금 시간 괜찮아요?', term: 'be동사의 질문·부정', goal: '상대의 상태를 묻고 아니라고 답해요.', group: 0,
    intro: '상태를 묻는 기본 질문에서는 am / is / are를 주인공 앞으로 옮겨요. ‘아니다’라고 말할 때는 그 뒤에 not을 붙여요.',
    rules: [['질문은 자리 바꾸기', 'You are free. → Are you free? free는 여기서 ‘시간이 있는’이라는 뜻이에요.'], ['아니라고 말하려면 not', 'I am not busy. = 나는 바쁘지 않아요. are not은 aren’t, is not은 isn’t로 줄일 수 있어요.'], ['짧게 답하기', 'Are you ready?에 Yes, I am. / No, I’m not.으로 답할 수 있어요. Yes, I’m.처럼 am만 문장 끝에 남는 긍정 답은 줄이지 않아요.']],
    koOrder: ['너', '시간 괜찮아?'],
    chunks: [chunk('Are', '~인가요?', '질문 시작', '상태를 묻는 be동사 Are가 맨 앞으로 와요.'), chunk('you', '너는', '누가', '묻는 대상 you를 Are 뒤에 놓아요.'), chunk('free', '시간이 있는', '어떤 상태', '물어볼 상태 free를 마지막에 놓아요.')], punctuation: '?',
    note: 'be동사로 상태를 묻는 이 질문에는 do를 덧붙이지 않아요.',
    examples: [example('Are you ready?', '준비됐어요?', '같이 게임을 시작하기 전'), example("I'm not busy.", '나 바쁘지 않아요.', '대화할 수 있다고 알릴 때')],
    mistakes: [mistake('Do you are free?', 'Are you free?', 'are가 이미 질문을 만들어요. do와 are를 함께 쓰지 않아요.'), mistake('I not am busy.', 'I am not busy.', 'not은 am 바로 뒤에 놓아요. I → am → not → busy 순서예요.')],
    questions: [
      choice('“너는 준비됐니?”라는 기본 질문은?', [['Are you ready?', 'are를 you 앞으로 옮겨 질문을 만들었어요.'], ['Do you ready?', 'ready는 ‘준비된’이라는 상태예요. 여기서는 do 대신 are가 필요해요.'], ['Are ready you?', 'Are 다음에는 묻는 대상 you, 그다음 상태 ready를 놓아요.']]),
      order('“나는 바쁘지 않아요.”를 만들어요.', [chunk('I', '나는', '누가', '주인공 I부터 시작해요.'), chunk('am', '~예요', '연결', 'I에는 am을 써요.'), chunk('not', '~아닌', '아니라고', 'not은 am 뒤에 와요.'), chunk('busy', '바쁜', '어떤 상태', '부정할 상태 busy를 마지막에 놓아요.')]),
      choice('시간이 괜찮다고 짧게 답해요.', [['Yes, I am.', 'Are you…?에 나의 상태로 답하므로 I am을 써요.'], ['Yes, I do.', 'I do는 Do you…? 같은 행동 질문에 쓰는 답이에요. 여기서는 I am이에요.'], ["Yes, I'm.", '긍정 짧은 답의 마지막 am은 I’m으로 줄이지 않아요. Yes, I am.이라고 해요.']], 0, ['Are you free now?', '지금 시간 괜찮아요?']),
    ], sources: ['be', 'questions'],
  },
  {
    id: 'present', title: '평소에 뭘 하는지 말해요', term: '일반동사 · 현재형', goal: '나와 친구의 일상·취미를 소개해요.', group: 1,
    intro: 'like, play, live처럼 행동이나 사실을 나타내는 말로 평소의 일을 말해요. ‘현재형’은 지금 이 순간뿐 아니라 습관과 일반적인 사실에도 써요.',
    rules: [['I / you / we / they', 'I play games.처럼 사전에서 보는 기본 모양을 써요. 이 모양을 ‘동사원형’이라고 해요.'], ['he / she / it', '현재의 사실을 긍정문으로 말할 때는 보통 -s를 붙여요. She likes music.처럼요.'], ['모양이 달라지는 경우', 'go → goes, watch → watches, study → studies, have → has도 있어요. I am like…처럼 일반동사 앞에 am을 무조건 붙이지 않아요.']],
    koOrder: ['그녀는', '음악을', '좋아해요'],
    chunks: [chunk('She', '그녀는', '누가', '주인공 She를 먼저 말해요.'), chunk('likes', '좋아해요', '행동', 'She의 현재 긍정문이므로 likes를 써요.'), chunk('music', '음악을', '무엇을', '좋아하는 대상은 likes 뒤에 와요.')],
    note: '‘지금 게임 중’은 뒤에서 배우는 I am playing games.로 구분할 수 있어요.',
    examples: [example('I live in Seoul.', '나는 서울에 살아요.', '사는 곳 소개'), example('He plays tennis.', '그는 테니스를 쳐요.', '친구의 취미')],
    mistakes: [mistake('She like music.', 'She likes music.', '현재 긍정문에서 She 뒤의 like에는 -s가 필요해요.'), mistake('I am play games.', 'I play games.', '평소에 게임을 한다는 뜻이라면 play로 충분해요. ‘지금 하는 중’은 am playing이에요.')],
    questions: [
      choice('“그는 커피를 좋아해요.”는?', [['He likes coffee.', 'He의 현재 긍정문이므로 likes예요.'], ['He like coffee.', 'He가 주인공인 현재 긍정문에는 like에 -s를 붙여요.'], ['He is like coffee.', 'is like는 ‘~와 비슷하다’라는 다른 구조예요. 좋아한다는 뜻은 likes예요.']]),
      order('“우리는 서울에 살아요.”를 만들어요.', [chunk('We', '우리는', '누가', '사는 사람 We부터 말해요.'), chunk('live', '살아요', '행동·사실', 'We에는 lives가 아닌 live를 써요.'), chunk('in Seoul', '서울에', '어디에', '사는 곳을 live 뒤에 덧붙여요.')]),
      choice('친구가 테니스를 친다고 소개해요.', [['She plays tennis.', 'She 뒤에 plays를 쓰고, 무엇을 하는지 tennis를 붙여요.'], ['She play tennis.', 'She의 현재 긍정문이므로 plays로 바꿔요.'], ['She is play tennis.', '평소 취미를 말할 때는 is 없이 plays를 써요.']], 0, ['What does your friend do for fun?', '친구는 뭐 하면서 시간을 보내요?']),
    ], sources: ['present'],
  },
  {
    id: 'negative', title: '안 해요, 좋아하지 않아요', term: "don't / doesn't", goal: '취향과 하지 않는 일을 말해요.', group: 1,
    intro: '일반동사로 ‘~하지 않는다’고 말할 때 don’t / doesn’t의 도움을 받아요. not 하나를 동사 앞에 놓는 것과 달라요.',
    rules: [['I / you / we / they는 don’t', 'I don’t drink coffee. = 나는 커피를 마시지 않아요. don’t는 do not을 줄인 말이에요.'], ['he / she / it는 doesn’t', 'She doesn’t eat meat. = 그녀는 고기를 먹지 않아요. doesn’t는 does not이에요.'], ['그 뒤 동사는 기본 모양', 'doesn’t가 이미 주인공에 맞게 바뀌었으니 뒤에는 likes가 아닌 like를 써요. 상태는 I’m not tired.처럼 be + not을 써요.']],
    koOrder: ['나는', '커피를', '마시지 않아요'],
    chunks: [chunk('I', '나는', '누가', '주인공 I가 먼저예요.'), chunk("don't", '~하지 않아요', '아니라고', 'I의 일반동사를 부정할 때 don’t를 써요.'), chunk('drink', '마시다', '행동', 'don’t 뒤에는 동사원형 drink가 와요.'), chunk('coffee', '커피를', '무엇을', '마시지 않는 대상을 drink 뒤에 놓아요.')],
    note: 'don’t / doesn’t는 상태 표현에 무조건 붙이는 말이 아니에요. I don’t tired. 대신 I’m not tired.예요.',
    examples: [example("I don't eat meat.", '나는 고기를 먹지 않아요.', '식사 취향'), example("He doesn't play games.", '그는 게임을 하지 않아요.', '친구 소개')],
    mistakes: [mistake('I not like coffee.', "I don't like coffee.", 'like라는 일반동사를 부정할 때는 I 뒤에 don’t를 넣어요.'), mistake("She doesn't likes coffee.", "She doesn't like coffee.", 'doesn’t 뒤의 동사에는 -s를 다시 붙이지 않아요.')],
    questions: [
      choice('“그녀는 고기를 먹지 않아요.”는?', [["She doesn't eat meat.", 'She에는 doesn’t, 그 뒤에는 원형 eat을 써요.'], ["She don't eat meat.", 'She가 주인공이므로 don’t가 아니라 doesn’t예요.'], ["She doesn't eats meat.", 'doesn’t 뒤에는 eats가 아니라 eat이 와요.']]),
      order('“나는 차를 마시지 않아요.”를 만들어요.', [chunk('I', '나는', '누가', '주인공 I부터 말해요.'), chunk("don't", '~하지 않아요', '아니라고', '일반동사의 부정은 I 다음 don’t로 시작해요.'), chunk('drink', '마시다', '행동', 'don’t 뒤에는 drink예요.'), chunk('tea', '차를', '무엇을', '마시지 않는 대상 tea를 뒤에 놓아요.')]),
      choice('커피를 안 마신다고 답해요.', [["No, I don't drink coffee.", 'don’t 뒤에 drink를 넣어 하지 않는 일을 말했어요.'], ["No, I'm not drink coffee.", 'am not 뒤에 동사원형 drink를 붙이지 않아요. 평소 안 마신다는 뜻은 don’t drink예요.'], ["No, I doesn't drink coffee.", 'I에는 doesn’t가 아닌 don’t를 써요.']], 0, ['Do you drink coffee?', '커피 마셔요?']),
    ], sources: ['present'],
  },
  {
    id: 'do-question', title: '너도 그거 좋아해요?', term: 'Do / Does로 질문하기', goal: '상대의 취향을 묻고 대화를 이어가요.', group: 1,
    intro: 'like, play, live처럼 일반동사로 묻는 현재형 질문은 Do / Does를 앞에 세워요.',
    rules: [['Do → 누가 → 동사', 'Do you like movies? = 너는 영화를 좋아하니? you를 빼지 않고 do와 like 사이에 놓아요.'], ['한 사람 he / she / it에는 Does', 'Does she play tennis?처럼 Does 뒤에는 주인공, 그다음 동사원형을 놓아요.'], ['답도 do / does로', 'Do you…?에는 Yes, I do. / No, I don’t.으로 답해요. be동사의 Are you…?와 구분해요.']],
    koOrder: ['너는', '영화를', '좋아하니?'],
    chunks: [chunk('Do', '~하나요?', '질문 시작', '일반동사 like의 현재 질문을 Do로 시작해요.'), chunk('you', '너는', '누가', '질문의 대상 you는 Do 다음이에요.'), chunk('like', '좋아하다', '행동', 'Do you 뒤에는 원형 like를 써요.'), chunk('movies', '영화를', '무엇을', '좋아하는 대상을 마지막에 말해요.')], punctuation: '?',
    note: 'Do you like…? 뒤에 음악·음식·게임을 넣어 여러 질문으로 바꿀 수 있어요.',
    examples: [example('Do you play games?', '게임 해요?', '공통 취미 찾기'), example('Does he live here?', '그는 여기에 살아요?', '친구에 관해 묻기')],
    mistakes: [mistake('Are you like movies?', 'Do you like movies?', '‘좋아하다’는 일반동사 like예요. 현재 취향을 묻는 질문에는 Do를 써요.'), mistake('Does she likes music?', 'Does she like music?', 'Does가 이미 주인공에 맞게 바뀌었어요. 뒤의 like에는 -s를 붙이지 않아요.')],
    questions: [
      choice('“그녀는 게임을 해요?”는?', [['Does she play games?', 'Does → she → play → games 순서예요.'], ['Does she plays games?', 'Does 뒤에는 동사원형 play를 써요.'], ['Do she play games?', 'she에 대해 묻는 현재 질문은 Does로 시작해요.']]),
      order('“너는 차를 좋아하니?”를 만들어요.', [chunk('Do', '~하나요?', '질문 시작', '현재의 취향 질문은 Do부터예요.'), chunk('you', '너는', '누가', 'Do 다음에 상대 you를 넣어요.'), chunk('like', '좋아하다', '행동', 'you 뒤에 원형 like를 놓아요.'), chunk('tea', '차를', '무엇을', '좋아하는 대상 tea를 뒤에 놓아요.')], '?'),
      choice('영화를 좋아한다고 짧게 답해요.', [['Yes, I do.', 'Do you…? 질문을 받아 I do로 답해요.'], ['Yes, I am.', 'I am은 Are you…? 같은 상태 질문에 어울려요. 지금은 Do you like…?예요.'], ['Yes, I does.', 'I의 짝은 does가 아니라 do예요.']], 0, ['Do you like movies?', '영화 좋아해요?']),
    ], sources: ['present', 'questions'],
  },
];

export { chunk, example, mistake, choice, order };
export default lessons;
