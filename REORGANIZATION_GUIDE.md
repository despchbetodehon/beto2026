# 📋 Guia de Reorganização e Refatoração

## 1. Consolidação de Componentes Financeiros

### 🎯 Objetivo
Refatorar `components/financas/` para componentes menores e reutilizáveis

### Estrutura Atual
```
src/components/financas/
├── index.tsx       # Componente principal (grande)
├── Lista.tsx       # Lista de transações
├── Grade.tsx       # Grade de visualização
├── Formulario.tsx  # Formulário de entrada
├── Sumario.tsx     # Resumo financeiro
└── SumarioItem.tsx # Item do resumo
```

### Refatoração Recomendada
```
src/components/financas/
├── index.tsx           # Orquestrador principal
├── components/
│   ├── FinanceList.tsx        # Lista com paginação
│   ├── FinanceGrid.tsx        # Grid view
│   ├── FinanceForm.tsx        # Formulário reusável
│   ├── SummaryCard.tsx        # Card de resumo
│   ├── TransactionItem.tsx    # Item de transação
│   └── Filters.tsx            # Filtros
├── hooks/
│   ├── useFinances.ts         # Hook de dados
│   └── useFinanceFilters.ts   # Hook de filtros
├── types.ts                   # Types locais
└── constants.ts               # Constantes
```

## 2. Reorganização de Estrutura de Empresas

### Problema Atual
```
components/enterprises/betodespa/
├── chamadosti/         (5 arquivos)
├── ocrreq/             (20+ arquivos)
│   └── requerimento/
│       └── digital/    (10+ arquivos)
├── procuracao/         (5 arquivos)
├── requerimento/       (5 arquivos)
│   └── digital/        (8 arquivos)
├── recurso/            (5 arquivos)
├── requerimentoanuencia/ (4 arquivos)
└── transferencia/      (4 arquivos)
```

### Solução Proposta
```
src/modules/                    # Novo!
├── chamadosti/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types.ts
│   └── index.ts
├── requerimento/
│   ├── components/
│   ├── digital/
│   ├── ocrreq/
│   ├── hooks/
│   ├── services/
│   └── types.ts
├── procuracao/
├── recurso/
├── transferencia/
└── anuencia/
```

## 3. Consolidação de Lógica de Negócio

### Camada Core
```
src/logic/core/
├── comum/
│   ├── Id.ts
│   └── Entity.ts         # Base class
├── usuario/
│   ├── Usuario.ts
│   ├── ServicosUsuario.ts
│   └── ServicosUsuarioProcessos.ts
├── financas/
│   ├── Transacao.ts
│   ├── TipoTransacao.ts
│   └── ServicosTransacao.ts
├── permissions/
│   └── PermissionManager.ts
└── index.ts              # Export consolidado
```

### Camada Services
```
src/logic/services/       # Novo!
├── UsuarioService.ts     # Serviços de usuário
├── FinancasService.ts    # Serviços financeiros
├── RequerimentoService.ts # Serviços de requerimento
├── ChamadosService.ts    # Serviços de chamados
├── ProcuracaoService.ts  # Serviços de procuração
└── ArquivoService.ts     # Serviços de arquivo
```

## 4. Reorganização de API Routes

### Antes
```
pages/api/
├── atpvs/
├── auth/
├── cache/
├── privacidade/
├── export/
└── migrar-contas.ts
```

### Depois
```
src/api/                  # Novo!
├── auth/
│   ├── login.ts
│   ├── logout.ts
│   └── refresh.ts
├── usuarios/
│   ├── profile.ts
│   └── update.ts
├── financas/
│   ├── transacoes.ts
│   └── relatorios.ts
├── requerimentos/
│   ├── criar.ts
│   ├── listar.ts
│   └── atualizar.ts
├── procuracoes/
├── chamados/
├── export/
│   ├── migrate-collection.ts
│   └── migrate-storage.ts
└── middleware.ts         # Middleware compartilhado
```

## 5. Padrão de Componentes Reutilizáveis

### Componente de Lista Genérico
```tsx
// src/components/common/DataList.tsx
interface DataListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  loading?: boolean;
  error?: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const DataList = <T extends { id: string }>(props: DataListProps<T>) => {
  // Implementação genérica
};
```

### Componente de Formulário Genérico
```tsx
// src/components/common/DynamicForm.tsx
interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  loading?: boolean;
}

export const DynamicForm = (props: DynamicFormProps) => {
  // Implementação genérica
};
```

## 6. Padrão de Hooks Customizados

### Hook de Dados Genérico
```typescript
// src/hooks/useFetchData.ts
export const useFetchData = <T,>(
  endpoint: string,
  options?: FetchOptions
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Implementação
  }, [endpoint]);

  return { data, loading, error };
};
```

### Hook de Formulário
```typescript
// src/hooks/useForm.ts
export const useForm = <T,>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>
) => {
  // Implementação
};
```

## 7. Padrão de Tipos TypeScript

### Estrutura de Types
```
src/types/
├── common.ts          # Types comuns
├── entities.ts        # Tipos de entidade (Usuario, Transacao, etc)
├── api.ts             # Tipos de API
├── forms.ts           # Tipos de formulário
└── index.ts           # Export consolidado
```

### Exemplo de Tipos
```typescript
// src/types/entities.ts
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  role: 'admin' | 'user' | 'colaborador';
  dataCriacao: Date;
}

export interface Transacao {
  id: string;
  usuarioId: string;
  valor: number;
  tipo: 'entrada' | 'saída';
  descricao: string;
  data: Date;
}

export interface Requerimento {
  id: string;
  usuarioId: string;
  status: 'pendente' | 'analisando' | 'concluído';
  dataCriacao: Date;
  dataAtualizacao: Date;
}
```

## 8. Padrão de Erro e Validação

### Error Handling
```typescript
// src/logic/core/Error.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(public field: string, message: string) {
    super('VALIDATION_ERROR', 400, message);
  }
}
```

### Validadores
```typescript
// src/logic/validators/index.ts
export const validators = {
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  cpf: (value: string) => validateCPF(value),
  telefone: (value: string) => /^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/.test(value),
};
```

## 9. Checklist de Refatoração

### Por Componente
- [ ] Quebrar em componentes menores (<300 linhas)
- [ ] Extrair lógica em hooks
- [ ] Criar types locais
- [ ] Adicionar testes unitários
- [ ] Documentar props com JSDoc

### Por Serviço
- [ ] Consolidar em services/
- [ ] Padronizar error handling
- [ ] Adicionar logging
- [ ] Criar testes de integração
- [ ] Documentar APIs

### Por Página
- [ ] Remover lógica complexa
- [ ] Usar lazy loading
- [ ] Implementar error boundary
- [ ] Adicionar loading states
- [ ] SEO metadata

## 10. Implementação Faseada

### Semana 1: Foundation
- [ ] Criar estrutura de types consolidada
- [ ] Criar componentes genéricos (DataList, DynamicForm)
- [ ] Criar hooks customizados base

### Semana 2: Services
- [ ] Migrar lógica para services/
- [ ] Consolidar API routes
- [ ] Criar error handling

### Semana 3: Componentes
- [ ] Refatorar financas
- [ ] Simplificar enterprises/
- [ ] Extrair componentes reutilizáveis

### Semana 4: Documentação e Testes
- [ ] Documentar padrões
- [ ] Adicionar Storybook
- [ ] Testes unitários críticos

---
**Atualizado**: 5 de dezembro de 2025  
**Próxima revisão**: Após conclusão Semana 1
