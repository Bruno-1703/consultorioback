import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CitaModule } from './citas/cita.module';
import { EstudioModule } from './estudios/estudio.module';
import { MedicamentoModule } from './medicamentos/medicamento.module';
import { PrismaClient } from '@prisma/client';
import { PacienteModule } from './paciente/paciente.module';
import { EnfermedadModule } from './enfermedad/enfermedad.module';
import { UsersModule } from './users/usuario.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaClient,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.graphql',
    }),
    CitaModule,
    EstudioModule,
    MedicamentoModule,
    PrismaClient,
    PacienteModule,
    EnfermedadModule,
    UsersModule,
    AuthModule
  ],
  controllers: [],
})
export class AppModule {}
