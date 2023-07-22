import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material'
import { useSnack } from '@renderer/hooks/useSnack'
import { useWaSocket } from '@renderer/hooks/useWaSocket'
import { useState } from 'react'
import DrawerComponent from '../components/DrawerComponent'

function Connections(): JSX.Element {
  const { handleSetMessage } = useSnack()
  const { hasSocket, list, handleCreateWs } = useWaSocket()

  const [newwebsocketText, setNewwebsocketText] = useState('')

  return (
    <DrawerComponent title="Conexões">
      <Box marginBottom={8}>
        <Typography variant="h4">
          Você ainda não possio um WhatsApp cadastrado no atendimento
        </Typography>
        <Typography variant="body1">Vamos começar</Typography>
        <Typography variant="body2">
          Para iniciar digite um nome para este WhatsApp que vai usar. Depois você poderá criar
          outros clientes de WhatsApp para outros números se desejar.
        </Typography>
      </Box>

      <Box>
        <TextField
          label="Cliente do WhatsApp"
          id="newwebsocketText"
          name="newwebsocketText"
          inputProps={{ maxLength: 15 }}
          value={newwebsocketText}
          onChange={(event: object): void => {
            setNewwebsocketText(event.target.value)
          }}
          onBlur={(event: object): void => {
            setNewwebsocketText(event.target.value)
          }}
          error={newwebsocketText.length === 0}
          helperText={
            newwebsocketText.length === 0
              ? 'O texto não pode estar vazio'
              : 'Digite um nome para o cliente do WhatsApp'
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <WhatsAppIcon />
              </InputAdornment>
            )
          }}
        />
        <Button
          onClick={(): void => {
            if (newwebsocketText.length > 0) {
              handleCreateWs(newwebsocketText)
            }
          }}
        >
          Criar nova conexão
        </Button>


        <Button
          onClick={(): void => {
            window.api.connectToWhatsApp()
          }}
        >
          Teste
        </Button>
      </Box>
    </DrawerComponent>
  )
}

export default Connections
