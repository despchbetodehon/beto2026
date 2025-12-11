#!/usr/bin/env node

/**
 * 🚀 QUICK START - Guia Rápido de Uso
 * 
 * Copie e cole essas snippets para começar a usar a nova arquitetura
 */

// ============================================
// 1️⃣ CARREGAR DADOS (useAsync)
// ============================================

import { useAsync } from '@/hooks';
import { ApiService } from '@/services';
import { LoadingSpinner, ErrorState } from '@/components/common';

function MeuComponente() {
  const { data, status, execute } = useAsync(
    () => ApiService.get('/api/dados'),
    true // true = carregar imediatamente
  );

  if (status === 'pending') return <LoadingSpinner message="Carregando..." />;
  if (status === 'error') return <ErrorState message="Erro ao carregar" onRetry={execute} />;
  
  return <div>{JSON.stringify(data)}</div>;
}

// ============================================
// 2️⃣ BUSCA COM DEBOUNCE (useDebounce)
// ============================================

import { useDebounce } from '@/hooks';
import { useState } from 'react';

function SearchUsers() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: results } = useAsync(
    () => ApiService.get(`/api/usuarios?q=${debouncedSearch}`),
    true,
    [debouncedSearch]
  );

  return (
    <>
      <input 
        value={searchInput} 
        onChange={(e) => setSearchInput(e.target.value)} 
        placeholder="Buscar..."
      />
      <ul>
        {results?.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    </>
  );
}

// ============================================
// 3️⃣ TABELA COM PAGINAÇÃO (usePagination)
// ============================================

import { usePagination } from '@/hooks';
import { DataTable } from '@/components/tables';

function UserTable() {
  const users = [/* ... seus dados ... */];
  const { data: paginatedUsers, currentPage, goToPage } = usePagination(users, 10);

  return (
    <>
      <DataTable 
        data={paginatedUsers} 
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nome' },
          { key: 'email', label: 'Email' },
        ]}
        rowKey="id"
      />
      <button onClick={() => goToPage(currentPage - 1)}>Anterior</button>
      <button onClick={() => goToPage(currentPage + 1)}>Próximo</button>
    </>
  );
}

// ============================================
// 4️⃣ PERSISTIR DADOS LOCAIS (useLocalStorage)
// ============================================

import { useLocalStorage } from '@/hooks';

function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Claro</option>
      <option value="dark">Escuro</option>
    </select>
  );
  // Tema persiste após refresh! 🎉
}

// ============================================
// 5️⃣ REQUISIÇÕES HTTP CENTALIZADAS (ApiService)
// ============================================

import { ApiService } from '@/services';

// GET
const users = await ApiService.get('/usuarios');

// POST
const newUser = await ApiService.post('/usuarios', {
  name: 'João',
  email: 'joao@example.com'
});

// PUT
await ApiService.put('/usuarios/123', { name: 'João Silva' });

// DELETE
await ApiService.delete('/usuarios/123');

// Com cache (evita requisição duplicada)
const cached = await ApiService.get('/dados-criticos', { cache: true });

// ============================================
// 6️⃣ OPERAÇÕES FIRESTORE (FirestoreService)
// ============================================

import { FirestoreService } from '@/services';

// Listar documentos
const usuarios = await FirestoreService.getDocuments('usuarios');

// Buscar um
const usuario = await FirestoreService.getDocument('usuarios', 'user123');

// Criar
const newId = await FirestoreService.createDocument('usuarios', {
  name: 'João',
  email: 'joao@example.com'
});

// Atualizar
await FirestoreService.updateDocument('usuarios', 'user123', {
  name: 'João Silva'
});

// Deletar
await FirestoreService.deleteDocument('usuarios', 'user123');

// ============================================
// 7️⃣ NOTIFICAÇÕES GLOBAIS (NotificationService)
// ============================================

import { notificationService } from '@/services';

// Sucesso
notificationService.success('Dados salvos com sucesso!', 5000); // 5s de duração

// Erro
notificationService.error('Erro ao salvar dados');

// Aviso
notificationService.warning('Esta ação não pode ser desfeita');

// Info
notificationService.info('Nova atualização disponível');

// ============================================
// 8️⃣ CONSTANTES CENTRALIZADAS (APP_CONFIG)
// ============================================

import { APP_CONFIG, COLORS, BREAKPOINTS } from '@/constants';

// Configurações
const pageSize = APP_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE; // 10
const maxSize = APP_CONFIG.PAGINATION.MAX_PAGE_SIZE;      // 100
const timeout = APP_CONFIG.TIMEOUT.API_REQUEST;            // 30000ms
const debounce = APP_CONFIG.TIMEOUT.DEBOUNCE;              // 500ms

// Status padrão
const status = APP_CONFIG.STATUS.PENDING; // 'Pendente'

// Rotas
const dashboard = APP_CONFIG.ROUTES.DASHBOARD; // '/beto'
const home = APP_CONFIG.ROUTES.HOME;           // '/'

// Cores
const primary = COLORS.PRIMARY;     // '#1a4d3a'
const danger = COLORS.DANGER;       // '#d32f2f'

// Breakpoints
const mobileWidth = BREAKPOINTS.SM; // 600px
const tabletWidth = BREAKPOINTS.MD; // 960px

// ============================================
// 9️⃣ COMPONENTES COMUNS (LoadingSpinner, ErrorState, SearchFilter)
// ============================================

import { LoadingSpinner, ErrorState, SearchFilter } from '@/components/common';

// Loading
<LoadingSpinner size={40} message="Carregando..." fullScreen={false} />

// Erro
<ErrorState 
  title="Oops!" 
  message="Algo deu errado" 
  onRetry={handleRetry}
  fullScreen={false}
/>

// Search com debounce automático
<SearchFilter 
  value={search} 
  onChange={setSearch} 
  placeholder="Buscar usuários..."
/>

// ============================================
// 🔟 COMBINAR TUDO (Exemplo Completo)
// ============================================

function UsuariosPage() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Carregar com debounce
  const { data: usuarios, status } = useAsync(
    () => ApiService.get(`/api/usuarios?q=${debouncedSearch}`),
    true,
    [debouncedSearch]
  );

  // Paginação
  const { data: paginatedData, goToPage } = usePagination(usuarios || [], 10);

  if (status === 'pending') return <LoadingSpinner />;
  if (status === 'error') return <ErrorState message="Erro ao carregar" />;

  return (
    <>
      <SearchFilter value={searchInput} onChange={setSearchInput} />
      <DataTable 
        data={paginatedData}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'nome', label: 'Nome' },
          { key: 'email', label: 'Email' },
          { key: 'status', label: 'Status' }
        ]}
        rowKey="id"
      />
    </>
  );
}

export default UsuariosPage;

// ============================================
// ⚡ DICAS RÁPIDAS
// ============================================

/*
✅ DO:
- Usar useAsync para carregamento de dados
- Usar usePagination para listas > 10 itens
- Usar ApiService em vez de fetch direto
- Usar memo() só quando performance for problema
- Extrair lógica complexa em hooks

❌ DON'T:
- Não faça requisições diretamente em componentes
- Não use callbacks inline sem useCallback
- Não passe objetos como deps de useEffect
- Não misture lógica e apresentação
- Não copie/cole código (crie componentes reutilizáveis)

⚡ Performance:
- Lazy load com dynamic() para componentes pesados
- Use memo() para componentes que recebem props complexas
- Virtual scrolling para listas > 1000 itens
- useMemo() para cálculos pesados

*/
