import { useVersionManager } from './useVersionManager';

export function useNewsletter() {
  return useVersionManager({
    storageKey: 'newsletter-versions',
    defaultTitle: "Newsletter"
  });
}