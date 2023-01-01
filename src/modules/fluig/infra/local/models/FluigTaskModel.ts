import { TaskDTO } from '@modules/fluig/dtos/TaskDTO';
import { Exclude, Expose, Transform } from 'class-transformer';
import { parse } from 'date-fns';

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
    // TODO: Try to discovery how to use format string same as Fluig, to correct parse
    const dateTimeStart = new Date(
      parse(obj.startDateTime, 'dd/MM/yy HH:mm', new Date()),
    );
    return dateTimeStart.toLocaleDateString('pt-BR');
  })
  realizadoData: string;

  @Expose()
  @Transform(({ obj }) => {
    // TODO: Try to discovery how to use format string same as Fluig, to correct parse
    const dateTimeStart = new Date(
      parse(obj.startDateTime, 'dd/MM/yy HH:mm', new Date()),
    );
    return dateTimeStart.toLocaleTimeString('pt-BR');
  })
  realizadoInicio: string;

  @Expose()
  @Transform(({ obj }) => {
    // TODO: Try to discovery how to use format string same as Fluig, to correct parse
    const dateTimeEnd = new Date(
      parse(obj.endDateTime, 'dd/MM/yy HH:mm', new Date()),
    );
    return dateTimeEnd.toLocaleTimeString('pt-BR');
  })
  realizadoFim: string;

  @Expose()
  @Transform(({ obj }) => {
    // TODO: Try to discovery how to use format string same as Fluig, to correct parse
    // TODO: Leave this to smallHelper
    const dateTimeStart = new Date(
      parse(obj.startDateTime, 'dd/MM/yy HH:mm', new Date()),
    );
    const dateTimeEnd = new Date(
      parse(obj.endDateTime, 'dd/MM/yy HH:mm', new Date()),
    );
    // TODO: The time difference is wrong
    // Diference in milliseconds of time part
    const diffMSeconds = dateTimeEnd.getTime() - dateTimeStart.getTime();
    // 36e5 is the scientific notation for 60*60*1000
    const diffHours = Math.abs(diffMSeconds) / 36e6;

    // Round hours and minutes
    const hours = Math.floor(diffHours);
    const minutes = Math.round((diffHours - hours) * 60);

    // Add correct 0 to left
    const hoursString = hours.toString().padStart(2, '0');
    const minutesString = minutes.toString().padStart(2, '0');

    // Form time pattern (HH:mm)
    return `${hoursString}:${minutesString}`;
  })
  realizadoHoras: string;

  @Expose({ name: 'description' })
  realizadoObservacao: string;

  @Expose()
  realizadoAprovado: 'false';
}
