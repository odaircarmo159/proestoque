import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';

import { ErrorView } from '@/src/components/ErrorView';
import { LoadingView } from '@/src/components/LoadingView';
import { ProdutoForm } from '@/src/components/ProdutoForm';
import { useProducts } from '@/src/contexts/ProductsContext';
import type { ProdutoFormData } from '@/src/schemas/produtoSchema';

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { deletarProduto, editarProduto, getProdutoById, isLoading, error, carregarProdutos } =
    useProducts();

  const produto = id ? getProdutoById(id) : undefined;

  async function handleSubmit(data: ProdutoFormData) {
    if (!id) {
      return;
    }

    try {
      await editarProduto(id, data);
      router.back();
    } catch (error) {
      Alert.alert(
        'Erro ao atualizar produto',
        error instanceof Error ? error.message : 'Não foi possível atualizar o produto.'
      );
    }
  }

  async function handleDelete() {
    if (!id) {
      return;
    }

    try {
      await deletarProduto(id);
      router.back();
    } catch (error) {
      Alert.alert(
        'Erro ao excluir produto',
        error instanceof Error ? error.message : 'Não foi possível excluir o produto.'
      );
    }
  }

  if (isLoading && !produto) {
    return <LoadingView mensagem="Carregando produto..." />;
  }

  if (!produto) {
    return (
      <ErrorView
        mensagem={error ?? 'Produto não encontrado.'}
        onRetry={() => carregarProdutos().catch(() => undefined)}
      />
    );
  }

  return <ProdutoForm onDelete={handleDelete} onSubmit={handleSubmit} produto={produto} />;
}
