import { dayKey, recordReview } from './model.js';

export function dailyPlan(words, saved, now = Date.now()) {
  const today = new Set(saved.days[dayKey(new Date(now))] || []);
  const newToday = Object.values(saved.progress).filter(p => p.firstSeen && dayKey(new Date(p.firstSeen))===dayKey(new Date(now))).length;
  const newAllowance = Math.max(0,(saved.newWordLimit || 10)-newToday);
  const vocabulary = words.filter(w => !w.tags.includes('hiragana') && !w.tags.includes('katakana'));
  const due = vocabulary.filter(w => saved.progress[w.id]?.due <= now).sort((a,b) => saved.progress[a.id].due - saved.progress[b.id].due);
  const remaining = Math.max(0, saved.goal - today.size);
  const capacity = Math.max(5,remaining);
  const review = due.slice(0,capacity);
  const selected = new Set(review.map(w=>w.id));
  const difficult = vocabulary.filter(w => saved.progress[w.id] && saved.progress[w.id].lastRating!=='good' && !today.has(w.id) && !selected.has(w.id)).sort((a,b)=>saved.progress[b.id].lapses-saved.progress[a.id].lapses).slice(0,Math.min(3,capacity-review.length));
  const newWords = vocabulary.filter(w => !saved.progress[w.id]).sort((a,b)=>a.rank-b.rank).slice(0,Math.min(newAllowance,Math.max(0,capacity-review.length-difficult.length)));
  return { review,difficult,newWords,newToday,remainingDue:due.length-review.length,words:[...review,...difficult,...newWords] };
}

export function recordPractice(saved, id, kind, correct, assisted = false, now = Date.now()) {
  const previous = saved.practice?.[id]?.[kind] || { attempts:0,correct:0,independent:0 };
  const result = { attempts:previous.attempts+1,correct:previous.correct+Number(correct),independent:previous.independent+Number(correct&&!assisted),updated:now };
  // Same-session drills do not repeatedly double the spaced-review interval.
  const revised = kind==='speaking' ? saved : !correct ? recordReview(saved,id,'again',now) : assisted ? recordReview(saved,id,'hard',now) : saved;
  return { ...revised,practice:{...revised.practice,[id]:{...revised.practice?.[id],[kind]:result}} };
}

export function memoryGrowth(words,saved) {
  const seen=words.filter(w=>saved.progress[w.id]?.seen>0).length;
  const retained=words.filter(w=>saved.progress[w.id]?.retained>0).length;
  const independent=words.filter(w=>Object.values(saved.practice?.[w.id] || {}).some(p=>p.independent>0)).length;
  return {seen,retained,independent};
}

export function sentenceGap(word) {
  if (!word.example) return null;
  const escaped=word.word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const pattern=new RegExp(word.lang==='en'?`\\b${escaped}\\b`:escaped,word.lang==='en'?'i':'');
  const match=pattern.exec(word.example);
  if (!match) return null;
  return { before:word.example.slice(0,match.index),answer:match[0],after:word.example.slice(match.index+match[0].length) };
}

export function matchesAnswer(input,answer) {
  const normalize = value => value.normalize('NFKC').trim().toLocaleLowerCase().replace(/[.!?。！？]+$/,'').replace(/\s+/g,' ');
  return Boolean(input.trim()) && normalize(input) === normalize(answer);
}

export function exampleWord(word) {
  return { ...word,id:`${word.id}-example`,word:word.example,reading:word.example };
}

export function restoreCourse(raw,words,now=Date.now()) {
  try {
    const saved=JSON.parse(raw);
    if(saved?.version!==1 || saved.day!==dayKey(new Date(now)) || !Array.isArray(saved.steps) || !saved.steps.length || saved.steps.length>100 || !Number.isSafeInteger(saved.position) || saved.position<0 || saved.position>=saved.steps.length) return null;
    const lookup=new Map(words.map(w=>[w.id,w]));
    const allowed=['card','reverse','listening','sentence','speaking'];
    const course=saved.steps.map(step=>{
      const word=lookup.get(step.id);
      if(!word || !allowed.includes(step.type))throw Error('Invalid lesson');
      if(step.type==='sentence' && !sentenceGap(word))throw Error('Missing example');
      if(step.type==='speaking' && !word.example)throw Error('Missing example');
      const choices=step.choices?.map(id=>lookup.get(id));
      if(step.type==='listening' && (!choices || choices.some(w=>!w) || !choices.some(w=>w.id===word.id) || new Set(choices.map(w=>w.meaning)).size!==4))throw Error('Invalid choices');
      return {type:step.type,word,label:step.type==='card'?'이어서 익힐 단어':undefined,choices};
    });
    if(!Array.isArray(saved.results) || saved.results.length!==saved.position || saved.results.some(r=>!allowed.includes(r.type)||!['again','hard','good','skip'].includes(r.rating)))return null;
    return {course,position:saved.position,results:saved.results};
  } catch { return null; }
}

export function serializeCourse(course,position,results,now=Date.now()) {
  return JSON.stringify({version:1,day:dayKey(new Date(now)),position,results,steps:course.map(step=>({id:step.word.id,type:step.type,choices:step.choices?.map(w=>w.id)}))});
}
