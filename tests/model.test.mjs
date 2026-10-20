import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { defaults, dayKey, schedule, recordReview, mergeState, normalizeState, filterWords, makeSession, quizChoices, currentStreak } from '../src/model.js';

test('forgotten words are due after ten minutes; good recall grows the interval',()=>{
  const time=Date.UTC(2026,9,20,3);
  assert.equal(schedule(null,'again',time).due,time+600000);
  const good=schedule(null,'good',time);assert.equal(good.interval,3);
  assert.equal(schedule(good,'good',time).interval,6);
  assert.equal(schedule(good,'hard',time).interval,1);
});
test('daily count deduplicates repeated reviews without losing review history',()=>{
  const time=Date.now();let s=recordReview(defaults(),'ja-a','again',time);s=recordReview(s,'ja-a','good',time+1);
  assert.equal(s.days[dayKey(new Date(time))].length,1);assert.equal(s.progress['ja-a'].seen,2);assert.equal(s.progress['ja-a'].lapses,1);
});
test('backup merges keep newest progress and union favorites/day totals',()=>{
  let a=recordReview(defaults(),'en-hello','good',10000);a.favorites=['en-hello'];
  let b=recordReview(defaults(),'en-hello','again',5000);b=recordReview(b,'en-world','good',11000);b.favorites=['en-world'];
  const merged=mergeState(a,b);assert.equal(merged.progress['en-hello'].lastRating,'good');assert.equal(merged.favorites.length,2);assert.equal(Object.values(merged.days)[0].length,2);
  assert.throws(()=>normalizeState({version:2,progress:{}}));
});
test('malformed record fields cannot enter stored progress',()=>{
  const s=normalizeState({version:1,progress:{'en-bad':{due:'tomorrow',seen:1}},favorites:['en-good',42,null],goal:999});
  assert.deepEqual(s.progress,{});assert.deepEqual(s.favorites,['en-good']);assert.equal(s.goal,20);
});
test('review filters exclude future words, search finds Korean and a full deck remains browsable',()=>{
  const words=[{id:'en-a',word:'hello',meaning:'안녕',hint:'헬로',tags:['essential'],rank:1},{id:'en-b',word:'water',meaning:'물',tags:['frequent'],rank:2}];
  assert.equal(filterWords(words,{query:'물'}).length,1);
  assert.equal(filterWords(words,{view:'review',progress:{'en-a':{due:10},'en-b':{due:30}},now:20})[0].word,'hello');
  assert.equal(makeSession(words,{},words.length).length,2);
});
test('quiz choices have one correct answer even with repeated meanings',()=>{
  const word={id:'a',meaning:'물'};const choices=quizChoices(word,[word,{id:'b',meaning:'물'},{id:'c',meaning:'불'},{id:'d',meaning:'땅'},{id:'e',meaning:'바람'}],()=>.5);
  assert.equal(choices.length,4);assert.equal(new Set(choices.map(x=>x.meaning)).size,4);assert.equal(choices.filter(x=>x.id==='a').length,1);
});
test('streak includes yesterday until today is studied',()=>{
  assert.equal(currentStreak({'2026-10-18':['a'],'2026-10-19':['b']},new Date(2026,9,20,12)),2);
  assert.equal(currentStreak({'2026-10-18':['a']},new Date(2026,9,20,12)),0);
});
test('shipped vocabulary, category counts, audio attribution and stable IDs are consistent',()=>{
  const stats=JSON.parse(fs.readFileSync(new URL('../public/data/stats.json',import.meta.url)));
  for(const lang of ['ja','en']){
    const rows=JSON.parse(fs.readFileSync(new URL(`../public/data/${lang}.json`,import.meta.url)));
    assert.equal(new Set(rows.map(x=>x.id)).size,rows.length);assert.equal(rows.length,stats[lang].total);
    for(const row of rows){assert.ok(row.word&&row.meaning&&/[가-힣]/.test(row.meaning));assert.ok(row.source.startsWith('https://'));}
    assert.ok(rows.filter(x=>x.tags.includes('essential')).length>rows.filter(x=>x.tags.includes('conversation')).length);
  }
  const audio=JSON.parse(fs.readFileSync(new URL('../public/data/audio.json',import.meta.url)));
  for(const lang of ['ja','en'])for(const r of Object.values(audio[lang]))assert.ok(r.url.startsWith('https://')&&r.source&&r.author&&r.license&&r.licenseUrl);
});
