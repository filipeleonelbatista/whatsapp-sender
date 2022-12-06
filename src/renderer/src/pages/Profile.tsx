import { Avatar, Typography } from '@mui/material';
import DrawerComponent from "../components/DrawerComponent";

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