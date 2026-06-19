import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { useAuth } from '@/src/contexts/AuthContext';
import type { ProdutoFormData } from '@/src/schemas/produtoSchema';
import { api, getApiErrorMessage } from '@/src/services/api';
import type { Produto } from '@/src/types/produto';

type ProductsState = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
};

type ProductsAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Produto[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string }
  | { type: 'RESET' };

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
  carregarProdutos: () => Promise<void>;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

function produtosReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        produtos: action.payload,
        error: null,
        isLoading: false,
      };
    case 'LOAD_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'ADD':
      return {
        ...state,
        error: null,
        produtos: [action.payload, ...state.produtos],
      };
    case 'UPDATE':
      return {
        ...state,
        error: null,
        produtos: state.produtos.map((produto) =>
          produto.id === action.payload.id ? action.payload : produto
        ),
      };
    case 'DELETE':
      return {
        ...state,
        error: null,
        produtos: state.produtos.filter((produto) => produto.id !== action.payload),
      };
    case 'RESET':
      return {
        produtos: [],
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authIsLoading } = useAuth();
  const [state, dispatch] = useReducer(produtosReducer, {
    produtos: [],
    isLoading: false,
    error: null,
  });

  const carregarProdutos = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });

    try {
      const response = await api.get<Produto[]>('/produtos');
      dispatch({ type: 'LOAD_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: getApiErrorMessage(error, 'Não foi possível carregar os produtos.'),
      });
      throw error;
    }
  }, []);

  useEffect(() => {
    if (authIsLoading) {
      return;
    }

    if (!isAuthenticated) {
      dispatch({ type: 'RESET' });
      return;
    }

    carregarProdutos().catch(() => undefined);
  }, [authIsLoading, carregarProdutos, isAuthenticated]);

  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    try {
      const response = await api.post<Produto>('/produtos', data);
      dispatch({ type: 'ADD', payload: response.data });
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Não foi possível cadastrar o produto.'));
    }
  }, []);

  const editarProduto = useCallback(
    async (id: string, data: ProdutoFormData) => {
      try {
        const response = await api.put<Produto>(`/produtos/${id}`, data);
        dispatch({ type: 'UPDATE', payload: response.data });
      } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Não foi possível atualizar o produto.'));
      }
    },
    []
  );

  const deletarProduto = useCallback(async (id: string) => {
    try {
      await api.delete(`/produtos/${id}`);
      dispatch({ type: 'DELETE', payload: id });
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Não foi possível excluir o produto.'));
    }
  }, []);

  const getProdutoById = useCallback(
    (id: string) => state.produtos.find((produto) => produto.id === id),
    [state.produtos]
  );

  const value = useMemo<ProductsContextType>(
    () => ({
      produtos: state.produtos,
      isLoading: state.isLoading,
      error: state.error,
      carregarProdutos,
      adicionarProduto,
      editarProduto,
      deletarProduto,
      getProdutoById,
    }),
    [
      adicionarProduto,
      carregarProdutos,
      deletarProduto,
      editarProduto,
      getProdutoById,
      state.error,
      state.isLoading,
      state.produtos,
    ]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useProducts deve ser usado dentro de ProductsProvider');
  }

  return context;
}
