import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class EnfermedadInput {
  @Field(() => String, { nullable: true })
  id_enfermedad?: string;
  @Field(() => String,{ nullable: true })
  nombre_enf?: string;
  @Field(() => String, { nullable: true })
  sintomas?: string;
  @Field(() => String,{ nullable: true })
  gravedad?: string;
}

@InputType()
export class EnfermedadWhereInput {
  @Field(() => String, { nullable: true })
  id_enfermedad?: string;
  @Field(() => String, { nullable: true })
  nombre_enf?: string;
  @Field(() => String, { nullable: true })
  sintomas?: string;
  @Field(() => String, { nullable: true })
  gravedad?: string;
}
