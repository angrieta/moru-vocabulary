import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Check, CircleCheck, Headphones, RefreshCw, Volume2, X } from 'lucide-react';
import Buddy from './Buddy.jsx';
import { quizChoices, recordReview, shuffle } from './model.js';
import { hasAudioFile, playWord, stopAudio } from './audio.js';

const levels = [['essential','진짜 중요한 단어'],['conversation','바로 쓰는 회화'],['frequent','자주 쓰는 단어'],['advanced','어려운 단어']];
const format = n => n.toLocaleString('ko-KR');

export default function Quiz({ words, audioIndex, audioLoadState, onRetryAudio, saved, setSaved }) {
  const [mode,setMode] = useState('meaning');
  const [level,setLevel] = useState('essential');
  const [questions,setQuestions] = useState(null);
  const [position,setPosition] = useState(0);
  const [answers,setAnswers] = useState([]);
  const [chosen,setChosen] = useState(null);
  const [heard,setHeard] = useState(false);
  const [audioStatus,setAudioStatus] = useState('');
  const [audioLoading,setAudioLoading] = useState(false);
  const [audioFailed,setAudioFailed] = useState(false);
  const [hintShown,setHintShown] = useState(false);
  const [assistedCount,setAssistedCount] = useState(0);
  const answerLock = useRef(false);
  const playback = useRef(0);
  const pool = useMemo(() => words.filter(w => w.tags.includes(level) && !w.tags.includes('hiragana') && !w.tags.includes('katakana')), [words,level]);
  const available = useMemo(() => mode === 'listening' ? pool.filter(w => hasAudioFile(audioIndex,w)) : pool, [pool,mode,audioIndex]);
  const canStart = available.length > 0 && new Set(pool.map(w => w.meaning)).size >= 4 && (mode !== 'listening' || audioLoadState !== 'loading');
  const question = questions?.[position];

  const resetAudio = () => {
    playback.current++;
    stopAudio();
    setHeard(false);
    setAudioLoading(false);
    setAudioFailed(false);
    setAudioStatus('');
    setHintShown(false);
  };
  const start = () => {
    if (!canStart) return;
    resetAudio();
    window.scrollTo(0,0);
    setQuestions(shuffle(available).slice(0,10).map(word => ({ word, choices: quizChoices(word,pool) })));
    setPosition(0);
    setAnswers([]);
    setAssistedCount(0);
    setChosen(null);
    answerLock.current = false;
  };
  const listen = async (slow = false) => {
    if (!question || audioLoading) return;
    const active = ++playback.current;
    setAudioLoading(true);
    setAudioFailed(false);
    const ok = await playWord(question.word,audioIndex,slow ? .75 : saved.speed,status => {
      if (active === playback.current) setAudioStatus(status);
    },{ filesOnly: mode === 'listening' });
    if (active !== playback.current) return;
    setAudioLoading(false);
    setAudioFailed(!ok);
    if (ok) setHeard(true);
  };
  const answer = word => {
    if (answerLock.current || chosen || !question || (mode === 'listening' && !heard)) return;
    answerLock.current = true;
    setChosen(word.id);
    const correct = word.id === question.word.id;
    setAnswers(x => [...x,correct]);
    if (hintShown && correct) setAssistedCount(x=>x+1);
    setSaved(s => recordReview(s,question.word.id,correct ? (hintShown ? 'hard' : 'good') : 'again'));
  };
  const next = () => {
    resetAudio();
    setPosition(x => x+1);
    setChosen(null);
    answerLock.current = false;
  };
  const skip = () => {
    if (answerLock.current || !audioFailed || heard) return;
    answerLock.current = true;
    // A failed audio download is never a learning mistake or a completed review.
    setAnswers(x => [...x,null]);
    next();
  };
  const exit = () => { resetAudio(); setQuestions(null); };
  useEffect(() => () => { playback.current++; stopAudio(); }, []);

  if (questions && position >= questions.length) {
    const graded = answers.filter(x => x !== null);
    const skipped = answers.length - graded.length;
    return <div className="quiz-finish">
      <span className="completion-buddy"><Buddy celebrate={graded.length > 0}/></span>
      <span className="eyebrow">{graded.length ? '참 잘했어요!' : '다음에 다시 들어봐요'}</span>
      <h2>{graded.length ? '기억이 한 뼘 더 자랐어요.' : '음성 연결을 확인해 주세요.'}</h2>
      <div className="quiz-score">{graded.filter(Boolean).length}<span> / {graded.length}</span></div>
      {skipped > 0 && <p>재생하지 못한 {skipped}문제는 채점과 학습 기록에서 제외했어요.</p>}
      {assistedCount > 0 && <p>힌트로 맞힌 {assistedCount}문제는 더 일찍 복습해요.</p>}
      {graded.some(x => !x) && <p>틀린 단어는 오답노트에 저장했어요.<br/>10분 뒤 오늘의 복습에서 다시 만날 수 있어요.</p>}
      <button className="primary-button" onClick={start}>한 번 더 도전하기 <RefreshCw size={16}/></button>
      <button className="text-button" onClick={exit}>퀴즈 선택으로</button>
    </div>;
  }
  if (!questions) return <div className="quiz-start-layout">
    <div className="quiz-intro"><span className="eyebrow">A LITTLE CHALLENGE</span><h2>외웠다면,<br/><em>기억을 꺼내볼 시간.</em></h2><p>최대 10문제로 가볍게 확인해요.<br/>맞힌 단어도, 헷갈린 단어도 다음 복습에 반영돼요.</p><div className="quiz-illustration"><Buddy/></div></div>
    <div className="quiz-options">
      <label className="field-label">어떤 방식으로 풀까요?</label>
      <button className={`quiz-option ${mode==='meaning'?'selected':''}`} onClick={()=>setMode('meaning')}><BookOpen size={24}/><span><strong>뜻 맞히기</strong><small>단어를 보고 알맞은 뜻을 골라요</small></span>{mode==='meaning'&&<CircleCheck size={21}/>}</button>
      <button className={`quiz-option ${mode==='listening'?'selected':''}`} onClick={()=>setMode('listening')}><Headphones size={24}/><span><strong>듣기 퀴즈</strong><small>발음을 듣고 뜻을 떠올려요</small></span>{mode==='listening'&&<CircleCheck size={21}/>}</button>
      <label className="field-label" htmlFor="quiz-level">어떤 단어로 연습할까요?</label>
      <select id="quiz-level" value={level} onChange={e=>setLevel(e.target.value)}>{levels.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select>
      <p className="form-note" role="status">{mode==='listening' ? audioLoadState==='loading' ? '발음 파일 목록을 불러오는 중…' : <>이 분류 {format(pool.length)}개 중 음성 파일 {format(available.length)}개<br/>사람 녹음 우선 · 나머지는 AI 합성 음성</> : `${format(pool.length)}개 중 최대 10문제`}</p>
      {mode==='listening' && audioLoadState==='partial' && <div className="quiz-audio-notice"><p>일부 음성 목록을 불러오지 못했어요. 현재 준비된 파일로 연습할 수 있어요.</p><button className="text-button" onClick={onRetryAudio}><RefreshCw size={15}/>음성 목록 다시 불러오기</button></div>}
      {mode==='listening' && audioLoadState!=='loading' && !available.length && <p className="form-note">아직 이 분류에 준비된 음성이 없어요. 다른 분류나 뜻 맞히기를 선택해 주세요.</p>}
      <button className="primary-button" disabled={!canStart} onClick={start}>퀴즈 시작하기<ArrowRight size={18}/></button>
    </div>
  </div>;
  return <section className="quiz-session">
    <div className="quiz-top"><span>{mode==='meaning'?'뜻 맞히기':'듣기 퀴즈'}<b>{position+1} / {questions.length}</b></span><button className="text-button" onClick={exit}>그만 풀기 <X size={15}/></button></div>
    <div className="quiz-progress"><i style={{width:`${position/questions.length*100}%`}}/></div>
    <div className="quiz-question">{mode==='listening' ? <>
      <button className="listen-orb" disabled={audioLoading} aria-busy={audioLoading} onClick={()=>listen()} aria-label={audioLoading?'발음 불러오는 중':'문제 발음 듣기'}><Volume2 size={37}/></button>
      <h2>{chosen?question.word.word:'어떤 뜻의 단어일까요?'}</h2>
      <p>소리를 듣고 가장 알맞은 뜻을 골라주세요.</p>
      <span className="audio-live" role="status">{audioStatus || '듣기 버튼을 누르면 답을 고를 수 있어요.'}</span>
      <div className="quiz-audio-recovery"><button className="text-button" disabled={audioLoading} onClick={()=>listen(true)}>천천히 듣기 0.75×</button>{heard&&!chosen&&<button className="text-button" onClick={()=>setHintShown(true)}>{hintShown?question.word.word:'글자 힌트 보기'}</button>}</div>
      {audioFailed && !heard && <div className="quiz-audio-recovery"><button className="text-button" onClick={()=>listen()}><RefreshCw size={15}/>다시 듣기</button><button className="text-button" onClick={skip}>채점 없이 건너뛰기<ArrowRight size={15}/></button></div>}
    </> : <><span className="eyebrow">이 단어의 뜻은?</span><h2 lang={question.word.lang}>{question.word.word}</h2><button className="text-button" disabled={audioLoading} onClick={()=>listen()}><Volume2 size={17}/>발음 듣기</button><span className="audio-live" role="status">{audioStatus}</span></>}</div>
    <div className="quiz-answer-grid">{question.choices.map((w,i)=><button key={w.id} disabled={!!chosen||(mode==='listening'&&!heard)} className={`${chosen&&w.id===question.word.id?'correct':''} ${chosen===w.id&&w.id!==question.word.id?'incorrect':''}`} onClick={()=>answer(w)}><span>{i+1}</span><strong>{w.meaning}</strong>{chosen&&w.id===question.word.id&&<Check size={20}/>}</button>)}</div>
    {chosen && <div className="quiz-feedback"><div><strong>{chosen===question.word.id?'정답이에요!':'괜찮아요. 한 번 더 기억하면 돼요.'}</strong><p>{question.word.word} — {question.word.meaning}</p></div><button className="primary-button" onClick={next}>{position===questions.length-1?'결과 보기':'다음 문제'}<ArrowRight size={17}/></button></div>}
  </section>;
}
