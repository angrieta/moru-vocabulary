import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { jaCore, enCore } from './core-vocabulary.mjs';
import { jaCorrections, enCorrections, conversation } from './vocabulary-corrections.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.resolve(process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : path.join(root, 'work/sources'));
const lock = JSON.parse(await fs.readFile(path.join(root, 'scripts/source-lock.json'), 'utf8'));
const digest = value => createHash('sha256').update(value).digest('hex');
const source = {};
for (const item of lock.files) {
  let bytes;
  try { bytes = await fs.readFile(path.join(sourceDir, item.name)); }
  catch {
    try { bytes = gunzipSync(await fs.readFile(path.join(root, 'scripts/source-snapshots', item.name + '.gz'))); }
    catch {
      if (!process.argv.includes('--download')) throw new Error(`Missing ${item.name}. Provide a source directory or use --download.`);
      const response = await fetch(item.url);
      if (!response.ok) throw new Error(`${item.name}: HTTP ${response.status}`);
      bytes = Buffer.from(await response.arrayBuffer());
    }
  }
  if (digest(bytes) !== item.sha256) throw new Error(`Integrity mismatch for ${item.name}. The upstream snapshot may have changed; do not silently rebuild with unreviewed data.`);
  source[item.name] = bytes.toString('utf8');
}

function csv(text) {
  const rows = []; let row = [], value = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i+1] === '"') {value += '"'; i++;} else quoted = !quoted; }
    else if (c === ',' && !quoted) {row.push(value); value = '';}
    else if (c === '\n' && !quoted) {row.push(value.replace(/\r$/, '')); rows.push(row); row = []; value = '';}
    else value += c;
  }
  if (value || row.length) {row.push(value.replace(/\r$/, '')); rows.push(row);}
  return rows.slice(1);
}

const kanaMap = {};
const kanaLines = [
  ['あいうえお','아 이 우 에 오'], ['かきくけこ','카 키 쿠 케 코'], ['さしすせそ','사 시 스 세 소'],
  ['たちつてと','타 치 츠 테 토'], ['なにぬねの','나 니 누 네 노'], ['はひふへほ','하 히 후 헤 호'],
  ['まみむめも','마 미 무 메 모'], ['やゆよ','야 유 요'], ['らりるれろ','라 리 루 레 로'], ['わをん','와 오 응'],
  ['がぎぐげご','가 기 구 게 고'], ['ざじずぜぞ','자 지 즈 제 조'], ['だぢづでど','다 지 즈 데 도'],
  ['ばびぶべぼ','바 비 부 베 보'], ['ぱぴぷぺぽ','파 피 푸 페 포'],
];
for (const [kana, ko] of kanaLines) [...kana].forEach((k,i) => kanaMap[k] = ko.split(' ')[i]);
const contracted = {きゃ:'캬',きゅ:'큐',きょ:'쿄',しゃ:'샤',しゅ:'슈',しょ:'쇼',ちゃ:'차',ちゅ:'추',ちょ:'초',にゃ:'냐',にゅ:'뉴',にょ:'뇨',ひゃ:'햐',ひゅ:'휴',ひょ:'효',みゃ:'먀',みゅ:'뮤',みょ:'묘',りゃ:'랴',りゅ:'류',りょ:'료',ぎゃ:'갸',ぎゅ:'규',ぎょ:'교',じゃ:'자',じゅ:'주',じょ:'조',びゃ:'뱌',びゅ:'뷰',びょ:'뵤',ぴゃ:'퍄',ぴゅ:'퓨',ぴょ:'표'};
const extended = {ふぁ:'파',ふぃ:'피',ふぇ:'페',ふぉ:'포',てぃ:'티',でぃ:'디',とぅ:'투',どぅ:'두',うぃ:'위',うぇ:'웨',うぉ:'워',しぇ:'셰',じぇ:'제',ちぇ:'체',ゔぁ:'바',ゔぃ:'비',ゔぇ:'베',ゔぉ:'보',ゔ:'부',ぁ:'아',ぃ:'이',ぅ:'우',ぇ:'에',ぉ:'오',ゃ:'야',ゅ:'유',ょ:'요'};
const hira = text => [...text].map(c => c >= 'ァ' && c <= 'ヶ' ? String.fromCharCode(c.charCodeAt(0)-96) : c).join('');
const kata = text => [...text].map(c => c >= 'ぁ' && c <= 'ゖ' ? String.fromCharCode(c.charCodeAt(0)+96) : c).join('');
function addCoda(out, coda) {
  const chars = [...out], code = chars.at(-1)?.charCodeAt(0);
  if (code >= 0xAC00 && code <= 0xD7A3 && (code-0xAC00)%28 === 0) chars[chars.length-1] = String.fromCharCode(code+coda);
  else chars.push(coda === 4 ? 'ㄴ' : coda === 16 ? 'ㅁ' : 'ㅅ');
  return chars.join('');
}
function kanaHint(reading) {
  const r = hira(reading); let out = '';
  for (let i=0; i<r.length; i++) {
    const pair = r.slice(i,i+2);
    if (contracted[pair] || extended[pair]) {out += contracted[pair] || extended[pair]; i++;}
    else if (r[i] === 'っ') {out = addCoda(out,19);}
    else if (r[i] === 'ん') {out = addCoda(out, /[まみむめもばびぶべぼぱぴぷぺぽ]/.test(r[i+1]||'') ? 16 : 4);}
    else if (r[i] === 'ー') {out += 'ː';}
    else out += kanaMap[r[i]] || extended[r[i]] || (/[・\s]/.test(r[i])?' ':'');
  }
  return out;
}

// Deliberately limited IPA aid. It is marked automatic, never a substitute for audio/IPA.
const onset = {p:17,b:7,t:16,d:3,k:15,g:0,ɡ:0,f:17,v:7,θ:9,ð:3,s:9,z:12,ʃ:9,ʒ:12,h:18,m:6,n:2,ŋ:11,l:5,r:5,ɹ:5,j:12,w:11,'tʃ':14,'dʒ':12};
const vowels = {a:0,i:20,ɪ:20,e:5,ɛ:5,æ:1,ɑ:0,ɒ:0,ɔ:8,o:8,ʊ:13,u:13,ʌ:4,ə:4,ɜ:4,ɚ:4,ɝ:4,ɐ:0};
const solo = {p:'프',b:'브',t:'트',d:'드',k:'크',g:'그',ɡ:'그',f:'프',v:'브',θ:'스',ð:'드',s:'스',z:'즈',ʃ:'시',ʒ:'지',h:'흐',m:'므',n:'느',ŋ:'응',l:'르',r:'르',ɹ:'르',j:'이',w:'우','tʃ':'치','dʒ':'지'};
function ipaHint(ipa) {
  if (!ipa) return '';
  let clean = ipa.split(',')[0].replace(/[\/\[\]ˈˌːˑ.()]/g,'').trim();
  if (/[^a-zɪɛæɑɒɔʊʌəɜɚɝɐθðʃʒŋɹɡ\s-]/.test(clean)) return '';
  const tokens = clean.match(/tʃ|dʒ|./gu)||[]; let out='';
  for (let i=0; i<tokens.length; i++) {
    const t=tokens[i], next=tokens[i+1];
    if (t==='w' && next in vowels) {out += ({i:'위',ɪ:'위',e:'웨',ɛ:'웨',æ:'왜',a:'와',ɑ:'와',ɒ:'와',ɔ:'워',o:'워',ʊ:'우',u:'우',ʌ:'워',ə:'워',ɜ:'워'})[next]||'워'; i++;}
    else if(t==='j' && next in vowels) {out += ({i:'이',ɪ:'이',e:'예',ɛ:'예',æ:'얘',a:'야',ɑ:'야',ɒ:'야',ɔ:'요',o:'요',ʊ:'유',u:'유',ʌ:'여',ə:'여',ɜ:'여'})[next]||'여'; i++;}
    else if (t==='ʃ' && next in vowels) {out += ({i:'시',ɪ:'시',e:'셰',ɛ:'셰',æ:'섀',a:'샤',ɑ:'샤',ɒ:'샤',ɔ:'쇼',o:'쇼',ʊ:'슈',u:'슈',ʌ:'셔',ə:'셔',ɜ:'셔'})[next]||'셔'; i++;}
    else if (t in onset && next in vowels) {out += String.fromCharCode(0xAC00+(onset[t]*21+vowels[next])*28); i++;}
    else if (t in vowels) out += String.fromCharCode(0xAC00+(11*21+vowels[t])*28);
    else if ((t === 'n'||t==='m'||t==='l'||t==='ŋ') && !(next in vowels)) out=addCoda(out,({n:4,m:16,l:8,ŋ:21})[t]);
    else out += solo[t] || (t===' '?' ':'');
  }
  return out;
}

const enUrl = 'https://github.com/jhseo1211/open-english-korean-dict';
const wikiUrl = word => `https://ko.wiktionary.org/wiki/${encodeURIComponent(word)}`;
const key = (lang, word) => lang + '-' + (lang==='en' ? word.toLowerCase().replace(/ /g,'-') : digest(word).slice(0,12));
const jlpt = new Map();
for (let n=5;n>=1;n--) for (const [word,reading] of csv(source[`jlpt-n${n}.csv`])) {
  const rd=reading?.trim(); if (word && /^[ぁ-ゖァ-ヺー]+$/.test(rd) && !jlpt.has(word)) jlpt.set(word,{reading:rd,n});
}
const levels = {5:'입문',4:'초급',3:'중급',2:'고급',1:'고급'};
const ja = new Map();
for (const entry of source['ja-wiki.jsonl'].trim().split('\n').map(JSON.parse)) {
  const {word,pos}=entry;
  if (!word || ['name','character','suffix','prefix','romanization','stem'].includes(pos) || word.length>22 || /^[ぁ-ゖァ-ヺ]$/.test(word)) continue;
  const glosses = (entry.senses||[]).flatMap(s=>s.glosses||[]).map(s=>s.replace(/^\s*\.\s*/, '').replace(/^\d+\.\s+/, '').trim()).filter(s=> /[가-힣]/.test(s) && s.length<=100 && !/(?:이형태|활용형|옛 표기|잘못된|표기법|독음|음독|훈독|로마자 표기|문자이다|한자이다|의 약자|의 복수형|의 단수형|어간의|단어를 만듦|번째 글자)/.test(s));
  if (!glosses.length) continue;
  const ref=jlpt.get(word);
  let reading = /^[ぁ-ゖァ-ヺー・]+$/.test(word) ? word : ref?.reading;
  if (!reading) {
    const form=entry.forms?.find(f=>f.form===word&&f.ruby?.length);
    if(form) {let candidate=word; for(const [kanji,kana] of form.ruby) candidate=candidate.replace(kanji,kana); if (/^[ぁ-ゖァ-ヺー]+$/.test(candidate)) reading=candidate;}
  }
  if (!reading) continue;
  const meaning = [...new Set(glosses)].slice(0,2).join(' · ');
  const id=key('ja',word);
  if(ja.has(id)) continue;
  const level=ref?levels[ref.n]:'확장';
  const tags=[]; if(ref?.n>=4) tags.push('frequent'); if(ref?.n<=2) tags.push('advanced');
  ja.set(id,{id,lang:'ja',word,reading,meaning,hint:kanaHint(reading),hintAuto:true,level,tags,rank:ref?(6-ref.n)*10000+ja.size:80000+ja.size,source:wikiUrl(word),curated:false,levelBasis:ref?'비공식 JLPT 목록 참고':'미분류 공개사전'});
}
for(const [i,[word,reading,meaning,hint,example,exampleKo]] of jaCore.entries()) {
  const id=key('ja',word);
  ja.set(id,{id,lang:'ja',word,reading,meaning,hint,level:'입문',tags:['essential','conversation','frequent'],rank:i+1,source:wikiUrl(word),example,exampleKo,curated:true,hintAuto:false,levelBasis:'기초 학습 추천'});
}

const characters=[];
for(const script of ['hiragana','katakana']) {
  const scriptName=script==='hiragana'?'히라가나':'가타카나';
  const table={...kanaMap,...contracted};
  for(const [i,[reading,hint]] of Object.entries(table).entries()) {
    const word=script==='hiragana'?reading:kata(reading);
    characters.push({id:`ja-${script}-${digest(word).slice(0,10)}`,lang:'ja',word,reading:word,meaning:`${hint} 소리 · ${scriptName}`,hint,level:'입문',tags:[script],rank:200000+i,source:wikiUrl(word),curated:true,hintAuto:false,levelBasis:'문자 학습'});
  }
}

const en = new Map();
const imported=Object.entries(JSON.parse(source['en.json'])).sort((a,b)=>(a[1].freq_rank||999999)-(b[1].freq_rank||999999));
for(const [word,v] of imported) {
  if(!/^[a-zA-Z]+(?:['-][a-zA-Z]+)*$/.test(word) || word.length>26 || !/[가-힣]/.test(v.meaning_ko||'') || v.meaning_ko.length>110 || /(?:번역 없음|알 수 없음|미번역|뜻 없음)/.test(v.meaning_ko)) continue;
  if(word.length<=2 && !new Set(['a','i','be','do','go','he','if','in','is','it','me','my','no','of','on','or','so','to','up','us','we','an','as','at','by','am','ox']).has(word.toLowerCase())) continue;
  const cefr=v.cefr;
  const level=({A1:'입문',A2:'초급',B1:'중급',B2:'중급',C1:'고급',C2:'고급'})[cefr]||'확장';
  const rank=Number(v.freq_rank)||999999;
  const tags=[]; if(rank<=3000) tags.push('frequent'); if(cefr==='C1'||cefr==='C2') tags.push('advanced');
  const id=key('en',word), reading=v.ipa||'', hint=ipaHint(reading);
  en.set(id,{id,lang:'en',word,reading,meaning:v.meaning_ko,hint,hintAuto:!!hint,level,tags,rank:1000+rank,source:enUrl,curated:false,levelBasis:'공개사전 CEFR 추정 포함'});
  if(en.size>=20000) break;
}
for(const [i,[word,reading,meaning,hint,example,exampleKo]] of enCore.entries()) {
  const id=key('en',word);
  en.set(id,{id,lang:'en',word,reading,meaning,hint,level:'입문',tags:['essential','conversation','frequent'],rank:i+1,source:enUrl,example,exampleKo,curated:true,hintAuto:false,levelBasis:'기초 학습 추천'});
}

function edit(rows,lang,corrections) {
  return rows.map(row=>{
    const patch=corrections[row.word];
    const tags=row.tags.filter(t=>t!=='conversation');
    if(conversation[lang].has(row.word)) tags.push('conversation');
    return {...row,...patch,tags,...(patch?{meaningEdited:true}:{})};
  });
}
const jaRows=edit([...ja.values()].sort((a,b)=>a.rank-b.rank),'ja',jaCorrections).concat(characters);
const enRows=edit([...en.values()].sort((a,b)=>a.rank-b.rank),'en',enCorrections);
function summarize(rows) {
  return {total:rows.length,words:rows.filter(r=>!r.tags.includes('hiragana')&&!r.tags.includes('katakana')).length,curated:rows.filter(r=>r.curated&&!r.tags.includes('hiragana')&&!r.tags.includes('katakana')).length,withReading:rows.filter(r=>r.reading).length,withHint:rows.filter(r=>r.hint).length,withExample:rows.filter(r=>r.example).length,tags:Object.fromEntries(['essential','conversation','frequent','advanced','hiragana','katakana'].map(tag=>[tag,rows.filter(r=>r.tags.includes(tag)).length]))};
}
const stats={version:1,generatedAt:'2026-10-20',ja:summarize(jaRows),en:summarize(enRows),total:jaRows.length+enRows.length,note:'기초 추천 순서는 편집한 학습 순서이며 공식 빈도 순위가 아닙니다. 확장 어휘는 공개사전이며 전체 전문가 검수를 거치지 않았습니다. 한글 발음은 근사치입니다. 음성은 별도 브라우저 음성 합성입니다.'};
const out=path.join(root,'public/data'); await fs.mkdir(out,{recursive:true});
for(const [name,value] of Object.entries({ja:jaRows,en:enRows,stats})) await fs.writeFile(path.join(out,name+'.json'),JSON.stringify(value,null,name==='stats'?2:0)+'\n');
console.log(JSON.stringify(stats,null,2));
