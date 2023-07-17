
import { IconButton, Tooltip, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { GoPaperAirplane } from 'react-icons/go';
import { BiBot } from 'react-icons/bi';
import { FiUser } from 'react-icons/fi';
import { useState } from 'react';

import { Configuration, OpenAIApi } from 'openai';

export default function IAComponent() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [data, setData] = useState<any>([])

  const configuration = new Configuration({
    apiKey: "",
  });

  const openai = new OpenAIApi(configuration);

  const openaiErrorHandler = (error) => {
    // https://platform.openai.com/docs/guides/error-codes/api-errors
    switch (error.response.status) {
      case 400:
        return "Não foi possivel fazer a pesquisa."
      case 401:
        return "Não foi possivel fazer a pesquisa."
      case 429:
        return "Não foi possivel fazer a pesquisa."
      case 500:
        return "Não foi possivel fazer a pesquisa."
      case 503:
        return "Não foi possivel fazer a pesquisa."
      default:
        return "Não foi possivel fazer a pesquisa."
    }
  }

  const handleAskToAi = async () => {
    try {
      setIsLoading(true)

      setInputText('')

      const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [...data, { role: "user", content: inputText }],
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })

      setData([
        ...data,
        { role: "user", content: inputText },
        { role: "assistant", content: result.data.choices[0].message.content }
      ])

    } catch (error) {
      setError(openaiErrorHandler(error))
    } finally {
      setIsLoading(false)
    }

  }

  return (
    <Box
      width={400}
      height={600}
      position="relative"
      sx={{
        backgroundColor: "white",
        overflow: 'hidden',
      }}
    >
      <Box
        pt={1}
        pb={4}
        px={2}
        height={550}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflow: 'auto',
        }}
      >

        {
          data.length === 0
            ? (
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >

                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: (theme) => theme.palette.primary.light
                  }}
                >
                  <BiBot color="white" size={28} />
                </Box>

                <Typography variant='h5' mb={4}>
                  Selecione uma opção abaixo
                </Typography>
                <Button variant="contained" >
                  Ideias de mensagens de boas vindas para meus clientes!
                </Button>
                <Button variant="contained" >
                  Ideias de mensagens de Chama para a ação
                </Button>
                <Button variant="contained" >
                  Como enviar mensagens no WhatsApp sem ser bloqueado.
                </Button>

                <Typography variant={"body2"} mt={4}>
                  Ou inicie a conversa com a inteligência artificial
                </Typography>
              </Box>
            )
            : data.map((message, index) => (
              <Box
                key={index}
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: (theme) => theme.palette.primary.light
                  }}
                >
                  {
                    message.role === "user"
                      ? <FiUser color="white" size={24} />
                      : <BiBot color="white" size={24} />
                  }
                </Box>
                <Box
                  sx={{
                    paddingX: 2,
                    paddingY: 1,
                    borderRadius: 1,
                    width: "75%",
                    display: 'flex',
                    backgroundColor: message.role === "user" ? "#25D366" : "#CCC",
                    color: message.role === "user" ? "white" : "black"
                  }}
                >
                  <Typography variant="body2">
                    {
                      message.content
                    }
                  </Typography>
                </Box>
              </Box>
            ))
        }

        {
          isLoading && (
            <>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: (theme) => theme.palette.primary.light
                  }}
                >
                  <FiUser color="white" size={24} />
                </Box>
                <Box
                  sx={{
                    paddingX: 2,
                    paddingY: 1,
                    borderRadius: 1,
                    width: "75%",
                    display: 'flex',
                    backgroundColor: "#25D366",
                    color: "white"
                  }}
                >
                  <Typography variant="body2">
                    {
                      inputText
                    }
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: (theme) => theme.palette.primary.light
                  }}
                >
                  <BiBot color="white" size={24} />
                </Box>
                <Box
                  sx={{
                    paddingX: 2,
                    paddingY: 1,
                    borderRadius: 1,
                    width: "75%",
                    display: 'flex',
                    backgroundColor: "#CCC",
                  }}
                >
                  <Typography variant="body2">
                    <CircularProgress color='inherit' />
                  </Typography>
                </Box>
              </Box>
            </>
          )
        }

      </Box>
      <Box
        py={1}
        px={2}
        width={"100%"}
        display={"flex"}
        flexDirection={"row"}
        position={"absolute"}
        bottom={0}
        sx={{
          backgroundColor: "white",
        }}
        alignItems="center"
      >
        <TextField
          fullWidth
          id="outlined-ia-text-input"
          label="Digite sua pergunta aqui..."
          variant="outlined"
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          helperText={error}
          error={!!error}
        />
        <Tooltip title="Enviar mensagem">
          <IconButton size={"large"} onClick={() => {
            if (inputText.length === 0) {
              setError("Precisa digitar uma mensagem antes de enivar.")
            } else {
              setError('')
              handleAskToAi()
            }
          }} color="primary">
            <GoPaperAirplane />
          </IconButton>
        </Tooltip>

      </Box>
    </Box >

  )
}