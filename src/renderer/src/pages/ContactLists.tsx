import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import {
  Box,
  Button, IconButton, Typography
} from '@mui/material';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import React from 'react';
import { FaEdit, FaPlay, FaTrash } from 'react-icons/fa';
import DrawerComponent from "../components/DrawerComponent";

import AccountCircle from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TableChartIcon from '@mui/icons-material/TableChart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  InputAdornment, TextField, Tooltip
} from '@mui/material';
import { pink } from '@mui/material/colors';
import { GridCsvExportMenuItem, GridPrintExportMenuItem, GridToolbarExportContainer } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';


import celular from '../utils/masks';
import { useNavigate } from 'react-router-dom';


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

export default function ContactLists() {
  const navigate = useNavigate()

  const [rows, setRows] = React.useState([]);
  const [selectedListForEdition, setSelectedListForEdition] = React.useState();

  const [title, setTitle] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [isEditable, setisEditable] = React.useState(false);

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
          </>
        );
      },
    },
  ];

  const [contactLists, setContactLists] = React.useState([]);

  const columnsList = [
    { field: 'id', headerName: 'Id', flex: 1 },
    { field: 'title', headerName: 'Titulo', flex: 1 },
    {
      field: 'rows',
      headerName: 'Qtd Contatos',
      flex: 1,
      renderCell: (params) => (
        <Typography>
          {params.row.rows.length}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Ações',
      align: 'center',
      width: 120,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();

          setSelectedListForEdition(params.row)
          setRows(params.row.rows)
          setTitle(params.row.title)
          setOpen(true)
        };

        const handleDelete = (e) => {
          e.stopPropagation();

          if (confirm(`Deseja remover esta lista de contatos contato?\n${params.row.title}`)) {
            const newRowsArray = contactLists.filter(row => row.id !== params.row.id)
            setContactLists(newRowsArray)
            localStorage.setItem('@contact-lists', JSON.stringify(newRowsArray))
          }
        };

        const handleSelectedModel = (e) => {
          e.stopPropagation();
          localStorage.setItem("@selected-contact-list", JSON.stringify(params.row.rows))
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
            <Tooltip title="Enviar para esta lista">
              <IconButton color="success" onClick={handleSelectedModel}>
                <FaPlay size={16} />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  React.useEffect(() => {
    const executeAsync = async () => {
      const response = localStorage.getItem("@contact-lists")

      if (response === null) {
        localStorage.setItem("@contact-lists", JSON.stringify([]))
      } else {
        setContactLists(JSON.parse(response))
      }
    }
    executeAsync()
  }, [])

  return (

    <DrawerComponent title={open ? "Criar lista de contatos" : "Listas de contatos"}>
      {open ? (
        <>
          <Typography variant="h4">Criar lista de contatos</Typography>
          <Typography variant="body1">
            Crie sua lista de contatos conforme desejar
          </Typography>
          <Box sx={{ display: 'flex', mt: 4, mb: 4, gap: 2 }}>
            <TextField
              label="Nome da lista"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={title === ''}
              helperText={title === '' ? "Coloque nome na lista de contatos" : "Nome da lista de contatos"}
            />
          </Box>
          <Box sx={{ display: 'flex', mt: 4, mb: 4, gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlaylistAddIcon />}
              onClick={() => {
                const data = {
                  id: uuidv4(),
                  title: title === '' ? 'Lista de contatos' : title,
                  rows,
                }

                setContactLists([...contactLists, data])
                localStorage.setItem('@contact-lists', JSON.stringify([...contactLists, data]))
                setOpen(false)
              }}
            >
              Salvar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<FaTrash size={14} />}
              onClick={() => {
                setOpen(false)
                setTitle('')
                setRows([])
                formik.resetForm()
              }}
            >
              Cancelar
            </Button>
          </Box>
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

          <Box sx={{ display: 'flex', mt: 4, gap: 4 }}>
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
          </Box>

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
              components={{ Toolbar: GridToolbarExport }}
              sx={{
                '@media print': {
                  '.MuiDataGrid-main': { color: 'rgba(0, 0, 0, 0.87)' },
                },
              }}
            />
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4">Listas de contatos</Typography>
          <Typography variant="body1">
            Crie listas para usar no envio de mensagens
          </Typography>
          <Box sx={{ display: 'flex', mt: 4, gap: 4 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlaylistAddIcon />}
              onClick={() => {
                setOpen(true)
                setTitle('')
                setRows([])
                formik.resetForm()
              }}
            >
              Nova Lista
            </Button>
          </Box>
          <Box sx={{ height: 400, w: '100%', mt: 4 }}>
            <DataGrid
              columnVisibilityModel={{
                id: false,
              }}
              columns={columnsList}
              rows={contactLists}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection={false}
              disableSelectionOnClick={true}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />
          </Box>

        </>
      )
      }
    </DrawerComponent >
  );
}