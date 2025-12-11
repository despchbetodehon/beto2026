
import React from 'react';
import dynamic from 'next/dynamic';

const Produto = dynamic(() => import('@/components/enterprises/betodespa/ocrreq/requerimento/Produtoset'), {
  ssr: false,
});

const PageProduto: React.FC = () => {
  return (
    <Produto />
  );
};

export default PageProduto;
