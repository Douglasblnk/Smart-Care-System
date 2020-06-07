import { Connection } from 'mysql2/promise';

export interface authData {
  idUsuario: number,
  numeroCracha: string,
  nome: string,
  senha: string,
  email: string,
  funcao: string,
  nivel_acesso: number,
  excluded: number
}

export interface userDao {
  numeroCracha?: string,
  senha?: string,
  nome?: string,
  funcao?: string,
  email?: string,
  nivelAcesso?: string,
  updateId?: string,
  mysql: Connection,
}
