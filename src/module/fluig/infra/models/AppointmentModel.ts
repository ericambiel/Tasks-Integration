import { IAppointmentDTO } from '../../dtos/IAppointmentDTO';

export default class AppointmentModel implements IAppointmentDTO {
  aprovadoAprovacaoCheckbox: 'on';

  realizadoAprovado: 'false';

  realizadoCodOMOP: string;

  realizadoData: string;

  realizadoFim: string;

  realizadoHoras: string;

  realizadoId: string;

  realizadoInicio: string;

  realizadoNumeroOMOP: string;

  realizadoObservacao: string;

  realizadoOperacaoTarefa: '20' | '300' | string;

  realizadoOperacaoTarefaNome:
    | 'HORAS TRABALHADAS'
    | 'HORAS ENGENHARIA IT'
    | string;

  realizadoProjeto: string;

  txtAprovacao: '';
}
