const express = require('express');

const app = express();

app.use(express.json());

// Array de projetos
const projects = [];

// Middleware que verifica se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(proj => proj.id == id);

  // Se não, apresenta um erro
  if(!project){
    return res.status(404).json({ error: 'Projeto não existe.' })
  }

  return next();
}

// Middleware que evita a criação de um projeto com ID já existente
function checkProjectAlreadyExists(req, res, next){
  const { id } = req.body;

  const project = projects.find(proj => proj.id == id);

  if(project){
    return res.status(500).json({ error: "Projeto com ID '" + id + "' já existe."})
  }

  return next();
}

// Middleware que detalhe a requisição atual e contabiliza o total
function logRequests(req, res, next) {

  const requestType = req.method;

  console.log('Requisição: ' + requestType);
  console.count('Número total de requisições');

  return next();
}

app.use(logRequests);

// Cria um novo projeto
app.post('/projects', checkProjectAlreadyExists, (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  projects.push({ id: id, title: title, tasks: [] });

  return res.json(projects);
});

// Lista todos os projetos
app.get('/projects', (req, res) => {
  return res.json(projects);
});

// Edita o título do projeto conforme ID da rota
app.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } =  req.params;
  const { title } = req.body;

  const project = projects.find(proj => proj.id == id);

  project.title = title;

  return res.json(project);
});

// Exclui um projeto conforme ID da rota
app.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const project = projects.findIndex(proj => proj.id == id);

  projects.splice(project, 1);

  return res.json(projects);
});

// Adiciona uma tarefa ao projeto conforme ID da rota
app.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } =  req.params;
  const { title } = req.body;

  const project = projects.find(proj => proj.id == id);

  project.tasks.push(title);

  return res.json(project);
});


app.listen(3000);