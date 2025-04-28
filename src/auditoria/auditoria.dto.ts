import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Accion } from './auditoria.input';


@ObjectType()
export class Auditoria {
  @Field(() => ID)
  id: string; // ID de la auditoría

  @Field(() => Date)
  fecha: Date; // Fecha de la acción de auditoría

  @Field(() => Accion, { nullable: true })
  accion?: Accion; // Enum de tipo Accion, indicando si fue crear, actualizar o eliminar

  @Field(() => String, { nullable: true })
  usuarioId?: string; // ID del usuario que realizó la acción

  @Field(() => String, { nullable: true })
  usuarioNom?: string; // Nombre o correo electrónico del usuario

  @Field(() => String, { nullable: true })
  detalles?: string; // Detalles de la acción realizada

  @Field(() => String, { nullable: true })
  modelo?: string; 

  @Field(() => String, { nullable: true })
  observaciones?: string; // Observaciones adicionales sobre la acción

  @Field(() => Boolean, { nullable: true })
  urgente?: boolean; // Indica si la acción es urgente
}

@ObjectType()
export class AuditoriaEdge {
  @Field((_) => Auditoria)
  node!: Auditoria;
  @Field()
  cursor!: string;
}
@ObjectType()
export class AggregateCount {
  @Field()
  count!: number;
}
@ObjectType()
export class AuditoriaResultadoBusqueda {
  @Field(() => [AuditoriaEdge])
  edges!: AuditoriaEdge[];
  @Field(() => AggregateCount)
  aggregate!: AggregateCount;
}
