import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { playWord,stopAudio,hasAudioFile,audioLabel } from '../src/audio.js';

const word={id:'en-hello',lang:'en',word:'hello'};
let instances=[];
const fakeWindow=()=>{
  instances=[];
  globalThis.window={};
  globalThis.Audio=class {
    constructor(url){this.src=url;instances.push(this);}
    play(){return Promise.resolve();}
    pause(){this.paused=true;}
    removeAttribute(){this.src='';}
    load(){}
  };
};
test.afterEach(()=>{stopAudio();delete globalThis.window;delete globalThis.Audio;});

test('bundled human recording works without speech synthesis and only unlocks on actual playback',async()=>{
  fakeWindow();const statuses=[];let done=false;
  const promise=playWord(word,{en:{hello:{localPath:'audio/human/test.ogg'}}},.75,s=>statuses.push(s),{filesOnly:true}).then(value=>{done=true;return value;});
  await Promise.resolve();assert.equal(done,false);assert.equal(instances[0].playbackRate,.75);
  assert.equal(instances[0].src,'./audio/human/test.ogg');
  instances[0].onplaying();assert.equal(await promise,true);assert.match(statuses.at(-1),/사람 녹음/);
});
test('listening eligibility requires bundled files, not a remote link or device TTS',async()=>{
  fakeWindow();const index={en:{hello:{url:'https://example.org/hello.ogg'}}};
  assert.equal(hasAudioFile(index,word),false);
  assert.equal(await playWord(word,index,1,()=>{},{filesOnly:true}),false);
  assert.equal(instances.length,0);
});
test('synthetic file provides a fallback if a human file fails to load',async()=>{
  fakeWindow();const statuses=[];
  const index={en:{hello:{localPath:'audio/human/broken.ogg'}},synthetic:{en:{'en-hello':{localPath:'audio/synthetic/hello.mp3',revision:'updated12345'}}}};
  const promise=playWord(word,index,1,s=>statuses.push(s),{filesOnly:true});
  const late=instances[0].onplaying;
  instances[0].onerror();await new Promise(setImmediate);
  late();assert.equal(statuses.some(s=>s.includes('사람 녹음 · 재생 중')),false);
  assert.equal(instances[0].paused,true);assert.equal(instances[1].src,'./audio/synthetic/hello.mp3?v=updated12345');
  instances[1].onplaying();assert.equal(await promise,true);assert.match(statuses.at(-1),/AI 합성 음성/);
});
test('browser playback rejection does not unlock a listening answer',async()=>{
  fakeWindow();globalThis.Audio.prototype.play=()=>Promise.reject(Object.assign(Error(),{name:'NotAllowedError'}));
  const statuses=[];
  assert.equal(await playWord(word,{synthetic:{en:{'en-hello':{localPath:'audio/test.mp3'}}}},1,s=>statuses.push(s),{filesOnly:true}),false);
  assert.match(statuses.at(-1),/다시 눌러/);
});
test('leaving a question settles pending audio and ignores late playback events',async()=>{
  fakeWindow();const statuses=[];
  const promise=playWord(word,{en:{hello:{localPath:'audio/test.ogg'}}},1,s=>statuses.push(s));
  const late=instances[0].onplaying;
  stopAudio();assert.equal(await promise,false);late();
  assert.equal(statuses.some(s=>s.includes('재생 중')),false);
});
test('a device speech error is not reported as successful playback',async()=>{
  fakeWindow();let utterance;
  window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
  window.speechSynthesis={cancel(){},getVoices:()=>[{lang:'en-US'}],speak(u){utterance=u;}};
  const promise=playWord(word,{},1,()=>{});
  await new Promise(setImmediate);
  utterance.onerror({error:'synthesis-failed'});
  assert.equal(await promise,false);
});
test('shipped local audio paths exist and their bytes match the manifest',()=>{
  fakeWindow();
  for(const manifest of ['audio','synthetic-audio']){
    const index=JSON.parse(fs.readFileSync(new URL(`../public/data/${manifest}.json`,import.meta.url)));
    const checked=new Set();
    for(const language of ['ja','en'])for(const entry of Object.values(index[language])){
      if(!entry.localPath||checked.has(entry.localPath))continue;
      checked.add(entry.localPath);
      assert.match(entry.localPath,/^audio\/[a-z0-9/_.-]+$/i);
      assert.ok(!entry.localPath.includes('..'));
      const bytes=fs.readFileSync(new URL(`../public/${entry.localPath}`,import.meta.url));
      assert.ok(bytes.length>100);
      assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256);
    }
    assert.ok(checked.size>0,`${manifest} must ship usable files`);
  }
});

test('every vocabulary card and prepared example has a bundled pronunciation file',()=>{
  fakeWindow();
  const read=name=>JSON.parse(fs.readFileSync(new URL(`../public/data/${name}.json`,import.meta.url)));
  const index={...read('audio'),synthetic:read('synthetic-audio')};
  for(const language of ['ja','en'])for(const word of read(language)){
    assert.ok(hasAudioFile(index,word),`Missing pronunciation: ${word.id}`);
    if(word.example)assert.ok(index.synthetic[language][`${word.id}-example`]?.localPath,`Missing example audio: ${word.id}`);
  }
});
