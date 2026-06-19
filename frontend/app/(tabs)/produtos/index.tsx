import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/src/components/ErrorView';
import { LoadingView } from '@/src/components/LoadingView';
import { theme } from '@/src/constants/theme';
import { useProducts } from '@/src/contexts/ProductsContext';
import { useCategorias } from '@/src/hooks/useCategorias';
import { getStatusEstoque } from '@/src/utils/produtos';

type CategoriaFiltro = string | 'todas';

export default function ListaProdutosScreen() {
  const { produtos, isLoading, error, carregarProdutos } = useProducts();
  const { categorias, isLoading: loadingCategorias } = useCategorias();
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaFiltro>('todas');
  const [refreshing, setRefreshing] = useState(false);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return produtos.filter((produto) => {
      const buscaOk = termo.length === 0 || produto.nome.toLowerCase().includes(termo);
      const categoriaOk = categoriaAtiva === 'todas' || produto.categoriaId === categoriaAtiva;

      return buscaOk && categoriaOk;
    });
  }, [busca, categoriaAtiva, produtos]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await carregarProdutos();
    } finally {
      setRefreshing(false);
    }
  }, [carregarProdutos]);

  if (isLoading && produtos.length === 0) {
    return <LoadingView mensagem="Carregando produtos..." />;
  }

  if (error && produtos.length === 0) {
    return <ErrorView mensagem={error} onRetry={() => carregarProdutos().catch(() => undefined)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setBusca}
          placeholder="Buscar produto..."
          placeholderTextColor={theme.colors.muted}
          style={styles.searchInput}
          value={busca}
        />

        <FlatList
          contentContainerStyle={styles.chipsContent}
          data={[{ id: 'todas', nome: 'Todos' }, ...categorias]}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const selected = item.id === categoriaAtiva;

            return (
              <Pressable
                onPress={() => setCategoriaAtiva(item.id as CategoriaFiltro)}
                style={[styles.chip, selected && styles.chipSelected]}>
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {item.nome}
                </Text>
              </Pressable>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />

        {loadingCategorias ? <Text style={styles.helper}>Carregando categorias...</Text> : null}

        <FlatList
          contentContainerStyle={styles.listContent}
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
              <Text style={styles.emptySubtitle}>Tente ajustar a busca ou o filtro.</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          renderItem={({ item }) => {
            const status = getStatusEstoque(item.quantidade, item.quantidadeMinima);

            return (
              <Pressable
                onPress={() => router.push(`/(tabs)/produtos/${item.id}` as never)}
                style={styles.productCard}>
                <View style={styles.productIcon}>
                  <Ionicons name="cube-outline" size={20} color={theme.colors.primary} />
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.nome}</Text>
                  <Text style={styles.productMeta}>
                    {item.quantidade} {item.unidade}
                  </Text>
                </View>

                <View style={styles.productRight}>
                  <Text
                    style={[
                      styles.statusBadge,
                      status === 'Sem estoque'
                        ? styles.statusError
                        : status === 'Baixo'
                          ? styles.statusWarning
                          : styles.statusSuccess,
                    ]}>
                    {status}
                  </Text>
                  <Text style={styles.categoryText}>{item.categoria?.nome ?? 'Categoria'}</Text>
                </View>
              </Pressable>
            );
          }}
          showsVerticalScrollIndicator={false}
        />

        <Pressable
          onPress={() => router.push('/(tabs)/produtos/novo' as never)}
          style={styles.fab}>
          <Ionicons name="add" size={28} color={theme.colors.white} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  categoryText: {
    color: theme.colors.muted,
    fontSize: theme.typography.small,
    marginTop: theme.spacing.xs,
  },
  chip: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
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
    alignItems: 'center',
    paddingBottom: theme.spacing.md,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
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
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  fab: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    bottom: theme.spacing.xl,
    elevation: 4,
    height: 58,
    justifyContent: 'center',
    position: 'absolute',
    right: theme.spacing.lg,
    width: 58,
  },
  helper: {
    color: theme.colors.muted,
    fontSize: theme.typography.small,
    marginBottom: theme.spacing.sm,
  },
  listContent: {
    paddingBottom: 110,
  },
  productCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  productIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  productInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  productMeta: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
  productName: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  productRight: {
    alignItems: 'flex-end',
    marginLeft: theme.spacing.sm,
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
    minHeight: 54,
    paddingHorizontal: theme.spacing.md,
  },
  statusBadge: {
    borderRadius: theme.radius.pill,
    fontSize: theme.typography.small,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusError: {
    backgroundColor: theme.colors.errorLight,
    color: theme.colors.error,
  },
  statusSuccess: {
    backgroundColor: theme.colors.successLight,
    color: theme.colors.success,
  },
  statusWarning: {
    backgroundColor: theme.colors.warningLight,
    color: theme.colors.warning,
  },
});
