import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button, Grid,
  IconButton, TextField,
  Typography
} from '@mui/material';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import React from 'react';
import { FaPlay } from 'react-icons/fa';

import DrawerComponent from '../components/DrawerComponent';

import SendIcon from '@mui/icons-material/Send';


export default function MessageModels() {

  const [rows, setRows] = React.useState([]);

  const [attachments, setAttachments] = React.useState([]);
  const [attachmentsPreview, setAttachmentsPreview] = React.useState([]);
  const [message, setMessage] = React.useState('');


  const columns = [
    { field: 'id', headerName: 'Id', flex: 1 },
    { field: 'message', headerName: 'Mensagem', flex: 1 },
    { field: 'filesArray', headerName: 'Anexos', flex: 1 },
    { field: 'updated_at', headerName: 'Data atualização', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      align: 'center',
      width: 80,
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
            <IconButton color="success" onClick={onClick}>
              <FaEdit size={16} />
            </IconButton>
            <IconButton color="error" onClick={handleDelete}>
              <FaTrash size={16} />
            </IconButton>
            <IconButton color="error" onClick={() => { }}>
              <FaPlay size={16} />
            </IconButton>
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
      setAttachmentsPreview([]);
    } else {
      setAttachments(newArray);
      setAttachmentsPreview(newArrayPreview);
    }
  };

  return (
    <DrawerComponent title="Modelos de mensagem">
      <Typography variant="h4">Modelos de mensagem</Typography>
      <Typography variant="body1">
        Digite a mensagens para salvar em seu aplicativo para enviar mais tarde.
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
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
        onClick={() => { }}
        sx={{ width: '100%', mb: 4 }}
        variant="contained"
        startIcon={<SendIcon />}
      >
        Salvar mensagem
      </Button>

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