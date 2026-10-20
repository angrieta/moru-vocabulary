export const STORAGE_KEY = 'moru-learning-v1';
export const defaults = () => ({ version: 1, lang: 'ja', goal: 20, hints: true, speed: 1, progress: {}, favorites: [], days: {} });
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function normalizeState(raw) {
  if (!raw || raw.version !== 1 || typeof raw.progress !== 'object' || Array.isArray(raw.progress) || !raw.progress) throw new Error('모루 학습 기록 파일이 아니에요.');
  const base = defaults();
  const progress = {};
  for (const [id, p] of Object.entries(raw.progress)) {
    if (!/^(ja|en)-/.test(id) || !p || !Number.isFinite(p.due) || !Number.isFinite(p.seen) || p.seen < 0) continue;
    if (!['again', 'hard', 'good'].includes(p.lastRating)) continue;
    progress[id] = { due: p.due, seen: p.seen, interval: Math.max(0, Number(p.interval) || 0), streak: Math.max(0, Number(p.streak) || 0), lapses: Math.max(0, Number(p.lapses) || 0), lastRating: p.lastRating, updated: Number(p.updated) || 0 };
  }
  const days = {};
  for (const [day, value] of Object.entries(raw.days || {})) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(day) && Array.isArray(value)) days[day] = [...new Set(value.filter(x => typeof x === 'string' && /^(ja|en)-/.test(x)))];
  }
  return { ...base, lang: raw.lang === 'en' ? 'en' : 'ja', goal: [10,20,30,50].includes(raw.goal) ? raw.goal : 20, hints: raw.hints !== false, speed: [.75,1,1.25].includes(raw.speed) ? raw.speed : 1, progress, favorites: [...new Set((Array.isArray(raw.favorites) ? raw.favorites : []).filter(x => typeof x === 'string' && /^(ja|en)-/.test(x)))], days };
}
export function readState(storage) {
  try { const raw = storage.getItem(STORAGE_KEY); return { data: raw ? normalizeState(JSON.parse(raw)) : defaults(), error: null }; }
  catch { return { data: defaults(), error: '저장된 기록을 읽지 못했어요. 새 기록은 이 브라우저에 저장됩니다.' }; }
}
export function schedule(previous, rating, now = Date.now()) {
  const prev = previous || { interval: 0, streak: 0, seen: 0, lapses: 0 };
  const interval = rating === 'again' ? 10 / 1440 : rating === 'hard' ? 1 : Math.max(3, Math.round((prev.interval || 0) * 2));
  return { interval, due: now + interval * 86400000, streak: rating === 'good' ? prev.streak + 1 : 0, seen: prev.seen + 1, lapses: prev.lapses + (rating === 'again' ? 1 : 0), lastRating: rating, updated: now };
}
export function recordReview(state, id, rating, now = Date.now()) {
  const day = dayKey(new Date(now));
  return { ...state, progress: { ...state.progress, [id]: schedule(state.progress[id], rating, now) }, days: { ...state.days, [day]: [...new Set([...(state.days[day] || []), id])] } };
}
export function mergeState(current, incoming) {
  const clean = normalizeState(incoming);
  const progress = { ...current.progress };
  for (const [id, p] of Object.entries(clean.progress)) if (!progress[id] || p.updated > progress[id].updated) progress[id] = p;
  const days = { ...current.days };
  for (const [day, ids] of Object.entries(clean.days)) days[day] = [...new Set([...(days[day] || []), ...ids])];
  return { ...current, progress, days, favorites: [...new Set([...current.favorites, ...clean.favorites])] };
}
export function filterWords(words, { category = 'essential', query = '', view = 'study', notebook = 'favorites', progress = {}, favorites = [], now = Date.now() }) {
  const term = query.trim().toLocaleLowerCase();
  const favoriteSet = new Set(favorites);
  return words.filter(w => {
    if (view === 'review' && !(progress[w.id]?.due <= now)) return false;
    if (view === 'notebook' && (notebook === 'favorites' ? !favoriteSet.has(w.id) : !progress[w.id] || progress[w.id].lastRating === 'good')) return false;
    if (view === 'study' && !term && category !== 'all' && !w.tags.includes(category)) return false;
    return !term || [w.word, w.reading, w.meaning, w.hint].some(x => x?.toLocaleLowerCase().includes(term));
  }).sort((a,b) => view === 'review' ? (progress[a.id].due - progress[b.id].due) : a.rank - b.rank);
}
export function makeSession(words, progress, count = 20, review = false) {
  if (review) return words.slice(0, count);
  return [...words].sort((a,b) => ((progress[a.id]?.seen || 0) > 0) - ((progress[b.id]?.seen || 0) > 0) || a.rank - b.rank).slice(0, count);
}
export function shuffle(items, random = Math.random) {
  const output = [...items];
  for (let i = output.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [output[i], output[j]] = [output[j], output[i]]; }
  return output;
}
export function quizChoices(word, pool, random = Math.random) {
  const byMeaning = new Map();
  for (const w of shuffle(pool, random)) if (w.meaning !== word.meaning && !byMeaning.has(w.meaning)) byMeaning.set(w.meaning, w);
  return shuffle([word, ...[...byMeaning.values()].slice(0,3)], random);
}
export function currentStreak(days, now = new Date()) {
  const date = new Date(now); let count = 0;
  if (!days[dayKey(date)]?.length) date.setDate(date.getDate() - 1);
  while (days[dayKey(date)]?.length) { count++; date.setDate(date.getDate() - 1); }
  return count;
}
