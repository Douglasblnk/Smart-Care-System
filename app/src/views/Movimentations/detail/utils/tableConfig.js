export const inviteMaintainerConfig = {
  options: {
    headings: {
      nome: 'Nome',
      numeroCracha: 'Crachá',
      actions: 'Ações',
    },
    filterable: ['nome', 'numeroCracha'],
    texts: {
      filter: '',
      filterPlaceholder: 'Buscar técnico...',
      noResults: 'Nenhum registro encontrado!',
      count: '{count} registros',
      loading: 'Carregando...',
      limit: '',
      first: 'Primeiro',
      last: 'Último',
    },
    columnsClasses: {
      actions: 'actions-class',
    },
    perPage: 5,
    perPageValues: [],
    sortable: ['nome', 'numeroCracha'],
    sortIcon: {
      base: 'fa fa-fw',
      is: 'fa-sort',
      up: 'fa-chevron-up',
      down: 'fa-chevron-down',
    },
  },
  fields: ['nome', 'numeroCracha', 'actions'],
};
