import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
import { pink } from "@mui/material/colors";
import { Box } from "@mui/system";
import {
  DataGrid,
  GridColDef,
  GridCsvExportMenuItem,
  GridPrintExportMenuItem,
  GridToolbarExportContainer,
  ptBR
} from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { FaEdit, FaPlay, FaTrash } from "react-icons/fa";
import DrawerComponent from "../components/DrawerComponent";
import {
  api, listAssinantes
} from "../services/api";

interface User {
  createdAt: string;
  email: string;
  id: string;
  isActive: boolean;
  nome: string;
  paymentDate: string;
  publishedAt: string;
  requestAccessDate: string;
  selectedPlan: number;
  senha: string;
  whatsapp: string | null;
  isAdmin: boolean | null;
  updatedAt: string;
}


const GridToolbarExport = ({ csvOptions, printOptions, ...other }) => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem
      options={{
        ...csvOptions,
        fileName: "customerDataBase",
        delimiter: ";",
        utf8WithBom: true,
        includeHeaders: false
      }}
    />
    <GridPrintExportMenuItem
      options={{
        ...printOptions,
        hideFooter: true,
        hideToolbar: true,
        pageStyle:
          ".MuiDataGrid-root .MuiDataGrid-main { color: rgba(0, 0, 0, 0.87); padding: 2px }",
      }}
    />
  </GridToolbarExportContainer>
);

export default function AdminDashboard() {
  const [users, setUsers] = React.useState<User[]>([]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", minWidth: 100, flex: 1 },
    { field: "nome", headerName: "Nome", minWidth: 150, flex: 1 },
    { field: "whatsapp", headerName: "Telefone", minWidth: 150, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
    {
      field: "createdAt",
      headerName: "Criação",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography>
            {new Date(params.value).toLocaleString("pt-BR")}
          </Typography>
        )
      }
    },
    {
      field: "updatedAt",
      headerName: "Ultima atualização",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography>
            {new Date(params.value).toLocaleString("pt-BR")}
          </Typography>
        )
      }
    },
    {
      field: "requestAccessDate",
      headerName: "Solicitação de acesso",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography>
            {new Date(params.value).toLocaleString("pt-BR")}
          </Typography>
        )
      }
    },
    {
      field: "paymentDate",
      headerName: "Data do pagamento",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography>
            {new Date(params.value).toLocaleString("pt-BR")}
          </Typography>
        )
      }
    },
    {
      field: "vencido",
      headerName: "Status assinatura",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const paymentDate = new Date(params.row.paymentDate);
        const expirationDate = new Date(paymentDate);
        expirationDate.setMonth(paymentDate.getMonth() + params.row.selectedPlan);

        const currentDate = new Date();
        const diffTime = currentDate.getTime() - expirationDate.getTime();
        
        const dias =  Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return (
          <Typography>
            {new Date() > expirationDate ? "Vencido a " + dias + " dias" : "Em dia"}
          </Typography>
        )
      }
    },
    { field: "selectedPlan", headerName: "Plano/Meses", minWidth: 100, flex: 1 },
    {
      field: "isActive",
      headerName: "Status",
      align: "center",
      width: 80,
      renderCell: (params) => {
        if (!params.value) {
          return <CancelIcon sx={{ color: pink[500] }} />;
        }
        return <CheckCircleIcon color="success" />;
      },
    },
  ];

  const handleLoadUsers = async () => {
    const assinantesResponse = await api.post("", listAssinantes);

    const assinantes: User[] = assinantesResponse.data.data.assinantes.map((assinante: any) => ({
      createdAt: assinante.createdAt,
      email: assinante.email,
      id: assinante.id,
      isActive: assinante.isActive,
      nome: assinante.nome,
      paymentDate: assinante.paymentDate,
      publishedAt: assinante.publishedAt,
      requestAccessDate: assinante.requestAccessDate,
      selectedPlan: assinante.selectedPlan,
      senha: assinante.senha,
      whatsapp: assinante.whatsapp,
      isAdmin: assinante.isAdmin,
      updatedAt: assinante.updatedAt,
    }));

    setUsers(assinantes);
  };

  useEffect(() => {
    handleLoadUsers();
  }, [])

  return (
    <DrawerComponent title="Blog">
      <Typography variant="h5">Painel administrativo</Typography>
      <Typography variant="body1">
        Gerencia as assinaturas do aplicativo
      </Typography>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box sx={{ height: 500, w: "100%", mt: 4 }}>
          <DataGrid
            onCellFocusOut={() => { }}
            columnVisibilityModel={{
              id: false,
              createdAt: false,
              updatedAt: false,
              paymentDate: false,
              requestAccessDate: false,
            }}
            columns={columns}
            rows={users}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection={false}
            disableSelectionOnClick={true}
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            components={{ Toolbar: GridToolbarExport }}
            sx={{
              "@media print": {
                ".MuiDataGrid-main": { color: "rgba(0, 0, 0, 0.87)" },
              },
            }}
          />
        </Box>
      </Box>
    </DrawerComponent>
  );

}
