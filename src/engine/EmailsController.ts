import {
  Controller,
  Get
} from '@nestjs/common'

import { TemplateRenderer } from '../templates/TemplateRenderer'

@Controller('emails')
export class EmailsController {

  constructor (
    private readonly renderer: TemplateRenderer
  ) {}

  @Get('/magic-link/html')
  async magicLinkHtml() {
    return this.renderer.renderHtmlTemplate('magic_link.template.html.mst', {
      notusNetworkUri: 'hello',
      oneTimeKey: 'asdf'
    })
  }

  @Get('/magic-link/text')
  async magicLinkText() {
    return this.renderer.renderTemplate('magic_link.template.text.mst', {
      notusNetworkUri: 'hello',
      oneTimeKey: 'asdf'
    })
  }
}
