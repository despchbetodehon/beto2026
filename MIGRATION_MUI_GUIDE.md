# 🔄 Guia de Migração: Material-UI → MUI v5

## 📊 Status Atual do Projeto

### Dependências Instaladas
- ✅ `@mui/material` - v5.13.8 (ATUAL)
- ✅ `@mui/icons-material` - v5.11.16 (ATUAL)
- ✅ `@mui/styles` - v5.13.7 (legacy)
- ⚠️ `@material-ui/*` - v4 (OBSOLETO - apenas 3 imports)

### Padrão de Estilo Atual
- 🔴 **makeStyles** de `@mui/styles` (deprecated)
- 🟢 **sx prop** - Recomendado (não está em uso)
- 🟢 **styled components** - Recomendado (não está em uso)

---

## 🎯 O Que Fazer

### Opção 1: Refatorar para `sx` prop (Recomendado)
```typescript
// ANTES (makeStyles)
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
  },
}));

function MyComponent() {
  const classes = useStyles();
  return <Box className={classes.root}>Conteúdo</Box>;
}

// DEPOIS (sx prop)
function MyComponent() {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: 'primary.main',
      }}
    >
      Conteúdo
    </Box>
  );
}
```

### Opção 2: Usar `styled` API (Para styles complexos)
```typescript
// ANTES
const useStyles = makeStyles((theme) => ({
  button: {
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
}));

// DEPOIS
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
  },
}));
```

### Opção 3: Usar Emotion/styled-components (Já instalado)
```typescript
// ANTES
const useStyles = makeStyles({
  root: { color: 'red' },
});

// DEPOIS
import styled from 'styled-components';

const Root = styled.div`
  color: red;
`;
```

---

## 📋 Plano de Migração

### Fase 1: Remover @material-ui (3 imports)
- [ ] Refatorar `src/components/common/DataList.tsx`
- [ ] Resultado: 0 imports de @material-ui

### Fase 2: Migrar makeStyles → sx (60+ arquivos)
**Prioridade Alta:**
- [ ] Componentes em `src/components/`
- [ ] Páginas em `src/pages/`

**Estratégia:**
1. Converter `makeStyles` para `sx` prop
2. Testar cada componente
3. Validar sem erros TypeScript
4. Commit

### Fase 3: Otimizar Estilos
- [ ] Consolidar duplicações
- [ ] Usar theme variables
- [ ] Performance de CSS

### Fase 4: Remover @mui/styles (Opcional)
- [ ] Após converter todos makeStyles
- [ ] Reduz bundle size em ~50KB

---

## 🚀 Começando: Refatorar DataList.tsx

### ANTES (Atual)
```typescript
import {
  List,
  ListItem,
  ListItemText,
  // ...
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: { width: '100%' },
  listItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:hover': { backgroundColor: theme.palette.action.hover },
  },
  // ... mais estilos
}));

export const DataList = (props) => {
  const classes = useStyles();
  
  return (
    <Box className={classes.root}>
      <List>
        <ListItem className={classes.listItem}>
          {/* ... */}
        </ListItem>
      </List>
    </Box>
  );
};
```

### DEPOIS (Refatorado)
```typescript
import {
  List,
  ListItem,
  ListItemText,
  Box,
  // ...
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const DataList = (props) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%' }}>
      <List>
        <ListItem
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {/* ... */}
        </ListItem>
      </List>
    </Box>
  );
};
```

---

## 📚 Mapeamento de Imports

### Core Components
```typescript
// ❌ ANTES
import { Box, Button } from '@material-ui/core';

// ✅ DEPOIS
import { Box, Button } from '@mui/material';
```

### Icons
```typescript
// ❌ ANTES
import { Delete } from '@material-ui/icons';

// ✅ DEPOIS
import { Delete } from '@mui/icons-material';
```

### Styles
```typescript
// ❌ ANTES (deprecated)
import { makeStyles } from '@material-ui/core/styles';

// ✅ DEPOIS (recomendado)
import { styled } from '@mui/material/styles';
// OU usar sx prop
```

### Theme
```typescript
// ❌ ANTES
import { useTheme } from '@material-ui/core/styles';

// ✅ DEPOIS
import { useTheme } from '@mui/material/styles';
```

---

## 🔧 Shortcuts de Migração

### sx Prop - Mapeamento de Propriedades

| CSS | sx | Exemplo |
|-----|----|----|
| padding | p | `p: 2` |
| margin | m | `m: 1` |
| width | w | `w: '100%'` |
| height | h | `h: 200` |
| background | bg | `bg: 'primary.main'` |
| color | color | `color: 'error.main'` |
| display | display | `display: 'flex'` |
| flex-direction | flexDirection | `flexDirection: 'column'` |
| gap | gap | `gap: 2` |

### Exemplo Completo
```typescript
// ANTES - makeStyles
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
}));

function Component() {
  const classes = useStyles();
  return <div className={classes.container}>Content</div>;
}

// DEPOIS - sx prop
function Component() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        gap: 1,
        backgroundColor: 'background.paper',
        borderRadius: 1,
      }}
    >
      Content
    </Box>
  );
}
```

---

## 📊 Benefícios da Migração

### Performance
- ✅ Reduz bundle size (~50KB com @mui/styles)
- ✅ Melhor tree-shaking
- ✅ CSS-in-JS mais eficiente

### Desenvolvedor
- ✅ Menos código (sx é mais conciso)
- ✅ Melhor type-checking
- ✅ Temas compartilhados automáticos

### Compatibilidade
- ✅ MUI v5 é estável
- ✅ Todos os componentes atualizados
- ✅ Material Design 3 support

---

## ⚠️ Cuidados Importantes

### 1. Theme Access
```typescript
// ❌ ERRADO
<Box sx={{ color: theme.palette.primary.main }}>

// ✅ CORRETO
<Box sx={{ color: 'primary.main' }}>

// ✅ COM THEME DIRETO
const theme = useTheme();
<Box sx={{ color: theme.palette.primary.main }}>
```

### 2. Responsivo
```typescript
// ❌ ANTES
const useStyles = makeStyles({
  box: {
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: '8px',
    },
  },
});

// ✅ DEPOIS
<Box
  sx={{
    width: '100%',
    p: { xs: 1, sm: 2 },
  }}
/>
```

### 3. Pseudo-selectors
```typescript
// ✅ CORRETO
<Button
  sx={{
    '&:hover': { backgroundColor: 'primary.light' },
    '&:disabled': { opacity: 0.5 },
    '&:nth-child(2)': { color: 'red' },
  }}
/>
```

---

## 🛠️ Comandos de Migração

### Encontrar todos makeStyles
```bash
grep -r "makeStyles" src --include="*.tsx" --include="*.ts"
```

### Encontrar imports de @material-ui
```bash
grep -r "@material-ui" src --include="*.tsx" --include="*.ts"
```

### Encontrar imports de @mui/styles
```bash
grep -r "@mui/styles" src --include="*.tsx" --include="*.ts"
```

---

## 📝 Checklist de Migração

### Por Componente
- [ ] Remover `import { makeStyles }`
- [ ] Remover função `useStyles()`
- [ ] Remover `const classes = useStyles()`
- [ ] Converter estilos para `sx` prop
- [ ] Atualizar imports para `@mui/material`
- [ ] Testar componente
- [ ] Validar TypeScript

### Validação Final
- [ ] Nenhum import de @material-ui
- [ ] Nenhum import de @mui/styles
- [ ] npm run type-check OK
- [ ] npm run build OK
- [ ] Sem warnings de deprecation

---

## 🎯 Timeline Sugerida

### Dia 1
- Refatorar DataList.tsx (exemplo)
- Refatorar 5 componentes simples

### Dia 2-3
- Refatorar componentes medium
- Refatorar páginas

### Dia 4
- Validar tudo
- Remover @mui/styles
- Deploy

---

## 📚 Referências

- [MUI v5 Documentation](https://mui.com)
- [sx Prop Guide](https://mui.com/system/getting-started/the-sx-prop)
- [Migration Guide](https://mui.com/material-ui/migration/migration-v4)
- [Theming Guide](https://mui.com/material-ui/customization/theming)

---

**Data**: 5 de dezembro de 2025  
**Status**: ✅ Pronto para Migração  
**Impacto**: Alto (melhoria de performance e DX)  
**Tempo Estimado**: 2-3 dias para equipe de 2 pessoas
