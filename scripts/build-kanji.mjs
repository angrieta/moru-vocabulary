// KanjiVG paths © Ulrich Apel, CC BY-SA 3.0. Converted to a compact JSON subset.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const revision = '70a0b7ae0c18ceb5cb358274b029cce0234a43bc';
const basic = `一|하나 二|둘 三|셋 四|넷 五|다섯 六|여섯 七|일곱 八|여덟 九|아홉 十|열
百|백 千|천 万|만 円|엔 日|날·해 月|달 火|불 水|물 木|나무 金|금·돈 土|흙 年|해·년 時|때·시간 分|분·나누다
今|지금 先|앞서다 生|살다·태어나다 学|배우다 校|학교 人|사람 男|남자 女|여자 子|아이 母|어머니 父|아버지 友|친구
何|무엇 名|이름 本|책·근본 語|말 私|나 大|크다 小|작다 中|가운데 上|위 下|아래 左|왼쪽 右|오른쪽 前|앞 後|뒤
東|동쪽 西|서쪽 南|남쪽 北|북쪽 山|산 川|강 田|논 天|하늘 気|기운 雨|비 空|하늘·비다 花|꽃 林|수풀 森|숲
犬|개 猫|고양이 魚|물고기 鳥|새 口|입 目|눈 耳|귀 手|손 足|발 力|힘 入|들어가다 出|나가다 立|서다 休|쉬다
見|보다 聞|듣다 言|말하다 話|이야기 読|읽다 書|쓰다 食|먹다 飲|마시다 買|사다 行|가다 来|오다 帰|돌아오다
電|전기 車|차 駅|역 会|만나다 社|회사 店|가게 国|나라 白|희다 黒|검다 赤|붉다 青|푸르다 高|높다 安|싸다·편안하다
新|새롭다 古|오래되다 多|많다 少|적다 長|길다 毎|매번 朝|아침 昼|낮 夜|밤 外|밖 内|안 道|길 海|바다 好|좋아하다`;
const labels = Object.fromEntries(basic.trim().split(/\s+/).map(item => item.split('|')));
const words = JSON.parse(await fs.readFile(path.join(root, 'public/data/ja.json'), 'utf8'));
const essential = new Set(words.filter(w => w.tags.includes('essential')).flatMap(w => [...w.word].filter(c => /\p{Script=Han}/u.test(c))));
const chars = [...new Set([...Object.keys(labels), ...essential])];
const entries = new Array(chars.length);
const queue = chars.map((char, index) => ({char, index}));
const base = `https://raw.githubusercontent.com/KanjiVG/kanjivg/${revision}`;
await Promise.all(Array.from({length: 6}, async () => {
  while (queue.length) {
    const {char, index} = queue.shift();
    const code = char.codePointAt(0).toString(16).padStart(5, '0');
    const response = await fetch(`${base}/kanji/${code}.svg`);
    if (!response.ok) throw new Error(`${char}: HTTP ${response.status}`);
    const svg = await response.text();
    const strokes = [...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(m => m[1]);
    const numbers = [...svg.matchAll(/<text transform="matrix\(1 0 0 1 ([\d.-]+) ([\d.-]+)\)">(\d+)<\/text>/g)].map(m => [Number(m[1]), Number(m[2]), Number(m[3])]);
    if (!strokes.length || numbers.length !== strokes.length) throw new Error(`Invalid stroke data: ${char}`);
    const matches = words.filter(w => w.word.includes(char) && w.reading && w.meaning)
      .sort((a,b) => Number(!!b.curated) - Number(!!a.curated) || a.rank - b.rank);
    entries[index] = {char, label: labels[char] || '', basic: !!labels[char], essential: essential.has(char), strokes, numbers, wordIds: matches.slice(0, 3).map(w => w.id)};
  }
}));
const data = {
  source: 'https://kanjivg.tagaini.net/', revision, copyright: 'Ulrich Apel',
  license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  modifications: 'Selected characters; extracted stroke paths and number positions into JSON. Stroke shapes and order unchanged.',
  entries
};
await fs.writeFile(path.join(root, 'public/data/kanji.json'), JSON.stringify(data));
const license = await fetch(`${base}/COPYING`);
if (!license.ok) throw new Error('License unavailable');
await fs.writeFile(path.join(root, 'public/licenses/KANJIVG-COPYING.txt'), await license.text());
console.log(JSON.stringify({characters:entries.length,basic:entries.filter(e=>e.basic).length,essential:essential.size,revision}));
