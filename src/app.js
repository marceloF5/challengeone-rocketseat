const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query

  const results = title
    ? repositories.filter(project => project.title.includes(title))
    : repositories

    return response.json(results)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repository)

  return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs, likes } = request.body
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)


  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found"})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)  

  if (repositoryIndex < 0) {
    return response.json({ error:  "O repositório não existe" })
  }

  repositories.splice(repositoryIndex, 1) 

  return response.json({ message: "O repositório foi removido!" })


});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.json({ error:  "O repositório não existe" })
  } 

  repositories[repositoryIndex].likes += 1


  return response.json({ message: "likes atualizados com sucesso!" })
  

});



app.listen(3333, () => {
  console.log('Back-end started!')
})


module.exports = app;
