import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, Headphones, Leaf, Lightbulb, MessageCircle, RotateCcw, Sparkles, Volume2, X } from 'lucide-react';
import Buddy from './Buddy.jsx';
import PracticeQuestion from './PracticeQuestion.jsx';
import { dayKey } from './model.js';
import { stopAudio } from './audio.js';
import { buildCourse, courseScore, dailyPlan, memoryGrowth, recordPractice, restoreCourse, retryCourse, serializeCourse } from './learning.js';
import './today.css';

const stages = [['card','뜻 맞히기',BookOpen],['reverse','단어 맞히기',RotateCcw],['listening','듣고 맞히기',Headphones],['sentence','빈칸 맞히기',MessageCircle],['speaking','따라 말하기',Volume2]];

export function Growth({words,saved}) {
  const growth=memoryGrowth(words,saved);
  return <section className="memory-garden"><span className="eyebrow">MY LITTLE GARDEN</span><h2><Leaf size={20}/>기억이 자라고 있어요</h2><div className="growth-numbers"><div><strong>{growth.seen.toLocaleString()}</strong><span>만나본 단어</span></div><div><strong>{growth.independent.toLocaleString()}</strong><span>힌트 없이 연습 성공</span></div><div><strong>{growth.retained.toLocaleString()}</strong><span>하루 뒤에도 기억</span></div></div><p>‘하루 뒤에도 기억’은 24시간 이상 지난 뒤<br/>퀴즈를 맞히거나 카드에서 ‘알아요’를 고른 단어예요.</p></section>;
}

export default function Today({words,saved,setSaved,audioIndex,audioLoadState,onBrowse,now}) {
  const plan=useMemo(()=>dailyPlan(words,saved,now),[words,saved,now]);
  const courseKey=`moru-course-v1-${words[0]?.lang}`;
  const initial=useMemo(()=>{try{return restoreCourse(localStorage.getItem(courseKey),words);}catch{return null;}},[]);
  const [course,setCourse]=useState(initial?.course || null);
  const [position,setPosition]=useState(initial?.position || 0);
  const [results,setResults]=useState(initial?.results || []);
  const [active,setActive]=useState(false);
  const score=courseScore(results);
  useEffect(()=>{
    try {
      if(course && position<course.length)localStorage.setItem(courseKey,serializeCourse(course,position,results));
      else localStorage.removeItem(courseKey);
    } catch { /* Completed word progress is independently persisted by the app. */ }
  },[course,position,results,courseKey]);
  const totalToday=saved.days[dayKey(new Date(now))]?.length || 0;
  const remainingSteps=course?.slice(position) || [];
  const counts=course?[[BookOpen,remainingSteps.filter(step=>step.type!=='speaking').length,'남은 문제'],[Headphones,remainingSteps.filter(step=>step.type==='speaking').length,'따라 말하기'],[Check,position,'완료한 단계']]:[[RotateCcw,plan.review.length,'복습'],[Lightbulb,plan.difficult.length,'헷갈린 단어'],[Leaf,plan.newWords.length,'새 단어']];
  const begin=()=>{
    if(course && position<course.length){setActive(true);window.scrollTo(0,0);return;}
    setCourse(buildCourse(plan,words,audioIndex));
    setPosition(0);setResults([]);setActive(true);window.scrollTo(0,0);
  };
  const finishStep=(rating,assisted=false)=>{
    const step=course[position];
    if(rating!=='skip')setSaved(s=>recordPractice(s,step.word.id,step.type==='card'?'meaning':step.type,rating!=='again',assisted,Date.now(),{retry:step.retry}));
    setCourse(current=>retryCourse(current,position,rating,assisted));
    setResults(x=>[...x,{id:step.word.id,type:step.type,retry:step.retry===true,rating,assisted}]);
    setPosition(x=>x+1);window.scrollTo({top:0,behavior:'instant'});
  };
  const exit=()=>{stopAudio();setActive(false);if(course && position>=course.length)setCourse(null);};
  if(course && position>=course.length)return <div className="today-finish">
    <Buddy celebrate/><span className="eyebrow">TODAY, A LITTLE BETTER</span><h2>오늘의 기억을 심었어요!</h2>
    <div className="course-score"><span>처음에 힌트 없이 맞힌 문제</span><strong>{score.correct}<small> / {score.total}</small></strong><p>단어 {score.words}개를 여러 방법으로 연습했어요.</p></div>
    {score.assisted>0&&<p>힌트의 도움을 받아 맞힌 문제 {score.assisted}개</p>}
    {score.retried>0&&<p>재도전 {score.retried}문제 중 {score.recovered}문제를 다시 맞혔어요.<br/>재도전은 처음 점수에 중복으로 더하지 않아요.</p>}
    {results.some(result=>result.legacy)&&<p>업데이트 전에 완료한 연습은 이번 퀴즈 점수에서 제외했어요.</p>}
    <p>따라 말하기와 건너뛴 문제는 점수에서 제외해요.</p>
    <Growth words={words} saved={saved}/><button className="primary-button" onClick={exit}>오늘의 학습으로<ArrowRight size={17}/></button><button className="text-button" onClick={onBrowse}>단어장 자유롭게 둘러보기</button>
  </div>;
  if(course && active)return <section className="guided-session"><div className="guided-top"><span>{stages.find(s=>s[0]===course[position].type)[1]} <b>전체 연습 {position+1} / {course.length}</b></span><button className="text-button" onClick={exit}>잠시 쉬기 <X size={15}/></button></div><div className="guided-progress"><i style={{width:`${position/course.length*100}%`}}/></div><div className="journey-tabs" aria-label="학습 단계">{stages.filter(s=>course.some(c=>c.type===s[0])).map(([id,label,Icon])=><span key={id} aria-current={course[position].type===id?'step':undefined} className={course[position].type===id?'active':''}><Icon size={15}/>{label}</span>)}</div><PracticeQuestion key={position} step={course[position]} audioIndex={audioIndex} speed={saved.speed} onDone={finishStep}/>{course.slice(position+1).some(step=>step.retry)&&<p className="retry-note">헷갈린 문제는 코스 끝에서 다시 나와요.</p>}</section>;
  return <div className="today-grid"><section className="today-plan"><div className="today-plan-top"><span className="plan-pill"><Sparkles size={15}/>나를 위한 오늘의 코스</span><span>오늘 {totalToday} / {saved.goal}단어</span></div><h2>{course?'하던 공부를 이어서,':plan.words.length?'오늘은 '+plan.words.length+'개부터,':'오늘의 새 단어는 여기까지,'}<br/><em>{course?'차근차근 마무리해요.':plan.words.length?'천천히 기억해 볼까요?':'잘 쌓아가고 있어요.'}</em></h2><p>먼저 떠올리고, 퀴즈로 확인해요.<br/>헷갈린 문제는 끝에서 다시 도전해요.</p><button disabled={audioLoadState==='loading'} className="primary-button today-start" onClick={course||plan.words.length?begin:onBrowse}>{audioLoadState==='loading'?'음성 파일 목록 준비 중…':course?`이어서 공부 ${position+1} / ${course.length}`:plan.words.length?'오늘 공부 시작':'단어장 자유 학습'}<ArrowRight size={20}/></button><div className="plan-counts">{counts.map(([Icon,count,label])=><div key={label}><Icon size={20}/><strong>{count}</strong><span>{label}</span></div>)}</div>{!course&&plan.remainingDue>0&&<p className="plan-note">이번 코스 뒤에 복습할 단어가 {plan.remainingDue}개 더 있어요.</p>}<p className="plan-note">중간에 쉬어도 완료한 단어의 기록은 남아요.</p><div className="new-word-settings"><label>하루 새 단어 <small>두 언어 합산 · 오늘 {plan.newToday}개</small></label><div>{[5,10,15].map(count=><button key={count} aria-pressed={(saved.newWordLimit||10)===count} onClick={()=>setSaved(s=>({...s,newWordLimit:count}))}>{count}개</button>)}</div></div></section><aside className="today-aside"><Growth words={words} saved={saved}/><div className="today-tip"><Buddy/><div><strong>보기 열기 전에, 잠깐!</strong><p>머릿속으로 답하거나 직접 입력해 보세요. 처음 보는 단어는 정답을 익힌 뒤 다시 풀면 돼요.</p></div></div></aside><section className="course-map"><div><span className="eyebrow">SMALL STEPS, REAL PRACTICE</span><h2>한 단어를 여러 방법으로</h2></div><div className="course-stages">{stages.map(([id,label,Icon],i)=><div key={id}><span><Icon size={21}/></span><small>0{i+1}</small><strong>{label}</strong></div>)}</div><p>뜻 → 단어 → 소리 → 문장으로 바꿔 가며 풀어요. 추가 연습은 최대 5개 단어, 문장은 준비된 예문으로 구성해요. 따라 말하기는 선택이에요.</p></section></div>;
}
