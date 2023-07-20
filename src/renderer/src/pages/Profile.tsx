import SyncIcon from '@mui/icons-material/Sync'
import { Avatar, Box, Button, Typography } from '@mui/material'
import DrawerComponent from '../components/DrawerComponent'

export default function Profile() {
  return (
    <DrawerComponent title="Perfil">
      <Typography variant="h4">Perfil</Typography>
      <Typography variant="body1">Dados de perfil do usuário</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', mt: 4, gap: 2 }}>
        <Avatar
          variant="square"
          src="https://github.com/filipeleonelbatista.png"
          sx={{ borderRadius: 1, width: 200, height: 300 }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body1">
              <strong>Nome:</strong>
              Filipe Batista
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong>
              filipe.batista@gmail.com
            </Typography>
            <Typography variant="body1">
              <strong>Status de ativação:</strong>
              Ativado até 31/12/2022
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1">
              <strong>Sincronisação de dados:</strong>
              Ultima sincronisação feita em 31/12/2022 18:00
            </Typography>

            <Button
              onClick={() => {}}
              sx={{ width: '100%', mt: 2 }}
              variant="contained"
              startIcon={<SyncIcon />}
            >
              Sincronizar agora
            </Button>
            <Typography variant="caption">
              Sincronizações são feitas para enviar os dados salvos da aplicação para os nossos
              servidores
            </Typography>
          </Box>
        </Box>
      </Box>
    </DrawerComponent>
  )
}
