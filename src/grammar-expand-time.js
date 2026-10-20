import { chunk as c, example as e, mistake as m, choice as q, order as o } from './grammar-data.js';
import { expandLesson } from './grammar-expansion.js';

export default [
  {
    id:'perfect-experience', group:8, title:'해 본 적 있는 일을 이야기해요', term:'현재완료 · have / has + 과거분사', goal:'여행·음식·취미 경험을 묻고 답해요.',
    intro:'정확히 언제보다 ‘지금까지 해 본 경험이 있나?’가 중요할 때 현재완료를 써요. have / has 뒤에 eaten, seen, tried 같은 과거분사를 붙여요.',
    rules:[['과거분사는 동사의 또 다른 모양','eat → ate(과거) → eaten(과거분사), see → saw → seen이에요. try → tried → tried처럼 두 모양이 같기도 해요.'],['나·너·우리에는 have, 그·그녀에는 has','I have tried sushi. = 초밥을 먹어 본 적 있어요. She has tried sushi.처럼 주인공에 맞춰요.'],['경험 질문과 아직 없는 경험','Have you ever tried sushi? / I have never tried sushi.처럼 써요. ever는 경험이 있는지, never는 한 번도 없음을 나타내요.']],
    koOrder:['나는','초밥을','먹어 본 적 있어요'],
    chunks:[c('I','나는','누가','경험한 사람부터 말해요.'),c('have','지금까지의 경험','시간 연결','I에 have를 붙여요.'),c('tried','먹어 봤다','경험한 행동','여기서 try는 음식 등을 시도해 본다는 뜻이에요.'),c('sushi','초밥을','무엇','경험한 대상을 붙여요.')],
    note:'‘어제 먹었다’처럼 끝난 때를 딱 집어 말하면 I tried sushi yesterday.라는 과거형이 기본이에요.',
    examples:[e('Have you ever been to Japan?','일본에 가 본 적 있어요?','여행 경험'),e("I've never played tennis.",'테니스는 한 번도 쳐 본 적 없어요.','취미 경험')],
    mistakes:[m('I have saw that movie.','I have seen that movie.','have 뒤에는 과거 saw가 아니라 과거분사 seen이에요.'),m('She have tried sushi.','She has tried sushi.','She의 현재완료에는 has를 써요.')],
    questions:[
      q('have 뒤에 들어갈 올바른 모양은? “I have ___ that movie.”',[['seen','see의 과거분사 seen이 필요해요.'],['saw','saw는 과거형이에요. have 뒤에는 seen이에요.'],['see','현재완료의 have 뒤에는 기본형이 아닌 과거분사가 와요.']]),
      o('“그녀는 일본에 가 본 적 있어요.”를 만들어요.',[c('She','그녀는','누가','경험한 주인공이에요.'),c('has','지금까지의 경험','시간 연결','She와 has가 짝이에요.'),c('been to','가 본 적 있다','경험','이 표현에서는 been to를 써요.'),c('Japan','일본에','어디','방문한 곳을 붙여요.')]),
      q('테니스를 한 번도 해 본 적 없다고 답해요.',[["No, I've never played tennis.",'I’ve는 I have예요. never로 경험이 전혀 없다고 답했어요.'],["No, I've never play tennis.",'have 뒤에 play의 과거분사 played를 써요.'],["No, I haven't never played tennis.",'표준 영어에서 이 뜻은 I have never 또는 I haven’t ever로 말해요. 부정을 겹치지 않아요.']],0,['Have you ever played tennis?','테니스 쳐 본 적 있어요?'])
    ], sources:['perfect'],
  },
  {
    id:'perfect-duration', group:8, title:'언제부터, 얼마나 오래 했어요?', term:'for / since · 현재완료진행', goal:'지금까지 이어지는 생활과 공부를 이야기해요.',
    intro:'‘2년 전에 시작했고 지금도 산다’처럼 과거와 지금이 이어질 때 have lived를 써요. 기간의 길이는 for, 시작점은 since로 붙여요.',
    rules:[['for는 얼마나 길게','for two years = 2년 동안, for an hour = 한 시간 동안이에요. I have lived here for two years.는 지금도 여기 사는 맥락이에요.'],['since는 언제부터','since 2024 = 2024년부터, since Monday = 월요일부터예요. 기간과 시작점을 바꿔 쓰지 않아요.'],['계속 하는 활동을 강조하기','I have been learning English for a year.처럼 have + been + -ing로 계속 배우는 활동을 강조해요. know처럼 상태를 나타내는 말은 보통 have known을 써요.']],
    koOrder:['나는','여기서','2년 동안','살고 있어요'],
    chunks:[c('I','나는','누가','사는 사람 I예요.'),c('have lived','계속 살아 왔어요','이어지는 상태','지금까지 이어지는 거주를 말해요.'),c('here','여기에','어디','사는 장소예요.'),c('for two years','2년 동안','얼마나 오래','기간의 길이는 for예요.')],
    alternatives:[[3,0,1,2]],
    note:'I lived here for two years.는 끝난 거주 기간을 이야기할 수 있어요. for만 보고 시제를 정하지 말고 지금도 이어지는지 생각해요.',
    examples:[e("I've known Mina since 2020.",'2020년부터 미나를 알고 지냈어요.','친구와의 인연'),e("I've been studying for an hour.",'한 시간째 공부하고 있어요.','계속하는 활동')],
    mistakes:[m('I have lived here since two years.','I have lived here for two years.','two years는 시작 시점이 아니라 기간이므로 for예요.'),m('I have been knowing her for years.','I have known her for years.','이 뜻의 know는 보통 진행형으로 만들지 않고 have known을 써요.')],
    questions:[
      q('“2023년부터 여기 살고 있어요.”는?',[["I've lived here since 2023.",'2023은 시작점이므로 since예요.'],["I've lived here for 2023.",'연도는 기간의 길이가 아니므로 since를 써요.'],["I've lived here since three years.",'three years라는 기간은 for와 함께 써요. 시작 연도 2023과도 다른 정보예요.']]),
      o('“한 시간째 공부하고 있어요.”를 만들어요.',[c('I','나는','누가','공부하는 주인공이에요.'),c('have been','지금까지 계속','시간 연결','현재완료진행의 앞부분이에요.'),c('studying','공부하는','계속한 행동','been 뒤에 -ing를 놓아요.'),c('for an hour','한 시간 동안','기간','길이를 for로 붙여요.')],'.',[[3,0,1,2]]),
      q('지금도 살고 있고, 산 지 2년 됐다고 답해요.',[["I've lived here for two years.",'지금까지 이어진 거주와 기간을 함께 말했어요.'],['I lived here for two years, but I moved away.','문법은 맞지만 이사해서 이제는 살지 않는다는 다른 상황이에요.'],['I live here since two years.','이어진 기간에는 have lived와 for two years를 써요.']],0,['How long have you lived here?','여기 산 지 얼마나 됐어요?'])
    ], sources:['perfect','perfectContinuous'],
  },
  {
    id:'perfect-or-past', group:8, title:'해 봤어? 언제 했어?', term:'현재완료와 과거형 구별', goal:'경험으로 시작해 구체적인 과거 이야기로 이어가요.',
    intro:'Have you seen it?으로 경험을 묻고, Yes. I saw it yesterday.로 언제인지 답할 수 있어요. 한 대화 안에서도 초점에 따라 시제가 바뀌어요.',
    rules:[['경험이나 지금의 결과는 have + 과거분사','I have lost my key.는 열쇠를 잃어버려 지금 없는 상황을 전할 수 있어요.'],['끝난 때를 지정하면 과거형','yesterday, last week, in 2020처럼 끝난 때에는 I saw / I lost처럼 과거형을 써요.'],['완료를 뜻하는 단어도 함께 익히기','already는 이미, yet은 질문·부정에서 아직/벌써라는 뜻으로 자주 써요. 미국 영어에서는 Did you eat yet?처럼 과거형도 흔하므로 모든 과거형을 오답으로 보지 않아요.']],
    koOrder:['나는','그 영화를','어제','봤어요'],
    chunks:[c('I','나는','누가','본 사람을 먼저 말해요.'),c('saw','봤어요','끝난 행동','어제의 일에는 과거형 saw예요.'),c('the movie','그 영화를','무엇','본 대상을 말해요.'),c('yesterday','어제','끝난 때','구체적인 과거 시점을 붙여요.')],
    alternatives:[[3,0,1,2]],
    note:'today나 this week는 말하는 시점과 관점에 따라 아직 진행 중인 기간일 수 있어요. 단어 하나만 보고 기계적으로 시제를 고르지 않아요.',
    examples:[e("I've already eaten.",'이미 먹었어요.','현재 식사 여부'),e('I ate at seven yesterday.','어제 일곱 시에 먹었어요.','지난 식사 시각')],
    mistakes:[m('I have seen it yesterday.','I saw it yesterday.','yesterday로 끝난 과거 시점을 정했으므로 saw를 써요.'),m('When have you seen it yesterday?','When did you see it yesterday?','어제 언제 봤는지 묻는 질문에는 did + 원형 see가 자연스러워요.')],
    questions:[
      q('“지난주에 그 게임을 샀어요.”는?',[['I bought the game last week.','last week라는 끝난 시점을 말하므로 bought예요.'],["I've bought the game last week.",'현재완료에 끝난 때 last week를 이렇게 붙이지 않아요.'],['I buy the game last week.','이미 끝난 일을 말하므로 buy를 bought로 바꿔요.']]),
      o('“언제 그걸 봤어요?”를 만들어요.',[c('When','언제','궁금한 때','시점을 먼저 물어요.'),c('did','과거 질문','질문 도움','지난 일을 did로 물어요.'),c('you','너는','누가','주인공은 did 뒤예요.'),c('see it','그걸 보다','행동과 대상','did 뒤에는 see의 기본 모양이에요.')],'?'),
      q('봤다고 한 뒤, 본 때가 어제라고 알려줘요.',[['Yes, I saw it yesterday.','경험 질문에 답하면서 구체적인 때에는 과거형을 썼어요.'],['Yes, I have saw it yesterday.','have 뒤의 saw도, 현재완료와 yesterday를 붙인 것도 고쳐야 해요.'],["Yes, I've seen it yesterday.",'끝난 때 yesterday를 붙일 때는 saw로 말해요.']],0,['Have you seen this movie?','이 영화 본 적 있어요?'])
    ], sources:['perfect','past'],
  },
  {
    id:'past-continuous', group:9, title:'메시지 왔을 때 자고 있었어', term:'과거진행 · was / were + -ing', goal:'그때 하던 일과 중간에 생긴 일을 구분해요.',
    intro:'I was sleeping은 ‘그때 자는 중이었다’는 배경이에요. when you texted me를 붙이면 ‘네가 메시지했을 때’라는 사건이 이어져요.',
    rules:[['그때 하는 중: was / were + -ing','I was cooking. / We were talking.처럼 과거의 진행 중인 모습을 말해요.'],['중간 사건은 과거형으로','I was sleeping when you called.에서 자던 중인 배경은 was sleeping, 전화한 사건은 called예요.'],['while로 동시에 하던 일','While I was cooking, she was studying.처럼 두 활동이 동시에 진행 중이었다고 말할 수 있어요. while 뒤에 항상 진행형만 가능한 것은 아니에요.']],
    koOrder:['네가 메시지했을 때','나는','자고 있었어'],
    chunks:[c('I','나는','누가','배경 행동의 주인공이에요.'),c('was sleeping','자고 있었어','진행 중인 배경','그때 진행 중인 행동을 말해요.'),c('when you texted me','네가 메시지했을 때','그때 생긴 일','과거형 texted로 사건을 붙여요.')],
    alternatives:[[2,0,1]],
    note:'I slept.는 잤다는 일을 전체로 보고, I was sleeping.은 특정 순간 자는 중이었다는 모습을 보여줘요.',
    examples:[e('I was working at eight.','여덟 시에 일하고 있었어요.','지난 시각의 상황'),e('We were chatting when he arrived.','그가 도착했을 때 우리는 이야기 중이었어요.','상황 설명')],
    mistakes:[m('I was sleep when you called.','I was sleeping when you called.','진행 중인 행동은 was 뒤에 sleeping으로 써요.'),m('They was talking.','They were talking.','They에는 과거의 be동사 were가 맞아요.')],
    questions:[
      q('“네가 전화했을 때 요리 중이었어.”는?',[['I was cooking when you called.','진행 중이던 요리와 전화한 사건을 구분했어요.'],['I was cook when you called.','was와 함께 진행을 나타내려면 cooking이에요.'],['I cooking when you called.','과거진행에는 was가 필요해요.']]),
      o('“우리는 게임 중이었어.”를 만들어요.',[c('We','우리는','누가','주인공 We부터예요.'),c('were','그때 ~중','과거 연결','We의 과거 be동사는 were예요.'),c('playing','하고 있는','진행 행동','진행을 나타내는 -ing예요.'),c('a game','게임을','무엇','하던 활동의 대상을 붙여요.')]),
      q('그때 일하는 중이라 답이 늦었다고 해요.',[['Sorry, I was working when you texted me.','메시지가 온 때의 배경을 과거진행으로 설명했어요.'],["Sorry, I'm working tomorrow.",'문법은 가능하지만 내일의 계획이라 답이 늦었던 이유와 달라요.'],['Sorry, I were working when you texted me.','I의 과거진행에는 was를 써요.']],0,['Were you busy earlier?','아까 바빴어요?'])
    ], sources:['pastContinuous'],
  },
  {
    id:'first-conditional', group:9, title:'시간 되면 같이 게임하자', term:'조건문 · if + 현재 / will', goal:'실제로 가능한 조건과 다음 행동을 연결해요.',
    intro:'‘시간이 되면 연락할게’는 조건과 결과 두 덩어리예요. 미래 이야기라도 기본 조건문에서는 if 쪽에 현재 모양을 써요.',
    rules:[['조건은 if + 현재형','If I am free, I will call you.에서 조건은 I am free예요. 기본 연습에서는 if I will be free로 만들지 않아요.'],['결과는 will + 동사원형','조건이 맞으면 할 일을 I will call you로 말해요. can이나 제안을 쓰는 경우도 있어요.'],['항상 그런 일은 현재 + 현재','If I stay up late, I feel tired.는 늦게 자면 피곤하다는 일반적인 관계예요. 이 경우 결과도 현재형이에요.']],
    koOrder:['내가 시간이 되면','너에게','전화할게'],
    chunks:[c('If I am free','내가 시간이 되면','조건','기본 미래 조건에서도 현재형 am을 써요.'),c('I will','나는 ~할게','결과의 주인공','조건이 맞을 때의 행동을 시작해요.'),c('call you','너에게 전화하다','결과 행동','will 뒤에는 원형 call이에요.')],
    alternatives:[[1,2,0]],
    note:'If I am free, I will call you. / I will call you if I am free. 둘 다 가능해요. if 부분이 앞에 오면 보통 쉼표로 구분해요.',
    examples:[e("If it rains, we'll stay home.",'비가 오면 집에 있을 거예요.','약속의 조건'),e("I'll text you when I arrive.",'도착하면 메시지할게요.','미래의 when도 현재형')],
    mistakes:[m('If I will have time, I will call you.','If I have time, I will call you.','지금 연습하는 기본 미래 조건문에서는 if 뒤에 have라는 현재형을 써요.'),m('If she is free, she will calls you.','If she is free, she will call you.','will 뒤에는 주인공이 she여도 call의 기본 모양이에요.')],
    questions:[
      q('“비가 오면 집에 있을 거야.”의 기본 조건문은?',[["If it rains, I'll stay home.",'조건에는 현재형 rains, 결과에는 will을 썼어요.'],["If it rain, I'll stay home.",'it의 현재형에는 rains를 써요.'],["If it rains, I'll stayed home.",'will 뒤에는 과거형 stayed가 아닌 stay예요.']]),
      o('“내가 도착하면 메시지할게.”를 만들어요.',[c('I will','나는 ~할게','결과 시작','할 일을 먼저 말할 수도 있어요.'),c('text you','너에게 메시지하다','결과 행동','will 뒤에 원형 text예요.'),c('when I arrive','내가 도착하면','시점','미래의 시점을 나타내는 when 뒤도 현재형 arrive예요.')],'.',[[2,0,1]]),
      q('시간이 되면 같이 하겠다고 답해요.',[["If I'm free, I'll join you.",'가능한 조건을 붙여 답했어요.'],["If I free, I'll join you.",'free는 상태이므로 I’m 또는 I am이 필요해요.'],["If I'm free, I will to join you.",'will 뒤에는 to 없이 join이에요.']],0,['Want to play tonight?','오늘 밤 같이 게임할래?'])
    ], sources:['conditions'],
  },
  {
    id:'second-conditional', group:9, title:'시간이 더 있다면 좋을 텐데', term:'가정법 · if + 과거 / would', goal:'지금과 다른 상황을 상상하고 조언해요.',
    intro:'지금은 시간이 별로 없지만 ‘시간이 더 있다면 여행할 텐데’라고 상상할 수 있어요. 여기의 과거 모양은 어제라는 뜻보다 현실과의 거리를 나타내요.',
    rules:[['상상하는 조건은 과거 모양','If I had more time… = 시간이 더 있다면…이에요. 이 문맥의 had를 ‘어제 가지고 있었다’로만 읽지 않아요.'],['상상한 결과는 would + 원형','I would travel more. = 여행을 더 할 텐데예요. would 뒤에는 travel의 기본 모양을 써요.'],['내가 너라면','If I were you, I would ask. = 내가 너라면 물어볼 거야. 일상에서 was도 들을 수 있지만 여기서는 널리 쓰는 If I were you를 익혀요.']],
    koOrder:['시간이 더 있다면','나는','여행을 더 할 텐데'],
    chunks:[c('If I had more time','시간이 더 있다면','상상 조건','현재와 다른 조건을 과거 모양 had로 말해요.'),c('I would','나는 ~할 텐데','상상 결과','would로 상상 속 결과를 시작해요.'),c('travel more','여행을 더 하다','행동','would 뒤에는 travel이에요.')],
    alternatives:[[1,2,0]],
    note:'If I have time, I’ll go.는 열어 둔 실제 가능성, If I had time, I’d go.는 현실과 거리를 둔 상상이에요. 화자의 관점에 따라 고를 수 있어요.',
    examples:[e("If I were you, I'd ask her.",'내가 너라면 그녀에게 물어볼 거야.','친구에게 조언'),e("I'd join you if I lived nearby.",'근처에 살면 같이할 텐데.','아쉬움 설명')],
    mistakes:[m('If I had time, I would to go.','If I had time, I would go.','would 뒤에는 to 없이 go를 써요.'),m('If I were you, I would asked.','If I were you, I would ask.','would 뒤에는 과거형 asked가 아닌 원형 ask예요.')],
    questions:[
      q('현재 시간이 부족한 상황을 상상으로 바꿔요. “시간이 더 있다면 더 읽을 텐데.”',[['If I had more time, I would read more.','현실과 다른 조건을 had, 결과를 would read로 연결했어요.'],['If I had more time, I would reading more.','would 뒤에 reading 대신 read를 써요.'],['If I had more time, I would to read more.','would 뒤에는 to가 필요 없어요.']]),
      o('“내가 너라면 물어볼 거야.”를 만들어요.',[c('If I were you','내가 너라면','조언의 조건','상대 입장을 상상해요.'),c('I would','나는 ~할 거야','상상 결과','상상한 행동을 시작해요.'),c('ask','물어보다','행동','would 뒤에는 원형 ask예요.')],'.',[[1,2,0]]),
      q('친구 입장이라면 솔직하게 말하겠다고 조언해요.',[["If I were you, I'd be honest.",'I’d는 여기서 I would예요. would 뒤에 원형 be를 썼어요.'],["If I were you, I'd am honest.",'would 뒤에는 am이 아닌 be예요.'],["If I were you, I'd to be honest.",'would 뒤에 to를 넣지 않아요.']],0,["I don't know what to tell her.",'그녀에게 뭐라고 말해야 할지 모르겠어.'])
    ], sources:['conditions'],
  },
].map(expandLesson);
