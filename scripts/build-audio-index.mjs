import fs from 'node:fs/promises';
const root=new URL('../public/data/',import.meta.url);
const source=JSON.parse(await fs.readFile(new URL('synthetic-audio.json',root),'utf8'));
for(const lang of ['ja','en']) {
  const index={ja:{},en:{}};
  for(const [id,entry] of Object.entries(source[lang])) if(entry.localPath)index[lang][id]={localPath:entry.localPath,revision:entry.sha256.slice(0,12)};
  await fs.writeFile(new URL(`audio-files-${lang}.json`,root),JSON.stringify(index)+'\n');
  console.log(`${lang}: ${Object.keys(index[lang]).length} playback paths`);
}
await fs.mkdir(new URL('../licenses/',root),{recursive:true});
for(const name of ['AUDIO-NOTES.md','SYNTHETIC-AUDIO-NOTES.md']) {
  await fs.copyFile(new URL(`../${name}`,import.meta.url),new URL(`../licenses/${name}`,root));
}
