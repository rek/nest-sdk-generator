"use strict";
/**
 * @file Generate SDK modules
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCentralRequest = exports.generateSdkMethodParams = exports.generateSdkModules = void 0;
const path = require("path");
const route_1 = require("../analyzer/route");
const typedeps_1 = require("../analyzer/typedeps");
const logging_1 = require("../logging");
/**
 * Generate the SDK's module and controllers files
 * @param modules
 * @returns
 */
function generateSdkModules(modules) {
    /** Generated module files */
    const genFiles = new Map();
    // Iterate over each module
    for (const [moduleName, controllers] of modules) {
        // Iterate over each of the module's controllers
        for (const [controllerName, controller] of controllers) {
            /** Generated controller's content */
            const out = [];
            out.push('/// Parent module: ' + moduleName);
            out.push(`/// Controller: "${controllerName}" registered as "${controller.registrationName}" (${controller.methods.length} routes)`);
            out.push('');
            out.push('import { request } from "../central";');
            const imports = new Map();
            const depsToImport = new Array();
            // Iterate over each controller
            for (const method of controller.methods.values()) {
                const { parameters: args, query, body } = method.params;
                depsToImport.push(method.returnType);
                if (args) {
                    depsToImport.push(...args.values());
                }
                if (query) {
                    depsToImport.push(...query.values());
                }
                if (body) {
                    if (body.full) {
                        depsToImport.push(body.type);
                    }
                    else {
                        depsToImport.push(...body.fields.values());
                    }
                }
            }
            // Build the imports list
            for (const dep of depsToImport) {
                for (const [file, types] of dep.dependencies) {
                    let imported = imports.get(file);
                    if (!imported) {
                        imported = [];
                        imports.set(file, imported);
                    }
                    for (const typ of types) {
                        if (!imported.includes(typ)) {
                            imported.push(typ);
                        }
                    }
                }
            }
            for (const [file, types] of imports) {
                out.push(`import type { ${types.join(', ')} } from "../_types/${(0, typedeps_1.normalizeExternalFilePath)(file.replace(/\\/g, '/'))}";`);
            }
            out.push('');
            out.push(`export default {`);
            for (const method of controller.methods) {
                const ret = method.returnType.resolvedType;
                const promised = ret.startsWith('Promise<') ? ret : `Promise<${ret}>`;
                out.push('');
                out.push(`  // ${method.httpMethod} @ ${(0, route_1.unparseRoute)(method.route)}`);
                out.push(`  ${method.name}(${generateSdkMethodParams(method.params)}): ${promised} {`);
                out.push(generateCentralRequest(method).replace(/^/gm, '    '));
                out.push('  },');
            }
            out.push('');
            out.push('};');
            genFiles.set(path.join(moduleName, controller.camelClassName + '.ts'), out.join('\n'));
        }
        /** Generated module's content */
        const moduleContent = [];
        moduleContent.push('/// Module name: ' + moduleName);
        moduleContent.push('');
        for (const controller of controllers.keys()) {
            moduleContent.push(`export { default as ${controller} } from "./${controller}";`);
        }
        // Generate the SDK module file
        genFiles.set(path.join(moduleName, 'index.ts'), moduleContent.join('\n'));
    }
    return genFiles;
}
exports.generateSdkModules = generateSdkModules;
/**
 * Generate the method parameters for a given SDK method
 * @param params
 * @returns
 */
function generateSdkMethodParams(params) {
    // List of parameters (e.g. `id` in `/get/:id`, analyzed from the usages of the `@Param` decorator)
    const parameters = params.parameters ? [...params.parameters].map(([name, type]) => `${name}: ${type.resolvedType}`) : [];
    // List of query values (e.g. `id` in `?id=xxx`, analyzed from the usages of the `@Query` decorator)
    const query = params.query ? [...params.query].map(([name, type]) => `${name}: ${type.resolvedType}`) : [];
    // Body's content (type used with the `@Body` decorator)
    const body = params.body
        ? params.body.full
            ? params.body.type.resolvedType
            : '{ ' + [...params.body.fields].map(([name, type]) => `${name}: ${type.resolvedType}`).join(', ') + ' }'
        : null;
    // The ternary conditions below are made to eclipse useless parameters
    // For instance, if we're not expecting any query nor body, these two parameters can be omitted when calling the method
    return [
        `params: {${' ' + parameters.join(', ') + ' '}}${parameters.length === 0 && !body && query.length === 0 ? ' = {}' : ''}`,
        `body: ${body !== null && body !== void 0 ? body : '{}'}${!body && query.length === 0 ? ' = {}' : ''}`,
        `query: {${' ' + query.join(', ') + ' '}}${query.length === 0 ? ' = {}' : ''}`,
    ].join(', ');
}
exports.generateSdkMethodParams = generateSdkMethodParams;
/**
 * Generate a request call to Central for the generated files
 * @param method
 * @returns
 */
function generateCentralRequest(method) {
    const resolvedRoute = (0, route_1.resolveRouteWith)(method.route, (param) => '${params.' + param + '}');
    if (resolvedRoute instanceof Error) {
        (0, logging_1.panic)('Internal error: failed to resolve route: ' + resolvedRoute.message);
    }
    return `return request('${method.httpMethod}', \`${resolvedRoute}\`, body, query)`;
}
exports.generateCentralRequest = generateCentralRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VubW9kdWxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nZW5lcmF0b3IvZ2VubW9kdWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILDZCQUE0QjtBQUk1Qiw2Q0FBa0U7QUFDbEUsbURBQWtGO0FBQ2xGLHdDQUFrQztBQUVsQzs7OztHQUlHO0FBQ0gsU0FBZ0Isa0JBQWtCLENBQUMsT0FBbUI7SUFDcEQsNkJBQTZCO0lBQzdCLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFBO0lBRTFDLDJCQUEyQjtJQUMzQixLQUFLLE1BQU0sQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLElBQUksT0FBTyxFQUFFO1FBQy9DLGdEQUFnRDtRQUNoRCxLQUFLLE1BQU0sQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDLElBQUksV0FBVyxFQUFFO1lBQ3RELHFDQUFxQztZQUNyQyxNQUFNLEdBQUcsR0FBYSxFQUFFLENBQUE7WUFFeEIsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxVQUFVLENBQUMsQ0FBQTtZQUM1QyxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixjQUFjLG9CQUFvQixVQUFVLENBQUMsZ0JBQWdCLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLFVBQVUsQ0FBQyxDQUFBO1lBQ3BJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDWixHQUFHLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUE7WUFFakQsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUE7WUFFM0MsTUFBTSxZQUFZLEdBQUcsSUFBSSxLQUFLLEVBQW9CLENBQUE7WUFFbEQsK0JBQStCO1lBQy9CLEtBQUssTUFBTSxNQUFNLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDaEQsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUE7Z0JBRXZELFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO2dCQUVwQyxJQUFJLElBQUksRUFBRTtvQkFDUixZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7aUJBQ3BDO2dCQUVELElBQUksS0FBSyxFQUFFO29CQUNULFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtpQkFDckM7Z0JBRUQsSUFBSSxJQUFJLEVBQUU7b0JBQ1IsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO3dCQUNiLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO3FCQUM3Qjt5QkFBTTt3QkFDTCxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO3FCQUMzQztpQkFDRjthQUNGO1lBRUQseUJBQXlCO1lBQ3pCLEtBQUssTUFBTSxHQUFHLElBQUksWUFBWSxFQUFFO2dCQUM5QixLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRTtvQkFDNUMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtvQkFFaEMsSUFBSSxDQUFDLFFBQVEsRUFBRTt3QkFDYixRQUFRLEdBQUcsRUFBRSxDQUFBO3dCQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFBO3FCQUM1QjtvQkFFRCxLQUFLLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBRTt3QkFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7NEJBQzNCLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7eUJBQ25CO3FCQUNGO2lCQUNGO2FBQ0Y7WUFFRCxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksT0FBTyxFQUFFO2dCQUNuQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsSUFBQSxvQ0FBeUIsRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUN6SDtZQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDWixHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUE7WUFFNUIsS0FBSyxNQUFNLE1BQU0sSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO2dCQUN2QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQTtnQkFDMUMsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFBO2dCQUVyRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUNaLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxNQUFNLENBQUMsVUFBVSxNQUFNLElBQUEsb0JBQVksRUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUNyRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sUUFBUSxJQUFJLENBQUMsQ0FBQTtnQkFDdEYsR0FBRyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7Z0JBQy9ELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7YUFDakI7WUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ1osR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUVkLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7U0FDdkY7UUFFRCxpQ0FBaUM7UUFDakMsTUFBTSxhQUFhLEdBQWEsRUFBRSxDQUFBO1FBRWxDLGFBQWEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsVUFBVSxDQUFDLENBQUE7UUFDcEQsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUV0QixLQUFLLE1BQU0sVUFBVSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMzQyxhQUFhLENBQUMsSUFBSSxDQUFDLHVCQUF1QixVQUFVLGNBQWMsVUFBVSxJQUFJLENBQUMsQ0FBQTtTQUNsRjtRQUVELCtCQUErQjtRQUMvQixRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtLQUMxRTtJQUVELE9BQU8sUUFBUSxDQUFBO0FBQ2pCLENBQUM7QUFwR0QsZ0RBb0dDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLHVCQUF1QixDQUFDLE1BQXVCO0lBQzdELG1HQUFtRztJQUNuRyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBRXpILG9HQUFvRztJQUNwRyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBRTFHLHdEQUF3RDtJQUN4RCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSTtRQUN0QixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQ2hCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZO1lBQy9CLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxLQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJO1FBQzNHLENBQUMsQ0FBQyxJQUFJLENBQUE7SUFFUixzRUFBc0U7SUFDdEUsdUhBQXVIO0lBQ3ZILE9BQU87UUFDTCxZQUFZLEdBQUcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDeEgsU0FBUyxJQUFJLGFBQUosSUFBSSxjQUFKLElBQUksR0FBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ3BFLFdBQVcsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtLQUMvRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNkLENBQUM7QUFyQkQsMERBcUJDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLHNCQUFzQixDQUFDLE1BQWlCO0lBQ3RELE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEVBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsV0FBVyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQTtJQUUxRixJQUFJLGFBQWEsWUFBWSxLQUFLLEVBQUU7UUFDbEMsSUFBQSxlQUFLLEVBQUMsMkNBQTJDLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQzNFO0lBRUQsT0FBTyxtQkFBbUIsTUFBTSxDQUFDLFVBQVUsUUFBUSxhQUFhLGtCQUFrQixDQUFBO0FBQ3BGLENBQUM7QUFSRCx3REFRQyJ9