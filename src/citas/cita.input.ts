import { InputType, Field } from '@nestjs/graphql';
import { EnfermedadInput } from 'src/enfermedad/enfermedad.input';
import { EstudioInput } from 'src/estudios/estudio.input';
import { MedicamentoInput } from 'src/medicamentos/medicamento.input';
import { PacienteInput } from 'src/paciente/paciente.input';

@InputType()
export class CitaInput {
  @Field(() => String, { nullable: true })
  motivoConsulta?: string;
  @Field(() => String, { nullable: true })
  observaciones?: string;



}
@InputType()
export class CitaWhereInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  motivoConsulta?: string;
  @Field(() => Date, { nullable: true })
  fechaSolicitud?: Date;
  @Field(() => String, { nullable: true })
  observaciones?: string;
  @Field(() => Boolean, { nullable: true })
  cancelada?: boolean;
  @Field(() => String, { nullable: true })
  buscar?: string | undefined;

  @Field(() => [EstudioInput], { nullable: true })
  estudios?: EstudioInput;

  @Field(() => [MedicamentoInput], { nullable: true })
  medicamentos?: MedicamentoInput[];
  
  @Field(() => [EnfermedadInput], { nullable: true })
  enfermedades?: EnfermedadInput[];
  
  @Field(() =>PacienteInput , { nullable: true })
  paciente?: PacienteInput;

}

