import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Headphones, Lightbulb, Volume2 } from 'lucide-react';
import { audioLabel, playWord, stopAudio } from './audio.js';
import { exampleWord, matchesWordAnswer, sentenceGap } from './learning.js';

const prompts = {
  card: '뜻을 먼저 떠올린 다음, 맞혀 보세요',
  reverse: '이번 코스에서 배운 단어는 무엇일까요?',
  listening: '소리만 듣고, 뜻을 맞혀 보세요',
  sentence: '이번 코스에서 배운 단어로 빈칸을 채워요',
  speaking: '마지막은 가볍게, 한 문장 따라 말하기',
};

export default function PracticeQuestion({ step, audioIndex, speed, onDone }) {
  const { type, word, retry } = step;
  const [choicesOpen, setChoicesOpen] = useState(type === 'listening');
  const [typed, setTyped] = useState('');
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState(false);
  const [heard, setHeard] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState('');
  const token = useRef(0);
  const done = useRef(false);
  const gap = type === 'sentence' ? sentenceGap(word) : null;
  const foreign = type === 'reverse' || type === 'sentence';
  useEffect(() => () => { token.current++; stopAudio(); }, []);

  const listen = async (slow = false) => {
    if (busy) return;
    const active = ++token.current;
    setBusy(true); setFailed(false);
    const target = type === 'speaking' ? exampleWord(word) : word;
    const ok = await playWord(target, audioIndex, slow ? .75 : speed, message => {
      if (token.current === active) setStatus(message);
    }, { filesOnly: type === 'listening' || type === 'speaking' });
    if (token.current !== active) return;
    setBusy(false); setFailed(!ok);
    if (ok) setHeard(true);
  };
  const complete = (rating, assisted = hint) => {
    if (done.current) return;
    done.current = true;
    token.current++; stopAudio();
    onDone(rating, assisted);
  };
  const answer = (correct, details = {}) => {
    if (result || (type === 'listening' && !heard)) return;
    setResult({ correct, ...details });
  };
  const submit = event => {
    event.preventDefault();
    if (typed.trim()) answer(matchesWordAnswer(typed, word, gap?.answer || word.word), { typed });
  };
  const audioControls = <div className="practice-audio">
    <button className="secondary-button" disabled={busy} onClick={() => listen()}><Volume2 size={18}/>{heard ? '다시 듣기' : '발음 듣기'}</button>
    <button className="text-button" disabled={busy} onClick={() => listen(true)}>천천히 0.75×</button>
    <span className="audio-live" role="status">{status}</span>
  </div>;
  const hintButton = !result && word.hint && <button className="text-button quiz-hint" onClick={() => setHint(true)}><Lightbulb size={16}/>{hint ? word.hint : '한글 힌트 보기'}</button>;

  return <div className="practice-card">
    {retry && <span className="retry-pill">한 번 더 도전 · 힌트 없이 떠올려요</span>}
    <span className="eyebrow">{prompts[type]}</span>
    {type === 'card' && <>
      <h2 lang={word.lang}>{word.word}</h2>
      {word.lang === 'ja' && word.reading !== word.word && <p className="practice-reading">{word.reading}</p>}
      {!result && <p className="practice-instruction">{step.isNew ? '처음 보는 단어여도 괜찮아요.' : '정답을 보기 전에 잠깐 떠올려 보세요.'}<br/>머릿속으로 답한 다음 보기를 열어보세요.</p>}
      {hintButton}
    </>}
    {type === 'reverse' && <>
      <h2 className="korean-prompt">{word.meaning}</h2>
      {!result && <p className="practice-instruction">{word.lang === 'ja' ? '일본어로 입력해 보세요. 가나로 적어도 돼요.' : '영어로 직접 입력해 보세요.'}<br/>입력이 어렵다면 보기로 풀 수 있어요.</p>}
    </>}
    {type === 'sentence' && <>
      <p className="sentence-translation">{word.exampleKo}</p>
      <h2 className="sentence-gap" lang={word.lang}>{gap.before}<mark>{result ? gap.answer : '________'}</mark>{gap.after}</h2>
    </>}
    {foreign && !result && !choicesOpen && <form className="quiz-answer-form" onSubmit={submit}>
      <input className="practice-input" value={typed} onChange={event => setTyped(event.target.value)}
        onKeyDown={event => { if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault(); }}
        autoComplete="off" autoCapitalize="off" spellCheck={false}
        aria-label={type === 'sentence' ? '문장 빈칸 정답' : '떠올린 외국어 단어'}
        placeholder={word.lang === 'ja' ? '일본어 단어 또는 가나 입력' : '떠오른 영어 단어 입력'}/>
      <button className="primary-button" disabled={!typed.trim()} type="submit">정답 제출<ArrowRight size={17}/></button>
    </form>}
    {foreign && hintButton}
    {type === 'listening' && <>
      <button className="listen-orb" onClick={() => listen()} disabled={busy} aria-label="연습 발음 듣기"><Headphones size={38}/></button>
      <h2 className="listening-prompt">어떤 뜻일까요?</h2>
      <button className="text-button" disabled={busy} onClick={() => listen(true)}>천천히 다시 듣기 0.75×</button>
      <p className="audio-live" role="status">{status || '먼저 듣기 버튼을 눌러주세요.'}</p>
      {heard && !result && <button className="text-button" onClick={() => setHint(true)}><Lightbulb size={16}/>{hint ? word.word : '글자 힌트 보기'}</button>}
    </>}
    {type !== 'speaking' && !result && !choicesOpen && <button className={foreign ? 'secondary-button quiz-show-choices' : 'primary-button'} onClick={() => setChoicesOpen(true)}>{foreign ? '보기로 풀기' : '떠올렸어요 · 보기 열기'}<ArrowRight size={17}/></button>}
    {type !== 'speaking' && choicesOpen && <div className="guided-choices" aria-label="정답 선택">
      {step.choices.map((option, index) => <button key={option.id} disabled={!!result || (type === 'listening' && !heard)}
        className={result && option.id === word.id ? 'correct' : result?.selectedId === option.id ? 'incorrect' : ''}
        onClick={() => answer(option.id === word.id, { selectedId: option.id })}>
        <span className="choice-number">{index + 1}</span><span lang={foreign ? word.lang : 'ko'}>{foreign ? (option.id === word.id && gap ? gap.answer : option.word) : option.meaning}</span>
        {result && option.id === word.id && <Check size={18} aria-label="정답"/>}
      </button>)}
    </div>}
    {type !== 'speaking' && !result && (type !== 'listening' || heard) && <button className="text-button quiz-unknown" onClick={() => answer(false, { unknown: true })}>모르겠어요 · 정답 배우기</button>}
    {result && <div className={`practice-feedback ${result.correct ? 'answer-correct' : 'answer-learn'}`} role="status">
      <strong>{result.correct ? '맞았어요!' : result.unknown ? '지금 익히면 돼요 🌱' : '정답을 확인해요 🌱'}</strong>
      <p className="correct-answer"><b lang={word.lang}>{word.word}</b><span>{word.meaning}</span></p>
      {word.lang === 'ja' && word.reading !== word.word && <p>{word.reading}</p>}
      {result.typed && !result.correct && <p>내 답: {result.typed}</p>}
      {type !== 'sentence' && word.example && <p className="feedback-example"><span lang={word.lang}>{word.example}</span><br/>{word.exampleKo}</p>}
      {!result.correct || hint ? <p>{retry ? (result.correct ? '다음 복습은 하루 뒤에 만나요.' : '10분 뒤 복습에서 다시 만나요.') : '이 문제는 코스 끝에서 한 번 더 풀어요.'}</p> : retry && <p>다시 떠올렸네요! 하루 뒤에 한 번 더 복습해요.</p>}
      {type !== 'listening' && audioControls}
      <button className="primary-button" onClick={() => complete(result.correct ? (hint ? 'hard' : 'good') : 'again')}>다음 문제<ArrowRight size={17}/></button>
    </div>}
    {type === 'listening' && failed && !heard && <button className="text-button" onClick={() => complete('skip')}>재생 없이 건너뛰기</button>}
    {type === 'speaking' && <>
      <h2 className="sentence-gap" lang={word.lang}>{word.example}</h2>
      <p className="sentence-translation">{word.exampleKo}</p>{audioControls}
      <p className="practice-instruction">듣고 소리 내어 따라 말해 보세요.<br/>선택 연습이에요. 퀴즈 점수에는 포함하지 않아요.</p>
      <div className="practice-rating"><button onClick={() => complete('skip')}>이번에는 건너뛰기</button><button disabled={!heard} onClick={() => complete('good', true)}><Check size={18}/>듣고 따라 말했어요</button></div>
    </>}
    {type !== 'listening' && type !== 'speaking' && <p className="practice-source">{audioLabel(audioIndex, word)} · 한글 힌트 사용 시 다시 복습해요</p>}
  </div>;
}
