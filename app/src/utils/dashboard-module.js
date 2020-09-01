const dashboard = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: 'fa fa-th',
    mobile: false,
    web: true,
  },
  {
    name: 'Cadastros',
    link: '/cadastros',
    icon: 'fa fa-file-signature',
    mobile: false,
    web: true,
  },
  {
    name: 'Cadastrar',
    link: '/cadastros/cadastro-causa-sintoma',
    icon: 'fa fa-pen',
    mobile: true,
    web: false,
  },
  {
    name: 'Verificações',
    link: '/consulta-verificacoes',
    icon: 'fas fa-clipboard-list',
    mobile: true,
    web: true,
  },
  {
    name: 'Consultas',
    link: '/consultas',
    icon: 'fa fa-search',
    mobile: true,
    web: true,
  },
  {
    name: 'Relatórios',
    link: '/relatorios',
    icon: 'fa fa-history',
    mobile: true,
    web: true,
  },
  {
    name: 'Configurações',
    link: '/configuracoes',
    icon: 'fa fa-cogs',
    mobile: false,
    web: true,
  },
];

export default dashboard;
