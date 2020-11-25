export function causeFields({
  title,
  summary,
  orderType,
  description,
}) {
  const errors = {
    ...(!title ? { title: 'Informe um título para a ordem!' } : ''),
    ...(!summary ? { summary: 'Informe um resumo para a ordem!' } : ''),
    ...((orderType === 'corretiva' && !description) ? { description: 'Informe uma descrição para a ordem!' } : ''),
  };

  return errors;
}

export function datesFields({
  plannedStart,
  plannedEnd,
  moment,
}) {
  try {
    const errors = {
      ...(!plannedStart ? { plannedStart: 'Informe o início planejado para a ordem!' } : ''),
      ...(!plannedEnd ? { plannedEnd: 'Informe o fim planejado para a ordem!' } : ''),
    };

    const plannedStartDate = moment(plannedStart);
    const plannedEndDate = moment(plannedEnd);

    checkValidDates({
      plannedStartDate,
      plannedEndDate,
      moment,
    });

    return errors;
  } catch (errors) {
    return errors;
  }
}

export function generalDetailFields({
  sector,
  equipment,
  priority,
  requireStop,
  requester,
  report,
  orderType,
}) {
  const errors = {
    ...(((orderType === 'corretiva' || orderType === 'preventiva') && !sector) ? { sector: 'Informe um setor para a ordem!' } : ''),
    ...(((orderType === 'corretiva' || orderType === 'preventiva') && !equipment) ? { equipment: 'Informe um equipamento para a ordem!' } : ''),
    ...(!priority ? { priority: 'Informe uma prioridade para a ordem!' } : ''),
    ...(!String(requireStop) ? { requireStop: 'Informe se a ordem precisa de parada!' } : ''),
    ...(!requester ? { requester: 'Informe o solicitante da ordem!' } : ''),
    ...(!report ? { report: 'Informe o reporte da ordem!' } : ''),
  };

  return errors;
}

export function operationsFields({
  operations,
  orderType,
}) {
  const errors = {
    ...((orderType !== 'corretiva' && !operations.length) ? { operations: 'Informe pelo menos uma operação para a ordem!' } : ''),
  };

  return errors;
}

function checkValidDates({ plannedStartDate, plannedEndDate, moment } = {}) {
  const currentDate = moment();
  currentDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  if (plannedEndDate.isBefore(plannedStartDate))
    throw { plannedEnd: 'Fim planejado não pode ser anterior ao início planejado!' };

  if (plannedStartDate.isBefore(currentDate))
    throw { plannedStart: 'Início planejado não pode ser anterior ao dia de hoje!' };
}
