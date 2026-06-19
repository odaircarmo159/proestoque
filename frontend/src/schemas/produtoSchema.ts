import { z } from 'zod';

import { UNIDADES_PRODUTO } from '@/src/types/produto';

function parseNumber(value: unknown) {
  if (value === '' || value === null || value === undefined) {
    return Number.NaN;
  }

  return Number(value);
}

const inteiroNaoNegativo = (requiredMessage: string, invalidMessage: string) =>
  z.preprocess(
    parseNumber,
    z
      .number()
      .refine((value) => Number.isFinite(value), requiredMessage)
      .int(invalidMessage)
      .min(0, invalidMessage === 'Quantidade deve ser um número inteiro'
        ? 'Quantidade não pode ser negativa'
        : 'Quantidade mínima não pode ser negativa')
  );

const decimalNaoNegativo = (requiredMessage: string) =>
  z.preprocess(
    parseNumber,
    z
      .number()
      .refine((value) => Number.isFinite(value), requiredMessage)
      .min(0, 'Preço não pode ser negativo')
  );

export const produtoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(80, 'Nome muito longo'),
  categoriaId: z.string().trim().min(1, 'Selecione uma categoria'),
  quantidade: inteiroNaoNegativo('Informe a quantidade', 'Quantidade deve ser um número inteiro'),
  quantidadeMinima: inteiroNaoNegativo(
    'Informe a quantidade mínima',
    'Quantidade mínima deve ser um número inteiro'
  ),
  preco: decimalNaoNegativo('Informe o preço'),
  unidade: z.enum(UNIDADES_PRODUTO, {
    message: 'Selecione a unidade',
  }),
  observacao: z
    .string()
    .trim()
    .max(180, 'Observação muito longa')
    .optional()
    .or(z.literal('')),
});

export type ProdutoFormValues = z.input<typeof produtoSchema>;
export type ProdutoFormData = z.infer<typeof produtoSchema>;
