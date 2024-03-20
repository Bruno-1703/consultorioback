import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { AggregateCount } from "../estudios/estudio.dto";

@ObjectType()
export class Cita{
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  pacienteId?: string;
  @Field(() => String)
  motivoConsulta: string;
  @Field(() => Date)
  fechaSolicitud: Date;
  @Field(() => Date, { nullable: true })
  fechaConfirmacion?: Date;
  @Field(() => String, { nullable: true })
  observaciones?: string;   
}
@ObjectType()
export class CitaEdge {
  @Field(() => Cita)
  node!: Cita
  @Field()
  cursor!: string;
}
@ObjectType()
export class CitaResultadoBusqueda {
  @Field(() => [CitaEdge])
  edges!: CitaEdge[];
  @Field(() => AggregateCount)
  aggregate!: AggregateCount;
}
