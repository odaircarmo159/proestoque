import { useCallback, useEffect, useState } from 'react';

import { api, getApiErrorMessage } from '@/src/services/api';
import type { Categoria } from '@/src/types/produto';

type UseCategoriasReturn = {
  categorias: Categoria[];
  isLoading: boolean;
  error: string | null;
  carregarCategorias: () => Promise<void>;
};

export function useCategorias(): UseCategoriasReturn {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Categoria[]>('/categorias');
      setCategorias(response.data);
    } catch (error) {
      setError(getApiErrorMessage(error, 'Não foi possível carregar as categorias.'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarCategorias().catch(() => undefined);
  }, [carregarCategorias]);

  return {
    categorias,
    isLoading,
    error,
    carregarCategorias,
  };
}
