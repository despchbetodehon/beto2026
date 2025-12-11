// Componente ProcuracaoPreview para visualização do documento de procuração

import React from 'react';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import {
  DocumentPaper,
  DocumentTitle,
  DocumentText,
  SignatureSection,
  SignatureBlock,
  DocumentFooter,
} from '../styles';

interface ProcuracaoPreviewProps {
  newItem: any;
  modoJuridico: boolean;
  signature?: string;
}

const ProcuracaoPreview: React.FC<ProcuracaoPreviewProps> = ({
  newItem,
  modoJuridico,
  signature,
}) => {
  const formatDate = (date: string | Date | Timestamp | undefined | null) => {
    if (!date) return 'Data inválida';
    let localDate: Date;
    if (date instanceof Timestamp) {
      localDate = date.toDate();
    } else if (date instanceof Date) {
      localDate = date;
    } else {
      localDate = new Date(date);
    }
    if (isNaN(localDate.getTime())) return 'Data inválida';
    const offsetMs = localDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(localDate.getTime() - offsetMs - 3 * 3600000);
    return format(adjustedDate, 'dd/MM/yyyy');
  };

  const formatCpfCnpj = (value: string) => {
    if (!value) return '[CPF/CNPJ]';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, p1, p2, p3, p4) => {
        return [p1, p2, p3].filter(Boolean).join('.') + (p4 ? `-${p4}` : '');
      });
    } else {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (_, p1, p2, p3, p4, p5) => {
        return `${p1}.${p2}.${p3}/${p4}-${p5}`;
      });
    }
  };

  // Função para gerar texto dos procuradores
  const gerarTextoProcuradores = () => {
    const procuradores = [];
    
    if (newItem.nomeProcurador) {
      procuradores.push({
        nome: newItem.nomeProcurador,
        cpf: newItem.cpfProcurador,
        rg: newItem.rgProcurador,
        nregistro: newItem.nregistroProcurador,
        nacionalidade: newItem.nacionalidadeProcurador,
        estadoCivil: newItem.estadoCivilProcurador,
        profissao: newItem.profissaoProcurador,
        endereco: newItem.enderecoProcurador,
        municipio: newItem.municipioProcurador,
        estado: newItem.estadoProcuradorEnd,
        cep: newItem.cepProcurador,
      });
    }

    for (let i = 2; i <= 5; i++) {
      const nome = newItem[`nomeProcurador${i}`];
      if (nome) {
        procuradores.push({
          nome,
          cpf: newItem[`cpfProcurador${i}`],
          rg: newItem[`rgProcurador${i}`],
          nregistro: newItem[`nregistroProcurador${i}`],
          nacionalidade: newItem[`nacionalidadeProcurador${i}`],
          estadoCivil: newItem[`estadoCivilProcurador${i}`],
          profissao: newItem[`profissaoProcurador${i}`],
          endereco: newItem[`enderecoProcurador${i}`],
          municipio: newItem[`municipioProcurador${i}`],
          estado: newItem[`estadoProcuradorEnd${i}`],
          cep: newItem[`cepProcurador${i}`],
        });
      }
    }

    if (procuradores.length === 0) {
      return '<strong style="color: #999">[NOME DO PROCURADOR]</strong>';
    }

    return procuradores.map((p, index) => {
      let texto = '';
      if (index > 0) {
        texto += ' <strong>e/ou</strong> ';
      }

      texto += `<strong>${p.nome || '[NOME]'}</strong>`;

      if (p.nacionalidade) {
        texto += `, ${p.nacionalidade}`;
      }

      if (p.estadoCivil) {
        texto += `, ${p.estadoCivil.toLowerCase()}`;
      }

      if (p.profissao) {
        texto += `, ${p.profissao.toLowerCase()}`;
      }

      if (p.cpf) {
        texto += `, inscrito(a) no CPF sob nº ${formatCpfCnpj(p.cpf)}`;
      }

      if (p.rg) {
        texto += `, RG nº ${p.rg}`;
      }

      if (p.nregistro) {
        texto += `, Registro nº ${p.nregistro}`;
      }

      if (p.endereco) {
        texto += `, residente e domiciliado(a) à ${p.endereco}`;
        if (p.municipio) {
          texto += `, ${p.municipio}`;
        }
        if (p.estado) {
          texto += `/${p.estado}`;
        }
        if (p.cep) {
          texto += `, CEP ${p.cep}`;
        }
      }

      return texto;
    }).join('');
  };

  return (
    <DocumentPaper id="pdf-content" elevation={3}>
      {/* Cabeçalho */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <DocumentTitle>PROCURAÇÃO</DocumentTitle>
      </Box>

      {/* Corpo do documento */}
      <DocumentText>
        {modoJuridico ? (
          // Texto para pessoa jurídica
          <>
            <strong>{newItem.nomeEmpresaJuridico || '[RAZÃO SOCIAL]'}</strong>, pessoa jurídica de
            direito privado, inscrita no CNPJ sob nº{' '}
            <strong>{formatCpfCnpj(newItem.cnpjEmpresaJuridico) || '[CNPJ]'}</strong>, com sede na{' '}
            {newItem.enderecoEmpresaJuridico || '[ENDEREÇO]'},{' '}
            {newItem.bairroEmpresaJuridico && `${newItem.bairroEmpresaJuridico}, `}
            {newItem.municipioEmpresaJuridico || '[MUNICÍPIO]'}/
            {newItem.estadoEmpresaJuridico || '[UF]'}
            {newItem.cepEmpresaJuridico && `, CEP ${newItem.cepEmpresaJuridico}`}, neste ato
            representada por seu(sua) sócio(a) administrador(a){' '}
            <strong>{newItem.nomeSocioAdministrador || '[NOME DO SÓCIO]'}</strong>,{' '}
            {newItem.nacionalidadeSocioAdministrador || 'brasileiro(a)'},{' '}
            {newItem.estadoCivilSocioAdministrador?.toLowerCase() || '[ESTADO CIVIL]'},{' '}
            {newItem.profissaoSocioAdministrador?.toLowerCase() || '[PROFISSÃO]'}, inscrito(a) no
            CPF sob nº{' '}
            <strong>
              {formatCpfCnpj(newItem.cpfSocioAdministrador) || '[CPF]'}
            </strong>
            {newItem.rgSocioAdministrador && `, RG nº ${newItem.rgSocioAdministrador}`},
          </>
        ) : (
          // Texto para pessoa física
          <>
            <strong>{newItem.nomeProprietario || '[NOME DO OUTORGANTE]'}</strong>,{' '}
            {newItem.nacionalidadeProprietario || 'brasileiro(a)'}, inscrito(a) no CPF sob nº{' '}
            <strong>
              {formatCpfCnpj(newItem.cpfProprietario) || '[CPF]'}
            </strong>
            {newItem.rgProprietario && `, RG nº ${newItem.rgProprietario}`}
            {newItem.dataNascimentoProprietario &&
              `, nascido(a) em ${newItem.dataNascimentoProprietario}`}
            {newItem.nomePaiProprietario && `, filho(a) de ${newItem.nomePaiProprietario}`}
            {newItem.nomeMaeProprietario && ` e ${newItem.nomeMaeProprietario}`}
            {newItem.enderecoProprietario &&
              `, residente e domiciliado(a) à ${newItem.enderecoProprietario}`}
            {newItem.complementoProprietario && `, ${newItem.complementoProprietario}`}
            {newItem.municipioProprietario && `, ${newItem.municipioProprietario}`}
            {newItem.estadoProprietario && `/${newItem.estadoProprietario}`}
            {newItem.cepProprietario && `, CEP ${newItem.cepProprietario}`},
          </>
        )}
      </DocumentText>

      <DocumentText>
        pelo presente instrumento particular de procuração, nomeia e constitui seu(sua) bastante
        procurador(a):{' '}
        <span dangerouslySetInnerHTML={{ __html: gerarTextoProcuradores() }} />
      </DocumentText>

      <DocumentText>
        a quem confere poderes especiais para, em seu nome, representá-lo(a) junto ao DETRAN,
        Cartórios, CIRETRAN e demais órgãos de trânsito, podendo assinar documentos, requerer
        certidões, autorizações, transferências, licenciamentos, baixas, segundas vias de
        documentos, placas, alterações de características e quaisquer outros atos necessários
        para regularização do veículo abaixo especificado:
      </DocumentText>

      {/* Dados do veículo */}
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: 1,
          p: 2,
          my: 3,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>DADOS DO VEÍCULO:</Typography>
        <Typography>
          <strong>Placa:</strong> {newItem.placa || '[PLACA]'} |{' '}
          <strong>Renavam:</strong> {newItem.renavam || '[RENAVAM]'} |{' '}
          <strong>Chassi:</strong> {newItem.chassi || '[CHASSI]'}
        </Typography>
        <Typography>
          <strong>Modelo:</strong> {newItem.modelo || '[MODELO]'} |{' '}
          <strong>Ano Fab/Mod:</strong> {newItem.anoFabricacao || '[ANO]'}/
          {newItem.anoModelo || '[ANO]'} |{' '}
          <strong>Cor:</strong> {newItem.cor || '[COR]'}
        </Typography>
        {newItem.combustivel && (
          <Typography>
            <strong>Combustível:</strong> {newItem.combustivel}
          </Typography>
        )}
      </Box>

      <DocumentText>
        Esta procuração é válida para todos os fins de direito, sendo vedado o substabelecimento.
      </DocumentText>

      {/* Data e local */}
      <DocumentText sx={{ mt: 4 }}>
        {newItem.municipioProprietario || newItem.municipioEmpresaJuridico || '[CIDADE]'},{' '}
        {formatDate(new Date())}.
      </DocumentText>

      {/* Assinatura */}
      <SignatureSection>
        {signature ? (
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={signature}
              alt="Assinatura"
              style={{ maxWidth: 300, maxHeight: 100, marginBottom: 8 }}
            />
            <SignatureBlock>
              <Typography>
                {modoJuridico
                  ? newItem.nomeSocioAdministrador || '[NOME DO SÓCIO]'
                  : newItem.nomeProprietario || '[NOME DO OUTORGANTE]'}
              </Typography>
              <Typography variant="caption">
                CPF:{' '}
                {modoJuridico
                  ? formatCpfCnpj(newItem.cpfSocioAdministrador)
                  : formatCpfCnpj(newItem.cpfProprietario)}
              </Typography>
            </SignatureBlock>
          </Box>
        ) : (
          <SignatureBlock sx={{ minWidth: 300 }}>
            <Typography sx={{ mb: 2, color: '#999' }}>
              [Aguardando assinatura]
            </Typography>
            <Typography>
              {modoJuridico
                ? newItem.nomeSocioAdministrador || '[NOME DO SÓCIO]'
                : newItem.nomeProprietario || '[NOME DO OUTORGANTE]'}
            </Typography>
          </SignatureBlock>
        )}
      </SignatureSection>

      {/* Rodapé */}
      <DocumentFooter>
        Documento gerado eletronicamente em {formatDate(new Date())}
      </DocumentFooter>
    </DocumentPaper>
  );
};

export default ProcuracaoPreview;
