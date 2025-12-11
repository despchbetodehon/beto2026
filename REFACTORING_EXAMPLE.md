// Exemplo: Como Refatorar Componente Grande em Pequenos Módulos
// Este arquivo demonstra o padrão a ser seguido

import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// ============================================================================
// PASSO 1: Criar Types Locais (types.ts)
// ============================================================================

export interface RequerimentoFormData {
  titulo: string;
  descricao: string;
  valor: number;
  tipo: string;
  documentos: string[];
}

export interface RequerimentoItemProps {
  id: string;
  titulo: string;
  status: 'pendente' | 'analisando' | 'concluído';
  valor: number;
  dataCriacao: Date;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// ============================================================================
// PASSO 2: Criar Hooks Customizados (hooks/useRequerimento.ts)
// ============================================================================

export const useRequerimentoForm = () => {
  const [values, setValues] = useState<RequerimentoFormData>({
    titulo: '',
    descricao: '',
    valor: 0,
    tipo: '',
    documentos: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof RequerimentoFormData, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = useCallback(
    async (onSubmit: (data: RequerimentoFormData) => Promise<void>) => {
      setLoading(true);
      setError(null);
      try {
        await onSubmit(values);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [values]
  );

  const reset = () => {
    setValues({
      titulo: '',
      descricao: '',
      valor: 0,
      tipo: '',
      documentos: [],
    });
    setError(null);
  };

  return { values, loading, error, handleChange, handleSubmit, reset };
};

// ============================================================================
// PASSO 3: Criar Componentes Pequenos
// ============================================================================

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'flex-end',
  },
}));

// Componente: Formulário
interface RequerimentoFormProps {
  initialData?: RequerimentoFormData;
  onSubmit: (data: RequerimentoFormData) => Promise<void>;
  onCancel: () => void;
}

export const RequerimentoForm: React.FC<RequerimentoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const classes = useStyles();
  const form = useRequerimentoForm();

  return (
    <Card className={classes.card}>
      <CardContent>
        <form
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit);
          }}
        >
          {/* Aqui iriam os campos do formulário */}
          <Typography variant="h6">Novo Requerimento</Typography>
          {form.error && <Typography color="error">{form.error}</Typography>}

          <Box className={classes.actions}>
            <button onClick={onCancel} disabled={form.loading}>
              Cancelar
            </button>
            <button type="submit" disabled={form.loading}>
              {form.loading ? <CircularProgress size={24} /> : 'Salvar'}
            </button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

// Componente: Item da Lista
export const RequerimentoItem: React.FC<RequerimentoItemProps> = ({
  id,
  titulo,
  status,
  valor,
  dataCriacao,
  onEdit,
  onDelete,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6">{titulo}</Typography>
        <Typography variant="body2" color="textSecondary">
          Status: {status}
        </Typography>
        <Typography variant="body2">
          Valor: R$ {valor.toFixed(2)}
        </Typography>
        <Typography variant="caption">
          Criado em: {dataCriacao.toLocaleDateString()}
        </Typography>

        <Box className={classes.actions}>
          <button onClick={() => onEdit(id)}>Editar</button>
          <button onClick={() => onDelete(id)}>Deletar</button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Componente: Lista
interface RequerimentoListProps {
  items: RequerimentoItemProps[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const RequerimentoList: React.FC<RequerimentoListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <CircularProgress />;
  }

  if (items.length === 0) {
    return <Typography>Nenhum requerimento encontrado</Typography>;
  }

  return (
    <Box>
      {items.map((item) => (
        <RequerimentoItem
          key={item.id}
          {...item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};

// ============================================================================
// PASSO 4: Componente Orquestrador (Index)
// ============================================================================

interface RequerimentoContainerProps {
  usuarioId: string;
}

export const RequerimentoContainer: React.FC<RequerimentoContainerProps> = ({
  usuarioId,
}) => {
  const classes = useStyles();
  const [items, setItems] = useState<RequerimentoItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carregar dados
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      // Buscar dados da API
      // const data = await requerimentoService.getAll({ usuarioId });
      // setItems(data);
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  // Salvar requerimento
  const handleSave = async (data: RequerimentoFormData) => {
    if (editingId) {
      // Atualizar
      // await requerimentoService.update(editingId, data);
    } else {
      // Criar
      // await requerimentoService.create(data);
    }
    loadItems();
    setEditingId(null);
    setActiveTab(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza?')) {
      // await requerimentoService.delete(id);
      loadItems();
    }
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
      >
        <Tab label="Novo Requerimento" />
        <Tab label="Meus Requerimentos" />
      </Tabs>

      {activeTab === 0 && (
        <RequerimentoForm
          initialData={editingId ? items.find((i) => i.id === editingId) : undefined}
          onSubmit={handleSave}
          onCancel={() => {
            setEditingId(null);
            setActiveTab(1);
          }}
        />
      )}

      {activeTab === 1 && (
        <RequerimentoList
          items={items}
          loading={loading}
          onEdit={(id) => {
            setEditingId(id);
            setActiveTab(0);
          }}
          onDelete={handleDelete}
        />
      )}
    </Box>
  );
};

export default RequerimentoContainer;

// ============================================================================
// ESTRUTURA DE ARQUIVOS RECOMENDADA
// ============================================================================
/*

src/modules/requerimento/
├── index.ts                           (export consolidado)
├── RequerimentoContainer.tsx          (componente orquestrador)
├── components/
│   ├── RequerimentoForm.tsx          (formulário)
│   ├── RequerimentoList.tsx          (lista)
│   ├── RequerimentoItem.tsx          (item)
│   ├── RequerimentoDetail.tsx        (detalhes)
│   └── RequerimentoOCR.tsx           (OCR)
├── hooks/
│   ├── useRequerimentoForm.ts        (estado do formulário)
│   ├── useRequerimentoList.ts        (estado da lista)
│   └── useRequerimentoData.ts        (busca de dados)
├── services/
│   └── requerimentoService.ts        (API calls)
├── types.ts                           (tipos locais)
├── constants.ts                       (constantes)
└── utils.ts                          (utilidades)

*/

// ============================================================================
// BENEFÍCIOS DESTA ABORDAGEM
// ============================================================================
/*

1. ✅ MANUTENIBILIDADE: Cada arquivo tem uma responsabilidade clara
2. ✅ REUTILIZAÇÃO: Componentes podem ser importados em outros módulos
3. ✅ TESTABILIDADE: Mais fácil testar componentes menores
4. ✅ LEGIBILIDADE: Código mais fácil de entender
5. ✅ PERFORMANCE: Lazy loading por módulo
6. ✅ ESCALABILIDADE: Padrão funciona para features grandes

*/
