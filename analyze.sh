#!/bin/bash

# Script de análise de performance e bundle size
# Use: chmod +x analyze.sh && ./analyze.sh

echo "🚀 Iniciando análise de performance..."
echo ""

# Análise de bundle size
echo "📦 Analisando tamanho de bundle..."
npm run build

if [ -f ".next/static/chunks/main.js" ]; then
  BUNDLE_SIZE=$(du -h .next | tail -1 | cut -f1)
  echo "✅ Tamanho do build: $BUNDLE_SIZE"
else
  echo "⚠️  Build não encontrado"
fi

echo ""
echo "🔍 Arquivos maiores em src/pages (top 10):"
find src/pages -name "*.tsx" -type f -exec wc -l {} + | sort -rn | head -10

echo ""
echo "🔍 Arquivos maiores em src/components (top 10):"
find src/components -name "*.tsx" -type f -exec wc -l {} + | sort -rn | head -10

echo ""
echo "📊 Estatísticas de tipos TypeScript:"
echo "Total de arquivos TS/TSX:"
find src -name "*.ts" -o -name "*.tsx" | wc -l

echo ""
echo "✨ Executando type-check..."
npm run type-check

echo ""
echo "🎉 Análise concluída!"
echo ""
echo "💡 Dicas de otimização:"
echo "  1. Decomponha arquivos > 500 linhas"
echo "  2. Use dynamic() para lazy loading"
echo "  3. Aplique memo() em componentes com props complexas"
echo "  4. Use usePagination para listas > 100 itens"
echo "  5. Substitua async/await boilerplate por useAsync hook"
