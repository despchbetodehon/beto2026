# 💡 Dicas Práticas e Troubleshooting

## 🛠️ Comandos Úteis

### Validação do Projeto
```bash
# Verificar erros TypeScript
npm run type-check

# Executar linter
npm run lint

# Build de produção
npm run build

# Desenvolvimento
npm run dev

# Testar estrutura (se houver)
npm test
```

### Verificação de Arquivos
```bash
# Contar arquivos TypeScript
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | wc -l

# Encontrar arquivos grandes (>500 linhas)
find src -name "*.tsx" -o -name "*.ts" | while read f; do 
  lines=$(wc -l < "$f")
  if [ $lines -gt 500 ]; then
    echo "$lines - $f"
  fi
done

# Encontrar imports circulares (se tiver madge)
madge --circular src/

# Verificar duração de build
time npm run build
```

---

## 📁 Como Organizar um Novo Módulo

### Estrutura Padrão
```typescript
// src/modules/meuModulo/index.ts
export * from './types';
export * from './services';
export * from './hooks';
export { MeuModuloContainer as default } from './MeuModuloContainer';
```

### Passo a Passo
```bash
# 1. Criar diretório
mkdir -p src/modules/meuModulo/components
mkdir -p src/modules/meuModulo/hooks
mkdir -p src/modules/meuModulo/services

# 2. Criar types.ts
# (copiar estrutura de REFACTORING_EXAMPLE.md)

# 3. Criar hooks
# (usar padrões de CODE_PATTERNS.md)

# 4. Criar services
# (estender BaseService)

# 5. Criar componentes
# (quebrar em componentes < 300 linhas)

# 6. Criar container (orquestrador)
# (componente principal que une tudo)

# 7. Criar index.ts
# (exportar tudo)
```

---

## 🐛 Troubleshooting Comum

### Problema: "Cannot find module '@/...'"
**Causa**: Path alias não configurado  
**Solução**: 
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Problema: Componente muito grande
**Causa**: Componente > 500 linhas  
**Solução**: Ver REFACTORING_EXAMPLE.md para quebrar em partes

### Problema: Muitos imports no arquivo
**Causa**: Componente com muitas responsabilidades  
**Solução**: Extrair para múltiplos componentes menores

### Problema: Hook com muitos states
**Causa**: Lógica complexa misturada  
**Solução**: Quebrar em múltiplos hooks menores

### Problema: Circular dependency
**Causa**: Importação cíclica entre arquivos  
**Solução**: Reorganizar código ou extrair shared utils

### Problema: Performance baixa
**Causa**: Re-renders desnecessários  
**Solução**: 
- Usar React.memo para componentes
- Usar useCallback para funções
- Usar useMemo para valores

### Problema: TypeScript error com any
**Causa**: Type não foi definido  
**Solução**: Sempre tipificar - nunca use 'any'

---

## ✅ Checklist Antes de Commit

```
Código
- [ ] Sem erros TypeScript (npm run type-check)
- [ ] Sem erros de linter (npm run lint)
- [ ] Sem console.log em produção
- [ ] Sem TODO ou FIXME sem issue

Estrutura
- [ ] Arquivo < 500 linhas
- [ ] Função < 50 linhas
- [ ] Component < 300 linhas
- [ ] Props <= 5 (ou usar context)

Documentação
- [ ] JSDoc em funções públicas
- [ ] Tipos documentados
- [ ] Exemplos de uso (se complexo)

Testes
- [ ] Componente renderiza (se houver teste)
- [ ] Hook funciona (se houver teste)
- [ ] Service retorna dados (se houver teste)

Performance
- [ ] React.memo se renderiza frequentemente
- [ ] useCallback em callbacks passados
- [ ] useMemo em cálculos pesados
- [ ] Lazy load em componentes grandes
```

---

## 📝 Exemplos Práticos

### ✅ Componente Bem Estruturado
```typescript
interface Props {
  id: string;
  onSave: (data: MyData) => Promise<void>;
}

export const MyComponent: React.FC<Props> = ({ id, onSave }) => {
  const { data, loading } = useFetchData(`/api/${id}`);
  const [state, setState] = useState('initial');

  const handleSave = useCallback(async () => {
    await onSave(data);
  }, [data, onSave]);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography>{data.name}</Typography>
      <Button onClick={handleSave}>Salvar</Button>
    </Box>
  );
};

export default React.memo(MyComponent);
```

### ❌ Componente Mal Estruturado
```typescript
export const BadComponent = (props) => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 2000+ linhas de lógica misturada...
  
  return <div>Muito complicado</div>;
};
```

### ✅ Hook Bem Estruturado
```typescript
export const useMyHook = (id: string) => {
  const [data, setData] = useState<MyData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetch(`/api/${id}`);
        setData(await result.json());
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, error, loading };
};
```

### ✅ Service Bem Estruturado
```typescript
export class UserService extends BaseService<User> {
  constructor() {
    super('/api/users');
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.endpoint}/email/${email}`);
      const data: ApiResponse<User> = await response.json();
      return data.data || null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }
}
```

---

## 🎯 Dicas de Performance

### Memoization
```typescript
// Usar React.memo para componentes que renderizam frequentemente
export const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// Usar useCallback para funções passadas como props
const handleClick = useCallback(() => {
  // ...
}, [dependency]);

// Usar useMemo para valores custosos
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);
```

### Code Splitting
```typescript
// Lazy load componentes grandes
const HeavyComponent = lazy(() => import('./HeavyComponent'));

export const MyPage = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <HeavyComponent />
    </Suspense>
  );
};
```

### Image Optimization
```typescript
// Usar Next.js Image component
import Image from 'next/image';

export const MyImage = () => {
  return (
    <Image
      src="/my-image.jpg"
      alt="Descrição"
      width={800}
      height={600}
      priority // para imagens acima da fold
    />
  );
};
```

---

## 🔍 Debug Tips

### Logar Estado
```typescript
// Usar useEffect para logar mudanças
useEffect(() => {
  console.log('Estado mudou:', { data, loading, error });
}, [data, loading, error]);
```

### Validar Props
```typescript
// Adicionar PropTypes em desenvolvimento
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  id: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};
```

### React DevTools
```
1. Instalar extensão do React DevTools
2. Usar Profiler para medir performance
3. Usar Props inspector para ver valores
4. Usar Hooks inspector para ver estado
```

### Network Debugging
```
1. Abrir DevTools (F12)
2. Ir para Network tab
3. Filtrar por api calls
4. Validar status codes
5. Validar payloads
```

---

## 📚 Referências Rápidas

### React Docs
```
https://react.dev
https://react.dev/reference/react
https://react.dev/learn
```

### TypeScript
```
https://www.typescriptlang.org/docs
https://www.typescriptlang.org/play
```

### Material-UI
```
https://mui.com
https://mui.com/api
https://mui.com/material/getting-started
```

### Next.js
```
https://nextjs.org/docs
https://nextjs.org/learn
```

### Firebase
```
https://firebase.google.com/docs
https://firebase.google.com/docs/firestore
https://firebase.google.com/docs/auth
```

---

## 🚀 Checklist de Deploy

Antes de fazer deploy em produção:

```
- [ ] npm run type-check OK
- [ ] npm run lint OK
- [ ] npm run build OK
- [ ] Sem console.log em código
- [ ] Variáveis de ambiente configuradas
- [ ] Testes passando
- [ ] Performance OK (Lighthouse)
- [ ] SEO meta tags
- [ ] Analytics configurado
- [ ] Error tracking configurado
- [ ] Backup do banco de dados
- [ ] Plano de rollback preparado
```

---

## 💬 Comunicação com Equipe

### Ao Abrir Pull Request
```markdown
## Descrição
Breve descrição do que foi feito

## Tipo de Mudança
- [ ] Bugfix
- [ ] Feature
- [ ] Refactor
- [ ] Documentação

## Checklist
- [ ] Código segue patterns
- [ ] TypeScript OK
- [ ] Sem console.log
- [ ] Testado localmente
- [ ] Documentado

## Screenshots (se houver UI)
[Adicionar screenshots]
```

### Ao Relatar Bug
```markdown
## Descrição
Descrição clara do bug

## Passos para Reproduzir
1. Ir para...
2. Clicar em...
3. Ver erro...

## Comportamento Esperado
O que deveria acontecer

## Comportamento Atual
O que está acontecendo

## Ambiente
- Browser: Chrome 120
- OS: Windows 11
- Node: 18.17

## Logs
[Adicionar logs se houver]
```

---

## 🎓 Recursos de Aprendizado

### Videos
- Next.js Tutorial (YouTube)
- React Hooks Deep Dive (YouTube)
- TypeScript for Beginners (YouTube)

### Artigos
- React Best Practices
- TypeScript Advanced Types
- Performance Optimization Guide

### Cursos
- Next.js Course (Vercel)
- React Patterns Course
- TypeScript Course

---

## 🎯 Meta de Aprendizado

### Semana 1
- [ ] Ler toda documentação
- [ ] Entender padrões
- [ ] Fazer primeiro refactor

### Semana 2
- [ ] Criar novo módulo
- [ ] Aplicar padrões
- [ ] Code review

### Semana 3
- [ ] Refatorar componente grande
- [ ] Otimizar performance
- [ ] Escrever testes

### Semana 4
- [ ] Contribuir com documentação
- [ ] Mentorar novos devs
- [ ] Deploy em produção

---

**Dicas práticas compiladas**: 5 de dezembro de 2025  
**Status**: ✅ Pronto para Uso  
**Atualizado**: Frequentemente conforme necessário

Sucesso na reorganização! 🚀
