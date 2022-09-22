/**
 * Object created by a task form at Fluig
 */
import { ISheetOMOPModel } from '@modules/integration/infra/local/models/SheetOMOPModel';
import { FormPropertyDTO } from '@modules/fluig/dtos/FormPropertyDTO';

export type TaskFormDataDTO = [
  {
    name: 'gerente';
    /**
     * Manager OP/OM user, get from Dataset (Find OM/OP by ID)
     * @example
     * 'sevarolb'
     */
    value: string;
  },
  {
    name: 'nomeGerente';
    value: '';
  },
  {
    name: 'dtAprovacao';
    value: '';
  },
  {
    name: 'horaAprovacao';
    value: '';
  },
  {
    name: 'apontamentosRealizadosJson';
    /**
     * All tasks {TaskDTO[]} value here in JSON format string (stringify)
     */
    value: string;
  },
  {
    name: 'apontamentosAprovados';
    value: '';
  },
  {
    name: 'solicitacao';
    value: '';
  },
  {
    name: 'solicitante';
    /**
     * Get from User is connected - Get Colleague by username, use JWT to given username
     * @example
     * 'Eric Ambiel'
     */
    value: string;
  },
  {
    name: 'txtMatriculaSolicitante';
    value: '';
  },
  {
    name: 'txtEmailSolicitante';
    value: '';
  },
  {
    name: 'dataSolicitacao';
    /**
     * Solicitation date
     * @example
     * '17/08/2022'
     */
    value: string;
  },
  {
    name: 'txtHoraSolicitacao';
    /**
     * Local your solicitation time
     * @example
     * '17:09:11'
     */
    value: string;
  },
  {
    name: 'tipoApontamento';
    /* Type of project task in */
    value: ISheetOMOPModel['projectType'];
  },
  {
    name: 'codTecnico';
    /**
     * Worker registration (Matricula) - Given by USER
     * @example
     * '102878'
     */
    value: string;
  },
  {
    name: 'nomeTecnico';
    /**
     * Get from "Find Technician by Matricula (codTec)"
     * @example
     * 'Eric Ambiel' */
    value: string;
  },
  {
    name: 'atividades';
    /** @example
     * 'Work on the XPTO project' */
    value: string;
  },
  {
    name: 'observacoes';
    value: '';
  },
  {
    name: 'apontamentoNumeroOM_OP';
    value: '';
  },
  {
    name: 'apontamentoCodOM_OP';
    value: '';
  },
  {
    name: 'apontamentoProjeto';
    value: '';
  },
  {
    name: 'apontamentoOperacaoTarefa';
    value: '';
  },
  {
    name: 'apontamentoData';
    value: '';
  },
  {
    name: 'apontamentoInicio';
    value: '';
  },
  {
    name: 'apontamentoFim';
    value: '';
  },
  {
    name: 'apontamentoHoras';
    value: '';
  },
  {
    name: 'apontamentoObservacao';
    value: '';
  },
  {
    name: 'realizadoId';
    value: '';
  },
  {
    name: 'txtAprovacao';
    value: '';
  },
  {
    name: 'realizadoNumeroOMOP';
    value: '';
  },
  {
    name: 'realizadoCodOMOP';
    value: '';
  },
  {
    name: 'realizadoProjeto';
    value: '';
  },
  {
    name: 'realizadoOperacaoTarefa';
    value: '';
  },
  {
    name: 'realizadoOperacaoTarefaNome';
    value: '';
  },
  {
    name: 'realizadoData';
    value: '';
  },
  {
    name: 'realizadoInicio';
    value: '';
  },
  {
    name: 'realizadoFim';
    value: '';
  },
  {
    name: 'realizadoHoras';
    value: '';
  },
  {
    name: 'realizadoObservacao';
    value: '';
  },
  {
    name: 'realizadoAprovado';
    value: '';
  },
  {
    name: 'chkTipoApontamento';
    value: '';
  },
  {
    name: 'apontamentoOperacaoTarefaNome';
    value: '';
  },
  {
    name: 'aprovadoAprovacaoCheckbox';
    value: '';
  },
  //
  // Here need get all properties from "taskJSON" array
  // and add "___realizadoId" in each key object name
  //
  // ...TaskSerializedDTO,
  ...FormPropertyDTO[],
];
