import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineMobile } from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import DrawerComponent from "../components/DrawerComponent";

import { FaPlay } from "react-icons/fa";
import SendIcon from "@mui/icons-material/Send";
import useToast from "../hooks/useToast";
import { DataGrid, ptBR } from "@mui/x-data-grid";

export default function CreateInstances() {
  const { addToast } = useToast();
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [instancesArray, setInstancesArray] = useState<any[]>([]);

  const columns = [
    { field: "id", headerName: "Id", flex: 1 },
    { field: "name", headerName: "Nome", flex: 1 },
    {
      field: "status",
      headerName: "Testar",
      align: "center",
      width: 80,
      renderCell: (params) => {
        return (
          <Tooltip title="Testar">
            <IconButton
              color="success"
              onClick={() => {
                window.electron.testInstance(params.id);
              }}
            >
              <FaPlay size={16} />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("Nome é obrigatório!").label("Nome"),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    try {
      setIsLoadingButton(true);

      const data = {
        id: uuidv4(),
        name: formValues.name,
        createdAt: Date.now(),
      };

      await window.electron.createInstanceOfWhatsApp(data);

      localStorage.setItem(
        "@instances",
        JSON.stringify([...instancesArray, data]),
      );

      setInstancesArray([...instancesArray, data]);
    } catch (error) {
      if (String(error).includes("target window already closed")) {
        addToast({
          message: `A janela da automação foi fechada pelo usuário`,
          title: "Janela fechada pelo usuário",
          severity: "warning",
        });
      } else if (String(error).includes("Wait timed out")) {
        const local = String(error)
          .replace(
            "Error: Waiting for element to be located By(css selector, ",
            "",
          )
          .split("\nWait");

        addToast({
          message: `O Sistema não conseguiu encontrar a interface específica e encerrou o programa. Elemento não encontrado ${local[0]}`,
          title: "Tivemos um problema",
          severity: "error",
        });
      } else if (String(error).includes("ChromeDriver could not be found")) {
        addToast({
          message: `O Chromedriver não está instalado ou configurado. Faça a instalação corretamente ou\nContate o administrador.`,
          title: "Tivemos um problema",
          severity: "error",
        });
      } else {
        addToast({
          message: `Houve um erro ao tentar enviar as mensagens. \nContate o administrador. \n\n${error}`,
          title: "Tivemos um problema",
          severity: "error",
        });
      }
    } finally {
      setIsLoadingButton(false);
    }
  };

  useEffect(() => {
    const instances = localStorage.getItem("@instances");
    if (instances !== null) {
      setInstancesArray(JSON.parse(instances));
    } else {
      localStorage.setItem("@instances", JSON.stringify([]));
    }
  }, []);

  return (
    <DrawerComponent title="Cadastrar WhatsApp">
      <Typography variant="h4">Cadastrar WhatsApp</Typography>
      <Typography variant="body1">
        Cadastre seus Apps aqui antes de enviar mensagens!
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", gap: 2, my: 2 }}>
          <TextField
            fullWidth
            label="Nome do whatsapp"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.name}
            helperText={
              !!formik.errors.name
                ? formik.errors.name
                : "Esse nome será usado para identificar de qual WhatsApp você deseja enviar mensagens"
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,
                    }}
                  >
                    <AiOutlineMobile size={26} />
                    <Box
                      sx={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: (theme) =>
                          theme.palette.background.default,
                        width: 18,
                        height: 18,
                        borderRadius: 18,
                        bottom: -4,
                        right: -6,
                      }}
                    >
                      <BsWhatsapp size={8} />
                    </Box>
                  </Box>
                </InputAdornment>
              ),
            }}
          />
          <Button
            sx={{ height: 55 }}
            type="submit"
            variant="contained"
            disabled={isLoadingButton}
            endIcon={
              isLoadingButton ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
          >
            {isLoadingButton ? "Criando instância" : "Salvar"}
          </Button>
        </Box>
      </form>

      <Box sx={{ height: 500, w: "100%", mt: 4 }}>
        <DataGrid
          columnVisibilityModel={{
            id: false,
          }}
          columns={columns}
          rows={instancesArray}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection={false}
          disableSelectionOnClick={true}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>
    </DrawerComponent>
  );
}
