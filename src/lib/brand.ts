/**
 * Éditeur et boutique. Primal Média est édité par la marque Primal (équipement MMA et grappling) :
 * le site le dit partout où c'est utile (pied de page, À propos, articles concernés).
 */
export const PUBLISHER = 'Primal';
export const PUBLISHER_ACTIVITY = 'marque d’équipement de MMA et de grappling';

/** Adresse de la boutique. Tant qu'elle vaut undefined, aucun lien boutique n'est affiché. */
export const SHOP_URL: string | undefined = undefined;

export const AD_LABELS = {
  publicite: 'Publicité',
  partenariat: 'Partenariat',
} as const;
export type AdKind = keyof typeof AD_LABELS;
