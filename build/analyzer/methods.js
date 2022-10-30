"use strict";
/**
 * @file Analyzer for the source API's methods
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMethods = exports.SdkHttpMethod = void 0;
const chalk_1 = require("chalk");
const ts_morph_1 = require("ts-morph");
const logging_1 = require("../logging");
const params_1 = require("./params");
const route_1 = require("./route");
const typedeps_1 = require("./typedeps");
/**
 * HTTP method of a controller's method
 */
var SdkHttpMethod;
(function (SdkHttpMethod) {
    SdkHttpMethod["Get"] = "GET";
    SdkHttpMethod["Post"] = "POST";
    SdkHttpMethod["Put"] = "PUT";
    SdkHttpMethod["Patch"] = "PATCH";
    SdkHttpMethod["Delete"] = "DELETE";
})(SdkHttpMethod = exports.SdkHttpMethod || (exports.SdkHttpMethod = {}));
/**
 * Generate a SDK interface for a controller
 * @param controllerClass The class declaration of the controller
 * @param controllerUriPrefix Optional URI prefix for this controller (e.g. `@Controller("registrationName")`)
 * @param filePath Path to the controller's file
 * @param absoluteSrcPath Absolute path to the source directory
 */
function analyzeMethods(controllerClass, controllerUriPrefix, filePath, absoluteSrcPath) {
    // Output variable
    const collected = new Array();
    // Get the list of all methods
    const methods = controllerClass.forEachChildAsArray().filter((node) => node instanceof ts_morph_1.MethodDeclaration);
    for (const method of methods) {
        const methodName = method.getName();
        (0, logging_1.debug)('├─ Found method: {yellow}', methodName);
        // Get the HTTP decorator(s) of the method
        const decorators = method.getDecorators().filter((dec) => Object.keys(SdkHttpMethod).includes(dec.getName()));
        // We expect to have exactly one HTTP decorator
        if (decorators.length > 1) {
            // If there is more than one decorator, that's invalid, so we can't analyze the method
            return new Error((0, logging_1.format)('├─── Detected multiple HTTP decorators on method: {yellow}' + decorators.map((dec) => dec.getName()).join(',')));
        }
        else if (decorators.length === 0) {
            // If there isn't any HTTP decorator, this is simply not a method available from the outside and so we won't generate an interface for it
            (0, logging_1.debug)('├─── Skipping this method as it does not have an HTTP decorator');
            continue;
        }
        // Get the HTTP decorator
        const dec = decorators[0];
        // We need to put a '@ts-ignore' here because TypeScript doesn't like indexing an enumeration with a string key, although this works fine
        // @ts-ignore
        const httpMethod = SdkHttpMethod[dec.getName()];
        (0, logging_1.debug)('├─── Detected HTTP method: {magentaBright}', httpMethod.toLocaleUpperCase());
        // Get the arguments provided to the HTTP decorator (we expect one, the URI path)
        const decArgs = dec.getArguments();
        // The method's URI path
        let uriPath;
        // We expect the decorator to have exactly one argument
        if (decArgs.length > 1) {
            // If we have more than one argument, that's invalid (or at least not supported here), so we can't analyze the method
            return new Error(`Multiple (${decArgs.length}) arguments were provided to the HTTP decorator`);
        }
        else if (decArgs.length === 0) {
            // If there is no argument, we take the method's name as the URI path
            (0, logging_1.debug)('├─── No argument found for decorator, using base URI path.');
            uriPath = '';
        }
        else {
            // If we have exactly one argument, hurray! That's our URI path.
            const uriNameDec = decArgs[0];
            // Variables are not supported
            if (!ts_morph_1.Node.isStringLiteral(uriNameDec)) {
                return new Error((0, logging_1.format)('├─── The argument provided to the HTTP decorator is not a string literal:\n>> {cyan}', uriNameDec.getText()));
            }
            // Update the method's URI path
            uriPath = uriNameDec.getLiteralText();
            (0, logging_1.debug)('├─── Detected argument in HTTP decorator, mapping this method to custom URI name');
        }
        (0, logging_1.debug)('├─── Detected URI name: {yellow}', uriPath);
        // Analyze the method's URI
        const route = (0, route_1.analyzeUri)(controllerUriPrefix ? (uriPath ? `/${controllerUriPrefix}/${uriPath}` : `/` + controllerUriPrefix) : uriPath);
        if (route instanceof Error) {
            return new Error('├─── Detected unsupported URI format:\n' +
                route.message
                    .split('\n')
                    .map((line) => '├───── ' + line)
                    .join('\n'));
        }
        (0, logging_1.debug)('├─── Parsed URI name to route: {yellow}', (0, route_1.debugUri)(route, chalk_1.blue));
        // Analyze the method's arguments
        (0, logging_1.debug)('├─── Analyzing arguments...');
        const params = (0, params_1.analyzeParams)(httpMethod, route, method.getParameters(), filePath, absoluteSrcPath);
        if (params instanceof Error)
            return params;
        // Get the method's return type
        (0, logging_1.debug)('├─── Resolving return type...');
        const returnType = (0, typedeps_1.resolveTypeDependencies)(method.getReturnType(), filePath, absoluteSrcPath);
        (0, logging_1.debug)('├─── Detected return type: {cyan}', returnType.resolvedType);
        // Success!
        collected.push({
            name: methodName,
            httpMethod,
            returnType,
            route,
            uriPath,
            params,
        });
    }
    return collected;
}
exports.analyzeMethods = analyzeMethods;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0aG9kcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hbmFseXplci9tZXRob2RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7O0FBRUgsaUNBQTRCO0FBQzVCLHVDQUFvRTtBQUNwRSx3Q0FBMEM7QUFDMUMscUNBQXlEO0FBQ3pELG1DQUFxRDtBQUNyRCx5Q0FBc0U7QUF5QnRFOztHQUVHO0FBQ0gsSUFBWSxhQU1YO0FBTkQsV0FBWSxhQUFhO0lBQ3ZCLDRCQUFXLENBQUE7SUFDWCw4QkFBYSxDQUFBO0lBQ2IsNEJBQVcsQ0FBQTtJQUNYLGdDQUFlLENBQUE7SUFDZixrQ0FBaUIsQ0FBQTtBQUNuQixDQUFDLEVBTlcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFNeEI7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixjQUFjLENBQzVCLGVBQWlDLEVBQ2pDLG1CQUFrQyxFQUNsQyxRQUFnQixFQUNoQixlQUF1QjtJQUV2QixrQkFBa0I7SUFDbEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxLQUFLLEVBQWEsQ0FBQTtJQUV4Qyw4QkFBOEI7SUFDOUIsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLG1CQUFtQixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLFlBQVksNEJBQWlCLENBQXdCLENBQUE7SUFFaEksS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDNUIsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBRW5DLElBQUEsZUFBSyxFQUFDLDJCQUEyQixFQUFFLFVBQVUsQ0FBQyxDQUFBO1FBRTlDLDBDQUEwQztRQUMxQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBRTdHLCtDQUErQztRQUMvQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLHNGQUFzRjtZQUN0RixPQUFPLElBQUksS0FBSyxDQUNkLElBQUEsZ0JBQU0sRUFBQyw0REFBNEQsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FDeEgsQ0FBQTtTQUNGO2FBQU0sSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNsQyx5SUFBeUk7WUFDekksSUFBQSxlQUFLLEVBQUMsaUVBQWlFLENBQUMsQ0FBQTtZQUN4RSxTQUFRO1NBQ1Q7UUFFRCx5QkFBeUI7UUFDekIsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRXpCLHlJQUF5STtRQUN6SSxhQUFhO1FBQ2IsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBRS9DLElBQUEsZUFBSyxFQUFDLDRDQUE0QyxFQUFFLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUE7UUFFbkYsaUZBQWlGO1FBQ2pGLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUVsQyx3QkFBd0I7UUFDeEIsSUFBSSxPQUFlLENBQUE7UUFFbkIsdURBQXVEO1FBQ3ZELElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdEIscUhBQXFIO1lBQ3JILE9BQU8sSUFBSSxLQUFLLENBQUMsYUFBYSxPQUFPLENBQUMsTUFBTSxpREFBaUQsQ0FBQyxDQUFBO1NBQy9GO2FBQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMvQixxRUFBcUU7WUFDckUsSUFBQSxlQUFLLEVBQUMsNERBQTRELENBQUMsQ0FBQTtZQUNuRSxPQUFPLEdBQUcsRUFBRSxDQUFBO1NBQ2I7YUFBTTtZQUNMLGdFQUFnRTtZQUNoRSxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFN0IsOEJBQThCO1lBQzlCLElBQUksQ0FBQyxlQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUNyQyxPQUFPLElBQUksS0FBSyxDQUNkLElBQUEsZ0JBQU0sRUFBQyxzRkFBc0YsRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FDckgsQ0FBQTthQUNGO1lBRUQsK0JBQStCO1lBQy9CLE9BQU8sR0FBRyxVQUFVLENBQUMsY0FBYyxFQUFFLENBQUE7WUFFckMsSUFBQSxlQUFLLEVBQUMsa0ZBQWtGLENBQUMsQ0FBQTtTQUMxRjtRQUVELElBQUEsZUFBSyxFQUFDLGtDQUFrQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBRWxELDJCQUEyQjtRQUMzQixNQUFNLEtBQUssR0FBRyxJQUFBLGtCQUFVLEVBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLG1CQUFtQixJQUFJLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFdEksSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO1lBQzFCLE9BQU8sSUFBSSxLQUFLLENBQ2QseUNBQXlDO2dCQUN2QyxLQUFLLENBQUMsT0FBTztxQkFDVixLQUFLLENBQUMsSUFBSSxDQUFDO3FCQUNYLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztxQkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUNoQixDQUFBO1NBQ0Y7UUFFRCxJQUFBLGVBQUssRUFBQyx5Q0FBeUMsRUFBRSxJQUFBLGdCQUFRLEVBQUMsS0FBSyxFQUFFLFlBQUksQ0FBQyxDQUFDLENBQUE7UUFFdkUsaUNBQWlDO1FBQ2pDLElBQUEsZUFBSyxFQUFDLDZCQUE2QixDQUFDLENBQUE7UUFDcEMsTUFBTSxNQUFNLEdBQUcsSUFBQSxzQkFBYSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQTtRQUVsRyxJQUFJLE1BQU0sWUFBWSxLQUFLO1lBQUUsT0FBTyxNQUFNLENBQUE7UUFFMUMsK0JBQStCO1FBQy9CLElBQUEsZUFBSyxFQUFDLCtCQUErQixDQUFDLENBQUE7UUFDdEMsTUFBTSxVQUFVLEdBQUcsSUFBQSxrQ0FBdUIsRUFBQyxNQUFNLENBQUMsYUFBYSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFBO1FBRTdGLElBQUEsZUFBSyxFQUFDLG1DQUFtQyxFQUFFLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUVuRSxXQUFXO1FBQ1gsU0FBUyxDQUFDLElBQUksQ0FBQztZQUNiLElBQUksRUFBRSxVQUFVO1lBQ2hCLFVBQVU7WUFDVixVQUFVO1lBQ1YsS0FBSztZQUNMLE9BQU87WUFDUCxNQUFNO1NBQ1AsQ0FBQyxDQUFBO0tBQ0g7SUFFRCxPQUFPLFNBQVMsQ0FBQTtBQUNsQixDQUFDO0FBakhELHdDQWlIQyJ9