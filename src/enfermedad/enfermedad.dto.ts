import { ObjectType, Field } from '@nestjs/graphql';
import { AggregateCount } from '../estudios/estudio.dto';

@ObjectType()
export class Enfermedad {
  @Field(() => String, { nullable: true })
  id_enfermedad?: string;

  @Field(() => String)
  nombre_enf: string;

  @Field(() => String, { nullable: true })
  sintomas: string;

  @Field(() => String, { nullable: true })
  gravedad: string;

  
  @Field(() => String, { nullable: true })
  tratamiento?: string;



  @Field(() => Boolean)
  eliminadoLog: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
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

