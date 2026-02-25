import { useVersionManager } from './useVersionManager';

export function usePolicy() {
  return useVersionManager({
    storageKey: 'policy-versions',
    defaultTitle: "Politique de Confidentialité"
  });
}