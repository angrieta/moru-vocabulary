import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { defaults, normalizeState, mergeState } from '../src/model.js';
import { normalizeWriting, penPoint, recordWriting } from '../src/writing.js';

test('self-assessed writing preserves quiz grades, daily goals and review schedules',()=>{
  const initial=defaults();
  const written=recordWriting(initial,'日','good',true,1000);
  assert.deepEqual(written.writing['日'],{attempts:1,recall:1,lastRating:'good',updated:1000});
  assert.equal(written.progress,initial.progress);
  assert.equal(written.days,initial.days);
  assert.equal(written.practice,initial.practice);
  const repeated=recordWriting(written,'日','again',true,2000);
  assert.equal(repeated.writing['日'].recall,1);
  assert.equal(repeated.writing['日'].attempts,2);
  assert.equal(recordWriting(repeated,'abc','good',true),repeated);
});
test('old backups remain valid and writing records round-trip and merge by date',()=>{
  const old=defaults(); delete old.writing;
  assert.deepEqual(normalizeState(old).writing,{});
  const recent=recordWriting(old,'日','good',true,2000);
  const older=recordWriting(recordWriting(old,'日','again',false,1000),'月','good',true,1000);
  assert.deepEqual(normalizeState(JSON.parse(JSON.stringify(recent))).writing,recent.writing);
  const merged=mergeState(recent,older);
  assert.equal(merged.writing['日'].lastRating,'good');
  assert.equal(merged.writing['月'].attempts,1);
  assert.deepEqual(normalizeWriting({'日':{attempts:1,recall:5,lastRating:'good',updated:1},'abc':{attempts:1,recall:0,lastRating:'again',updated:1}}),{});
});
test('pen coordinates are scale-independent and remain inside the writing square',()=>{
  assert.deepEqual(penPoint(150,250,{left:50,top:150,width:200,height:200}),[54.5,54.5]);
  assert.deepEqual(penPoint(250,350,{left:50,top:150,width:400,height:400}),[54.5,54.5]);
  assert.deepEqual(penPoint(-10,900,{left:50,top:150,width:200,height:200}),[0,109]);
  assert.equal(penPoint(0,0,{left:0,top:0,width:0,height:0}),null);
});
test('every bundled kanji has ordered strokes and covers all essential vocabulary characters',()=>{
  const data=JSON.parse(fs.readFileSync(new URL('../public/data/kanji.json',import.meta.url),'utf8'));
  const words=JSON.parse(fs.readFileSync(new URL('../public/data/ja.json',import.meta.url),'utf8'));
  const chars=new Set(data.entries.map(e=>e.char));
  assert.equal(chars.size,data.entries.length);
  assert.equal(data.license,'CC BY-SA 3.0');
  for(const entry of data.entries){
    assert.match(entry.char,/^\p{Script=Han}$/u);
    assert.ok(entry.strokes.length>0);
    assert.deepEqual(entry.numbers.map(n=>n[2]),entry.strokes.map((_,i)=>i+1));
    assert.ok(entry.strokes.every(d=>/^M/i.test(d)));
    assert.ok(entry.wordIds.every(id=>words.some(w=>w.id===id&&w.word.includes(entry.char))));
  }
  for(const word of words.filter(w=>w.tags.includes('essential')))for(const char of [...word.word].filter(c=>/\p{Script=Han}/u.test(c)))assert.ok(chars.has(char),char);
});
