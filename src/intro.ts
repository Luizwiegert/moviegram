import BACK from './backdrops.json';
import { reduced } from './util';

/**
 * Abertura curta, no estilo do final da vinheta da Marvel Studios, com MOVIE no bloco e GRAM no lugar de STUDIOS:
 * o logo vem inclinado e vira de frente com cenas passando dentro das letras, GRAM entra pela direita,
 * e tudo termina no fundo vermelho com as letras vermelhas.
 * Toca uma vez por sessão do navegador. Em desenvolvimento, ?abertura força tocar de novo.
 */

const BACKS = BACK as Record<string, string>;
const LOGO_FILL = BACKS.guerrainf ? `https://image.tmdb.org/t/p/w1280${BACKS.guerrainf}` : '';

const SEEN = 'moviegram-abertura';

function shouldPlay(): boolean {
  if (reduced() || !LOGO_FILL) return false;
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('abertura')) return true;
  try { return !sessionStorage.getItem(SEEN); } catch { return true; }
}

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
const load = (src: string) => new Promise<void>(res => { const i = new Image(); i.onload = i.onerror = () => res(); i.src = src; });
const E = { out: 'cubic-bezier(.2,.7,.2,1)', io: 'cubic-bezier(.65,0,.35,1)' };

export function playIntro(): Promise<void> {
  if (!shouldPlay()) return Promise.resolve();
  try { sessionStorage.setItem(SEEN, '1'); } catch { /* sem sessão, toca mesmo assim */ }

  const root = document.createElement('div');
  root.className = 'intro';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <div class="sc sc-logo"><div class="lg-bg"></div><div class="lg-stage"><div class="lg">
      <div class="lg-box"><span class="lg-word film" style="background-image:url(${LOGO_FILL})">MOVIE</span><span class="lg-word red">MOVIE</span></div>
      <div class="lg-gram"><span>GRAM</span></div>
    </div></div></div>`;
  const skip = document.createElement('button');
  skip.className = 'intro-skip';
  skip.type = 'button';
  skip.textContent = 'Pular abertura';
  document.body.append(root, skip);
  document.documentElement.classList.add('intro-on');

  let done = false;
  let resolve!: () => void;
  const finished = new Promise<void>(r => { resolve = r; });
  const end = async (fast: boolean) => {
    if (done) return;
    done = true;
    skip.remove();
    await root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fast ? 220 : 600, easing: 'ease', fill: 'forwards' }).finished.catch(() => {});
    root.remove();
    document.documentElement.classList.remove('intro-on');
    removeEventListener('keydown', onKey);
    resolve();
  };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') void end(true); };
  skip.addEventListener('click', () => void end(true));
  addEventListener('keydown', onKey);

  const $ = <T extends HTMLElement>(s: string) => root.querySelector(s) as T;

  void (async () => {
    // Espera a imagem de dentro das letras (no máximo 1,5 s)
    await Promise.race([load(LOGO_FILL), wait(1500)]);
    if (done) return;

    // Linha do tempo (ms)
    const T = { start: 200, gram: 900, red: 2300, end: 4200 };

    /* O logo vem inclinado e vira de frente, com a cena passando dentro das letras */
    $('.sc-logo').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: T.start, fill: 'both' });
    $('.lg').animate([
      { transform: 'rotateX(72deg) rotateZ(-14deg) scale(2.6) translateY(-8%)' },
      { transform: 'rotateX(26deg) rotateY(-16deg) rotateZ(-3deg) scale(1.25)', offset: .55 },
      { transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)' },
    ], { duration: T.red - T.start, delay: T.start, easing: E.io, fill: 'both' });
    $('.lg-word.film').animate([{ backgroundPosition: '0% 40%' }, { backgroundPosition: '100% 60%' }],
      { duration: T.end - T.start, delay: T.start, easing: 'linear', fill: 'both' });

    /* GRAM entra pela direita */
    $('.lg-gram').animate([
      { opacity: 0, transform: 'translateX(40%) rotateY(-70deg)' },
      { opacity: 1, transform: 'translateX(0) rotateY(0deg)' },
    ], { duration: 1000, delay: T.gram, easing: E.out, fill: 'both' });

    /* Final: fundo vermelho, letras vermelhas no bloco prateado */
    $('.lg-bg').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, delay: T.red - 300, easing: 'ease', fill: 'both' });
    $('.lg-word.red').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: T.red, easing: 'ease', fill: 'both' });

    await wait(T.end);
    void end(false);
  })();

  return finished;
}
