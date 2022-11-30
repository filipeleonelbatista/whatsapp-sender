import AccountCircle from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import TableChartIcon from '@mui/icons-material/TableChart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment, TextField,
  Typography
} from '@mui/material';
import { pink } from '@mui/material/colors';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import DrawerComponent from './components/DrawerComponent';

import celular from './utils/masks';


function Home() {
  const [rows, setRows] = React.useState([
    {
      id: uuidv4(),
      name: 'Teste 9',
      phone: celular('51999999999'),
      status: false,
      statusInfo: 'Aguardando envio',
    },
    {
      id: uuidv4(),
      name: 'Filipe',
      phone: celular('51992736445'),
      status: false,
      statusInfo: 'Aguardando envio',
    },
    {
      id: uuidv4(),
      name: 'Lisandra Novo',
      phone: celular('51990163942'),
      status: false,
      statusInfo: 'Aguardando envio',
    },
    {
      id: uuidv4(),
      name: 'Lisandra Avon',
      phone: celular('51984941682'),
      status: false,
      statusInfo: 'Aguardando envio',
    }
  ]);
  const [attachments, setAttachments] = React.useState([]);
  const [attachmentsPreview, setAttachmentsPreview] = React.useState([]);
  const [message, setMessage] = React.useState('Teste da v1 *{primeiroNome}*');

  const handleSubmitForm = (formValues) => {
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
  };

  const handleSendMessages = async () => {
    console.log('handleSendMessages', rows);
    if (message === "") return alert("Você não digitou a mensagem ainda")
    if (rows.length === 0) return alert("Você não incluiu contatos para o envio das mensagens")

    try {
      const results = await window.electron.initiateSendProcess(rows, message);

      setRows(results.rows);

      console.log("Finalizou a handleSendMessages com sucesso!")
    } catch (error) {
      console.log("Finalizou a handleSendMessages com erro!", error)
    }
  };


  const handleRemoveImage = (index) => {
    const newArray = attachments.filter((item, arrIndex) => arrIndex !== index);
    const newArrayPreview = attachmentsPreview.filter(
      (item, arrIndex) => arrIndex !== index
    );
    setAttachments(newArray);
    setAttachmentsPreview(newArrayPreview);
  };

  const csvFileToArray = (string) => {
    const csvRows = string.slice(0, string.lastIndexOf('\n')).split('\n');
    const array = csvRows.map((i) => {
      return {
        id: uuidv4(),
        name: i.replace('\r', '').split(';')[0],
        phone: celular(String(i.replace('\r', '').split(';')[1])),
        status: false,
        statusInfo: 'Aguardando envio',
      };
    });

    setRows((state) => [...state, ...array]);
  };

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
      name: 'Teste',
      phone: '(99) 99999-9999',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const columns = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    { field: 'phone', headerName: 'Telefone', flex: 1 },
    { field: 'statusInfo', headerName: 'Informação', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      align: 'center',
      width: 100,
      renderCell: (params) => {
        if (!params.value) {
          return <CancelIcon sx={{ color: pink[500] }} />;
        }
        return <CheckCircleIcon color="success" />;
      },
    },
  ];

  return (
    <DrawerComponent title="Envio de mensagens">
      <Typography variant="h4">Mensagem</Typography>
      <Typography variant="body1">
        Digite a mensagem que será enviada para os contatos do Whatsapp
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
            helperText="Use as variáveis {primeiroNome}, {nomeCompleto}, {telefone} para usar as informações da lista de envio"
          // value={formik.values.name}
          // onChange={formik.handleChange}
          // onBlur={formik.handleBlur}
          // error={formik.errors.name ? true : false}
          // helperText={formik.errors.name}
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            sx={{ width: '100%' }}
            variant="contained"
            component="label"
            startIcon={<TableChartIcon />}
          >
            Anexar imagens
            <input
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
            Adicionar
          </Button>
        </Box>
      </form>

      <Box sx={{ mt: 4 }}>
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
      </Box>

      <Box sx={{ height: 400, w: '100%', mt: 4 }}>
        <DataGrid
          columns={columns}
          rows={rows}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          disableSelectionOnClick
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>

      <Button
        onClick={handleSendMessages}
        sx={{ width: '100%', mt: 4, mb: 4 }}
        variant="contained"
        startIcon={<SendIcon />}
      >
        Enviar mensagens
      </Button>
    </DrawerComponent>
  );
}

export default Home;
