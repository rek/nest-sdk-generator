"use strict";
/**
 * @file Analyzer for the source API's modules
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleName = void 0;
const path = require("path");
const ts_morph_1 = require("ts-morph");
const logging_1 = require("../logging");
/**
 * Get the name of a module
 * @param project TS-Morph project the module is contained in
 * @param modulePath Path to the module's file
 * @param sourcePath Path to the TypeScript root directory
 */
function getModuleName(project, modulePath, sourcePath) {
    // Prepare the source file to analyze
    const file = project.getSourceFileOrThrow(path.resolve(sourcePath, modulePath));
    // Find the module class declaration
    const classDecl = file.forEachChildAsArray().find((node) => ts_morph_1.Node.isClassDeclaration(node) && node.getDecorators().length > 0);
    if (!classDecl) {
        (0, logging_1.panic)('No class declaration found in module at {yellow}', modulePath);
    }
    if (!ts_morph_1.Node.isClassDeclaration(classDecl))
        (0, logging_1.panic)('Internal error: found class declaration statement which is not an instance of ClassDeclaration');
    const moduleName = classDecl.getName();
    if (moduleName === undefined) {
        (0, logging_1.panic)('Internal error: failed to retrieve name of declared class');
    }
    const decorators = classDecl.getDecorators();
    if (decorators.length > 1) {
        (0, logging_1.panic)(`Found multiple decorators on module class {yellow} declared at {yellow}`, moduleName, modulePath);
    }
    const decName = decorators[0].getName();
    if (decName !== 'Module') {
        (0, logging_1.panic)((0, logging_1.format)(`The decorator on module class {yellow} was expected to be a {yellow}, found an {yellow} instead\nModule path is: {yellow}`, moduleName, '@Module', '@' + decName, modulePath));
    }
    return moduleName.substr(0, 1).toLocaleLowerCase() + moduleName.substr(1);
}
exports.getModuleName = getModuleName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FuYWx5emVyL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILDZCQUE0QjtBQUM1Qix1Q0FBd0M7QUFDeEMsd0NBQTBDO0FBRTFDOzs7OztHQUtHO0FBQ0gsU0FBZ0IsYUFBYSxDQUFDLE9BQWdCLEVBQUUsVUFBa0IsRUFBRSxVQUFrQjtJQUNwRixxQ0FBcUM7SUFDckMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUE7SUFFL0Usb0NBQW9DO0lBQ3BDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsZUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFFN0gsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNkLElBQUEsZUFBSyxFQUFDLGtEQUFrRCxFQUFFLFVBQVUsQ0FBQyxDQUFBO0tBQ3RFO0lBRUQsSUFBSSxDQUFDLGVBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7UUFDckMsSUFBQSxlQUFLLEVBQUMsZ0dBQWdHLENBQUMsQ0FBQTtJQUV6RyxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUE7SUFFdEMsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO1FBQzVCLElBQUEsZUFBSyxFQUFDLDJEQUEyRCxDQUFDLENBQUE7S0FDbkU7SUFFRCxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUE7SUFFNUMsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN6QixJQUFBLGVBQUssRUFBQyx5RUFBeUUsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUE7S0FDekc7SUFFRCxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7SUFFdkMsSUFBSSxPQUFPLEtBQUssUUFBUSxFQUFFO1FBQ3hCLElBQUEsZUFBSyxFQUNILElBQUEsZ0JBQU0sRUFDSiwySEFBMkgsRUFDM0gsVUFBVSxFQUNWLFNBQVMsRUFDVCxHQUFHLEdBQUcsT0FBTyxFQUNiLFVBQVUsQ0FDWCxDQUNGLENBQUE7S0FDRjtJQUVELE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzNFLENBQUM7QUF6Q0Qsc0NBeUNDIn0=