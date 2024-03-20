import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { AggregateCount } from "../estudios/estudio.dto";

@ObjectType()
export class Medicamento{
  @Field(() => String, { nullable: true })
  id_medicamento: string;
  @Field(() => String, { nullable: true })
  nombre_med?: string;
  @Field(() => String)
  marca!: string;
  @Field(() => Date)
  fecha_vencimiento!: Date;
  @Field(() => String)
  dosis_hs!: string;
  @Field(() => String)
  agente_principal!: string;
  @Field(() => String)
  efectos_secundarios!: string;   
  @Field(() => Boolean, { nullable: true })
  lista_negra?: boolean | null;
  @Field(() => String) //Categoría o Tipo: Specify the category or type of the medication (e.g., analgesic, antibiotic, etc.).
  categoria?: string;
  @Field(() => String, { nullable: true })//Contraindicaciones: Incluya información sobre cualquier contraindicación o situaciones en las que no se debe utilizar el medicamento.
  contraindicaciones?: string;
  @Field(() => Boolean,{ nullable: true })
  prescripcion_requerida?: boolean;
}
@ObjectType()
export class MedicamentoEdge {
  @Field((_) => Medicamento)
  node!: Medicamento;
  @Field()
  cursor!: string;
}

@ObjectType()
export class MedicamentoResultadoBusqueda {
  @Field(() => MedicamentoEdge) 
  edges!: MedicamentoEdge [];
  @Field(() => AggregateCount)
  aggregate!: AggregateCount;
}
