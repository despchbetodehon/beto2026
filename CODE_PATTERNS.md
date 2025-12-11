# 📐 Padrões de Código - Despachante Beto

## 1. Padrão de Componentes React

### ✅ Componente Bem Estruturado

```typescript
// src/components/MyComponent.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Box, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFetchData } from '@/hooks/useDataFetching';
import { MyComponentProps } from './types';

// ============================================================================
// STYLES
// ============================================================================
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  card: {
    marginBottom: theme.spacing(2),
  },
}));

// ============================================================================
// COMPONENT
// ============================================================================
/**
 * Descrição do componente
 *
 * @example
 * <MyComponent id="123" onSave={() => {}} />
 */
export const MyComponent: React.FC<MyComponentProps> = ({
  id,
  onSave,
  onError,
}) => {
  const classes = useStyles();
  const [state, setState] = useState('initial');

  // Dados
  const { data, loading, error } = useFetchData(`/api/endpoint/${id}`);

  // Callbacks
  const handleAction = useCallback(async () => {
    try {
      // Lógica
    } catch (err) {
      onError?.(err as Error);
    }
  }, [onError]);

  // Render
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <Box className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography>Conteúdo</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(MyComponent);
```

### Diretrizes de Componentes

1. **Tamanho**: Máximo 300 linhas
2. **Props**: Máximo 5 diretos (usar context/compound components se mais)
3. **Documentação**: JSDoc para todos componentes públicos
4. **Memoização**: React.memo para componentes que renderizam frequentemente
5. **Exports**: Named exports + default export

---

## 2. Padrão de Hooks Customizados

```typescript
// src/hooks/useMyHook.ts

/**
 * Hook customizado para [descrição]
 *
 * @param param1 - Descrição do parâmetro
 * @returns Objeto com estado e métodos
 *
 * @example
 * const { data, loading } = useMyHook(id);
 */
export const useMyHook = (param1: string) => {
  const [state, setState] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lógica do hook
  }, [param1]);

  return { state, error, loading };
};
```

### Diretrizes de Hooks

1. **Nomes**: Começar com `use`
2. **Responsabilidade**: Uma responsabilidade por hook
3. **Testabilidade**: Deve ser testável em isolamento
4. **Performance**: Usar useCallback e useMemo apropriadamente
5. **Documentação**: JSDoc obrigatório

---

## 3. Padrão de Serviços

```typescript
// src/logic/services/MyService.ts

/**
 * Serviço para [descrição]
 */
export class MyService extends BaseService<MyEntity> {
  constructor() {
    super('/api/endpoint');
  }

  /**
   * Método customizado
   * @param param - Parâmetro
   * @returns Promise com resultado
   */
  async customMethod(param: string): Promise<MyEntity[]> {
    try {
      const response = await fetch(`${this.endpoint}/custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ param }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: ApiResponse<MyEntity[]> = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Erro em customMethod:', error);
      throw error;
    }
  }
}

// Export singleton
export const myService = new MyService();
```

### Diretrizes de Serviços

1. **Herança**: Estender BaseService quando possível
2. **Erro Handling**: Try-catch em todas operações async
3. **Logging**: Console.error para erros, console.log para info
4. **Tipos**: Sempre tipado com TypeScript
5. **Métodos**: Métodos públicos documentados com JSDoc

---

## 4. Padrão de Tipos TypeScript

```typescript
// src/types/myTypes.ts

/**
 * Tipo para [descrição]
 *
 * @property id - Identificador único
 * @property name - Nome
 */
export interface MyEntity extends BaseEntity {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

/**
 * Tipo para Props de componente
 */
export interface MyComponentProps {
  id?: string;
  onSave?: (data: MyEntity) => Promise<void>;
  onError?: (error: Error) => void;
}

/**
 * Type para forma filtrada
 */
export type MyEntityFilter = Partial<Pick<MyEntity, 'role' | 'name'>>;

// Discriminated union para melhor type narrowing
export type MyAction =
  | { type: 'CREATE'; payload: MyEntity }
  | { type: 'UPDATE'; payload: Partial<MyEntity> }
  | { type: 'DELETE'; payload: string };
```

### Diretrizes de Tipos

1. **Interfaces**: Para objetos com estrutura conhecida
2. **Types**: Para unions, tuples, mapped types
3. **Generics**: Usar quando apropriado
4. **Documentação**: JSDoc para tipos públicos
5. **Nomes**: Descrever claramente o propósito

---

## 5. Padrão de API Routes

```typescript
// src/pages/api/[resource]/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/entities';

/**
 * API Route handler
 *
 * @method GET - Buscar um recurso
 * @method PUT - Atualizar um recurso
 * @method DELETE - Deletar um recurso
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(res, id as string);
      case 'PUT':
        return handlePut(res, id as string, req.body);
      case 'DELETE':
        return handleDelete(res, id as string);
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed',
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

async function handleGet(res: NextApiResponse, id: string) {
  // Implementação
  return res.status(200).json({ success: true, data: {} });
}

async function handlePut(
  res: NextApiResponse,
  id: string,
  body: any
) {
  // Implementação
  return res.status(200).json({ success: true, data: {} });
}

async function handleDelete(res: NextApiResponse, id: string) {
  // Implementação
  return res.status(204).end();
}
```

### Diretrizes de API

1. **Responses**: Sempre usar ApiResponse<T>
2. **Status Codes**: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Error
3. **Error Handling**: Try-catch envolvendo handler completo
4. **Validação**: Validar input no início
5. **Logging**: Logar erros importantes

---

## 6. Padrão de Formulários

```typescript
// Usando useForm hook

const MyFormComponent = () => {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useForm({
      initialValues: { name: '', email: '' },
      onSubmit: async (values) => {
        await myService.create(values);
      },
    });

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && !!errors.name}
        helperText={touched.name && errors.name}
      />
      <button type="submit">Salvar</button>
    </form>
  );
};
```

### Diretrizes de Formulários

1. **Validação**: Usando Yup ou Zod
2. **Feedback**: Mostrar erros apenas após touch
3. **Loading**: Desabilitar submit enquanto loading
4. **Reset**: Limpar após sucesso
5. **States**: Separar loading, error, success

---

## 7. Padrão de Estado Global (Context)

```typescript
// src/data/contexts/MyContext.tsx

type MyContextType = {
  state: MyState;
  actions: MyActions;
};

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      action1: () => dispatch({ type: 'ACTION_1' }),
      action2: (payload: any) =>
        dispatch({ type: 'ACTION_2', payload }),
    }),
    []
  );

  return (
    <MyContext.Provider value={{ state, actions }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext deve ser usado dentro de MyProvider');
  }
  return context;
};
```

### Diretrizes de Context

1. **Escopo**: Context para estado verdadeiramente global
2. **Performance**: Usar useMemo para actions
3. **Tipo**: Context sempre tipado
4. **Splits**: Separar por domínio (auth, ui, data)
5. **Custom Hooks**: Criar hook para usar context

---

## 8. Tratamento de Erros

```typescript
// src/logic/core/Error.ts

export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
    message: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(
    public readonly field: string,
    message: string
  ) {
    super('VALIDATION_ERROR', 400, message, { field });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super('NOT_FOUND', 404, `${resource} com id ${id} não encontrado`, {
      resource,
      id,
    });
  }
}

// Usar em serviços
try {
  const item = await fetch(`/api/items/${id}`);
  if (!item) {
    throw new NotFoundError('Item', id);
  }
} catch (error) {
  if (error instanceof AppError) {
    console.error(`[${error.code}] ${error.message}`);
  }
  throw error;
}
```

---

## 9. Testing Patterns

```typescript
// src/__tests__/hooks/useMyHook.test.ts

import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '@/hooks/useMyHook';

describe('useMyHook', () => {
  it('deve retornar dados iniciais', () => {
    const { result } = renderHook(() => useMyHook('id-1'));

    expect(result.current.state).toBeDefined();
    expect(result.current.loading).toBe(true);
  });

  it('deve atualizar estado após carregamento', async () => {
    const { result } = renderHook(() => useMyHook('id-1'));

    await act(async () => {
      // Aguardar carregamento
    });

    expect(result.current.loading).toBe(false);
  });
});
```

---

## 10. Import Organization

```typescript
// Ordem recomendada de imports

// 1. React e bibliotecas externas
import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// 2. Custom hooks
import { useFetchData } from '@/hooks/useDataFetching';
import { useMyContext } from '@/data/contexts/MyContext';

// 3. Types
import { MyEntity, MyComponentProps } from '@/types/entities';

// 4. Components
import { DataList } from '@/components/common/DataList';
import { MySubComponent } from './MySubComponent';

// 5. Services
import { myService } from '@/logic/services/MyService';

// 6. Utils
import { formatDate } from '@/utils/formatters';

// 7. Styles
import styles from './MyComponent.module.css';
```

---

## ✅ Checklist antes de Fazer Commit

- [ ] TypeScript compila sem erros
- [ ] Linter passa (eslint)
- [ ] Sem console.log em código de produção
- [ ] Componentes < 300 linhas
- [ ] Funções documentadas com JSDoc
- [ ] Imports organizados
- [ ] Sem imports circulares
- [ ] Tipos bem definidos
- [ ] Tratamento de erro implementado
- [ ] Testes passando (se houver)

---

**Última atualização**: 5 de dezembro de 2025
