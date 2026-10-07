export type Kind = 'f' | 's' | 'e';

export interface Item {
  id: string;
  t: string;
  k: Kind;
  /** Lançamento, AAAA-MM */
  r: string;
  star: boolean;
  opt: boolean;
  n: string;
  /** Era cronológica (0–4 linha principal, 5 universos paralelos) */
  e: number;
  fr: string[];
  /** Duração em minutos (séries: total aproximado) */
  m: number | null;
  g?: string;
  i: number;
  /** Posição na ordem cronológica (só linha principal) */
  num?: number;
}

export const DOOMSDAY = { y: 2026, m: 12, d: 18 };
export const ENCORE = { y: 2026, m: 9, d: 25 };

/**
 * Grandes estreias em sequência: a contagem regressiva mira a próxima que ainda não aconteceu.
 * Depois de Doomsday, ela passa sozinha pra Guerras Secretas (com o cartaz dele).
 */
export const EVENTS = [
  { id: 'doomsday', t: 'Vingadores: Doomsday', date: DOOMSDAY, label: '18 de dezembro' },
  { id: 'secretwars', t: 'Vingadores: Guerras Secretas', date: { y: 2027, m: 12, d: 17 }, label: '17 de dezembro de 2027' },
];

export const ERAS = [
  { key: 'tempo', name: 'Passado', stone: 'Joia do Tempo' },
  { key: 'espaco', name: 'Formação dos Vingadores', stone: 'Joia do Espaço' },
  { key: 'poder', name: 'Guerra Civil até Ultimato', stone: 'Joia do Poder' },
  { key: 'realidade', name: 'Depois do Blip', stone: 'Joia da Realidade' },
  { key: 'mente', name: 'Fase 5 até Doomsday', stone: 'Joia da Mente' },
  { key: 'alma', name: 'Universos paralelos', stone: 'Joia da Alma' },
];

export const BUCKETS = [
  { name: '2008 – 2012', to: '2012-12' },
  { name: '2013 – 2015', to: '2015-12' },
  { name: '2016 – 2019', to: '2019-12' },
  { name: '2020 – 2022', to: '2022-12' },
  { name: '2023 – 2026', to: '2026-12' },
];

export const GROUPS = [
  { key: 'xmen', name: 'X-Men da Fox', hint: 'Encaixe antes de Deadpool & Wolverine' },
  { key: 'sony', name: 'Homem-Aranha da Sony', hint: 'Encaixe antes de Sem Volta para Casa' },
  { key: 'outros', name: 'Quarteto antigo, Blade e Elektra', trail: 'Quarteto Fantástico antigo', hint: 'Opcionais: aparecem em Deadpool & Wolverine' },
];

export const KIND: Record<Kind, string> = { f: 'Filme', s: 'Série', e: 'Especial' };


// I(id, título, tipo, lançamento, flags [* essencial, o opcional], nota, era, personagens/franquias, minutos, grupo extra)
const I = (id: string, t: string, k: Kind, r: string, fl: string, n: string, e: number, fr: string, m: number | null, g?: string): Item =>
  ({ id, t, k, r, star: fl.includes('*'), opt: fl.includes('o'), n, e, fr: fr.split(' '), m, g, i: 0 });

export const ITEMS: Item[] = [
  I('olhos-wakanda', 'Olhos de Wakanda', 's', '2025-08', 'o', 'Histórias de Wakanda ao longo dos séculos', 0, 'pantera', 120),
  I('cap1', 'Capitão América: O Primeiro Vingador', 'f', '2011-07', '*', 'Se passa em 1943–45', 0, 'cap', 124),
  I('agent-carter', 'Agent Carter (T1 e T2)', 's', '2015-01', 'o', 'Se passa em 1946–47', 0, 'cap shield', 756),
  I('capita', 'Capitã Marvel', 'f', '2019-03', '', 'Se passa em 1995', 0, 'capita', 123),

  I('hdf1', 'Homem de Ferro', 'f', '2008-05', '*', '', 1, 'ferro', 126),
  I('hdf2', 'Homem de Ferro 2', 'f', '2010-05', '', '', 1, 'ferro viuva', 124),
  I('hulk', 'O Incrível Hulk', 'f', '2008-06', '', '', 1, 'hulk', 112),
  I('thor1', 'Thor', 'f', '2011-05', '', '', 1, 'thor', 115),
  I('vingadores', 'Os Vingadores', 'f', '2012-05', '*', '', 1, 'vingadores ferro cap thor hulk viuva loki', 143),
  I('hdf3', 'Homem de Ferro 3', 'f', '2013-05', '', '', 1, 'ferro', 130),
  I('thor2', 'Thor: O Mundo Sombrio', 'f', '2013-11', '', '', 1, 'thor loki', 112),
  I('shield1', 'Agents of S.H.I.E.L.D. (T1)', 's', '2013-09', 'o', '', 1, 'shield', 946),
  I('cap2', 'Capitão América: O Soldado Invernal', 'f', '2014-04', '*', '', 1, 'cap viuva', 136),
  I('gotg1', 'Guardiões da Galáxia', 'f', '2014-08', '', '', 1, 'gotg', 121),
  I('groot', 'Eu Sou Groot', 's', '2022-08', 'o', 'Curtas', 1, 'gotg', 40),
  I('gotg2', 'Guardiões da Galáxia Vol. 2', 'f', '2017-05', '', '', 1, 'gotg', 136),
  I('shield2', 'Agents of S.H.I.E.L.D. (T2)', 's', '2014-09', 'o', '', 1, 'shield', 946),
  I('dd1', 'Demolidor (T1)', 's', '2015-04', 'o', 'Netflix', 1, 'netflix', 689),
  I('jj', 'Jessica Jones (T1)', 's', '2015-11', 'o', 'Netflix', 1, 'netflix', 689),
  I('ultron', 'Vingadores: Era de Ultron', 'f', '2015-05', '*', '', 1, 'vingadores ferro cap thor hulk viuva wanda', 141),
  I('formiga1', 'Homem-Formiga', 'f', '2015-07', '', '', 1, 'formiga', 117),

  I('dd2', 'Demolidor (T2)', 's', '2016-03', 'o', 'Netflix', 2, 'netflix', 689),
  I('lc1', 'Luke Cage (T1)', 's', '2016-09', 'o', 'Netflix', 2, 'netflix', 689),
  I('if1', 'Punho de Ferro (T1)', 's', '2017-03', 'o', 'Netflix', 2, 'netflix', 689),
  I('defensores', 'Os Defensores', 's', '2017-08', 'o', 'Netflix. Junta Demolidor, Jessica Jones, Luke Cage e Punho de Ferro', 2, 'netflix', 400),
  I('pun1', 'O Justiceiro (T1)', 's', '2017-11', 'o', 'Netflix', 2, 'netflix', 689),
  I('jj2', 'Jessica Jones (T2)', 's', '2018-03', 'o', 'Netflix', 2, 'netflix', 689),
  I('lc2', 'Luke Cage (T2)', 's', '2018-06', 'o', 'Netflix', 2, 'netflix', 689),
  I('if2', 'Punho de Ferro (T2)', 's', '2018-09', 'o', 'Netflix', 2, 'netflix', 530),
  I('dd3', 'Demolidor (T3)', 's', '2018-10', 'o', 'Netflix', 2, 'netflix', 689),
  I('pun2', 'O Justiceiro (T2)', 's', '2019-01', 'o', 'Netflix', 2, 'netflix', 689),
  I('jj3', 'Jessica Jones (T3)', 's', '2019-06', 'o', 'Netflix', 2, 'netflix', 689),
  I('shield35', 'Agents of S.H.I.E.L.D. (T3 a T5)', 's', '2015-09', 'o', '', 2, 'shield', 2838),
  I('guerracivil', 'Capitão América: Guerra Civil', 'f', '2016-05', '*', '', 2, 'cap ferro vingadores aranha pantera formiga viuva wanda', 147),
  I('viuva', 'Viúva Negra', 'f', '2021-07', '', '', 2, 'viuva thunder', 134),
  I('pantera1', 'Pantera Negra', 'f', '2018-02', '*', '', 2, 'pantera', 134),
  I('aranha1', 'Homem-Aranha: De Volta ao Lar', 'f', '2017-07', '', '', 2, 'aranha ferro', 133),
  I('estranho1', 'Doutor Estranho', 'f', '2016-11', '', '', 2, 'estranho', 115),
  I('ragnarok', 'Thor: Ragnarok', 'f', '2017-11', '*', '', 2, 'thor hulk loki', 130),
  I('formiga2', 'Homem-Formiga e a Vespa', 'f', '2018-07', '', '', 2, 'formiga', 118),
  I('guerrainf', 'Vingadores: Guerra Infinita', 'f', '2018-04', '*', '', 2, 'vingadores ferro cap thor hulk aranha gotg estranho pantera viuva wanda loki', 149),
  I('ultimato', 'Vingadores: Ultimato', 'f', '2019-04', '*', 'Volta aos cinemas em 25/09 como Endgame Encore', 2, 'vingadores ferro cap thor hulk aranha gotg estranho pantera viuva wanda formiga capita loki', 181),

  I('loki1', 'Loki (T1)', 's', '2021-06', '*', 'Acontece fora do tempo', 3, 'loki multiverso', 300),
  // A T2 continua do ponto exato onde a T1 termina, também fora do tempo: melhor ver em sequência.
  I('loki2', 'Loki (T2)', 's', '2023-10', '*', 'Continua direto do fim da T1', 3, 'loki multiverso', 300),
  I('whatif1', 'What If...? (T1)', 's', '2021-08', '', '', 3, 'multiverso', 288),
  I('wandavision', 'WandaVision', 's', '2021-01', '*', '', 3, 'wanda', 350),
  I('falcao', 'Falcão e o Soldado Invernal', 's', '2021-03', '*', '', 3, 'cap thunder', 300),
  I('shangchi', 'Shang-Chi e a Lenda dos Dez Anéis', 'f', '2021-09', '*', '', 3, 'outros', 132),
  I('eternos', 'Eternos', 'f', '2021-11', '', '', 3, 'outros', 156),
  I('aranha2', 'Homem-Aranha: Longe de Casa', 'f', '2019-07', '', '', 3, 'aranha', 129),
  I('aranha3', 'Homem-Aranha: Sem Volta para Casa', 'f', '2021-12', '*', 'Veja antes os Aranhas de Tobey e Andrew', 3, 'aranha estranho multiverso', 148),
  I('gaviao', 'Gavião Arqueiro', 's', '2021-11', '', '', 3, 'outros viuva', 300),
  I('eco', 'Eco', 's', '2024-01', 'o', '', 3, 'netflix', 200),
  I('estranho2', 'Doutor Estranho no Multiverso da Loucura', 'f', '2022-05', '*', '', 3, 'estranho wanda multiverso', 126),
  I('cavaleiro', 'Cavaleiro da Lua', 's', '2022-03', '', '', 3, 'outros', 300),
  I('msmarvel', 'Ms. Marvel', 's', '2022-06', '', '', 3, 'capita', 270),
  I('thor4', 'Thor: Amor e Trovão', 'f', '2022-07', '', '', 3, 'thor', 119),
  I('lobisomem', 'Lobisomem na Noite', 'e', '2022-10', 'o', '', 3, 'outros', 53),
  I('mulherhulk', 'Mulher-Hulk', 's', '2022-08', '', '', 3, 'hulk', 297),
  I('wakanda', 'Pantera Negra: Wakanda para Sempre', 'f', '2022-11', '*', '', 3, 'pantera', 161),
  I('invasao', 'Invasão Secreta', 's', '2023-06', '', '', 3, 'outros', 270),
  I('festas', 'Guardiões da Galáxia: Especial de Festas', 'e', '2022-11', 'o', '', 3, 'gotg', 44),

  I('quantumania', 'Homem-Formiga e a Vespa: Quantumania', 'f', '2023-02', '*', '', 4, 'formiga multiverso', 125),
  I('gotg3', 'Guardiões da Galáxia Vol. 3', 'f', '2023-05', '', '', 4, 'gotg', 150),
  I('marvels', 'As Marvels', 'f', '2023-11', '', 'A cena pós-créditos traz o Fera', 4, 'capita xmen', 105),
  I('whatif23', 'What If...? (T2 e T3)', 's', '2023-12', 'o', '', 4, 'multiverso', 544),
  I('zombies', 'Marvel Zombies', 's', '2025-09', 'o', '', 4, 'multiverso', 160),
  I('agatha', 'Agatha Desde Sempre', 's', '2024-09', '', '', 4, 'wanda', 360),
  I('ironheart', 'Coração de Ferro', 's', '2025-06', '', '', 4, 'ferro pantera', 270),
  I('deadpool3', 'Deadpool & Wolverine', 'f', '2024-07', '*', 'Outro universo, mas conecta aqui', 4, 'wolverine xmen multiverso', 128),
  I('ddr1', 'Demolidor: Renascido (T1)', 's', '2025-03', '', '', 4, 'netflix', 450),
  I('cap4', 'Capitão América: Admirável Mundo Novo', 'f', '2025-02', '*', '', 4, 'cap', 118),
  I('thunderbolts', 'Thunderbolts*', 'f', '2025-05', '*', '', 4, 'thunder viuva', 127),
  I('ddr2', 'Demolidor: Renascido (T2)', 's', '2026-03', '', '', 4, 'netflix', 400),
  I('justiceiro-especial', 'O Justiceiro: Uma Última Morte', 'e', '2026-05', 'o', 'Especial do Disney+', 4, 'netflix', 51),
  I('wonderman', 'Wonder Man', 's', '2026-01', 'o', '', 4, 'outros', 280),
  I('quarteto', 'Quarteto Fantástico: Primeiros Passos', 'f', '2025-07', '*', 'Se passa na Terra-828', 4, 'quarteto multiverso', 115),
  I('aranha4', 'Homem-Aranha: Um Novo Dia', 'f', '2026-07', '', '', 4, 'aranha', null),
  I('doomsday', 'Vingadores: Doomsday', 'f', '2026-12', '', 'Estreia em 18 de dezembro de 2026', 4, 'vingadores multiverso quarteto xmen thunder', null),

  I('x1', 'X-Men: O Filme', 'f', '2000-07', '*', '', 5, 'xmen', 104, 'xmen'),
  I('x2', 'X-Men 2', 'f', '2003-05', '*', '', 5, 'xmen', 134, 'xmen'),
  I('x3', 'X-Men: O Confronto Final', 'f', '2006-05', '*', '', 5, 'xmen', 104, 'xmen'),
  I('xo', 'X-Men Origens: Wolverine', 'f', '2009-05', '', '', 5, 'wolverine xmen', 107, 'xmen'),
  I('xfc', 'X-Men: Primeira Classe', 'f', '2011-06', '', '', 5, 'xmen', 132, 'xmen'),
  I('wolv2', 'Wolverine: Imortal', 'f', '2013-07', '', '', 5, 'wolverine xmen', 126, 'xmen'),
  I('xdofp', 'X-Men: Dias de um Futuro Esquecido', 'f', '2014-05', '*', '', 5, 'xmen', 132, 'xmen'),
  I('dp1', 'Deadpool', 'f', '2016-02', '', '', 5, 'wolverine xmen', 108, 'xmen'),
  I('xapoc', 'X-Men: Apocalipse', 'f', '2016-05', '', '', 5, 'xmen', 144, 'xmen'),
  I('logan', 'Logan', 'f', '2017-03', '', '', 5, 'wolverine xmen', 137, 'xmen'),
  I('dp2', 'Deadpool 2', 'f', '2018-05', '', '', 5, 'wolverine xmen', 119, 'xmen'),
  I('xdp', 'X-Men: Fênix Negra', 'f', '2019-06', '', '', 5, 'xmen', 113, 'xmen'),
  I('novos', 'Os Novos Mutantes', 'f', '2020-08', '', '', 5, 'xmen', 94, 'xmen'),
  I('sm1', 'Homem-Aranha', 'f', '2002-05', '', 'Tobey Maguire', 5, 'aranha', 121, 'sony'),
  I('sm2', 'Homem-Aranha 2', 'f', '2004-07', '', 'Tobey Maguire', 5, 'aranha', 127, 'sony'),
  I('sm3', 'Homem-Aranha 3', 'f', '2007-05', '', 'Tobey Maguire', 5, 'aranha', 139, 'sony'),
  I('asm1', 'O Espetacular Homem-Aranha', 'f', '2012-07', '', 'Andrew Garfield', 5, 'aranha', 136, 'sony'),
  I('asm2', 'O Espetacular Homem-Aranha 2', 'f', '2014-05', '', 'Andrew Garfield', 5, 'aranha', 142, 'sony'),
  I('blade1', 'Blade: O Caçador de Vampiros', 'f', '1998-08', 'o', '', 5, 'outros', 120, 'outros'),
  I('blade2', 'Blade II', 'f', '2002-03', 'o', '', 5, 'outros', 117, 'outros'),
  I('blade3', 'Blade: Trinity', 'f', '2004-12', 'o', '', 5, 'outros', 113, 'outros'),
  I('elektra', 'Elektra', 'f', '2005-01', 'o', '', 5, 'outros', 97, 'outros'),
  I('ff05', 'Quarteto Fantástico (2005)', 'f', '2005-07', 'o', '', 5, 'quarteto', 106, 'outros'),
  I('ff07', 'Quarteto Fantástico e o Surfista Prateado', 'f', '2007-06', 'o', '', 5, 'quarteto', 92, 'outros'),
  I('ff15', 'Quarteto Fantástico (2015)', 'f', '2015-08', 'o', '', 5, 'quarteto', 100, 'outros'),
];

ITEMS.forEach((it, i) => { it.i = i; });
let n = 0;
ITEMS.forEach(it => { if (it.e <= 4) it.num = ++n; });

export const CRONO_TOTAL = n;
export const BYID: Record<string, Item> = Object.fromEntries(ITEMS.map(it => [it.id, it]));
export const MAIN = ITEMS.filter(it => it.e <= 4 && it.id !== 'doomsday');
export const ESS = ITEMS.filter(it => it.star);
export const EXTRAS_ORDER = GROUPS.flatMap(g => ITEMS.filter(it => it.g === g.key));

/**
 * Trilha Vingadores: só o que leva a Doomsday. A Saga do Infinito dos heróis que formam os Vingadores,
 * o que continua a história deles depois de Ultimato, e os X-Men e o Quarteto antigo da Fox (que voltam
 * em Deadpool & Wolverine e Doomsday).
 * Fica de fora o que nunca cruza com os filmes dos Vingadores: Netflix, S.H.I.E.L.D., especiais, animações.
 */
export const TRILHA = new Set([
  'cap1', 'capita',
  'hdf1', 'hdf2', 'hulk', 'thor1', 'vingadores', 'hdf3', 'thor2', 'cap2', 'gotg1', 'gotg2', 'ultron', 'formiga1',
  'guerracivil', 'viuva', 'pantera1', 'aranha1', 'estranho1', 'ragnarok', 'formiga2', 'guerrainf', 'ultimato',
  'loki1', 'wandavision', 'falcao', 'shangchi', 'aranha2', 'aranha3', 'estranho2', 'thor4', 'wakanda',
  'quantumania', 'gotg3', 'marvels', 'loki2', 'deadpool3', 'cap4', 'thunderbolts', 'quarteto', 'aranha4', 'doomsday',
  'x1', 'x2', 'x3', 'xo', 'xfc', 'wolv2', 'xdofp', 'dp1', 'xapoc', 'logan', 'dp2', 'xdp',
  'ff05', 'ff07', 'ff15',
]);
export const SWATCHES = ['#0E8A94', '#D1336F', '#6366F1', '#C27C0E', '#2F9E5B', '#C0392B', '#8E44AD', '#2D7FD3'];

/* ---------------- Filtros ----------------
   Heróis e sagas com mais de um título. Cada filtro lista os títulos que entram nele
   (a ordem de exibição continua sendo a da linha do tempo). Os Vingadores ficam de fora: pra isso tem a Trilha. */
const tag = (k: string) => ITEMS.filter(it => it.fr.includes(k)).map(it => it.id);

export interface Filter { key: string; label: string; ids: Set<string> }
const F = (key: string, label: string, ids: string[]): Filter => ({ key, label, ids: new Set(ids) });

export const FILTER_LIST: Filter[] = [
  F('ferro', 'Homem de Ferro', tag('ferro')),
  F('cap', 'Capitão América', tag('cap')),
  F('thor', 'Thor', tag('thor')),
  F('aranha', 'Homem-Aranha', tag('aranha')),
  F('formiga', 'Homem-Formiga', tag('formiga')),
  F('estranho', 'Doutor Estranho', tag('estranho')),
  F('pantera', 'Pantera Negra', tag('pantera')),
  F('capita', 'Capitã Marvel', [...tag('capita'), 'invasao']),
  F('gotg', 'Guardiões da Galáxia', tag('gotg')),
  F('xmen', 'X-Men', tag('xmen')),
  F('wolverine', 'Wolverine', ['x1', 'x2', 'x3', 'xo', 'wolv2', 'xdofp', 'logan', 'deadpool3']),
  F('deadpool', 'Deadpool', ['xo', 'dp1', 'dp2', 'deadpool3']),
  F('quarteto', 'Quarteto Fantástico', tag('quarteto')),
  F('thunder', 'Thunderbolts', [...tag('thunder'), 'formiga2']),
  F('blade', 'Blade', ['blade1', 'blade2', 'blade3', 'deadpool3']),
  // O universo do Demolidor: as séries da Netflix e o que veio depois delas
  F('netflix', 'Saga dos Defensores', tag('netflix')),
  F('shield', 'S.H.I.E.L.D.', [...tag('shield'), 'cap2', 'invasao']),
  F('animacao', 'Animações', ['whatif1', 'groot', 'whatif23', 'zombies', 'olhos-wakanda']),
];
export const FILTERS: Record<string, Filter> = Object.fromEntries(FILTER_LIST.map(f => [f.key, f]));
