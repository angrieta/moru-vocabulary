import { choice, order } from './grammar-data.js';

// Revisit a studied pattern by rebuilding it and correcting its common mistakes.
// Existing question positions stay unchanged so old backup IDs remain valid.
export const correctionQuestion = m => choice(`문장을 고쳐 보세요: “${m.wrong}”`, [
  [m.right, `이렇게 고치면 돼요. ${m.why}`],
  [m.wrong, `그대로 두면 이 부분이 남아요. ${m.why}`],
]);
export const rebuildQuestion = lesson => order(`배운 어순으로 “${lesson.koOrder.join(' ')}”를 만들어요.`, lesson.chunks, lesson.punctuation || '.', lesson.alternatives || []);
export const expandLesson = lesson => ({
  ...lesson, questions: [...lesson.questions, rebuildQuestion(lesson), ...lesson.mistakes.map(correctionQuestion)],
});

export const expansionGroups = ['비교하고 설명하기', '생각을 문장으로', '경험과 시간 잇기', '이야기와 조건', '표현을 정확하게', '한 단계 깊은 문장', '부탁하고 조율하기', '채팅을 이어가기'];
export const expansionSources = {
  comparisons: ['British Council · 비교급·최상급', 'https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/comparative-superlative-adjectives'],
  relatives: ['British Council · 관계절', 'https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/relative-clauses-defining-relative-clauses'],
  clauses: ['Cambridge · that으로 잇는 문장', 'https://dictionary.cambridge.org/grammar/british-grammar/that-clauses'],
  perfect: ['British Council · 현재완료', 'https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/present-perfect'],
  perfectContinuous: ['British Council · 현재완료 단순형·진행형', 'https://learnenglishteens.britishcouncil.org/grammar/b1-b2-grammar/present-perfect-simple-continuous'],
  pastContinuous: ['British Council · 과거진행·과거형', 'https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/past-continuous-past-simple'],
  conditions: ['British Council · 조건문', 'https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/conditionals-zero-first-second'],
  thirdConditional: ['British Council · 과거의 가정', 'https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/conditionals-third-mixed'],
  modals: ['British Council · 허락·의무·금지', 'https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/modals-permission-obligation'],
  passive: ['British Council · 수동태', 'https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/passives'],
  ingMeaning: ['British Council · -ing / to에 따른 의미 차이', 'https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/verbs-followed-ing-or-infinitive-change-meaning'],
  pastPerfect: ['British Council · 과거완료', 'https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/past-perfect'],
  usedTo: ['British Council · used to의 여러 쓰임', 'https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2-grammar/different-uses-of-used-to'],
  favour: ['British Council · 부탁하기', 'https://learnenglish.britishcouncil.org/free-resources/speaking/b1/asking-favour'],
  clarification: ['British Council · 이해한 내용 확인하기', 'https://learnenglish.britishcouncil.org/free-resources/speaking/a1/checking-understanding'],
  chat: ['British Council · 채팅 쓰기', 'https://learnenglishteens.britishcouncil.org/skills/writing/a2-writing/chat'],
  listening: ['British Council · 잘 듣고 대화하기', 'https://learnenglish.britishcouncil.org/free-resources/learning-hub/discussions/2-being-good-listener'],
};
