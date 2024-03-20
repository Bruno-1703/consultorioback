import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class EstudioInput {
  @Field(() => String, { nullable: true })
  id_estudio?: string;
  @Field(() => Date)
  fecha_realizacion: Date;
  @Field(() => String)
  tipo_estudio!: string;
  @Field(() => String, { nullable: true })
  resultado?: string;
  @Field(() => String)
  codigo_referencia!: string;
  @Field(() => String, { nullable: true })
  observaciones?: string;
  @Field(() => String)
  medico_solicitante!: string;
  @Field(() => Boolean, { nullable: true })
  urgente?: boolean;
}
@InputType()
export class EstudioWhereInput {
  @Field(() => String, { nullable: true })
  id_estudio?: string;
  @Field(() => Date)
  fecha_realizacion?: Date;
  @Field(() => String)
  tipo_estudio?: string;
  @Field(() => String, { nullable: true })
  resultado?: string;
  @Field(() => String)
  codigo_referencia?: string;
}
