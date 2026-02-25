import { useVersionManager } from './useVersionManager';

export function useCGU() {
  return useVersionManager({
    storageKey: 'cgu-versions',
    defaultTitle: "Conditions Générales d'Utilisation"
  });
}