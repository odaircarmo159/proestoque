import type { StatusEstoque } from '@/src/types/produto';

export function getStatusEstoque(
  quantidade: number,
  quantidadeMinima: number
): StatusEstoque {
  if (quantidade <= 0) return 'Sem estoque';
  if (quantidade <= quantidadeMinima) return 'Baixo';
  return 'Normal';
}
