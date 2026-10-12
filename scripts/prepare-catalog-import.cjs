const fs = require('fs');
const sourcePath = process.argv[2];
const snapshot = JSON.parse(fs.readFileSync('.next-area-verify/catalog-before.json', 'utf8').replace(/^\uFEFF/, '')).rows[0].catalog;
const lines = fs.readFileSync(sourcePath, 'utf8').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
const source = []; let brand = '', series = '';
for (let i = 0; i < lines.length; i++) {
  if (/^\d+\.\s/.test(lines[i])) { brand = lines[i].replace(/^\d+\.\s*/, ''); continue; }
  if (lines[i + 1]?.startsWith('Specific model')) { series = lines[i]; continue; }
  const match = lines[i].match(/^(.+?)\t+(20\d{2})(-era)?$/);
  if (match) source.push({ brand, series, model: match[1], year: +match[2], approximateYear: Boolean(match[3]), announced: /\(announced\)/i.test(match[1]) });
}
const slug = value => value.toLowerCase().replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const norm = value => value.toLowerCase().replace(/\+/g, 'plus').replace(/^(dell|hp|lenovo|apple|acer|asus|msi|lg|microsoft|samsung)\s+/, '').replace(/\s+series$/, '').replace(/\b(inch|original model|new model|announced|refresh)\b/g, '').replace(/[^a-z0-9]/g, '');
const modelCore = value => norm(value.replace(/\b20\d{2}\b/g, '').replace(/\([^)]*\)/g, '').replace(/\s+-\s+.*$/, ''));
const yearOf = value => +(value.match(/\b20\d{2}\b/)?.[0] || 0);
const laptop = snapshot.categories.find(c => c.slug === 'laptop');
const brands = snapshot.brands.filter(b => b.category_id === laptop.id);
const existingModels = snapshot.models.map(m => ({ ...m, brand: snapshot.brands.find(b => b.id === snapshot.series.find(s => s.id === m.series_id).brand_id) }));
const seriesAliases = { 'XPS Series':'XPS','Inspiron Series':'Inspiron','Dell G Series Gaming':'G Series','Spectre Series':'Spectre','MacBook Air':'MacBook Air','MacBook Pro':'MacBook Pro','Aspire Series':'Aspire','Swift Series':'Swift','Nitro Gaming Series':'Nitro','Predator Gaming Series':'Predator','VivoBook Series':'VivoBook','ZenBook Series':'ZenBook','TUF Gaming Series':'TUF Gaming','ROG Gaming Series':'ROG','Prestige Series':'Prestige','Gram Series':'Gram','Galaxy Book Series':'Galaxy Book','Samsung Notebook Series':'Notebook' };
const decisions = source.map(row => {
  const b = brands.find(b => norm(b.name) === norm(row.brand));
  if (!b) throw Error('Missing brand '+row.brand);
  const requestedSeries = row.brand === 'HP' && row.series === 'Gaming Series' ? (/^OMEN/i.test(row.model) ? 'Omen' : 'Victus') : (seriesAliases[row.series] || row.series);
  const se = snapshot.series.find(s => s.brand_id === b.id && norm(s.name) === norm(requestedSeries));
  const base = modelCore(row.model);
  const candidates = existingModels.filter(m => m.brand.id === b.id && modelCore(m.name) === base && !/\s+-\s+/.test(m.name));
  const exact = candidates.filter(m => !yearOf(m.name) || yearOf(m.name) === row.year);
  // Year distinguishes hardware generations; ambiguous matches require review.
  if (exact.length > 1) return { ...row, action: 'review', candidates: exact.map(m => ({id:m.id,name:m.name})) };
  const found = exact[0] || (candidates.length === 1 && !yearOf(row.model) && !/\((original model|new model)\)/.test(row.model) ? candidates[0] : undefined);
  return { ...row, brandId: b.id, seriesName: requestedSeries, seriesId: se?.id ?? null, existingId: found?.id ?? null, existingName: found?.name ?? null, action: found ? 'reuse' : 'insert', slug: slug(row.model.replace(/\s*\((original model|new model|announced)\)/g, '') + (yearOf(row.model) === row.year ? '' : ` ${row.year}`)), yearConflict: found && yearOf(found.name) && yearOf(found.name) !== row.year ? { existingName: found.name, sourceYear: row.year } : undefined };
});
const duplicateGroups = new Map();
for (const model of existingModels) {const key = model.brand.id + '|' + norm(model.name);const list=duplicateGroups.get(key)||[];list.push(model);duplicateGroups.set(key,list);}
const duplicates = [...duplicateGroups.values()].filter(group=>group.length>1).map(group=>group.map(m=>({id:m.id,name:m.name,series_id:m.series_id})));
fs.mkdirSync('docs/catalog', { recursive: true });
fs.writeFileSync('docs/catalog/source-2026-10-12.json', JSON.stringify(source,null,2)+'\n');
fs.writeFileSync('docs/catalog/import-plan-2026-10-12.json', JSON.stringify({ sourceRows:source.length, decisions, existingExactDuplicates:duplicates },null,2)+'\n');
console.log(JSON.stringify({sourceRows:source.length, brands:new Set(source.map(r=>r.brand)).size, sourceSeries:new Set(source.map(r=>r.brand+'|'+r.series)).size, actions:decisions.reduce((a,r)=>(a[r.action]=(a[r.action]||0)+1,a),{}), yearConflicts:decisions.filter(r=>r.yearConflict).map(r=>r.yearConflict), existingExactDuplicates:duplicates },null,2));
