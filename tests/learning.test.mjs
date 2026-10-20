import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults,recordReview,normalizeState,mergeState } from '../src/model.js';
import { dailyPlan,recordPractice,memoryGrowth,sentenceGap,matchesAnswer,serializeCourse,restoreCourse } from '../src/learning.js';

const now=new Date(2026,9,20,12).getTime();
const words=Array.from({length:25},(_,i)=>({id:`en-${i}`,lang:'en',word:`word${i}`,rank:i,tags:['essential']}));
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
  const updated=recordPractice(recordReview(defaults(),'en-0','good',now),'en-0','reverse',true,false,now+10);
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
  const steps=[{type:'card',word:words[0]},{type:'reverse',word:words[0]}];
  const results=[{type:'card',rating:'good',assisted:false}];
  const serialized=serializeCourse(steps,1,results,now);
  const restored=restoreCourse(serialized,words,now);
  assert.equal(restored.position,1);assert.equal(restored.course[1].word.id,words[0].id);
  assert.deepEqual(restored.results,results);
  assert.equal(restoreCourse(serialized,words,now+86400000),null);
  assert.equal(restoreCourse(serialized,[],now),null);
});
