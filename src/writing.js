export function normalizeWriting(raw) {
  const result = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;
  for (const [char, value] of Object.entries(raw)) {
    if (!/^\p{Script=Han}$/u.test(char) || !value || !Number.isSafeInteger(value.attempts) || value.attempts < 1 ||
      !Number.isSafeInteger(value.recall) || value.recall < 0 || value.recall > value.attempts ||
      !Number.isFinite(value.updated) || !['again', 'good'].includes(value.lastRating)) continue;
    result[char] = { attempts: value.attempts, recall: value.recall, updated: value.updated, lastRating: value.lastRating };
  }
  return result;
}

// Self-assessed handwriting practice is intentionally separate from vocabulary grades.
export function recordWriting(state, char, rating, recalled, now = Date.now()) {
  if (!/^\p{Script=Han}$/u.test(char) || !['again', 'good'].includes(rating)) return state;
  const previous = state.writing?.[char];
  return {...state, writing: {...state.writing, [char]: {
    attempts: (previous?.attempts || 0) + 1,
    recall: (previous?.recall || 0) + Number(rating === 'good' && recalled === true),
    lastRating: rating, updated: now,
  }}};
}

export function penPoint(clientX, clientY, rect) {
  if (rect.width <= 0 || rect.height <= 0) return null;
  return [
    Math.max(0, Math.min(109, (clientX - rect.left) / rect.width * 109)),
    Math.max(0, Math.min(109, (clientY - rect.top) / rect.height * 109)),
  ];
}
