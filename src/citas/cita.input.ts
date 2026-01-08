import { InputType, Field, ID } from '@nestjs/graphql';
import { EnfermedadInput } from 'src/enfermedad/enfermedad.input';
import { EstudioInput } from 'src/estudios/estudio.input';
import { MedicamentoInput } from 'src/medicamentos/medicamento.input';
import { PacienteCitaInput, PacienteInput } from 'src/paciente/paciente.input';
import { UsuarioCitaInput, UsuarioInput } from 'src/users/usuario.input';

@InputType()
@InputType()
export class CitaInput {
  @Field(() => ID, { nullable: true })
  id_cita?: string;

  @Field(() => String, { nullable: true })
  motivoConsulta?: string;

  @Field(() => String, { nullable: true })
  observaciones?: string;

  @Field(() => PacienteCitaInput, { nullable: true })
  paciente?: PacienteCitaInput;

  @Field(() => Date, { nullable: true })
  fechaProgramada?: Date;


  @Field(() => Boolean, { nullable: true })
  finalizada?: boolean;

  @Field(() => UsuarioCitaInput, { nullable: true })
  doctor?: UsuarioCitaInput;

  @Field(() => ID, { nullable: true })
  registradoPorId?: string;


}

@InputType()
export class CitaReprogramarInput {
  @Field()
  fechaProgramada: Date; // Solo necesitamos la nueva fecha

  @Field({ nullable: true })
  registradoPorId?: string;
}

@InputType()
export class CitaWhereInput {
  @Field(() => ID, { nullable: true })
  id_cita?: string;

  @Field(() => String, { nullable: true })
  motivoConsulta?: string;

  @Field(() => Boolean, { nullable: true })
  finalizada?: boolean;

  @Field(() => Date, { nullable: true })
  fechaProgramada?: Date;

  @Field(() => String, { nullable: true })
  observaciones?: string;

  @Field(() => String, { nullable: true })
  diagnostico?: string;

  @Field(() => Boolean, { nullable: true })
  cancelada?: boolean;

  @Field(() => String, { nullable: true })
  buscar?: string;

  @Field(() => [EstudioInput], { nullable: true })
  estudios?: EstudioInput[];

  @Field(() => [MedicamentoInput], { nullable: true })
  medicamentos?: MedicamentoInput[];

  @Field(() => [EnfermedadInput], { nullable: true })
  enfermedades?: EnfermedadInput[];

  @Field(() => PacienteCitaInput, { nullable: true })
  paciente?: PacienteCitaInput;

  @Field(() => UsuarioCitaInput, { nullable: true })
  doctor?: UsuarioCitaInput;

  @Field(() => ID, { nullable: true })
  registradoPorId?: string;

}

@InputType()
export class CitaDiagnosticoInput {
  @Field(() => String)
  diagnostico: string;
}