import {
  Controller,
  Get
} from '@nestjs/common'

import { BaseTemplateView } from '../templates/BaseTemplateView'
import { TemplateRenderer } from '../templates/TemplateRenderer'

const debug = require('debug')('notus:engine:EmailsController')

@Controller('emails')
export class EmailsController {

  constructor (
    private readonly renderer: TemplateRenderer
  ) {}

  @Get('/magic-link/html')
  async magicLinkHtml() {
    return this.renderer.renderHtmlTemplate('magic_link.template.html.mst', this.newView({
      oneTimeKey: 'asdf'
    }))
  }

  @Get('/magic-link/text')
  async magicLinkText() {
    return this.renderer.renderTemplate('magic_link.template.text.mst', this.newView({
      oneTimeKey: 'asdf'
    }))
  }

  @Get('/welcome/html')
  async welcomeHtml() {
    return this.renderer.renderHtmlTemplate('welcome.template.html.mst', this.newView({
      oneTimeKey: 'asdf'
    }))
  }

  @Get('/welcome/text')
  async welcomeText() {
    return this.renderer.renderTemplate('welcome.template.text.mst', this.newView({
      oneTimeKey: 'asdf'
    }))
  }

  @Get('/event/html')
  async eventHtml() {
    return this.renderer.renderHtmlTemplate('event.template.html.mst', this.newView({
      events: [
        this.newSingleEventView()
      ]
    }))
  }

  @Get('/event/text')
  async eventText() {
    return this.renderer.renderHtmlTemplate('event.template.text.mst', this.newView({
      events: [
        this.newSingleEventView()
      ]
    }))
  }

  private newSingleEventView() {
    return this.newView({
      title: 'transaction',
      block: {
        number: 9999
      },
      matchers: [
        { isFirst: true, isLast: false, description: 'the transaction value is greater than 1000' },
        { isFirst: false, isLast: true, description: 'the transaction to is equal to 0x0000234' }
      ]
    })
  }
    
  private newView(extraView) {
    const view = new BaseTemplateView()
    Object.assign(view, extraView)
    return view
  }
}
