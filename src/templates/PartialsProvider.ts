import { Injectable } from '@nestjs/common';

import { isProduction } from '../utils/isProduction'
import { partialsFactory } from './partialsFactory'
import { TemplateLoader } from './TemplateLoader'

const debug = require('debug')('notus:templates:PartialsProvider')

@Injectable()
export class PartialsProvider {
  private partials: Map<string, string>;

  constructor (
    private readonly templateLoader: TemplateLoader
  ) {}

  get(): Map<string, string> {
    if (!this.partials || !isProduction()) {
      this.partials = partialsFactory(this.templateLoader.templatesBaseDir())
      debug('Loaded partials ', this.partials)
    }
    return this.partials
  }
}
