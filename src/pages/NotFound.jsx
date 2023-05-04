import { Box, Button, Container, Typography } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Floating from "../components/Floating";
import Footer from "../components/Footer";
import HomeNavigation from "../components/HomeNavigation";

function NotFound() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: 'auto',
        backgroundColor: '#fff',
        color: '#000',
      }}
    >
      <HomeNavigation />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* how */}
        <Box
          sx={{
            width: '100%',
            height: 'calc(100vh - 81px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Container sx={{
            pt: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4
          }}>
            <Typography variant="h3" textAlign="center">
              <b>
                404 <br />
                Não encontramos o que você estava procurando!
              </b>
            </Typography>
            <Typography variant="body1" textAlign="center">
              Este recurso não está disponível ou não existe mais.
            </Typography>
            <Button onClick={() => navigate('/entrar')} sx={{ width: 200 }} variant="contained" color="primary" size="large" startIcon={<FaArrowLeft size={18} />}>Voltar</Button>
          </Container>

        </Box>
        {/* how */}
        {/* cta2 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            px: 4,
            width: '100vw',
            backgroundColor: '#232323'

          }} >
          <Typography variant="h5" color="white" textAlign="center">
            Com o CadastraPet, você cria a ficha do seu pet, mantem os dados
            clinicos atualizados e tem essas informaçõe disponíveis para seu
            veterinário!
          </Typography>
        </Box>
        {/* cta2 */}
      </Box>
      <Footer />
      <Floating location="Não encontrado" />
    </Box >
  );
}

export default NotFound;