import { Module } from '@nestjs/common';

import { EventsMatcher } from './EventsMatcher';
import { BlockHandler } from './BlockHandler'
import { BlockListener } from './BlockListener';
import { EthersProvider } from './EthersProvider';
import { BlockListenerManager } from './BlockListenerManager';
import { Matcher } from './Matcher';
import { MatchHandler } from './MatchHandler';
import { EmailsController } from './EmailsController'

@Module({
  providers: [
    EventsMatcher, BlockListener, BlockListenerManager, Matcher, MatchHandler, BlockHandler, EthersProvider
  ],

  exports: [
    BlockHandler
  ],

  controllers: [
    EmailsController
  ]
})
export class EngineModule {}
