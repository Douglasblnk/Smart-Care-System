# Smart Solution API

### Overview
A API, desenvolvida pelo grupo Smart Solution da faculdade de tecnologia SENAI Jaraguá do Sul, foi estruturada na linguagem de programação JavaScript e diversas bibliotecas que possibilitam a comunicação e manipulação das informações do banco de dados

### Estrutura da API

```
src/                          |
  services/                   | Todos os serviços e funcionalidades exclusivas da api
    dao/                      | Comunicação e manipulação do banco de dados
      cruds/                  | Todos os cruds que o sistema possui
      movimentations/         | Todas as movimentações no sistema
    session/                  | Classes, validações e regras de negócio do sistema
	    cruds/                  | Todos os cruds que o sistema possui
      movimentations/         | Todas as movimentações no sistema 
    routes/                   | Rotas de endpoints express
      cruds/                  | Todos os cruds que o sistema possui
      movimentations/         | Todas as movimentações no sistema 
  shared/                     | Tudo o que é compartilhado entre os services
    auth/                     | Autenticação do token
    constants/                | Constantes/Enums globais
    database/                 | Middleware de conexão com o banco de dados
    guard/                    | Criptografia dos usuários
    utils/                    | Tem funções uteis para diversas partes do sistema
  index.js                    | Ponto inicial do sistema
```
