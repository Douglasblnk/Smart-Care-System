export function getStatusIcon(order) {
  if (order.status === 'Aberto') return 'fa-clock';
  if (order.status === 'Assumida') return 'fa-user-check';
  if (order.status === 'Em Andamento') return 'fa-tasks';
  if (order.status === 'Encerrada') return 'fa-check-circle';
  if (order.status === 'Pendente') return 'fa-user-shield';
  if (order.status === 'Pausada') return 'fa-pause-circle';
}

export function verifyOrderStatus({ status }) {
  if (status === 'Aberto') return 'open';
  if (status === 'Assumida') return 'assumed';
  if (status === 'Em Andamento') return 'running';
  if (status === 'Encerrada') return 'closed';
  if (status === 'Pendente') return 'pending';
  if (status === 'Pausada') return 'paused';
}
