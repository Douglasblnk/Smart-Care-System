export const WebConsultOrderTable = {
  options: {
    headings: {
      idOrdemServico: 'Ordem',
      resumo: 'Título',
      prioridade: 'Prioridade',
      dataEmissao: 'Emissão',
      status: 'Status',
      actions: 'Ações',
    },
    filterable: ['idOrdemServico', 'resumo', 'dataEmissao', 'prioridade', 'status'],
    texts: {
      filter: '',
      filterPlaceholder: 'Buscar ordem...',
      noResults: 'Nenhum registro encontrado!',
      count: '{count} registros',
      loading: 'Carregando...',
      limit: '',
      first: 'Primeiro',
      last: 'Último',
    },
    columnsClasses: {
      idOrdemServico: 'idOrdemServico-class',
      resumo: 'resumo-class',
      prioridade: 'prioridade-class',
      dataEmissao: 'dataEmissao-class',
      status: 'status-class',
      actions: 'actions-class',
    },
    perPage: 25,
    perPageValues: [25, 50, 100],
    sortable: ['idOrdemServico', 'dataEmissao'],
    sortIcon: {
      base: 'fa fa-fw',
      is: 'fa-sort',
      up: 'fa-chevron-up',
      down: 'fa-chevron-down',
    },
  },
  fields: ['idOrdemServico', 'resumo', 'dataEmissao', 'prioridade', 'status', 'actions'],
};

export const MobileConsultOrderTable = {
  options: {
    headings: {
      idOrdemServico: 'Ordems',
    },
    filterable: ['idOrdemServico', 'resumo', 'dataEmissao', 'prioridade', 'status', 'tipo_manutencao'],
    texts: {
      filter: '',
      filterPlaceholder: 'Buscar ordem...',
      noResults: 'Nenhum registro encontrado!',
      count: '{count} registros',
      loading: 'Carregando...',
      limit: '',
      first: 'Primeiro',
      last: 'Último',
    },
    perPage: 9,
    perPageValues: [],
    sortable: ['idOrdemServico'],
    sortIcon: {
      base: 'fa fa-fw',
      is: 'fa-sort',
      up: 'fa-chevron-up',
      down: 'fa-chevron-down',
    },
  },
  fields: ['idOrdemServico'],
};
