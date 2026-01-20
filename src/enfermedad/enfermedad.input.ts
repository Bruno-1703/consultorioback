import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class EnfermedadInput {
   @Field(() => String,{ nullable: true })
  id_enfermedad: string;

  @Field(() => String,)
  nombre_enf: string;

  @Field(() => String, { nullable: true })
  sintomas?: string;

  @Field(() => String, { nullable: true })
  tipo?: string;

  @Field(() => String, { nullable: true })
  gravedad?: string;

  @Field(() => String, { nullable: true })
  tratamiento?: string;


}


@InputType()
export class ActualizarEnfermedadInput {
  @Field(() => String, { nullable: true })
  id_enfermedad: string;

  @Field(() => String, { nullable: true })
  nombre_enf?: string;

  @Field(() => String, { nullable: true })
  sintomas?: string;

  @Field(() => String, { nullable: true })
  tipo?: string;

  @Field(() => String, { nullable: true })
  gravedad?: string;

  @Field(() => String, { nullable: true })
  tratamiento?: string;


}
@InputType()
export class EnfermedadWhereInput {
  @Field(() => String, { nullable: true })
  id_enfermedad?: string;

  @Field(() => String, { nullable: true })
  nombre_enf?: string;

  @Field(() => String, { nullable: true })
  tipo?: string;

  @Field(() => String, { nullable: true })
  gravedad?: string;

  @Field(() => Boolean, { nullable: true })
  eliminadoLog?: boolean;
}
