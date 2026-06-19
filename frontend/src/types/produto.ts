export const UNIDADES_PRODUTO = ['un', 'cx', 'kg', 'pct', 'g'] as const;

export type UnidadeProduto = (typeof UNIDADES_PRODUTO)[number];

export type Categoria = {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  produtos?: Produto[];
  _count?: {
    produtos: number;
  };
};

export type Produto = {
  id: string;
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: UnidadeProduto;
  observacao: string | null;
  categoriaId: string;
  categoria?: Categoria;
  criadoEm: string;
  atualizadoEm: string;
};

export type StatusEstoque = 'Normal' | 'Baixo' | 'Sem estoque';
