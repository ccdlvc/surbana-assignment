import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from './modules/location.module';
import { SanitizeMiddleware } from './middlewares/sanitize.middleware';
import { loggerConfig } from './common/logger.config';
import { WinstonModule } from 'nest-winston';
import { BuildingModule } from './modules/building.module';
import { Building } from './entities/building.entity';
import { Location } from './entities/location.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        schema: configService.get<string>('DB_SCHEMA'),
        entities: [Location, Building],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRoot(loggerConfig),
    LocationModule,
    BuildingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SanitizeMiddleware).forRoutes('*');
  }
}
