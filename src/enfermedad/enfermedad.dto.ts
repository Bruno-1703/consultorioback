import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { AggregateCount } from '../estudios/estudio.dto';

@ObjectType()
export class Enfermedad {
  @Field(() => String, { nullable: true })
  id_enfermedad?: string;
  @Field(() => String)
  nombre_enf: string;
  @Field(() => String, { nullable: true })
  sintomas: string;
  @Field(() => String)
  gravedad: string;
}
@ObjectType()
export class EnfermedadEdge {
  @Field(() => Enfermedad)
  node!: Enfermedad;
  @Field()
  cursor!: string;
}
@ObjectType()
export class EnfermedadResultadoBusqueda {
  @Field(() => [EnfermedadEdge])
  edges!: EnfermedadEdge[];
  @Field(() => AggregateCount)
  aggregate!: AggregateCount;
}
