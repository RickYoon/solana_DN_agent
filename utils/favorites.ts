export interface FavoriteService {
  domain: string;
  name: string;
  category: string;
}

const FAVORITES_KEY = 'defi-favorites';

export const getFavorites = (): FavoriteService[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(FAVORITES_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const addFavorite = (service: FavoriteService) => {
  const favorites = getFavorites();
  if (!favorites.some(f => f.domain === service.domain)) {
    favorites.push(service);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFavorite = (domain: string) => {
  const favorites = getFavorites();
  const filtered = favorites.filter(f => f.domain !== domain);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
};

export const isFavorite = (domain: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(f => f.domain === domain);
}; 