import Vue from 'vue';
import VueRouter from 'vue-router';

/* entry point, needs to be normal import or the main session validation wont work */
import Login from '../views/Core/Login.vue';

const Dashboard = () => import('../views/Core/Dashboard.vue');
const Cadastros = () => import('../views/Registers/Cadastros.vue');
const Configurações = () => import('../views/Core/Configurações.vue');
const Verificacao = () => import('../views/Movimentations/Verificacao.vue');
const Consulta = () => import('../views/Movimentations/Consulta.vue');
const Profile = () => import('../views/Core/Profile.vue');

const CadastroEquipamento = () => import('../views/Registers/Cruds/CadastroEquipamento.vue');
const CadastroLocalInstalacao = () => import('../views/Registers/Cruds/CadastroLocalInstalacao.vue');
const CadastroCentroTrabalho = () => import('../views/Registers/Cruds/CadastroCentroTrabalho.vue');
const CadastroTipoOrdem = () => import('../views/Registers/Cruds/CadastroTipoOrdem.vue');
const CadastroCausaSintoma = () => import('../views/Registers/Cruds/CadastroCausaSintoma.vue');
const CadastroComponente = () => import('../views/Registers/Cruds/CadastroComponente.vue');
const CadastroEpi = () => import('../views/Registers/Cruds/CadastroEpi.vue');
const CadastroOperacao = () => import('../views/Registers/Cruds/CadastroOperacao.vue');

const OrdemManutencaoWrapper = () => import('../views/Registers/MaintenanceOrder/OrdemManutencaoWrapper.vue');

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
      {
        path: 'cadastro-operacao',
        name: 'Cadastro Operações',
        component: CadastroOperacao,
        meta: { requireAuth: true },
      },
    ],
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
    path: '/perfil/:userId',
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
      validateToken(apiUrl);

      next();
    } catch (err) {
      console.log('error: ', err);
      localStorage.removeItem('token');
      Swal.fire({
        type: 'warning',
        title: 'Erro ao autenticar! Por favor, entre novamente!',
        confirmButtonColor: '#F34336',
      });
      next('/');
    }
  } else { next(); }
});

export default router;
