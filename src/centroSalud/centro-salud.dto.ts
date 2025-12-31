import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class CentroSalud {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  nombre: string;

  @Field(() => String)
  tipo: string; // "CIC", "HOSPITAL", "CONSULTORIO"

  @Field(() => String, { nullable: true })
  direccion?: string;
}

// Para cumplir con la estructura de paginación que usas en Citas
@ObjectType()
export class CentroSaludEdge {
  @Field(() => CentroSalud)
  node!: CentroSalud;

  @Field(() => String)
  cursor!: string;
}

@ObjectType()
export class AggregateCentroCount {
  @Field(() => Int)
  count: number;
}

@ObjectType()
export class CentroSaludResultadoBusqueda {
  @Field(() => [CentroSaludEdge])
  edges!: CentroSaludEdge[];

  @Field(() => AggregateCentroCount)
  aggregate!: AggregateCentroCount;
}