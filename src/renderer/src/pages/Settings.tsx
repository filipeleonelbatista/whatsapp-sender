import DrawerComponent from "../components/DrawerComponent";
import { Box, Typography } from '@mui/material';

export default function Settings() {
  return (
    <DrawerComponent title="Configurações">
      <Typography variant="h4">Configurações</Typography>
      <Typography variant="body1">
        Configuração do aplicativo 
      </Typography>
      <Box sx={{mt: 4}}>

      </Box>
    </DrawerComponent>
  )
}