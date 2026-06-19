import { router } from 'expo-router';
import { Alert } from 'react-native';

import { ProdutoForm } from '@/src/components/ProdutoForm';
import { useProducts } from '@/src/contexts/ProductsContext';
import type { ProdutoFormData } from '@/src/schemas/produtoSchema';

export default function NovoProdutoScreen() {
  const { adicionarProduto } = useProducts();

  async function handleSubmit(data: ProdutoFormData) {
    try {
      await adicionarProduto(data);
      router.back();
    } catch (error) {
      Alert.alert(
        'Erro ao cadastrar produto',
        error instanceof Error ? error.message : 'Não foi possível cadastrar o produto.'
      );
    }
  }

  return <ProdutoForm onSubmit={handleSubmit} />;
}
