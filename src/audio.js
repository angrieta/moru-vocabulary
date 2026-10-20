let currentAudio;
let cancelPending;
let requestId = 0;

export function stopAudio() {
  requestId++;
  cancelPending?.();
  cancelPending = null;
  if (currentAudio) {
    currentAudio.onplaying = currentAudio.onended = currentAudio.onerror = null;
    currentAudio.pause();
    currentAudio.removeAttribute('src');
    currentAudio.load();
    currentAudio = null;
  }
  window.speechSynthesis?.cancel();
}

export function findRecording(index, word) {
  return index?.[word.lang]?.[word.word] || index?.[word.lang]?.[word.reading] || null;
}

export function findSynthetic(index, word) {
  return index?.synthetic?.[word.lang]?.[word.id] || null;
}

export function hasAudioFile(index, word) {
  return Boolean(findRecording(index, word)?.localPath || findSynthetic(index, word)?.localPath);
}

export function audioLabel(index, word) {
  if (findRecording(index, word)?.localPath) return '사람 녹음';
  if (findSynthetic(index, word)?.localPath) return 'AI 합성 음성';
  return findRecording(index, word) ? '외부 녹음' : '기기 합성 음성';
}

function playFile(url, speed, active, label, onStatus) {
  return new Promise(resolve => {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.playbackRate = speed;
    let settled = false;
    const finish = result => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (cancelPending === cancel) cancelPending = null;
      if (!result.ok) {
        audio.onplaying = audio.onended = audio.onerror = null;
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
      resolve(result);
    };
    const cancel = () => finish({ ok: false, canceled: true });
    const timer = setTimeout(() => finish({ ok: false }), 8000);
    cancelPending = cancel;
    audio.onplaying = () => {
      if (settled || active !== requestId) return cancel();
      onStatus(`${label} · 재생 중`);
      finish({ ok: true });
    };
    audio.onended = () => { if (active === requestId) onStatus(`${label} · 재생 완료`); };
    audio.onerror = () => finish({ ok: false });
    audio.play().catch(error => finish({ ok: false, blocked: error.name === 'NotAllowedError' }));
  });
}

function waitForVoice(lang) {
  const synth = window.speechSynthesis;
  const find = () => synth.getVoices().find(v => v.lang.toLowerCase().startsWith(lang));
  const available = find();
  if (available) return Promise.resolve(available);
  return new Promise(resolve => {
    const done = () => {
      clearTimeout(timer);
      synth.removeEventListener('voiceschanged', changed);
      resolve(find());
    };
    const changed = () => { if (find()) done(); };
    const timer = setTimeout(done, 1000);
    synth.addEventListener('voiceschanged', changed);
  });
}

export async function playWord(word, index, speed, onStatus, { filesOnly = false } = {}) {
  stopAudio();
  const active = requestId;
  const human = findRecording(index, word);
  const synthetic = findSynthetic(index, word);
  const base = import.meta.env?.BASE_URL || './';
  const localUrl = entry => {
    const revision = entry.revision || entry.sha256?.slice(0,12);
    return `${base}${entry.localPath}${revision ? `?v=${encodeURIComponent(revision)}` : ''}`;
  };
  const sources = [];
  if (human?.localPath) sources.push({ url: localUrl(human), label: '사람 녹음' });
  if (synthetic?.localPath) sources.push({ url: localUrl(synthetic), label: 'AI 합성 음성' });
  if (!filesOnly && human?.url) sources.push({ url: human.url, label: '사람 녹음' });
  for (const source of sources) {
    onStatus('발음 파일을 불러오는 중…');
    const result = await playFile(source.url, speed, active, source.label, onStatus);
    if (active !== requestId || result.canceled) return false;
    if (result.ok) return true;
    if (result.blocked) {
      onStatus('재생이 잠시 차단됐어요. 듣기 버튼을 다시 눌러 주세요.');
      return false;
    }
  }
  if (active !== requestId) return false;
  if (filesOnly) {
    onStatus('발음 파일을 불러오지 못했어요. 다시 듣거나 이 문제를 건너뛸 수 있어요.');
    return false;
  }
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    onStatus(sources.length ? '발음 파일을 불러오지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.' : '이 단어의 발음 파일을 준비 중이에요. 현재 브라우저에서는 기기 음성을 사용할 수 없어요.');
    return false;
  }
  onStatus('기기 음성을 준비하는 중…');
  const voice = await waitForVoice(word.lang);
  if (active !== requestId) return false;
  if (!voice) {
    onStatus('이 단어의 발음 파일을 준비 중이며, 기기에도 해당 언어 음성이 없어요.');
    return false;
  }
  return new Promise(resolve => {
    const utterance = new window.SpeechSynthesisUtterance(word.lang === 'ja' ? (word.reading || word.word) : word.word);
    utterance.voice = voice;
    utterance.lang = word.lang === 'ja' ? 'ja-JP' : 'en-US';
    utterance.rate = speed;
    let settled = false;
    const finish = ok => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (cancelPending === cancel) cancelPending = null;
      resolve(ok);
    };
    const cancel = () => finish(false);
    const timer = setTimeout(() => {
      if (active === requestId) onStatus('기기 음성이 응답하지 않아요. 다시 눌러 주세요.');
      finish(false);
      window.speechSynthesis.cancel();
    }, 6000);
    cancelPending = cancel;
    utterance.onstart = () => {
      if (active !== requestId) return finish(false);
      onStatus('기기 합성 음성 · 재생 중');
      finish(true);
    };
    utterance.onend = () => { if (active === requestId) onStatus('기기 합성 음성 · 재생 완료'); };
    utterance.onerror = event => {
      if (active === requestId && !['interrupted','canceled'].includes(event.error)) onStatus('기기 음성을 재생하지 못했어요. 다시 눌러 주세요.');
      finish(false);
    };
    try { window.speechSynthesis.speak(utterance); } catch { finish(false); }
  });
}
