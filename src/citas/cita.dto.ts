import { ObjectType, Field, ID } from '@nestjs/graphql';
import { AggregateCount, Estudio } from '../estudios/estudio.dto';
import { Medicamento } from 'src/medicamentos/medicamento.dto';
import { Enfermedad } from 'src/enfermedad/enfermedad.dto';
import { Paciente } from 'src/paciente/paciente.dto';

@ObjectType()
export class Cita {
  @Field(() => ID,{ nullable: true })
  id_cita: string;
  @Field(() => String)
  motivoConsulta: string;
  @Field(() => Date)
  fechaSolicitud: Date;
  @Field(() => String, { nullable: true })
  observaciones?: string;
  @Field(() => Boolean, { nullable: true })
  cancelada?: boolean;
  @Field(() => [Medicamento], { nullable: true })
  medicamentos?: Medicamento[];
  @Field(() => [Estudio], { nullable: true })
  estudios?: Estudio[];
  @Field(() => [Enfermedad], { nullable: true })
  enfermedades?: Enfermedad[]; 
  @Field(() => Paciente, { nullable: true })
  paciente?: Paciente; 
  @Field(() => ID,{ nullable: true })
  id_userDoctor?: string;
  
}
@ObjectType()
export class CitaEdge {
  @Field(() => Cita)
  node!: Cita;
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
