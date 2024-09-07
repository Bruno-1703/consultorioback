import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class EstudioInput {
  @Field(() => String, { nullable: true })
  id_estudio?: string;
  @Field(() => Date, { nullable: true })
  fecha_realizacion: Date;
  @Field(() => String, { nullable: true })
  tipo_estudio: string;
  @Field(() => String, { nullable: true })
  resultado?: string;
  @Field(() => String, { nullable: true })
  codigo_referencia: string;
  @Field(() => String, { nullable: true })
  observaciones?: string;
  @Field(() => String, { nullable: true })
  medico_solicitante: string;
  @Field(() => Boolean, { nullable: true })
  urgente?: boolean;
}
@InputType()
export class EstudioWhereInput {
  @Field(() => String, { nullable: true })
  id_estudio?: string;
  @Field(() => Date, { nullable: true })
  fecha_realizacion?: Date;
  @Field(() => String, { nullable: true })
  tipo_estudio?: string;
  @Field(() => String, { nullable: true })
  resultado?: string;
  @Field(() => String, { nullable: true })
  codigo_referencia?: string;
}
