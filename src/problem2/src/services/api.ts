import type { TokenPrice, Token } from '../types';

const API_URL = 'https://interview.switcheo.com/prices.json';

export const fetchTokenPrices = async (): Promise<Token[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch token prices');
  }
  
  const data: TokenPrice[] = await response.json();
  
  const tokenMap = new Map<string, { price: number; date: string }>();
  
  data.forEach(item => {
    if (item.price > 0) {
      const existing = tokenMap.get(item.currency);
      
      if (!existing || new Date(item.date) > new Date(existing.date)) {
        tokenMap.set(item.currency, { price: item.price, date: item.date });
      }
    }
  });
  
  return Array.from(tokenMap.entries())
    .map(([currency, { price }]) => ({ currency, price }))
    .sort((a, b) => a.currency.localeCompare(b.currency));
};
