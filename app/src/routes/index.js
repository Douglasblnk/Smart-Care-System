import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../views/Dashboard';
import Cadastros from '../views/Cadastros';
import Login from '../views/Login';
import Configurações from '../views/Configurações.vue';
import Verificacao from '../views/Verificacao.vue';
import Consulta from '../views/Consulta.vue';
import Profile from '../views/Profile.vue';

import CadastroEquipamento from '../views/Cadastros/CadastroEquipamento';
import CadastroLocalInstalacao from '../views/Cadastros/CadastroLocalInstalacao';
import CadastroCentroTrabalho from '../views/Cadastros/CadastroCentroTrabalho';
import CadastroTipoOrdem from '../views/Cadastros/CadastroTipoOrdem';
import CadastroCausaSintoma from '../views/Cadastros/CadastroCausaSintoma.vue';
import CadastroComponente from '../views/Cadastros/CadastroComponente';
import OrdemManutencaoWrapper from '../views/Cadastros/ordemManutencao/OrdemManutencaoWrapper.vue';
import CadastroEpi from '../views/Cadastros/CadastroEpi';

import { validateToken } from '../utils/utils';
import Swal from 'sweetalert2';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    beforeEnter(to, from, next) {
      if (!localStorage.getItem('token')) return next();
      return next('/dashboard');
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requireAuth: true },
  },
  {
    path: '/cadastros',
    name: 'Cadastros',
    component: Cadastros,
    children: [
      {
        path: 'cadastro-equipamento',
        name: 'Cadastro de equipamentos',
        component: CadastroEquipamento,
        meta: { requireAuth: true },
      },
      {
        path: 'cadastro-local-instalacao',
        name: 'Local Instalação',
        component: CadastroLocalInstalacao,
        meta: { requireAuth: true },
      },
      {
        path: 'cadastro-centro-trabalho',
        name: 'Centro de Trabalho',
        component: CadastroCentroTrabalho,
        meta: { requireAuth: true },
      },
      {
        path: 'cadastro-tipo-ordem',
        name: 'Tipo de Ordem',
        component: CadastroTipoOrdem,
        meta: { requireAuth: true },
      },
      {
        path: 'cadastro-causa-sintoma',
        name: 'Causa e Sintoma',
        component: CadastroCausaSintoma,
        meta: { requireAuth: true },
      },
      {
        path: 'cadastro-componente',
        name: 'Componente',
        component: CadastroComponente,
        meta: { requireAuth: true },
      },
      {
        path: 'cadastro-ordem-manutencao',
        name: 'Ordem de Manutenção',
        component: OrdemManutencaoWrapper,
        meta: { requireAuth: true },
      },
      {
        path: 'cadastro-epi',
        name: 'epi',
        component: CadastroEpi,
        meta: { requireAuth: true },
      },
    ],
    meta: { requireAuth: true },
  },
  {
    path: '/solicitacoes',
    name: 'Solicitações',
    component: Dashboard,
    meta: { requireAuth: true },
  },
  {
    path: '/consultas',
    name: 'Consultas',
    component: Consulta,
    meta: { requireAuth: true },
  },
  {
    path: '/relatorios',
    name: 'Relatórios',
    component: Dashboard,
    meta: { requireAuth: true },
  },
  {
    path: '/configuracoes',
    name: 'Configurações',
    component: Configurações,
    meta: { requireAuth: true },
  },
  {
    path: '/verificacao',
    name: 'verificacao',
    component: Verificacao,
    meta: { requireAuth: true },
  },
  {
    path: '/profile',
    name: 'Meu Perfil',
    component: Profile,
    meta: { requireAuth: true },
  },
  {
    path: '*',
    redirect: '/',
  },
];

const apiUrl = 'http://localhost:3000';

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  apiUrl,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requireAuth) {
    try {
      await validateToken(apiUrl);

      next();
    } catch (err) {
      console.log('error: ', err);
      localStorage.removeItem('token');
      Swal.fire({
        type: 'warning',
        title: 'Erro ao autentizar! Por favor, entre novamente!',
        confirmButtonColor: '#F34336',
      });
      next('/');
    }
  } else next();
});

export default router;
