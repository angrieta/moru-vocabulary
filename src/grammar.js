import first from './grammar-data.js';
import middle from './grammar-middle.js';
import conversation from './grammar-conversation.js';

export { grammarGroups, grammarSources } from './grammar-data.js';
export const grammarLessons = [...first, ...middle, ...conversation].map((lesson, i) => ({
  ...lesson, number: i + 1,
  questions: lesson.questions.map((q, index) => ({ ...q, id: `${lesson.id}-${index}`, lessonId: lesson.id })),
}));
export const grammarQuestions = Object.fromEntries(grammarLessons.flatMap(l => l.questions.map(q => [q.id, q])));

export function shuffledIndices(length, random = Math.random) {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

export function sentence(chunks, indices = chunks.map((_, i) => i), punctuation = '.') {
  const parts = indices.map(i => chunks[i].en);
  // Let's is sentence-initial in the canonical version, but can follow a time phrase.
  const text = parts.map((part, i) => i > 0 && part.startsWith("Let's") ? part.replace("Let's", "let's") : part).join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1) + punctuation;
}

export function gradeGrammarQuestion(question, answer) {
  if (!question) return null;
  if (question.type === 'choice') {
    if (!Number.isInteger(answer) || !question.options[answer]) return null;
    const selected = question.options[answer];
    return {
      correct: selected.correct, why: selected.why, selected: selected.text,
      solution: question.options.find(o => o.correct).text,
    };
  }
  const n = question.chunks.length;
  if (!Array.isArray(answer) || answer.length !== n || new Set(answer).size !== n ||
    answer.some(i => !Number.isInteger(i) || i < 0 || i >= n)) return null;
  const canonical = question.chunks.map((_, i) => i);
  const accepted = [canonical, ...(question.alternatives || [])];
  const correct = accepted.some(order => order.every((i, j) => answer[j] === i));
  // Compare to the valid order closest to the learner's beginning, so a valid
  // fronted time phrase never receives a contradictory "subject must be first".
  const prefix = order => { const index = order.findIndex((id, i) => answer[i] !== id); return index < 0 ? n : index; };
  const closest = accepted.reduce((best, order) => prefix(order) > prefix(best) ? order : best);
  const different = prefix(closest);
  const expected = question.chunks[closest[different]];
  const selected = question.chunks[answer[different]];
  return {
    correct, selected: sentence(question.chunks, answer, question.punctuation),
    solution: sentence(question.chunks, correct ? answer : closest, question.punctuation),
    why: correct
      ? `말의 순서를 잘 연결했어요. ${answer.map(i => `${question.chunks[i].en}(${question.chunks[i].ko})`).join(' → ')} 순서로 뜻이 이어져요.`
      : `${different + 1}번째 자리에 ‘${selected.en}’을 놓았어요. 이번 수업에서 익힌 순서로는 ‘${expected.en}’(${expected.role})이 먼저 와요. ${expected.why}`,
  };
}

export function normalizeGrammar(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result = {};
  for (const [id, value] of Object.entries(raw)) {
    if (!Object.hasOwn(grammarQuestions, id) || !value || !Number.isSafeInteger(value.attempts) || value.attempts < 1 ||
      !Number.isSafeInteger(value.correct) || value.correct < 0 || value.correct > value.attempts ||
      typeof value.lastCorrect !== 'boolean' || !Number.isFinite(value.updated)) continue;
    result[id] = { attempts: value.attempts, correct: value.correct, lastCorrect: value.lastCorrect, updated: value.updated };
  }
  return result;
}

export function recordGrammar(state, id, correct, now = Date.now()) {
  if (!Object.hasOwn(grammarQuestions, id) || typeof correct !== 'boolean' || !Number.isFinite(now)) return state;
  const previous = state.grammar?.[id];
  return { ...state, grammar: { ...state.grammar, [id]: {
    attempts: (previous?.attempts || 0) + 1, correct: (previous?.correct || 0) + Number(correct),
    lastCorrect: correct, updated: now,
  } } };
}

export function lessonProgress(lesson, records = {}) {
  return {
    attempted: lesson.questions.filter(q => records[q.id]?.attempts > 0).length,
    correct: lesson.questions.filter(q => records[q.id]?.lastCorrect === true).length,
    mistakes: lesson.questions.filter(q => records[q.id]?.lastCorrect === false),
  };
}
