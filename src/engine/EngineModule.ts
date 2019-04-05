import { Module } from '@nestjs/common';

import { BlockHandler } from './BlockHandler';
import { BlockListener } from './BlockListener';
import { BlockListenerManager } from './BlockListenerManager';
import { Matcher } from './Matcher';
import { MatchHandler } from './MatchHandler';

@Module({
  providers: [
    BlockHandler, BlockListener, BlockListenerManager, Matcher, MatchHandler
  ]
})
export class EngineModule {}
