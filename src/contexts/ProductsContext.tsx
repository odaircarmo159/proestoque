import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { PRODUTOS_MOCK, type Produto } from '@/src/data/mockData';
import type { ProdutoFormData } from '@/src/schemas/produtoSchema';

type ProductsState = {
  produtos: Produto[];
  isLoading: boolean;
};

type ProductsAction =
  | { type: 'LOAD'; payload: Produto[] }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string };

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
};

const STORAGE_KEY = '@proestoque:produtos';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

function produtosReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        produtos: action.payload,
        isLoading: false,
      };
    case 'ADD':
      return {
        ...state,
        produtos: [action.payload, ...state.produtos],
      };
    case 'UPDATE':
      return {
        ...state,
        produtos: state.produtos.map((produto) =>
          produto.id === action.payload.id ? action.payload : produto
        ),
      };
    case 'DELETE':
      return {
        ...state,
        produtos: state.produtos.filter((produto) => produto.id !== action.payload),
      };
    default:
      return state;
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(produtosReducer, {
    produtos: [],
    isLoading: true,
  });

  useEffect(() => {
    async function loadProdutos() {
      const storedProdutos = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedProdutos) {
        dispatch({ type: 'LOAD', payload: JSON.parse(storedProdutos) as Produto[] });
        return;
      }

      dispatch({ type: 'LOAD', payload: PRODUTOS_MOCK });
    }

    loadProdutos();
  }, []);

  useEffect(() => {
    if (state.isLoading) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.produtos));
  }, [state.isLoading, state.produtos]);

  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    const now = new Date().toISOString();
    const produto: Produto = {
      id: `produto-${Date.now()}`,
      nome: data.nome,
      categoriaId: data.categoriaId,
      quantidade: data.quantidade,
      quantidadeMinima: data.quantidadeMinima,
      preco: data.preco,
      unidade: data.unidade,
      observacao: data.observacao?.trim() || undefined,
      atualizadoEm: now,
    };

    dispatch({ type: 'ADD', payload: produto });
  }, []);

  const editarProduto = useCallback(
    async (id: string, data: ProdutoFormData) => {
      const produtoAtual = state.produtos.find((produto) => produto.id === id);

      if (!produtoAtual) {
        return;
      }

      const produtoAtualizado: Produto = {
        ...produtoAtual,
        nome: data.nome,
        categoriaId: data.categoriaId,
        quantidade: data.quantidade,
        quantidadeMinima: data.quantidadeMinima,
        preco: data.preco,
        unidade: data.unidade,
        observacao: data.observacao?.trim() || undefined,
        atualizadoEm: new Date().toISOString(),
      };

      dispatch({ type: 'UPDATE', payload: produtoAtualizado });
    },
    [state.produtos]
  );

  const deletarProduto = useCallback(async (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const getProdutoById = useCallback(
    (id: string) => state.produtos.find((produto) => produto.id === id),
    [state.produtos]
  );

  const value = useMemo<ProductsContextType>(
    () => ({
      produtos: state.produtos,
      isLoading: state.isLoading,
      adicionarProduto,
      editarProduto,
      deletarProduto,
      getProdutoById,
    }),
    [adicionarProduto, deletarProduto, editarProduto, getProdutoById, state.isLoading, state.produtos]
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
