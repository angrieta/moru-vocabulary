import { chunk as c, example as e, mistake as m, choice as q, order as o } from './grammar-data.js';
import { expandLesson } from './grammar-expansion.js';

export default [
  {
    id:'advice-obligation', group:10, title:'하면 좋아요? 꼭 해야 해요?', term:'should / must / have to', goal:'조언·의무·금지·불필요를 구분해서 말해요.',
    intro:'‘하는 게 좋아’와 ‘반드시 해야 해’는 상대가 받는 느낌이 달라요. should는 조언, must / have to는 필요나 의무를 말할 때 자주 써요.',
    rules:[['조언은 should + 원형','You should rest. = 쉬는 게 좋겠어요. 상대에게 도움이 될 행동을 권해요. 강한 명령처럼 말할 필요는 없어요.'],['의무는 must 또는 have to','I must go. / I have to go. 둘 다 가야 한다는 뜻이 될 수 있어요. have to는 외부 사정·규칙에 자주 쓰지만 둘의 구분이 항상 딱 떨어지지는 않아요.'],['부정하면 뜻이 크게 달라져요','mustn’t는 ‘하면 안 돼’, don’t have to는 ‘안 해도 돼’예요. shouldn’t는 보통 ‘하지 않는 게 좋아’라는 조언이에요.']],
    koOrder:['너는','잠깐','쉬는 게 좋겠어'],
    chunks:[c('You','너는','누가','조언받는 사람을 먼저 말해요.'),c('should','~하는 게 좋아','조언','행동 앞에 조언의 should예요.'),c('take a break','잠깐 쉬다','할 행동','should 뒤에 원형 take를 써요.')],
    note:'She has to go. / She doesn’t have to go.처럼 have to는 주인공과 부정에 따라 모양이 바뀌어요. must와 should 뒤에는 to를 붙이지 않아요.',
    examples:[e("You don't have to reply now.",'지금 답장하지 않아도 돼요.','부담 덜어주기'),e("You mustn't share the password.",'비밀번호를 공유하면 안 돼요.','금지 전달')],
    mistakes:[m('You should to rest.','You should rest.','should 뒤에는 to 없이 동사원형 rest예요.'),m('She have to go.','She has to go.','She의 현재 의무를 말할 때 has to로 바꿔요.')],
    questions:[
      q('“오늘 꼭 올 필요는 없어.”라는 뜻은?',[["You don't have to come today.",'올 의무가 없다는 뜻이에요. 와도 된다는 가능성은 남아요.'],["You mustn't come today.",'오면 안 된다는 금지예요. 필요 없다는 뜻보다 강하고 달라요.'],['You have to come today.','반드시 와야 한다는 반대 뜻이에요.']]),
      o('“그녀는 가야 해요.”를 만들어요.',[c('She','그녀는','누가','주인공 She부터예요.'),c('has to','~해야 해요','필요·의무','She에 맞춰 has to를 써요.'),c('go','가다','행동','뒤에는 기본 모양 go예요.')]),
      q('피곤한 친구에게 쉬라고 조언해요.',[['You should get some rest.','쉬는 게 좋겠다는 조언이에요.'],['You should gets some rest.','should 뒤에는 -s 없는 get이에요.'],['You must get no rest.','쉬지 않아야 한다는 다른 뜻이라 피곤한 친구에게 권할 내용과 맞지 않아요.']],0,["I'm really tired.",'나 정말 피곤해.'])
    ], sources:['modals'],
  },
  {
    id:'passive-voice', group:10, title:'누가 했는지보다 무슨 일이 생겼는지', term:'수동태 · be + 과거분사', goal:'일정 변경·물건 제작처럼 대상에 일어난 일을 설명해요.',
    intro:'‘누군가 회의를 취소했다’를 ‘회의가 취소됐다’로 말할 수 있어요. 행동을 받은 대상을 주인공 자리에 두는 것이 수동태예요.',
    rules:[['받은 대상 → be → 과거분사','The meeting was canceled.는 회의가 → 취소되었다예요. cancel의 과거분사 canceled를 써요.'],['시간에 따라 be를 바꾸기','It is made here.는 여기서 만들어진다는 사실, It was made here.는 여기서 만들어졌다는 과거예요.'],['누가 했는지는 필요하면 by','The game was made by my friend.에서 by my friend가 만든 사람을 알려줘요. 모르거나 중요하지 않으면 빼도 돼요.']],
    koOrder:['그 회의는','취소됐어요'],
    chunks:[c('The meeting','그 회의는','받은 대상','취소된 회의를 주인공으로 둬요.'),c('was','과거에 ~되다','과거 연결','지난 일을 was로 표시해요.'),c('canceled','취소된','받은 행동','cancel의 과거분사를 써요.')],
    note:'미국식 canceled와 영국식 cancelled는 모두 가능한 철자예요. 수동태가 모든 동사에 가능한 것은 아니에요. happen처럼 대상 없이 일어나는 말에는 보통 쓰지 않아요.',
    examples:[e('This game was made by my friend.','이 게임은 내 친구가 만들었어요.','작품 소개'),e('English is spoken here.','여기서는 영어가 사용돼요.','언어 안내')],
    mistakes:[m('The meeting was cancel.','The meeting was canceled.','was 뒤에 원형 cancel이 아니라 과거분사 canceled를 써요.'),m('The books was written by her.','The books were written by her.','books는 복수이므로 were가 맞아요. write의 과거분사는 written이에요.')],
    questions:[
      q('“이 책은 내 친구가 썼어요.”를 책부터 말해요.',[['This book was written by my friend.','책을 주인공으로 두고 was written으로 받은 행동을 설명했어요.'],['This book was wrote by my friend.','write의 과거 wrote 대신 과거분사 written이 필요해요.'],['This book written by my friend.','완전한 과거 문장에는 written 앞에 was가 필요해요.']]),
      o('“그 게임은 여기서 만들어졌어요.”를 만들어요.',[c('The game','그 게임은','받은 대상','만들어진 게임을 먼저 말해요.'),c('was made','만들어졌어요','받은 행동','과거의 be와 make의 과거분사예요.'),c('here','여기서','장소','만들어진 장소를 붙여요.')]),
      q('회의가 취소됐다고 알려줘요.',[['It was canceled.','회의를 It으로 받아 취소됐다고 말했어요.'],['It was cancel.','받은 행동에는 과거분사 canceled예요.'],['It canceled me.','회의가 나를 취소했다는 다른 뜻이에요. 지금 설명하려는 대상과 행동이 뒤바뀌었어요.']],0,['What happened to the meeting?','회의는 어떻게 됐어요?'])
    ], sources:['passive'],
  },
  {
    id:'ing-to-meaning', group:10, title:'멈춘 거야, 하려고 멈춘 거야?', term:'stop / remember · -ing와 to의 의미', goal:'모양이 모두 맞아도 뜻이 달라지는 표현을 구별해요.',
    intro:'stop talking과 stop to talk는 둘 다 가능한 말이지만 뜻이 달라요. 앞뒤 단어의 모양뿐 아니라 어떤 행동을 끝내고 무엇을 하려는지 살펴봐요.',
    rules:[['stop -ing는 하던 일을 그만두기','I stopped playing. = 게임하는 것을 멈췄어요. playing이 멈춘 행동이에요.'],['stop to는 다른 일을 멈추고 ~하려고','I stopped to reply. = 답장하려고 하던 일을 잠깐 멈췄어요. to reply는 멈춘 목적이에요.'],['remember도 시점을 구분하기','Remember to send it.는 보내는 일을 잊지 말라는 말이에요. I remember sending it.는 이미 보낸 장면을 기억한다는 말이에요.']],
    koOrder:['나는','답장하려고','잠깐 멈췄어요'],
    chunks:[c('I','나는','누가','멈춘 사람을 말해요.'),c('stopped','멈췄어요','먼저 한 일','하던 일을 멈췄다는 뜻이에요.'),c('to reply','답장하려고','목적','멈춘 이유인 다음 행동을 to로 연결해요.')],
    note:'모든 동사가 -ing와 to를 둘 다 받는 것은 아니에요. enjoy playing / want to play처럼 정해진 조합도 함께 익혀요.',
    examples:[e('I stopped checking my phone.','휴대폰 확인하는 것을 그만뒀어요.','행동 중단'),e('Remember to text me.','나에게 메시지 보내는 거 잊지 마.','앞으로 할 일')],
    mistakes:[m('Remember to sending it.','Remember to send it.','앞으로 할 일을 잊지 말라는 to 뒤에는 원형 send예요.'),m('I remember send it.','I remember sending it.','보냈던 행동을 기억한다는 뜻이라면 sending으로 써요.')],
    questions:[
      q('“I stopped to drink water.”의 뜻은?',[['물을 마시려고 하던 일을 멈췄어요.','to drink water는 멈춘 목적이에요.'],['물을 마시는 것을 그만뒀어요.','그 뜻이면 I stopped drinking water.예요.'],['물을 마셨던 장면이 기억나요.','기억을 말하는 remember가 들어 있지 않아요.']]),
      o('“그걸 보낸 장면이 기억나요.”를 만들어요.',[c('I','나는','누가','기억하는 사람부터 말해요.'),c('remember','기억해요','기억','무엇을 기억하는지 뒤에 붙여요.'),c('sending','보낸 것을','지난 행동','이미 한 행동의 기억은 -ing예요.'),c('it','그걸','대상','보낸 대상을 붙여요.')]),
      q('아직 안 보낸 친구에게 보내는 것을 잊지 말라고 해요.',[['Remember to send the link.','앞으로 해야 할 일을 to send로 말해요.'],['I remember sending the link.','나는 이미 보낸 것을 기억한다는 뜻이에요. 친구에게 할 일을 당부하는 말과 달라요.'],['Remember to sent the link.','to 다음에는 과거 sent가 아닌 send예요.']],0,["I'll send the link later.",'나중에 링크 보낼게.'])
    ], sources:['ingMeaning'],
  },
  {
    id:'past-perfect', group:11, title:'도착했을 땐 이미 시작했어', term:'과거완료 · had + 과거분사', goal:'지난 일 두 개 중 무엇이 먼저인지 설명해요.',
    intro:'내가 도착한 것도 과거, 게임이 시작한 것도 과거예요. 그중 더 먼저 끝난 일을 had started로 표시하면 순서가 분명해져요.',
    rules:[['기준이 되는 과거보다 먼저','The game had started when I arrived.는 게임 시작 → 내 도착 순서예요. had started가 더 앞선 일이에요.'],['누가 하든 had','I / she / they 모두 had + 과거분사예요. have·has처럼 주인공에 따라 갈리지 않아요.'],['과거 두 개라고 늘 필요한 건 아니에요','before, after나 문맥으로 순서가 분명하면 과거형만으로 말할 수도 있어요. 더 앞선 일을 분명히 보여줄 때 과거완료가 유용해요.']],
    koOrder:['내가 도착했을 때','게임은','이미 시작했었어요'],
    chunks:[c('The game','게임은','무엇이','먼저 일어난 일의 주인공이에요.'),c('had already started','이미 시작했었어요','더 앞선 일','already로 이미, had started로 더 앞선 과거를 말해요.'),c('when I arrived','내가 도착했을 때','기준 과거','비교하는 과거 시점을 붙여요.')],
    alternatives:[[2,0,1]],
    note:'I’d finished의 I’d는 I had예요. I’d go의 I’d는 I would예요. 뒤에 과거분사인지 동사원형인지 함께 보고 읽어요.',
    examples:[e("I had eaten before I left.",'떠나기 전에 먹었어요.','일의 순서'),e("She had gone home when I called.",'내가 전화했을 땐 그녀가 집에 간 뒤였어요.','연락 상황')],
    mistakes:[m('She had went home.','She had gone home.','had 뒤에는 go의 과거분사 gone이 필요해요.'),m('I had ate before I left.','I had eaten before I left.','had 뒤에는 과거 ate가 아니라 eaten이에요.')],
    questions:[
      q('“The movie had ended when I arrived.”에서 먼저 일어난 일은?',[['영화가 끝났어요.','had ended가 내가 도착한 과거보다 앞선 일이에요.'],['내가 도착했어요.','arrived는 기준 시점이고 영화가 그 전에 끝났어요.'],['둘 다 아직 일어나지 않았어요.','had ended와 arrived 모두 지난 일을 말해요.']]),
      o('“그녀는 이미 떠난 뒤였어요.”를 만들어요.',[c('She','그녀는','누가','떠난 사람을 말해요.'),c('had','그때보다 먼저','시간 연결','더 앞선 과거를 나타내요.'),c('already','이미','완료 강조','이미 끝났음을 더해요.'),c('left','떠났다','행동','leave의 과거분사 left예요.')],'.',[[0,2,1,3]]),
      q('도착 전에 게임이 시작해 있었다고 설명해요.',[['It had already started when I arrived.','시작이 도착보다 먼저라는 순서를 표시했어요.'],['It had already start when I arrived.','had 뒤에는 started예요.'],['It will start when I arrive.','문법은 맞지만 앞으로의 시작을 말해요. 이미 있었던 상황과 달라요.']],0,['Did you miss the beginning?','시작 부분 놓쳤어요?'])
    ], sources:['pastPerfect'],
  },
  {
    id:'third-conditional', group:11, title:'알았더라면 같이 갔을 텐데', term:'과거의 가정 · would have', goal:'이미 지나간 일을 다르게 상상해요.',
    intro:'실제로는 몰랐고 같이 못 갔지만, ‘알았더라면 갔을 텐데’라고 말할 수 있어요. 끝난 과거를 바꿔 상상하는 표현이에요.',
    rules:[['과거의 다른 조건: if + had + 과거분사','If I had known… = 내가 알았더라면…이에요. 실제 과거와 다른 조건을 상상해요.'],['달라졌을 결과: would have + 과거분사','I would have joined you. = 너와 같이했을 텐데예요. would 뒤에 have, 그 뒤에 joined예요.'],['지금 상상과 지난 일 상상 구분','If I had time, I would go.는 지금·미래의 상상이고, If I had had time, I would have gone.은 과거에 시간이 있었더라면이라는 상상이에요.']],
    koOrder:['내가 알았더라면','너와','같이했을 텐데'],
    chunks:[c('If I had known','내가 알았더라면','과거의 다른 조건','know의 과거분사 known을 써요.'),c('I would have','나는 ~했을 텐데','과거의 다른 결과','would have로 과거의 가정을 이어요.'),c('joined you','너와 같이했다','결과 행동','join의 과거분사 joined를 써요.')],
    alternatives:[[1,2,0]],
    note:'I’d have joined you의 I’d는 I would예요. 과거 가정과 현재 결과를 섞는 표현도 있지만 먼저 두 부분 모두 과거인 기본형을 익혀요.',
    examples:[e('If I had seen your message, I would have replied.','메시지를 봤더라면 답장했을 텐데.','늦은 답장 설명'),e('We would have met if you had called.','네가 전화했더라면 만났을 텐데.','지난 약속 이야기')],
    mistakes:[m('If I had knew, I would have called.','If I had known, I would have called.','had 뒤에는 과거 knew가 아니라 과거분사 known이에요.'),m('I would have went.','I would have gone.','would have 다음에는 go의 과거분사 gone이에요.')],
    questions:[
      q('“If I had seen it, I would have replied.”의 상황은?',[['그때 보지 못해서 답장하지 못한 과거를 다르게 상상해요.','had seen과 would have replied는 지난 일을 바꿔 보는 가정이에요.'],['내일 보면 답장하겠다는 약속이에요.','그 뜻은 If I see it, I’ll reply.라는 기본 미래 조건문으로 말해요.'],['지금 보고 있고 답장 중이에요.','현재 진행을 나타내는 문장은 아니에요.']]),
      o('“나는 답장했을 텐데.”를 만들어요.',[c('I','나는','누가','상상 속 행동의 주인공이에요.'),c('would have','~했을 텐데','과거 가정','과거의 다른 결과를 만들어요.'),c('replied','답장했다','행동','reply의 과거분사 replied예요.')]),
      q('그때 알았더라면 같이했을 텐데 하고 아쉬움을 말해요.',[['If I had known, I would have joined you.','몰랐던 과거를 다른 결과와 연결해 상상했어요.'],['If I had known, I would have join you.','would have 뒤에 과거분사 joined가 필요해요.'],['If I had know, I would have joined you.','had 뒤에는 known이 필요해요.']],0,['We played together yesterday.', '어제 다 같이 게임했어.'])
    ], sources:['thirdConditional'],
  },
  {
    id:'used-to', group:11, title:'예전에는 그랬고, 지금은 달라요', term:'used to / be used to', goal:'옛 습관과 익숙해진 일을 구별해요.',
    intro:'I used to play는 예전에 하곤 했다는 말이고, I’m used to playing은 하는 데 익숙하다는 말이에요. 앞의 be 유무를 함께 봐요.',
    rules:[['used to + 원형은 옛 습관·상태','I used to play every day. = 예전에는 매일 하곤 했어요. 보통 지금과 달라진 점을 이야기해요.'],['be used to + -ing는 익숙함','I’m used to chatting in English. = 영어로 채팅하는 데 익숙해요. 이 to는 뒤에 동사원형을 요구하는 to부정사와 달라요.'],['질문·부정은 did + use to','Did you use to live here? / I didn’t use to cook.처럼 did 뒤에는 기본 모양 use를 써요. 표준적인 글쓰기 형태로 익혀요.']],
    koOrder:['나는','예전에','매일 게임하곤 했어요'],
    chunks:[c('I','나는','누가','예전 습관의 주인공이에요.'),c('used to','예전에는 ~하곤 했다','옛 습관','지금과 달라진 습관을 소개해요.'),c('play games','게임하다','행동','뒤에는 원형 play예요.'),c('every day','매일','빈도','얼마나 자주였는지 붙여요.')],
    note:'get used to는 익숙해지는 과정이에요. I’m getting used to it.은 ‘그것에 익숙해지고 있어요’예요.',
    examples:[e('I used to live in Busan.','예전에는 부산에 살았어요.','지난 생활'),e("I'm used to speaking English.",'영어로 말하는 데 익숙해요.','익숙한 활동')],
    mistakes:[m('I used to played games.','I used to play games.','옛 습관의 used to 뒤에는 원형 play예요.'),m("I'm used to speak English.","I'm used to speaking English.",'익숙하다는 be used to 뒤에 활동을 붙일 때는 speaking이에요.')],
    questions:[
      q('“영어로 채팅하는 데 익숙해요.”는?',[["I'm used to chatting in English.",'be used to + -ing로 익숙함을 말했어요.'],['I used to chat in English.','예전에 채팅하곤 했다는 뜻이에요. 지금 익숙하다는 뜻과 달라요.'],["I'm used to chat in English.",'익숙하다는 be used to 뒤의 활동에는 chatting을 써요.']]),
      o('“예전에는 요리하지 않았어요.”를 만들어요.',[c('I','나는','누가','주인공을 먼저 말해요.'),c("didn't",'~하지 않았다','과거 부정','옛 습관의 부정을 시작해요.'),c('use to','예전에 ~하곤','옛 습관','didn’t 뒤에는 use예요.'),c('cook','요리하다','행동','끝에 행동의 기본 모양을 놓아요.')]),
      q('예전에는 매일 했지만 지금은 아니라는 뜻으로 답해요.',[['I used to play every day, but not now.','옛 습관과 지금의 차이를 분명히 말했어요.'],["I'm used to playing every day.",'매일 하는 데 익숙하다는 뜻이에요. 옛 습관을 그만뒀다는 정보는 없어요.'],['I used to playing every day.','옛 습관의 used to 뒤에는 play예요.']],0,['Do you still play every day?','아직 매일 게임해?'])
    ], sources:['usedTo'],
  },
].map(expandLesson);
