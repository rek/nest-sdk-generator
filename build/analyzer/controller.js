"use strict";
/**
 * @file Analyzer for the source API's controllers (singles)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeController = void 0;
const path = require("path");
const ts_morph_1 = require("ts-morph");
const logging_1 = require("../logging");
const methods_1 = require("./methods");
/**
 * Convert a string to camel case
 * @param str
 */
function camelcase(str) {
    return str
        .split(/[^a-zA-Z0-9_]/g)
        .map((p, i) => {
        const f = p.substr(0, 1);
        return (i === 0 ? f.toLocaleLowerCase() : f.toLocaleUpperCase()) + p.substr(1);
    })
        .join('');
}
/**
 * Generate a SDK interface for a controller
 * @param project TS-Morph project the controller is contained in
 * @param controllerPath Path to the controller's file
 * @param absoluteSrcPath Absolute path to the source directory
 * @returns The SDK interface of the provided controller
 */
function analyzeController(project, controllerPath, absoluteSrcPath) {
    (0, logging_1.debug)('Analyzing: {yellow}', controllerPath);
    // Prepare the source file to analyze
    const file = project.getSourceFileOrThrow(path.resolve(absoluteSrcPath, controllerPath));
    // Find the controller class declaration
    const classDecl = file.forEachChildAsArray().find((node) => ts_morph_1.Node.isClassDeclaration(node));
    if (!classDecl) {
        (0, logging_1.warn)('No controller found in this file.');
        return null;
    }
    if (!ts_morph_1.Node.isClassDeclaration(classDecl))
        return new Error('Internal error: found class declaration statement which is not an instance of ClassDeclaration');
    const className = classDecl.getName();
    if (className === undefined) {
        return new Error('Internal error: failed to retrieve name of declared class');
    }
    // By default, a controller is registered under its class name
    // This is unless it provides an argument to its @Controller() decorator
    let registrationName = camelcase(className);
    let controllerUriPrefix = null;
    (0, logging_1.debug)('Found class declaration: {yellow}', className);
    // Get the @Controller() decorator
    const decorator = classDecl.getDecorators().find((dec) => dec.getName() === 'Controller');
    if (!decorator) {
        (0, logging_1.warn)('Skipping this controller as it does not have a @Controller() decorator');
        return null;
    }
    // Get the decorator's call expression
    const decCallExpr = decorator.getCallExpression();
    if (!decCallExpr) {
        (0, logging_1.warn)('Skipping this controller as its @Controller() decorator is not called');
        return null;
    }
    // Get the decorator's arguments
    const decExpr = decCallExpr.getArguments();
    if (decExpr.length > 1) {
        (0, logging_1.warn)('Skipping this controller as its @Controller() decorator is called with more than 1 argument');
        return null;
    }
    // Get the first argument, which is expected to be the controller's registration name
    // Example: `@Controller("SuperName")` will register the controller under the name "SuperName"
    if (decExpr[0]) {
        const nameArg = decExpr[0];
        // Variables are not supported
        if (!ts_morph_1.Node.isStringLiteral(nameArg)) {
            (0, logging_1.warn)("Skipping this controller as its @Controller() decorator's argument is not a string literal");
            return null;
        }
        // Update the registration name
        registrationName = camelcase(nameArg.getLiteralText());
        controllerUriPrefix = registrationName;
        (0, logging_1.debug)('Registering controller {yellow} as {yellow} (as specified in @Controller())', className, registrationName);
    }
    else {
        // No argument was provided to the @Controller() decorator, so we stick with the original controller's name
        (0, logging_1.debug)('@Controller() was called without argument, registering controller under name {yellow}', registrationName);
    }
    // Generate a SDK interface for the controller's methods
    const methods = (0, methods_1.analyzeMethods)(classDecl, controllerUriPrefix, controllerPath, absoluteSrcPath);
    if (methods instanceof Error) {
        return methods;
    }
    // Success!
    (0, logging_1.debug)(`└─ Done for controller {yellow}`, controllerPath);
    return {
        path: controllerPath,
        camelClassName: camelcase(className),
        registrationName,
        methods,
    };
}
exports.analyzeController = analyzeController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hbmFseXplci9jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7O0FBRUgsNkJBQTRCO0FBQzVCLHVDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsdUNBQXFEO0FBRXJEOzs7R0FHRztBQUNILFNBQVMsU0FBUyxDQUFDLEdBQVc7SUFDNUIsT0FBTyxHQUFHO1NBQ1AsS0FBSyxDQUFDLGdCQUFnQixDQUFDO1NBQ3ZCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3hCLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2hGLENBQUMsQ0FBQztTQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUNiLENBQUM7QUFnQkQ7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsT0FBZ0IsRUFBRSxjQUFzQixFQUFFLGVBQXVCO0lBQ2pHLElBQUEsZUFBSyxFQUFDLHFCQUFxQixFQUFFLGNBQWMsQ0FBQyxDQUFBO0lBRTVDLHFDQUFxQztJQUNyQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQTtJQUV4Rix3Q0FBd0M7SUFDeEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FB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