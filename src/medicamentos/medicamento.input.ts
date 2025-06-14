import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class MedicamentoInput {
  @Field(() => ID,{ nullable: true })
  id_medicamento: string;
  @Field(() => String, { nullable: true })
  nombre_med?: string;
  @Field(() => String, { nullable: true })
  marca!: string;
  @Field(() => Date, { nullable: true })
  fecha_vencimiento: Date;
  @Field(() => String, { nullable: true })
  dosis_hs!: string;
  @Field(() => String, { nullable: true })
  agente_principal: string;
  @Field(() => String, { nullable: true })
  efectos_secundarios!: string;
  @Field(() => Boolean, { nullable: true })
  lista_negra?: boolean | null;
  @Field(() => String, { nullable: true }) //Categoría o Tipo: Specify the category or type of the medication (e.g., analgesic, antibiotic, etc.).
  categoria?: string;
  @Field(() => String, { nullable: true }) //Contraindicaciones: Incluya información sobre cualquier contraindicación o situaciones en las que no se debe utilizar el medicamento.
  contraindicaciones?: string;
  @Field(() => Boolean, { nullable: true })
  prescripcion_requerida?: boolean;
  @Field(() => Int, { nullable: true })
  stock?: number; 
}
@InputType()
export class MedicamentoWhereInput {
   @Field(() => ID, { nullable: true })
   id_medicamento: string;
  @Field(() => String, { nullable: true })
  nombre_med?: string;
  @Field(() => String, { nullable: true })
  marca?: string;
  @Field(() => Date, { nullable: true })
  fecha_vencimiento?: Date;
  @Field(() => String, { nullable: true })
  dosis_hs?: string;
  @Field(() => String, { nullable: true })
  agente_principal?: string;
  @Field(() => String, { nullable: true })
  efectos_secundarios?: string;
  @Field(() => Boolean, { nullable: true })
  lista_negra?: boolean | null;
  @Field(() => String, { nullable: true }) 
  categoria?: string;
  @Field(() => String, { nullable: true }) 
  contraindicaciones?: string;
  @Field(() => Boolean, { nullable: true })
  prescripcion_requerida?: boolean;
  @Field(() => Boolean, { nullable: true })
  eliminadoLog?: Boolean;
  @Field(() => Int, { nullable: true })
  stock?: number;
}
