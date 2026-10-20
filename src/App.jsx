import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Layers, RotateCcw, Bookmark, ChartNoAxesColumnIncreasing, Settings2, ChevronRight, ChevronLeft, ArrowRight, ArrowUpRight, Volume2, Sparkles, Search, Check, X, Headphones, LayoutGrid, List, Flame, CircleHelp, Download, Upload, Target, Leaf, Keyboard, RefreshCw, CheckCheck, GraduationCap, MessageCircle, TrendingUp, CircleCheck, SlidersHorizontal, ExternalLink } from 'lucide-react';
import { STORAGE_KEY, readState, recordReview, mergeState, dayKey, currentStreak, filterWords, makeSession } from './model.js';
import { playWord, findRecording, audioLabel, stopAudio } from './audio.js';
import './style.css';
import './playful.css';
import Buddy from './Buddy.jsx';
import Quiz from './Quiz.jsx';
import Today, { Growth } from './Today.jsx';

const categories = [ ['essential','진짜 중요한 단어',Sparkles], ['conversation','바로 쓰는 회화',MessageCircle], ['frequent','자주 쓰는 단어',TrendingUp], ['advanced','어려운 단어',GraduationCap], ['all','전체 단어',Layers] ];
const navItems = [['today','오늘의 학습',Sparkles],['study','단어 학습',Layers],['review','오늘의 복습',RotateCcw],['quiz','실력 확인 퀴즈',Headphones],['notebook','나의 단어장',Bookmark],['stats','학습 기록',ChartNoAxesColumnIncreasing]];
const format = n => n.toLocaleString('ko-KR');
const dataUrl = name => `${import.meta.env.BASE_URL}data/${name}.json?v=${__MORU_BUILD__}`;
function IconButton({ label, children, ...props }) { return <button type="button" className="icon-button" title={label} aria-label={label} {...props}>{children}</button>; }

export default function App() {
  const initial = useMemo(() => readState(window.localStorage), []);
  const [saved,setSaved] = useState(initial.data);
  const [toast,setToast] = useState(initial.error || '');
  const [view,setView] = useState('today');
  const [category,setCategory] = useState('essential');
  const [words,setWords] = useState([]);
  const [audioIndex,setAudioIndex] = useState({});
  const [audioLoadState,setAudioLoadState] = useState('loading');
  const [audioRetry,setAudioRetry] = useState(0);
  const [loadError,setLoadError] = useState('');
  const [loading,setLoading] = useState(true);
  const [retry,setRetry] = useState(0);
  const [query,setQuery] = useState('');
  const [layout,setLayout] = useState('cards');
  const [notebook,setNotebook] = useState('favorites');
  const [limit,setLimit] = useState(40);
  const [session,setSession] = useState([]);
  const [index,setIndex] = useState(0);
  const [flipped,setFlipped] = useState(false);
  const [hintVisible,setHintVisible] = useState(false);
  const [rated,setRated] = useState({});
  const [epoch,setEpoch] = useState(0);
  const [audioStatus,setAudioStatus] = useState('');
  const [modal,setModal] = useState(null);
  const [now,setNow] = useState(Date.now());
  const [sessionReady,setSessionReady] = useState(false);
  const cache = useRef({});
  const timer = useRef();
  const searchRef = useRef();
  const lang = saved.lang;
  const announce = message => setToast(message);

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(saved)); } catch { setToast('저장 공간이 부족하거나 저장이 차단됐어요. 설정에서 학습 기록을 백업해 주세요.'); } },[saved]);
  useEffect(() => { if (!toast) return; const t=setTimeout(()=>setToast(''),5500); return ()=>clearTimeout(t); },[toast]);
  useEffect(() => { const id=setInterval(()=>setNow(Date.now()),30000); return ()=>clearInterval(id); },[]);
  useEffect(() => {
    let active = true;
    setAudioLoadState('loading');
    Promise.allSettled(['audio',`audio-files-${lang}`].map(async name => {
      const response = await fetch(dataUrl(name));
      if (!response.ok) throw new Error('Audio index unavailable');
      const data = await response.json();
      if (!data.ja || !data.en) throw new Error('Invalid audio index');
      return data;
    })).then(([human,synthetic]) => {
      if (!active) return;
      setAudioIndex(previous => ({ ...(human.status==='fulfilled' ? human.value : previous), synthetic: synthetic.status==='fulfilled' ? {...previous.synthetic,[lang]:synthetic.value[lang]} : previous.synthetic }));
      setAudioLoadState(human.status==='fulfilled' && synthetic.status==='fulfilled' ? 'ready' : 'partial');
    });
    window.speechSynthesis?.getVoices();
    return () => { active=false; stopAudio(); };
  },[audioRetry,lang]);
  useEffect(() => {
    let active=true; setLoading(true);setLoadError('');setWords([]);setSessionReady(false);stopAudio();
    (async()=>{try {
      if (!cache.current[lang]) { const r=await fetch(dataUrl(lang)); if(!r.ok) throw new Error(); const data=await r.json(); if(!Array.isArray(data)||!data.length)throw new Error();cache.current[lang]=data; }
      if(active){setWords(cache.current[lang]);setLoading(false);}
    }catch{if(active){setLoadError('단어장을 불러오지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.');setLoading(false);}}})();
    return ()=>{active=false;};
  },[lang,retry]);
  const filtered = useMemo(()=>filterWords(words,{category,query,view,notebook,progress:saved.progress,favorites:saved.favorites,now}),[words,category,query,view,notebook,saved.progress,saved.favorites,now]);
  // A lesson is a snapshot. Rating a word must not reorder the lesson under the learner.
  useEffect(()=>{
    clearTimeout(timer.current);stopAudio();setAudioStatus('');setIndex(0);setFlipped(false);setHintVisible(false);setRated({});setLimit(40);
    setSession(makeSession(filterWords(words,{category,query,view,notebook,progress:saved.progress,favorites:saved.favorites,now:Date.now()}),saved.progress,words.length,view==='review'));
    setSessionReady(words.length>0);
  },[words,category,query,view,notebook,epoch]);
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  const current = session[index];
  useEffect(()=>{stopAudio();setAudioStatus('');setFlipped(false);setHintVisible(false);},[current?.id]);
  const todayCount = saved.days[dayKey(new Date(now))]?.length || 0;
  const streak = currentStreak(saved.days,new Date(now));
  const dueWords = words.filter(w=>saved.progress[w.id]?.due<=now);
  const seenCount = words.filter(w=>saved.progress[w.id]?.seen>0).length;
  const goodCount = words.filter(w=>saved.progress[w.id]?.lastRating==='good').length;
  const favoritesCount = words.filter(w=>saved.favorites.includes(w.id)).length;
  const changeLang = value => { if(value===lang)return;setSaved(s=>({...s,lang:value}));setCategory('essential');setQuery(''); };
  const navigate = value => {setView(value);setQuery('');setLayout('cards');window.scrollTo(0,0);};
  const toggleFavorite = word => setSaved(s=>({...s,favorites:s.favorites.includes(word.id)?s.favorites.filter(id=>id!==word.id):[...s.favorites,word.id]}));
  const speak = async word => { if(word) return playWord(word,audioIndex,saved.speed,setAudioStatus); };
  const go = direction => { clearTimeout(timer.current);setIndex(i=>Math.max(0,Math.min(session.length,i+direction))); };
  const rate = rating => {
    if(!current||!flipped||rated[current.id])return;
    setSaved(s=>recordReview(s,current.id,rating));setRated(s=>({...s,[current.id]:rating}));
    timer.current=setTimeout(()=>setIndex(i=>Math.min(session.length,i+1)),260);
  };
  useEffect(()=>{
    const handler=e=>{
      if(modal||view==='today'||view==='quiz'||view==='stats'||layout==='list'||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
      if(e.code==='Space'&&e.target.tagName!=='BUTTON'){e.preventDefault();if(current)setFlipped(f=>!f);}
      if(e.key==='ArrowRight'){e.preventDefault();go(1);}if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}
      if(e.key.toLowerCase()==='l'){e.preventDefault();speak(current);}
      if(e.key.toLowerCase()==='s'&&current){e.preventDefault();toggleFavorite(current);}
      if(['1','2','3'].includes(e.key))rate(['again','hard','good'][Number(e.key)-1]);
    };window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);
  });

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#" onClick={e=>{e.preventDefault();navigate('today');}} aria-label="모루 홈"><span className="brand-mascot"><Buddy/></span><strong>모루<span>moru</span></strong></a>
      <div className="sidebar-intro">한 단어씩, 쑥쑥 자라는 나!</div>
      <div className="sidebar-label">MY LEARNING</div>
      <nav className="main-nav" aria-label="학습 메뉴">{navItems.map(([id,label,Icon])=><button key={id} className={view===id?'active':''} aria-label={label} onClick={()=>navigate(id)} aria-current={view===id?'page':undefined}><Icon size={20}/><span>{label}</span>{id==='review'&&dueWords.length>0&&<b>{dueWords.length}</b>}{id==='study'&&view===id&&<span className="nav-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="little-garden"><Buddy/><p>잘 몰라도 괜찮아!<br/><strong>오늘 한 장부터 시작해요.</strong></p></div><button className="subtle-button" onClick={()=>setModal('settings')}><Settings2 size={18}/>학습 설정</button><button className="subtle-button" onClick={()=>setModal('about')}><CircleHelp size={18}/>모루 사용 가이드</button><div className="local-status"><span/>이 브라우저에 학습 기록 저장</div></div>
    </aside>
    <div className="workspace">
      <header className="topbar"><div className="breadcrumb"><span>나의 학습 공간</span><ChevronRight size={14}/><strong>{navItems.find(x=>x[0]===view)?.[1]}</strong></div><div className="topbar-right"><span className="streak"><Flame size={16}/>{streak}일 연속</span><div className="language-switch" role="group" aria-label="학습 언어"><button className={lang==='ja'?'selected':''} onClick={()=>changeLang('ja')} aria-pressed={lang==='ja'}><span className="jp-flag"/>일본어</button><button className={lang==='en'?'selected':''} onClick={()=>changeLang('en')} aria-pressed={lang==='en'}><span className="en-symbol">En</span>영어</button></div><IconButton label="학습 설정" onClick={()=>setModal('settings')}><SlidersHorizontal size={19}/></IconButton></div></header>
      <main id="main-content">
        <div className="page-heading"><div><div className="eyebrow">GROW A LITTLE, EVERY DAY</div><h1>{view==='today'?<>작은 연습이 모이면,<br/><span>진짜 내 기억으로!</span></>:view==='study'?<>한 장씩 넘기면,<br/><span>어느새 내 단어!</span></>:view==='review'?'다시 만나면, 더 오래 남아요.':view==='quiz'?'얼마나 기억하고 있을까요?':view==='notebook'?'오래 간직하고 싶은 단어.':'쌓여가는 나의 작은 변화.'}</h1><p>{view==='today'?'오늘 할 공부는 모루가 준비했어요. 한 걸음씩 시작해 볼까요?':view==='study'?'아는 단어가 늘어나는 즐거움. 오늘도 모루와 함께해요!':view==='review'?'복습할 시간이 된 단어를 모았어요. 편하게 다시 만나보세요.':view==='quiz'?'정답을 맞히며 기억을 단단하게. 틀린 단어는 오답노트에 모아드려요.':view==='notebook'?'저장한 단어와 헷갈렸던 단어를 나만의 속도로 익혀보세요.':'어제보다 조금 더 아는 나. 작은 꾸준함을 기록해요.'}</p></div><div className="heading-decoration"><span className="buddy-bubble">오늘도 반가워!</span><Buddy/></div></div>
        {loading?<div className="loading-state"><div className="loading-dot"/>단어장을 펼치는 중이에요…</div>:loadError?<Empty icon={RefreshCw} title="잠시 연결이 끊겼어요" description={loadError} action="다시 불러오기" onAction={()=>setRetry(x=>x+1)}/>:view==='today'?<Today key={lang} words={words} saved={saved} setSaved={setSaved} audioIndex={audioIndex} audioLoadState={audioLoadState} now={now} onBrowse={()=>navigate('study')}/>:view==='quiz'?<Quiz key={lang} words={words} audioIndex={audioIndex} audioLoadState={audioLoadState} onRetryAudio={()=>setAudioRetry(x=>x+1)} saved={saved} setSaved={setSaved}/>:view==='stats'?<Stats saved={saved} words={words} now={now} onSettings={()=>setModal('settings')}/>:<>
          {view==='study'&&<><div className="category-tabs" role="group" aria-label="단어 분류">{categories.map(([id,label,Icon])=><button key={id} className={category===id?'active':''} aria-pressed={category===id} onClick={()=>{setCategory(id);setQuery('');}}><Icon size={17}/>{label}</button>)}</div>{lang==='ja'&&<div className="kana-strip"><span>글자부터 시작하고 싶다면</span><button className={category==='hiragana'?'active':''} onClick={()=>{setCategory('hiragana');setQuery('');}}>あ 히라가나 <ChevronRight size={13}/></button><button className={category==='katakana'?'active':''} onClick={()=>{setCategory('katakana');setQuery('');}}>ア 가타카나 <ChevronRight size={13}/></button></div>}</>}
          {view==='notebook'&&<div className="notebook-tabs"><button className={notebook==='favorites'?'active':''} onClick={()=>setNotebook('favorites')}><Bookmark size={16}/>즐겨찾기 <span>{favoritesCount}</span></button><button className={notebook==='mistakes'?'active':''} onClick={()=>setNotebook('mistakes')}><RotateCcw size={16}/>오답노트</button></div>}
          <div className="learning-grid"><section className="study-column" aria-label="단어 학습">
            <div className="study-toolbar"><div className="study-label"><span className="tiny-dot"/>{query?'검색 결과':view==='review'?'복습할 단어':view==='notebook'?(notebook==='favorites'?'저장한 단어':'다시 익힐 단어'):categories.find(x=>x[0]===category)?.[1]||({'hiragana':'히라가나 글자','katakana':'가타카나 글자'}[category])}<span>{format(filtered.length)}</span></div><div className="view-toggle" role="group" aria-label="보기 방식"><IconButton label="카드로 보기" aria-pressed={layout==='cards'} onClick={()=>setLayout('cards')}><LayoutGrid size={16}/></IconButton><IconButton label="목록으로 보기" aria-pressed={layout==='list'} onClick={()=>setLayout('list')}><List size={17}/></IconButton></div></div>
            <label className="search-box"><Search size={17}/><input ref={searchRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder="단어, 뜻, 발음으로 찾아보세요" aria-label="단어 검색"/>{query&&<IconButton label="검색어 지우기" onClick={()=>setQuery('')}><X size={15}/></IconButton>}<span className="search-hint">{lang==='ja'?'日本語':'English'}</span></label>
            {filtered.length===0&&!(view==='review'&&current)?<Empty icon={view==='notebook'?Bookmark:view==='review'?CircleCheck:Search} title={query?'찾는 단어가 없어요':view==='review'?'지금은 복습할 단어가 없어요':notebook==='favorites'?'나만의 단어장을 채워보세요':'아직 헷갈린 단어가 없어요'} description={query?'다른 단어나 한국어 뜻으로 검색해 보세요.':view==='review'?'학습한 단어는 기억 정도에 맞춰 10분, 1일, 3일 뒤 다시 보여드려요.':notebook==='favorites'?'카드의 책갈피를 누르면 여기에 모여요.':'카드에서 ‘모르겠어요’나 ‘애매해요’를 누르면 여기서 다시 볼 수 있어요.'} action={query?'검색 지우기':'새 단어 학습하기'} onAction={()=>query?setQuery(''):navigate('study')}/>:layout==='list'?<><div className="word-list">{filtered.slice(0,limit).map(w=><div className="word-row" key={w.id}><button className="word-row-main" onClick={()=>{setSession([w]);setIndex(0);setFlipped(false);setRated({});setLayout('cards');}}><span lang={lang}>{w.word}<small>{w.reading!==w.word?w.reading:w.hint}</small></span><span>{w.meaning}</span></button><IconButton label={`${w.word} 발음 듣기`} onClick={()=>speak(w)}><Volume2 size={17}/></IconButton><IconButton label={`${w.word} 즐겨찾기`} aria-pressed={saved.favorites.includes(w.id)} onClick={()=>toggleFavorite(w)}><Bookmark size={17} fill={saved.favorites.includes(w.id)?'currentColor':'none'}/></IconButton></div>)}</div>{filtered.length>limit&&<button className="load-more" onClick={()=>setLimit(x=>x+40)}>40개 더 보기 <ChevronRight size={16}/></button>}<div className="audio-live" role="status">{audioStatus}</div></>:sessionReady&&!current?<div className="session-complete"><div className="completion-buddy"><Buddy celebrate/></div><span className="eyebrow">오늘도 한 뼘 성장했어요!</span><h2>오늘의 한 걸음, 잘 해냈어요.</h2><p>이번 학습에서 <strong>{Object.keys(rated).length}개</strong>의 단어를 학습했어요.<br/>조금 쉬어가도, 더 배워도 좋아요.</p><button className="primary-button" onClick={()=>setEpoch(x=>x+1)}>다시 학습하기 <ArrowRight size={17}/></button><button className="text-button" onClick={()=>navigate('quiz')}>퀴즈로 확인해 볼까요?</button></div>:current&&<>
              <div className="card-container">
                <button className={`flashcard ${flipped?'is-flipped':''}`} onClick={()=>setFlipped(x=>!x)} aria-label={flipped?'단어 앞면 보기':'카드 뒤집어 뜻 보기'} aria-pressed={flipped}>
                  <span className="card-rotator"><span className="card-face card-front" aria-hidden={flipped}><span className="card-topline"><span>{current.level} <span className="tag-divider">/</span> {lang==='ja'?'JAPANESE':'ENGLISH'}</span><span className="card-number">{String(index+1).padStart(3,'0')}</span></span><span className="word-display"><span className={`main-word ${current.word.length>12?'long-word':''}`} lang={lang}>{current.word}</span>{current.reading&&current.reading!==current.word&&<span className="reading" lang={lang}>{current.reading}</span>}{hintVisible&&current.hint&&<span className="pronunciation-hint">{current.hint}<small>{current.hintAuto?'자동 한글 힌트':'한글 힌트'}</small></span>}</span><span className="flip-hint"><RotateCcw size={14}/>톡! 눌러서 뜻을 확인해요</span></span>
                  <span className="card-face card-back" aria-hidden={!flipped}><span className="card-topline"><span>MEANING <span className="tag-divider">/</span> 뜻과 쓰임</span><span className="card-number">{String(index+1).padStart(3,'0')}</span></span><span className="meaning-display"><span className="answer-word" lang={lang}>{current.word}</span><strong className={current.meaning.length>35?'long-meaning':''}>{current.meaning}</strong>{current.example&&<span className="example"><span lang={lang}>{current.example}</span>{current.exampleKo&&<small>{current.exampleKo}</small>}</span>}</span><span className="flip-hint"><RotateCcw size={14}/>한 번 더 누르면 단어로 돌아가요</span></span></span>
                </button>
                <button className={`card-bookmark ${saved.favorites.includes(current.id)?'saved':''}`} aria-label="현재 단어 즐겨찾기" aria-pressed={saved.favorites.includes(current.id)} onClick={()=>toggleFavorite(current)} title="즐겨찾기 (S)"><Bookmark size={20} fill={saved.favorites.includes(current.id)?'currentColor':'none'}/></button>
              </div>
              <div className="pronunciation-bar"><button className="audio-button" disabled={audioLoadState==='loading'} onClick={()=>speak(current)}><Volume2 size={19}/>발음 듣기</button><span>{audioLoadState==='loading'?'발음 준비 중':audioLabel(audioIndex,current)}<span className="bar-separator">·</span><button className="speed-button" onClick={()=>setSaved(s=>({...s,speed:s.speed===1?.75:s.speed===.75?1.25:1}))} aria-label="발음 재생 속도 변경">{saved.speed}×</button></span><button className="hint-toggle" aria-pressed={hintVisible} disabled={!current.hint} onClick={()=>setHintVisible(x=>!x)}>{current.hint?(hintVisible?'한글 힌트 숨기기':'한글 힌트 보기'):'한글 힌트 없음'} <CircleHelp size={14}/></button></div>
              <div className="audio-live" role="status">{audioStatus}</div>
              <div className="rating-heading">{flipped?'얼마나 기억하고 있나요?':'뜻을 확인한 뒤, 기억 정도를 알려주세요.'}</div><div className="rating-buttons">{[['again','모르겠어요','10분 뒤',RotateCcw],['hard','애매해요','1일 뒤',CircleHelp],['good','알아요','기록에 맞춰 복습',Check]].map(([value,label,interval,Icon],i)=><button className={`rating ${value}`} key={value} disabled={!flipped||!!rated[current.id]} onClick={()=>rate(value)}><Icon size={18}/><span>{label}<small>{interval}</small></span><kbd>{i+1}</kbd></button>)}</div>
              <div className="session-navigation"><IconButton label="이전 카드" disabled={index===0} onClick={()=>go(-1)}><ChevronLeft size={19}/></IconButton><div><span><strong>{index+1}</strong> / {session.length}</span><div className="session-progress"><i style={{width:`${index/session.length*100}%`}}/></div></div><IconButton label="다음 카드" onClick={()=>go(1)}><ChevronRight size={19}/></IconButton></div>
              <div className="card-footnote"><a href={current.source} target="_blank" rel="noreferrer">단어 출처 <ArrowUpRight size={11}/></a>{findRecording(audioIndex,current)&&<a href={findRecording(audioIndex,current).source} target="_blank" rel="noreferrer">녹음 출처·라이선스 <ArrowUpRight size={11}/></a>}<span>한글 표기는 실제 발음과 차이가 있어요.</span></div>
            </>}
          </section><aside className="learning-aside"><GoalCard count={todayCount} goal={saved.goal} onSettings={()=>setModal('settings')}/><div className="review-card"><div className="section-small-heading"><RotateCcw size={18}/>기억이 흐려지기 전에</div><p>오늘 다시 만날 단어</p><div className="review-number">{dueWords.length}<span>개</span></div><button onClick={()=>navigate('review')} disabled={view==='review'}>복습하러 가기 <ArrowRight size={16}/></button></div><div className="learning-summary"><div><span>만나본 단어</span><strong>{format(seenCount)}<small>개</small></strong></div><div><span>기억하는 단어</span><strong>{format(goodCount)}<small>개</small></strong></div><div className="summary-note">{lang==='ja'?'일본어':'영어'} 학습 기록</div></div><div className="study-tip"><span>작은 학습 팁</span><p>뜻을 보기 전에<br/><strong>소리 내어 읽어보세요.</strong></p><div>눈으로 한 번, 귀로 한 번.<br/>단어가 조금 더 오래 남을 거예요.</div></div></aside></div>
        </>}
        <footer className="page-footer"><span>모르는 단어가 아는 단어가 되는 곳, <strong>모루.</strong></span><button onClick={()=>setModal('about')}>사용 가이드 · 데이터 출처 <ArrowUpRight size={13}/></button></footer>
      </main>
    </div>
    {modal&&<Modal title={modal==='settings'?'나에게 맞는 학습 설정':'모루 사용 가이드'} onClose={()=>setModal(null)}>{modal==='settings'?<Settings saved={saved} setSaved={setSaved} announce={announce}/>:<About words={words} lang={lang}/>}</Modal>}
    {toast&&<div className="toast" role="status"><CircleCheck size={18}/>{toast}<button onClick={()=>setToast('')} aria-label="알림 닫기"><X size={16}/></button></div>}
  </div>;
}

function Empty({icon:Icon,title,description,action,onAction}) { return <div className="empty-state"><span><Icon size={28}/></span><h2>{title}</h2><p>{description}</p>{action&&<button className="secondary-button" onClick={onAction}>{action}<ArrowRight size={16}/></button>}</div>; }
function GoalCard({count,goal,onSettings}) { const percent=Math.min(100,count/goal*100);return <div className="goal-card"><div className="section-small-heading"><Target size={17}/>오늘의 작은 목표<button onClick={onSettings} aria-label="하루 목표 변경"><Settings2 size={16}/></button></div><div className="goal-ring" style={{'--progress':`${percent}%`}}><div><span>{count}<small> / {goal}</small></span><p>오늘 배운 단어</p></div></div><div className="goal-caption">{count>=goal?<><Check size={15}/>오늘의 목표를 달성했어요!</>:<>앞으로 <strong>{goal-count}개</strong>면 오늘의 목표 달성!</>}</div><div className="goal-small">매일 조금씩, 나만의 속도로.</div></div>; }

function Stats({saved,words,now,onSettings}) {
  const days=Array.from({length:14},(_,i)=>{const d=new Date(now);d.setDate(d.getDate()-13+i);return {day:dayKey(d),label:`${d.getMonth()+1}.${d.getDate()}`,count:saved.days[dayKey(d)]?.length||0};});
  const max=Math.max(saved.goal,...days.map(x=>x.count));const seen=words.filter(w=>saved.progress[w.id]);const good=seen.filter(w=>saved.progress[w.id].lastRating==='good');
  return <div className="stats-layout"><div><Growth words={words} saved={saved}/><div className="stat-tiles"><div><Layers size={20}/><span>만나본 단어</span><strong>{format(seen.length)}<small>개</small></strong></div><div><CheckCheck size={20}/><span>기억하는 단어</span><strong>{format(good.length)}<small>개</small></strong></div><div><Flame size={20}/><span>연속 학습</span><strong>{currentStreak(saved.days,new Date(now))}<small>일</small></strong></div></div><div className="activity-card"><div><h2>작은 꾸준함의 기록</h2><span>최근 14일 · 두 언어 합산</span></div><div className="activity-chart" role="img" aria-label={days.map(x=>`${x.label}: ${x.count}개`).join(', ')}>{days.map(d=><div className="chart-column" key={d.day}><span>{d.count||''}</span><div className="bar-track"><i style={{height:`${Math.max(d.count?3:0,d.count/max*100)}%`}}/></div><small>{d.label}</small></div>)}</div><p>같은 날 같은 단어를 여러 번 공부해도 한 단어로 기록해요.</p></div><div className="progress-card"><h2>내 단어장은 이만큼 자랐어요</h2><div className="wide-progress"><i style={{width:`${seen.length/Math.max(1,words.length)*100}%`}}/></div><p>전체 {format(words.length)}개 중 <strong>{format(seen.length)}개</strong>를 만났어요. 글자 카드도 포함돼요.</p></div></div><aside><GoalCard count={saved.days[dayKey(new Date(now))]?.length||0} goal={saved.goal} onSettings={onSettings}/><div className="study-tip"><span>기록은 내 브라우저에</span><p>기기를 바꾸기 전에는<br/><strong>기록을 백업해 주세요.</strong></p><button className="text-button" onClick={onSettings}>백업 설정 열기 <ArrowRight size={15}/></button></div></aside></div>;
}

function Modal({title,onClose,children}) {
  const ref=useRef();useEffect(()=>{ref.current.showModal();const el=ref.current;const handler=()=>onClose();el.addEventListener('close',handler);return()=>el.removeEventListener('close',handler);},[]);
  return <dialog ref={ref} className="modal" onClick={e=>{if(e.target===ref.current){const r=ref.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}}}><div className="modal-heading"><h2>{title}</h2><IconButton label="창 닫기" onClick={onClose}><X size={21}/></IconButton></div><div className="modal-content">{children}</div></dialog>;
}
function Settings({saved,setSaved,announce}) {
  const fileRef=useRef();
  const backup=()=>{const blob=new Blob([JSON.stringify(saved,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`moru-backup-${dayKey()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('학습 기록 백업 파일을 만들었어요.');};
  const restore=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>15000000)throw new Error('15MB 이하의 모루 백업 파일을 선택해 주세요.');const data=JSON.parse(await file.text());const next=mergeState(saved,data);setSaved(next);announce('백업을 가져왔어요. 기존 기록과 합쳤습니다.');}catch(err){announce(err instanceof SyntaxError?'올바른 JSON 백업 파일이 아니에요.':err.message);}finally{e.target.value='';}};
  return <><div className="settings-block"><h3>하루에 몇 단어씩 배울까요?</h3><p>일본어와 영어를 합친 하루 목표예요.</p><div className="goal-options">{[10,20,30,50].map(n=><button className={saved.goal===n?'selected':''} aria-pressed={saved.goal===n} key={n} onClick={()=>setSaved(s=>({...s,goal:n}))}>{n}개{n===20&&<small>추천</small>}</button>)}</div></div><div className="settings-block"><div className="setting-row"><span><strong>한글 힌트는 필요할 때만</strong><small>카드에서는 처음에 숨겨져 있어요. ‘한글 힌트 보기’를 누르면 나타나고, 다음 카드에서는 다시 숨겨져요.</small></span><CircleHelp size={20}/></div><label className="setting-row"><span><strong>음성 재생 속도</strong><small>사람 녹음을 먼저 사용하고, 나머지는 AI 합성 음성 파일로 들어요.</small></span><select value={saved.speed} onChange={e=>setSaved(s=>({...s,speed:Number(e.target.value)}))}><option value="0.75">0.75× 천천히</option><option value="1">1× 보통</option><option value="1.25">1.25× 빠르게</option></select></label></div><div className="settings-block"><h3>내 학습 기록 보관하기</h3><p>기록은 현재 브라우저에만 저장돼요. 브라우저 데이터를 지우면 사라질 수 있으니 백업해 주세요. 가져온 기록은 기존 기록과 합쳐집니다.</p><div className="backup-buttons"><button className="secondary-button" onClick={backup}><Download size={17}/>기록 내보내기</button><button className="secondary-button" onClick={()=>fileRef.current.click()}><Upload size={17}/>기록 가져오기</button><input hidden ref={fileRef} type="file" accept=".json,application/json" onChange={restore}/></div></div><div className="keyboard-guide"><Keyboard size={17}/><span><kbd>Space</kbd> 카드 뒤집기 <kbd>←</kbd><kbd>→</kbd> 이동 <kbd>L</kbd> 발음 <kbd>S</kbd> 저장</span></div></>;
}
function About({words,lang}) { return <div className="about-content"><div className="about-brand"><span className="brand-mark"><BookOpen size={27}/></span><h3>모르는 단어가, 아는 단어로.</h3><p>일본어와 영어를 매일 조금씩 익히는 나만의 학습 공간.</p></div><h3>이렇게 시작해요</h3><ol><li>‘오늘의 학습’에서 복습할 단어와 새 단어를 함께 공부해요. 하루 새 단어 수는 5·10·15개 중 고를 수 있어요.</li><li>정답을 보기 전에 먼저 떠올려요. 한글 힌트는 필요할 때만 열고, 힌트로 맞힌 단어는 더 일찍 복습해요.</li><li>단어를 익힌 뒤 뜻 보고 말하기·듣기·문장 빈칸·따라 말하기로 연습해요. 중간에 쉬어도 같은 날 이어서 할 수 있어요.</li><li>‘단어 학습’에서는 모든 카드를 자유롭게 볼 수 있어요. 하루 목표와 단어장 전체 개수는 별개예요.</li></ol><h3>단어와 난이도에 대해</h3><p>현재 {lang==='ja'?'일본어':'영어'} 단어장에 {format(words.length)}개의 단어·표현·글자 카드가 있어요. 핵심 어휘를 먼저 제시하고 공개 사전 어휘로 확장했어요. ‘자주 쓰는 단어’와 난이도는 출처 순위·학습 목록을 활용한 학습용 분류이며 공식 시험 등급이나 정확한 회화 빈도 순위는 아니에요. 공개 데이터에는 뜻·발음 오류가 남아 있을 수 있어요.</p><h3>발음에 대해</h3><p>실제 사람이 읽은 파일은 ‘사람 녹음’, AI로 만든 파일은 ‘AI 합성 음성’으로 구분해요. 음성 파일은 기기에 별도 언어 음성을 설치하지 않아도 재생돼요. 듣기 퀴즈에는 파일이 준비된 단어만 출제하며, 재생하지 못한 문제는 채점 없이 건너뛸 수 있어요. 한글 힌트는 장음·강세·억양을 완전히 표현하지 못하며, ‘자동 한글 힌트’는 기계 변환한 근사 표기예요.</p><p>AI 음성의 발음·강세·억양에는 오류가 있을 수 있어요. <a href="https://huggingface.co/hexgrad/Kokoro-82M" target="_blank" rel="noreferrer">Kokoro</a>와 <a href="https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/ljspeech/medium" target="_blank" rel="noreferrer">Piper</a> 음성 모델을 사용합니다. <a href={`${import.meta.env.BASE_URL}licenses/SYNTHETIC-AUDIO-NOTES.md`} target="_blank" rel="noreferrer">AI 음성 출처·검증 범위 보기</a></p><h3>공개 데이터에 감사드립니다</h3><ul><li><a href="https://kaikki.org/kowiktionary/일본어/index.html" target="_blank" rel="noreferrer">Kaikki / 한국어 위키낱말사전 일본어 자료</a> — CC BY-SA</li><li><a href="https://github.com/jhseo1211/open-english-korean-dict" target="_blank" rel="noreferrer">Open English-Korean Dictionary</a> — CC BY-SA 4.0</li><li><a href="https://github.com/ringooai/open-vocabularies" target="_blank" rel="noreferrer">Ringoo Open Vocabularies / Open Anki JLPT Decks</a> — MIT</li><li><a href="https://commons.wikimedia.org/" target="_blank" rel="noreferrer">Wikimedia Commons</a> · <a href="https://en.wiktionary.org/" target="_blank" rel="noreferrer">Wiktionary</a> — 녹음별 저자·라이선스는 카드의 출처 링크에서 확인</li></ul><p><a href={`${import.meta.env.BASE_URL}licenses/DATA-NOTES.md`} target="_blank" rel="noreferrer">단어 데이터·수정 내역·라이선스</a> · <a href={`${import.meta.env.BASE_URL}audio-credits.html`} target="_blank" rel="noreferrer">녹음별 저자와 라이선스 전체 보기</a></p></div>; }
