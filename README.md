<a href="https://github.com/filipeleonelbatista/whatsapp-sender/blob/master/README_EN.md" target="_blank">
  <img src="https://raw.githubusercontent.com/filipeleonelbatista/filipeleonelbatista/master/assets/usa_flag.png" width="28px" />
  Version in English
</a>
</br>
</br>

<img width="100%" src=".github/2.png">

# Indice

- [Sobre](#-sobre)
- [Tecnologias](#Tecnologias)
- [Instalação](#Instalação)

## 🔖&nbsp; Sobre

Aplicativo para envio de mensagens em massa usando Electron e React JS com Material UI para criar a mensagem e as listas de envio e usa 
Selenium para poder fazer os disparos. Usando a api do hygraph para autenticar a ferramenta.

[Link do Site](https://enviodemensagensemmassa.vercel.app/)

## Objetivo

Criei este app pois minha esposa trabalhava gerenciando times de vendas e precisava disparar mensagens para grupos de vendedoras para manter
todas informadas. Então surgiu criar para desenvolver e ampliar meus conhecimentos e surgiu a oportunidade de vender para as colegas dela. 
Tive um total de 8 clientes usando este app.
No entanto com as novas atualizações do whatsapp acabou perdendo um pouco a funcionalidade usando selenium, e decidi descontinuar este app.

Falo mais [NESTE POST](https://www.linkedin.com/posts/filipeleonelbatista_reactjs-typescript-selenium-activity-7034491662676434948--Pu-?utm_source=share&utm_medium=member_desktop) do meu Linkedin.
 
---
## Tecnologias

Esse projeto foi desenvolvido com as seguintes principais tecnologias:

- [Selenium](https://www.selenium.dev/documentation/webdriver/)
- [Electron](https://www.electronjs.org/pt/)
- [React JS](https://legacy.reactjs.org/docs/getting-started.html)
- [Hygraph](https://hygraph.com/)
- [Material UI](https://mui.com/material-ui/)

e mais...

---
## Instalação

O projeto roda com [Node.js](https://nodejs.org/) v20+.

Instruções para instalar as dependencias e inicie o projeto.

### Electron App

```sh
cd whatsapp-sender
npm i
npx run build
npx run start
```

### Landing

Basta alterar para a branch main e rodar estes comandos

```sh
cd whatsapp-sender
npm i
npx run dev
```

## API da Hygraph

É possivel que o site esteja fora do ar ou com algum problema então será necessário configurar a api da Hygraph
para poder rodar a aplicação.

Lembre de criar uma instancia na parte de desenvolvimento da twitch e completar com as configurações do autenticador nos arquivos `api.ts`
que fica em `src/renderer/src/services/api.ts` colocando o `Base_URL` e o `Authorization` da aplicação.

Necerssário criar os contents de acordo com o arquivo `api.ts` no hygraph. 

---

<h3 align="center" >Vamos nos conectar 😉</h3>
<p align="center">
  <a href="https://www.linkedin.com/in/filipeleonelbatista/">
    <img alt="LinkedIn" width="22px" src="https://github.com/filipeleonelbatista/filipeleonelbatista/blob/master/assets/052-linkedin.svg" />
  </a>&ensp;
  <a href="mailto:filipe.x2016@gmail.com">
    <img alt="Email" width="22px" src="https://github.com/filipeleonelbatista/filipeleonelbatista/blob/master/assets/gmail.svg" />
  </a>&ensp;
  <a href="https://instagram.com/filipeleonelbatista">
    <img alt="Instagram" width="22px" src="https://github.com/filipeleonelbatista/filipeleonelbatista/blob/master/assets/044-instagram.svg" />
  </a>
</p>
<br />
<p align="center">
    Desenvolvido 💜 por Filipe Batista 
</p>
