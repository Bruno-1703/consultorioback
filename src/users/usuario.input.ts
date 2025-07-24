import { Field, InputType, ID } from "@nestjs/graphql";

@InputType()
export class UsuarioInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => String)
  nombre_usuario: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  rol_usuario?: string;

  @Field(() => String)
  nombre_completo: string;

  @Field(() => String)
  especialidad: string;

  @Field(() => String)
  matricula: string;

  @Field(() => String, { nullable: true })
  telefono?: string;

  @Field(() => String)
  dni: string;
}

@InputType()
export class UsuarioCitaInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => String)
  nombre_usuario: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  rol_usuario?: string;

  @Field(() => String)
  nombre_completo: string;

  @Field(() => String, { nullable: true })
  especialidad?: string;

  @Field(() => String)
  matricula: string;

  @Field(() => String, { nullable: true })
  telefono?: string;

  @Field(() => String)
  dni: string;
}

@InputType()
export class UsuarioWhereInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  nombre_usuario?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  rol_usuario?: string;

  @Field(() => Boolean, { nullable: true })
  deletLogico?: boolean;

  @Field(() => String, { nullable: true })
  nombre_completo?: string;

  @Field(() => String, { nullable: true })
  especialidad?: string;

  @Field(() => String, { nullable: true })
  matricula?: string;

  @Field(() => String, { nullable: true })
  telefono?: string;

  @Field(() => String, { nullable: true })
  dni?: string;
}
