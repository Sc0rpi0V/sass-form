import { useVersionManager } from './useVersionManager';

export function useCGV() {
  return useVersionManager({
    storageKey: 'cgv-versions',
    defaultTitle: "Conditions Générales de Vente"
  });
}