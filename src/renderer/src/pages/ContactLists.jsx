import {
  Box,
  Button, IconButton, Typography
} from '@mui/material';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import DrawerComponent from "../components/DrawerComponent";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

export default function ContactLists() {

  const [rows, setRows] = React.useState([]);

  const columns = [
    { field: 'id', headerName: 'Id', flex: 1 },
    { field: 'list', headerName: 'Titulo', flex: 1 },
    { field: 'contact_lenght', headerName: 'Qtd Contatos', flex: 1 },
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
          </>
        );
      },
    },
  ];

  return (
    <DrawerComponent title="Listas de contatos">
      <Typography variant="h4">Listas de contatos</Typography>
      <Typography variant="body1">
        Digite a mensagem que será enviada para os contatos do Whatsapp
      </Typography>
      <Box sx={{ display: 'flex', mt: 4, gap: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlaylistAddIcon />}
          onClick={() => { }}
        >
          Nova Lista
        </Button>
      </Box>
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
  );
}