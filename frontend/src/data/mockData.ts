export const CATEGORIA_IDS = [
  'bebidas',
  'alimentos',
  'limpeza',
  'papelaria',
  'escritorio',
] as const;

export type CategoriaProdutoId = (typeof CATEGORIA_IDS)[number];

export const UNIDADES_PRODUTO = ['un', 'cx', 'kg', 'pct', 'g'] as const;

export type UnidadeProduto = (typeof UNIDADES_PRODUTO)[number];

export type StatusEstoque = 'Normal' | 'Baixo' | 'Sem estoque';

export type CategoriaProduto = {
  id: CategoriaProdutoId;
  nome: string;
};

export type Produto = {
  id: string;
  nome: string;
  categoriaId: CategoriaProdutoId;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: UnidadeProduto;
  observacao?: string;
  atualizadoEm: string;
};

export const CATEGORIAS_MOCK: CategoriaProduto[] = [
  { id: 'bebidas', nome: 'Bebidas' },
  { id: 'alimentos', nome: 'Alimentos' },
  { id: 'limpeza', nome: 'Limpeza' },
  { id: 'papelaria', nome: 'Papelaria' },
  { id: 'escritorio', nome: 'Escritório' },
];

export const PRODUTOS_MOCK: Produto[] = [
  {
    id: '1',
    nome: 'Café Especial 250g',
    categoriaId: 'bebidas',
    quantidade: 4,
    quantidadeMinima: 10,
    preco: 32.9,
    unidade: 'un',
    observacao: 'Pacote premium para vendas unitárias.',
    atualizadoEm: '2026-05-21T09:30:00',
  },
  {
    id: '2',
    nome: 'Água Mineral 500ml',
    categoriaId: 'bebidas',
    quantidade: 48,
    quantidadeMinima: 12,
    preco: 3.5,
    unidade: 'un',
    atualizadoEm: '2026-05-21T11:10:00',
  },
  {
    id: '3',
    nome: 'Sabão em Pó 3kg',
    categoriaId: 'limpeza',
    quantidade: 0,
    quantidadeMinima: 3,
    preco: 28.4,
    unidade: 'cx',
    atualizadoEm: '2026-05-20T16:20:00',
  },
  {
    id: '4',
    nome: 'Arroz Branco 5kg',
    categoriaId: 'alimentos',
    quantidade: 15,
    quantidadeMinima: 6,
    preco: 29.9,
    unidade: 'cx',
    atualizadoEm: '2026-05-21T08:05:00',
  },
  {
    id: '5',
    nome: 'Caneta Esferográfica',
    categoriaId: 'papelaria',
    quantidade: 1,
    quantidadeMinima: 5,
    preco: 2.8,
    unidade: 'cx',
    atualizadoEm: '2026-05-19T13:15:00',
  },
  {
    id: '6',
    nome: 'Feijão Carioca 1kg',
    categoriaId: 'alimentos',
    quantidade: 12,
    quantidadeMinima: 5,
    preco: 8.9,
    unidade: 'pct',
    atualizadoEm: '2026-05-21T10:40:00',
  },
  {
    id: '7',
    nome: 'Detergente Neutro',
    categoriaId: 'limpeza',
    quantidade: 9,
    quantidadeMinima: 4,
    preco: 4.2,
    unidade: 'un',
    atualizadoEm: '2026-05-18T14:00:00',
  },
  {
    id: '8',
    nome: 'Papel Sulfite A4',
    categoriaId: 'escritorio',
    quantidade: 22,
    quantidadeMinima: 8,
    preco: 34.9,
    unidade: 'pct',
    atualizadoEm: '2026-05-17T09:50:00',
  },
];

export function getCategoriaById(categoriaId: CategoriaProdutoId) {
  return CATEGORIAS_MOCK.find((categoria) => categoria.id === categoriaId);
}

export function getCategoriaNome(categoriaId: CategoriaProdutoId) {
  return getCategoriaById(categoriaId)?.nome ?? 'Categoria';
}

export function getStatusEstoque(
  quantidade: number,
  quantidadeMinima: number
): StatusEstoque {
  if (quantidade <= 0) return 'Sem estoque';
  if (quantidade <= quantidadeMinima) return 'Baixo';
  return 'Normal';
}
