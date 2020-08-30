import router from '../../../../routes/index';
import store from '../../../../store/index';
import swal from 'sweetalert2';

const logoff = () => {
  swal.fire({
    type: 'question',
    title: 'Deseja realmente sair do sistema?',
    showCancelButton: true,
    cancelButtonText: 'Não',
    confirmButtonText: 'Sair',
    confirmButtonColor: '#F34336',
  }).then(res => {
    if (res.value) {
      localStorage.removeItem('token');
      router.replace('/');
    }
  });
};

const commonOption = {
  name: 'Sair',
  icon: 'fa-sign-out-alt',
  actions: logoff,
};

export const recommendedItems = {
  '/dashboard': {
    options: [
      commonOption,
    ],
  },
  '/consultas': {
    options: [
      {
        name: 'Filtrar',
        icon: 'fa-filter',
        actions: () => { store.state.showConsultFilter = !store.state.showConsultFilter; },
      },
      {
        name: 'Dashboard',
        icon: 'fa-home',
        actions: () => [router.replace('/dashboard')],
      },
      commonOption,
    ],
  },
  '/perfil': {
    options: [
      {
        name: 'Dashboard',
        icon: 'fa-home',
        actions: () => [router.replace('/dashboard')],
      },
      commonOption,
    ],
  },
  '/consulta-verificacoes': {
    options: [
      {
        name: 'Dashboard',
        icon: 'fa-home',
        actions: () => [router.replace('/dashboard')],
      },
      {
        name: 'Consultas',
        icon: 'fa-search',
        actions: () => [router.replace('/consultas')],
      },
      commonOption,
    ],
  },
};

