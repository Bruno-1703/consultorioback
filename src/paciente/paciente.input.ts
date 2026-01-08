import { InputType, Field, Int, ID } from '@nestjs/graphql';


@InputType()
export class PacienteInput {
 @Field(() => String, )
dni: string;

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

  @Field(() => String, { nullable: true })
  obra_social?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  direccion?: string;

  @Field(() => String, { nullable: true })
  nacionalidad?: string;
}

@InputType()
export class PacienteCitaInput {
  @Field(() => ID, { nullable: true })
  id_paciente?: string;
  @Field(() => String, { nullable: true })
  dni: string;
  @Field(() => String, { nullable: true })
  nombre_paciente?: string;
  @Field(() => String, { nullable: true })
  apellido_paciente?: string;

}

@InputType()
export class PacienteWhereInput {
  @Field(() => String, { nullable: true })
  id_paciente?: string;

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

  @Field(() => String, { nullable: true })
  obra_social?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  direccion?: string;

  @Field(() => String, { nullable: true })
  nacionalidad?: string;

  @Field(() => Boolean, { nullable: true })
  eliminadoLog?: boolean;

}
