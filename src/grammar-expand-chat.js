import { chunk as c, example as e, mistake as m, choice as q, order as o } from './grammar-data.js';
import { expandLesson } from './grammar-expansion.js';

export default [
  {
    id:'polite-request', group:12, title:'친구에게 부담 적게 부탁해요', term:'Could you…? / Would you mind…?', goal:'부탁을 분명하고 공손하게 전달해요.',
    intro:'Can you…?도 자연스러운 부탁이에요. 처음 만난 사람이나 조금 조심스러운 부탁에는 Could you…?처럼 말할 수 있어요. could가 항상 과거라는 뜻은 아니에요.',
    rules:[['Could you + 원형','Could you send me the link? = 링크 좀 보내 줄 수 있어요? could → you → send 순서예요.'],['Would you mind + -ing','Would you mind speaking slowly? = 천천히 말해 주시겠어요? mind 뒤의 활동은 speaking으로 써요.'],['내가 해도 되는지와 구분','Could I use this?는 내가 써도 되는지 묻고, Could you use this?는 상대가 써 줄 수 있는지 물어요. 누가 행동할지 먼저 생각해요.']],
    koOrder:['링크를','나에게','보내 줄 수 있어요?'],
    chunks:[c('Could you','당신이 ~해 줄 수 있어요?','공손한 질문','부탁할 상대에게 could you로 시작해요.'),c('send me','나에게 보내다','부탁할 행동','could 뒤의 동사는 원형 send예요.'),c('the link','그 링크를','무엇','부탁할 대상을 분명히 해요.')], punctuation:'?',
    note:'Would you mind…?는 괜찮은지를 묻는 말이에요. “No, not at all.”은 싫다는 거절이 아니라 ‘전혀 괜찮아요’라는 수락일 수 있어요.',
    examples:[e('Could you explain that again?','그걸 다시 설명해 줄 수 있어요?','설명 부탁'),e('Would you mind waiting a minute?','잠깐 기다려 주시겠어요?','기다려 달라고 하기')],
    mistakes:[m('Could you to send it?','Could you send it?','could 뒤에는 to 없이 send를 써요.'),m('Would you mind speak slowly?','Would you mind speaking slowly?','mind 뒤에 행동을 붙일 때는 speaking이에요.')],
    questions:[
      q('링크를 찾지 못해서, 상대에게 다시 보내 달라고 공손하게 부탁해요.',[['Could you send the link again, please?','상대가 할 행동을 could you + send로 부탁했어요.'],['Could I send the link again?','내가 다시 보내도 되는지 묻는 질문이라 행동할 사람이 달라요.'],['Could you sent the link again?','could 뒤에는 sent가 아닌 send예요.']],0,['I sent you the link earlier.','아까 링크 보내 줬어요.']),
      o('“천천히 말해 주시겠어요?”를 mind로 만들어요.',[c('Would you mind','괜찮으시겠어요?','공손한 부탁','상대가 꺼리는지 묻는 표현이에요.'),c('speaking','말하는 것','부탁할 행동','mind 뒤에는 speaking이에요.'),c('more slowly','더 천천히','어떻게','말할 속도를 덧붙여요.')],'?'),
      q('이 답장은 부탁을 받아들인 걸까요?',[[ '받아들였어요. 전혀 괜찮다는 뜻이에요.','mind는 꺼리느냐는 뜻이라 No, not at all은 꺼리지 않는다는 수락이에요.'],['거절했어요. No는 언제나 싫다는 뜻이에요.','No를 단어만 보고 읽지 말고 mind라는 질문에 무엇을 부정하는지 봐요.'],['아직 결정하지 않았다고 했어요.','not at all은 이 맥락에서 전혀 꺼리지 않는다는 분명한 답이에요.']],0,['A: Would you mind waiting? B: No, not at all.','A: 기다려 주시겠어요? B: No, not at all.'])
    ], sources:['favour','invitations'],
  },
  {
    id:'polite-refusal', group:12, title:'거절하고 다른 시간을 제안해요', term:'I’d love to, but… / How about…?', goal:'어렵다는 뜻과 가능한 대안을 함께 말해요.',
    intro:'친구의 초대가 어렵다면 짧게 이유를 말하고 다른 날을 제안할 수 있어요. 모든 거절에 긴 변명이 필요한 것은 아니에요.',
    rules:[['호의와 어려운 사정을 나누기','I’d love to, but I’m busy. = 그러고 싶지만 바빠요. 앞부분은 호의, but 뒤는 어려운 사정이에요.'],['대안은 How about + 이름 / -ing','How about tomorrow? / How about meeting tomorrow?처럼 다른 날이나 활동을 제안해요.'],['거절의 이유를 과하게 만들지 않기','Sorry, I can’t make it.은 참석하기 어렵다는 뜻이에요. Thanks for asking.으로 초대에 고마움을 더할 수도 있어요.']],
    koOrder:['그러고 싶지만','오늘은','바빠요'],
    chunks:[c("I'd love to",'그러고 싶어요','호의','I would love to를 줄인 표현이에요.'),c('but','하지만','방향 바꾸기','지금은 어렵다는 사정을 이어요.'),c("I'm busy today",'오늘은 바빠요','사정','완전한 상태 문장으로 설명해요.')],
    note:'I can’t make it.의 make it은 여기서 ‘참석하다/시간 맞춰 가다’라는 덩어리예요. 물건을 만들 수 없다는 뜻으로만 해석하지 않아요.',
    examples:[e("Sorry, I can't make it tonight.",'미안, 오늘 밤에는 못 갈 것 같아.','일정 거절'),e('How about meeting tomorrow?','내일 만나는 건 어때?','대안 제시')],
    mistakes:[m('How about meet tomorrow?','How about meeting tomorrow?','How about 뒤의 활동은 meeting이라는 -ing 형태예요.'),m("I'd love to, but I busy.","I'd love to, but I'm busy.",'상태 busy를 I와 연결할 am이 필요해요.')],
    questions:[
      q('오늘은 어렵지만 내일을 제안하는 답은?',[["I'm busy today. How about tomorrow?",'오늘의 사정과 다른 날이라는 대안을 함께 말했어요.'],["I'm busy today.",'문법은 맞고 거절도 가능하지만, 문제에서 부탁한 내일이라는 대안이 빠졌어요.'],['How about to meet tomorrow?','How about 뒤에는 to meet보다 meeting을 써요.']],0,['Can we meet today?','오늘 만날 수 있어?']),
      o('“내일 만나는 건 어때?”를 만들어요.',[c('How about','어때?','제안 시작','대안을 묻는 말을 먼저 놓아요.'),c('meeting','만나는 것','제안할 활동','about 뒤의 활동은 -ing예요.'),c('tomorrow','내일','언제','시간을 뒤에 붙여요.')],'?'),
      q('초대에 감사하며 오늘은 못 간다고 답해요.',[["Thanks for inviting me, but I can't make it tonight.",'감사를 전하고 오늘 참석하기 어렵다고 분명히 말했어요.'],["Thanks for inviting me. I'll be there tonight.",'문법은 맞지만 오늘 가겠다는 수락이에요. 지금의 뜻과 반대예요.'],["Thanks for invite me, but I can't make it tonight.",'for 뒤에 초대하는 행동을 말할 때는 inviting이에요.']],0,['Would you like to join us tonight?','오늘 밤 우리랑 같이할래?'])
    ], sources:['invitations','chat'],
  },
  {
    id:'clarification', group:12, title:'못 알아들으면 다시 물어봐요', term:'다시 말하기·뜻 묻기·확인하기', goal:'이해한 척하지 않고 필요한 부분을 정확히 물어요.',
    intro:'대화를 잘한다는 건 모든 말을 한 번에 알아듣는다는 뜻이 아니에요. 소리, 단어 뜻, 일정 중 무엇이 헷갈리는지 골라서 물어봐요.',
    rules:[['소리를 놓쳤다면 반복 부탁','Could you say that again? = 다시 말해 줄 수 있어요? 소리를 들을 수 없으면 Could you type that?으로 적어 달라고 해요.'],['단어가 낯설다면 뜻 묻기','What does “available” mean? = available은 무슨 뜻이에요? does가 질문을 만들므로 뒤에는 mean이에요.'],['내가 이해한 내용 확인','Do you mean Friday? = 금요일이라는 뜻인가요? Just to check, are we meeting at six?처럼 구체적인 내용을 되물어요.']],
    koOrder:['그걸','다시','말해 줄 수 있어요?'],
    chunks:[c('Could you','말해 줄 수 있어요?','공손한 질문','상대에게 부탁해요.'),c('say','말하다','행동','could 뒤에는 say의 기본 모양이에요.'),c('that again','그걸 다시','내용과 반복','무엇을 다시 해 달라는지 붙여요.')], punctuation:'?',
    note:'“What?” 한마디도 상황에 따라 쓰지만, 처음 만난 사람에게는 Sorry, could you say that again?처럼 구체적으로 부탁하면 의도가 더 잘 전달돼요.',
    examples:[e('Could you type that, please?','그걸 글로 적어 주시겠어요?','소리 없이 대화'),e('Do you mean this Saturday?','이번 토요일 말하는 거예요?','일정 확인')],
    mistakes:[m('What does available means?','What does available mean?','does 뒤에는 means가 아니라 mean이에요.'),m('Could you said that again?','Could you say that again?','could 뒤의 행동은 과거 said가 아니라 원형 say예요.')],
    questions:[
      q('소리를 못 듣는 환경에서 글로 적어 달라고 해요.',[['Could you type that, please?','type은 글자를 입력한다는 뜻이라 지금 필요한 방식에 맞아요.'],['Could you speak louder?','더 크게 말해 달라는 부탁이라 소리를 못 듣는 환경을 해결하지 못해요.'],['Could you typed that?','could 뒤에는 typed가 아닌 type이에요.']],0,["I'll explain it on the voice call.",'음성 통화로 설명할게.']),
      o('“available은 무슨 뜻이에요?”를 만들어요.',[c('What','무엇','궁금한 뜻','뜻을 What으로 물어요.'),c('does','질문 도움','현재 질문','단어 하나의 뜻을 묻는 does예요.'),c('available','available이','물어볼 단어','뜻을 모르는 단어를 넣어요.'),c('mean','뜻하다','행동·의미','does 뒤에는 mean이에요.')],'?'),
      q('오전인지 오후인지 구체적으로 확인해요.',[['Do you mean 8 a.m. or 8 p.m.?','두 가능성을 제시해서 모호한 부분을 분명히 물었어요.'],['Okay, see you at eight.','문법은 맞지만 오전·오후를 확인하지 않고 동의한 답이에요.'],['Do you means 8 a.m. or 8 p.m.?','do 뒤에는 means가 아닌 mean이에요.']],0,["Let's meet at eight.",'여덟 시에 만나자.'])
    ], sources:['clarification','questions'],
  },
  {
    id:'repair-misunderstanding', group:13, title:'내 뜻을 잘못 전달했을 때', term:'I meant… / I mean… / 정정하기', goal:'오해를 부드럽게 풀고 바뀐 정보를 분명히 알려줘요.',
    intro:'채팅은 말투가 보이지 않아 오해할 수 있어요. 상대를 탓하기보다 내가 전하려던 내용을 다시 짧게 말해 봐요.',
    rules:[['전에 한 말의 뜻은 I meant','I meant next Friday. = 내가 말한 건 다음 금요일이었어. mean의 과거는 meant예요.'],['지금 말을 바로 고칠 땐 I mean','Friday—I mean Saturday. = 금요일, 아니 토요일.처럼 지금 하는 말을 즉시 정정할 수 있어요.'],['의도를 설명하고 확인하기','I didn’t mean to sound rude. = 무례하게 들리려던 건 아니었어. 그다음 실제 전달할 내용을 붙이고 Does that make sense?로 확인할 수 있어요.']],
    koOrder:['내가 말한 건','다음 금요일이었어'],
    chunks:[c('I','나는','누가','내가 전한 뜻을 말해요.'),c('meant','뜻했어','이전 의도','전에 한 말이므로 meant예요.'),c('next Friday','다음 금요일을','정정할 내용','정확한 새 정보를 붙여요.')],
    note:'상대가 불편했다고 말하면 의도 설명만 반복하기보다 Sorry, that came out wrong.처럼 표현을 돌아보고 다시 말할 수도 있어요.',
    examples:[e("Sorry, I meant next week.",'미안, 다음 주를 말한 거였어.','날짜 정정'),e("I didn't mean to sound rude.",'무례하게 말하려던 건 아니었어.','말투 오해 풀기')],
    mistakes:[m('I meaned next Friday.','I meant next Friday.','mean의 과거형은 meaned가 아니라 meant예요.'),m("I didn't mean sound rude.","I didn't mean to sound rude.",'그럴 의도였다는 mean 뒤에 행동을 이을 때는 to sound예요.')],
    questions:[
      q('앞서 말한 날짜가 다음 주였다고 정정해요.',[['Sorry, I meant next week.','전에 전달하려던 뜻을 meant로 분명히 고쳤어요.'],['Sorry, I meaned next week.','mean의 과거형은 meant예요.'],['Sorry, I will mean next week.','다음에 그런 뜻으로 말하겠다는 표현이라 이전 날짜를 정정하는 상황과 달라요.']],0,['So, are we meeting tomorrow?','그러면 내일 만나는 거지?']),
      o('“무례하게 들리려던 건 아니었어.”를 만들어요.',[c('I','나는','누가','내 의도를 말해요.'),c("didn't mean",'의도하지 않았어','과거 부정','didn’t 뒤에는 원형 mean이에요.'),c('to sound','들리게 하려는 것','의도한 행동','행동은 to sound로 연결해요.'),c('rude','무례한','어떤 느낌','sound 뒤에 어떤 인상인지 붙여요.')]),
      q('지금 막 “금요일”이라고 잘못 말한 뒤 토요일로 바로 고쳐요.',[['Friday—I mean Saturday.','현재 발화를 즉시 고치며 I mean을 쓸 수 있어요.'],['Friday—I am mean Saturday.','여기서 mean은 동사예요. 앞에 am을 넣지 않아요.'],['Friday—I meaning Saturday.','완전한 기본 문장에는 mean을 써요. meaning만 붙이지 않아요.']],0,['Which day works for you?','어느 요일이 괜찮아?'])
    ], sources:['clarification','chat','past'],
  },
  {
    id:'keep-conversation', group:13, title:'한마디 답에서 대화를 이어가요', term:'반응 → 내 이야기 → 후속 질문', goal:'취미와 일상 이야기를 자연스럽게 이어가요.',
    intro:'Yes만 답해도 틀리지는 않아요. 더 이야기하고 싶다면 짧게 반응하고, 나의 정보 하나를 더하고, 상대에게 관련 질문을 던져 봐요.',
    rules:[['상대 이야기와 연결해 반응','That sounds fun. = 재미있겠다. sounds 뒤에는 fun 같은 특성이 와요. 상대 상황에 맞는 반응을 고르는 게 중요해요.'],['내 이야기 하나 더하기','I like hiking too. = 나도 등산 좋아해. too는 ‘나도/또한’이라는 뜻이에요. 모르는 취미라면 I’ve never tried it.도 대화를 이어가는 출발점이에요.'],['관련된 열린 질문하기','Where do you usually go? / How did you get into it?처럼 장소나 시작 계기를 물어요. What about you?는 같은 질문을 상대에게 돌릴 때 편리해요.']],
    koOrder:['너는','보통 어디로','가?'],
    chunks:[c('Where','어디로','궁금한 내용','장소를 먼저 물어요.'),c('do you','너는 ~하니?','질문과 주인공','일반동사 질문은 do you예요.'),c('usually go','보통 가다','평소 행동','usually는 여기서 go 앞에 놓아요.')], punctuation:'?',
    note:'이 수업에서는 ‘대화를 이어가기’라는 목표에 맞춰 답을 골라요. 짧은 답이 항상 무례하거나 문법적으로 틀린 것은 아니에요.',
    examples:[e('That sounds fun. How did you get into it?','재미있겠다. 어떻게 시작하게 됐어?','취미 이야기'),e('I like movies too. What kind do you like?','나도 영화 좋아해. 어떤 종류 좋아해?','공통 관심사')],
    mistakes:[m('That sound fun.','That sounds fun.','주인공 That의 현재형에는 sounds를 써요.'),m('Where you usually go?','Where do you usually go?','기본적인 완전한 질문에서는 you 앞에 do가 필요해요.')],
    questions:[
      q('등산 이야기에 반응하고, 자주 가는 곳을 물어봐요.',[['That sounds fun. Where do you usually go?','관련 반응과 장소 질문을 이어 상대가 더 말할 수 있게 했어요.'],['Okay.','틀린 문장은 아니지만, 이번 목표인 반응과 장소 질문까지 이어지지는 않아요.'],['That sounds fun. Where you usually go?','질문에서 do가 빠졌어요.']],0,['I go hiking on weekends.','나는 주말에 등산해.']),
      o('“어떤 종류의 영화를 좋아해?”를 만들어요.',[c('What kind of movies','어떤 종류의 영화를','궁금한 대상','긴 질문 덩어리를 먼저 놓아요.'),c('do','질문 도움','현재 질문','like를 묻는 do예요.'),c('you','너는','누가','주인공은 do 뒤예요.'),c('like','좋아하다','행동·취향','원형 like로 마무리해요.')],'?'),
      q('처음 듣는 취미라 해 본 적 없다고 말하고 시작 계기를 물어요.',[["I've never tried it. How did you get into it?",'경험이 없음을 솔직히 말하고 상대의 이야기를 더 물었어요.'],["I've never tried it.",'문법은 맞지만 시작 계기를 묻는 후속 질문은 빠졌어요.'],["I've never tried it. How did you got into it?",'did 뒤에는 과거 got이 아니라 get이에요.']],0,["I'm really into pottery.",'나 요즘 도자기 만드는 데 푹 빠졌어.'])
    ], sources:['listening','questions'],
  },
  {
    id:'chat-tone', group:13, title:'짧게 써도 뜻은 분명하게', term:'채팅 말투 · 축약형·답장·마무리', goal:'친구와의 채팅에서 상황에 맞는 표현을 골라요.',
    intro:'채팅은 완전한 문장을 줄이기도 해요. 처음에는 쉬운 완전한 문장과 I’m, I’ll 같은 흔한 축약형부터 익히면 오해를 줄이기 좋아요.',
    rules:[['축약형을 풀어 읽기','I’m = I am, I’ll = I will, don’t = do not이에요. I’m busy now. / I’ll reply later.처럼 짧아져도 구조는 같아요.'],['늦은 답장과 마무리','Sorry for the late reply. = 답장이 늦어서 미안해. I have to go. Talk later? = 가 봐야 해. 나중에 이야기할까?처럼 상황을 알려줘요.'],['상대와 상황을 보고 줄이기','brb는 be right back(금방 돌아올게) 같은 채팅 약자예요. 처음 대화하는 상대라면 풀어 쓰면 더 분명해요. 짧은 답이나 이모지의 느낌은 사람마다 달라요.']],
    koOrder:['지금은 바빠요','나중에','답장할게요'],
    chunks:[c("I'm busy now.",'지금은 바빠요','현재 사정','I’m은 I am이에요.'),c("I'll",'나는 ~할게요','연락 약속','I’ll은 I will이에요.'),c('reply later','나중에 답장하다','다음 행동','will 뒤에는 원형 reply예요.')],
    note:'What about you?나 Talk later?처럼 짧은 표현도 자연스러운 맥락이 있어요. 줄였다는 이유만으로 모든 채팅 문장을 틀렸다고 판단하지 않아요.',
    examples:[e("Sorry for the late reply. I've been busy.",'답장이 늦어서 미안해. 바빴어.','늦은 답장'),e("I have to go. Talk to you later!",'가 봐야 해. 나중에 이야기하자!','대화 마무리')],
    mistakes:[m("I'll replying later.","I'll reply later.",'I’ll에는 will이 들어 있으므로 뒤에는 원형 reply예요.'),m("I'm will be back soon.","I'll be back soon.",'미래 약속은 I will / I’ll로 써요. I’m과 will을 겹치지 않아요.')],
    questions:[
      q('지금 바쁘지만 나중에 답장하겠다고 알려줘요.',[["I'm busy now, but I'll reply later.",'현재 사정과 다음 연락을 함께 말했어요.'],["I'm busy now, but I'll replied later.",'will 뒤에는 replied가 아닌 reply예요.'],["I'm busy now, but I'll replying later.",'will 바로 뒤에 replying을 붙이지 않아요.']],0,['Can we chat now?','지금 이야기할 수 있어?']),
      o('“나중에 답장할게.”를 만들어요.',[c("I'll",'나는 ~할게','연락 약속','I will을 줄인 말이에요.'),c('reply','답장하다','행동','will 뒤에는 기본형 reply예요.'),c('later','나중에','언제','연락할 때를 붙여요.')],'.',[[2,0,1]]),
      q('할 일이 있어 대화를 마치되, 다음에 이야기하자고 해요.',[["I have to go now. Talk to you later!",'가야 하는 사정과 다음 대화 인사를 전했어요.'],["I don't want to talk to you again.",'문법은 맞지만 다시는 대화하고 싶지 않다는 뜻이에요. 오늘만 마무리하려는 의도와 달라요.'],['I have go now. Talk to you later!','가야 한다는 have to go에서 to가 빠졌어요.']],0,["I've got more stories to tell you.",'해 줄 이야기가 더 있어.'])
    ], sources:['chat','future'],
  },
].map(expandLesson);
