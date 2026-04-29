export type CategoriaProduto =
  | 'Bebidas'
  | 'Eletrônicos'
  | 'Escritório'
  | 'Limpeza'
  | 'Papelaria';

export type StatusEstoque = 'Normal' | 'Baixo' | 'Sem estoque';

export type Produto = {
  id: string;
  nome: string;
  categoria: CategoriaProduto;
  preco: number;
  estoque: number;
  atualizadoEm: string;
};

export type UsuarioMock = {
  nome: string;
};

export const USUARIO_MOCK: UsuarioMock = {
  nome: 'Odair',
};

export const PRODUTOS_MOCK: Produto[] = [
  {
    id: '1',
    nome: 'Café Premium 500g',
    categoria: 'Bebidas',
    preco: 18.9,
    estoque: 12,
    atualizadoEm: '2026-04-29T09:30:00',
  },
  {
    id: '2',
    nome: 'Mouse sem fio',
    categoria: 'Eletrônicos',
    preco: 79.9,
    estoque: 3,
    atualizadoEm: '2026-04-29T11:10:00',
  },
  {
    id: '3',
    nome: 'Caderno A4',
    categoria: 'Papelaria',
    preco: 24.5,
    estoque: 0,
    atualizadoEm: '2026-04-28T16:20:00',
  },
  {
    id: '4',
    nome: 'Água sanitária 1L',
    categoria: 'Limpeza',
    preco: 8.75,
    estoque: 7,
    atualizadoEm: '2026-04-29T08:05:00',
  },
  {
    id: '5',
    nome: 'Teclado mecânico',
    categoria: 'Eletrônicos',
    preco: 229.9,
    estoque: 2,
    atualizadoEm: '2026-04-27T13:15:00',
  },
  {
    id: '6',
    nome: 'Caneta azul',
    categoria: 'Escritório',
    preco: 3.5,
    estoque: 25,
    atualizadoEm: '2026-04-29T10:40:00',
  },
  {
    id: '7',
    nome: 'Pasta catálogo',
    categoria: 'Escritório',
    preco: 16.4,
    estoque: 4,
    atualizadoEm: '2026-04-28T14:00:00',
  },
  {
    id: '8',
    nome: 'Detergente neutro',
    categoria: 'Limpeza',
    preco: 4.2,
    estoque: 9,
    atualizadoEm: '2026-04-26T09:50:00',
  },
  {
    id: '9',
    nome: 'Refrigerante lata',
    categoria: 'Bebidas',
    preco: 5.99,
    estoque: 1,
    atualizadoEm: '2026-04-29T12:15:00',
  },
];

export const CATEGORIAS_MOCK: CategoriaProduto[] = [
  'Bebidas',
  'Eletrônicos',
  'Escritório',
  'Limpeza',
  'Papelaria',
];

export function getStatusEstoque(estoque: number): StatusEstoque {
  if (estoque <= 0) return 'Sem estoque';
  if (estoque <= 4) return 'Baixo';
  return 'Normal';
}
