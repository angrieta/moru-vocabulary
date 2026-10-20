import React from 'react';

export default function Buddy({celebrate=false}) {
  return <svg className={`moru-buddy ${celebrate?'celebrating':''}`} viewBox="0 0 180 160" fill="none" role="img" aria-label="모루의 새싹 친구">
    <ellipse cx="91" cy="146" rx="51" ry="8" fill="#DBEAE0"/>
    <path d="M57 122c-7 6-14 12-9 17 6 4 15 0 22-4M116 123c8 5 15 11 11 17-5 4-17-1-23-6" fill="#5FBB8A" stroke="#2A6952" strokeWidth="3" strokeLinecap="round"/>
    <path d="M44 88C33 83 25 88 29 100c2 8 9 12 17 13M135 90c10-9 18-4 16 5-1 9-7 14-16 17" fill="#8ED6AC" stroke="#2A6952" strokeWidth="3" strokeLinecap="round"/>
    <path d="M88 36c-28-3-46 21-48 48-3 34 13 55 47 56 35 0 55-19 53-53-2-30-22-54-52-51Z" fill="#9CE1B5" stroke="#2A6952" strokeWidth="3.5"/>
    <path d="M91 36C77 26 64 28 61 15c18-4 29 5 30 21Z" fill="#53B680" stroke="#2A6952" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M92 35c-1-17 9-24 27-21-1 13-13 22-27 21Z" fill="#70C895" stroke="#2A6952" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M62 52c-7 5-11 12-13 20" stroke="#CEF6D9" strokeWidth="7" strokeLinecap="round"/>
    {celebrate?<><path d="m62 83 6-5 6 5m30 0 6-5 6 5" stroke="#244F41" strokeWidth="4" strokeLinecap="round"/><path d="M80 93q12 21 24 0Z" fill="#326A51"/></>:<><ellipse cx="68" cy="82" rx="4.3" ry="6" fill="#244F41"/><ellipse cx="111" cy="82" rx="4.3" ry="6" fill="#244F41"/><path d="M82 94q8 9 16 0" stroke="#244F41" strokeWidth="3.5" strokeLinecap="round"/></>}
    <ellipse cx="58" cy="96" rx="8" ry="4.5" fill="#F6AFA3" opacity=".85"/><ellipse cx="120" cy="96" rx="8" ry="4.5" fill="#F6AFA3" opacity=".85"/>
    <path d="m153 30 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" fill="#FFC761"/>
    <circle cx="28" cy="55" r="3.5" fill="#F6B3A5"/><path d="m149 116 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#A4D4EE"/>
  </svg>;
}
