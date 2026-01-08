import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateCount } from "src/estudios/estudio.dto";

@ObjectType()
export class Usuario {
  @Field(() => String, { nullable: true })
  id_Usuario?: string;

  @Field(() => String, { nullable: true })
  nombre_usuario: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String,)
  password?: string;

  @Field(() => Boolean, { nullable: true })
  deletLogico?: boolean;

  @Field(() => String, { nullable: true })
  rol_usuario?: string;
  
  @Field(() => String, { nullable: true })
  nombre_completo?: string;

  @Field(() => String, { nullable: true })
  especialidad: string;

  @Field(() => String, { nullable: true })
  matricula?: string;

  @Field(() => String, { nullable: true })
  telefono?: string;

  @Field(() => String, { nullable: true })
  dni: string;



}
@ObjectType()
export class UsuarioEdge {
  @Field(() => Usuario)
  node!: Usuario;
  @Field()
  cursor!: string;
}
@ObjectType()
export class UsuarioResultadoBusqueda {
  @Field(() => [UsuarioEdge])
  edges!: UsuarioEdge[];
  @Field(() => AggregateCount)
  aggregate!: AggregateCount;
}

