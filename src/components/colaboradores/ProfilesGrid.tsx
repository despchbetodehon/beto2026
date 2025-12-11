import React from 'react';
import { Grid, Card, CardContent, Typography, Chip } from '@mui/material';

interface Profile {
  id: string;
  nome: string;
  descricao: string;
  icon: React.ReactNode;
  color: string;
  usuarios: number;
}

interface Props {
  profiles: Profile[];
}

const ProfilesGrid: React.FC<Props> = ({ profiles }) => {
  return (
    <Grid container spacing={2}>
      {profiles.map((profile) => (
        <Grid item xs={12} sm={6} md={6} lg={4} key={profile.id}>
          <Card sx={{ borderRadius: 2, boxShadow: 4, background: 'background.paper', height: '100%' }}>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                {profile.icon}
                <Typography variant="h6" sx={{ marginLeft: 1, fontWeight: 'bold' }}>{profile.nome}</Typography>
              </div>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>{profile.descricao}</Typography>
              <Chip label={`${profile.usuarios} usuários`} size="small" sx={{ backgroundColor: profile.color, color: 'white' }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfilesGrid;
