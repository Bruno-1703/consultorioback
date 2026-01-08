import { Field, InputType, ID } from "@nestjs/graphql";

@InputType()
export class UsuarioInput {
  @Field(() => String, { nullable: true })
  id_Usuario?: string;

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
  
  @Field(() => String, { nullable: true }) 
  centroSaludId?: string;
}

@InputType()
export class UsuarioCitaInput {
   @Field(() => String, { nullable: true })
  id_Usuario?: string;

  @Field(() => String, { nullable: true })
  nombre_usuario?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  rol_usuario?: string;

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

  @Field(() => String, { nullable: true }) 
  centroSaludId?: string;
}

@InputType()
export class UsuarioWhereInput {


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
