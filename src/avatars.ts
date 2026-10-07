import LIST from './avatars.json';

// Fotos de perfil: imagens da pasta avatares/, preparadas por scripts/avatares.mjs (npm run avatares)
// e servidas de public/avatars/<id>.webp.

export interface Avatar { id: string; name: string; group: 'heroi' | 'vilao' }

export const AVATARS = LIST as Avatar[];

const BY_ID: Record<string, Avatar> = Object.fromEntries(AVATARS.map(a => [a.id, a]));

// Fotos da primeira versão que viraram outro id. As que saíram mostram a inicial até a pessoa escolher de novo.
const ALIAS: Record<string, string> = { bucky: 'soldado-invernal' };

export const avatarById = (id: string | null | undefined) => (id ? BY_ID[id] || BY_ID[ALIAS[id]] : undefined);

export const avatarStyle = (a: Avatar) => `background-image:url(/avatars/${a.id}.webp);background-size:cover;background-position:center`;

const GROUPS: [Avatar['group'], string][] = [['heroi', 'Heróis'], ['vilao', 'Vilões']];

/** Grade pra escolher o personagem (cadastro e edição de perfil), separada em heróis e vilões. */
export const avatarPickerHTML = (selected: string | null) => {
  const sel = avatarById(selected)?.id ?? null;
  return `<div class="av-pick" role="radiogroup" aria-label="Foto de perfil">${GROUPS.map(([g, label]) =>
    `<p class="av-group">${label}</p>${AVATARS.filter(a => a.group === g).map(a =>
      `<button type="button" role="radio" data-av="${a.id}" aria-checked="${a.id === sel}" title="${a.name}"><span class="av pic" style="${avatarStyle(a)}"></span><span class="av-name">${a.name}</span></button>`).join('')}`).join('')}</div>`;
};

export function markAvatarPicked(root: ParentNode, id: string) {
  root.querySelectorAll<HTMLElement>('[data-av]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.av === id)));
}
