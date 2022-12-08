import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Button, Grid,
  IconButton, TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import EmojiPicker from 'emoji-picker-react';
import { useFormik } from 'formik';
import React from 'react';
import { FaEdit, FaPlay, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import DrawerComponent from '../components/DrawerComponent';

export default function MessageModels() {
  const navigate = useNavigate()

  const [isEditable, setisEditable] = React.useState(false);
  const [selectedEditableRow, setSelectedEditableRow] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [openEmoji, setOpenEmoji] = React.useState(false);

  const handleSubmitForm = (formValues) => {
    if (isEditable) {
      const newRowsArray = rows.filter(row => row.id !== selectedEditableRow.id)
      newRowsArray.push({
        ...selectedEditableRow,
        name: formValues.name,
        message: formValues.message,
      })
      localStorage.setItem("@messages-template", JSON.stringify(newRowsArray))
      setRows(newRowsArray)
      setisEditable(false)
    } else {
      const data = [...rows, {
        id: uuidv4(),
        name: formValues.name,
        message: formValues.message,
      }]
      localStorage.setItem("@messages-template", JSON.stringify(data))
      setRows(data)
    }

    formik.resetForm()
  }

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('É Obrigado inserir um nome para o modelo!').label('Nome'),
      message: Yup.string().required('É obrigatório preencher a mensagem!').label('WhatsApp'),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      message: '',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const columns = [
    { field: 'id', headerName: 'Id', flex: 1 },
    { field: 'name', headerName: 'Nome do Modelo', flex: 1 },
    { field: 'message', headerName: 'Mensagem', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      align: 'center',
      width: 110,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          setisEditable(true)
          setSelectedEditableRow(params.row)
          formik.setFieldValue("name", params.row.name)
          formik.setFieldValue("message", params.row.message)
        };

        const handleDelete = (e) => {
          e.stopPropagation();

          if (confirm(`Deseja remover este modelo?`)) {
            const newRowsArray = rows.filter(row => row.id !== params.row.id)
            localStorage.setItem("@messages-template", JSON.stringify(newRowsArray))
            setRows(newRowsArray)
          }
        };

        const handleSelectedModel = (e) => {
          e.stopPropagation();
          localStorage.setItem("@selected-messages-template", JSON.stringify(params.row))
          navigate("/")
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
            <Tooltip title="Enviar este modelo">
              <IconButton color="success" onClick={handleSelectedModel}>
                <FaPlay size={16} />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  React.useState(() => {
    const executeAsync = async () => {
      const response = localStorage.getItem("@messages-template")

      if (response === null) {
        localStorage.setItem("@messages-template", JSON.stringify([]))
      } else {
        setRows(JSON.parse(response))
      }
    }
    executeAsync()
  }, []);

  return (
    <DrawerComponent title="Modelos de mensagem">
      <Typography variant="h4">Modelos de mensagem</Typography>
      <Typography variant="body1">
        Digite a mensagens para salvar em seu aplicativo para enviar mais tarde.
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nome do modelo"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!formik.errors.name}
              helperText={formik.errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Mensagem"
              id="message"
              name="message"
              multiline
              rows={6}
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!formik.errors.message}
              helperText={formik.errors.message}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">
              Variáveis da mensagem
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2, mb: 2, gap: 1 }}>
              <Button
                variant='contained'
                onClick={() => {
                  formik.setFieldValue("message", `${formik.values.message} {primeiroNome} `)
                }}>
                {`{primeiroNome}`}
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  formik.setFieldValue("message", `${formik.values.message} {nomeCompleto} `)
                }}>
                {`{nomeCompleto}`}
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  formik.setFieldValue("message", `${formik.values.message} {telefone} `)
                }}>
                {`{telefone}`}
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  formik.setFieldValue("message", `${formik.values.message} {var1} `)
                }}>
                {`{var1}`}
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  formik.setFieldValue("message", `${formik.values.message} {var2} `)
                }}>
                {`{var2}`}
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  formik.setFieldValue("message", `${formik.values.message} {var3} `)
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
                      formik.setFieldValue("message", `${formik.values.message} ${emoji.emoji} `)
                    }}
                    theme={localStorage.getItem("@dark-theme") === null ? 'light' : localStorage.getItem("@dark-theme")}
                  />
                )
              }
            </Box>
          </Grid>
        </Grid>

        <Button
          type="submit"
          sx={{ width: '100%', mb: 4 }}
          variant="contained"
          startIcon={<SendIcon />}
        >
          Salvar mensagem
        </Button>
      </form>

      <Typography variant="h5">Lista de modelos</Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Adicione mensagens acima para salvar na sua lista de modelos.
      </Typography>


      <Box sx={{ height: 400, w: '100%', mt: 4 }}>
        <DataGrid
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
        />
      </Box>
    </DrawerComponent>
  )
}