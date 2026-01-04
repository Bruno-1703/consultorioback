import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CentroSaludInput {

  @Field()
  nombre: string;

  @Field()
  tipo: string;

  @Field({ nullable: true })
  direccion?: string;

}

@InputType()
export class CentroSaludWhereInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  nombre?: string;

  @Field({ nullable: true })
  tipo?: string;
  
  @Field({ nullable: true })
  direccion?: string;

}