import { router, useLocalSearchParams } from 'expo-router';

import { ProdutoForm } from '@/src/components/ProdutoForm';
import { useProducts } from '@/src/contexts/ProductsContext';
import type { ProdutoFormData } from '@/src/schemas/produtoSchema';

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { deletarProduto, editarProduto, getProdutoById } = useProducts();

  const produto = id ? getProdutoById(id) : undefined;

  async function handleSubmit(data: ProdutoFormData) {
    if (!id) {
      return;
    }

    await editarProduto(id, data);
    router.back();
  }

  async function handleDelete() {
    if (!id) {
      return;
    }

    await deletarProduto(id);
    router.back();
  }

  return <ProdutoForm onDelete={handleDelete} onSubmit={handleSubmit} produto={produto} />;
}
