import { Button, CardMedia, Divider, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import DrawerComponent from '../components/DrawerComponent'
import { api, getLast5Posts, getLast5PostsByCategory, listCategories } from '../services/api'
import List from '@mui/material/List'
import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import { format } from 'date-fns'

export default function Blog() {
  const [categories, setCategories] = React.useState([])
  const [posts, setPosts] = React.useState([])

  const handleLoadPostsByCategory = async (id) => {
    const postsResponse = await api.post('', getLast5PostsByCategory(id))
    setPosts(postsResponse.data.data.categoria.posts)
  }

  React.useEffect(() => {
    const executeAsync = async () => {
      const categoriesResponse = await api.post('', listCategories)
      setCategories(categoriesResponse.data.data.categorias)

      const postsResponse = await api.post('', getLast5Posts)
      setPosts(postsResponse.data.data.posts)
    }
    executeAsync()
  }, [])

  return (
    <DrawerComponent title="Blog">
      <Typography variant="h5">Blog Dicas do Zapzap.</Typography>
      <Typography variant="body1">
        Os conteúdos do blog são exclusivos para os assinantes e ficam disponíveis 1 mês após no
        blog do site.
      </Typography>
      <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: '180px 1fr', gap: 2 }}>
        <Box sx={{ width: '100%', borderRight: '1px solid #AAA' }}>
          <Typography variant="caption">
            <b>Categorias</b>
          </Typography>
          <List component="nav">
            {categories.map((cat) => (
              <Tooltip key={cat.id} placement="right" title={cat.nome}>
                <ListItemButton onClick={() => handleLoadPostsByCategory(cat.id)}>
                  <ListItemText primary={cat.nome} />
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        </Box>
        <Box sx={{ width: '100%' }}>
          {posts.length === 0 && (
            <Box>
              <Typography variant="h5">Os conteúdos estão sendo preparados para você.</Typography>
              <Typography variant="body1">Em breva você verá conteúdos de valor aqui!</Typography>
            </Box>
          )}
          {posts.map((post) => (
            <Box
              key={post.id}
              sx={{
                width: '100%',
                p: 2,
                mt: 4,
                boxShadow: 3,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                borderRadius: 2
              }}
            >
              <Typography variant="h4">{post.title}</Typography>
              <Divider />
              <Box sx={{ mt: 1, mb: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption">
                  <b>Publicado em:</b> {format(new Date(post.publishedAt), 'dd/MM/yyyy HH:mm')}
                </Typography>
                <Typography variant="caption">
                  <b>Categorias:</b>{' '}
                  {post.categorias?.map((cat) => (
                    <span style={{ marginRight: '8px' }} key={cat.id}>
                      {cat.nome}
                    </span>
                  ))}
                </Typography>
              </Box>
              <CardMedia
                image={post.featuredImage.url}
                style={{ borderRadius: 4, width: '100%', height: 350 }}
              />
              <Typography
                component="div"
                sx={{
                  '& > img': {
                    width: '100%',
                    heigth: 'auto',
                    borderRadius: 2,
                    boxShadow: 2
                  }
                }}
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: post.content.html
                }}
              ></Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </DrawerComponent>
  )
}
