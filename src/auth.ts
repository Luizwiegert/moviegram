import type { SupabaseClient } from '@supabase/supabase-js';
import { AVATARS, avatarPickerHTML, markAvatarPicked } from './avatars';
import { BYID, EVENTS } from './data';
import { stashGuest } from './backend-guest';
import { cleanUsername, usernameFieldHTML } from './extras';
import { posterHTML } from './posters';
import { USERNAME_RE, eventItem, nextEvent } from './state';

type Mode = 'entrar' | 'criar' | 'esqueci' | 'nova';

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

function friendly(err: unknown, mode: Mode): string {
  const msg = String((err as { message?: string })?.message || err || '');
  if (/invalid login credentials/i.test(msg)) return 'E-mail ou senha errados.';
  if (/email not confirmed/i.test(msg)) return 'Falta confirmar o seu e-mail pelo link que enviamos. Não chegou? Confira o spam ou reenvie abaixo.';
  if (/already registered|already exists/i.test(msg)) return 'Esse e-mail já tem conta. Use “Entrar”.';
  if (/USERNAME_TAKEN/i.test(msg)) return 'Esse nome de usuário já está em uso. Tente outro.';
  if (/INVALID_INVITE/i.test(msg)) return 'O cadastro está fechado no momento. Tente de novo mais tarde.';
  if (/password.*(at least|6)/i.test(msg)) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (/rate limit|too many/i.test(msg)) return 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.';
  if (/invalid.*email|email.*invalid/i.test(msg)) return 'Esse e-mail não parece válido.';
  if (/fetch|network/i.test(msg)) return 'Sem conexão com o servidor. Confira a internet.';
  return mode === 'criar' ? 'Não foi possível criar a conta. Tente de novo.' : 'Algo deu errado. Tente de novo.';
}

export interface AuthOptions {
  /** Veio do link de redefinir senha */
  recovery?: boolean;
  /** Aba que abre primeiro */
  mode?: 'entrar' | 'criar';
  /** Volta para o site aberto (visitante). Sem isso, não mostra o link de voltar. */
  onBack?: () => void;
}

export function showAuth(sb: SupabaseClient, opts: AuthOptions = {}) {
  document.body.classList.add('logged-out');
  let mode: Mode = opts.recovery ? 'nova' : opts.mode || 'entrar';
  let avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)].id;

  // O último cartaz é sempre a próxima grande estreia (depois de Doomsday, o filme seguinte).
  const ev = nextEvent() || EVENTS[EVENTS.length - 1];
  const collage = [BYID.hdf1, BYID.vingadores, BYID.guerrainf, BYID.ultimato, eventItem(ev)]
    .map((it, k) => `<span class="c${k}">${posterHTML(it)}</span>`).join('');

  const form = () => {
    if (mode === 'nova') return `
      <h2>Nova senha</h2>
      <p class="muted">Escolha a senha nova da sua conta.</p>
      <label class="lbl" for="a-pass">Nova senha</label>
      <input id="a-pass" type="password" autocomplete="new-password" minlength="6" required>
      <button class="btn primary big" type="submit">Salvar nova senha</button>`;
    if (mode === 'esqueci') return `
      <h2>Esqueci a senha</h2>
      <p class="muted">Enviamos um link para o seu e-mail, por onde você cria uma senha nova.</p>
      <label class="lbl" for="a-email">E-mail</label>
      <input id="a-email" type="email" autocomplete="email" required>
      <button class="btn primary big" type="submit">Enviar link</button>
      <button class="linkish back" type="button" data-mode="entrar">Voltar para entrar</button>`;
    const tabs = `<div class="seg auth-tabs" role="tablist"><button type="button" role="tab" data-mode="entrar" aria-pressed="${mode === 'entrar'}">Entrar</button><button type="button" role="tab" data-mode="criar" aria-pressed="${mode === 'criar'}">Criar conta</button></div>`;
    if (mode === 'criar') return `${tabs}
      <label class="lbl" for="a-name">Seu nome</label>
      <input id="a-name" type="text" autocomplete="nickname" maxlength="20" required placeholder="Como você quer aparecer">
      <label class="lbl" for="a-user">Nome de usuário</label>
      ${usernameFieldHTML('a-user', '')}
      <label class="lbl" for="a-email">E-mail</label>
      <input id="a-email" type="email" autocomplete="email" required>
      <label class="lbl" for="a-pass">Senha</label>
      <input id="a-pass" type="password" autocomplete="new-password" minlength="6" required placeholder="Pelo menos 6 caracteres">
      <span class="lbl">Sua foto</span>
      ${avatarPickerHTML(avatar)}
      <button class="btn primary big" type="submit">Criar conta</button>
      <p class="auth-legal">Ao criar a conta você concorda com os <a href="/termos.html" target="_blank" rel="noopener">Termos de uso</a> e a <a href="/privacidade.html" target="_blank" rel="noopener">Política de privacidade</a>.</p>`;
    return `${tabs}
      <label class="lbl" for="a-email">E-mail</label>
      <input id="a-email" type="email" autocomplete="email" required>
      <label class="lbl" for="a-pass">Senha</label>
      <input id="a-pass" type="password" autocomplete="current-password" required>
      <button class="btn primary big" type="submit">Entrar</button>
      <button class="linkish back" type="button" data-mode="esqueci">Esqueci minha senha</button>`;
  };

  const view = $('#view');
  view.innerHTML = `${opts.onBack ? '<button class="linkish back-link" type="button" id="auth-back">Voltar para linha do tempo</button>' : ''}<section class="auth">
    <div class="auth-hero">
      <h1>Todos os filmes e séries da Marvel, na ordem certa.</h1>
      <p>Acompanhe o que você já assistiu, monte a lista do que falta ver e saiba onde assistir cada título até Vingadores: Doomsday.</p>
      <div class="collage" aria-hidden="true">${collage}</div>
    </div>
    <form class="auth-card" id="auth-form" novalidate>
      <div id="auth-fields"></div>
      <p class="auth-msg" id="auth-msg" role="alert" hidden></p>
      <button class="linkish back" type="button" id="auth-resend" hidden>Reenviar e-mail de confirmação</button>
    </form>
  </section>`;

  // E-mail que ainda falta confirmar (para poder reenviar o link)
  let pending = '';
  const draw = () => { $('#auth-fields').innerHTML = form(); setMsg(''); };
  const setMsg = (m: string, ok = false, resend = '') => {
    const el = $('#auth-msg');
    el.textContent = m; el.hidden = !m; el.classList.toggle('ok', ok);
    pending = resend;
    $('#auth-resend').hidden = !resend;
  };
  const val = (id: string) => ($<HTMLInputElement>('#' + id)?.value || '').trim();
  draw();

  $('#auth-back')?.addEventListener('click', () => opts.onBack?.());

  const f = $<HTMLFormElement>('#auth-form');
  f.addEventListener('input', e => {
    const t = e.target as HTMLInputElement;
    if (t.id === 'a-user') { const v = cleanUsername(t.value); if (v !== t.value) t.value = v; }
  });
  f.addEventListener('click', async e => {
    const t = e.target as HTMLElement;
    if (t.closest('#auth-resend')) {
      const email = pending, btn = $<HTMLButtonElement>('#auth-resend');
      if (!email) return;
      btn.disabled = true;
      const { error } = await sb.auth.resend({ type: 'signup', email, options: { emailRedirectTo: location.origin + location.pathname } });
      btn.disabled = false;
      if (error) setMsg(/rate limit|security purposes|seconds/i.test(error.message) ? 'Espere um minuto antes de pedir de novo.' : 'Não foi possível reenviar agora. Tente de novo em instantes.', false, email);
      else setMsg(`Reenviamos o link para ${email}. Pode levar alguns minutos. Confira também o spam e a aba Promoções.`, true, email);
      return;
    }
    const m = t.closest<HTMLElement>('[data-mode]');
    if (m) { mode = m.dataset.mode as Mode; draw(); $<HTMLInputElement>('#a-email, #a-name, #a-pass')?.focus(); return; }
    const pick = t.closest<HTMLElement>('[data-av]');
    if (pick) { avatar = pick.dataset.av!; markAvatarPicked(f, avatar); }
  });

  f.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = f.querySelector<HTMLButtonElement>('button[type=submit]')!;
    const label = btn.textContent;
    const busy = (b: boolean) => { btn.disabled = b; btn.textContent = b ? 'Aguarde…' : label; };
    setMsg('');
    try {
      busy(true);
      if (mode === 'entrar') {
        if (!val('a-email') || !val('a-pass')) { setMsg('Preencha e-mail e senha.'); return; }
        const { error } = await sb.auth.signInWithPassword({ email: val('a-email'), password: val('a-pass') });
        if (error) throw error;
      } else if (mode === 'criar') {
        if (!val('a-name')) { setMsg('Escreva seu nome.'); return; }
        if (!val('a-email')) { setMsg('Escreva seu e-mail.'); return; }
        if (val('a-pass').length < 6) { setMsg('A senha precisa ter pelo menos 6 caracteres.'); return; }
        const username = cleanUsername(val('a-user'));
        if (!USERNAME_RE.test(username)) { setMsg('Escolha um nome de usuário de 3 a 20 caracteres: letras minúsculas, números, ponto ou _.'); return; }
        const { data: free } = await sb.rpc('username_available', { u: username });
        if (free === false) { setMsg('Esse nome de usuário já está em uso. Tente outro.'); return; }
        const { data, error } = await sb.auth.signUp({
          email: val('a-email'), password: val('a-pass'),
          options: { data: { name: val('a-name').slice(0, 20), avatar, username }, emailRedirectTo: location.origin + location.pathname },
        });
        if (error) throw error;
        if (!data.session) {
          const email = val('a-email');
          stashGuest(email);
          mode = 'entrar'; draw();
          setMsg(`Conta criada. Enviamos um link de confirmação para ${email}. Se não chegar em 2 minutos, confira o spam e a aba Promoções, ou reenvie abaixo.`, true, email);
        }
      } else if (mode === 'esqueci') {
        if (!val('a-email')) { setMsg('Escreva seu e-mail.'); return; }
        const { error } = await sb.auth.resetPasswordForEmail(val('a-email'), { redirectTo: location.origin + location.pathname });
        if (error) throw error;
        setMsg('Pronto. Se esse e-mail tiver conta, o link chega em instantes.', true);
      } else {
        if (val('a-pass').length < 6) { setMsg('A senha precisa ter pelo menos 6 caracteres.'); return; }
        const { error } = await sb.auth.updateUser({ password: val('a-pass') });
        if (error) throw error;
        location.replace(location.origin + location.pathname);
      }
    } catch (err) {
      // E-mail ainda não confirmado: oferece reenviar o link
      const unconfirmed = mode === 'entrar' && /email not confirmed/i.test(String((err as { message?: string })?.message || ''));
      setMsg(friendly(err, mode), false, unconfirmed ? val('a-email') : '');
    } finally {
      busy(false);
    }
  });
}
