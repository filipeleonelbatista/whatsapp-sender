import AccountCircle from '@mui/icons-material/AccountCircle';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import TableChartIcon from '@mui/icons-material/TableChart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  circularProgressClasses,
  Grid,
  IconButton,
  InputAdornment, Slide, TextField, Tooltip, Typography
} from '@mui/material';
import { pink } from '@mui/material/colors';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Snackbar from '@mui/material/Snackbar';
import Switch from '@mui/material/Switch';
import { DataGrid, GridCsvExportMenuItem, GridPrintExportMenuItem, GridToolbarExportContainer, ptBR } from '@mui/x-data-grid';
import EmojiPicker from 'emoji-picker-react';
import { useFormik } from 'formik';
import React from 'react';
import { FaEdit, FaPlay, FaTrash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import DrawerComponent from '../components/DrawerComponent';
import celular from '../utils/masks';

const GridToolbarExport = ({ csvOptions, printOptions, ...other }) => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem
      options={{
        ...csvOptions,
        fileName: 'customerDataBase',
        delimiter: ';',
        utf8WithBom: true,
      }} />
    <GridPrintExportMenuItem
      options={{
        ...printOptions,
        hideFooter: true,
        hideToolbar: true,
        pageStyle: '.MuiDataGrid-root .MuiDataGrid-main { color: rgba(0, 0, 0, 0.87); padding: 2px }',
      }}
    />
  </GridToolbarExportContainer>
);

function Home() {

  const [isLoading, setisLoading] = React.useState(false);
  const [isEditable, setisEditable] = React.useState(false);

  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState({
    message: '',
    title: '',
    severity: 'error'
  });

  const handleClick = () => {
    setOpenSnackBar(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };
  const [config, setConfig] = React.useState({
    start: 5000,
    initiate_send: 8000,
    check_error: 2000,
    send_message: 1000,
    finalize_send: 5000,
  })

  const [rows, setRows] = React.useState([]);
  const [editableContact, setEditableContact] = React.useState();
  const [attachments, setAttachments] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [isLoadingButton, setIsLoadingButton] = React.useState(false);
  const [openEmoji, setOpenEmoji] = React.useState(false);

  const [selectionStart, setSelectionStart] = React.useState();
  const inputMessageRef = React.useRef();

  const registerLog = (initiated_at, currentRows) => {
    const results = {
      rows: currentRows,
      message,
      status: true,
      initiated_at,
      finalized_at: Date.now()
    }

    setTimeout(() => {
      const dataLog = localStorage.getItem("@logs")

      if (dataLog !== null) {
        const logs = JSON.parse(dataLog)
        localStorage.setItem("@logs", JSON.stringify([{ id: uuidv4(), ...results }, ...logs]))
      } else {
        localStorage.setItem("@logs", JSON.stringify([{ id: uuidv4(), ...results }]))
      }
    }, 3000)
  }

  const handleSubmitForm = (formValues) => {
    if (isEditable) {
      const newRowsArray = rows.filter(row => row.id !== editableContact.id)
      newRowsArray.push({
        ...editableContact,
        name: formValues.name,
        phone: formValues.phone
      })

      setRows(newRowsArray);
      setisEditable(false);
      formik.resetForm();

    } else {
      setRows((state) => [
        ...state,
        {
          id: uuidv4(),
          name: formValues.name,
          phone: formValues.phone,
          status: false,
          statusInfo: 'Aguardando envio',
        },
      ]);

      formik.resetForm();
    }
  };

  const handleSendSingleMessage = async (contact) => {
    if (message === "") return alert("Você não digitou a mensagem ainda")

    try {
      setIsLoadingButton(true)
      setisLoading(true)
      const initiated_at = Date.now()

      await window.electron.createGlobalInstanceOfDriver();

      await window.electron.loginWhatsapp(config)

      const request = await window.electron.sendMessage(contact, message, attachments, config)

      if (!request.status) {
        setSnackbarMessage({
          message: `Ao tentar enviar a mensagem para ${contact.name} telefone ${contact.phone}, o erro ${request.error} `,
          title: 'Problemas no envio',
          severity: 'error'
        })

        handleClick()
      }

      const updatedRow = {
        ...contact,
        statusInfo: request.status ? "Mensagem Enviada" : request.error,
        status: request.status,
      }

      setRows(prevState => prevState.map(contact => contact.id === updatedRow.id ? { ...contact, ...updatedRow } : contact))

      await window.electron.closeGlobalInstanceOfDriver();

      registerLog(initiated_at, rows)

      setSnackbarMessage({
        message: `Mensagen enviada com sucesso!`,
        title: 'Envio concluido',
        severity: 'success'
      })
      handleClick()

    } catch (error) {
      setSnackbarMessage({
        message: `Houve um erro ao tentar enviar as mensagens. \nContate o administrador. \n\n${error}`,
        title: 'Tivemos um problema',
        severity: 'error'
      })
      handleClick()
    } finally {
      setIsLoadingButton(false)
      setisLoading(false)
    }
  }

  const handleSendMessages = async () => {
    if (message === "") return alert("Você não digitou a mensagem ainda")
    if (rows.length === 0) return alert("Você não incluiu contatos para o envio das mensagens")

    try {
      setIsLoadingButton(true)
      const initiated_at = Date.now()

      await window.electron.createGlobalInstanceOfDriver();

      await window.electron.loginWhatsapp(config)

      for (const contact of rows) {
        const request = await window.electron.sendMessage(contact, message, attachments, config)

        if (!request.status) {
          setSnackbarMessage({
            message: `Ao tentar enviar a mensagem para ${contact.name} telefone ${contact.phone}, o erro ${request.error} `,
            title: 'Problemas no envio',
            severity: 'error'
          })
        }

        const updatedRow = {
          ...contact,
          statusInfo: request.status ? "Mensagem Enviada" : request.error,
          status: request.status,
        }

        setRows(prevState => prevState.map(contact => contact.id === updatedRow.id ? { ...contact, ...updatedRow } : contact))

      }

      await window.electron.closeGlobalInstanceOfDriver();

      registerLog(initiated_at, rows)

      setSnackbarMessage({
        message: `Mensagens enviadas com sucesso!`,
        title: 'Envio concluido',
        severity: 'success'
      })
      handleClick()

      if (localStorage.getItem("@selected-messages-template") !== null) {
        localStorage.removeItem("@selected-messages-template")
      }

      if (localStorage.getItem("@selected-contact-list") !== null) {
        localStorage.removeItem("@selected-contact-list")
      }

    } catch (error) {
      if (String(error).includes("ChromeDriver could not be found")) {
        setSnackbarMessage({
          message: `O Chromedriver não está instalado ou configurado. Faça a instalação corretamente ou\nContate o administrador.`,
          title: 'Tivemos um problema',
          severity: 'error'
        })
      } else {
        setSnackbarMessage({
          message: `Houve um erro ao tentar enviar as mensagens. \nContate o administrador. \n\n${error}`,
          title: 'Tivemos um problema',
          severity: 'error'
        })
      }
      handleClick()
    } finally {
      setIsLoadingButton(false)
    }
  };

  const handleRemoveImage = (index) => {
    const newArray = attachments.filter((item, arrIndex) => arrIndex !== index)
    setAttachments(newArray);
  };

  const csvFileToArray = (string) => {
    const csvRows = string.slice(0, string.lastIndexOf('\n')).split('\n');
    const array = csvRows.map((i) => {
      return {
        id: uuidv4(),
        name: i.replace('\r', '').split(';')[0],
        phone: celular(String(i.replace('\r', '').split(';')[1])),
        var1: i.replace('\r', '').split(';')[2],
        var2: i.replace('\r', '').split(';')[3],
        var3: i.replace('\r', '').split(';')[4],
        status: false,
        statusInfo: 'Aguardando envio',
      };
    });

    setRows((state) => [...state, ...array]);
  };

  const handleLoadAttachments = (event) => {
    event.stopPropagation()
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const arrImg = [];
      for (let i = 0; i < files.length; i++) {
        arrImg.push({
          path: files[i].path,
          url: String(URL.createObjectURL(files[i]))
        });
      }
      setAttachments(arrImg);
    }
  };

  const handleLoadCsv = (event) => {
    const fileReader = new FileReader();
    const file = event.target.files[0];
    if (file) {
      fileReader.onload = (event) => {
        const text = event.target.result;
        csvFileToArray(text);
      };
      fileReader.readAsText(file);
    }
  };

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('Nome é obrigatório!').label('Nome'),
      phone: Yup.string()
        .required('Whatsapp é obrigatório!')
        .label('WhatsApp')
        .min(14),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const columns = [
    { field: 'id', headerName: 'Id', flex: 1 },
    { field: 'name', headerName: 'Nome', flex: 1 },
    { field: 'phone', headerName: 'Telefone', flex: 1 },
    { field: 'var1', headerName: 'Var 1', flex: 1 },
    { field: 'var2', headerName: 'Var 2', flex: 1 },
    { field: 'var3', headerName: 'Var 3', flex: 1 },
    { field: 'statusInfo', headerName: 'Informação', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      align: 'center',
      width: 80,
      renderCell: (params) => {
        if (!params.value) {
          return <CancelIcon sx={{ color: pink[500] }} />;
        }
        return <CheckCircleIcon color="success" />;
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      align: 'center',
      width: 140,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();

          setEditableContact(params.row)
          setisEditable(true)

          formik.setFieldValue("name", params.row.name)
          formik.setFieldValue("phone", params.row.phone)

          return;
        };

        const handleDelete = (e) => {
          e.stopPropagation();

          if (confirm(`Deseja remover este contato?\n${params.row.name} - ${params.row.phone}`)) {
            const newRowsArray = rows.filter(row => row.id !== params.row.id)
            setRows(newRowsArray)
          }

          return;
        };

        return (
          <>
            <Tooltip title="Editar">
              <IconButton color="success" onClick={onClick}>
                <FaEdit size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton color="error" onClick={handleDelete}>
                <FaTrash size={16} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Enviar somente para este contato">
              <IconButton color="success" onClick={(event) => {
                event.stopPropagation()
                handleSendSingleMessage(params.row)
              }}>
                <FaPlay size={16} />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  React.useEffect(() => {
    if (localStorage.getItem("@selected-messages-template") !== null) {
      const selectedMessage = JSON.parse(localStorage.getItem("@selected-messages-template"))
      setMessage(selectedMessage.message)
    }
    if (localStorage.getItem("@selected-contact-list") !== null) {
      const selectedContactsRows = JSON.parse(localStorage.getItem("@selected-contact-list"))
      setRows(selectedContactsRows)
    }

    if (localStorage.getItem("@config") !== null) {
      const configStorage = JSON.parse(localStorage.getItem("@config"))
      setConfig(configStorage)
    }
  }, [])

  return (
    <>
      <Snackbar
        sx={{ mt: 8 }}
        open={openSnackBar}
        autoHideDuration={snackbarMessage.severity === 'error' ? 30000 : 6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={(props) => <Slide {...props} direction="left" />}
      >
        <Alert onClose={handleClose} severity={snackbarMessage.severity} sx={{ maxWidth: '400px', width: '100%' }}>
          <AlertTitle>{snackbarMessage.title}</AlertTitle>
          {snackbarMessage.message}
        </Alert>
      </Snackbar>
      {
        isLoading && (
          <Box sx={{
            position: 'absolute',
            width: "100vw",
            height: '100vh',
            zIndex: 10000,
            backgroundColor: "#00000064",
            overflow: "hidden",
            display: 'flex',
            alignItems: 'center',
            justifyContent: "center"
          }}>
            <CircularProgress
              variant="indeterminate"
              disableShrink
              color='primary'
              sx={{
                animationDuration: '550ms',
                [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: 'round',
                },
              }}
              size={50}
              thickness={6}
            />
          </Box>
        )
      }
      <DrawerComponent title="Envio de mensagens">
        <Typography variant="h4">Mensagem</Typography>
        <Typography variant="body1">
          Digite a mensagem que será enviada para os contatos do Whatsapp
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
          <Grid item xs={6}>
            <TextField
              inputRef={inputMessageRef}
              fullWidth
              label="Mensagem"
              id="message"
              name="message"
              onSelect={(event) => {
                setSelectionStart(inputMessageRef?.current?.selectionStart)
              }}
              multiline
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2, mb: 2, gap: 1 }}>
              <Button
                variant='contained'
                onClick={() => {
                  setMessage([message.slice(0, selectionStart), "{primeiroNome}", message.slice(selectionStart)].join(''))
                }}>
                {`{primeiroNome}`}
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  setMessage([message.slice(0, selectionStart), "{nomeCompleto}", message.slice(selectionStart)].join(''))
                }}>
                {`{nomeCompleto}`}
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  setMessage([message.slice(0, selectionStart), "{telefone}", message.slice(selectionStart)].join(''))
                }}>
                {`{telefone}`}
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  setMessage([message.slice(0, selectionStart), "{var1}", message.slice(selectionStart)].join(''))
                }}>
                {`{var1}`}
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  setMessage([message.slice(0, selectionStart), "{var2}", message.slice(selectionStart)].join(''))
                }}>
                {`{var2}`}
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  setMessage([message.slice(0, selectionStart), "{var3}", message.slice(selectionStart)].join(''))
                }}>
                {`{var3}`}
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  setOpenEmoji(!openEmoji)
                }}>
                Emojis
              </Button>
              {
                openEmoji && (
                  <EmojiPicker
                    width="100%" height="25em"
                    searchPlaceHolder="Pesquisar emojis..."
                    emojiVersion="3.0"
                    onEmojiClick={(emoji) => {
                      setMessage([message.slice(0, selectionStart), `${emoji.emoji}`, message.slice(selectionStart)].join(''))
                    }}
                    theme={localStorage.getItem("@dark-theme") === null ? 'light' : localStorage.getItem("@dark-theme")}
                  />
                )
              }
            </Box>
            {/* 
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={isNewLineReturnCharacter}
                    onChange={(event) => setisNewLineReturnCharacter(event.target.checked)}
                  />
                }
                label={<Typography variant="caption">Enviar cada linha digitada separadamente</Typography>} />
            </FormGroup>
            <Typography variant="caption" color="#999">
              Cada vez que você apertar enter ele enviará a linha separadamente.
              Caso ativado, enviará tudo em um bloco de mensagem
              * Enviar cada linha não é compatível com emojis
            </Typography>
             */}
          </Grid>
          <Grid item xs={6}>
            <Button
              sx={{ width: '100%' }}
              variant="contained"
              component="label"
              startIcon={<AddAPhotoIcon />}
            >
              Anexar imagens
              <input
                id="uploadImages"
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={(event) => handleLoadAttachments(event)}
              />
            </Button>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              {attachments.length > 0 ? (
                attachments.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: '64px',
                      height: '64px',
                      p: 1,
                      borderRadius: 1,
                      border: '1px solid #000',
                      m: 0.5,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      size="small"
                      sx={{
                        color: '#fff',
                        backgroundColor: '#d32f2f',
                        position: 'absolute',
                        zIndex: 100,
                        bottom: 0,
                        right: 0,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <img
                      src={item.url}
                      alt="Prévia da imagem selecionada"
                      style={{ height: '64px' }}
                    />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ mt: 4 }}>
                  Nenhum arquivo enviado
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5">Lista de envio</Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Adicione contatos para enviar a mensagem definida acima.
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Nome"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!formik.errors.name}
              helperText={formik.errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="WhatsApp"
              id="phone"
              name="phone"
              inputProps={{ maxLength: 15 }}
              value={formik.values.phone}
              onChange={(e) => {
                e.target.value = celular(e.target.value);
                formik.handleChange(e);
              }}
              onBlur={(e) => {
                e.target.value = celular(e.target.value);
                formik.handleBlur(e);
              }}
              error={!!formik.errors.phone}
              helperText={formik.errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WhatsAppIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained">
              {isEditable ? 'Salvar' : 'Adicionar'}
            </Button>
            {isEditable && (
              <Button onClick={() => {
                formik.resetForm()
                setisEditable(false)
              }} type="button" color="error" variant="contained">
                Cancelar
              </Button>
            )}
          </Box>
        </form>

        <Box sx={{ display: 'flex', mt: 4, gap: 1 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<TableChartIcon />}
          >
            Carregar CSV
            <input
              hidden
              accept=".csv"
              multiple
              type="file"
              onChange={(event) => handleLoadCsv(event)}
            />
          </Button>
          {
            rows.length > 0 && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<FaTrash size={16} />}
                  onClick={() => {
                    if (confirm("Deseja remover todos os contatos da tabela de envios?")) {
                      setRows([])
                    }
                  }}
                >
                  Limpar tabela
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<FaTrash size={16} />}
                  onClick={() => {
                    if (confirm("Deseja remover todos os contatos que receberam mensagens da tabela de envios?")) {
                      const newArray = rows.filter(row => !row.status)
                      setRows(newArray)
                    }
                  }}
                >
                  Remover enviados
                </Button>
              </>
            )
          }
        </Box>

        <Box sx={{ height: 500, w: '100%', mt: 4 }}>
          <DataGrid
            onCellFocusOut={() => { }}
            columnVisibilityModel={{
              id: false,
            }}
            columns={columns}
            rows={rows}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection={false}
            disableSelectionOnClick={true}
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            components={{ Toolbar: GridToolbarExport }}
            sx={{
              '@media print': {
                '.MuiDataGrid-main': { color: 'rgba(0, 0, 0, 0.87)' },
              },
            }}
          />
        </Box>

        <Button
          onClick={handleSendMessages}
          sx={{
            width: '100%',
            mt: 4,
            mb: 4,
          }}
          variant="contained"
          disabled={isLoadingButton}
          startIcon={isLoadingButton ? <CircularProgress size={22} color="inherit" /> : <SendIcon />}
        >
          {
            isLoadingButton ? "Aguarde, Enviando Mensagens" : "Enviar mensagens"
          }
        </Button>
      </DrawerComponent>
    </>
  );
}

export default Home;
