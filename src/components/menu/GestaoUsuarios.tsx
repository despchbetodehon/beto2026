import React, { useState, useEffect, memo } from 'react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  permissao: 'Visualizador' | 'cliente' | 'empresa' | 'colaborador' | 'administrador' | 'Operador' | 'Administrador' | 'CEO' | 'EnygmaDeveloper';
  ativo: boolean;
  imagemUrl?: string;
  dataCriacao?: Date;
}

interface GestaoUsuariosProps {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

const GestaoUsuarios: React.FC<GestaoUsuariosProps> = ({ expanded, onExpandedChange }) => {
  const [usuariosList, setUsuariosList] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (expanded) {
      carregarUsuarios();
    }
  }, [expanded]);

  const carregarUsuarios = async () => {
    setIsLoading(true);
    try {
      const { default: Colecao } = await import('@/logic/firebase/db/Colecao');
      const colecao = new Colecao();
      const usuarios = await colecao.consultarTodos('usuarios');
      const usuariosFormatados = usuarios.map((usuario: any) => ({
        id: usuario.id || usuario.email,
        nome: usuario.nome || 'Nome não informado',
        email: usuario.email || 'Email não informado',
        permissao: usuario.permissao || 'Visualizador',
        ativo: usuario.ativo !== false,
        imagemUrl: usuario.imagemUrl || '/betologo.jpeg',
        dataCriacao: usuario.dataCriacao || new Date(),
      }));
      setUsuariosList(usuariosFormatados);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setUsuariosList([]);
      setNotifications([{
        id: Date.now(),
        message: 'Erro ao carregar usuários.',
        type: 'error',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (usuario: Usuario) => {
    try {
      const { default: Colecao } = await import('@/logic/firebase/db/Colecao');
      const colecao = new Colecao();
      const novoStatus = !usuario.ativo;
      await colecao.salvar('usuarios', {
        ...usuario,
        ativo: novoStatus,
        dataAtualizacao: new Date(),
      }, usuario.email);
      setNotifications([{
        id: Date.now(),
        message: `Usuário ${usuario.nome} ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`,
        type: 'success',
      }]);
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setNotifications([{
        id: Date.now(),
        message: 'Erro ao atualizar status do usuário.',
        type: 'error',
      }]);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestão de Usuários</h2>
      {isLoading ? (
        <div className="text-center py-8">Carregando usuários...</div>
      ) : (
        <div className="space-y-4">
          {usuariosList.length === 0 ? (
            <p className="text-gray-500">Nenhum usuário encontrado.</p>
          ) : (
            usuariosList.map((usuario) => (
              <div
                key={usuario.id}
                className="p-4 border rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{usuario.nome}</h3>
                    <p className="text-sm text-gray-600">{usuario.email}</p>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {usuario.permissao}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleUserStatus(usuario)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      usuario.ativo
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  >
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default memo(GestaoUsuarios);
