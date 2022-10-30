"use strict";
/**
 * @file Analyzer for the source API's controllers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeControllers = void 0;
const os = require("os");
const path = require("path");
const logging_1 = require("../logging");
const utils_1 = require("../utils");
const controller_1 = require("./controller");
const module_1 = require("./module");
function analyzeControllers(controllers, absoluteSrcPath, project) {
    /** Hierarchised SDK informations */
    const collected = new Map();
    /**
     * Modules cache: contains for a given directory the nearest module file's path and name
     * This allows to avoid having to analyze the whole directory structure for each controller
     */
    const modulesCache = new Map();
    /**
     * Path of the declared modules
     * When a module is detected and put in the cache, its name is registered here along with its path
     * This allows to ensure there is no name clash between two different modules
     */
    const declaredModulesPath = new Map();
    (0, logging_1.debug)(`Analyzing {yellow} controllers...`, controllers.length);
    controllers.forEach((relativeControllerPath, i) => {
        const absoluteControllerPath = path.resolve(absoluteSrcPath, relativeControllerPath);
        (0, logging_1.debug)('\n{cyan} {yellow}: {magentaBright} {cyan}\n', '===== Analyzing controller', `${i + 1}/${controllers.length}`, relativeControllerPath, '=====');
        const basePath = path.dirname(absoluteControllerPath);
        let moduleName = modulesCache.get(basePath);
        // Check if the module's name is in cache
        if (!moduleName) {
            // Else, find the nearest module file
            const absoluteModulePath = (0, utils_1.findFileAbove)(/^.*\.module\.ts$/, path.resolve(absoluteSrcPath, basePath));
            if (absoluteModulePath === null) {
                (0, logging_1.panic)('No module file was found for controller at path: {yellow}', absoluteControllerPath);
            }
            const relativeModulePath = path.relative(absoluteSrcPath, absoluteModulePath);
            // Get the module's name
            moduleName = (0, module_1.getModuleName)(project, relativeModulePath, absoluteSrcPath);
            (0, logging_1.debug)('Discovered module: {yellow}', moduleName);
            // Ensure this module is unique
            const cachedModulePath = declaredModulesPath.get(moduleName);
            if (cachedModulePath) {
                (0, logging_1.panic)(`Two modules were declared with the same name {yellow}:\n` + `- One in {yellow}\n` + `- One in {yellow}`, moduleName, cachedModulePath, relativeModulePath);
            }
            modulesCache.set(basePath, moduleName);
        }
        if (moduleName in {}) {
            (0, logging_1.panic)(`Detected module whose name {yellow} collides with a JavaScript's native object property`, moduleName);
        }
        let moduleSdkInfos = collected.get(moduleName);
        if (!moduleSdkInfos) {
            moduleSdkInfos = new Map();
            collected.set(moduleName, moduleSdkInfos);
        }
        if (i === 0) {
            if (process.platform === 'linux' && os.release().toLocaleLowerCase().includes('microsoft') && absoluteSrcPath.startsWith('/mnt/')) {
                (0, logging_1.warn)("NOTE: On WSL, the first type analysis on a project located in Windows's filesystem may take a long time to complete.");
                (0, logging_1.warn)('Please consider moving your project to WSL, or running this tool directly from Windows');
            }
        }
        const metadata = (0, controller_1.analyzeController)(project, relativeControllerPath, absoluteSrcPath);
        if (metadata instanceof Error) {
            throw new Error((0, logging_1.format)('Failed to analyze controller at path {magenta}:\n{}', relativeControllerPath, metadata.message));
        }
        if (metadata) {
            if (metadata.registrationName in {}) {
                (0, logging_1.panic)(`Detected controller whose registration name {yellow} collides with a JavaScript's native object property`, metadata.registrationName);
            }
            moduleSdkInfos.set(metadata.camelClassName, metadata);
        }
    });
    return collected;
}
exports.analyzeControllers = analyzeControllers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYW5hbHl6ZXIvY29udHJvbGxlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOzs7QUFFSCx5QkFBd0I7QUFDeEIsNkJBQTRCO0FBRTVCLHdDQUF1RDtBQUN2RCxvQ0FBd0M7QUFDeEMsNkNBQStEO0FBQy9ELHFDQUF3QztBQUl4QyxTQUFnQixrQkFBa0IsQ0FBQyxXQUFxQixFQUFFLGVBQXVCLEVBQUUsT0FBZ0I7SUFDakcsb0NBQW9DO0lBQ3BDLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxFQUFzQyxDQUFBO0lBRS9EOzs7T0FHRztJQUNILE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFBO0lBRTlDOzs7O09BSUc7SUFDSCxNQUFNLG1CQUFtQixHQUFHLElBQUksR0FBRyxFQUFrQixDQUFBO0lBRXJELElBQUEsZUFBSyxFQUFDLG1DQUFtQyxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUU5RCxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDaEQsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFBO1FBRXBGLElBQUEsZUFBSyxFQUNILDZDQUE2QyxFQUM3Qyw0QkFBNEIsRUFDNUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFDaEMsc0JBQXNCLEVBQ3RCLE9BQU8sQ0FDUixDQUFBO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1FBRXJELElBQUksVUFBVSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFM0MseUNBQXlDO1FBQ3pDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFD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