import { Button, Card, Modal, Typography } from "@mui/material";
import MuiLink from '@mui/material/Link';
import { useEffect, useState } from "react";

const AcceptTerms = (props) => {
  const [isShow, setIsShow] = useState(false);

  const handleAccept = () => {
    localStorage.setItem("terms", JSON.stringify(true));
    setIsShow(false);
  };

  useEffect(() => {
    const termsAcepted = localStorage.getItem("terms");
    if (termsAcepted !== null) {
      const isTermsAcepted = JSON.parse(termsAcepted)
      setIsShow(isTermsAcepted);
      setIsShow(!isTermsAcepted);
    }
    setIsShow(!termsAcepted === true);
  }, []);

  if (!isShow) return null;


  return (
    <Modal open={isShow} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <Card sx={{ display: 'flex', p: 4, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="text.secondary" sx={{ width: '90%' }}>
          Nós utilizamos cookies e outras tecnologias semelhantes para
          melhorar sua experiência em nossos serviços e recomendar conteúdos
          de seu interesse. Ao utilizar nossos serviços você concorda com tal
          monitoramento. Conheça melhor nossos{' '}
          <MuiLink color="inherit" href="https://filipeleonelbatista.vercel.app/termos-e-condicoes">
            <b>Termos e condições</b>
          </MuiLink>{' '} e {' '}
          <MuiLink color="inherit" href="https://filipeleonelbatista.vercel.app/politicas-de-privacidade">
            <b>Políticas de privacidade</b>
          </MuiLink>{' '}
        </Typography>
        <Button onClick={handleAccept} variant="contained">
          Concordo
        </Button>
      </Card>
    </Modal>
  )
}

export default AcceptTerms;