import { InputType, Field, Int } from '@nestjs/graphql';


@InputType()
export class PacienteInput {
  @Field(() => String, { nullable: true })
  id_paciente?: string;
  @Field(() => String,  { nullable: true })
  dni!: string;
  @Field(() => String, { nullable: true })
  nombre_paciente?: string;
  @Field(() => String,  { nullable: true })
  apellido_paciente?: string;
  @Field(() => Int, { nullable: true })
  edad?: number;
  @Field(() => Int,  { nullable: true })
  altura?: number;
  @Field(() => String, { nullable: true })
  telefono?: string;
  @Field(() => Date,  { nullable: true })
  fecha_nacimiento?: Date;
  @Field(() => String,  { nullable: true })
  sexo?: string;
  @Field(() => String,  { nullable: true })
  grupo_sanguineo?: string;
  @Field(() => String,  { nullable: true })
  alergias?: string;
}

@InputType()
export class PacienteWhereInput {
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


}
