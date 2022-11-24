import AccountCircle from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SendIcon from '@mui/icons-material/Send';
import TableChartIcon from '@mui/icons-material/TableChart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, Button, Grid, IconButton, InputAdornment, Modal, TextField, Typography } from "@mui/material";
import { pink } from '@mui/material/colors';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import React from "react";
import * as Yup from 'yup';
import DrawerComponent from "./components/DrawerComponent";

import { v4 as uuidv4 } from 'uuid';
import { celular } from "./utils/masks";

import whatsAuthImage from './assets/whatsAuth.png';
import api from './services/api';

function App() {

  const [rows, setRows] = React.useState([])
  const [attachments, setAttachments] = React.useState([])
  const [attachmentsPreview, setAttachmentsPreview] = React.useState([])
  const [message, setMessage] = React.useState('')

  const [whatsappSession, setWhatsappSession] = React.useState(false)
  const [QrCode, setQrCode] = React.useState()

  const [open, setOpen] = React.useState(false);

  const handleSendMessages = async () => {
    try {
      let newRows = []
      for (const contact of rows) {

        const response = await api.post("/send", {
          number: `+55${contact.phone.replace(/\D/g, "")}`,
          message: message.replaceAll("{primeiroNome}", contact.name.split(" ")[0]).replaceAll("{nomeCompleto}", contact.name).replaceAll("{telefone}", contact.phone)
        })

        if (response.status === 200) {
          newRows.push({
            ...contact,
            status: true,
            statusInfo: "Enviado"
          })
        }

      }
      setRows(newRows)

    } catch (err) {
      console.log(err)
    }
  }

  const handleOpen = async () => {
    try {
      // Obter na api o qrcode
      const response = await api.get("/status")
      if (response.data == {}) {
        alert("O Serviço está iniciando")
        return
      }

      setQrCode(response.data.qr_code.base64Qr)
      setOpen(true);

    } catch (error) {

    }
    finally { }
  }

  const handleCheckConnect = async () => {
    try {
      const response = await api.get("/status")
      console.log(response)
      if (response.data == {}) {
        alert("O Serviço está iniciando")
        return
      }
      if (response.data.connected) {
        setWhatsappSession(true)
        handleClose()
      } else {
        alert("Conexão não foi realizada!")
      }

    } catch (error) {

    }
    finally { }
  }

  const handleClose = () => setOpen(false);

  const handleRemoveImage = (index) => {
    const newArray = attachments.filter((item, arrIndex) => arrIndex !== index)
    const newArrayPreview = attachmentsPreview.filter((item, arrIndex) => arrIndex !== index)
    setAttachments(newArray)
    setAttachmentsPreview(newArrayPreview)
  }

  const csvFileToArray = string => {
    const csvRows = string.slice(0, string.lastIndexOf("\n")).split("\n");
    const array = csvRows.map(i => {
      return {
        id: uuidv4(),
        name: i.replace("\r", "").split(";")[0],
        phone: celular(String(i.replace("\r", "").split(";")[1])),
        status: false,
        statusInfo: "Aguardando envio",
      }
    });

    setRows(state => [...state, ...array])

  };

  const handleLoadAttachments = (event) => {
    const files = Array.from(event.target.files)
    if (files.length > 0) {
      const arrImg = []
      for (var i = 0; i < files.length; i++) {
        arrImg.push(String(URL.createObjectURL(files[i])))
      }
      setAttachments(files)
      setAttachmentsPreview(arrImg)
    }
    // setAttachments(event.target.files)
  }

  const handleLoadCsv = (event) => {
    const fileReader = new FileReader();
    const file = event.target.files[0]
    if (file) {
      fileReader.onload = (event) => {
        const text = event.target.result;
        csvFileToArray(text);
      }
      fileReader.readAsText(file)
    }
  }

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("Nome é obrigatório!").label("Nome"),
      phone: Yup.string().required("Whatsapp é obrigatório!").label("WhatsApp").min(14),
    })
  }, [])

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: ''
    },
    validationSchema: formSchema,
    onSubmit: values => {
      handleSubmitForm(values)
    },
  });

  const handleSubmitForm = (formValues) => {
    setRows(state => [...state, {
      id: uuidv4(),
      name: formValues.name,
      phone: formValues.phone,
      status: false,
      statusInfo: "Aguardando envio"
    }])
  }

  const columns = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    { field: 'phone', headerName: 'Telefone', flex: 1 },
    { field: "statusInfo", headerName: "Informação", flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      align: 'center',
      width: 100,
      renderCell: (params) => {
        if (!params.value) {
          return <CancelIcon sx={{ color: pink[500] }} />
        } else {
          return <CheckCircleIcon color="success" />
        }
      }
    },
  ];

  React.useEffect(() => {
    handleCheckConnect()
  }, [])

  return (
    <DrawerComponent title="Envio de mensagens">
      {
        whatsappSession ? (
          <>
            <Typography variant="h4">
              Mensagem
            </Typography>
            <Typography variant="body1">
              Digite a mensagem que será enviada para os contatos do Whatsapp
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2, mb: 4, }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mensagem"
                  id="message"
                  name="message"
                  multiline
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  helperText="Use as variáveis {primeiroNome}, {nomeCompleto}, {telefone} para usar as informações da lista de envio"
                // value={formik.values.name}
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                // error={formik.errors.name ? true : false}
                // helperText={formik.errors.name}
                />
              </Grid>
              <Grid item xs={6}>

                <Button sx={{ width: "100%" }} variant="contained" component="label" startIcon={<TableChartIcon />}>
                  Anexar imagens
                  <input hidden accept="image/*" multiple type="file" onChange={(event) => handleLoadAttachments(event)} />
                </Button>
                <Box sx={{ display: "flex", flexWrap: "wrap", flexDirection: "row", justifyContent: "center" }}>
                  {
                    attachmentsPreview.length > 0 ? attachmentsPreview.map((item, index) => (
                      <Box key={index} sx={{ width: "64px", height: "64px", p: 1, borderRadius: 1, border: "1px solid #000", m: 0.5, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <IconButton onClick={() => handleRemoveImage(index)} size="small" sx={{ color: "#fff", backgroundColor: "#d32f2f", position: "absolute", zIndex: 100, bottom: 0, right: 0 }}>
                          <DeleteIcon />
                        </IconButton>
                        <img src={item} alt="Prévia da imagem selecionada" style={{ height: "64px", }} />
                      </Box>
                    )) : (
                      <Typography variant="body2" sx={{ mt: 4 }}>
                        Nenhum arquivo enviado
                      </Typography>
                    )
                  }
                </Box>
              </Grid>
            </Grid>

            <Typography variant="h5">
              Lista de envio
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Adicione contatos para enviar a mensagem definida acima.
            </Typography>

            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Nome"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.name ? true : false}
                  helperText={formik.errors.name}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>,
                  }}
                />
                <TextField
                  label="WhatsApp"
                  id="phone"
                  name="phone"
                  inputProps={{ maxLength: 15 }}
                  value={formik.values.phone}
                  onChange={(e) => {
                    e.target.value = celular(e.target.value)
                    formik.handleChange(e)
                  }}
                  onBlur={(e) => {
                    e.target.value = celular(e.target.value)
                    formik.handleBlur(e)
                  }}
                  error={formik.errors.phone ? true : false}
                  helperText={formik.errors.phone}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      <WhatsAppIcon />
                    </InputAdornment>,
                  }}
                />
                <Button type="submit" variant="contained">Adicionar</Button>
              </Box>
            </form>

            <Box sx={{ mt: 4 }}>
              <Button variant="contained" component="label" startIcon={<TableChartIcon />}>
                Carregar CSV
                <input hidden accept=".csv" multiple type="file" onChange={(event) => handleLoadCsv(event)} />
              </Button>
            </Box>

            <Box sx={{ height: 400, w: '100%', mt: 4 }}>
              <DataGrid
                columns={columns}
                rows={rows}
                checkboxSelection={false}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              />
            </Box>

            <Button onClick={handleSendMessages} sx={{ width: "100%", mt: 4, mb: 4 }} variant="contained" startIcon={<SendIcon />}>
              Enviar mensagens
            </Button>
          </>
        ) : (
          <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
            <img src={whatsAuthImage} alt="Autorizar Whatsapp" height={450} />
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography variant='h5' sx={{ mb: 2 }}>
                Autorizar o WhatsApp
              </Typography>
              <Typography variant='body2'>
                Permita o aplicativo acessar o whatsapp lendo o qrCode.
              </Typography>
              <ol>
                <li>Abra o WhatsApp no seu celular.</li>
                <li>
                  Toque em <strong>Mais opções {" "}
                    <svg height="24px" viewBox="0 0 24 24" width="24px"><rect fill="#f2f2f2" height="24" rx="3" width="24"></rect><path d="m12 15.5c.825 0 1.5.675 1.5 1.5s-.675 1.5-1.5 1.5-1.5-.675-1.5-1.5.675-1.5 1.5-1.5zm0-2c-.825 0-1.5-.675-1.5-1.5s.675-1.5 1.5-1.5 1.5.675 1.5 1.5-.675 1.5-1.5 1.5zm0-5c-.825 0-1.5-.675-1.5-1.5s.675-1.5 1.5-1.5 1.5.675 1.5 1.5-.675 1.5-1.5 1.5z" fill="#818b90"></path></svg>
                  </strong>
                  ou <strong>Configurações {" "}
                    <svg width="24" height="24" viewBox="0 0 24 24"><rect fill="#F2F2F2" width="24" height="24" rx="3"></rect><path d="M12 18.69c-1.08 0-2.1-.25-2.99-.71L11.43 14c.24.06.4.08.56.08.92 0 1.67-.59 1.99-1.59h4.62c-.26 3.49-3.05 6.2-6.6 6.2zm-1.04-6.67c0-.57.48-1.02 1.03-1.02.57 0 1.05.45 1.05 1.02 0 .57-.47 1.03-1.05 1.03-.54.01-1.03-.46-1.03-1.03zM5.4 12c0-2.29 1.08-4.28 2.78-5.49l2.39 4.08c-.42.42-.64.91-.64 1.44 0 .52.21 1 .65 1.44l-2.44 4C6.47 16.26 5.4 14.27 5.4 12zm8.57-.49c-.33-.97-1.08-1.54-1.99-1.54-.16 0-.32.02-.57.08L9.04 5.99c.89-.44 1.89-.69 2.96-.69 3.56 0 6.36 2.72 6.59 6.21h-4.62zM12 19.8c.22 0 .42-.02.65-.04l.44.84c.08.18.25.27.47.24.21-.03.33-.17.36-.38l.14-.93c.41-.11.82-.27 1.21-.44l.69.61c.15.15.33.17.54.07.17-.1.24-.27.2-.48l-.2-.92c.35-.24.69-.52.99-.82l.86.36c.2.08.37.05.53-.14.14-.15.15-.34.03-.52l-.5-.8c.25-.35.45-.73.63-1.12l.95.05c.21.01.37-.09.44-.29.07-.2.01-.38-.16-.51l-.73-.58c.1-.4.19-.83.22-1.27l.89-.28c.2-.07.31-.22.31-.43s-.11-.35-.31-.42l-.89-.28c-.03-.44-.12-.86-.22-1.27l.73-.59c.16-.12.22-.29.16-.5-.07-.2-.23-.31-.44-.29l-.95.04c-.18-.4-.39-.77-.63-1.12l.5-.8c.12-.17.1-.36-.03-.51-.16-.18-.33-.22-.53-.14l-.86.35c-.31-.3-.65-.58-.99-.82l.2-.91c.03-.22-.03-.4-.2-.49-.18-.1-.34-.09-.48.01l-.74.66c-.39-.18-.8-.32-1.21-.43l-.14-.93a.426.426 0 00-.36-.39c-.22-.03-.39.05-.47.22l-.44.84-.43-.02h-.22c-.22 0-.42.01-.65.03l-.44-.84c-.08-.17-.25-.25-.48-.22-.2.03-.33.17-.36.39l-.13.88c-.42.12-.83.26-1.22.44l-.69-.61c-.15-.15-.33-.17-.53-.06-.18.09-.24.26-.2.49l.2.91c-.36.24-.7.52-1 .82l-.86-.35c-.19-.09-.37-.05-.52.13-.14.15-.16.34-.04.51l.5.8c-.25.35-.45.72-.64 1.12l-.94-.04c-.21-.01-.37.1-.44.3-.07.2-.02.38.16.5l.73.59c-.1.41-.19.83-.22 1.27l-.89.29c-.21.07-.31.21-.31.42 0 .22.1.36.31.43l.89.28c.03.44.1.87.22 1.27l-.73.58c-.17.12-.22.31-.16.51.07.2.23.31.44.29l.94-.05c.18.39.39.77.63 1.12l-.5.8c-.12.18-.1.37.04.52.16.18.33.22.52.14l.86-.36c.3.31.64.58.99.82l-.2.92c-.04.22.03.39.2.49.2.1.38.08.54-.07l.69-.61c.39.17.8.33 1.21.44l.13.93c.03.21.16.35.37.39.22.03.39-.06.47-.24l.44-.84c.23.02.44.04.66.04z" fill="#818b90"></path></svg>
                  </strong>
                  e selecione {" "}
                  <strong>Aparelhos conectados</strong>.
                </li>
                <li>
                  Toque em <strong>Conectar um aparelho</strong>.
                </li>
                <li>
                  Aponte seu celular para esta tela para capturar o código.
                </li>
              </ol>

              <Button onClick={handleOpen} sx={{ width: "100%", mt: 4, mb: 4 }} variant="contained" startIcon={<QrCodeIcon />}>
                Abrir QrCode
              </Button>
            </Box>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <Typography variant="h6" component="h2">
                  Autorizar o WhatsApp
                </Typography>
                <Typography sx={{ mb: 2, textAlign: "center" }}>
                  Permita o aplicativo acessar o whatsapp lendo o qrCode.
                </Typography>

                <img src={QrCode} alt="qrcode" />

                <Button onClick={handleCheckConnect} sx={{ width: "100%", mt: 4, mb: 4 }} variant="contained" startIcon={<QrCodeIcon />}>
                  Conectei o aparelho
                </Button>
              </Box>
            </Modal>
          </Box>
        )
      }

    </DrawerComponent >
  )
}

export default App
