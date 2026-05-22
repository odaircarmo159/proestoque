import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { theme } from '@/src/constants/theme';
import {
  CATEGORIAS_MOCK,
  type CategoriaProdutoId,
  type Produto,
  type UnidadeProduto,
} from '@/src/data/mockData';
import {
  produtoSchema,
  type ProdutoFormData,
  type ProdutoFormValues,
} from '@/src/schemas/produtoSchema';

const UNIDADES: UnidadeProduto[] = ['un', 'cx', 'kg', 'pct', 'g'];

type ProdutoFormProps = {
  produto?: Produto;
  onSubmit: (data: ProdutoFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
};

const DEFAULT_VALUES: ProdutoFormValues = {
  nome: '',
  categoriaId: 'bebidas',
  quantidade: 0,
  quantidadeMinima: 0,
  preco: 0,
  unidade: 'un',
  observacao: '',
};

export function ProdutoForm({ produto, onSubmit, onDelete }: ProdutoFormProps) {
  const modoEdicao = Boolean(produto);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormValues, undefined, ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!produto) {
      reset(DEFAULT_VALUES);
      return;
    }

    reset({
      nome: produto.nome,
      categoriaId: produto.categoriaId,
      quantidade: produto.quantidade,
      quantidadeMinima: produto.quantidadeMinima,
      preco: produto.preco,
      unidade: produto.unidade,
      observacao: produto.observacao ?? '',
    });
  }, [produto, reset]);

  function handleDelete() {
    if (!onDelete) {
      return;
    }

    Alert.alert('Excluir produto', 'Deseja remover este produto do estoque?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => void onDelete(),
      },
    ]);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.scroll}>
      <Controller
        control={control}
        name="nome"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            autoCapitalize="sentences"
            error={errors.nome?.message}
            label="Nome do produto *"
            onBlur={onBlur}
            onChangeText={onChange}
            returnKeyType="next"
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="categoriaId"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Categoria *</Text>
            <View style={styles.chipsRow}>
              {CATEGORIAS_MOCK.map((categoria) => {
                const selected = categoria.id === value;

                return (
                  <Pressable
                    key={categoria.id}
                    onPress={() => onChange(categoria.id as CategoriaProdutoId)}
                    style={[styles.chip, selected && styles.chipSelected]}>
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {categoria.nome}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.categoriaId?.message ? (
              <Text style={styles.error}>{errors.categoriaId.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="quantidade"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            error={errors.quantidade?.message}
            keyboardType="number-pad"
            label="Quantidade em estoque *"
            onBlur={onBlur}
            onChangeText={onChange}
            returnKeyType="next"
            value={String(value ?? '')}
          />
        )}
      />

      <Controller
        control={control}
        name="quantidadeMinima"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            error={errors.quantidadeMinima?.message}
            keyboardType="number-pad"
            label="Quantidade mínima *"
            onBlur={onBlur}
            onChangeText={onChange}
            returnKeyType="next"
            value={String(value ?? '')}
          />
        )}
      />

      <Controller
        control={control}
        name="preco"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            error={errors.preco?.message}
            keyboardType="decimal-pad"
            label="Preço (R$) *"
            onBlur={onBlur}
            onChangeText={onChange}
            returnKeyType="next"
            value={String(value ?? '')}
          />
        )}
      />

      <Controller
        control={control}
        name="unidade"
        render={({ field: { onChange, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Unidade *</Text>
            <View style={styles.chipsRow}>
              {UNIDADES.map((unidade) => {
                const selected = unidade === value;

                return (
                  <Pressable
                    key={unidade}
                    onPress={() => onChange(unidade)}
                    style={[styles.chip, selected && styles.chipSelected]}>
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {unidade}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.unidade?.message ? (
              <Text style={styles.error}>{errors.unidade.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="observacao"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            error={errors.observacao?.message}
            label="Observação (opcional)"
            multiline
            onBlur={onBlur}
            onChangeText={onChange}
            returnKeyType="done"
            style={styles.textArea}
            value={value ?? ''}
          />
        )}
      />

      <Button
        fullWidth
        loading={isSubmitting}
        onPress={handleSubmit((data) => void onSubmit(data))}
        title={modoEdicao ? 'Salvar alterações' : 'Cadastrar produto'}
      />

      {modoEdicao && onDelete ? (
        <Button fullWidth onPress={handleDelete} title="Excluir produto" variant="danger" />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  container: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.small,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
  },
  field: {
    marginBottom: theme.spacing.xs,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
  scroll: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  textArea: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});
