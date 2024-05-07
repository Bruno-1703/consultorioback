import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UsuarioInput {
  @Field(() => String)
  nombre_usuario: string;
  @Field(() => String, { nullable: true })
  email?: string;
  @Field(() => String)
  password: string;
  @Field(() => String, { nullable: true })
  rol_usuario?: string;
}

@InputType()
export class UsuarioWhereInput {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  nombre_usuario?: string;
  @Field(() => String, { nullable: true })
  email?: string;
  @Field(() => String, { nullable: true })
  rol_usuario?: string;
  @Field(() => Boolean, { nullable: true })
  deletLogico?: boolean;
}
