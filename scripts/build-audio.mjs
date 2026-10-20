/** Build a small, licensed recording manifest. Node >= 20; no API key needed.
 * Source metadata is returned by Commons; media paths are never guessed.
 * Run: node scripts/build-audio.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/data/audio.json');
const headers = { 'User-Agent': 'MoruVocabulary/1.0 (open educational vocabulary project)' };
const cacheDir = path.join(tmpdir(), 'moru-audio-metadata-cache');
await fs.mkdir(cacheDir, { recursive: true });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const hira = [...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'];
const japanese = [...new Set([...hira, ...`こんにちは|ありがとう|ありがとうございます|すみません|はい|いいえ|お願い|お願いします|大丈夫|水|みず|食べる|たべる|行く|いく|おはよう|おはようございます|こんばんは|さようなら|ごめんなさい|いただきます|ごちそうさまでした|おやすみなさい|はじめまして|よろしくお願いします|お元気ですか|どういたしまして|わかりました|わかりません|もう一度|ゆっくり|いくら|いくらですか|どこ|どこですか|何|なに|誰|だれ|いつ|どうして|どう|これ|それ|あれ|ここ|そこ|あそこ|私|わたし|あなた|彼|彼女|友達|ともだち|人|ひと|名前|なまえ|日本|日本語|英語|学校|がっこう|先生|せんせい|学生|がくせい|勉強|仕事|しごと|会社|かいしゃ|今日|きょう|明日|あした|昨日|きのう|今|いま|時間|じかん|朝|あさ|昼|ひる|夜|よる|毎日|まいにち|一|二|三|四|五|六|七|八|九|十|いち|に|さん|よん|ご|ろく|なな|はち|きゅう|じゅう|お金|円|食べ物|飲み物|ご飯|ごはん|お茶|おちゃ|コーヒー|パン|肉|にく|魚|さかな|野菜|やさい|果物|くだもの|おいしい|美味しい|好き|すき|嫌い|きらい|大きい|おおきい|小さい|ちいさい|新しい|あたらしい|古い|ふるい|良い|いい|悪い|わるい|高い|たかい|安い|やすい|暑い|あつい|寒い|さむい|難しい|むずかしい|易しい|忙しい|いそがしい|楽しい|たのしい|嬉しい|うれしい|悲しい|かなしい|疲れた|痛い|いたい|買う|かう|飲む|のむ|見る|みる|聞く|きく|話す|はなす|読む|よむ|書く|かく|来る|くる|帰る|かえる|寝る|ねる|起きる|おきる|歩く|あるく|走る|はしる|待つ|まつ|会う|あう|知る|しる|思う|おもう|できる|する|ある|いる|家|いえ|部屋|へや|駅|えき|電車|でんしゃ|車|くるま|バス|タクシー|飛行機|ひこうき|空港|くうこう|ホテル|トイレ|病院|びょういん|店|みせ|コンビニ|スーパー|レストラン|公園|こうえん|本|ほん|電話|でんわ|携帯|けいたい|犬|いぬ|猫|ねこ|雨|あめ|雪|ゆき|天気|てんき|空|そら|山|やま|海|うみ|花|はな|母|はは|父|ちち|お母さん|お父さん|家族|かぞく|子供|こども|右|みぎ|左|ひだり|上|うえ|下|した|前|まえ|後ろ|うしろ|中|なか|外|そと|近い|ちかい|遠い|とおい|少し|すこし|たくさん|全部|ぜんぶ|一緒|いっしょ|また|もっと|とても|本当に|ほんとうに`.split('|')])];
const english = [...new Set(`hello|thank you|thanks|please|sorry|yes|no|help|water|good|want|need|I|you|we|they|he|she|it|this|that|here|there|what|who|when|where|why|how|be|have|do|go|come|get|make|know|think|see|look|take|give|find|tell|say|speak|talk|ask|answer|understand|learn|study|read|write|listen|hear|eat|drink|buy|pay|work|play|live|love|like|wait|meet|leave|call|use|try|feel|keep|let|put|open|close|start|stop|can|will|would|could|should|must|may|time|day|today|tomorrow|yesterday|now|morning|night|week|month|year|people|person|friend|family|name|home|house|room|school|student|teacher|book|phone|food|coffee|tea|bread|rice|money|price|shop|store|hotel|airport|station|train|bus|car|ticket|bathroom|hospital|doctor|problem|question|way|place|city|country|language|English|Japanese|happy|sad|tired|busy|ready|easy|difficult|important|different|new|old|big|small|long|short|hot|cold|right|wrong|bad|great|nice|fine|well|very|really|just|again|more|some|any|all|many|much|little|first|last|next|before|after|because|but|and|or|if|with|without|about|from|to|in|on|at|for|of|up|down|one|two|three|four|five|six|seven|eight|nine|ten|hundred|zero|excuse me|goodbye`.split('|'))];

async function json(url) {
  const key = createHash('sha256').update(String(url)).digest('hex');
  const cache = path.join(cacheDir, `${key}.json`);
  try { return JSON.parse(await fs.readFile(cache, 'utf8')); } catch {}
  for (let attempt = 0; attempt < 4; attempt++) {
    await delay(attempt ? 15000 * attempt : 1200);
    const r = await fetch(url, { headers, signal: AbortSignal.timeout(20000) });
    if ((r.status === 429 || r.status >= 500) && attempt < 3) continue;
    if (!r.ok) throw new Error(`HTTP ${r.status} from ${new URL(url).host}`);
    const d = await r.json();
    if (d.error) throw new Error(d.error.info || d.error.code);
    await fs.writeFile(cache, JSON.stringify(d));
    return d;
  }
}
async function commons(params) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  u.search = new URLSearchParams({ action: 'query', format: 'json', ...params });
  return json(u);
}
function text(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}
function entry(page, audioUrl) {
  const i = page?.imageinfo?.[0];
  const m = i?.extmetadata;
  if (!i || !m) return null;
  const license = text(m.LicenseShortName?.value);
  const licenseUrl = m.LicenseUrl?.value;
  const author = text(m.Artist?.value || m.Attribution?.value);
  if (!author || !license || !licenseUrl || !/creativecommons\.org\//.test(licenseUrl)) return null;
  const url = new URL(audioUrl || i.url);
  url.search = '';
  return {
    url: url.href, source: i.descriptionurl, author, license, licenseUrl,
    title: page.title.replace(/^File:/, ''),
    description: text(m.ImageDescription?.value),
  };
}
async function metadata(ids, parameter = 'pageids') {
  const pages = {};
  for (let start = 0; start < ids.length; start += 50) {
    const d = await commons({ prop: 'imageinfo', [parameter]: ids.slice(start, start + 50).join('|'), iiprop: 'url|extmetadata', iiextmetadatafilter: 'Artist|Attribution|LicenseShortName|LicenseUrl|ImageDescription' });
    Object.assign(pages, d.query.pages);
  }
  return pages;
}
async function main() {
  const result = { ja: {}, en: {} };
  let category = [], cont = {};
  do {
    const d = await commons({ list: 'categorymembers', cmtitle: 'Category:Lingua Libre pronunciation-jpn', cmlimit: '500', cmtype: 'file', ...cont });
    category.push(...d.query.categorymembers);
    cont = d.continue;
  } while (cont);
  const picked = [];
  for (const word of japanese) {
    // Exact word suffix, Japanese language category. Prefer one contributor for consistency.
    const choices = category.filter(p => p.title.endsWith(`-${word}.wav`));
    choices.sort((a, b) => Number(b.title.includes('Fukujinzuke')) - Number(a.title.includes('Fukujinzuke')) || a.pageid - b.pageid);
    if (choices[0]) picked.push({ word, pageid: choices[0].pageid });
  }
  const jaMeta = await metadata([...new Set(picked.map(p => p.pageid))]);
  for (const { word, pageid } of picked) {
    const e = entry(jaMeta[pageid]);
    if (e) result.ja[word] = e;
  }
  console.log(`Japanese recordings with complete license metadata: ${Object.keys(result.ja).length}`);
  // Batch Wiktionary file references; fewer requests than querying a dictionary per word.
  const enPages = {};
  for (let start = 0; start < english.length; start += 50) {
    let continuation = {};
    do {
      const u = new URL('https://en.wiktionary.org/w/api.php');
      u.search = new URLSearchParams({ action: 'query', format: 'json', prop: 'images', titles: english.slice(start, start + 50).join('|'), imlimit: '500', ...continuation });
      const d = await json(u);
      for (const p of Object.values(d.query.pages)) {
        enPages[p.title] ??= [];
        enPages[p.title].push(...(p.images || []));
      }
      continuation = d.continue;
    } while (continuation);
  }
  const candidates = [];
  for (const word of english) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exact = new RegExp(`^File:En-(?:us|uk|au|ca|nz)-${escaped}\\.(?:ogg|oga|wav)$`, 'i');
    const choices = (enPages[word] || []).filter(p => exact.test(p.title));
    const score = t => /en-us-/i.test(t) ? 2 : /en-uk-/i.test(t) ? 1 : 0;
    choices.sort((a, b) => score(b.title) - score(a.title));
    if (choices[0]) candidates.push({ word, title: choices[0].title, alternatives: choices.slice(1).map(p => p.title) });
  }
  const enMeta = Object.values(await metadata([...new Set(candidates.map(p => p.title))], 'titles'));
  for (const p of candidates) {
    const e = entry(enMeta.find(e => e.title.toLowerCase() === p.title.toLowerCase()));
    if (e) result.en[p.word] = e;
  }
  const missing = candidates.filter(p => !result.en[p.word] && p.alternatives.length);
  if (missing.length) {
    const alternatives = Object.values(await metadata([...new Set(missing.flatMap(p => p.alternatives))], 'titles'));
    for (const p of missing) {
      for (const title of p.alternatives) {
        const e = entry(alternatives.find(e => e.title.toLowerCase() === title.toLowerCase()));
        if (e) { result.en[p.word] = e; break; }
      }
    }
  }
  // Commons imageinfo verifies every media URL exists. A small live sample is optional;
  // do not HEAD hundreds of media files (the media host rate-limits automation).
  const unique = [...new Set(Object.values(result).flatMap(lang => Object.values(lang).map(e => e.url)))];
  // Hiragana/katakana represent the same basic syllable. These are script aliases, not new recordings.
  for (const k of hira) {
    if (result.ja[k]) result.ja[String.fromCodePoint(k.codePointAt(0) + 0x60)] = { ...result.ja[k], aliasOf: k };
  }
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ jaKeys: Object.keys(result.ja).length, enKeys: Object.keys(result.en).length, uniqueRecordings: unique.length }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });

