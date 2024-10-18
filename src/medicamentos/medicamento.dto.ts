import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { AggregateCount } from 'src/estudios/estudio.dto';

@ObjectType()
export class Medicamento {
  @Field(() => String, { nullable: true })
  id_medicamento?: string;
  @Field(() => String, { nullable: true })
  nombre_med?: string;
  @Field(() => String, { nullable: true })
  marca: string;
  @Field(() => Date, { nullable: true })
  fecha_vencimiento?: Date;
  @Field(() => String , { nullable: true })
  dosis_hs?: string;
  @Field(() => String, { nullable: true })
  agente_principal?: string;
  @Field(() => String, { nullable: true })
  efectos_secundarios?: string;
  @Field(() => Boolean, { nullable: true })
  lista_negra?: boolean | null;
  @Field(() => String , { nullable: true }) 
  categoria?: string;
  @Field(() => String, { nullable: true }) 
  contraindicaciones?: string;
  @Field(() => Boolean, { nullable: true })
  prescripcion_requerida?: boolean;
  @Field(() => Boolean, { nullable: true })
  eliminadoLog?: Boolean;
}
@ObjectType()
export class MedicamentoEdge {
  @Field(() => Medicamento, { nullable: true })
  node?: Medicamento;
  @Field()
  cursor!: string;
}

@ObjectType()
export class MedicamentoResultadoBusqueda {
  @Field(() => MedicamentoEdge)
  edges!: MedicamentoEdge[];
   @Field(() => AggregateCount)
   aggregate!: AggregateCount;
}
