import React from 'react';
import { Headphones } from 'lucide-react';
import './listening.css';

export default function ListeningButton({ busy, heard, onClick }) {
  return <button type="button" className="listening-button" disabled={busy} aria-busy={busy} onClick={onClick}>
    <span className="listening-button-icon" aria-hidden="true"><Headphones size={30}/></span>
    <span>{busy ? '불러오는 중…' : heard ? '다시 듣기' : '눌러서 듣기'}</span>
  </button>;
}
