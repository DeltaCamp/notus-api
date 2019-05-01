import { isProduction } from '../utils/isProduction'

const fs = require('fs')
const path = require('path')

const debug = require('debug')('notus:templates:TemplateLoader')

export class TemplateLoader {
  private readonly templateCache: Map<string, string>;

  constructor () {
    this.templateCache = new Map<string, string>();
  }

  templatesBaseDir() {
    return process.env.TEMPLATES_BASE_DIR || (__dirname + '/../../templates')
  }

  load(name: string): string {
    // If we have not loaded the file, or if we're not running in production
    if (!this.templateCache[name] || !isProduction()) {
      this.templateCache[name] = this.loadTemplate(name)
      debug(`Loaded ${name}`)
    }
    return this.templateCache[name]
  }

  loadTemplate(name: string): string {
    const templatePath = path.join(this.templatesBaseDir(), name)
    const template = fs.readFileSync(templatePath, { encoding: 'utf-8' })
    if (!template) {
      throw new Error(`Could not find template ${templatePath}`)
    }
    return template
  }
}
