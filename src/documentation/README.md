# Smart Solution API

### Overview
A API, desenvolvida pelo grupo Smart Solution da faculdade de tecnologia SENAI Jaraguá do Sul, foi estruturada na linguagem de programação TypeScript e diversas bibliotecas que possibilitam a comunicação e manipulação das informações do banco de dados

### Estrutura da API

    /                             | Arquivos de configuração 
    src/                          |
      documentation/              | Documentação da API
      services/                   | Todos os serviços e funcionalidades exclusivas da api
        cruds/                    | Todos os cruds que o sistema possui (select, insert, update e delete)
          dao/                    | Comunicação e manipulação do banco de dados 
          session/                | Classes, validações e regras de negócio do sistema
          v1/                     | Rotas de endpoints express
        movimentations/           | Todas as movimentações no sistema (Ordens de manutenção e suas execuções)
          dao/                    | Comunicação e manipulação do banco de dados 
          session/                | Classes, validações e regras de negócio do sistema
          v1/                     | Rotas de endpoints express
      shared/                     | Tudo o que é compartilhado entre os services
        auth/                     | Autenticação do token
        connectionFactory/        | Middleware de conexão com o banco de dados
        constants/                | Constantes/Enums globais
        cryptography/             | Criptografia dos usuários
        utils/                    | Tem funções uteis para diversas partes do sistema
      index.ts                    | Ponto inicial do sistema
