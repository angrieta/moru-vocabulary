import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults,dayKey,recordReview,normalizeState,mergeState } from '../src/model.js';
import { dailyPlan,recordPractice,memoryGrowth,sentenceGap,matchesAnswer,matchesWordAnswer,practiceChoices,buildCourse,retryCourse,courseScore,serializeCourse,restoreCourse } from '../src/learning.js';

const now=new Date(2026,9,20,12).getTime();
const words=Array.from({length:25},(_,i)=>({id:`en-${i}`,lang:'en',word:`word${i}`,meaning:`뜻${i}`,rank:i,tags:['essential']}));
test('daily plan puts due reviews first and respects the daily new-word cap across restarts',()=>{
  let saved={...defaults(),newWordLimit:5};
  saved=recordReview(saved,'en-20','again',now-86400000);
  let plan=dailyPlan(words,saved,now);
  assert.equal(plan.words[0].id,'en-20');assert.equal(plan.newWords.length,5);
  for(const word of plan.newWords)saved=recordReview(saved,word.id,'good',now);
  plan=dailyPlan(words,saved,now+1000);
  assert.equal(plan.newToday,5);assert.equal(plan.newWords.length,0);
});
test('same-day practice cannot inflate spaced repetition intervals or delayed-recall metrics',()=>{
  let saved=recordReview(defaults(),'en-0','good',now);
  saved=recordPractice(saved,'en-0','reverse',true,false,now+1000);
  saved=recordPractice(saved,'en-0','listening',true,false,now+2000);
  assert.equal(saved.progress['en-0'].interval,3);
  assert.deepEqual(memoryGrowth(words,saved),{seen:1,retained:0,independent:1});
  saved=recordReview(saved,'en-0','good',now+86400000);
  assert.equal(memoryGrowth(words,saved).retained,1);
});
test('assisted and wrong exercises schedule an earlier review while shadowing does not claim recall',()=>{
  let saved=recordReview(defaults(),'en-0','good',now);
  saved=recordPractice(saved,'en-0','listening',true,true,now+1);
  assert.equal(saved.progress['en-0'].interval,1);
  assert.equal(saved.practice['en-0'].listening.independent,0);
  saved=recordPractice(saved,'en-0','sentence',false,false,now+2);
  assert.equal(saved.progress['en-0'].due,now+2+600000);
  const before=saved.progress['en-0'];
  saved=recordPractice(saved,'en-0','speaking',true,true,now+3);
  assert.deepEqual(saved.progress['en-0'],before);
});
test('existing backups load and new practice history survives import/merge',()=>{
  const old={version:1,progress:{},favorites:[],days:{}};
  assert.equal(normalizeState(old).newWordLimit,10);
  const updated=recordPractice(recordReview(defaults(),'en-0','good',now),'en-0','meaning',true,false,now+10);
  assert.deepEqual(mergeState(defaults(),normalizeState(updated)).practice,updated.practice);
  assert.equal(normalizeState(updated).progress['en-0'].firstSeen,now);
});
test('sentence gaps use complete English words and leave other text intact',()=>{
  assert.deepEqual(sentenceGap({lang:'en',word:'water',example:'Water, please.'}),{before:'',answer:'Water',after:', please.'});
  assert.equal(sentenceGap({lang:'en',word:'a',example:'Water, please.'}),null);
  assert.deepEqual(sentenceGap({lang:'ja',word:'水',example:'水をください。'}),{before:'',answer:'水',after:'をください。'});
  assert.equal(matchesAnswer(' HELLO! ','hello'),true);
});
test('unfinished daily course resumes its exact position but expires the next day',()=>{
  const steps=['card','reverse'].map(type=>({type,word:words[0],choices:practiceChoices(words[0],words,type)}));
  const results=[{id:words[0].id,type:'card',rating:'good',assisted:false,retry:false,legacy:false}];
  const serialized=serializeCourse(steps,1,results,now);
  const restored=restoreCourse(serialized,words,now);
  assert.equal(restored.position,1);assert.equal(restored.course[1].word.id,words[0].id);
  assert.deepEqual(restored.results,results);
  assert.equal(restoreCourse(serialized,words,now+86400000),null);
  assert.equal(restoreCourse(serialized,[],now),null);
});

test('foreign answers accept Japanese kana readings and English punctuation, not Korean hints',()=>{
  const japanese={lang:'ja',word:'学校',reading:'がっこう',hint:'각코오'};
  assert.equal(matchesWordAnswer('学校',japanese),true);
  assert.equal(matchesWordAnswer(' がっこう ',japanese),true);
  assert.equal(matchesWordAnswer('ガッコウ',japanese),true);
  assert.equal(matchesWordAnswer('ｶﾞｯｺｳ',japanese),true);
  assert.equal(matchesWordAnswer('각코오',japanese),false);
  assert.equal(matchesWordAnswer('',japanese),false);
  assert.equal(matchesWordAnswer('がこう',japanese),false);
  assert.equal(matchesWordAnswer(' WATER! ',{lang:'en',word:'water'},'Water'),true);
  assert.equal(matchesWordAnswer('waters',{lang:'en',word:'water'}),false);
});

test('four choices contain one target and exclude duplicate meanings, words and Japanese readings',()=>{
  const target={id:'ja-a',lang:'ja',word:'水',reading:'みず',meaning:'물'};
  const pool=[target,
    {id:'ja-b',word:'みず',reading:'ミズ',meaning:'민물'},
    {id:'ja-c',word:'ウォーター',reading:'ウォーター',meaning:'물'},
    {id:'ja-d',word:'学校',reading:'がっこう',meaning:'학교'},
    {id:'ja-e',word:'空',reading:'そら',meaning:'하늘'},
    {id:'ja-f',word:'火',reading:'ひ',meaning:'불'},
    {id:'ja-g',word:'火',reading:'ひ',meaning:'불꽃'},
  ];
  for(const type of ['card','reverse','sentence','listening']){
    const choices=practiceChoices(target,pool,type,()=>.5);
    assert.equal(choices.length,4);
    assert.equal(choices.filter(w=>w.id===target.id).length,1);
    assert.equal(new Set(choices.map(w=>['reverse','sentence'].includes(type)?w.word:w.meaning)).size,4);
    assert.equal(choices.some(w=>w.id==='ja-c'),false);
    if(['reverse','sentence'].includes(type))assert.equal(choices.some(w=>w.id==='ja-b'),false);
  }
});

test('daily course adds graded choices to all quiz stages without requiring audio to begin',()=>{
  const withExample=[{...words[0],example:'word0 here.',exampleKo:'예문'},...words.slice(1)];
  const plan=dailyPlan(withExample,{...defaults(),newWordLimit:5},now);
  const course=buildCourse(plan,withExample,{},()=>.5);
  assert.equal(course.filter(step=>step.type==='card').length,5);
  assert.equal(course.filter(step=>step.type==='reverse').length,3);
  assert.equal(course.filter(step=>step.type==='sentence').length,1);
  assert.equal(course.filter(step=>step.type==='listening'||step.type==='speaking').length,0);
  assert.equal(course.every(step=>step.choices.length===4),true);
  assert.equal(course[0].isNew,true);
});

test('a missed or assisted question repeats once at the end, and resumes with that exact queue',()=>{
  const base=buildCourse(dailyPlan(words,{...defaults(),newWordLimit:5},now),words,{},()=>.5);
  const wrong=retryCourse(base,0,'again',false,()=>.5);
  assert.equal(wrong.length,base.length+1);
  assert.equal(wrong.at(-1).word.id,base[0].word.id);
  assert.equal(wrong.at(-1).retry,true);
  assert.equal(wrong.at(-1).isNew,false);
  assert.equal(retryCourse(wrong,0,'again'),wrong);
  assert.equal(retryCourse(wrong,wrong.length-1,'again'),wrong);
  assert.equal(retryCourse(base,0,'good',false),base);
  assert.equal(retryCourse(base,0,'skip'),base);
  assert.equal(retryCourse(base,0,'hard',true).length,base.length+1);
  const results=[{id:words[0].id,type:'card',rating:'again',assisted:false,retry:false}];
  const resumed=restoreCourse(serializeCourse(wrong,1,results,now),words,now);
  assert.equal(resumed.position,1);
  assert.deepEqual(resumed.course.at(-1).choices.map(w=>w.id),wrong.at(-1).choices.map(w=>w.id));
  assert.equal(resumed.course.at(-1).retry,true);
});

test('quiz score excludes retries, old self-ratings and shadowing, and counts each word once',()=>{
  const results=[
    {id:'en-0',type:'card',rating:'again'},
    {id:'en-1',type:'card',rating:'good'},
    {id:'en-1',type:'reverse',rating:'hard',assisted:true},
    {id:'en-2',type:'listening',rating:'skip'},
    {id:'en-0',type:'card',rating:'good',retry:true},
    {id:'en-1',type:'speaking',rating:'good'},
    {id:'en-0',type:'reverse',rating:'good',legacy:true},
  ];
  assert.deepEqual(courseScore(results),{correct:1,total:3,assisted:1,retried:1,recovered:1,words:2});
});

test('quiz results update review scheduling and retry success keeps an early review',()=>{
  let saved=recordPractice(defaults(),'en-0','meaning',false,false,now);
  assert.equal(saved.progress['en-0'].due,now+600000);
  saved=recordPractice(saved,'en-0','meaning',true,false,now+1000,{retry:true});
  assert.equal(saved.progress['en-0'].interval,1);
  assert.equal(saved.progress['en-0'].retained,0);
  assert.equal(saved.days[dayKey(new Date(now))].length,1);
  saved=recordPractice(saved,'en-1','meaning',true,false,now+2000);
  assert.equal(saved.progress['en-1'].interval,3);
  saved=recordPractice(saved,'en-1','reverse',true,false,now+3000);
  assert.equal(saved.progress['en-1'].interval,3);
});

test('old course snapshots migrate to quizzes without treating past self-ratings as quiz scores',()=>{
  const old=JSON.stringify({version:1,day:dayKey(new Date(now)),position:1,
    steps:[{id:words[0].id,type:'card'},{id:words[0].id,type:'reverse'}],
    results:[{type:'card',rating:'good'}]});
  const restored=restoreCourse(old,words,now);
  assert.equal(restored.position,1);
  assert.equal(restored.course[1].choices.length,4);
  assert.equal(restored.results[0].legacy,true);
  assert.equal(courseScore(restored.results).total,0);
  const next=restoreCourse(serializeCourse(restored.course,1,restored.results,now),words,now);
  assert.equal(next.results[0].legacy,true);
  const invalid=JSON.parse(old);invalid.results[0].type='reverse';
  assert.equal(restoreCourse(JSON.stringify(invalid),words,now),null);
});

test('silent listening answers count as meaning practice without adding listening credit',()=>{
  const heard=recordPractice(defaults(),'en-0','listening',true,false,now);
  const silent=recordPractice(heard,'en-0','listening',true,false,now+1,{textMode:true});
  assert.deepEqual(silent.practice['en-0'].listening,heard.practice['en-0'].listening);
  assert.equal(silent.practice['en-0'].meaning.correct,1);
  assert.equal(silent.practice['en-0'].meaning.independent,1);
  const wrong=recordPractice(silent,'en-1','listening',false,false,now+2,{textMode:true});
  assert.equal(wrong.practice['en-1'].listening,undefined);
  assert.equal(wrong.practice['en-1'].meaning.correct,0);
  assert.equal(wrong.progress['en-1'].due,now+2+600000);
  assert.equal(normalizeState(wrong).practice['en-0'].meaning.independent,1);
});

test('silent course preferences and revealed questions survive resume and retry',()=>{
  const steps=words.slice(0,3).map(word=>({type:'listening',word,choices:practiceChoices(word,words),textMode:word.id==='en-0'}));
  const quiet=restoreCourse(serializeCourse(steps,0,[],now,{quietMode:true}),words,now);
  assert.equal(quiet.quietMode,true);
  assert.equal(quiet.course[0].textMode,true);
  const retry=retryCourse(quiet.course,0,'again');
  assert.equal(retry.at(-1).textMode,true);
  const results=[{id:'en-0',type:'listening',rating:'again',textMode:true}];
  const resumed=restoreCourse(serializeCourse(retry,1,results,now,{quietMode:false}),words,now);
  assert.equal(resumed.quietMode,false);
  assert.equal(resumed.course[1].textMode,undefined);
  assert.equal(resumed.course.at(-1).textMode,true);
  assert.equal(resumed.results[0].textMode,true);
  assert.equal(courseScore(resumed.results).total,1);
  const old=JSON.parse(serializeCourse(steps,0,[],now));delete old.quietMode;
  assert.equal(restoreCourse(JSON.stringify(old),words,now).quietMode,false);
});

test('standalone quiz recording preserves review scheduling for listening and silent answers',()=>{
  const prior=recordReview(defaults(),'en-0','good',now-86400000);
  const heard=recordPractice(prior,'en-0','listening',true,false,now,{review:true});
  assert.deepEqual(heard.progress,recordReview(prior,'en-0','good',now).progress);
  const silent=recordPractice(prior,'en-0','listening',true,false,now,{review:true,textMode:true});
  assert.deepEqual(silent.progress,heard.progress);
  assert.equal(silent.practice['en-0'].listening,undefined);
  assert.equal(silent.practice['en-0'].meaning.correct,1);
});
