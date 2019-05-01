const path = require('path')
const fs = require('fs')

export function partialsFactory(templatesBaseDir = __dirname + '/../../templates'): Map<string, string> {
  const partialsDirPath = path.join(templatesBaseDir, 'partials')
  const partialPaths = fs.readdirSync(partialsDirPath)
  return partialPaths.reduce((partials: Map<string, string>, partialFilename: string) => {
    const match = /_([\w]+)\..+/.exec(partialFilename)
    if (match) {
      const name = match[1]
      const template = fs.readFileSync(path.join(partialsDirPath, partialFilename), { encoding: 'utf-8' })
      partials[name] = template
    }
    return partials
  }, {})
}