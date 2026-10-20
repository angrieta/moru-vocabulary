/** Download unchanged licensed human recordings for reliable same-origin playback.
 * Node >= 20. Serial requests, 450 ms spacing, bounded retries, Retry-After support.
 * Run: node scripts/bundle-audio.mjs --work-dir ../../work/human-audio-bundle
 * Re-running validates and reuses complete files; no external API keys are needed.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const workOption = args.indexOf('--work-dir');
if (workOption !== -1 && !args[workOption + 1]) throw new Error('--work-dir requires a path');
const failuresOption = args.indexOf('--max-failures');
const maxFailures = failuresOption === -1 ? 3 : Number(args[failuresOption + 1]);
if (!Number.isInteger(maxFailures) || maxFailures < 1) throw new Error('--max-failures requires a positive integer');
const workDir = path.resolve(root, workOption === -1 ? 'work/human-audio-bundle' : args[workOption + 1]);
const manifestPath = path.join(root, 'public/data/audio.json');
const destination = path.join(root, 'public/audio/human');
const statePath = path.join(workDir, 'state.json');
const reportPath = path.join(workDir, 'report.json');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const MAX_BYTES = 20 * 1024 * 1024;
const MAX_ATTEMPTS = 3;
const GAP_MS = 450;
let lastRequestAt = 0;
let rateLimitEvents = 0;
let stopping = false;
process.on('SIGINT', () => { stopping = true; });
process.on('SIGTERM', () => { stopping = true; });

await fs.mkdir(workDir, { recursive: true });
await fs.mkdir(destination, { recursive: true });
const initial = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const groups = new Map();
for (const language of ['ja', 'en']) {
  for (const [word, entry] of Object.entries(initial[language] || {})) {
    if (!entry.url || entry.kind === 'synthetic') continue;
    if (!entry.source || !entry.author || !entry.license || !entry.licenseUrl) throw new Error(`Missing attribution for ${language}:${word}`);
    const url = new URL(entry.url);
    if (url.protocol !== 'https:') throw new Error(`Expected HTTPS original for ${language}:${word}`);
    if (!groups.has(entry.url)) groups.set(entry.url, []);
    groups.get(entry.url).push({ language, word, entry });
  }
}
let state;
try { state = JSON.parse(await fs.readFile(statePath, 'utf8')); } catch { state = {}; }
const completed = new Map();
const failures = [];
let downloaded = 0;
let reused = 0;
let totalBytes = 0;

function format(bytes) {
  if (bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WAVE') return 'wav';
  if (bytes.subarray(0, 4).toString('ascii') === 'OggS') return 'ogg';
  if (bytes.subarray(0, 3).toString('ascii') === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)) return 'mp3';
  return null;
}

function existingPath(localPath) {
  if (!/^audio\/human\/[a-f0-9]{64}\.(wav|ogg|mp3)$/.test(localPath || '')) return null;
  const resolved = path.resolve(root, 'public', localPath);
  if (!resolved.startsWith(destination + path.sep)) return null;
  return resolved;
}

async function reuse(record) {
  const local = existingPath(record?.localPath);
  if (!local || !/^[a-f0-9]{64}$/.test(record.sha256 || '')) return null;
  try {
    const bytes = await fs.readFile(local);
    if (!format(bytes) || hash(bytes) !== record.sha256) return null;
    return { localPath: record.localPath, sha256: record.sha256, bytes: bytes.length, kind: 'human' };
  } catch { return null; }
}

async function checkpoint() {
  // Re-read to preserve unrelated current manifest metadata if another task adds it.
  const latest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  for (const language of ['ja', 'en']) {
    for (const entry of Object.values(latest[language] || {})) {
      const record = completed.get(entry.url);
      if (record) Object.assign(entry, { localPath: record.localPath, sha256: record.sha256, kind: 'human' });
    }
  }
  const nextManifest = path.join(workDir, 'audio.next.json');
  await fs.writeFile(nextManifest, JSON.stringify(latest, null, 2) + '\n');
  await fs.rename(nextManifest, manifestPath);
  await fs.writeFile(statePath, JSON.stringify(state, null, 2) + '\n');
  await fs.writeFile(reportPath, JSON.stringify({
    updatedAt: new Date().toISOString(), originals: groups.size, bundled: completed.size,
    downloaded, reused, totalBytes, rateLimitEvents, failures,
  }, null, 2) + '\n');
}

function retryAfterMs(value) {
  if (!value) return null;
  if (/^\d+(?:\.\d+)?$/.test(value.trim())) return Number(value) * 1000;
  const when = Date.parse(value);
  return Number.isFinite(when) ? Math.max(0, when - Date.now()) : null;
}

async function waitWithProgress(ms) {
  let remaining = ms;
  while (remaining > 0 && !stopping) {
    const part = Math.min(remaining, 30000);
    await delay(part);
    remaining -= part;
    if (remaining >= 30000) console.log(`Respecting server cooldown: ${Math.ceil(remaining / 1000)} seconds remaining.`);
  }
}

async function download(url) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (state.__notBefore > Date.now()) {
      const remaining = state.__notBefore - Date.now();
      if (remaining > 120000) {
        stopping = true;
        throw new Error(`Server cooldown remains active until ${new Date(state.__notBefore).toISOString()}; resume later`);
      }
      await waitWithProgress(remaining);
    }
    if (stopping) throw new Error('Stopped before next request');
    await delay(Math.max(0, GAP_MS - (Date.now() - lastRequestAt)));
    lastRequestAt = Date.now();
    let response;
    try {
      response = await fetch(url, {
        headers: { 'User-Agent': 'MoruVocabulary/1.0 (https://github.com/angrieta/moru-vocabulary; educational pronunciation assets)', Accept: 'audio/*,application/ogg' },
        signal: AbortSignal.timeout(45000),
      });
    } catch (error) {
      if (attempt === MAX_ATTEMPTS) throw error;
      await waitWithProgress(attempt * 4000);
      continue;
    }
    if (response.status === 429 || response.status >= 500) {
      await response.body?.cancel();
      if (response.status === 429) rateLimitEvents++;
      const requested = retryAfterMs(response.headers.get('retry-after'));
      // Be more conservative than very short Retry-After values on repeated throttles.
      const cooldown = Math.max(requested ?? 0, response.status === 429 ? attempt * 30000 : attempt * 5000);
      state.__notBefore = Date.now() + cooldown;
      console.log(`HTTP ${response.status}; waiting ${Math.ceil(cooldown / 1000)}s (attempt ${attempt}/${MAX_ATTEMPTS}).`);
      // Honor Retry-After before this host receives any subsequent request, even on the last retry.
      await checkpoint();
      if (cooldown > 120000) {
        stopping = true;
        throw new Error(`Server requested a long cooldown until ${new Date(state.__notBefore).toISOString()}; checkpoint saved, resume later`);
      }
      await waitWithProgress(cooldown);
      if (attempt === MAX_ATTEMPTS) throw new Error(`HTTP ${response.status} after ${attempt} attempts`);
      continue;
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(`HTTP ${response.status}`);
    }
    const type = response.headers.get('content-type') || '';
    if (!/^(audio\/|application\/ogg)/i.test(type)) {
      await response.body?.cancel();
      throw new Error(`Unexpected media type: ${type}`);
    }
    const declaredSize = Number(response.headers.get('content-length'));
    if (declaredSize > MAX_BYTES) {
      await response.body?.cancel();
      throw new Error('Media exceeds 20 MiB limit');
    }
    const chunks = [];
    let size = 0;
    for await (const chunk of response.body) {
      size += chunk.length;
      if (size > MAX_BYTES) throw new Error('Media exceeds 20 MiB limit');
      chunks.push(chunk);
    }
    if (declaredSize && !response.headers.get('content-encoding') && size !== declaredSize) throw new Error('Truncated response');
    const bytes = Buffer.concat(chunks);
    const extension = format(bytes);
    if (!extension || size < 64) throw new Error('Unrecognized or truncated audio signature');
    const sha256 = hash(bytes);
    const localPath = `audio/human/${sha256}.${extension}`;
    const local = existingPath(localPath);
    const partial = path.join(workDir, `${sha256}.partial`);
    await fs.writeFile(partial, bytes);
    if (hash(await fs.readFile(partial)) !== sha256) throw new Error('On-disk SHA-256 mismatch');
    let targetAlreadyValid = false;
    try { targetAlreadyValid = hash(await fs.readFile(local)) === sha256; } catch {}
    if (targetAlreadyValid) await fs.unlink(partial);
    else await fs.rename(partial, local);
    // Verify even a pre-existing content-addressed target before trusting it.
    if (hash(await fs.readFile(local)) !== sha256) throw new Error('Final asset SHA-256 mismatch');
    return { localPath, sha256, bytes: size, kind: 'human' };
  }
  throw new Error('Retry limit reached');
}

// Inventory all verified local files first, so a throttled early request does not
// make the coverage report omit later (already bundled) entries.
for (const [url, entries] of groups) {
  let record = await reuse(state[url]);
  if (!record) for (const item of entries) { record = await reuse(item.entry); if (record) break; }
  if (record) {
    reused++;
    completed.set(url, record);
    state[url] = record;
    totalBytes += record.bytes;
  }
}
await checkpoint();
console.log(`Bundling ${groups.size} unique human recordings, ${reused} verified local files reused, serial downloads with ${GAP_MS}ms minimum spacing.`);
let processed = 0;
const important = ['ja:こんにちは', 'en:hello', 'ja:ありがとう', 'en:thank you', 'ja:すみません', 'en:please', 'ja:はい', 'en:sorry', 'ja:いいえ', 'en:yes', 'ja:大丈夫', 'en:no', 'ja:水', 'en:help', 'ja:食べる', 'en:water', 'ja:行く', 'en:good', 'en:want'];
const priority = entries => Math.min(...entries.map(e => {
  const index = important.indexOf(`${e.language}:${e.word}`);
  return index < 0 ? 1000 : index;
}));
const orderedGroups = [...groups].sort((a, b) => priority(a[1]) - priority(b[1]));
for (const [url, entries] of orderedGroups) {
  if (stopping) break;
  if (completed.has(url)) { processed++; continue; }
  if (rateLimitEvents >= 12) {
    console.log('Stopped after repeated server rate limits; re-run later to resume verified files.');
    break;
  }
  try {
    const record = await download(url);
    downloaded++;
    state[url] = record;
    completed.set(url, record);
    totalBytes += record.bytes;
  } catch (error) {
    failures.push({ url, examples: entries.map(e => `${e.language}:${e.word}`), error: error.message });
    console.warn(`Unavailable: ${entries[0].language}:${entries[0].word}: ${error.message}`);
    if (failures.length >= maxFailures) stopping = true;
  }
  processed++;
  if (processed % 20 === 0 || failures.length && processed % 5 === 0) {
    await checkpoint();
    console.log(`Progress ${processed}/${groups.size}: ${completed.size} bundled, ${failures.length} failed, ${(totalBytes / 1048576).toFixed(2)} MiB.`);
  }
}
await checkpoint();
console.log(JSON.stringify({ originals: groups.size, bundled: completed.size, downloaded, reused, failures: failures.length, totalBytes, totalMiB: Number((totalBytes / 1048576).toFixed(2)), report: reportPath }));
if (completed.size !== groups.size) process.exitCode = 1;
