import {
  Module
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventTypeEntity } from './EventTypeEntity'
import { EventTypeResolver } from './EventTypeResolver'
import { EventTypeService } from './EventTypeService'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventTypeEntity,
    ])
  ],
  providers: [
    EventTypeResolver, EventTypeService
  ],

  exports: [
    EventTypeService
  ]
})
export class EventTypeModule {}
