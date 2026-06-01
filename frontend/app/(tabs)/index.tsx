import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';
import { useProducts } from '@/src/contexts/ProductsContext';
import { getCategoriaNome, getStatusEstoque, type StatusEstoque } from '@/src/data/mockData';

type ResumoCard = {
  id: string;
  label: string;
  value: string;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { produtos } = useProducts();
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
      {
        id: 'valor',
        label: 'Valor',
        value: valorTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          maximumFractionDigits: 0,
        }),
      },
    ],
    [categoriasTotal, produtos.length, produtosCriticos.length, valorTotal]
  );

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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
                  <Text style={styles.productCategory}>{getCategoriaNome(item.categoriaId)}</Text>
                </View>
                <StatusBadge status={status} />
              </View>

              <View style={styles.productFooter}>
                <Text style={styles.productMeta}>
                  Estoque: {item.quantidade} {item.unidade}
                </Text>
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
                        {getCategoriaNome(produto.categoriaId)}
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
    fontWeight: '700',
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
    marginTop: theme.spacing.xl,
  },
  heroHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kicker: {
    color: theme.colors.info,
    fontSize: theme.typography.caption,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  productHeader: {
    alignItems: 'flex-start',
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
    fontWeight: '700',
    maxWidth: 210,
  },
  productPrice: {
    color: theme.colors.primary,
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
    minHeight: 110,
    padding: theme.spacing.md,
    width: '47.5%',
  },
  summaryLabel: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
    fontWeight: '600',
  },
  summaryValue: {
    color: theme.colors.primary,
    fontSize: 26,
    fontWeight: '800',
    marginTop: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    fontWeight: '800',
  },
});
