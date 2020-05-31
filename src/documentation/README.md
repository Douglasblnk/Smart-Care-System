# Smart Solution API

### Overview
A API, desenvolvida pelo grupo Smart Solution da faculdade de tecnologia SENAI Jaraguá do Sul, foi estruturada na linguagem de programação TypeScript e diversas bibliotecas que possibilitam a comunicação e manipulação das informações do banco de dados

### Estrutura da API

    /                             | Arquivos de configuração 
    src/                          |
      documentation/              | Documentação da API
      services/                   | Todos os serviços e funcionalidades exclusivas da api
        cruds/                    | Todos os cruds que o sistema possui (select, insert, update e delete)
          v1/                     | Rotas de endpoints express
          session/                | Classes, validações e regras de negócio do sistema
          dao/                    | Comunicação e manipulação do banco de dados 
        movimentations/           | Todas as movimentações no sistema (Ordens de manutenção e suas execuções)
          v1/                     | Rotas de endpoints express
          session/                | Classes, validações e regras de negócio do sistema
          dao/                    | Comunicação e manipulação do banco de dados 
      shared/                     | Tudo o que é compartilhado entre os services
        auth/                     | Autenticação do token
        connectionFactory         | Middleware de conexão com o banco de dados
        constants                 | Constantes/Enums globais
        cryptograpfy              | Criptografia dos usuários
      index.ts                    | Ponto inicial do sistema
