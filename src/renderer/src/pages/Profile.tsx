import DrawerComponent from "../components/DrawerComponent";
import {
  Box,
  Button, IconButton, Typography
} from '@mui/material';

export default function Profile() {
  return (
    <DrawerComponent title="Perfil">
      <Typography variant="h4">Perfil</Typography>
      <Typography variant="body1">
        Dados de perfil do usuário
      </Typography>

      <Avatar variant="square" src="https://github.com/filipeleonelbatista.png"/>
    </DrawerComponent>
  )
}