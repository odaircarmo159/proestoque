import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/src/constants/theme';
import {
  CATEGORIAS_MOCK,
  getStatusEstoque,
  PRODUTOS_MOCK,
  type CategoriaProduto,
} from '@/src/data/mockData';

type CategoriaFiltro = CategoriaProduto | 'Todas';

export default function ProdutosScreen() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaFiltro>('Todas');

  const categorias = useMemo(() => ['Todas', ...CATEGORIAS_MOCK] as CategoriaFiltro[], []);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return PRODUTOS_MOCK.filter((produto) => {
      const buscaValida =
        termo.length === 0 ||
        produto.nome.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo);

      const categoriaValida =
        categoriaSelecionada === 'Todas' || produto.categoria === categoriaSelecionada;

      return buscaValida && categoriaValida;
    });
  }, [busca, categoriaSelecionada]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.content}
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
            <Text style={styles.emptySubtitle}>Tente ajustar a busca ou o filtro.</Text>
          </View>
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Produtos</Text>
            <Text style={styles.subtitle}>Busque e filtre os itens do estoque</Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setBusca}
              placeholder="Buscar por nome ou categoria"
              placeholderTextColor={theme.colors.muted}
              style={styles.searchInput}
              value={busca}
            />

            <FlatList
              contentContainerStyle={styles.chipsContent}
              data={categorias}
              horizontal
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const selected = item === categoriaSelecionada;

                return (
                  <Pressable
                    onPress={() => setCategoriaSelecionada(item)}
                    style={[styles.chip, selected && styles.chipSelected]}>
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        }
        renderItem={({ item }) => {
          const status = getStatusEstoque(item.estoque);

          return (
            <View style={styles.productCard}>
              <View style={styles.productTop}>
                <View>
                  <Text style={styles.productName}>{item.nome}</Text>
                  <Text style={styles.productCategory}>{item.categoria}</Text>
                </View>
                <Text style={styles.productStatus}>{status}</Text>
              </View>

              <View style={styles.productBottom}>
                <Text style={styles.productStock}>Estoque: {item.estoque}</Text>
                <Text style={styles.productPrice}>
                  {item.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
              </View>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    marginRight: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.text,
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: theme.colors.white,
  },
  chipsContent: {
    paddingBottom: theme.spacing.md,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  emptyBox: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    marginTop: theme.spacing.md,
    padding: theme.spacing.xl,
  },
  emptySubtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  productBottom: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  productCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  productCategory: {
    color: theme.colors.muted,
    fontSize: theme.typography.small,
    marginTop: theme.spacing.xs,
  },
  productName: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '700',
    maxWidth: 220,
  },
  productPrice: {
    color: theme.colors.primary,
    fontSize: theme.typography.caption,
    fontWeight: '800',
  },
  productStatus: {
    color: theme.colors.info,
    fontSize: theme.typography.small,
    fontWeight: '800',
  },
  productStock: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
  },
  productTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    color: theme.colors.text,
    fontSize: theme.typography.body,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xl,
    minHeight: 54,
    paddingHorizontal: theme.spacing.md,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.body,
    marginTop: theme.spacing.xs,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    fontWeight: '800',
  },
});
