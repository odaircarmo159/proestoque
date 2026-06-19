import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/src/components/ErrorView';
import { LoadingView } from '@/src/components/LoadingView';
import { theme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';
import { useProducts } from '@/src/contexts/ProductsContext';
import type { StatusEstoque } from '@/src/types/produto';
import { formatarPreco } from '@/src/utils/formatters';
import { getStatusEstoque } from '@/src/utils/produtos';

type ResumoCard = {
  id: string;
  label: string;
  value: string;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { produtos, isLoading, error, carregarProdutos } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  const saudacao = useMemo(() => {
    const horaAtual = new Date().getHours();

    if (horaAtual < 12) return 'Bom dia';
    if (horaAtual < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  const dataHoje = useMemo(
    () =>
      new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    []
  );

  const produtosRecentes = useMemo(
    () =>
      [...produtos].sort(
        (a, b) => new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime()
      ),
    [produtos]
  );

  const produtosCriticos = useMemo(
    () =>
      produtos.filter(
        (produto) => getStatusEstoque(produto.quantidade, produto.quantidadeMinima) !== 'Normal'
      ),
    [produtos]
  );

  const valorTotal = useMemo(
    () => produtos.reduce((total, produto) => total + produto.preco * produto.quantidade, 0),
    [produtos]
  );

  const categoriasTotal = useMemo(
    () => new Set(produtos.map((produto) => produto.categoriaId)).size,
    [produtos]
  );

  const resumoCards: ResumoCard[] = useMemo(
    () => [
      { id: 'total', label: 'Total', value: `${produtos.length}` },
      { id: 'alertas', label: 'Alertas', value: `${produtosCriticos.length}` },
      { id: 'categorias', label: 'Categorias', value: `${categoriasTotal}` },
      { id: 'valor', label: 'Valor', value: formatarPreco(valorTotal) },
    ],
    [categoriasTotal, produtos.length, produtosCriticos.length, valorTotal]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await carregarProdutos();
    } finally {
      setRefreshing(false);
    }
  }, [carregarProdutos]);

  if (isLoading && produtos.length === 0) {
    return <LoadingView mensagem="Carregando dashboard..." />;
  }

  if (error && produtos.length === 0) {
    return <ErrorView mensagem={error} onRetry={() => carregarProdutos().catch(() => undefined)} />;
  }

  const inicialNome = user?.nome?.trim().charAt(0).toUpperCase() ?? 'U';

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.content}
        data={produtosRecentes}
        keyExtractor={(item) => item.id}
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
            <View style={styles.productCard}>
              <View style={styles.productHeader}>
                <View>
                  <Text style={styles.productName}>{item.nome}</Text>
                  <Text style={styles.productCategory}>{item.categoria?.nome ?? 'Categoria'}</Text>
                </View>
                <StatusBadge status={status} />
              </View>

              <View style={styles.productFooter}>
                <Text style={styles.productMeta}>
                  Estoque: {item.quantidade} {item.unidade}
                </Text>
                <Text style={styles.productPrice}>{formatarPreco(item.preco)}</Text>
              </View>
            </View>
          );
        }}
        ListHeaderComponent={
          <View>
            <View style={styles.heroHeader}>
              <View>
                <Text style={styles.kicker}>{saudacao}</Text>
                <Text style={styles.title}>Olá, {user?.nome ?? 'Usuário'}</Text>
                <Text style={styles.date}>{dataHoje}</Text>
              </View>

              <Pressable style={styles.avatar}>
                <Text style={styles.avatarText}>{inicialNome}</Text>
              </Pressable>
            </View>

            <View style={styles.grid}>
              {resumoCards.map((card) => (
                <View key={card.id} style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>{card.label}</Text>
                  <Text
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                    numberOfLines={1}
                    style={styles.summaryValue}>
                    {card.value}
                  </Text>
                </View>
              ))}
            </View>

            {produtosCriticos.length > 0 ? (
              <View style={styles.alertSection}>
                <Text style={styles.sectionTitle}>Estoque crítico</Text>
                {produtosCriticos.slice(0, 3).map((produto) => (
                  <View key={produto.id} style={styles.alertItem}>
                    <View>
                      <Text style={styles.alertName}>{produto.nome}</Text>
                      <Text style={styles.alertCategory}>
                        {produto.categoria?.nome ?? 'Categoria'}
                      </Text>
                    </View>
                    <Text style={styles.alertStock}>
                      {produto.quantidade} {produto.unidade}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            <Text style={styles.sectionTitle}>Produtos recentes</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function StatusBadge({ status }: { status: StatusEstoque }) {
  const badgeStyle =
    status === 'Sem estoque'
      ? styles.badgeError
      : status === 'Baixo'
        ? styles.badgeWarning
        : styles.badgeSuccess;

  const textStyle =
    status === 'Sem estoque'
      ? styles.badgeErrorText
      : status === 'Baixo'
        ? styles.badgeWarningText
        : styles.badgeSuccessText;

  return (
    <View style={[styles.badge, badgeStyle]}>
      <Text style={[styles.badgeText, textStyle]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alertCategory: {
    color: theme.colors.muted,
    fontSize: theme.typography.small,
    marginTop: theme.spacing.xs,
  },
  alertItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  alertName: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '700',
  },
  alertSection: {
    backgroundColor: theme.colors.warningLight,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
  },
  alertStock: {
    color: theme.colors.warning,
    fontSize: theme.typography.caption,
    fontWeight: '800',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
  },
  badge: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
  },
  badgeError: {
    backgroundColor: theme.colors.errorLight,
  },
  badgeErrorText: {
    color: theme.colors.error,
  },
  badgeSuccess: {
    backgroundColor: theme.colors.successLight,
  },
  badgeSuccessText: {
    color: theme.colors.success,
  },
  badgeText: {
    fontSize: theme.typography.small,
    fontWeight: '800',
  },
  badgeWarning: {
    backgroundColor: theme.colors.warningLight,
  },
  badgeWarningText: {
    color: theme.colors.warning,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  date: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  heroHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  kicker: {
    color: theme.colors.primary,
    fontSize: theme.typography.caption,
    fontWeight: '700',
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
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productMeta: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
  },
  productName: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  productPrice: {
    color: theme.colors.text,
    fontSize: theme.typography.caption,
    fontWeight: '800',
  },
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    marginBottom: theme.spacing.md,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    flexGrow: 1,
    minWidth: '47%',
    padding: theme.spacing.md,
  },
  summaryLabel: {
    color: theme.colors.muted,
    fontSize: theme.typography.small,
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    marginTop: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    fontWeight: '800',
    marginTop: theme.spacing.xs,
  },
});
