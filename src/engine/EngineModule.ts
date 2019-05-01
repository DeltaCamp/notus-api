import { Module } from '@nestjs/common';

import { EventsMatcher } from './EventsMatcher';
import { BlockHandler } from './BlockHandler'
import { BlockListener } from './BlockListener';
import { EthersProvider } from './EthersProvider';
import { BlockListenerManager } from './BlockListenerManager';
import { Matcher } from './Matcher';
import { MatchHandler } from './MatchHandler';
import { EmailsController } from './EmailsController'
import { ActionContextsHandler } from './ActionContextsHandler'
import { UserActionContextsHandler } from './UserActionContextsHandler'

@Module({
  providers: [
    ActionContextsHandler,
    BlockHandler,
    BlockListener,
    BlockListenerManager,
    EthersProvider,
    EventsMatcher,
    Matcher,
    MatchHandler,
    UserActionContextsHandler
  ],

  exports: [
    BlockHandler
  ],

  controllers: [
    EmailsController
  ]
})
export class EngineModule {}
