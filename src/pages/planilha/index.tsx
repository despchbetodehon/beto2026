
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  IconButton, 
  TextField, 
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { 
  CloudUpload, 
  Delete, 
  GetApp, 
  Add, 
  Remove, 
  Visibility, 
  Print,
  Share,
  CloudDone
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import Pagina from '@/components/template/Pagina';
import * as XLSX from 'xlsx';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    maxWidth: 1400,
    margin: '0 auto',
  },
  uploadBox: {
    border: '2px dashed #ccc',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: '#f9f9fa',
    cursor: 'pointer',
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: '#f0f0f0',
      borderColor: '#2d5a3d',
    },
  },
  fileList: {
    marginTop: theme.spacing(3),
  },
  fileItem: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    borderRadius: theme.spacing(1),
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: '#2d5a3d',
    '& th': {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '0.75rem',
      padding: '8px',
    },
  },
  uploadIcon: {
    fontSize: 60,
    color: '#999',
    marginBottom: theme.spacing(2),
  },
  primaryButton: {
    backgroundColor: '#2d5a3d',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1e3d28',
    },
  },
  secondaryButton: {
    backgroundColor: '#5a8a6d',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#4a7a5d',
    },
  },
  tableCell: {
    padding: '4px 8px',
    fontSize: '0.75rem',
  }
}));

interface ExtractedData {
  [key: string]: string;
}

interface Column {
  id: string;
  label: string;
  editable: boolean;
}

// Colunas baseadas no modelo da planilha fornecida
const COLUNAS_MODELO: Column[] = [
  { id: 'os', label: 'OS', editable: true },
  { id: 'data', label: 'Data', editable: true },
  { id: 'municipio', label: 'Município', editable: true },
  { id: 'tipoServico', label: 'Tipo de Serviço', editable: true },
  { id: 'nome', label: 'NOME', editable: true },
  { id: 'novoUsado', label: 'Novo ou Usado', editable: true },
  { id: 'vendedor', label: 'VENDEDOR', editable: true },
  { id: 'placa', label: 'Placa', editable: true },
  { id: 'despachanteOutroMunicipio', label: 'Despachante de Outro Município', editable: true },
  { id: 'vistoria', label: 'Vistoria', editable: true },
  { id: 'deslocamento', label: 'Deslocamento', editable: true },
  { id: 'remarcacaoChassi', label: 'Remarcação de Chassi', editable: true },
  { id: 'cartorio', label: 'Cartório', editable: true },
  { id: 'placas', label: 'Placas', editable: true },
  { id: 'colagemEtiquetas', label: 'Colagem de Etiquetas', editable: true },
  { id: 'comunicacaoVenda', label: 'Comunicação de Venda', editable: true },
  { id: 'assinaturaDigital', label: 'Assinatura Digital', editable: true },
  { id: 'ipva', label: 'IPVA', editable: true },
  { id: 'taxaLicenciamento', label: 'Taxa de Licenciamento', editable: true },
  { id: 'taxaReservaPlaca', label: 'Taxa reserva de placa', editable: true },
  { id: 'taxaRegistro', label: 'Taxa Registro', editable: true },
  { id: 'servicoDespachante', label: 'Serviço Despachante', editable: true },
  { id: 'total', label: 'TOTAL', editable: true },
];

export default function PlanilhaOCR() {
  const classes = useStyles();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [columns, setColumns] = useState<Column[]>(COLUNAS_MODELO);
  const [showPreview, setShowPreview] = useState(false);
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [showGoogleSheetsDialog, setShowGoogleSheetsDialog] = useState(false);
  const [creatingSheet, setCreatingSheet] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      f => f.type === 'application/pdf' || f.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processWithOCR = async () => {
    if (files.length === 0) {
      setError('Adicione pelo menos um arquivo');
      return;
    }

    setLoading(true);
    setError('');
    const allData: ExtractedData[] = [];

    try {
      for (const file of files) {
        console.log('Processando arquivo:', file.name);
        const base64 = await fileToBase64(file);
        const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!geminiKey) {
          throw new Error('Chave da API Gemini não configurada. Configure NEXT_PUBLIC_GEMINI_API_KEY no .env.local');
        }

        const prompt = `INSTRUÇÃO CRÍTICA: Este documento contém UMA TABELA com MÚLTIPLAS LINHAS DE DADOS. Você DEVE extrair TODAS AS LINHAS, uma por uma.

🚨 ATENÇÃO: NÃO extraia apenas a primeira linha! Vá até o FINAL da tabela!

FORMATO DE SAÍDA: Array JSON com TODOS os registros encontrados.

CAMPOS para extrair de cada linha (use "" se não houver valor):
{
  "os": "número da OS",
  "data": "data no formato dd/mm/yyyy",
  "municipio": "cidade",
  "tipoServico": "tipo do serviço",
  "nome": "nome completo do cliente/empresa",
  "novoUsado": "NOVO ou USADO",
  "vendedor": "nome do vendedor",
  "placa": "placa do veículo",
  "despachanteOutroMunicipio": "valor com R$",
  "vistoria": "valor com R$",
  "deslocamento": "valor com R$",
  "remarcacaoChassi": "valor com R$",
  "cartorio": "valor com R$",
  "placas": "valor com R$",
  "colagemEtiquetas": "valor com R$",
  "comunicacaoVenda": "valor com R$",
  "assinaturaDigital": "valor com R$",
  "ipva": "valor com R$",
  "taxaLicenciamento": "valor com R$",
  "taxaReservaPlaca": "valor com R$",
  "taxaRegistro": "valor com R$",
  "servicoDespachante": "valor com R$",
  "total": "valor total com R$"
}

EXEMPLO do formato esperado (retorne SÓ o JSON, sem texto adicional):
[
  {"os":"98831","data":"11/21/2025","municipio":"TUBARÃO","tipoServico":"TRANSFERENCIA","nome":"SUL PECAS","novoUsado":"USADO","vendedor":"","placa":"RDZ0J26","despachanteOutroMunicipio":"","vistoria":"","deslocamento":"","remarcacaoChassi":"","cartorio":"","placas":"","colagemEtiquetas":"","comunicacaoVenda":"R$ 17,00","assinaturaDigital":"","ipva":"","taxaLicenciamento":"","taxaReservaPlaca":"","taxaRegistro":"R$ 183,12","servicoDespachante":"R$ 100,00","total":"R$ 300,12"},
  {"os":"98723","data":"11/18/2025","municipio":"TUBARÃO","tipoServico":"TRANSFERENCIA","nome":"OUTRO CLIENTE","novoUsado":"USADO","vendedor":"JOÃO","placa":"MGP3A66","despachanteOutroMunicipio":"","vistoria":"","deslocamento":"","remarcacaoChassi":"","cartorio":"","placas":"","colagemEtiquetas":"","comunicacaoVenda":"R$ 17,00","assinaturaDigital":"","ipva":"","taxaLicenciamento":"","taxaReservaPlaca":"","taxaRegistro":"R$ 183,12","servicoDespachante":"R$ 100,00","total":"R$ 300,12"}
]

🔥 LEMBRE-SE: Vá até o FINAL do documento e extraia TODAS as linhas da tabela!`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  { inline_data: { mime_type: file.type, data: base64 } }
                ]
              }],
              generationConfig: { 
                temperature: 0.2, 
                maxOutputTokens: 65536,
                topP: 0.95,
                topK: 40
              }
            })
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erro na API Gemini:', errorText);
          
          // Verificar se a chave expirou
          if (errorText.includes('API key expired') || errorText.includes('API_KEY_INVALID')) {
            throw new Error('❌ Chave da API Gemini expirada ou inválida!\n\n🔑 Gere uma nova chave em: https://aistudio.google.com/app/apikey\n\n📝 Atualize o arquivo .env.local:\nNEXT_PUBLIC_GEMINI_API_KEY=sua_nova_chave\n\n🔄 Depois reinicie o servidor clicando no botão Run');
          }
          
          throw new Error(`Erro na API Gemini: ${response.status}`);
        }

        const result = await response.json();
        console.log('Resposta da API:', result);
        
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
          console.log('Texto extraído da IA:', text);
          
          try {
            // Remover TODAS as marcações de código (```json, ```, etc)
            let cleanText = text
              .replace(/```json\s*/gi, '')
              .replace(/```javascript\s*/gi, '')
              .replace(/```\s*/g, '')
              .trim();
            
            console.log('Texto limpo:', cleanText);
            
            // Tentar extrair array JSON primeiro
            let jsonMatch = cleanText.match(/\[[\s\S]*?\]/);
            
            // Se não encontrar array, tentar objeto único
            if (!jsonMatch) {
              jsonMatch = cleanText.match(/\{[\s\S]*?\}/);
            }
            
            if (!jsonMatch) {
              console.error('❌ Nenhum JSON encontrado no texto:', cleanText);
              throw new Error('Nenhum JSON válido foi encontrado na resposta da IA');
            }
            
            console.log('JSON extraído:', jsonMatch[0]);
            
            // Parse do JSON
            const parsedData = JSON.parse(jsonMatch[0]);
            console.log('✅ Dados parseados com sucesso:', parsedData);
            console.log('📊 Tipo dos dados:', Array.isArray(parsedData) ? 'Array' : 'Object');
            
            // Processar dados
            if (Array.isArray(parsedData)) {
              console.log(`📋 Total de registros no array: ${parsedData.length}`);
              parsedData.forEach((item, index) => {
                if (typeof item === 'object' && item !== null) {
                  console.log(`✓ Registro ${index + 1} adicionado:`, item.os || item.nome || 'sem identificador');
                  allData.push(item);
                } else {
                  console.warn(`⚠ Registro ${index + 1} ignorado (não é objeto):`, item);
                }
              });
            } else if (typeof parsedData === 'object' && parsedData !== null) {
              console.log('✓ Objeto único adicionado:', parsedData.os || parsedData.nome || 'sem identificador');
              allData.push(parsedData);
            } else {
              console.error('❌ Dados não são array nem objeto:', parsedData);
              throw new Error('Formato de dados inválido retornado pela IA');
            }
            
            console.log(`🎯 Total acumulado até agora: ${allData.length} registros`);
            
          } catch (parseError: any) {
            console.error('❌ ERRO AO PROCESSAR JSON:', parseError);
            console.error('Mensagem:', parseError.message);
            console.error('Stack:', parseError.stack);
            console.error('Texto problemático:', text.substring(0, 500));
            throw new Error(`Erro ao processar resposta da IA: ${parseError.message}`);
          }
        } else {
          throw new Error('Nenhuma resposta da IA');
        }
      }

      if (allData.length === 0) {
        throw new Error('Nenhum dado foi extraído dos arquivos. Verifique se os documentos contêm informações legíveis.');
      }

      console.log('Total de registros extraídos:', allData.length);
      console.log('Dados extraídos:', allData);

      setExtractedData(allData);
      setShowPreview(true);
    } catch (err: any) {
      console.error('Erro completo:', err);
      setError(err.message || 'Erro ao processar arquivos');
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    });
  };

  const addColumn = () => {
    const newCol: Column = {
      id: `coluna_${columns.length + 1}`,
      label: `Nova Coluna ${columns.length + 1}`,
      editable: true
    };
    setColumns([...columns, newCol]);
  };

  const removeColumn = (id: string) => {
    setColumns(prev => prev.filter(col => col.id !== id));
  };

  const updateColumnLabel = (id: string, newLabel: string) => {
    setColumns(prev => prev.map(col => 
      col.id === id ? { ...col, label: newLabel } : col
    ));
  };

  const updateCellValue = (rowIndex: number, columnId: string, value: string) => {
    setExtractedData(prev => prev.map((row, idx) => 
      idx === rowIndex ? { ...row, [columnId]: value } : row
    ));
  };

  const downloadExcel = () => {
    // Filtrar colunas que têm pelo menos um valor preenchido
    const filteredColumns = columns.filter(col => {
      return extractedData.some(row => row[col.id] && row[col.id].trim() !== '');
    });

    const worksheetData = [
      filteredColumns.map(col => col.label),
      ...extractedData.map(row => 
        filteredColumns.map(col => row[col.id] || '')
      )
    ];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dados Extraídos');
    XLSX.writeFile(wb, `planilha_despachante_${new Date().getTime()}.xlsx`);
  };

  const printPreview = () => {
    window.print();
  };

  const createGoogleSheet = async () => {
    setCreatingSheet(true);
    try {
      // Preparar dados para CSV (formato compatível com Google Sheets)
      const csvData = [
        columns.map(col => col.label).join(','),
        ...extractedData.map(row => 
          columns.map(col => {
            const value = row[col.id] || '';
            // Escapar vírgulas e aspas
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Criar blob CSV
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const csvFile = new File([blob], `planilha_despachante_${new Date().getTime()}.csv`, { type: 'text/csv' });

      // Criar FormData para upload
      const formData = new FormData();
      formData.append('file', csvFile);

      // Fazer upload e criar planilha Google
      const response = await fetch('/api/create-google-sheet', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro ao criar planilha no Google Sheets');
      }

      const result = await response.json();
      
      if (result.url) {
        setGoogleSheetsUrl(result.url);
        setShowGoogleSheetsDialog(true);
      } else {
        // Fallback: download CSV local
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `planilha_despachante_${new Date().getTime()}.csv`;
        link.click();
        alert('Arquivo CSV baixado! Importe manualmente no Google Sheets: File > Import > Upload');
      }
    } catch (err: any) {
      console.error('Erro ao criar Google Sheet:', err);
      setError('Erro ao criar planilha. Baixando CSV localmente...');
      
      // Fallback: download local
      const csvData = [
        columns.map(col => col.label).join(','),
        ...extractedData.map(row => 
          columns.map(col => row[col.id] || '').join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `planilha_despachante_${new Date().getTime()}.csv`;
      link.click();
    } finally {
      setCreatingSheet(false);
    }
  };

  return (
    <Pagina>
      <Box className={classes.container}>
        <Typography variant="h4" gutterBottom style={{ color: '#2d5a3d', fontWeight: 'bold' }}>
          📊 Extração de Dados - Planilha Despachante
        </Typography>

        {!showPreview ? (
          <Paper style={{ padding: 32, marginTop: 24 }}>
            <Box
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={classes.uploadBox}
            >
              <CloudUpload className={classes.uploadIcon} />
              <Typography variant="h6" gutterBottom>
                Arraste arquivos aqui ou clique para selecionar
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Aceita PDF e imagens (JPG, PNG) com dados de serviços automotivos
              </Typography>
              <input
                type="file"
                multiple
                accept=".pdf,image/*"
                onChange={handleFileInput}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button 
                  variant="contained" 
                  className={classes.primaryButton}
                  component="span" 
                  style={{ marginTop: 16 }}
                >
                  Selecionar Arquivos
                </Button>
              </label>
            </Box>

            {files.length > 0 && (
              <Box className={classes.fileList}>
                <Typography variant="h6" gutterBottom>
                  Arquivos Adicionados ({files.length})
                </Typography>
                {files.map((file, idx) => (
                  <Paper key={idx} className={classes.fileItem}>
                    <Typography>{file.name}</Typography>
                    <IconButton onClick={() => removeFile(idx)} color="secondary">
                      <Delete />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            )}

            {error && (
              <Alert severity="error" style={{ marginTop: 16 }}>
                {error}
              </Alert>
            )}

            <Box style={{ marginTop: 24, textAlign: 'center' }}>
              <Button
                variant="contained"
                className={classes.primaryButton}
                size="large"
                onClick={processWithOCR}
                disabled={loading || files.length === 0}
                startIcon={loading ? <CircularProgress size={20} /> : <Visibility />}
              >
                {loading ? 'Processando com OCR...' : 'Processar com OCR'}
              </Button>
            </Box>
          </Paper>
        ) : (
          <Box style={{ marginTop: 24 }}>
            <Paper style={{ padding: 16, marginBottom: 16 }}>
              <Box className={classes.buttonContainer}>
                <Chip 
                  label={`${extractedData.length} registros extraídos`} 
                  color="primary"
                  style={{ fontSize: '1rem', padding: '20px 12px' }}
                />
                <Button 
                  variant="outlined" 
                  startIcon={<Add />} 
                  onClick={addColumn}
                >
                  Adicionar Coluna
                </Button>
                <Button 
                  variant="contained" 
                  className={classes.primaryButton}
                  startIcon={<GetApp />} 
                  onClick={downloadExcel}
                >
                  Baixar Excel
                </Button>
                <Button 
                  variant="contained" 
                  className={classes.secondaryButton}
                  startIcon={creatingSheet ? <CircularProgress size={20} /> : <Share />} 
                  onClick={createGoogleSheet}
                  disabled={creatingSheet}
                >
                  {creatingSheet ? 'Criando...' : 'Abrir no Google Sheets'}
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Print />} 
                  onClick={printPreview}
                >
                  Imprimir
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setShowPreview(false);
                    setFiles([]);
                    setExtractedData([]);
                  }}
                >
                  Nova Extração
                </Button>
              </Box>
            </Paper>

            {/* Visualização em Lista Vertical Detalhada */}
            <Box>
              {extractedData.map((row, rowIdx) => (
                <Paper 
                  key={rowIdx} 
                  elevation={3}
                  style={{ 
                    marginBottom: 32, 
                    padding: 0,
                    border: '3px solid #2d5a3d',
                    borderRadius: 12,
                    overflow: 'hidden'
                  }}
                >
                  {/* Cabeçalho do Card */}
                  <Box style={{ 
                    backgroundColor: '#2d5a3d',
                    color: '#fff',
                    padding: '16px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                      OS: {row.os || 'N/A'}
                    </Typography>
                    <Box style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <Chip 
                        label={row.data || 'Sem Data'} 
                        style={{ 
                          backgroundColor: '#fff', 
                          color: '#2d5a3d',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      />
                      <Chip 
                        label={row.tipoServico || 'Sem Tipo'} 
                        style={{ 
                          backgroundColor: '#5a8a6d', 
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Conteúdo do Card */}
                  <Box style={{ padding: 24 }}>
                    {/* Linha 1: OS, Data, Município */}
                    <Box style={{ marginBottom: 20 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={2}>
                          <Box>
                            <Typography variant="overline" style={{ fontWeight: 'bold', color: '#666', fontSize: '0.7rem' }}>
                              OS
                            </Typography>
                            <Typography variant="h6" style={{ color: '#2d5a3d', fontWeight: 'bold' }}>
                              {row.os || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Box>
                            <Typography variant="overline" style={{ fontWeight: 'bold', color: '#666', fontSize: '0.7rem' }}>
                              Data
                            </Typography>
                            <Typography variant="h6" style={{ color: '#2d5a3d', fontWeight: 'bold' }}>
                              {row.data || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box>
                            <Typography variant="overline" style={{ fontWeight: 'bold', color: '#666', fontSize: '0.7rem' }}>
                              Município
                            </Typography>
                            <Typography variant="h6" style={{ color: '#2d5a3d', fontWeight: 'bold' }}>
                              {row.municipio || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box>
                            <Typography variant="overline" style={{ fontWeight: 'bold', color: '#666', fontSize: '0.7rem' }}>
                              Tipo de Serviço
                            </Typography>
                            <Typography variant="h6" style={{ color: '#2d5a3d', fontWeight: 'bold' }}>
                              {row.tipoServico || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Box>
                            <Typography variant="overline" style={{ fontWeight: 'bold', color: '#666', fontSize: '0.7rem' }}>
                              Placa
                            </Typography>
                            <Typography variant="h6" style={{ color: '#2d5a3d', fontWeight: 'bold' }}>
                              {row.placa || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box style={{ borderTop: '2px solid #e0e0e0', paddingTop: 16, marginBottom: 20 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box>
                            <Typography variant="overline" style={{ fontWeight: 'bold', color: '#666', fontSize: '0.7rem' }}>
                              Cliente
                            </Typography>
                            <Typography variant="body1" style={{ fontWeight: 600 }}>
                              {row.nome || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Box>
                            <Typography variant="overline" style={{ fontWeight: 'bold', color: '#666', fontSize: '0.7rem' }}>
                              Condição
                            </Typography>
                            <Typography variant="body1" style={{ fontWeight: 600 }}>
                              {row.novoUsado || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box>
                            <Typography variant="overline" style={{ fontWeight: 'bold', color: '#666', fontSize: '0.7rem' }}>
                              Vendedor
                            </Typography>
                            <Typography variant="body1" style={{ fontWeight: 600 }}>
                              {row.vendedor || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Serviços e Taxas em colunas */}
                    {(row.vistoria || row.deslocamento || row.remarcacaoChassi || row.cartorio || 
                      row.placas || row.comunicacaoVenda || row.taxaRegistro || row.servicoDespachante || 
                      row.taxaLicenciamento || row.total) && (
                      <Box style={{ borderTop: '2px solid #e0e0e0', paddingTop: 16 }}>
                        <Typography variant="subtitle2" style={{ 
                          fontWeight: 'bold', 
                          color: '#2d5a3d',
                          marginBottom: 12,
                          fontSize: '1rem'
                        }}>
                          💰 Valores e Serviços
                        </Typography>
                        <Grid container spacing={2}>
                          {row.vistoria && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                                <Typography variant="caption" style={{ fontWeight: 'bold', color: '#666' }}>
                                  Vistoria
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: 'bold', color: '#2d5a3d' }}>
                                  {row.vistoria}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {row.deslocamento && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                                <Typography variant="caption" style={{ fontWeight: 'bold', color: '#666' }}>
                                  Deslocamento
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: 'bold', color: '#2d5a3d' }}>
                                  {row.deslocamento}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {row.remarcacaoChassi && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                                <Typography variant="caption" style={{ fontWeight: 'bold', color: '#666' }}>
                                  Remarcação Chassi
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: 'bold', color: '#2d5a3d' }}>
                                  {row.remarcacaoChassi}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {row.cartorio && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                                <Typography variant="caption" style={{ fontWeight: 'bold', color: '#666' }}>
                                  Cartório
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: 'bold', color: '#2d5a3d' }}>
                                  {row.cartorio}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {row.placas && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                                <Typography variant="caption" style={{ fontWeight: 'bold', color: '#666' }}>
                                  Placas
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: 'bold', color: '#2d5a3d' }}>
                                  {row.placas}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {row.comunicacaoVenda && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                                <Typography variant="caption" style={{ fontWeight: 'bold', color: '#666' }}>
                                  Comunicação Venda
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: 'bold', color: '#2d5a3d' }}>
                                  {row.comunicacaoVenda}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {row.taxaRegistro && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                                <Typography variant="caption" style={{ fontWeight: 'bold', color: '#666' }}>
                                  Taxa Registro
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: 'bold', color: '#2d5a3d' }}>
                                  {row.taxaRegistro}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {row.taxaLicenciamento && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                                <Typography variant="caption" style={{ fontWeight: 'bold', color: '#666' }}>
                                  Taxa Licenciamento
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: 'bold', color: '#2d5a3d' }}>
                                  {row.taxaLicenciamento}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {row.servicoDespachante && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                                <Typography variant="caption" style={{ fontWeight: 'bold', color: '#666' }}>
                                  Serviço Despachante
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: 'bold', color: '#2d5a3d' }}>
                                  {row.servicoDespachante}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {row.total && (
                            <Grid item xs={12} sm={4} md={3}>
                              <Box style={{ 
                                backgroundColor: '#2d5a3d', 
                                padding: 12, 
                                borderRadius: 8,
                                border: '2px solid #1e3d28'
                              }}>
                                <Typography variant="caption" style={{ fontWeight: 'bold', color: '#fff' }}>
                                  TOTAL
                                </Typography>
                                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#fff' }}>
                                  {row.total}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>

            {extractedData.length === 0 && (
              <Box style={{ textAlign: 'center', padding: 32 }}>
                <Typography variant="h6" color="textSecondary">
                  Nenhum dado foi extraído dos arquivos
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Diálogo do Google Sheets */}
        <Dialog 
          open={showGoogleSheetsDialog} 
          onClose={() => setShowGoogleSheetsDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <CloudDone style={{ color: '#4CAF50' }} />
              <Typography variant="h6">Planilha criada com sucesso!</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Sua planilha foi criada e está disponível no Google Sheets. Você pode:
            </Typography>
            <Box mt={2} mb={2}>
              <ul>
                <li>✅ Editar colaborativamente em tempo real</li>
                <li>✅ Compartilhar com sua equipe</li>
                <li>✅ Usar fórmulas e formatação do Google Sheets</li>
                <li>✅ Acessar de qualquer dispositivo</li>
              </ul>
            </Box>
            {googleSheetsUrl && (
              <TextField
                fullWidth
                variant="outlined"
                value={googleSheetsUrl}
                InputProps={{
                  readOnly: true,
                }}
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowGoogleSheetsDialog(false)}>
              Fechar
            </Button>
            {googleSheetsUrl && (
              <Button 
                variant="contained" 
                className={classes.primaryButton}
                onClick={() => window.open(googleSheetsUrl, '_blank')}
                startIcon={<Share />}
              >
                Abrir Planilha
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Pagina>
  );
}
