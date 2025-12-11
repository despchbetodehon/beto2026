# 🔧 Solução para Conflito de Dependências

## 🔴 Problema

```
jspdf-autotable@3.8.4 requer jspdf@^2.5.1
Mas projeto tem jspdf@^3.0.3
```

## ✅ Solução (Escolha uma)

### Opção 1: Usar `--legacy-peer-deps` (Rápido ⚡)
```bash
npm install --legacy-peer-deps
```
✅ Rápido  
⚠️ Pode gerar incompatibilidades no runtime

### Opção 2: Downgrade jspdf para v2 (Recomendado ✅)
```bash
npm install jspdf@^2.5.1 jspdf-autotable@^3.8.4
```
Editar `package.json`:
```json
"jspdf": "^2.5.1",  // Mudar de ^3.0.3
"jspdf-autotable": "^3.8.4"
```
✅ Compatible  
✅ Sem warnings

### Opção 3: Upgrade jspdf-autotable (Futuro)
Aguardar versão que suporte jspdf@3  
(Não está disponível ainda)

---

## 🎯 Recomendação: Opção 2

**Por quê?**
- Melhor compatibilidade
- Sem conflitos
- Código será mais estável

**Passos:**
1. Editar `package.json`
2. Executar `npm install`
3. Pronto!

---

## 📋 O que fazer agora

Execute:
```bash
npm install --legacy-peer-deps
```

Ou edite manualmente o package.json e depois:
```bash
rm -rf node_modules package-lock.json
npm install
```
