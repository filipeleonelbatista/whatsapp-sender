import {
  Box, IconButton, Typography
} from '@mui/material';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import React from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import DrawerComponent from "../components/DrawerComponent";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Tooltip } from '@mui/material';
import { pink } from '@mui/material/colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Logs() {
  const [isView, setIsView] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [selectedHistory, setSelectedHistory] = React.useState();

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
  ];

  const [logs, setLogs] = React.useState([]);

  const columnsList = [
    { field: 'id', headerName: 'Id', flex: 1 },
    {
      field: 'initiated_at', headerName: 'Data de inicio', flex: 1, renderCell: (params) => (
        <Typography>
          {new Date(params.row.initiated_at).toLocaleDateString('pt-br', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          })}
        </Typography>
      )
    },
    {
      field: 'finalized_at', headerName: 'Data de termino', flex: 1, renderCell: (params) => (
        <Typography>
          {new Date(params.row.finalized_at).toLocaleDateString('pt-br', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          })}
        </Typography>
      )
    },
    { field: 'message', headerName: 'Mensagem', flex: 1 },
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
      width: 120,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          console.log("Log", params.row)
          setRows(params.row.rows)
          setSelectedHistory(params.row)
          setIsView(true)
        };

        return (
          <Tooltip title="Visualizar Log">
            <IconButton color="success" onClick={onClick}>
              <FaEye size={16} />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  React.useEffect(() => {
    const executeAsync = async () => {
      const response = localStorage.getItem("@logs")

      if (response === null) {
        localStorage.setItem("@logs", JSON.stringify([]))
      } else {
        setLogs(JSON.parse(response))
      }
    }
    executeAsync()
  }, [])

  return (
    <DrawerComponent title={"Histórico de envios"}>
      {
        isView ? (
          <>
            <IconButton onClick={() => {
              setIsView(false)
              setRows([])
              setSelectedHistory(null)
            }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4">Envios do dia {" "}
              {new Date(selectedHistory.initiated_at).toLocaleDateString('pt-br', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}
            </Typography>
            <Typography variant="caption">
              Inicio {new Date(selectedHistory.initiated_at).toLocaleDateString('pt-br', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}
            </Typography>
            {" "}
            <Typography variant="caption">
              Inicio {new Date(selectedHistory.finalized_at).toLocaleDateString('pt-br', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}
            </Typography>
            <Typography variant="body1">
              Mensagem: {selectedHistory.message}
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
          </>
        ) : (
          <>
            <Typography variant="h4">Histórico de envios</Typography>
            <Typography variant="body1">
              Veja históricos de envios feitos por você
            </Typography>

            <Box sx={{ height: 400, w: '100%', mt: 4 }}>
              <DataGrid
                columnVisibilityModel={{
                  id: false,
                }}
                columns={columnsList}
                rows={logs}
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