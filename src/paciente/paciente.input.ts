import { InputType, Field, Int } from '@nestjs/graphql';
import { CitaInput } from 'src/citas/cita.input';
import { EstudioInput } from 'src/estudios/estudio.input';
import { MedicamentoInput } from 'src/medicamentos/medicamento.input';
import { EnfermedadInput } from 'src/enfermedad/enfermedad.input';

@InputType()
export class PacienteInput {
  @Field(() => String, { nullable: true })
  id_paciente?: string;
  @Field(() => String)
  dni!: string;
  @Field(() => String, { nullable: true })
  nombre_paciente?: string;
  @Field(() => String)
  apellido_paciente!: string;
  @Field(() => Int)
  edad!: number;
  @Field(() => Int)
  altura!: number;
  @Field(() => String)
  telefono!: string;
  @Field(() => Date)
  fecha_nacimiento!: Date;
  @Field(() => String)
  sexo!: string;
  @Field(() => String)
  grupo_sanguineo!: string;
  @Field(() => String)
  alergias!: string;
  @Field(() => [CitaInput], { nullable: true })
  citas?: CitaInput[];

}
@InputType()
export class PacienteWhereInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  dni?: string;
  @Field(() => String, { nullable: true })
  nombre_paciente?: string;
  @Field(() => String, { nullable: true })
  apellido_paciente?: string;
  @Field(() => Int, { nullable: true })
  edad?: number;
  @Field(() => Int, { nullable: true })
  altura?: number;
  @Field(() => String, { nullable: true })
  telefono?: string;
  @Field(() => Date, { nullable: true })
  fecha_nacimiento?: Date;
  @Field(() => String, { nullable: true })
  sexo?: string;
  @Field(() => String, { nullable: true })
  grupo_sanguineo?: string;
  @Field(() => String, { nullable: true })
  alergias?: string;

  @Field(() => [CitaInput], { nullable: true })
  cita?: CitaInput[];
  @Field(() => EstudioInput, { nullable: true })
  estudios?: EstudioInput;
  @Field(() => [MedicamentoInput], { nullable: true })
  medicamentos?: [MedicamentoInput];
  @Field(() => [EnfermedadInput], { nullable: true })
  enfermedades?: [EnfermedadInput];
}
