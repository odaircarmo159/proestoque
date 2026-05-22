import { router } from 'expo-router';

import { ProdutoForm } from '@/src/components/ProdutoForm';
import { useProducts } from '@/src/contexts/ProductsContext';
import type { ProdutoFormData } from '@/src/schemas/produtoSchema';

export default function NovoProdutoScreen() {
  const { adicionarProduto } = useProducts();

  async function handleSubmit(data: ProdutoFormData) {
    await adicionarProduto(data);
    router.back();
  }

  return <ProdutoForm onSubmit={handleSubmit} />;
}
