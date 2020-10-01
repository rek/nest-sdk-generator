import * as path from 'path'
import { List, RecordDict } from 'typescript-core'

import { SdkModules } from '../analyzer/controllers'
import { SdkMethodParams } from '../analyzer/params'
import { unparseRoute } from '../analyzer/route'

// Returned codes are not formatted yet
export function generateSdkModules(modules: SdkModules): RecordDict<string> {
  const genFiles = new RecordDict<string>()

  for (const [moduleName, controllers] of modules) {
    for (const [controllerName, controller] of controllers) {
      const out: string[] = []

      out.push("/// Auto-generated file (Boilerplate's SDK generator)")
      out.push('/// Please do not edit this file - re-generate the SDK using the generator instead.')
      out.push('/// Generated on: ' + new Date().toUTCString())
      out.push('///')
      out.push('/// Parent module: ' + moduleName)
      out.push(`/// Controller: "${controllerName}" registered as "${controller.registrationName}" (${controller.methods.size} routes)`)
      out.push('')
      out.push('import * as central from "../../central";')

      const imports = new RecordDict<List<string>>()

      const depsToImport = controller.classDeps

      for (const controller of controllers.values()) {
        for (const method of controller.methods.values()) {
          depsToImport.push(method.returnType)
          method.params.arguments.some((deps) => depsToImport.push(...deps.values()))
          method.params.query.some((deps) => depsToImport.push(...deps.values()))
          method.params.body.some((body) => (body.full ? depsToImport.push(body.type) : depsToImport.push(...body.fields.values())))
        }
      }

      for (const dep of depsToImport) {
        for (const [file, types] of dep.dependencies) {
          imports.getOrSet(file, new List()).pushNew(...types)
        }
      }

      for (const [file, types] of imports) {
        out.push(`import { ${types.join(', ')} } from "../../types/${file.replace(/\\/g, '/')}";`)
      }

      out.push('')
      out.push(`const ${controller.registrationName} = {`)

      for (const [methodName, method] of controller.methods) {
        const ret = method.returnType.resolvedType
        const promised = ret.startsWith('Promise<') ? ret : `Promise<${ret}>`

        out.push('')
        out.push(`  // ${methodName} @ ${unparseRoute(method.route)}`)
        out.push(`  ${method.name}(${stringifySdkMethodParams(method.params)}): ${promised} {`)
        out.push(`    return central.req("${method.type}", ${JSON.stringify(method.route.parts)}, args, query, body);`)
        out.push('  },')
      }

      out.push('')
      out.push('};')

      genFiles.set(path.join(moduleName, controller.registrationName + '.ts'), out.join('\n'))
    }

    // TODO: Generate module file that simply re-exports controllers
    genFiles.set(path.join(moduleName, 'index.ts'), '// TODO')
  }

  return genFiles
}

export function stringifySdkMethodParams(params: SdkMethodParams): string {
  const args = params.arguments.map((rec) => rec.mapToArray((name, type) => `${name}: ${type.resolvedType}`).join(', '))

  const query = params.query.map((rec) => rec.mapToArray((name, type) => `${name}: ${type.resolvedType}`).join(', '))

  const body = params.body.map((body) =>
    body.full ? body.type.resolvedType : '{ ' + body.fields.mapToArray((name, type) => `${name}: ${type.resolvedType}`).join(', ') + ' }'
  )

  return [
    `args: {${args.mapStr((args) => ' ' + args + ' ')}}`,
    `query: {${query.mapStr((query) => ' ' + query + ' ')}}`,
    `body: ${body.unwrapOr('{}')}`,
  ].join(', ')
}
