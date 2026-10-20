import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronDown, CircleCheck, Lightbulb, MessageCircle, RotateCcw, Undo2, X } from 'lucide-react';
import { grammarLessons, grammarGroups, grammarSources, grammarExerciseCount, grammarCourses, filterGrammarLessons, gradeGrammarQuestion, recordGrammar, lessonProgress, sentence, shuffledIndices } from './grammar.js';
import Buddy from './Buddy.jsx';
import './grammar.css';

function CourseList({ current, records, onSelect, course, setCourse, search, setSearch }) {
  const lessons = filterGrammarLessons(course, search);
  return <>
    <div className="grammar-course-filters">
      <label>학습 과정<select value={course} onChange={e => setCourse(e.target.value)}>
        <option value="all">전체 · {grammarLessons.length}개 수업</option>
        {grammarCourses.map(c => <option key={c.id} value={c.id}>{c.name} · {grammarLessons.filter(l => c.groups.includes(l.group)).length}개 수업</option>)}
      </select></label>
      <label>문법 수업 검색<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="현재완료, 부탁, 어순…"/></label>
      <span role="status">{lessons.length}개 수업</span>
    </div>
    <nav aria-label="영어 문법 수업 목록">{grammarGroups.map((group, index) => lessons.some(l => l.group === index) && <div className="grammar-group" key={group}>
    <h3>{String(index + 1).padStart(2, '0')} · {group}</h3>
    {lessons.filter(l => l.group === index).map(lesson => {
      const progress = lessonProgress(lesson, records);
      return <button key={lesson.id} aria-current={current === lesson.id ? 'step' : undefined} onClick={() => onSelect(lesson.id)}>
        <span className="grammar-lesson-number">{progress.correct === lesson.questions.length ? <Check size={15}/> : lesson.number}</span>
        <span>{lesson.term}<small>{progress.correct === lesson.questions.length ? '모든 문제를 다시 떠올렸어요' : progress.mistakes.length ? `복습할 문제 ${progress.mistakes.length}개` : progress.attempted ? `${progress.attempted} / ${lesson.questions.length}문제 연습` : lesson.title}</small></span>
      </button>;
    })}
  </div>)}</nav>
    {!lessons.length && <div className="grammar-course-empty"><p>맞는 수업이 없어요.</p><button onClick={() => { setSearch(''); setCourse('all'); }}>전체 수업 보기</button></div>}
  </>;
}

function WordOrder({ lesson }) {
  const [selected, setSelected] = useState(0);
  return <div className="grammar-order-explainer">
    <span className="grammar-kicker">말의 순서를 눈으로 익혀요</span>
    <h3>한국어와 어디가 다를까요?</h3>
    <div className="grammar-korean-order"><span>한국어</span><p>{lesson.koOrder.map((part, i) => <React.Fragment key={i}>{i > 0 && <span> / </span>}{part}</React.Fragment>)}</p></div>
    <div className="grammar-chunks" role="group" aria-label="영어 문장의 각 부분">
      {lesson.chunks.map((c, i) => <button key={i} className={`grammar-chunk chunk-${i % 4}`} aria-pressed={selected === i} onClick={() => setSelected(i)}>
        <span>{i + 1}. {c.role}</span><strong lang="en">{c.en}</strong><small>{c.ko}</small>
      </button>)}
    </div>
    <p className="grammar-chunk-reason" aria-live="polite"><Lightbulb size={17}/>{lesson.chunks[selected].why}</p>
    <div className="grammar-full-sentence"><strong lang="en">{sentence(lesson.chunks, undefined, lesson.punctuation)}</strong><span>{lesson.koOrder.join(' ')}</span></div>
    <p className="grammar-note">{lesson.note}</p>
  </div>;
}

function Learn({ lesson, onPractice }) {
  return <>
    <div className="grammar-learn-grid">
      <section className="grammar-rules"><span className="grammar-kicker">어떻게 쓰는 말일까요?</span><h3>어려운 이름보다, 쓰는 방법부터.</h3><p className="grammar-intro">{lesson.intro}</p>
        {lesson.rules.map(([title, text], i) => <div className="grammar-rule" key={title}><span>{i + 1}</span><div><h4>{title}</h4><p>{text}</p></div></div>)}
      </section>
      <WordOrder lesson={lesson}/>
    </div>
    <section className="grammar-examples"><h3><MessageCircle size={18}/> 이렇게 대화에 써요</h3><div>{lesson.examples.map(example => <article key={example.en}><span>{example.situation}</span><strong lang="en">{example.en}</strong><p>{example.ko}</p></article>)}</div></section>
    <div className="grammar-bottom-action"><p>읽었다면, 이번엔 직접 문장을 만들어 봐요.</p><button className="primary-button" onClick={onPractice}>{lesson.questions.length}문제로 연습하기 <ArrowRight size={17}/></button></div>
  </>;
}

function Mistakes({ lesson, onPractice }) {
  return <section className="grammar-mistakes">
    <span className="grammar-kicker">틀리는 데도 이유가 있어요</span><h3>이렇게 헷갈리기 쉬워요.</h3>
    {lesson.mistakes.map(mistake => <article key={mistake.wrong}>
      <div className="grammar-correction"><div className="grammar-wrong"><span><X size={15}/> 고쳐 볼 문장</span><strong lang="en">{mistake.wrong}</strong></div><ArrowRight size={20}/><div className="grammar-right"><span><Check size={15}/> 이렇게 말해요</span><strong lang="en">{mistake.right}</strong></div></div>
      <p><Lightbulb size={18}/>{mistake.why}</p>
    </article>)}
    <div className="grammar-bottom-action"><p>내가 고른 답에도 각각 다른 해설이 나와요.</p><button className="primary-button" onClick={onPractice}>직접 풀어보기 <ArrowRight size={17}/></button></div>
  </section>;
}

function Exercise({ question, index, total, graded, onGrade, onNext, onExplain }) {
  const [selected, setSelected] = useState(question.type === 'choice' ? graded?.answer ?? null : null);
  const [ordered, setOrdered] = useState(question.type === 'order' ? graded?.answer || [] : []);
  const [feedback, setFeedback] = useState(graded?.feedback || null);
  const locked = useRef(!!graded);
  const titleRef = useRef(null);
  const feedbackRef = useRef(null);
  const bank = useMemo(() => shuffledIndices(question.type === 'choice' ? question.options.length : question.chunks.length), [question]);
  useEffect(() => { titleRef.current?.focus({ preventScroll: true }); }, [question.id]);
  useEffect(() => {
    if (feedback) feedbackRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [feedback]);
  const submit = () => {
    if (locked.current) return;
    const answer = question.type === 'choice' ? selected : ordered;
    const result = gradeGrammarQuestion(question, answer);
    if (!result) return;
    locked.current = true;
    setFeedback(result);
    onGrade(question.id, result, answer);
  };
  const ready = question.type === 'choice' ? selected !== null : ordered.length === question.chunks.length;
  return <section className="grammar-exercise">
    <div className="grammar-exercise-top"><span>{question.type === 'order' ? '어순 조립하기' : question.chat ? '채팅에 답하기' : '문장 고르기'}</span><span>{index + 1} / {total}문제</span></div>
    <div className="grammar-exercise-grid">
      <div className="grammar-prompt">
        {question.chat && <div className="grammar-chat"><span><MessageCircle size={16}/> 친구에게 온 메시지</span><strong lang="en">{question.chat[0]}</strong><p>{question.chat[1]}</p></div>}
        <h3 ref={titleRef} tabIndex={-1}>{question.prompt}</h3>
        <p>{question.type === 'order' ? '아래 영어 조각을 순서대로 눌러 문장을 완성해요. 넣은 조각을 다시 누르면 뺄 수 있어요.' : question.chat ? '이 상황에서 보낼 답장을 골라요. 왜 그렇게 말하는지도 함께 확인해요.' : '먼저 생각해 보고 답을 골라요. 확인을 누르면 이유를 알려드려요.'}</p>
        <div className="grammar-prompt-note"><Lightbulb size={16}/> 헷갈려도 괜찮아요. 이유를 알면 다음 문장이 쉬워져요.</div>
      </div>
      <div className="grammar-response">
        {question.type === 'choice' ? <div className="grammar-choices" role="group" aria-label="문장 선택">
          {bank.map((id, i) => {
            const option = question.options[id];
            const state = feedback ? option.correct ? 'correct' : selected === id ? 'incorrect' : '' : '';
            return <button key={id} disabled={!!feedback} aria-pressed={selected === id} className={state} onClick={() => setSelected(id)}>
              <span>{feedback && option.correct ? <Check size={17}/> : feedback && selected === id ? <X size={17}/> : i + 1}</span>
              <strong lang={/[가-힣]/.test(option.text) ? 'ko' : 'en'}>{option.text}</strong>{feedback && (option.correct || selected === id) && <small>{option.correct ? '정답' : '내 답'}</small>}
            </button>;
          })}
        </div> : <>
          <div className="grammar-built-label"><span>내가 만든 문장</span><button aria-label="마지막 조각 되돌리기" disabled={!!feedback || ordered.length === 0} onClick={() => setOrdered(s => s.slice(0, -1))}><Undo2 size={17}/></button></div>
          <div className={`grammar-built ${feedback ? feedback.correct ? 'correct' : 'incorrect' : ''}`} aria-label="내가 만든 문장">
            {ordered.length === 0 ? <p>첫 번째 조각을 골라 주세요</p> : ordered.map((id, i) => <button key={id} lang="en" disabled={!!feedback} aria-label={`${question.chunks[id].en} 빼기`} onClick={() => setOrdered(s => s.filter((_, j) => i !== j))}>{question.chunks[id].en}</button>)}
          </div>
          <div className="grammar-word-bank" role="group" aria-label="문장 조각">{bank.map(id => <button key={id} lang="en" disabled={!!feedback || ordered.includes(id)} onClick={() => setOrdered(s => [...s, id])}>{question.chunks[id].en}</button>)}</div>
          <p className="grammar-bank-help">조각 {ordered.length} / {question.chunks.length}개 사용 · 뜻과 순서는 답 확인 뒤에 보여요.</p>
        </>}
        {!feedback && <button className="primary-button grammar-submit" disabled={!ready} onClick={submit}>답 확인하기 <ArrowRight size={17}/></button>}
      </div>
    </div>
    {feedback && <div ref={feedbackRef} className={`grammar-feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
      <div role="status"><h3>{feedback.correct ? <CircleCheck size={22}/> : <Lightbulb size={22}/>} {feedback.correct ? '잘 연결했어요!' : '여기서 헷갈렸군요. 같이 살펴봐요.'}</h3>
        {!feedback.correct && <p className="grammar-selected">내 답 · <span lang={/[가-힣]/.test(feedback.selected) ? 'ko' : 'en'}>{feedback.selected}</span></p>}
        <p className="grammar-feedback-why">{feedback.why}</p>
        <div className="grammar-solution"><span>{/[가-힣]/.test(feedback.solution) ? '표현의 뜻' : feedback.correct ? '완성한 표현' : '이렇게 말해요'}</span><strong lang={/[가-힣]/.test(feedback.solution) ? 'ko' : 'en'}>{feedback.solution}</strong></div>
        {question.type === 'order' && <div className="grammar-feedback-parts">{feedback.parts.map((c, i) => <span key={i}><strong lang="en">{c.en}</strong>{c.ko}<small>{c.role}</small></span>)}</div>}
      </div>
      <div className="grammar-feedback-actions"><button className="text-button" onClick={onExplain}><BookOpen size={16}/> 설명 펼쳐보기</button><button className="primary-button" onClick={onNext}>{index + 1 === total ? '연습 결과 보기' : '다음 문제'} <ArrowRight size={17}/></button></div>
    </div>}
  </section>;
}

export default function Grammar({ saved, setSaved }) {
  const records = saved.grammar || {};
  const [lessonId, setLessonId] = useState(() => grammarLessons.find(l => lessonProgress(l, records).correct < l.questions.length)?.id || grammarLessons[0].id);
  const lesson = grammarLessons.find(l => l.id === lessonId);
  const [tab, setTab] = useState('learn');
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [round, setRound] = useState(0);
  const [explain, setExplain] = useState(false);
  const [course, setCourse] = useState('all');
  const [search, setSearch] = useState('');
  const panelRef = useRef(null);
  const courseRef = useRef(null);
  const lessonState = lessonProgress(lesson, records);
  const allMistakes = grammarLessons.flatMap(l => lessonProgress(l, records).mistakes);
  const completed = grammarLessons.filter(l => lessonProgress(l, records).attempted === l.questions.length).length;
  const scrollPanel = () => requestAnimationFrame(() => { panelRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); panelRef.current?.focus({ preventScroll: true }); });
  const selectLesson = id => { setLessonId(id); setTab('learn'); setQueue([]); setExplain(false); if (courseRef.current) courseRef.current.open = false; scrollPanel(); };
  const start = (questions = lesson.questions) => {
    setQueue(questions); setIndex(0); setResults([]); setRound(n => n + 1); setTab('practice'); setExplain(false); scrollPanel();
  };
  const question = queue[index];
  const questionLesson = question ? grammarLessons.find(l => l.id === question.lessonId) : lesson;
  const selectTab = value => {
    if (value === 'practice' && queue.length === 0) start();
    else { setTab(value); setExplain(false); }
  };
  const courseProps = { current: lessonId, records, onSelect: selectLesson, course, setCourse, search, setSearch };
  return <div className="grammar-layout">
    <aside className="grammar-course">
      <div className="grammar-course-heading"><span className="grammar-kicker">처음부터, 대화까지</span><h2>나의 영어 문장 수업</h2><p>{grammarLessons.length}개 수업 · {grammarExerciseCount}개 연습 문제</p><div className="grammar-course-progress"><span style={{ width: `${completed / grammarLessons.length * 100}%` }}/></div><small>{completed} / {grammarLessons.length}개 수업 연습 완료</small>
        <button className="grammar-review-button" disabled={!allMistakes.length} onClick={() => { if (courseRef.current) courseRef.current.open = false; start(allMistakes); }}><RotateCcw size={16}/>틀린 문제 다시 풀기 <b>{allMistakes.length}</b></button>
      </div>
      <div className="grammar-course-desktop"><CourseList {...courseProps}/></div>
      <details className="grammar-course-mobile" ref={courseRef}><summary>전체 수업에서 고르기 <ChevronDown size={17}/></summary><CourseList {...courseProps}/></details>
      <p className="grammar-save-note">문법 기록은 이 브라우저에 저장돼요.<br/>설정에서 백업할 수 있어요.</p>
    </aside>
    <div className="grammar-panel" ref={panelRef} tabIndex={-1}>
      <header className="grammar-lesson-header"><div><span className="grammar-kicker">LESSON {String(lesson.number).padStart(2, '0')} · {lesson.term}</span><h2>{lesson.title}</h2><p>{lesson.goal}</p></div><span className="grammar-progress-badge">{lessonState.correct === lesson.questions.length ? <Check size={16}/> : <BookOpen size={16}/>} {lessonState.attempted} / {lesson.questions.length} 연습</span></header>
      <div className="grammar-tabs" role="group" aria-label="수업 단계">{[['learn', '쉽게 배우기'], ['mistakes', '자주 하는 실수'], ['practice', '직접 풀기']].map(([id, label], i) => <button key={id} aria-pressed={tab === id} onClick={() => selectTab(id)}><span>{i + 1}</span>{label}</button>)}</div>
      {tab === 'learn' ? <Learn key={lesson.id} lesson={lesson} onPractice={() => start()}/> : tab === 'mistakes' ? <Mistakes lesson={lesson} onPractice={() => start()}/> : question ? <>
        {question.lessonId !== lesson.id && <p className="grammar-review-context">복습 중인 수업 · {questionLesson.term}</p>}
        <Exercise key={`${round}-${question.id}`} question={question} index={index} total={queue.length} graded={results.find(r => r.id === question.id)} onGrade={(id, feedback, answer) => { if (results.some(r => r.id === id)) return; setSaved(s => recordGrammar(s, id, feedback.correct)); setResults(r => [...r, { id, correct: feedback.correct, feedback, answer }]); }} onNext={() => { setIndex(i => i + 1); setExplain(false); scrollPanel(); }} onExplain={() => setExplain(v => !v)}/>
        {explain && <div className="grammar-inline-explanation"><h3>설명 다시 보기 · {questionLesson.term}</h3><p>{questionLesson.intro}</p>{questionLesson.rules.map(([title, text]) => <p key={title}><strong>{title}</strong><br/>{text}</p>)}</div>}
      </> : <section className="grammar-finish"><div className="grammar-finish-buddy"><Buddy celebrate/></div><span className="grammar-kicker">문장에서 대화로, 한 걸음 더</span><h3>이번 연습을 마쳤어요!</h3><p>첫 답에서 <strong>{results.filter(r => r.correct).length} / {results.length}문제</strong>를 맞혔어요.<br/>{results.some(r => !r.correct) ? '헷갈린 문장은 이유를 떠올리며 한 번 더 연습해요.' : '배운 문장의 단어를 바꿔, 내 이야기도 만들어 보세요.'}</p>
        <div>{results.some(r => !r.correct) && <button className="primary-button" onClick={() => start(queue.filter(q => results.some(r => r.id === q.id && !r.correct)))}><RotateCcw size={17}/>이번에 틀린 문제 다시 풀기</button>}
          {lesson.number < grammarLessons.length && <button className="secondary-button" onClick={() => selectLesson(grammarLessons[lesson.number].id)}>다음 수업으로 <ArrowRight size={17}/></button>}
          <button className="text-button" onClick={() => start()}>이 수업의 {lesson.questions.length}문제 다시 풀기</button></div>
      </section>}
      <div className="grammar-footnotes"><details><summary>주어, 동사… 문법 이름이 낯설다면</summary><p><strong>주어</strong>는 ‘누가’에 해당하는 주인공이에요. <strong>동사</strong>는 행동이나 상태를 나타내는 말이에요. <strong>명사</strong>는 사람·물건·생각의 이름, <strong>형용사</strong>는 성질이나 상태를 나타내요. <strong>동사원형</strong>은 go, like처럼 사전에 나오는 기본 모양이에요.</p><p><strong>과거분사</strong>는 have eaten, was made 등에 쓰는 동사의 모양이에요. eat → ate(과거형) → eaten(과거분사)처럼 따로 달라지기도 하고, work → worked → worked처럼 같기도 해요. <strong>절</strong>은 주인공과 동사가 들어 있는 말 덩어리예요. <strong>목적어</strong>는 행동의 대상이에요. I like music.에서는 music이 ‘좋아하는 대상’이에요.</p></details><details><summary>수업 참고 자료</summary><p>설명과 문제는 모루에서 작성했어요. 문법 규칙은 다음 자료를 참고했어요.</p>{lesson.sources.map(key => <a key={key} href={grammarSources[key][1]} target="_blank" rel="noreferrer">{grammarSources[key][0]} ↗</a>)}</details></div>
    </div>
  </div>;
}
