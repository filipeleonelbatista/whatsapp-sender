import { Box, Link, Typography } from "@mui/material";
import { FaWhatsapp } from "react-icons/fa";
import { useResize } from "../hooks/useResize";

export default function Footer() {
  const { size } = useResize();
  return (
    <Box
      sx={{
        backgroundColor: '#25d366',
        width: '100vw',
        display: 'flex',
        flexDirection: size[0] < 720 ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 6,
        py: 8,
        gap: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: '300px',
          py: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: size[0] < 720 ? 'center' : 'flex-start',
          gap: 1,
          color: '#FFF',
        }}>
        <Typography vartiant="h2" sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 24, fontWeight: 'bold' }}>
          <FaWhatsapp /> WhatsAppSender
        </Typography>
        <Typography sx={{ mt: 2 }} variant="body1">&copy; {new Date(Date.now()).getFullYear()} - <FaWhatsapp /> WhatsAppSender</Typography>
        <Typography variant="body1">Todos os direitos reservados</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
        }}
      >
        <Link rel="noreferrer noopener" href="https://wa.me/+5551992736445">
          <FaWhatsapp size={32} color="#FFF" />
        </Link>
      </Box>
    </Box>
  );
}
