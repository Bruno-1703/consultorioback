import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Estudio {
  @Field(() => String)
  id_estudio: string;
  @Field(() => Date)
  fecha_realizacion?: Date;
  @Field(() => String)
  tipo_estudio?: string;
  @Field(() => String, { nullable: true })
  resultado?: string;
  @Field(() => String)
  codigo_referencia?: string;
  @Field(() => String, { nullable: true })
  observaciones?: string;
  @Field(() => String)
  medico_solicitante?: string;
  @Field(() => Boolean, { nullable: true })
  urgente?: boolean;
}
@ObjectType()
export class EstudioEdge {
  @Field((_) => Estudio)
  node!: Estudio;
  @Field()
  cursor!: string;
}
@ObjectType()
export class AggregateCount {
  @Field()
  count!: number;
}
@ObjectType()
export class EstudioResultadoBusqueda {
  @Field(() => [EstudioEdge])
  edges!: EstudioEdge[];
  @Field(() => AggregateCount)
  aggregate!: AggregateCount;
}
