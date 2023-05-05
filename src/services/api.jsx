import axios from 'axios';

const api = axios.create({
  baseURL: "https://api-sa-east-1.hygraph.com/v2/clbz2ophl0cyc01t6fpv718o9/master"
})

api.interceptors.request.use(
  (config) => {
    config.headers = {
      'content-type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NzE3MTUxNTksImF1ZCI6WyJodHRwczovL2FwaS1zYS1lYXN0LTEuaHlncmFwaC5jb20vdjIvY2xiejJvcGhsMGN5YzAxdDZmcHY3MThvOS9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC5ncmFwaGNtcy5jb20vIiwic3ViIjoiZjNlNzQxMjEtNjJkOS00NzM4LTgyNjQtYjg1MzMwMTE1NjBjIiwianRpIjoiY2xiejQxa2xuMGYwcjAxdW42eWhxMmtiZiJ9.w8BjCcPmJIebMJcTc5c9hErVfqDWzsEjEDY9QeCOCWIjRNVpkmE4DrAO5E4xJPhHW3lqXp7oV1nI5RNIwAIRS1hFZ0Jr8_yBAzWFURvABp5vIblPbi4qoSokw6UAzqi1lI1zyS97p4vNYRM320TrpnijFTJcoPhMi4abymNTHWyddZD2RDUFCe_LGPL9YXiuKdZoiwFTdWDQX17zIfhqZltgkcpGvJ_gynXLdEqgB9lZEr_qafvgflsPEccErvz8Y8jkQAHHau9ly6XadhirAqzS5Krj6lfmUtwTeQCpT-6IupoTCx3fXaSwkaaWEiQi-ouwX-KTMqaLukDf1biTZm3uEfVNsxxhBvvm_9aNh2GVp2Efk2QDEcP0fZz2843ZS9M8oKJRdmfChcFS6EHwzVlCUzxWj0-0u0yb_Ahcgs9Z1nQ3RAE_S1jcktPdqUYPQRz7pKvYq_6kwr-We3IIUA38_0DFUD5OrWZnQ3-aLSKQtHh-OZjq4dBzPQXIPpe-4ox_aH-eBpWVXeZn83Rf0mun5fBch-fXukB1Ogo4Clp9KWaeOCAcUhx5kxU_PDANQwhZ8UHbqo1uSjBNoTb7sI4TcuVoFp_uvjDB-eM62Nz1TL5tF8Dep5lUs7z_vCTl3lT4UpRnfnl5v1lIx_17nT4MPZjmtnRpi6S4IIS74QU`
    };
    return config;
  },
  (err) => {
    return Promise.reject(err)
  }
)

const filterAssinantesByEmail = (email) => {
  return {
    query: `
      query filterAssinantesByEmail {
        assinantes(where: {email: "${email}"}) {
          createdAt
          email
          id
          isActive
          nome
          paymentDate
          publishedAt
          requestAccessDate
          selectedPlan
          senha
          updatedAt
        }
      }
    `
  }
}

const listAssinantes = {
  query: `
      query listAssinantes {
        assinantes {
          createdAt
          email
          id
          isActive
          nome
          paymentDate
          publishedAt
          requestAccessDate
          selectedPlan
          senha
          updatedAt
        }
      }
    `
}

const createAssinante = (nome, email, senha, requestAccessDate, selectedPlan, isActive, paymentDate) => {
  return {
    query: `mutation {
                createAssinante(
                  data: { nome: "${nome}", email: "${email}", senha: "${senha}", requestAccessDate: "${requestAccessDate}", selectedPlan: ${selectedPlan}, isActive: ${isActive}, paymentDate: ${paymentDate ? `"${paymentDate}"` : `null`}}
                ) {
                  email
                  id
                  isActive
                  nome
                  paymentDate
                  requestAccessDate
                  selectedPlan
                  senha
                }
                publishAssinante(where: {email: "${email}"}) {
                  id
                }
              }`
  }
}

const listCategories = {
  query: `
    query listCategories {
      categorias(orderBy: nome_ASC) {
        id
        nome
      }
    }  
  `
}

const getLast5Posts = {
  query: `
    query getLast5Posts {
      posts (last: 5 orderBy: publishedAt_DESC){
        id
        content {
          html
        }
        categorias {
          nome
          id
        }
        title
        url_id
        publishedAt
        featuredImage {
          url
        }
      }
    }
  `
}

const getFaq = {
  query: `
    query getFaqs {
      faqs(orderBy: order_ASC) {
        id
        order
        createdAt
        title
        subtitle
        content {
          html
        }
      }
    }
  `
}

const getLast5PostsByCategory = (id) => {
  return {
    query: `
      query getLast5PostsByCategory {
        categoria(where: {id: "${id}"}) {
          posts(orderBy: publishedAt_DESC) {
            id
            publishedAt
            title
            url_id
            featuredImage {
              url
            }
            categorias {
              id
              nome
            }
            content {
              html
            }
          }
          id
          nome
        }
      }
    `
  }
}

export {
  api,
  filterAssinantesByEmail,
  listAssinantes,
  createAssinante,
  listCategories,
  getLast5Posts,
  getLast5PostsByCategory,
  getFaq
};
