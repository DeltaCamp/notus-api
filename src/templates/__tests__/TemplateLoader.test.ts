import { TemplateLoader } from '../TemplateLoader'

describe('TemplateLoader', () => {
  let loader

  let oldBaseDir

  beforeEach(() => {
    oldBaseDir = process.env.TEMPLATES_BASE_DIR
    process.env.TEMPLATES_BASE_DIR = __dirname + '/../../../templates'
    loader = new TemplateLoader()
  })

  afterEach(() => {
    process.env.TEMPLATES_BASE_DIR = oldBaseDir
  })

  describe('load()', () => {
    it('should correctly load a template', () => {
      expect(loader.load('magic_link.template.html.mst')).toContain('Use the magic link below to login')
    })
  })
})