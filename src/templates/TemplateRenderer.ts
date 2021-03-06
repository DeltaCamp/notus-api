import { Injectable } from '@nestjs/common'

import { TemplateLoader } from './TemplateLoader';
import { PartialsProvider } from './PartialsProvider';

const Mustache = require('mustache')
const juice = require('juice')

const debug = require('debug')('notus:templates:TemplateRenderer')

@Injectable()
export class TemplateRenderer {

  constructor (
    private readonly templateLoader: TemplateLoader,
    private readonly partialsProvider: PartialsProvider
  ) {}

  render(template: string, view: any): string {
    const partials = this.partialsProvider.get()
    return Mustache.render(template, view, partials)
  }

  renderTemplate(templateName: string, view: any) {
    debug(`renderTemplate(${templateName})`)
    return this.render(this.templateLoader.load(templateName), view)
  }

  renderHtml(template: string, context: any): string {
    return juice(this.render(template, context), {
      applyStyleTags: true,
      removeStyleTags: true,
      applyWidthAttributes: true,
      applyHeightAttributes: true
    })
  }

  renderHtmlTemplate(templateName: string, view: any): string {
    debug(`renderHtmlTemplate(${templateName})`)    
    return this.renderHtml(this.templateLoader.load(templateName), view)
  }
}
