import './style.css';
import { createClient } from '@supabase/supabase-js';
import { showAuth } from './auth';
import { playIntro } from './intro';
import { startDemo } from './backend-demo';
import { guestBackend } from './backend-guest';
import { startLive } from './backend-live';
import { installPosterFallback } from './posters';
import { S, nav } from './state';
import { askAccount, showApp, showMessage } from './views';

installPosterFallback();
// A abertura roda por cima enquanto o site carrega por baixo.
void playIntro();

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (url && key) {
  const sb = createClient(url, key);
  // Sem conta, o site abre do mesmo jeito: é possível ver tudo, e a conta só é pedida na hora de marcar.
  const guest = guestBackend(askAccount);
  const showGuest = () => { S.me = ''; S.backend = guest; showApp(); };
  nav.openAuth = mode => { window.scrollTo(0, 0); showAuth(sb, { mode, onBack: showGuest }); };
  void startLive(sb, {
    showLoading: () => showMessage('Carregando…', 'Só um instante.'),
    showAuth: recovery => showAuth(sb, { recovery }),
    showGuest,
    showApp,
    showFatal: msg => showMessage('Algo deu errado', msg),
  });
} else {
  startDemo();
  showApp();
}
