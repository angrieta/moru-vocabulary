import { chunk as c, example as e, mistake as m, choice as q, order as o } from './grammar-data.js';
import { expandLesson } from './grammar-expansion.js';

export default [
  {
    id:'comparative', group:6, title:'이 카페가 더 조용해요', term:'비교급 · -er / more / than', goal:'둘을 비교해서 내가 원하는 것을 설명해요.',
    intro:'‘조용하다’에 ‘더’를 붙이면 비교가 돼요. 영어는 비교할 대상을 먼저 말하고, 어떤 점이 더 그런지 뒤에 이어요.',
    rules:[['짧은 말은 보통 -er','cheap(저렴한) → cheaper(더 저렴한), big → bigger예요. 긴 말은 more comfortable(더 편안한)처럼 more를 앞에 놓아요.'],['무엇보다?는 than 뒤에','This cafe is cheaper than that one.은 이 카페 → ~이다 → 더 저렴한 → 저 카페보다 순서예요.'],['비교 표시를 두 번 붙이지 않기','more cheaper 대신 cheaper예요. good(좋은)은 better, bad(나쁜)은 worse로 바뀌어요. 두 음절짜리 말은 형태가 달라질 수 있어 묶어서 익혀요.']],
    koOrder:['이 카페는','저 카페보다','더 저렴해요'],
    chunks:[c('This cafe','이 카페는','무엇이','비교할 주인공을 먼저 정해요.'),c('is','~예요','연결','카페의 특성을 is로 연결해요.'),c('cheaper','더 저렴한','비교','cheap의 비교형 cheaper를 써요.'),c('than that one','저 카페보다','비교 대상','than 뒤에 비교할 다른 대상을 넣어요.')],
    note:'같은 정도면 as quiet as…(…만큼 조용한)도 가능해요. 비교급을 쓰지 않는 다른 구조예요.',
    examples:[e('This seat is more comfortable.','이 자리가 더 편해요.','자리 고르기'),e('Today is better than yesterday.','오늘은 어제보다 나아요.','하루 이야기')],
    mistakes:[m('This cafe is more cheaper.','This cafe is cheaper.','cheaper에 이미 ‘더’가 들어 있어 more를 겹치지 않아요.'),m('This room is bigger that mine.','This room is bigger than mine.','‘내 것보다’는 than mine이에요. that과 than의 철자를 구분해요.')],
    questions:[
      q('“이 의자가 더 편안해요.”는?',[['This chair is more comfortable.','comfortable 앞에 more를 써서 비교해요.'],['This chair is comfortabler.','이 단어는 보통 more comfortable로 비교해요.'],['This chair more comfortable.','주인공과 특성을 연결하는 is가 빠졌어요.']]),
      o('“이것은 저것보다 더 좋아요.”를 만들어요.',[c('This','이것은','주인공','This부터 말해요.'),c('is','~예요','연결','is로 비교하는 특성을 연결해요.'),c('better','더 좋은','비교','good의 비교형은 better예요.'),c('than that','저것보다','비교 대상','다른 대상을 than 뒤에 놓아요.')]),
      q('A가 B보다 싸다고 알려줘요.',[['Cafe A is cheaper than Cafe B.','A를 먼저 소개하고 B보다 싸다고 비교했어요.'],['Cafe A is the cheapest in town.','문법은 맞지만 동네 전체에서 가장 싸다는 더 강한 말이에요. A와 B만 비교하는 지금의 정보보다 범위가 커요.'],['Cafe A is cheap than Cafe B.','than으로 비교할 때 cheap을 cheaper로 바꿔요.']],0,['Which cafe costs less, A or B?','A와 B 중 어디가 덜 비싸요?'])
    ], sources:['comparisons'],
  },
  {
    id:'superlative', group:6, title:'이 셋 중에서는 이게 제일 좋아요', term:'최상급 · the -est / most', goal:'여러 선택지 중 가장 마음에 드는 것을 말해요.',
    intro:'비교급이 ‘더’라면 최상급은 어떤 범위 안에서 ‘가장’이에요. 무엇들 중에서 가장 그런지도 같이 알려주면 정확해져요.',
    rules:[['the와 함께 가장','cheap → the cheapest, interesting → the most interesting이에요. This is the cheapest option. = 이게 가장 저렴한 선택이에요.'],['good은 best','better(더 좋은)와 best(가장 좋은)를 구분해요. This is the best one.처럼 말해요.'],['비교 범위를 정하기','of the three(셋 중), in this area(이 지역에서)를 붙일 수 있어요. my best friend처럼 my가 앞에 있으면 the를 더하지 않아요.']],
    koOrder:['이것이','세 가지 중에서','가장 저렴한 선택이에요'],
    chunks:[c('This','이것이','주인공','고른 대상을 This로 가리켜요.'),c('is','~예요','연결','특성을 is로 연결해요.'),c('the cheapest option','가장 저렴한 선택','가장 어떤 것','the cheapest로 최상급을 만들어요.'),c('of the three','셋 중에서','범위','비교 범위를 마지막에 알려줘요.')],
    note:'대화에서 best라는 평가에는 개인 취향이 담길 수 있어요. for me(나에게는)를 붙여 내 기준을 말할 수 있어요.',
    examples:[e('This is the most interesting game.','이게 가장 흥미로운 게임이에요.','여러 게임 비교'),e('Mina is my best friend.','미나는 내 가장 친한 친구예요.','친구 소개')],
    mistakes:[m('This is the most cheapest one.','This is the cheapest one.','most와 -est를 함께 쓰지 않아요.'),m('This is the goodest choice.','This is the best choice.','good의 최상급은 goodest가 아닌 best예요.')],
    questions:[
      q('“이것이 가장 흥미로운 책이에요.”는?',[['This is the most interesting book.','긴 특성 표현 앞에 the most를 놓아요.'],['This is the more interesting book of all.','of all로 전체 중 가장을 말하려면 most가 맞아요.'],['This is the most interestingest book.','most와 -est를 겹치지 않아요.']]),
      o('“이것이 가장 좋은 선택이에요.”를 만들어요.',[c('This','이것이','주인공','고른 것을 먼저 말해요.'),c('is','~예요','연결','This 다음에 is예요.'),c('the best','가장 좋은','특성','good의 최상급을 써요.'),c('choice','선택','무엇','어떤 것인지 명사 choice로 마무리해요.')]),
      q('세 방 중 2번이 가장 크다고 답해요.',[['Room 2 is the biggest of the three.','세 방이라는 범위 안에서 가장 크다고 답했어요.'],['Room 2 is bigger than Room 1.','가능한 문장이지만 1번과의 비교뿐이라 세 방 전체 중 가장 큰지는 알 수 없어요.'],['Room 2 is the big of the three.','‘가장 큰’이라는 최상급 biggest가 필요해요.']],0,['Which of these three rooms is the biggest?','이 세 방 중 어느 방이 가장 커요?'])
    ], sources:['comparisons'],
  },
  {
    id:'relative-clause', group:6, title:'어떤 친구인지 뒤에서 설명해요', term:'관계대명사 · who / which / that', goal:'사람이나 물건을 긴 설명으로 구별해요.',
    intro:'한국어는 ‘게임을 좋아하는 친구’처럼 설명부터 해요. 영어는 a friend(친구)를 말한 다음 who likes games(게임을 좋아하는)를 뒤에 붙여요.',
    rules:[['사람은 who, 사물은 which','a friend who likes games / a game which is fun처럼 먼저 이름을 놓고 뒤에서 설명해요. 대상을 구별하는 이런 문장에서는 that도 쓸 수 있어요.'],['같은 주인공을 또 넣지 않기','a friend who likes games에서 who가 친구 역할을 해요. who he likes games처럼 he를 겹치지 않아요.'],['대상 역할이면 생략도 가능','the game that I bought는 the game I bought로도 말해요. 반면 a friend who lives here에서 주인공 who는 보통 빼지 않아요.']],
    koOrder:['나는','게임을 좋아하는','친구가 있어요'],
    chunks:[c('I','나는','누가','나부터 말해요.'),c('have','있어요','행동·사실','무엇이 있는지 have로 시작해요.'),c('a friend','친구 한 명을','먼저 이름','설명할 사람을 먼저 말해요.'),c('who likes games','게임을 좋아하는','뒤에서 설명','who부터가 앞의 friend를 설명해요.')],
    note:'이번에는 누군지 구별하는 관계절을 연습해요. 이미 특정된 사람에게 덧붙이는 쉼표 있는 관계절은 쓰임이 달라요.',
    examples:[e('I like the book that you recommended.','네가 추천한 책이 좋아요.','추천 이야기'),e('She has a friend who lives nearby.','그녀에게는 근처에 사는 친구가 있어요.','친구 설명')],
    mistakes:[m('I have a friend who he likes games.','I have a friend who likes games.','who가 이미 친구를 가리키는 주인공이라 he를 또 넣지 않아요.'),m('I like the book that you recommended it.','I like the book that you recommended.','that이 추천한 책의 자리를 맡으므로 it을 다시 붙이지 않아요.')],
    questions:[
      q('“나는 네가 만든 게임을 좋아해.”는?',[['I like the game that you made.','game을 먼저 말하고 that you made로 뒤에서 설명해요.'],['I like that you made the game.','문법은 가능하지만 ‘네가 그 게임을 만들었다는 사실이 좋다’는 말로, 게임 자체가 좋다는 뜻과 달라요.'],['I like the game that you made it.','that과 it이 같은 대상을 두 번 나타내요. it을 빼요.']]),
      o('“그는 여기 사는 친구예요.”를 만들어요.',[c('He','그는','누가','He부터 말해요.'),c('is','~예요','연결','정체를 is로 연결해요.'),c('a friend','친구','먼저 이름','friend를 먼저 놓아요.'),c('who lives here','여기 사는','뒤에서 설명','친구를 who절로 설명해요.')]),
      q('메시지를 보낸 친구라고 설명해요.',[['The friend who sent me a message.','friend 뒤에 어떤 친구인지 설명을 붙였어요. 질문에 명사 덩어리로 답하는 것도 가능해요.'],['The friend who he sent me a message.','who가 주인공이므로 he를 겹치지 않아요.'],['The friend which sent me a message.','사람을 설명하는 이번 표현에는 who나 that이 자연스러워요.']],0,['Which friend do you mean?','어느 친구를 말하는 거예요?'])
    ], sources:['relatives'],
  },
  {
    id:'noun-clause', group:7, title:'내 생각 뒤에 작은 문장을 붙여요', term:'명사절 · I think (that)…', goal:'생각·감정·알고 있는 내용을 문장으로 전달해요.',
    intro:'I think(나는 생각해요) 뒤에 ‘무엇을 생각하는지’ 문장 하나를 붙일 수 있어요. 이런 덩어리는 문장 안에서 하나의 내용처럼 일해요.',
    rules:[['나는 생각해 → 그 내용','I think that this game is fun.은 I think + this game is fun 두 부분이에요. that은 두 부분을 이어줘요.'],['안쪽도 누가 → 어떤 상태','that this game is fun처럼 안쪽에도 주인공과 동사가 필요해요. 한국어 ‘이 게임이 재미있다고’에서 ‘라고’를 단어 하나로 옮기려 애쓰지 않아요.'],['that을 뺄 수 있는 경우','I think this game is fun.도 맞아요. I’m glad you’re here.처럼 감정 뒤에도 내용을 붙일 수 있어요. 모든 that을 늘 빼도 된다는 뜻은 아니에요.']],
    koOrder:['나는','이 게임이 재미있다고','생각해요'],
    chunks:[c('I think','나는 생각해요','내 입장','생각한다는 입장을 먼저 말해요.'),c('that','~라는 것을','내용 연결','이어서 생각의 내용을 소개해요.'),c('this game','이 게임이','내용의 주인공','작은 문장의 주인공이에요.'),c('is fun','재미있어요','내용의 상태','game의 상태를 is fun으로 마무리해요.')],
    note:'I don’t think it’s easy.는 ‘쉽다고 생각하지 않아’예요. 상대와 다른 의견을 말할 때도 자주 써요.',
    examples:[e("I think you're right.",'네 말이 맞는 것 같아.','의견에 동의'),e("I'm glad you're here.",'네가 와서 기뻐.','친구 환영')],
    mistakes:[m('I think that he busy.','I think that he is busy.','안쪽 문장 he busy에도 상태를 연결할 is가 필요해요.'),m('I think that is she kind.','I think that she is kind.','생각의 내용은 질문 어순이 아니라 she → is → kind예요.')],
    questions:[
      q('“그녀가 친절하다고 생각해요.”는?',[['I think she is kind.','think 뒤에 she is kind라는 내용을 붙였어요. that은 생략할 수 있어요.'],['I think is she kind.','안쪽을 is she처럼 질문 순서로 바꾸지 않아요.'],['I think she kind.','she와 kind를 연결하는 is가 빠졌어요.']]),
      o('“네 말이 맞다고 생각해.”를 만들어요.',[c('I think','나는 생각해','내 입장','입장을 먼저 밝혀요.'),c('that','~라고','연결','생각의 내용이 이어져요.'),c('you','너는','안쪽 주인공','내용의 주인공 you가 먼저예요.'),c('are right','맞아','안쪽 상태','you에 are를 연결해요.')]),
      q('그 게임이 재미있다는 내 생각을 말해요.',[['I think the game is fun.','내 생각을 I think로 소개하고 내용을 이어 말했어요.'],['I think the game fun.','내용 안의 is가 빠졌어요.'],['I think that fun the game is.','안쪽 내용도 the game → is → fun 순서예요.']],0,['What do you think of the game?','그 게임 어떻게 생각해요?'])
    ], sources:['clauses'],
  },
  {
    id:'indirect-question', group:7, title:'어디인지 아는지 물어봐요', term:'간접의문문 · where it is / if', goal:'질문을 문장 안에 넣어 부드럽게 물어요.',
    intro:'Where is the cafe?를 Do you know…? 안에 넣으면 뒤쪽은 where the cafe is예요. 바깥에서 이미 물어보고 있으니 안쪽을 다시 질문 순서로 만들지 않아요.',
    rules:[['궁금한 말 + 누가 + 동사','Do you know where she lives?에서 where 뒤에는 she lives예요. where does she live를 그대로 넣지 않아요.'],['예·아니요 내용에는 if / whether','Do you know if he is free? = 그가 시간 있는지 알아요? 여기서 if는 ‘만약’이 아니라 ‘~인지’예요.'],['문장 전체가 질문인지 보기','I know where she lives.는 알고 있다는 진술이에요. Do you know…?는 질문이므로 물음표를 붙여요.']],
    koOrder:['너는','그 카페가 어디 있는지','알아?'],
    chunks:[c('Do you know','너는 알아?','바깥 질문','먼저 알고 있는지 물어요.'),c('where','어디에','궁금한 내용','장소에 관한 내용을 이어요.'),c('the cafe','그 카페가','안쪽 주인공','안쪽은 주인공부터예요.'),c('is','있다','안쪽 상태','is를 카페 뒤에 놓아요.')], punctuation:'?',
    note:'who가 주인공이면 who called처럼 원래 순서가 같을 수도 있어요. 모든 질문에서 무조건 단어를 뒤집는 규칙은 아니에요.',
    examples:[e('Do you know if Mina is free?','미나가 시간 있는지 알아요?','친구 일정 확인'),e("I don't know where he lives.",'그가 어디 사는지 몰라요.','모르는 내용')],
    mistakes:[m('Do you know where is the cafe?','Do you know where the cafe is?','안쪽은 where + the cafe + is 순서예요.'),m('I know where does she live.','I know where she lives.','안쪽에서 질문용 does를 빼고 she lives로 되돌려요.')],
    questions:[
      q('“네가 언제 시간이 되는지 알려줄 수 있어?”는?',[['Can you tell me when you are free?','바깥의 Can you가 질문을 만들고, 안쪽은 when you are free예요.'],['Can you tell me when are you free?','안쪽까지 are you로 뒤집지 않아요.'],['Can you tell me when you free?','you와 free 사이에 are가 필요해요.']]),
      o('“그가 시간 있는지 알아요?”를 만들어요.',[c('Do you know','알아요?','바깥 질문','알고 있는지 먼저 물어요.'),c('if','~인지','연결','예·아니요 내용을 if로 이어요.'),c('he','그가','안쪽 주인공','he부터 시작해요.'),c('is free','시간이 있다','안쪽 상태','상태를 뒤에 붙여요.')],'?'),
      q('주소를 모른다고 답해요.',[["I don't know where she lives.",'모른다는 입장 뒤에 어디 사는지 내용을 붙였어요.'],["I don't know where does she live.",'안쪽은 질문용 does 없이 she lives예요.'],["I don't know where she live.",'she의 현재 사실을 말하므로 lives예요.']],0,["What's Mina's address?",'미나 주소가 뭐예요?'])
    ], sources:['questions','clauses'],
  },
  {
    id:'there-quantifiers', group:7, title:'근처에 카페가 좀 있어요', term:'there is / are · some / any', goal:'있는 것과 없는 것을 설명하고 양을 물어요.',
    intro:'처음 꺼내는 대상이 ‘있다’고 말할 때 there is / are를 써요. 여기서 there는 꼭 ‘저기에’라는 장소 뜻이 아니에요.',
    rules:[['하나면 is, 여러 개면 are','There is a cafe nearby. / There are two cafes nearby.처럼 뒤 대상의 수에 맞춰요.'],['some과 any의 기본 쓰임','There are some shops. / Are there any shops? / There aren’t any shops.처럼 익혀요. 권하거나 기대하며 물을 때는 some도 가능해요.'],['셀 수 있는지 살펴보기','many friends는 친구가 많이, much time은 시간이 많이예요. 물·시간처럼 보통 낱개로 세지 않는 말에는 a lot of도 편리해요.']],
    koOrder:['근처에','카페 두 곳이','있어요'],
    chunks:[c('There are','있어요','존재 소개','여러 곳이 있음을 are로 소개해요.'),c('two cafes','카페 두 곳이','무엇이','무엇이 있는지 뒤에 놓아요.'),c('nearby','근처에','어디','위치를 끝에 덧붙여요.')],
    alternatives:[[2,0,1]],
    note:'There is some water.에서 water는 보통 셀 수 없는 명사로 다뤄 is를 써요. a glass of water는 물 한 잔이라는 단위를 붙인 말이에요.',
    examples:[e('Is there a bus stop nearby?','근처에 버스 정류장이 있나요?','장소 묻기'),e("I don't have much time.",'시간이 많지 않아요.','상황 설명')],
    mistakes:[m('There is two cafes.','There are two cafes.','two cafes는 복수이므로 are를 써요.'),m("I don't have many time.","I don't have much time.",'이 뜻의 time은 낱개로 세는 명사가 아니라 much를 써요.')],
    questions:[
      q('“근처에 가게가 하나도 없어요.”는?',[["There aren't any shops nearby.",'여러 가게가 없다는 부정에 aren’t any를 썼어요.'],["There isn't any shops nearby.",'shops는 복수이므로 aren’t예요.'],["There don't any shops nearby.",'존재를 말하는 there are의 부정은 there aren’t예요.']]),
      o('“근처에 카페가 있나요?”를 만들어요.',[c('Is there','있나요?','존재 질문','하나가 있는지 Is there로 물어요.'),c('a cafe','카페 한 곳','무엇','대상을 넣어요.'),c('nearby','근처에','어디','장소를 덧붙여요.')],'?'),
      q('물을 권하는 자연스러운 표현은?',[['Would you like some water?','물을 권하며 some을 쓰는 질문도 자연스러워요. 질문에는 무조건 any만 쓰는 게 아니에요.'],['Would you like many water?','이 뜻의 water에 many를 쓰지 않아요.'],['Would you like a water glass of?','물 한 잔은 a glass of water라는 순서예요.']],0,["I'm thirsty.",'목말라요.'])
    ], sources:['nouns','invitations'],
  },
].map(expandLesson);
