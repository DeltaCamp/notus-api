import { Module } from '@nestjs/common';

import { TemplateRenderer } from './TemplateRenderer'
import { PartialsProvider } from './PartialsProvider'
import { TemplateLoader } from './TemplateLoader'

@Module({
  providers: [
    TemplateRenderer, PartialsProvider, TemplateLoader
  ],

  exports: [
    TemplateRenderer, PartialsProvider
  ]
})
export class TemplateModule {}
