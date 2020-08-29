import router from '../../../../routes/index';
import store from '../../../../store/index';
import swal from 'sweetalert2';

const logoff = () => {
  swal.fire({
    type: 'question',
    title: 'Deseja realmente sair do sistema?',
    showCancelButton: true,
    cancelButtonText: 'Não!',
    confirmButtonText: 'Sim!',
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
        name: 'Dashboard',
        icon: 'fa-home',
        actions: () => [router.replace('/dashboard')],
      },
      commonOption,
    ],
  },
  [`/perfil/${store.state.user.cracha}`]: {
    options: [
      {
        name: 'Dashboard',
        icon: 'fa-home',
        actions: () => [router.replace('/dashboard')],
      },
      commonOption,
    ],
  },
};

