import {
  Box,
  Button, IconButton, Typography
} from '@mui/material';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import DrawerComponent from "../components/DrawerComponent";

import AccountCircle from '@mui/icons-material/AccountCircle';
import {
  InputAdornment, TextField, Tooltip
} from '@mui/material';
import { GridCsvExportMenuItem, GridPrintExportMenuItem, GridToolbarExportContainer } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';


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

export default function Extractor() {
  const navigate = useNavigate()

  const [config, setConfig] = React.useState({
    start: 5000,
    initiate_send: 8000,
    check_error: 2000,
    send_message: 1000,
    finalize_send: 5000,
  })

  const [rows, setRows] = React.useState([]);
  const [contactList, setContactList] = React.useState([]);

  const [open, setOpen] = React.useState(false);

  const handleSubmitForm = (formValues) => {

    window.electron.extractContacts(formValues.name, config)

    formik.resetForm();
  }

  const formSchema = React.useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('Nome é obrigatório!').label('Nome'),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '❤Família Batista❤',
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
    {
      field: 'actions',
      headerName: 'Ações',
      align: 'center',
      width: 80,
      renderCell: (params) => {
        const handleDelete = (e) => {
          e.stopPropagation();

          if (confirm(`Deseja remover este contato?\n${params.row.name} - ${params.row.phone}`)) {
            const newRowsArray = rows.filter(row => row.id !== params.row.id)
            setRows(newRowsArray)
          }

          return;
        };

        return (
          <Tooltip title="Excluir">
            <IconButton color="error" onClick={handleDelete}>
              <FaTrash size={16} />
            </IconButton>
          </Tooltip>
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
        setContactList(JSON.parse(response))
      }

      if (localStorage.getItem("@config") !== null) {
        const configStorage = JSON.parse(localStorage.getItem("@config"))
        setConfig(configStorage)
      }
    }
    executeAsync()
  }, [])

  return (
    <DrawerComponent title={"Extrator de contatos"}>

      <Typography variant="h4">Extrator de contatos</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Extrai contatos de grupos específicos no seu WhatsApp
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Nome do grupo"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.name}
            helperText={formik.errors.name ? formik.errors.name : "Digite o nome exatamente como está no WhatsApp"}
          />

          <Button type="submit" variant="contained">
            Iniciar
          </Button>
        </Box>
      </form>

      <Box sx={{ height: 400, w: '100%', mt: 4 }}>
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

    </DrawerComponent >
  );
}