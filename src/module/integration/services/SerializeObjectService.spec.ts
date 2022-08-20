import 'reflect-metadata';

import { getFormProperties } from '@shared/helpers/smallHelper';
import { IAppointmentDTO } from '../../fluig/dtos/IAppointmentDTO';

describe('Unit test - ', () => {
  const appointments: IAppointmentDTO[] = [
    {
      realizadoId: '1',
      realizadoNumeroOMOP: '1000204',
      realizadoCodOMOP: '1000204',
      realizadoOperacaoTarefa: '20',
      realizadoOperacaoTarefaNome: 'HORAS TRABALHADAS',
      realizadoProjeto: 'BRF PRONTA GROSSA MU1807041',
      realizadoObservacao: 'Validação / Construção de telas do FDS',
      realizadoData: '03/08/2022',
      realizadoInicio: '08:03',
      realizadoFim: '11:50',
      realizadoHoras: '03:47',
      txtAprovacao: '',
      aprovadoAprovacaoCheckbox: 'on',
      realizadoAprovado: 'false',
    },
    {
      realizadoId: '2',
      realizadoNumeroOMOP: '1000204',
      realizadoCodOMOP: '1000204',
      realizadoOperacaoTarefa: '20',
      realizadoOperacaoTarefaNome: 'HORAS TRABALHADAS',
      realizadoProjeto: 'BRF PRONTA GROSSA MU1807041',
      realizadoObservacao: 'Validação / Construção de telas do FDS',
      realizadoData: '03/08/2022',
      realizadoInicio: '12:38',
      realizadoFim: '17:47',
      realizadoHoras: '05:09',
      txtAprovacao: '',
      aprovadoAprovacaoCheckbox: 'on',
      realizadoAprovado: 'false',
    },
  ];

  it('should be possible convert an obj to FormProperties', () => {
    const ret = getFormProperties(appointments);
    console.log(ret);
  });

  it('should be possible convert an array obj to FormProperties', () => {
    const ret = getFormProperties(appointments[0]);
    console.log(ret);
  });
});
