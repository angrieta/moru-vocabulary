let currentAudio;
let requestId = 0;
export function stopAudio() {
  requestId++;
  if (currentAudio) { currentAudio.pause(); currentAudio.src = ''; currentAudio = null; }
  window.speechSynthesis?.cancel();
}
export function findRecording(index, word) {
  return index?.[word.lang]?.[word.word] || index?.[word.lang]?.[word.reading] || null;
}
export async function playWord(word, index, speed, onStatus) {
  stopAudio(); const active = requestId;
  const recording = findRecording(index, word);
  if (recording) {
    onStatus('녹음 음성을 불러오는 중…');
    try {
      const audio = new Audio(recording.url);
      currentAudio = audio; audio.playbackRate = speed;
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('timeout')), 6500);
        audio.onplaying = () => { clearTimeout(timer); resolve(); };
        audio.onerror = () => { clearTimeout(timer); reject(new Error('audio')); };
        audio.play().catch(error => { clearTimeout(timer); reject(error); });
      });
      if (active !== requestId) return false;
      onStatus('녹음 음성 재생 중'); audio.onended = () => { if (active === requestId) onStatus('녹음 음성'); }; return true;
    } catch { if (active !== requestId) return false; currentAudio?.pause(); }
  }
  if (active !== requestId) return false;
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { onStatus('이 브라우저에서는 음성을 재생할 수 없어요.'); return false; }
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.toLowerCase().startsWith(word.lang));
  if (!voice) { onStatus(`${word.lang === 'ja' ? '일본어' : '영어'} 음성이 없어요. 기기에 해당 언어 음성을 설치해 주세요.`); return false; }
  const utterance = new SpeechSynthesisUtterance(word.lang === 'ja' ? (word.reading || word.word) : word.word);
  utterance.voice = voice; utterance.lang = word.lang === 'ja' ? 'ja-JP' : 'en-US'; utterance.rate = speed;
  utterance.onstart = () => { if (active === requestId) onStatus(recording ? '녹음 연결 실패 · 합성 음성 재생 중' : '합성 음성 재생 중'); };
  utterance.onend = () => { if (active === requestId) onStatus('합성 음성'); };
  utterance.onerror = event => { if (active === requestId && event.error !== 'interrupted' && event.error !== 'canceled') onStatus('음성을 재생하지 못했어요. 다시 눌러 주세요.'); };
  window.speechSynthesis.speak(utterance); return true;
}
