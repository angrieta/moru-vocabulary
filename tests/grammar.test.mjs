import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grammarLessons, grammarQuestions, grammarSources, grammarExerciseCount, filterGrammarLessons, gradeGrammarQuestion, lessonProgress, normalizeGrammar, recordGrammar, sentence, shuffledIndices } from '../src/grammar.js';
import first from '../src/grammar-data.js';
import middle from '../src/grammar-middle.js';
import conversation from '../src/grammar-conversation.js';
import { defaults, normalizeState, mergeState } from '../src/model.js';

test('42 lessons have complete explanations, sources, unique IDs and 252 answerable exercises', () => {
  assert.equal(grammarLessons.length, 42);
  assert.equal(new Set(grammarLessons.map(l => l.id)).size, grammarLessons.length);
  assert.equal(grammarExerciseCount, 252);
  assert.equal(Object.keys(grammarQuestions).length, grammarLessons.flatMap(l => l.questions).length);
  for (const lesson of grammarLessons) {
    assert.equal(lesson.questions.length, 6);
    assert.equal(lesson.mistakes.length, 2);
    assert.equal(lesson.examples.length, 2);
    assert.ok(lesson.rules.length >= 3);
    assert.ok(lesson.sources.every(key => grammarSources[key]?.[1].startsWith('https://')));
    assert.ok(lesson.chunks.every(c => c.en && c.ko && c.role && c.why));
    for (const q of lesson.questions) {
      if (q.type === 'choice') {
        assert.equal(q.options.filter(o => o.correct).length, 1);
        q.options.forEach((option, i) => {
          const result = gradeGrammarQuestion(q, i);
          assert.equal(result.correct, option.correct);
          assert.equal(result.why, option.why);
          assert.ok(result.why.length > 10);
          assert.equal(result.selected, option.text);
        });
        assert.equal(new Set(q.options.map(o => o.why)).size, q.options.length);
        assert.equal(new Set(q.options.map(o => o.text)).size, q.options.length);
      } else {
        for (const answer of [q.chunks.map((_, i) => i), ...q.alternatives]) {
          assert.equal(gradeGrammarQuestion(q, answer)?.correct, true, `${q.id}: ${answer}`);
          assert.equal(gradeGrammarQuestion(q, answer).parts.length, q.chunks.length);
        }
      }
    }
  }
});

test('selected wrong choices give their own explanation and the corrected sentence', () => {
  const q = grammarQuestions['to-infinitive-0'];
  const missingTo = gradeGrammarQuestion(q, 1);
  const wrongIng = gradeGrammarQuestion(q, 2);
  assert.match(missingTo.why, /to가 빠졌/);
  assert.match(wrongIng.why, /원형 learn/);
  assert.equal(wrongIng.solution, 'I want to learn English.');
  assert.equal(gradeGrammarQuestion(q, null), null);
  assert.equal(gradeGrammarQuestion(q, '0'), null);
});

test('order feedback identifies the first misplaced chunk, including alternative beginnings', () => {
  const wrong = gradeGrammarQuestion(grammarQuestions['word-order-1'], [0, 2, 1]);
  assert.equal(wrong.correct, false);
  assert.match(wrong.why, /2번째.*movies.*watch/);
  assert.equal(wrong.solution, 'We watch movies.');
  const fronted = gradeGrammarQuestion(grammarQuestions['past-1'], [3, 0, 2, 1]);
  assert.equal(fronted.correct, false);
  assert.match(fronted.why, /3번째.*watched/);
  assert.equal(fronted.solution, 'Yesterday I watched a movie.');
});

test('incomplete, repeated and out-of-range sentence pieces cannot be graded', () => {
  const q = grammarQuestions['word-order-1'];
  for (const answer of [null, [], [0, 1], [0, 1, 1], [0, 1, 4], [0, 1, -1], [0, 1, '2']]) {
    assert.equal(gradeGrammarQuestion(q, answer), null);
  }
});

test('acceptable alternative orders retain their own sentence and explanation order', () => {
  const result = gradeGrammarQuestion(grammarQuestions['time-1'], [2, 0, 1]);
  assert.equal(result.correct, true);
  assert.equal(result.solution, "On Saturday let's meet.");
  assert.ok(result.why.indexOf('on Saturday') < result.why.indexOf("Let's"));
  assert.deepEqual(result.parts.map(c => c.en), ['on Saturday', "Let's", 'meet']);
  assert.equal(gradeGrammarQuestion(grammarQuestions['connectors-1'], [2, 1, 0]).correct, true);
  assert.equal(sentence(grammarLessons[2].chunks, undefined, '?'), 'Are you free?');
});

test('original exercise IDs and saved answers survive the expansion without counting new exercises as done', () => {
  let state = defaults();
  for (const legacy of [...first, ...middle, ...conversation]) {
    const expanded = grammarLessons.find(l => l.id === legacy.id);
    legacy.questions.forEach((q, i) => {
      assert.deepEqual(expanded.questions[i], { ...q, id: `${legacy.id}-${i}`, lessonId: legacy.id });
      state = recordGrammar(state, `${legacy.id}-${i}`, true, 100);
    });
    assert.equal(lessonProgress(expanded, state.grammar).attempted, 3);
    assert.equal(lessonProgress(expanded, state.grammar).correct, 3);
    assert.ok(lessonProgress(expanded, state.grammar).attempted < expanded.questions.length);
  }
  const restored = normalizeState(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(restored.grammar, state.grammar);
  const withNew = recordGrammar(restored, 'clarification-5', false, 200);
  assert.equal(lessonProgress(grammarLessons.find(l => l.id === 'clarification'), withNew.grammar).mistakes.length, 1);
});

test('course filters and Korean or English searches find lessons without changing the catalog', () => {
  assert.equal(filterGrammarLessons('foundation').length, 18);
  assert.equal(filterGrammarLessons('expansion').length, 18);
  assert.equal(filterGrammarLessons('chat').length, 6);
  assert.ok(filterGrammarLessons('expansion', '현재완료').some(l => l.id === 'perfect-experience'));
  assert.ok(filterGrammarLessons('chat', ' COULD YOU ').some(l => l.id === 'polite-request'));
  assert.equal(filterGrammarLessons('foundation', '현재완료').length, 0);
  assert.equal(filterGrammarLessons('all', '없는 수업 987654').length, 0);
  assert.equal(filterGrammarLessons().length, 42);
});

test('conditional and time clauses keep correct capitalization, punctuation and explanation order when moved', () => {
  const q = grammarQuestions['first-conditional-3'];
  assert.equal(gradeGrammarQuestion(q, [0, 1, 2]).solution, 'If I am free, I will call you.');
  const alternate = gradeGrammarQuestion(q, [1, 2, 0]);
  assert.equal(alternate.correct, true);
  assert.equal(alternate.solution, 'I will call you if I am free.');
  assert.equal(alternate.parts[0].en, 'I will');
  assert.equal(gradeGrammarQuestion(grammarQuestions['past-perfect-3'], [2, 0, 1]).solution, 'When I arrived, the game had already started.');
  assert.equal(gradeGrammarQuestion(grammarQuestions['there-quantifiers-3'], [2, 0, 1]).solution, 'Nearby there are two cafes.');
  assert.equal(sentence(grammarLessons.find(l => l.id === 'chat-tone').chunks), "I'm busy now. I'll reply later.");
});

test('meaning and conversation feedback distinguishes grammar errors from a different intent', () => {
  const optional = grammarQuestions['advice-obligation-0'];
  const forbidden = optional.options.findIndex(o => o.text.includes("mustn't"));
  assert.equal(gradeGrammarQuestion(optional, forbidden).correct, false);
  assert.match(gradeGrammarQuestion(optional, forbidden).why, /금지/);
  const conversation = grammarQuestions['keep-conversation-0'];
  const short = conversation.options.findIndex(o => o.text === 'Okay.');
  assert.match(gradeGrammarQuestion(conversation, short).why, /틀린 문장은 아니지만/);
  const meaning = grammarQuestions['ing-to-meaning-0'];
  assert.equal(gradeGrammarQuestion(meaning, 0).correct, true);
  assert.match(gradeGrammarQuestion(meaning, 1).why, /stopped drinking/);
  const silent = grammarQuestions['clarification-0'];
  assert.equal(gradeGrammarQuestion(silent, 0).solution, 'Could you type that, please?');
});

test('randomized display indices preserve original answer identity', () => {
  const order = shuffledIndices(3, () => 0);
  assert.deepEqual([...order].sort(), [0, 1, 2]);
  assert.notDeepEqual(order, [0, 1, 2]);
  const q = grammarQuestions['be-0'];
  assert.equal(gradeGrammarQuestion(q, order.find(i => q.options[i].correct)).correct, true);
});

test('grammar practice persists independently from vocabulary and tracks unresolved mistakes', () => {
  const initial = defaults();
  let state = recordGrammar(initial, 'be-0', false, 10);
  assert.equal(lessonProgress(grammarLessons[1], state.grammar).mistakes.length, 1);
  state = recordGrammar(state, 'be-0', true, 20);
  assert.deepEqual(state.grammar['be-0'], { attempts:2, correct:1, lastCorrect:true, updated:20 });
  assert.equal(lessonProgress(grammarLessons[1], state.grammar).mistakes.length, 0);
  assert.equal(lessonProgress(grammarLessons[1], state.grammar).attempted, 1);
  assert.equal(state.progress, initial.progress);
  assert.equal(state.days, initial.days);
  assert.equal(state.practice, initial.practice);
  assert.equal(recordGrammar(state, 'unknown', true), state);
  assert.equal(recordGrammar(state, 'constructor', true), state);
});

test('old backups still load and invalid grammar records are discarded', () => {
  const legacy = defaults(); delete legacy.grammar;
  assert.deepEqual(normalizeState(legacy).grammar, {});
  const valid = { attempts:1, correct:0, lastCorrect:false, updated:100 };
  assert.deepEqual(normalizeGrammar({ 'be-0':valid, unknown:valid, 'be-1':{ ...valid, correct:2 }, 'be-2':{ ...valid, lastCorrect:'false' } }), { 'be-0':valid });
  assert.deepEqual(normalizeGrammar([]), {});
  assert.deepEqual(normalizeGrammar({ constructor:valid, toString:valid }), {});
});

test('backup merge chooses the latest per-question result without doubling attempts', () => {
  const current = recordGrammar(defaults(), 'be-0', false, 20);
  const old = recordGrammar(defaults(), 'be-0', true, 10);
  assert.deepEqual(mergeState(current, old).grammar, current.grammar);
  const newState = recordGrammar(current, 'be-0', true, 30);
  const merged = mergeState(current, newState);
  assert.deepEqual(merged.grammar, newState.grammar);
  assert.deepEqual(mergeState(merged, newState).grammar, merged.grammar);
  assert.deepEqual(normalizeState(merged).grammar, merged.grammar);
});
