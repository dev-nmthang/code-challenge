import { useQuery } from '@tanstack/react-query';
import { fetchTokenPrices } from '../services/api';

export const useTokenPrices = () => {
  return useQuery({
    queryKey: ['tokenPrices'],
    queryFn: fetchTokenPrices,
    staleTime: 30000,
    refetchInterval: 60000,
  });
};
