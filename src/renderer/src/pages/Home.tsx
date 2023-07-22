import AccountCircle from '@mui/icons-material/AccountCircle'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SendIcon from '@mui/icons-material/Send'
import TableChartIcon from '@mui/icons-material/TableChart'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { pink } from '@mui/material/colors'
import {
  DataGrid,
  GridCsvExportMenuItem,
  GridPrintExportMenuItem,
  GridToolbarExportContainer,
  ptBR
} from '@mui/x-data-grid'
import { useSnack } from '@renderer/hooks/useSnack'
import EmojiPicker from 'emoji-picker-react'
import { useFormik } from 'formik'
import React from 'react'
import { BsCardImage } from 'react-icons/bs'
import { FaEdit, FaFilePdf, FaPlay, FaTrash } from 'react-icons/fa'
import { GoVideo } from 'react-icons/go'
import { PiFileAudioLight } from 'react-icons/pi'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import DrawerComponent from '../components/DrawerComponent'
import celular from '../utils/masks'

const GridToolbarExport = ({ csvOptions, printOptions, ...other }: object): JSX.Element => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem
      options={{
        ...csvOptions,
        fileName: 'customerDataBase',
        delimiter: ';',
        utf8WithBom: true
      }}
    />
    <GridPrintExportMenuItem
      options={{
        ...printOptions,
        hideFooter: true,
        hideToolbar: true,
        pageStyle:
          '.MuiDataGrid-root .MuiDataGrid-main { color: rgba(0, 0, 0, 0.87); padding: 2px }'
      }}
    />
  </GridToolbarExportContainer>
)

function Home(): JSX.Element {
  const { handleSetMessage } = useSnack()

  // ----------------------------------------------------------------
  const [isEditable, setisEditable] = React.useState(false)

  const [rows, setRows] = React.useState([])
  const [editableContact, setEditableContact] = React.useState()
  const [attachments, setAttachments] = React.useState([])
  const [message, setMessage] = React.useState('')
  const [isLoadingButton, setIsLoadingButton] = React.useState(false)
  const [openEmoji, setOpenEmoji] = React.useState(false)

  const [selectionStart, setSelectionStart] = React.useState()
  const inputMessageRef = React.useRef()

  const handleSubmitForm = (formValues: object): void => {
    if (isEditable) {
      const newRowsArray = rows.filter((row) => row.id !== editableContact.id)
      newRowsArray.push({
        ...editableContact,
        name: formValues.name,
        phone: formValues.phone
      })

      setRows(newRowsArray)
      setisEditable(false)
      formik.resetForm()
    } else {
      setRows((state: never[]): never[] => [
        ...state,
        {
          id: uuidv4(),
          name: formValues.name,
          phone: formValues.phone,
          status: false,
          statusInfo: 'Aguardando envio'
        }
      ])

      formik.resetForm()
    }
  }

  const handleSendSingleMessage = async (contact: object): Promise<void> => {
    if (message === '') return alert('Você não digitou a mensagem ainda')


  }

  const handleSendMessages = async (): Promise<void> => {
    if (message === '') return alert('Você não digitou a mensagem ainda')
    if (rows.length === 0) return alert('Você não incluiu contatos para o envio das mensagens')
  }

  const removeAttachment = (index: number): void => {
    const newArray = attachments.filter((_item, arrIndex) => arrIndex !== index)
    setAttachments(newArray)
  }

  const csvFileToArray = (string: string): void => {
    const csvRows = string.slice(0, string.lastIndexOf('\n')).split('\n')
    const array = csvRows.map((i) => {
      return {
        id: uuidv4(),
        name: i.replace('\r', '').split(';')[0],
        phone: celular(String(i.replace('\r', '').split(';')[1])),
        var1: i.replace('\r', '').split(';')[2],
        var2: i.replace('\r', '').split(';')[3],
        var3: i.replace('\r', '').split(';')[4],
        status: false,
        statusInfo: 'Aguardando envio'
      }
    })

    setRows((state: never[]): never[] => [...state, ...array])
  }

  const handleLoadAttachments = (event: object): void => {
    event.stopPropagation()
    const newItensAdded = Array.from(event.target.files)
    setAttachments([...attachments, ...newItensAdded])
  }

  const handleLoadCsv = (event: object): void => {
    const fileReader = new FileReader()
    const file = event.target.files[0]
    if (file) {
      fileReader.onload = (event: object): void => {
        const text = event.target.result
        csvFileToArray(text)
      }
      fileReader.readAsText(file)
    }
  }

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('Nome é obrigatório!').label('Nome'),
      phone: Yup.string().required('Whatsapp é obrigatório!').label('WhatsApp').min(14)
    })
  }, [])

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: ''
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values)
    }
  })

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
      renderCell: (params: object): JSX.Element => {
        if (!params.value) {
          return <CancelIcon sx={{ color: pink[500] }} />
        }
        return <CheckCircleIcon color="success" />
      }
    },
    {
      field: 'actions',
      headerName: 'Ações',
      align: 'center',
      width: 140,
      renderCell: (params: object): JSX.Element => {
        const onClick = (e: object): void => {
          e.stopPropagation()

          setEditableContact(params.row)
          setisEditable(true)

          formik.setFieldValue('name', params.row.name)
          formik.setFieldValue('phone', params.row.phone)

          return
        }

        const handleDelete = (e: object): void => {
          e.stopPropagation()

          if (confirm(`Deseja remover este contato?\n${params.row.name} - ${params.row.phone}`)) {
            const newRowsArray = rows.filter((row) => row.id !== params.row.id)
            setRows(newRowsArray)
          }

          return
        }

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
              <IconButton
                color="success"
                onClick={(event: object): void => {
                  event.stopPropagation()
                  handleSendSingleMessage(params.row)
                }}
              >
                <FaPlay size={16} />
              </IconButton>
            </Tooltip>
          </>
        )
      }
    }
  ]
  
  return (
    <>
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
              onSelect={(): void => {
                setSelectionStart(inputMessageRef?.current?.selectionStart)
              }}
              multiline
              rows={6}
              value={message}
              onChange={(e: object): void => setMessage(e.target.value)}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2, mb: 2, gap: 1 }}>
              <Button
                variant="contained"
                onClick={(): void => {
                  setMessage(
                    [
                      message.slice(0, selectionStart),
                      '{primeiroNome}',
                      message.slice(selectionStart)
                    ].join('')
                  )
                }}
              >
                {`{primeiroNome}`}
              </Button>
              <Button
                variant="contained"
                onClick={(): void => {
                  setMessage(
                    [
                      message.slice(0, selectionStart),
                      '{nomeCompleto}',
                      message.slice(selectionStart)
                    ].join('')
                  )
                }}
              >
                {`{nomeCompleto}`}
              </Button>
              <Button
                variant="contained"
                onClick={(): void => {
                  setMessage(
                    [
                      message.slice(0, selectionStart),
                      '{telefone}',
                      message.slice(selectionStart)
                    ].join('')
                  )
                }}
              >
                {`{telefone}`}
              </Button>
              <Button
                variant="contained"
                onClick={(): void => {
                  setMessage(
                    [
                      message.slice(0, selectionStart),
                      '{var1}',
                      message.slice(selectionStart)
                    ].join('')
                  )
                }}
              >
                {`{var1}`}
              </Button>
              <Button
                variant="contained"
                onClick={(): void => {
                  setMessage(
                    [
                      message.slice(0, selectionStart),
                      '{var2}',
                      message.slice(selectionStart)
                    ].join('')
                  )
                }}
              >
                {`{var2}`}
              </Button>
              <Button
                variant="contained"
                onClick={(): void => {
                  setMessage(
                    [
                      message.slice(0, selectionStart),
                      '{var3}',
                      message.slice(selectionStart)
                    ].join('')
                  )
                }}
              >
                {`{var3}`}
              </Button>
              <Button
                variant="contained"
                onClick={(): void => {
                  setOpenEmoji(!openEmoji)
                }}
              >
                Emojis
              </Button>
              {openEmoji && (
                <EmojiPicker
                  width="100%"
                  height="25em"
                  searchPlaceHolder="Pesquisar emojis..."
                  emojiVersion="3.0"
                  onEmojiClick={(emoji: object): void => {
                    setMessage(
                      [
                        message.slice(0, selectionStart),
                        `${emoji.emoji}`,
                        message.slice(selectionStart)
                      ].join('')
                    )
                  }}
                  theme={
                    localStorage.getItem('@dark-theme') === null
                      ? 'light'
                      : localStorage.getItem('@dark-theme')
                  }
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Button
              sx={{ width: '100%' }}
              variant="contained"
              component="label"
              startIcon={<AddAPhotoIcon />}
            >
              Adicionar arquivos
              <input
                id="uploadImages"
                hidden
                accept=".pdf,.mp3,.wav,.ogg,.jpeg,.jpg,.png,.gif,.bmp,.tiff,.webp,.mp4,.mov,.avi,.3gp,.wmv,.mkv"
                multiple
                type="file"
                onChange={(event: object): void => handleLoadAttachments(event)}
              />
            </Button>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {attachments.length > 0 ? (
                attachments.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: '100%',
                      minHeight: 42,
                      padding: 1,
                      borderRadius: 1,
                      marginTop: 1,
                      border: '1px solid #CCC',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    {item.type === 'application/pdf' && (
                      <Typography>
                        <FaFilePdf size={28} />
                      </Typography>
                    )}
                    {item.type.includes('image') && (
                      <Typography>
                        <BsCardImage size={28} />
                      </Typography>
                    )}
                    {item.type.includes('video') && (
                      <Typography>
                        <GoVideo size={28} />
                      </Typography>
                    )}
                    {item.type.includes('audio') && (
                      <Typography>
                        <PiFileAudioLight size={28} />
                      </Typography>
                    )}
                    <Typography>
                      {item.name.length > 20 ? item.name.substr(0, 20) + '...' : item.name}
                    </Typography>
                    <Typography>{(item.size / (1024 * 1024)).toFixed(3)} Mb</Typography>
                    <IconButton color="error" onClick={(): void => removeAttachment(index)}>
                      <FaTrash size={20} />
                    </IconButton>
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
                )
              }}
            />
            <TextField
              label="WhatsApp"
              id="phone"
              name="phone"
              inputProps={{ maxLength: 15 }}
              value={formik.values.phone}
              onChange={(e: object): void => {
                e.target.value = celular(e.target.value)
                formik.handleChange(e)
              }}
              onBlur={(e: object): void => {
                e.target.value = celular(e.target.value)
                formik.handleBlur(e)
              }}
              error={!!formik.errors.phone}
              helperText={formik.errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WhatsAppIcon />
                  </InputAdornment>
                )
              }}
            />
            <Button type="submit" variant="contained">
              {isEditable ? 'Salvar' : 'Adicionar'}
            </Button>
            {isEditable && (
              <Button
                onClick={(): void => {
                  formik.resetForm()
                  setisEditable(false)
                }}
                type="button"
                color="error"
                variant="contained"
              >
                Cancelar
              </Button>
            )}
          </Box>
        </form>

        <Box sx={{ display: 'flex', mt: 4, gap: 1 }}>
          <Button variant="contained" component="label" startIcon={<TableChartIcon />}>
            Carregar CSV
            <input
              hidden
              accept=".csv"
              multiple
              type="file"
              onChange={(event: object): void => handleLoadCsv(event)}
            />
          </Button>
          {rows.length > 0 && (
            <>
              <Button
                variant="contained"
                color="error"
                startIcon={<FaTrash size={16} />}
                onClick={(): void => {
                  if (confirm('Deseja remover todos os contatos da tabela de envios?')) {
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
                onClick={(): void => {
                  if (
                    confirm(
                      'Deseja remover todos os contatos que receberam mensagens da tabela de envios?'
                    )
                  ) {
                    const newArray = rows.filter((row) => !row.status)
                    setRows(newArray)
                  }
                }}
              >
                Remover enviados
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ height: 500, w: '100%', mt: 4 }}>
          <DataGrid
            onCellFocusOut={(): void => console.log('Olha')}
            columnVisibilityModel={{
              id: false
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
                '.MuiDataGrid-main': { color: 'rgba(0, 0, 0, 0.87)' }
              }
            }}
          />
        </Box>

        <Button
          onClick={handleSendMessages}
          sx={{
            width: '100%',
            mt: 4,
            mb: 4
          }}
          variant="contained"
          disabled={isLoadingButton}
          startIcon={
            isLoadingButton ? <CircularProgress size={22} color="inherit" /> : <SendIcon />
          }
        >
          {isLoadingButton ? 'Aguarde, Enviando Mensagens' : 'Enviar mensagens'}
        </Button>
      </DrawerComponent>
    </>
  )
}

export default Home
