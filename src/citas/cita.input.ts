import { InputType, Field, ID } from '@nestjs/graphql';
import { EnfermedadInput } from 'src/enfermedad/enfermedad.input';
import { EstudioInput } from 'src/estudios/estudio.input';
import { MedicamentoInput } from 'src/medicamentos/medicamento.input';
import { PacienteCitaInput, PacienteInput } from 'src/paciente/paciente.input';

@InputType()
export class CitaInput {
  @Field(() => String, { nullable: true })
  motivoConsulta?: string;
  @Field(() => String, { nullable: true })
  observaciones?: string;
  @Field(() =>PacienteCitaInput , { nullable: true })
  paciente?: PacienteCitaInput;
  @Field(() => Date,{ nullable: true })
  fechaSolicitud?: Date;
}
@InputType()
export class CitaWhereInput {
  @Field(() => ID, { nullable: true }) 
  id_cita?: string;
  @Field(() => String, { nullable: true })
  motivoConsulta?: string;
  @Field(() => Date, { nullable: true })
  fechaSolicitud?: Date;
  @Field(() => String, { nullable: true })
  observaciones?: string;
  @Field(() => Boolean, { nullable: true })
  cancelada?: boolean;
  @Field(() => String, { nullable: true })
  buscar?: string ;

  @Field(() => [EstudioInput], { nullable: true })
  estudios?: EstudioInput;

  @Field(() => [MedicamentoInput], { nullable: true })
  medicamentos?: MedicamentoInput[];
  
  @Field(() => [EnfermedadInput], { nullable: true })
  enfermedades?: EnfermedadInput[];
  
  @Field(() =>PacienteCitaInput , { nullable: true })
  paciente?: PacienteCitaInput;

}

