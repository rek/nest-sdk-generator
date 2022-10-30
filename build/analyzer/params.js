"use strict";
/**
 * @file Analyzer for the source API's controllers' methods' parameters
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeParams = void 0;
const logging_1 = require("../logging");
const decorator_1 = require("./decorator");
const methods_1 = require("./methods");
const route_1 = require("./route");
const typedeps_1 = require("./typedeps");
/**
 * Generate a SDK interface for a controller's method's parameters
 * @param httpMethod The method's HTTP method
 * @param route The method's route
 * @param args The method's arguments
 * @param filePath Path to the controller's file
 * @param absoluteSrcPath Absolute path to the source directory
 * @returns A SDK interface for the method's parameters
 */
function analyzeParams(httpMethod, route, args, filePath, absoluteSrcPath) {
    var _a, _b, _c, _d;
    // The collected informations we will return
    const collected = {
        parameters: null,
        query: null,
        body: null,
    };
    // Get the named parameters of the route
    const routeParams = (0, route_1.paramsOfRoute)(route);
    // Treat all arguments (to not confuse with the route's parameters)
    for (const arg of args) {
        const name = arg.getName();
        (0, logging_1.debug)('├───── Detected argument: {yellow}', name);
        // Arguments are collected as soon as they have a decorator like @Query() or @Body()
        const decs = arg.getDecorators();
        if (decs.length === 0) {
            // If we have no argument, this is not an argument we are interested in, so we just skip it
            (0, logging_1.debug)('├───── Skipping this argument as it does not have a decorator');
            continue;
        }
        else if (decs.length > 1) {
            // If we have more than one decorator, this could mean we have for instance an @NotEmpty() @Query() or something like this,
            //  which is currently not supported.
            return new Error('Skipping this argument as it has multiple decorators, which is currently not supported');
        }
        // Get the only decrator
        const dec = decs[0];
        const decName = dec.getName();
        // Treat the @Param() decorator
        if (decName === 'Param') {
            (0, logging_1.debug)('├───── Detected decorator {blue}', '@Param');
            // We expect a single string argument for this decorator,
            // which is the route parameter's name
            const paramName = (0, decorator_1.expectSingleStrLitDecorator)(dec);
            if (paramName instanceof Error)
                return paramName;
            // If there is no argument, this argument is a global receiver which maps the full set of parameters
            // We theorically *could* extract the type informations from this object type, but this would be insanely complex
            // So, we just skip it as it's a lot more simple, and is not commonly used anyway as it has a set of downsides
            if (paramName === null) {
                (0, logging_1.warn)('├───── Skipping this argument as it is a generic parameters receiver, which is currently not supported');
                continue;
            }
            // Ensure the specified parameter appears in the method's route
            if (!routeParams.includes(paramName))
                return new Error((0, logging_1.format)('├───── Cannot map unknown parameter {yellow}', paramName));
            (0, logging_1.debug)('├───── Mapping argument to parameter: {yellow}', paramName);
            // Get the route parameter's type
            const typ = (0, typedeps_1.resolveTypeDependencies)(arg.getType(), filePath, absoluteSrcPath);
            (0, logging_1.debug)('├───── Detected parameter type: {yellow} ({magentaBright} dependencies)', typ.resolvedType, typ.dependencies.size);
            // Update the method's route parameters
            if (paramName in {}) {
                return new Error((0, logging_1.format)(`Detected @Param() field whose name {yellow} collides with a JavaScript's native object property`, paramName));
            }
            (_a = collected.parameters) !== null && _a !== void 0 ? _a : (collected.parameters = new Map());
            collected.parameters.set(paramName, typ);
        }
        // Treat the @Query() decorator
        else if (decName === 'Query') {
            (0, logging_1.debug)('├───── Detected decorator {blue}', '@Query');
            // We expect a single string argument for this decorator,
            // which is the query parameter's name
            const queryName = (0, decorator_1.expectSingleStrLitDecorator)(dec);
            if (queryName instanceof Error)
                return queryName;
            // If there is no argument, this argument is a global receiver which maps the full set of parameters
            // We theorically *could* extract the type informations from this object type, but this would be insanely complex
            // So, we just skip it as it's a lot more simple, and is not commonly used anyway as it has a set of downsides
            if (queryName === null) {
                (0, logging_1.warn)('├───── Skipping this argument as it is a generic query receiver');
                continue;
            }
            (0, logging_1.debug)('├───── Mapping argument to query: {yellow}', queryName);
            // Get the parameter's type
            const typ = (0, typedeps_1.resolveTypeDependencies)(arg.getType(), filePath, absoluteSrcPath);
            (0, logging_1.debug)(`├───── Detected query type: {yellow} ({magentaBright} dependencies)`, typ.resolvedType, typ.dependencies.size);
            // Update the method's query parameter
            if (queryName in {}) {
                return new Error((0, logging_1.format)(`Detected @Query() field whose name {yellow} collides with a JavaScript's native object property`, queryName));
            }
            (_b = collected.query) !== null && _b !== void 0 ? _b : (collected.query = new Map());
            collected.query.set(queryName, typ);
        }
        // Treat the @Body() decorator
        else if (decName === 'Body') {
            (0, logging_1.debug)('├───── Detected decorator {blue}', '@Body');
            // GET requests cannot have a BODY
            if (httpMethod === methods_1.SdkHttpMethod.Get) {
                return new Error('GET requests cannot have a BODY!');
            }
            // We expect a single string argument for this decorator,
            // which is the body field's name
            const fieldName = (0, decorator_1.expectSingleStrLitDecorator)(dec);
            if (fieldName instanceof Error)
                return fieldName;
            // Get the field's type
            const typ = (0, typedeps_1.resolveTypeDependencies)(arg.getType(), filePath, absoluteSrcPath);
            const depsCount = typ.dependencies.size;
            (0, logging_1.debug)(`├───── Detected BODY type: {cyan} ({magentaBright} ${depsCount === 0 ? 'no dependency' : depsCount > 1 ? 'dependencies' : 'dependency'})`, typ.resolvedType, depsCount);
            // If there no name was provided to the decorator, then the decorator is a generic receiver which means it maps to the full body type
            // This also means we can map the BODY type to this argument's type
            if (fieldName === null) {
                const body = collected.body;
                // If we previously had an @Body(<name>) decorator on another argument, we have an important risk of mistyping
                // => e.g. `@Body("a") a: string, @Body() body: { a: number }` is invalid as the type for the `a` field mismatches
                // => It's easy to make an error as the @Body() type is often hidden behind a DTO
                // But that's extremely complex to check automatically, so we just display a warning instead
                // Also, that's not the kind of thing we make on purpose very often, so it's more likely it's an error, which makes it even more important
                //  to display a warning here.
                if ((body === null || body === void 0 ? void 0 : body.full) === false)
                    (0, logging_1.warn)('├───── Detected full @Body() decorator after a single parameter. This is considered a bad practice, avoid it if you can!');
                // Having two generic @Body() decorators is meaningless and will likey lead to errors, so we return a precise error here
                else if (body === null || body === void 0 ? void 0 : body.full) {
                    return new Error((0, logging_1.format)(`Detected two @Body() decorators: found {yellow} previously, while method argument {yellow} indicates type {yellow}`, body.type.resolvedType, name, typ.resolvedType));
                }
                (0, logging_1.debug)("├───── Mapping argument to full request's body");
                // Update the whole BODY type
                collected.body = { full: true, type: typ };
            }
            else {
                // Here we have an @Body(<string>) decorator
                // If we previously had an @Body() decorator, this can lead to several types of errors (see the big comment above for more informations)
                if ((_c = collected.body) === null || _c === void 0 ? void 0 : _c.full) {
                    (0, logging_1.warn)('├───── Detected single @Body() decorator after a full parameter. This is considered a bad practice, avoid it if you can!');
                }
                else {
                    (0, logging_1.debug)('├───── Mapping argument to BODY field: {yellow}', fieldName);
                    // Update the BODY type by adding the current field to it
                    if (fieldName in {}) {
                        return new Error((0, logging_1.format)(`Detected @Body() field whose name {yellow} collides with a JavaScript's native object property`, fieldName));
                    }
                    (_d = collected.body) !== null && _d !== void 0 ? _d : (collected.body = { full: false, fields: new Map() });
                    collected.body.fields.set(fieldName, typ);
                }
            }
        }
    }
    // Success!
    return collected;
}
exports.analyzeParams = analyzeParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FuYWx5emVyL3BhcmFtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUdILHdDQUFnRDtBQUNoRCwyQ0FBeUQ7QUFDekQsdUNBQXlDO0FBQ3pDLG1DQUE4QztBQUM5Qyx5Q0FBc0U7QUFxQnRFOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IsYUFBYSxDQUMzQixVQUF5QixFQUN6QixLQUFZLEVBQ1osSUFBNEIsRUFDNUIsUUFBZ0IsRUFDaEIsZUFBdUI7O0lBRXZCLDRDQUE0QztJQUM1QyxNQUFNLFNBQVMsR0FBb0I7UUFDakMsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxFQUFFLElBQUk7UUFDWCxJQUFJLEVBQUUsSUFBSTtLQUNYLENBQUE7SUFFRCx3Q0FBd0M7SUFDeEMsTUFBTSxXQUFXLEdBQUcsSUFBQSxxQkFBYSxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBRXhDLG1FQUFtRTtJQUNuRSxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtRQUN0QixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUE7UUFFMUIsSUFBQSxlQUFLLEVBQUMsb0NBQW9DLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFFakQsb0ZBQW9GO1FBQ3BGLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUVoQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLDJGQUEyRjtZQUMzRixJQUFBLGVBQUssRUFBQywrREFBK0QsQ0FBQyxDQUFBO1lBQ3RFLFNBQVE7U0FDVDthQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDMUIsMkhBQTJIO1lBQzNILHFDQUFxQztZQUNyQyxPQUFPLElBQUksS0FBSyxDQUFDLHdGQUF3RixDQUFDLENBQUE7U0FDM0c7UUFFRCx3QkFBd0I7UUFDeEIs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