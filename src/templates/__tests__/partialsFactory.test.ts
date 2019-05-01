import { partialsFactory } from '../partialsFactory'

describe('partialsFactory', () => {
  it('should load up correctly', () => {
    const result = partialsFactory(__dirname + '/../../../templates')

    expect(result['header']).toContain('Notus')
    expect(result['footer']).toContain('About')
    expect(result['style']).toContain('<style>')
  })
})