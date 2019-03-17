import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DappController } from './dapps/dapp.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot()
  ],
  controllers: [AppController, DappController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) { }
}
