import { dayKey, recordReview, shuffle } from './model.js';
import { hasAudioFile } from './audio.js';

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

export function recordPractice(saved, id, kind, correct, assisted = false, now = Date.now(), { retry = false } = {}) {
  const previous = saved.practice?.[id]?.[kind] || { attempts:0,correct:0,independent:0 };
  const result = { attempts:previous.attempts+1,correct:previous.correct+Number(correct),independent:previous.independent+Number(correct&&!assisted),updated:now };
  // Same-session drills do not repeatedly double the spaced-review interval.
  const revised = kind==='speaking' ? saved
    : !correct ? recordReview(saved,id,'again',now)
    : assisted || retry ? recordReview(saved,id,'hard',now)
    : kind==='meaning' || !saved.progress[id] ? recordReview(saved,id,'good',now)
    : saved;
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

const normalizeOption = value => String(value || '').normalize('NFKC').trim().toLocaleLowerCase().replace(/[.!?。！？]+$/,'').replace(/\s+/g,' ');
const hiragana = value => normalizeOption(value).replace(/[ァ-ヶ]/g,char=>String.fromCharCode(char.charCodeAt(0)-0x60));

export function matchesWordAnswer(input,word,expected=word.word) {
  if(!input.trim())return false;
  if(word.lang!=='ja')return matchesAnswer(input,expected);
  return [expected,word.reading].filter(Boolean).some(answer=>hiragana(input)===hiragana(answer));
}

export function practiceChoices(word,pool,type='card',random=Math.random) {
  const foreign=type==='reverse'||type==='sentence';
  const key=w=>normalizeOption(foreign?w.word:w.meaning);
  const used=new Set([key(word)]);
  const readings=new Set([hiragana(word.reading || word.word)]);
  const choices=[];
  for(const candidate of shuffle(pool,random)){
    if(candidate.id===word.id || normalizeOption(candidate.meaning)===normalizeOption(word.meaning) || used.has(key(candidate)))continue;
    const reading=hiragana(candidate.reading || candidate.word);
    if(foreign&&readings.has(reading))continue;
    choices.push(candidate);used.add(key(candidate));readings.add(reading);
    if(choices.length===3)break;
  }
  return shuffle([word,...choices],random);
}

export function buildCourse(plan,words,audioIndex,random=Math.random) {
  const pool=words.filter(word=>word.tags.includes('essential'));
  const options=pool.length>=4?pool:words;
  const step=(type,word)=>({type,word,choices:type==='speaking'?undefined:practiceChoices(word,options,type,random)});
  const practice=plan.words.slice(0,5);
  const sentences=plan.words.filter(word=>sentenceGap(word)).slice(0,2);
  return [
    ...plan.words.map(word=>({...step('card',word),isNew:plan.newWords.some(item=>item.id===word.id)})),
    ...practice.slice(0,3).map(word=>step('reverse',word)),
    ...practice.filter(word=>hasAudioFile(audioIndex,word)).slice(0,3).map(word=>step('listening',word)),
    ...sentences.map(word=>step('sentence',word)),
    ...sentences.filter(word=>hasAudioFile(audioIndex,exampleWord(word))).map(word=>step('speaking',word))
  ];
}

export function retryCourse(course,position,rating,assisted=false,random=Math.random) {
  const step=course[position];
  if(!step || step.retry || step.type==='speaking' || rating==='skip' || (rating!=='again'&&!assisted))return course;
  if(course.some(item=>item.retry&&item.type===step.type&&item.word.id===step.word.id))return course;
  return [...course,{...step,isNew:false,retry:true,choices:shuffle(step.choices,random)}];
}

export function courseScore(results) {
  const first=results.filter(result=>result.type!=='speaking'&&!result.retry&&!result.legacy&&result.rating!=='skip');
  const retries=results.filter(result=>result.retry&&result.rating!=='skip');
  return {
    correct:first.filter(result=>result.rating==='good'&&!result.assisted).length,
    total:first.length,
    assisted:first.filter(result=>result.assisted&&result.rating!=='again').length,
    retried:retries.length,
    recovered:retries.filter(result=>result.rating!=='again').length,
    words:new Set(results.filter(result=>result.type==='card'&&result.rating!=='skip').map(result=>result.id)).size
  };
}

export function restoreCourse(raw,words,now=Date.now()) {
  try {
    const saved=JSON.parse(raw);
    if(![1,2].includes(saved?.version) || saved.day!==dayKey(new Date(now)) || !Array.isArray(saved.steps) || !saved.steps.length || saved.steps.length>200 || !Number.isSafeInteger(saved.position) || saved.position<0 || saved.position>=saved.steps.length) return null;
    const lookup=new Map(words.map(w=>[w.id,w]));
    const allowed=['card','reverse','listening','sentence','speaking'];
    const pool=words.filter(word=>word.tags.includes('essential'));
    const course=saved.steps.map(step=>{
      const word=lookup.get(step.id);
      if(!word || !allowed.includes(step.type))throw Error('Invalid lesson');
      if(step.type==='sentence' && !sentenceGap(word))throw Error('Missing example');
      if(step.type==='speaking' && !word.example)throw Error('Missing example');
      const choices=step.choices?.map(id=>lookup.get(id)) || (saved.version===1&&step.type!=='speaking'?practiceChoices(word,pool.length>=4?pool:words,step.type):undefined);
      if(step.type!=='speaking'){
        const foreign=['reverse','sentence'].includes(step.type);
        if(!choices || choices.length!==4 || choices.some(w=>!w) || !choices.some(w=>w.id===word.id) || new Set(choices.map(w=>normalizeOption(foreign?w.word:w.meaning))).size!==4)throw Error('Invalid choices');
      }
      return {type:step.type,word,choices,isNew:step.isNew===true,retry:step.retry===true};
    });
    if(!Array.isArray(saved.results) || saved.results.length!==saved.position || saved.results.some((r,i)=>r.type!==course[i].type||!['again','hard','good','skip'].includes(r.rating)))return null;
    const results=saved.results.map((result,i)=>({...result,id:course[i].word.id,retry:course[i].retry,assisted:result.assisted===true,legacy:result.legacy===true||saved.version===1}));
    return {course,position:saved.position,results};
  } catch { return null; }
}

export function serializeCourse(course,position,results,now=Date.now()) {
  return JSON.stringify({version:2,day:dayKey(new Date(now)),position,results,steps:course.map(step=>({id:step.word.id,type:step.type,isNew:step.isNew===true,retry:step.retry===true,choices:step.choices?.map(w=>w.id)}))});
}
