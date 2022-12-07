import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button, Grid,
  IconButton, TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import React from 'react';
import { FaEdit, FaPlay, FaTrash } from 'react-icons/fa';

import DrawerComponent from '../components/DrawerComponent';

import SendIcon from '@mui/icons-material/Send';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

export default function MessageModels() {
  const navigate = useNavigate()

  const [isEditable, setisEditable] = React.useState(false);
  const [selectedEditableRow, setSelectedEditableRow] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [attachments, setAttachments] = React.useState([]);
  const [attachmentsPreview, setAttachmentsPreview] = React.useState([]);

  const handleSubmitForm = (formValues) => {
    if (isEditable) {
      const newRowsArray = rows.filter(row => row.id !== selectedEditableRow.id)
      newRowsArray.push({
        ...selectedEditableRow,
        name: formValues.name,
        message: formValues.message,
        attachments: formValues.attachments,
      })
      localStorage.setItem("@messages-template", JSON.stringify(newRowsArray))
      setRows(newRowsArray)
      setisEditable(false)
    } else {
      const data = [...rows, {
        id: uuidv4(),
        name: formValues.name,
        message: formValues.message,
        attachments: formValues.attachments,
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
      attachments: Yup.mixed(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      message: '',
      attachments: [],
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
      field: 'attachments',
      headerName: 'Anexos',
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography>
            {params.row.attachments.length > 0 ? `${params.row.attachments.length} Anexo${params.row.attachments.length > 1 ? 's' : ''}` : 'Sem anexos'}
          </Typography>
        )
      }
    },
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

          if (attachments.length > 0) {
            formik.setFieldValue("attachments", params.row.attachments)
          }

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

  const handleLoadAttachments = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const arrImg = [];
      for (let i = 0; i < files.length; i++) {
        arrImg.push(String(URL.createObjectURL(files[i])));
      }

      setAttachments(files);
      formik.setFieldValue("attachments", (files))
      setAttachmentsPreview(arrImg);
    }
  };

  const handleRemoveImage = (index) => {
    const newArray = attachments.filter((item, arrIndex) => arrIndex !== index);
    const newArrayPreview = attachmentsPreview.filter(
      (item, arrIndex) => arrIndex !== index
    );

    if (newArray.length === 0) {
      setAttachments([]);
      formik.setFieldValue("attachments", [])
      setAttachmentsPreview([]);
    } else {
      setAttachments(newArray);
      formik.setFieldValue("attachments", newArray)
      setAttachmentsPreview(newArrayPreview);
    }
  };

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
              helperText="Use as variáveis {primeiroNome}, {nomeCompleto}, {telefone}, {var1}, {var2} e {var3} para usar as informações da lista de envio"
            />
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
              {attachmentsPreview.length > 0 ? (
                attachmentsPreview.map((item, index) => (
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
                      src={item}
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
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          disableSelectionOnClick={true}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>
    </DrawerComponent>
  )
}