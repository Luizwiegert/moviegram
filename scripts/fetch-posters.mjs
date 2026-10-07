// Busca os cartazes oficiais no TMDB e grava em src/posters.json
// (e as imagens de fundo, usadas na abertura, em src/backdrops.json).
// Rode uma vez (e de novo quando quiser atualizar): npm run posters
// Precisa da chave do TMDB no arquivo .env.local:
//   TMDB_TOKEN=...   (o "Token de leitura da API", recomendado)
//   ou TMDB_API_KEY=... (a "Chave da API")
// A chave só é usada aqui no seu computador; ela não vai pro site.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const TOKEN = process.env.TMDB_TOKEN;
const KEY = process.env.TMDB_API_KEY;
if (!TOKEN && !KEY) {
  console.error('Falta a chave do TMDB. Coloque TMDB_TOKEN=... no arquivo .env.local e rode de novo.');
  process.exit(1);
}

// id no app -> [tipo, título em inglês, ano, temporada]
const Q = {
  'olhos-wakanda': ['tv', 'Eyes of Wakanda', 2025],
  cap1: ['movie', 'Captain America: The First Avenger', 2011],
  'agent-carter': ['tv', "Marvel's Agent Carter", 2015],
  capita: ['movie', 'Captain Marvel', 2019],
  hdf1: ['movie', 'Iron Man', 2008],
  hdf2: ['movie', 'Iron Man 2', 2010],
  hulk: ['movie', 'The Incredible Hulk', 2008],
  thor1: ['movie', 'Thor', 2011],
  vingadores: ['movie', 'The Avengers', 2012],
  hdf3: ['movie', 'Iron Man 3', 2013],
  thor2: ['movie', 'Thor: The Dark World', 2013],
  shield1: ['tv', "Marvel's Agents of S.H.I.E.L.D.", 2013, 1],
  cap2: ['movie', 'Captain America: The Winter Soldier', 2014],
  gotg1: ['movie', 'Guardians of the Galaxy', 2014],
  groot: ['tv', 'I Am Groot', 2022],
  gotg2: ['movie', 'Guardians of the Galaxy Vol. 2', 2017],
  shield2: ['tv', "Marvel's Agents of S.H.I.E.L.D.", 2013, 2],
  dd1: ['tv', "Marvel's Daredevil", 2015, 1],
  jj: ['tv', "Marvel's Jessica Jones", 2015, 1],
  ultron: ['movie', 'Avengers: Age of Ultron', 2015],
  formiga1: ['movie', 'Ant-Man', 2015],
  dd2: ['tv', "Marvel's Daredevil", 2015, 2],
  lc1: ['tv', "Marvel's Luke Cage", 2016, 1],
  if1: ['tv', "Marvel's Iron Fist", 2017, 1],
  defensores: ['tv', "Marvel's The Defenders", 2017],
  pun1: ['tv', "Marvel's The Punisher", 2017, 1],
  jj2: ['tv', "Marvel's Jessica Jones", 2015, 2],
  lc2: ['tv', "Marvel's Luke Cage", 2016, 2],
  if2: ['tv', "Marvel's Iron Fist", 2017, 2],
  dd3: ['tv', "Marvel's Daredevil", 2015, 3],
  pun2: ['tv', "Marvel's The Punisher", 2017, 2],
  jj3: ['tv', "Marvel's Jessica Jones", 2015, 3],
  shield35: ['tv', "Marvel's Agents of S.H.I.E.L.D.", 2013, 3],
  guerracivil: ['movie', 'Captain America: Civil War', 2016],
  viuva: ['movie', 'Black Widow', 2021],
  pantera1: ['movie', 'Black Panther', 2018],
  aranha1: ['movie', 'Spider-Man: Homecoming', 2017],
  estranho1: ['movie', 'Doctor Strange', 2016],
  ragnarok: ['movie', 'Thor: Ragnarok', 2017],
  formiga2: ['movie', 'Ant-Man and the Wasp', 2018],
  guerrainf: ['movie', 'Avengers: Infinity War', 2018],
  ultimato: ['movie', 'Avengers: Endgame', 2019],
  loki1: ['tv', 'Loki', 2021, 1],
  whatif1: ['tv', 'What If...?', 2021, 1],
  wandavision: ['tv', 'WandaVision', 2021],
  falcao: ['tv', 'The Falcon and the Winter Soldier', 2021],
  shangchi: ['movie', 'Shang-Chi and the Legend of the Ten Rings', 2021],
  eternos: ['movie', 'Eternals', 2021],
  aranha2: ['movie', 'Spider-Man: Far From Home', 2019],
  aranha3: ['movie', 'Spider-Man: No Way Home', 2021],
  gaviao: ['tv', 'Hawkeye', 2021],
  eco: ['tv', 'Echo', 2024],
  estranho2: ['movie', 'Doctor Strange in the Multiverse of Madness', 2022],
  cavaleiro: ['tv', 'Moon Knight', 2022],
  msmarvel: ['tv', 'Ms. Marvel', 2022],
  thor4: ['movie', 'Thor: Love and Thunder', 2022],
  lobisomem: ['movie', 'Werewolf by Night', 2022],
  mulherhulk: ['tv', 'She-Hulk: Attorney at Law', 2022],
  wakanda: ['movie', 'Black Panther: Wakanda Forever', 2022],
  invasao: ['tv', 'Secret Invasion', 2023],
  festas: ['movie', 'The Guardians of the Galaxy Holiday Special', 2022],
  quantumania: ['movie', 'Ant-Man and the Wasp: Quantumania', 2023],
  gotg3: ['movie', 'Guardians of the Galaxy Vol. 3', 2023],
  marvels: ['movie', 'The Marvels', 2023],
  loki2: ['tv', 'Loki', 2021, 2],
  whatif23: ['tv', 'What If...?', 2021, 2],
  zombies: ['tv', 'Marvel Zombies', 2025],
  agatha: ['tv', 'Agatha All Along', 2024],
  ironheart: ['tv', 'Ironheart', 2025],
  deadpool3: ['movie', 'Deadpool & Wolverine', 2024],
  ddr1: ['tv', 'Daredevil: Born Again', 2025, 1],
  cap4: ['movie', 'Captain America: Brave New World', 2025],
  thunderbolts: ['movie', 'Thunderbolts*', 2025],
  ddr2: ['tv', 'Daredevil: Born Again', 2025, 2],
  'justiceiro-especial': ['movie', 'The Punisher: One Last Kill', 2026],
  wonderman: ['tv', 'Wonder Man', 2026],
  quarteto: ['movie', 'The Fantastic Four: First Steps', 2025],
  aranha4: ['movie', 'Spider-Man: Brand New Day', 2026],
  doomsday: ['movie', 'Avengers: Doomsday', 2026],
  x1: ['movie', 'X-Men', 2000],
  x2: ['movie', 'X2', 2003],
  x3: ['movie', 'X-Men: The Last Stand', 2006],
  xo: ['movie', 'X-Men Origins: Wolverine', 2009],
  xfc: ['movie', 'X-Men: First Class', 2011],
  wolv2: ['movie', 'The Wolverine', 2013],
  xdofp: ['movie', 'X-Men: Days of Future Past', 2014],
  dp1: ['movie', 'Deadpool', 2016],
  xapoc: ['movie', 'X-Men: Apocalypse', 2016],
  logan: ['movie', 'Logan', 2017],
  dp2: ['movie', 'Deadpool 2', 2018],
  xdp: ['movie', 'Dark Phoenix', 2019],
  novos: ['movie', 'The New Mutants', 2020],
  sm1: ['movie', 'Spider-Man', 2002],
  sm2: ['movie', 'Spider-Man 2', 2004],
  sm3: ['movie', 'Spider-Man 3', 2007],
  asm1: ['movie', 'The Amazing Spider-Man', 2012],
  asm2: ['movie', 'The Amazing Spider-Man 2', 2014],
  blade1: ['movie', 'Blade', 1998],
  blade2: ['movie', 'Blade II', 2002],
  blade3: ['movie', 'Blade: Trinity', 2004],
  elektra: ['movie', 'Elektra', 2005],
  ff05: ['movie', 'Fantastic Four', 2005],
  ff07: ['movie', 'Fantastic Four: Rise of the Silver Surfer', 2007],
  ff15: ['movie', 'Fantastic Four', 2015],
};

async function tmdb(path, params = {}) {
  const url = new URL('https://api.themoviedb.org/3' + path);
  for (const [k, v] of Object.entries({ language: 'pt-BR', ...params })) if (v !== undefined) url.searchParams.set(k, String(v));
  if (!TOKEN) url.searchParams.set('api_key', KEY);
  const res = await fetch(url, { headers: TOKEN ? { Authorization: `Bearer ${TOKEN}`, accept: 'application/json' } : { accept: 'application/json' } });
  if (res.status === 401) throw new Error('A chave do TMDB foi recusada. Confira o valor no .env.local.');
  if (!res.ok) throw new Error(`TMDB respondeu ${res.status} em ${path}`);
  return res.json();
}

const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');

async function find(type, title, year) {
  const yearKey = type === 'movie' ? 'year' : 'first_air_date_year';
  let { results } = await tmdb(`/search/${type}`, { query: title, [yearKey]: year });
  if (!results?.length) ({ results } = await tmdb(`/search/${type}`, { query: title }));
  if (!results?.length) return null;
  const exact = results.find(r => norm(r.original_title || r.original_name || '') === norm(title));
  return exact || results[0];
}

// Próximo grande filme depois de Doomsday (a contagem troca pra ele na estreia).
Q.secretwars = ['movie', 'Avengers: Secret Wars', 2027];

// Temporadas de cada série, pra marcar episódio por episódio.
// Número = temporada da própria série; [título, ano, temporada, rótulo] = temporada de outra série (pacotes).
const SEASONS = {
  'olhos-wakanda': [1], 'agent-carter': [1, 2], shield1: [1], groot: [1, 2], shield2: [2], dd1: [1], jj: [1],
  dd2: [2], shield35: [3, 4, 5], loki1: [1], whatif1: [1], wandavision: [1], falcao: [1], gaviao: [1], eco: [1],
  cavaleiro: [1], msmarvel: [1], mulherhulk: [1], invasao: [1], loki2: [2], whatif23: [2, 3], zombies: [1],
  agatha: [1], ironheart: [1], ddr1: [1], ddr2: [2], wonderman: [1],
  lc1: [1], if1: [1], defensores: [1], pun1: [1], jj2: [2], lc2: [2], if2: [2], dd3: [3], pun2: [2], jj3: [3],
};

/** Onde assistir no Brasil: assinatura, grátis, aluguel e compra (dados da JustWatch via TMDB). */
async function providers(type, id) {
  const r = await tmdb(`/${type}/${id}/watch/providers`, { language: undefined }).catch(() => null);
  const br = r?.results?.BR;
  if (!br) return null;
  const pick = list => (list || []).sort((a, b) => a.display_priority - b.display_priority).map(p => [p.provider_name, p.logo_path]);
  const out = { link: br.link };
  const s = [...pick(br.flatrate), ...pick(br.free), ...pick(br.ads)];
  if (s.length) out.s = s.filter((p, i) => s.findIndex(q => q[0] === p[0]) === i);
  if (br.rent?.length) out.r = pick(br.rent);
  if (br.buy?.length) out.b = pick(br.buy);
  return out.s || out.r || out.b ? out : null;
}

async function episodes(showId, season) {
  const s = await tmdb(`/tv/${showId}/season/${season}`).catch(() => null);
  return (s?.episodes || []).map(e => [e.name || `Episódio ${e.episode_number}`, e.runtime || null]);
}

const out = {};
const backs = {};
const details = {};
const missing = [];
for (const [id, [type, title, year, season]] of Object.entries(Q)) {
  try {
    const hit = await find(type, title, year);
    if (!hit) { missing.push(`${id} (${title}): não encontrado`); continue; }
    let path = hit.poster_path;
    let overview = '';
    if (season) {
      const s = await tmdb(`/tv/${hit.id}/season/${season}`).catch(() => null);
      if (s?.poster_path) path = s.poster_path;
      overview = s?.overview || '';
    }
    if (path) out[id] = path; else missing.push(`${id} (${title}): sem cartaz ainda`);
    if (hit.backdrop_path) backs[id] = hit.backdrop_path;

    // Sinopse em português; sem ela, em inglês.
    overview ||= hit.overview || '';
    if (!overview) overview = (await tmdb(`/${type}/${hit.id}`, { language: 'en-US' }).catch(() => null))?.overview || '';
    const d = { ov: overview };
    const prov = await providers(type, hit.id);
    if (prov) d.prov = prov;

    if (SEASONS[id]) {
      d.seasons = [];
      for (const sn of SEASONS[id]) {
        if (typeof sn === 'number') d.seasons.push({ label: `Temporada ${sn}`, eps: await episodes(hit.id, sn) });
        else {
          const other = await find('tv', sn[0], sn[1]);
          if (other) d.seasons.push({ label: sn[3], eps: await episodes(other.id, sn[2]) });
        }
      }
    }
    details[id] = d;
    const eps = d.seasons ? ` · ${d.seasons.reduce((a, s) => a + s.eps.length, 0)} episódios` : '';
    console.log(`${path ? 'ok  ' : 'sem '} ${id.padEnd(14)} ${hit.title || hit.name}${d.prov?.s ? ' · ' + d.prov.s.map(p => p[0]).join(', ') : ''}${eps}`);
  } catch (e) {
    console.error(e.message);
    if (/recusada/.test(e.message)) process.exit(1);
    missing.push(`${id} (${title}): erro`);
  }
}

writeFileSync('src/posters.json', JSON.stringify(out, null, 2) + '\n');
writeFileSync('src/backdrops.json', JSON.stringify(backs, null, 2) + '\n');
writeFileSync('src/details.json', JSON.stringify(details) + '\n');
console.log(`\n${Object.keys(out).length} cartazes salvos em src/posters.json, sinopses e onde assistir em src/details.json.`);
if (missing.length) console.log('Ficam com a ilustração gerada:\n  ' + missing.join('\n  '));
