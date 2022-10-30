"use strict";
/**
 * @file Analyzer for the source API's routes in controller methods
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRouteWith = exports.resolveRoute = exports.debugUri = exports.unparseRoute = exports.paramsOfRoute = exports.analyzeUri = void 0;
/**
 * Analyze an URI path
 * @param uriPath The URI path to analyze
 */
function analyzeUri(uriPath) {
    // Split the URI path into "parts"
    const rawParts = uriPath.split('/');
    // The parsed parts we'll return
    const parts = [];
    // The current string offset in the URI path
    // This variable is used for error display
    let offset = 0;
    /**
     * Find if a specific part of the URI path contains an invalid character
     * @param part The part to check
     * @param pattern The invalid characters to look for, as a regular expression
     * @returns An error message if an invalid character is found, nothing else
     */
    function _findInvalid(part, pattern) {
        return part.match(pattern) ? uriPath + '\n' + ' '.repeat(offset) + '^' : null;
    }
    // Treat all parts of the URI path
    for (let i = 0; i < rawParts.length; i++) {
        const part = rawParts[i];
        // Ignore empty parts (e.g. "/a///b" will be treated as "/a/b")
        if (part === '')
            continue;
        // Ensure there is no generic character in the path as we don't support them
        const genericErr = _findInvalid(part, /[\*\+\?]/);
        if (genericErr) {
            return new Error('Generic symbols (* + ?) are not supported as they prevent from determining the right route to use. Found in URI:\n' + genericErr);
        }
        // Check if this part is an URI parameter
        if (part.startsWith(':')) {
            // URI parameters must follow a strict naming
            const paramErr = _findInvalid(part, /[^a-zA-Z0-9_:]/);
            if (paramErr) {
                return new Error('Invalid character detected in named parameter in URI:\n' + paramErr);
            }
            // We got a parameter
            parts.push({ param: part.substr(1) });
        }
        else {
            // We got a literal part
            parts.push({ segment: part });
        }
        // Update the offset for error display
        offset += part.length + 1;
    }
    // Success!
    return {
        isRoot: uriPath.startsWith('/'),
        parts,
    };
}
exports.analyzeUri = analyzeUri;
/**
 * Get the named parameters of a parsed route
 * @param route
 */
function paramsOfRoute(route) {
    return route.parts.map((part) => ('param' in part ? part.param : null)).filter((e) => e !== null);
}
exports.paramsOfRoute = paramsOfRoute;
/**
 * Convert a route back to its original string
 * @param route
 */
function unparseRoute(route) {
    return (route.isRoot ? '/' : '') + route.parts.map((part) => ('segment' in part ? part.segment : ':' + part.param)).join('/');
}
exports.unparseRoute = unparseRoute;
/**
 * Pretty-print a route
 */
function debugUri(route, color) {
    return (route.isRoot ? '/' : '') + route.parts.map((part) => ('segment' in part ? part.segment : color(':' + part.param))).join('/');
}
exports.debugUri = debugUri;
/**
 * Resolve a route by providing its required parameters
 * @param route
 * @param params
 */
function resolveRoute(route, params) {
    let uri = [];
    for (const part of route.parts) {
        if ('segment' in part) {
            uri.push(part.segment);
        }
        else if (!params.hasOwnProperty(part.param)) {
            return new Error('Missing route parameter ' + part.param);
        }
        else {
            uri.push(params[part.param]);
        }
    }
    return (route.isRoot ? '/' : '') + uri.join('/');
}
exports.resolveRoute = resolveRoute;
/**
 * Resolve a route by providing its required parameters through a callback
 * @param route
 * @param paramsProvider
 */
function resolveRouteWith(route, paramsProvider) {
    let uri = [];
    for (const part of route.parts) {
        if ('segment' in part) {
            uri.push(part.segment);
        }
        else {
            const param = paramsProvider(part.param);
            if (param === null) {
                return new Error('Missing route parameter ' + part.param);
            }
            else {
                uri.push(param);
            }
        }
    }
    return (route.isRoot ? '/' : '') + uri.join('/');
}
exports.resolveRouteWith = resolveRouteWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYW5hbHl6ZXIvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOzs7QUFrQkg7OztHQUdHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFDLE9BQWU7SUFDeEMsa0NBQWtDO0lBQ2xDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFFbkMsZ0NBQWdDO0lBQ2hDLE1BQU0sS0FBSyxHQUFnQixFQUFFLENBQUE7SUFFN0IsNENBQTRDO0lBQzVDLDBDQUEwQztJQUMxQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUE7SUFFZDs7Ozs7T0FLRztJQUNILFNBQVMsWUFBWSxDQUFDLElBQVksRUFBRSxPQUFlO1FBQ2pELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO0lBQy9FLENBQUM7SUFFRCxrQ0FBa0M7SUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDeEMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRXhCLCtEQUErRDtRQUMvRCxJQUFJLElBQUksS0FBSyxFQUFFO1lBQUUsU0FBUTtRQUV6Qiw0RUFBNEU7UUFDNUUsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQTtRQUVqRCxJQUFJLFVBQVUsRUFBRTtZQUNkLE9BQU8sSUFBSSxLQUFLLENBQ2Qsb0hBQW9ILEdBQUcsVUFBVSxDQUNsSSxDQUFBO1NBQ0Y7UUFFRCx5Q0FBeUM7UUFDekMsSUFBSSxJQUFJ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