import React from 'react';
import { VolumeX } from 'lucide-react';
import './listening.css';

export function SilentModeButton({ onClick }) {
  return <div className="silent-mode-option">
    <button type="button" className="secondary-button" onClick={onClick}><VolumeX size={18} aria-hidden="true"/>소리 없이 풀기</button>
    <span>소리를 못 듣는 상황이라면, 단어를 보고 풀어요.</span>
  </div>;
}

export default function SilentQuestion({ word, quietMode, onQuietModeChange, locked }) {
  return <div className="silent-question">
    <span className="silent-mode-badge"><VolumeX size={16} aria-hidden="true"/>소리 없이 · 뜻 맞히기</span>
    <h2 lang={word.lang}>{word.word}</h2>
    {word.lang === 'ja' && word.reading !== word.word && <p className="practice-reading" lang="ja">{word.reading}</p>}
    <p>단어를 보고 알맞은 뜻을 골라주세요.</p>
    <label className="silent-mode-preference">
      <input type="checkbox" checked={quietMode} disabled={locked} onChange={event => onQuietModeChange(event.target.checked)}/>
      다음 듣기 문제도 소리 없이
    </label>
    <small>이 문제는 뜻 맞히기로 기록해요.</small>
  </div>;
}
