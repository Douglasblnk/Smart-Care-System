import Vue from 'vue'
import VueRouter from 'vue-router'
import Error404 from '../views/Error404.vue'
import Dashboard from '../views/Dashboard'
import Cadastros from '../views/Cadastros'
import Login from '../views/Login'
import Configurações from '../views/Configurações.vue'
import Verificacao from '../views/Verificacao.vue'
import Detalhamento from '../views/Detalhamento.vue'
import Consulta from '../views/Consulta.vue'

import CadastroEquipamento from '../views/Cadastros/CadastroEquipamento'
import CadastroLocalInstalacao from '../views/Cadastros/CadastroLocalInstalacao'
import CadastroCentroTrabalho from '../views/Cadastros/CadastroCentroTrabalho'
import CadastroTipoOrdem from '../views/Cadastros/CadastroTipoOrdem'
import CadastroCausaSintoma from '../views/Cadastros/CadastroCausaSintoma.vue'
import CadastroComponente from '../views/Cadastros/CadastroComponente'
import CadastroOrdemManutencao from '../views/Cadastros/CadastroOrdemManutencao'

import { validate } from '../utils/token-validation';
import Swal from 'sweetalert2'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    beforeEnter(to, from, next) {
      if (!localStorage.getItem('token')) return next();
      return next('/dashboard');
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requireAuth: true }
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
        meta: { requireAuth: true }
      },
      {
        path: 'cadastro-local-instalacao',
        name: 'Local Instalação',
        component: CadastroLocalInstalacao,
        meta: { requireAuth: true }
      },
      {
        path: 'cadastro-centro-trabalho',
        name: 'Centro de Trabalho',
        component: CadastroCentroTrabalho,
        meta: { requireAuth: true }
      },
      {
        path: 'cadastro-tipo-ordem',
        name: 'Tipo de Ordem',
        component: CadastroTipoOrdem,
        meta: { requireAuth: true }
      },
      {
        path: 'cadastro-causa-sintoma',
        name: 'Causa e Sintoma',
        component: CadastroCausaSintoma,
        meta: { requireAuth: true }
      },
       {
        path: 'cadastro-componente',
        name: 'Componente',
        component: CadastroComponente,
        meta: { requireAuth: true }
      },
      {
        path: 'cadastro-ordem-manutencao',
        name: 'Ordem de Manutenção',
        component: CadastroOrdemManutencao,
        meta: { requireAuth: true }
      }

    ],
    meta: { requireAuth: true }
  },
  {
    path: '/solicitacoes',
    name: 'Solicitações',
    component: Dashboard,
    meta: { requireAuth: true }
  },
  {
    path: '/consultas',
    name: 'Consultas',
    component: Consulta,
    children: [
      {
        path: 'detalhamento',
        name: 'Detalhamento',
        component: Detalhamento,
        // props: true,
        meta: { requireAuth: true }
      }
    ],
    meta: { requireAuth: true }
  },
  {
    path: '/relatorios',
    name: 'Relatórios',
    component: Dashboard,
    meta: { requireAuth: true }
  },
  {
    path: '/configuracoes',
    name: 'Configurações',
    component: Configurações,
    meta: { requireAuth: true }
  },
  {
    path: '/verificacao',
    name: 'verificacao',
    component: Verificacao,
    meta: { requireAuth: true }
  },
  {
    path: '*',
    name: '404',
    component: Error404
  }
]

const apiUrl = 'http://localhost:3000';

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  apiUrl
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requireAuth) {
    console.log('to', to);
    try {
      const response = await validate(apiUrl)
      console.log('sucess: ', response);
      next();
    } catch (err) {
      console.log('error: ', err);
      localStorage.removeItem('token');
      Swal.fire({
        type: 'warning',
        title: 'Erro ao autentizar! Por favor, entre novamente!',
      })
      next('/');
    }
  } else next();
});

export default router
