/**
 * Exemplo de uso dos novos hooks e serviços
 * Este arquivo serve como referência para refatoração gradual
 */

import { useAsync, useDebounce, useLocalStorage, usePagination } from '@/hooks';
import { ApiService, FirestoreService, notificationService } from '@/services';
import { LoadingSpinner, ErrorState, SearchFilter } from '@/components/common';
import { DataTable } from '@/components/tables';
import { APP_CONFIG } from '@/constants';

// ============= EXEMPLO 1: Busca com debounce =============
export function ExemploSearchComDebounce() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data: results, status } = useAsync(
    () => ApiService.get(`/api/buscar?q=${debouncedSearch}`),
    true,
    [debouncedSearch]
  );

  if (status === 'pending') return <LoadingSpinner />;
  if (status === 'error') return <ErrorState message="Erro na busca" />;

  return (
    <>
      <SearchFilter 
        value={searchInput} 
        onChange={setSearchInput} 
        placeholder="Buscar usuários..."
      />
      {/* Render resultados */}
    </>
  );
}

// ============= EXEMPLO 2: Tabela com paginação =============
export function ExemploTabelaComPaginacao() {
  const [usuarios, setUsuarios] = useState([]);
  const { data: paginatedData, currentPage, totalPages, goToPage } = usePagination(usuarios, 10);

  const columns = [
    { key: 'nome' as const, label: 'Nome' },
    { key: 'email' as const, label: 'Email' },
    { 
      key: 'status' as const, 
      label: 'Status',
      render: (value: string) => <Chip label={value} color={value === 'ativo' ? 'success' : 'default'} />
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={paginatedData} rowKey="id" />
      {/* Paginação */}
    </>
  );
}

// ============= EXEMPLO 3: Dados persistidos localmente =============
export function ExemploLocalStorage() {
  const [preferencias, setPreferencias] = useLocalStorage('user-prefs', {
    tema: 'light',
    idioma: 'pt-BR',
  });

  return (
    <select value={preferencias.tema} onChange={(e) => setPreferencias({ ...preferencias, tema: e.target.value })}>
      <option value="light">Claro</option>
      <option value="dark">Escuro</option>
    </select>
  );
}

// ============= EXEMPLO 4: Requisição com retry automático =============
export function ExemploApiComCache() {
  const { data, status, execute } = useAsync(
    () => ApiService.get('/api/dados-criticos', { cache: true }),
    true
  );

  return (
    <>
      {status === 'pending' && <LoadingSpinner message="Carregando dados..." />}
      {status === 'error' && <ErrorState message="Erro ao carregar" onRetry={execute} />}
      {status === 'success' && <div>{JSON.stringify(data)}</div>}
    </>
  );
}

// ============= EXEMPLO 5: Operações Firestore =============
export async function ExemploFirestore() {
  try {
    // Listar documentos
    const usuarios = await FirestoreService.getDocuments('usuarios');

    // Buscar um
    const usuario = await FirestoreService.getDocument('usuarios', 'user123');

    // Criar
    const newId = await FirestoreService.createDocument('usuarios', {
      nome: 'João',
      email: 'joao@example.com',
    });

    // Atualizar
    await FirestoreService.updateDocument('usuarios', 'user123', {
      nome: 'João Silva',
    });

    // Deletar
    await FirestoreService.deleteDocument('usuarios', 'user123');

    notificationService.success('Operação concluída!');
  } catch (error) {
    notificationService.error('Erro ao processar dados');
  }
}

// ============= EXEMPLO 6: Usar constantes =============
export function ExemploConstantes() {
  const pageSize = APP_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE; // 10
  const maxSize = APP_CONFIG.PAGINATION.MAX_PAGE_SIZE; // 100
  const debounceDelay = APP_CONFIG.TIMEOUT.DEBOUNCE; // 500ms
  const routes = APP_CONFIG.ROUTES; // { HOME: '/', LOGIN: '/login', ... }

  return <div>Page size: {pageSize}</div>;
}
