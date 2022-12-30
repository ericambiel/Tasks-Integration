import { TaskDTO } from '@modules/fluig/dtos/TaskDTO';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export default class FluigTaskModel implements TaskDTO {
  @Expose()
  realizadoId: string;

  @Expose()
  txtAprovacao: '';

  @Expose()
  aprovadoAprovacaoCheckbox: 'on';

  @Expose({ name: 'oMOPCod' })
  realizadoNumeroOMOP: string;

  @Expose({ name: 'oMOPCod' })
  realizadoCodOMOP: string;

  @Expose()
  realizadoProjeto: string;

  @Expose()
  realizadoOperacaoTarefa: '20' | '301' | string;

  @Expose()
  realizadoOperacaoTarefaNome:
    | 'HORAS TRABALHADAS'
    | 'GERENCIAMENTO DE IT - CATB 25002'
    | string;

  @Expose()
  @Transform(({ obj }) => {
    const dateTimeStart = <Date>obj.startDateTime;
    return dateTimeStart.toLocaleDateString();
  })
  realizadoData: string;

  @Expose()
  @Transform(({ obj }) => {
    const dateTimeStart = <Date>obj.startDateTime;
    return dateTimeStart.toLocaleTimeString();
  })
  realizadoInicio: string;

  @Expose()
  @Transform(({ obj }) => {
    const dateTimeEnd = <Date>obj.endDateTime;
    return dateTimeEnd.toLocaleTimeString();
  })
  realizadoFim: string;

  @Expose()
  @Transform(({ obj }) => {
    const dateTimeStart = <Date>obj.startDateTime;
    const dateTimeEnd = <Date>obj.endDateTime;
    // Diference in milliseconds of time part
    const diff = dateTimeEnd.getTime() - dateTimeStart.getTime();
    // 36e5 is the scientific notation for 60*60*1000
    return Math.abs(diff) / 36e5;
  })
  realizadoHoras: string;

  @Expose({ name: 'description' })
  realizadoObservacao: string;

  @Expose()
  realizadoAprovado: 'false';
}
