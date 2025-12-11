import Link from 'next/link';
import { Box, Stack } from '@mui/material';
import { FaHome , FaBuilding } from 'react-icons/fa';

const BotoesNavegacao = () => {
  return (
    <Box display="flex" gap={2} sx={{ backgroundColor: '#1f1f1f', padding: '8px', borderRadius: '8px' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', borderRadius: '50px' }}>
        <FaHome /> Inicio
      </Link>
      <Link href="/enterprises" style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', borderRadius: '50px' }}>
        <FaBuilding /> EnterPrises
      </Link>
    </Box>
  );
};

export default BotoesNavegacao;
