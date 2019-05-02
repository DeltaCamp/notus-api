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
import { EmailActionHandler } from './EmailActionHandler'
import { WebhookActionHandler } from './WebhookActionHandler'

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
    EmailActionHandler,
    WebhookActionHandler
  ],

  exports: [
    BlockHandler
  ],

  controllers: [
    EmailsController
  ]
})
export class EngineModule {}
