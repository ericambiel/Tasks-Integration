import { TaskDTO } from '@modules/fluig/dtos/TaskDTO';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export default class FluigTaskModel implements TaskDTO {
  @Expose()
  @Transform(({ obj }) => {
    console.log(obj);
  })
  realizadoId: string;

  @Expose()
  txtAprovacao: '';

  @Expose()
  aprovadoAprovacaoCheckbox: 'on';

  @Expose()
  realizadoNumeroOMOP: string;

  @Expose()
  realizadoCodOMOP: string;

  @Expose()
  realizadoProjeto: string;

  @Expose()
  realizadoOperacaoTarefa: '20' | '300' | string;

  @Expose()
  realizadoOperacaoTarefaNome:
    | 'HORAS TRABALHADAS'
    | 'HORAS ENGENHARIA IT'
    | string;

  @Expose()
  realizadoData: string;

  @Expose()
  realizadoInicio: string;

  @Expose()
  realizadoFim: string;

  @Expose()
  realizadoHoras: string;

  @Expose()
  realizadoObservacao: string;

  @Expose()
  realizadoAprovado: 'false';
}
