import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Check, Headphones, Leaf, Lightbulb, MessageCircle, RefreshCw, RotateCcw, Sparkles, Volume2, X } from 'lucide-react';
import Buddy from './Buddy.jsx';
import { dayKey, quizChoices, recordReview } from './model.js';
import { audioLabel, hasAudioFile, playWord, stopAudio } from './audio.js';
import { dailyPlan, exampleWord, matchesAnswer, memoryGrowth, recordPractice, restoreCourse, sentenceGap, serializeCourse } from './learning.js';
import './today.css';

const stages = [['card','단어 떠올리기',BookOpen],['reverse','반대로 말하기',RotateCcw],['listening','소리로 기억하기',Headphones],['sentence','문장 완성하기',MessageCircle],['speaking','따라 말하기',Volume2]];

export function Growth({words,saved}) {
  const growth=memoryGrowth(words,saved);
  return <section className="memory-garden"><span className="eyebrow">MY LITTLE GARDEN</span><h2><Leaf size={20}/>기억이 자라고 있어요</h2><div className="growth-numbers"><div><strong>{growth.seen.toLocaleString()}</strong><span>만나본 단어</span></div><div><strong>{growth.independent.toLocaleString()}</strong><span>힌트 없이 연습 성공</span></div><div><strong>{growth.retained.toLocaleString()}</strong><span>하루 뒤에도 기억</span></div></div><p>‘하루 뒤에도 기억’은 24시간 이상 지난 뒤<br/>다시 ‘알아요’를 고른 단어예요.</p></section>;
}

export default function Today({words,saved,setSaved,audioIndex,audioLoadState,onBrowse,now}) {
  const plan=useMemo(()=>dailyPlan(words,saved,now),[words,saved,now]);
  const courseKey=`moru-course-v1-${words[0]?.lang}`;
  const initial=useMemo(()=>{try{return restoreCourse(localStorage.getItem(courseKey),words);}catch{return null;}},[]);
  const [course,setCourse]=useState(initial?.course || null);
  const [position,setPosition]=useState(initial?.position || 0);
  const [results,setResults]=useState(initial?.results || []);
  const [active,setActive]=useState(false);
  useEffect(()=>{
    try {
      if(course && position<course.length)localStorage.setItem(courseKey,serializeCourse(course,position,results));
      else localStorage.removeItem(courseKey);
    } catch { /* Completed word progress is independently persisted by the app. */ }
  },[course,position,results,courseKey]);
  const totalToday=saved.days[dayKey(new Date(now))]?.length || 0;
  const remainingSteps=course?.slice(position) || [];
  const counts=course?[[BookOpen,remainingSteps.filter(step=>step.type==='card').length,'남은 단어'],[Headphones,remainingSteps.filter(step=>step.type!=='card').length,'남은 연습'],[Check,position,'완료한 단계']]:[[RotateCcw,plan.review.length,'복습'],[Lightbulb,plan.difficult.length,'헷갈린 단어'],[Leaf,plan.newWords.length,'새 단어']];
  const begin=()=>{
    if(course && position<course.length){setActive(true);window.scrollTo(0,0);return;}
    const reviewIds=new Set(plan.review.map(w=>w.id));
    const difficultIds=new Set(plan.difficult.map(w=>w.id));
    const practice=plan.words.slice(0,5);
    const sentences=plan.words.filter(w=>sentenceGap(w)).slice(0,2);
    setCourse([
      ...plan.words.map(word=>({type:'card',word,label:reviewIds.has(word.id)?'복습할 단어':difficultIds.has(word.id)?'헷갈렸던 단어':'새로운 단어'})),
      ...practice.slice(0,3).map(word=>({type:'reverse',word})),
      ...practice.filter(w=>hasAudioFile(audioIndex,w)).slice(0,3).map(word=>({type:'listening',word,choices:quizChoices(word,words.filter(w=>w.tags.includes('essential')))})),
      ...sentences.map(word=>({type:'sentence',word})),
      ...sentences.filter(w=>hasAudioFile(audioIndex,exampleWord(w))).map(word=>({type:'speaking',word}))
    ]);
    setPosition(0);setResults([]);setActive(true);window.scrollTo(0,0);
  };
  const finishStep=(rating,assisted=false)=>{
    const step=course[position];
    if(rating!=='skip')setSaved(s=>step.type==='card'?recordReview(s,step.word.id,rating):recordPractice(s,step.word.id,step.type,rating!=='again',assisted));
    setResults(x=>[...x,{type:step.type,rating,assisted}]);
    setPosition(x=>x+1);window.scrollTo({top:0,behavior:'instant'});
  };
  const exit=()=>{stopAudio();setActive(false);if(course && position>=course.length)setCourse(null);};
  if(course && position>=course.length)return <div className="today-finish"><Buddy celebrate/><span className="eyebrow">TODAY, A LITTLE BETTER</span><h2>오늘의 기억을 심었어요!</h2><p>단어 {results.filter(x=>x.type==='card'&&x.rating!=='skip').length}개와 추가 연습 {results.filter(x=>x.type!=='card'&&x.rating!=='skip').length}개를 마쳤어요.</p>{results.some(x=>x.type!=='speaking'&&(x.assisted||x.rating==='again'))&&<p>헷갈렸거나 힌트를 본 단어는 더 일찍 복습해요.</p>}{results.some(x=>x.rating==='skip')&&<p>건너뛴 문제는 채점하지 않았어요.</p>}<Growth words={words} saved={saved}/><button className="primary-button" onClick={exit}>오늘의 학습으로<ArrowRight size={17}/></button><button className="text-button" onClick={onBrowse}>단어장 자유롭게 둘러보기</button></div>;
  if(course && active)return <section className="guided-session"><div className="guided-top"><span>{stages.find(s=>s[0]===course[position].type)[1]} <b>전체 연습 {position+1} / {course.length}</b></span><button className="text-button" onClick={exit}>잠시 쉬기 <X size={15}/></button></div><div className="guided-progress"><i style={{width:`${position/course.length*100}%`}}/></div><div className="journey-tabs" aria-label="학습 단계">{stages.filter(s=>course.some(c=>c.type===s[0])).map(([id,label,Icon])=><span key={id} aria-current={course[position].type===id?'step':undefined} className={course[position].type===id?'active':''}><Icon size={15}/>{label}</span>)}</div><PracticeStep key={position} step={course[position]} audioIndex={audioIndex} speed={saved.speed} onDone={finishStep}/></section>;
  return <div className="today-grid"><section className="today-plan"><div className="today-plan-top"><span className="plan-pill"><Sparkles size={15}/>나를 위한 오늘의 코스</span><span>오늘 {totalToday} / {saved.goal}단어</span></div><h2>{course?'하던 공부를 이어서,':plan.words.length?'오늘은 '+plan.words.length+'개부터,':'오늘의 새 단어는 여기까지,'}<br/><em>{course?'차근차근 마무리해요.':plan.words.length?'천천히 기억해 볼까요?':'잘 쌓아가고 있어요.'}</em></h2><p>복습부터 시작해서, 직접 떠올리고<br/>소리와 문장으로 한 번 더 만나요.</p><button disabled={audioLoadState==='loading'} className="primary-button today-start" onClick={course||plan.words.length?begin:onBrowse}>{audioLoadState==='loading'?'음성 파일 목록 준비 중…':course?`이어서 공부 ${position+1} / ${course.length}`:plan.words.length?'오늘 공부 시작':'단어장 자유 학습'}<ArrowRight size={20}/></button><div className="plan-counts">{counts.map(([Icon,count,label])=><div key={label}><Icon size={20}/><strong>{count}</strong><span>{label}</span></div>)}</div>{!course&&plan.remainingDue>0&&<p className="plan-note">이번 코스 뒤에 복습할 단어가 {plan.remainingDue}개 더 있어요.</p>}<p className="plan-note">중간에 쉬어도 완료한 단어의 기록은 남아요.</p><div className="new-word-settings"><label>하루 새 단어 <small>두 언어 합산 · 오늘 {plan.newToday}개</small></label><div>{[5,10,15].map(count=><button key={count} aria-pressed={(saved.newWordLimit||10)===count} onClick={()=>setSaved(s=>({...s,newWordLimit:count}))}>{count}개</button>)}</div></div></section><aside className="today-aside"><Growth words={words} saved={saved}/><div className="today-tip"><Buddy/><div><strong>정답 보기 전에, 잠깐!</strong><p>머릿속으로 떠올리거나 소리 내어 말해 보세요. 한글 힌트는 필요할 때 열 수 있어요.</p></div></div></aside><section className="course-map"><div><span className="eyebrow">SMALL STEPS, REAL PRACTICE</span><h2>한 단어를 여러 방법으로</h2></div><div className="course-stages">{stages.map(([id,label,Icon],i)=><div key={id}><span><Icon size={21}/></span><small>0{i+1}</small><strong>{label}</strong></div>)}</div><p>추가 연습은 코스에서 최대 5개 단어로 진행해요. 듣기는 음성 파일이 있는 단어, 문장 연습은 준비된 예문으로 구성해요.</p></section></div>;
}

function PracticeStep({step,audioIndex,speed,onDone}) {
  const {type,word}=step;
  const [revealed,setRevealed]=useState(false);
  const [hint,setHint]=useState(false);
  const [typed,setTyped]=useState('');
  const [heard,setHeard]=useState(false);
  const [busy,setBusy]=useState(false);
  const [failed,setFailed]=useState(false);
  const [status,setStatus]=useState('');
  const [chosen,setChosen]=useState(null);
  const token=useRef(0);
  const done=useRef(false);
  const gap=type==='sentence'?sentenceGap(word):null;
  useEffect(()=>()=>{token.current++;stopAudio();},[]);
  const listen=async(slow=false)=>{
    if(busy)return;
    const active=++token.current;setBusy(true);setFailed(false);
    const target=type==='speaking'?exampleWord(word):word;
    const ok=await playWord(target,audioIndex,slow?.75:speed,message=>{if(token.current===active)setStatus(message);},{filesOnly:type==='listening'||type==='speaking'});
    if(token.current!==active)return;
    setBusy(false);setFailed(!ok);if(ok)setHeard(true);
  };
  const complete=(rating,assisted=hint)=>{if(done.current)return;done.current=true;stopAudio();onDone(rating,assisted);};
  const reveal=()=>setRevealed(true);
  const audioControls=<div className="practice-audio"><button className="secondary-button" disabled={busy} onClick={()=>listen()}><Volume2 size={18}/>{heard?'다시 듣기':'발음 듣기'}</button><button className="text-button" disabled={busy} onClick={()=>listen(true)}>천천히 0.75×</button><span className="audio-live" role="status">{status}</span></div>;
  const hintButton=word.hint&&<button className="text-button" onClick={()=>setHint(true)}><Lightbulb size={16}/>{hint?word.hint:'한글 힌트 보기'}</button>;
  const selfRating=<div className="practice-rating"><button onClick={()=>complete('again')}><RefreshCw size={18}/>아직 헷갈려요</button><button onClick={()=>complete(hint?'hard':'good')}><Check size={18}/>{hint?'힌트로 떠올렸어요':'스스로 떠올렸어요'}</button></div>;
  return <div className="practice-card">
    <span className="eyebrow">{step.label||{reverse:'뜻을 보고 외국어를 떠올려요',listening:'먼저 소리만 들어보세요',sentence:'배운 단어를 문장 속으로',speaking:'한 문장, 내 목소리로'}[type]}</span>
    {type==='card'&&<><h2 lang={word.lang}>{word.word}</h2>{word.lang==='ja'&&word.reading!==word.word&&<p className="practice-reading">{word.reading}</p>}{hintButton}{revealed?<div className="recall-answer"><strong>{word.meaning}</strong>{audioControls}<p>정답을 보기 전에 얼마나 떠올렸나요?</p>{selfRating}</div>:<><p className="practice-instruction">아는 단어라면 뜻을 먼저 떠올려 보세요.</p><button className="primary-button" onClick={reveal}>뜻 확인하기<ArrowRight size={17}/></button></>}</>}
    {type==='reverse'&&<><h2 className="korean-prompt">{word.meaning}</h2><p className="practice-instruction">{word.lang==='en'?'영어로 입력하거나, 소리 내어 말해 보세요.':'일본어로 먼저 말해 보세요. 입력은 선택이에요.'}</p>{!revealed&&<><input className="practice-input" value={typed} onChange={e=>setTyped(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.nativeEvent.isComposing)reveal();}} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label="떠올린 외국어 단어" placeholder="떠올린 단어를 적어보세요 (선택)"/>{hintButton}<button className="primary-button" onClick={reveal}>정답 확인하기<ArrowRight size={17}/></button></>}{revealed&&<div className="recall-answer"><strong lang={word.lang}>{word.word}</strong>{word.reading!==word.word&&<p>{word.reading}</p>}{typed&&<p>{matchesAnswer(typed,word.word)?'입력한 단어가 맞아요!':`내가 입력한 표현: ${typed} · 정답과 비교해 보세요.`}</p>}{audioControls}{selfRating}</div>}</>}
    {type==='listening'&&<><button className="listen-orb" onClick={()=>listen()} disabled={busy} aria-label="연습 발음 듣기"><Headphones size={38}/></button><h2 className="listening-prompt">어떤 뜻일까요?</h2><button className="text-button" disabled={busy} onClick={()=>listen(true)}>천천히 다시 듣기 0.75×</button><p className="audio-live" role="status">{status||'먼저 듣기 버튼을 눌러주세요.'}</p>{heard&&!chosen&&<button className="text-button" onClick={()=>setHint(true)}><Lightbulb size={16}/>{hint?word.word:'글자 힌트 보기'}</button>}<div className="guided-choices">{step.choices.map(option=><button key={option.id} disabled={!heard||!!chosen} className={chosen&&option.id===word.id?'correct':chosen===option.id?'incorrect':''} onClick={()=>setChosen(option.id)}>{option.meaning}</button>)}</div>{chosen&&<div className="practice-feedback"><strong>{chosen===word.id?'맞았어요!':'다음엔 기억할 수 있어요.'}</strong><p>{word.word} — {word.meaning}</p>{hint&&<p>힌트를 썼으니 한 번 더 복습해요.</p>}<button className="primary-button" onClick={()=>complete(chosen===word.id?(hint?'hard':'good'):'again')}>다음 연습<ArrowRight size={17}/></button></div>}{failed&&!heard&&<button className="text-button" onClick={()=>complete('skip')}>재생 없이 건너뛰기</button>}</>}
    {type==='sentence'&&<><p className="sentence-translation">{word.exampleKo}</p><h2 className="sentence-gap" lang={word.lang}>{gap.before}<mark>{revealed?gap.answer:'________'}</mark>{gap.after}</h2>{!revealed?<><input className="practice-input" value={typed} onChange={e=>setTyped(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.nativeEvent.isComposing)reveal();}} autoComplete="off" spellCheck={false} aria-label="문장 빈칸 정답" placeholder="빈칸을 채우거나 소리 내어 말해 보세요"/>{hintButton}<button className="primary-button" onClick={reveal}>문장 확인하기<ArrowRight size={17}/></button></>:<div className="recall-answer"><p>{typed?(matchesAnswer(typed,gap.answer)?'빈칸에 딱 맞는 단어예요!':`내 답: ${typed} · 문장 속 표현과 비교해 보세요.`):'떠올렸던 표현과 문장을 비교해 보세요.'}</p>{selfRating}</div>}</>}
    {type==='speaking'&&<><h2 className="sentence-gap" lang={word.lang}>{word.example}</h2><p className="sentence-translation">{word.exampleKo}</p>{audioControls}<p className="practice-instruction">한 번 듣고, 문장을 소리 내어 따라 말해 보세요.<br/>발음 평가는 스스로 해요. 마이크 녹음은 하지 않아요.</p><div className="practice-rating"><button onClick={()=>complete('skip')}>이번에는 건너뛰기</button><button disabled={!heard} onClick={()=>complete('good',true)}><Check size={18}/>듣고 따라 말했어요</button></div></>}
    {type!=='listening'&&type!=='speaking'&&<p className="practice-source">{audioLabel(audioIndex,word)} · 힌트는 복습에 반영돼요</p>}
  </div>;
}
