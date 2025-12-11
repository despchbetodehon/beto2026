# 🏆 Best Practices da Arquitetura

## 1. Componentes

### ✅ DO: Componentes Pequenos e Focados
```tsx
// ✅ Bom: Componente simples e reutilizável
export const UserCard = memo<{ user: User }>(({ user }) => (
  <Card>
    <CardContent>
      <Typography>{user.name}</Typography>
      <Typography color="textSecondary">{user.email}</Typography>
    </CardContent>
  </Card>
));
```

### ❌ DON'T: Componentes Gigantes com Lógica Complexa
```tsx
// ❌ Ruim: Tudo em um arquivo
export default function UsersPage() {
  // 1500 linhas de código aqui...
  return <div>Tudo junto</div>;
}
```

### ✅ DO: Usar memo() Estrategicamente
```tsx
// ✅ Usa memo só quando necessário
const CostlyComponent = memo(({ data }: Props) => {
  // Cálculos pesados aqui
  return <div>{data}</div>;
}, (prevProps, nextProps) => prevProps.data === nextProps.data);
```

## 2. Hooks

### ✅ DO: Extrair Lógica em Hooks
```tsx
// ✅ Bom: Lógica reutilizável
const useUserData = (userId: string) => {
  return useAsync(() => ApiService.get(`/users/${userId}`));
};

// Em qualquer componente:
const { data, status } = useUserData(userId);
```

### ✅ DO: Usar Hooks Customizados para State Complexo
```tsx
// ✅ Bom: Estado separado em hook
const useFilters = () => {
  const [filters, setFilters] = useState({});
  const debouncedFilters = useDebounce(filters, 300);
  return { filters, setFilters, debouncedFilters };
};
```

## 3. Services

### ✅ DO: Centralizar Chamadas de API
```tsx
// ✅ Bom: Service centralizado
class UserService {
  static async getUsers() {
    return ApiService.get('/users');
  }
}

// Usar em componentes:
const users = await UserService.getUsers();
```

### ✅ DO: Adicionar Tratamento de Erro
```tsx
// ✅ Bom: Erro tratado
try {
  const data = await ApiService.get('/data');
  notificationService.success('Dados carregados');
} catch (error) {
  notificationService.error('Erro ao carregar dados');
}
```

## 4. State Management

### ✅ DO: Usar Hooks para State Local
```tsx
// ✅ Bom: State local é mais simples
const [isOpen, setIsOpen] = useState(false);
```

### ✅ DO: Usar Context para State Compartilhado
```tsx
// ✅ Bom: Estado global quando necessário
export const UserContext = createContext<User | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}
```

### 🚀 FUTURO: Considerar Zustand/Jotai
```tsx
// Quando a complexidade crescer:
import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## 5. Performance

### ✅ DO: Lazy Load de Componentes
```tsx
// ✅ Bom: Carrega sob demanda
const HeavyModal = dynamic(() => import('./HeavyModal'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### ✅ DO: Memoizar Seletores de Redux/Context
```tsx
// ✅ Bom: Não re-renderiza se user não mudou
const user = useMemo(() => userContext?.user, [userContext?.user]);
```

### ✅ DO: Usar useCallback para Handlers
```tsx
// ✅ Bom: Callback não muda a menos que deps mudem
const handleClick = useCallback(() => {
  // ...
}, [someDependency]);
```

## 6. Tipagem TypeScript

### ✅ DO: Tipos Explícitos
```tsx
// ✅ Bom: Tipos claros
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

function UserCard(props: { user: User }) {
  // TypeScript ajuda aqui
}
```

### ✅ DO: Usar Utility Types
```tsx
// ✅ Bom: Reutilizar tipos
type UserWithoutId = Omit<User, 'id'>;
type ReadonlyUser = Readonly<User>;
type UserDTO = Pick<User, 'id' | 'name'>;
```

## 7. Imports

### ✅ DO: Importar apenas o necessário
```tsx
// ✅ Bom: Import específico
import { Button, TextField } from '@mui/material';

// ❌ Ruim: Import de tudo
import * as MUI from '@mui/material';
```

### ✅ DO: Usar Path Aliases
```tsx
// ✅ Bom: Limpo e fácil refatorar (veja tsconfig.json)
import { useAsync } from '@/hooks';
import { ApiService } from '@/services';
import { LoadingSpinner } from '@/components/common';

// ❌ Ruim: Caminhos relativos bagunçados
import { useAsync } from '../../../hooks/useAsync';
```

## 8. Testes

### ✅ DO: Testar Hooks
```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useAsync } from '@/hooks';

test('useAsync carrega dados', async () => {
  const { result } = renderHook(() => 
    useAsync(() => Promise.resolve({ data: 'test' }))
  );

  await act(async () => {
    await result.current.execute();
  });

  expect(result.current.data).toEqual({ data: 'test' });
});
```

### ✅ DO: Testar Services
```tsx
import { ApiService } from '@/services';

test('ApiService cria cache', async () => {
  const data1 = await ApiService.get('/test', { cache: true });
  const data2 = await ApiService.get('/test', { cache: true });
  
  expect(data1).toEqual(data2); // Do cache
});
```

## 9. Conventions

### ✅ Naming
- Componentes: `PascalCase` (UserCard.tsx)
- Hooks: `camelCase` com prefixo `use` (useUserData.ts)
- Services: `PascalCase` com sufixo `Service` (UserService.ts)
- Utils: `camelCase` (formatDate.ts)
- Constantes: `UPPER_CASE` (API_URL)

### ✅ Estrutura de Arquivos
```
src/
├── components/
│   ├── [feature]/
│   │   ├── ComponentA.tsx
│   │   ├── ComponentB.tsx
│   │   └── index.ts
│   └── common/
│       └── [componentes reutilizáveis]
├── hooks/
│   ├── useHook1.ts
│   └── index.ts
├── services/
│   ├── service1.service.ts
│   └── index.ts
└── constants/
    └── config.ts
```

## 10. Documentação

### ✅ JSDoc Comments
```tsx
/**
 * Carrega dados do usuário com cache
 * @param userId - ID do usuário
 * @returns Promise com dados do usuário
 * @example
 * const data = await getUserData('123');
 */
export async function getUserData(userId: string): Promise<User> {
  return ApiService.get(`/users/${userId}`, { cache: true });
}
```

## Checklist para Code Review

- [ ] Componente tem menos de 300 linhas?
- [ ] Lógica complexa foi extraída em hooks?
- [ ] Services abstraem detalhes de implementação?
- [ ] Componentes estão memoizados se necessário?
- [ ] Não há prop drilling profundo?
- [ ] Constantes estão centralizadas?
- [ ] Tipos TypeScript são explícitos?
- [ ] Tratamento de erro está presente?
- [ ] Componente é testável?
- [ ] Documentação está clara?

## Links Úteis

- [React Best Practices](https://react.dev/learn/keeping-components-pure)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/performance-optimization)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Best Practices](https://mui.com/material-ui/guides/typescript/)
