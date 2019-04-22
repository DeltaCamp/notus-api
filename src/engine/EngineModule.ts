import { Module } from '@nestjs/common';

import { BaseHandler } from './BaseHandler';
import { BlockListener } from './BlockListener';
import { BlockListenerManager } from './BlockListenerManager';
import { Matcher } from './Matcher';
import { MatchHandler } from './MatchHandler';
import { Renderer } from './Renderer'

@Module({
  providers: [
    BaseHandler, BlockListener, BlockListenerManager, Matcher, MatchHandler, Renderer
  ]
})
export class EngineModule {}
