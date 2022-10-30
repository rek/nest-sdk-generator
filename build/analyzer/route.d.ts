/**
 * @file Analyzer for the source API's routes in controller methods
 */
/**
 * A single URI part
 */
export declare type RoutePart = {
    readonly segment: string;
} | {
    readonly param: string;
};
/**
 * A parsed URI path
 */
export interface Route {
    /** Is this an absolute route? (routes starting with a '/') */
    readonly isRoot: boolean;
    /** The route's parts */
    readonly parts: RoutePart[];
}
/**
 * Analyze an URI path
 * @param uriPath The URI path to analyze
 */
export declare function analyzeUri(uriPath: string): Route | Error;
/**
 * Get the named parameters of a parsed route
 * @param route
 */
export declare function paramsOfRoute(route: Route): string[];
/**
 * Convert a route back to its original string
 * @param route
 */
export declare function unparseRoute(route: Route): string;
/**
 * Pretty-print a route
 */
export declare function debugUri(route: Route, color: (str: string) => string): string;
/**
 * Resolve a route by providing its required parameters
 * @param route
 * @param params
 */
export declare function resolveRoute(route: Route, params: {
    [name: string]: string;
}): string | Error;
/**
 * Resolve a route by providing its required parameters through a callback
 * @param route
 * @param paramsProvider
 */
export declare function resolveRouteWith(route: Route, paramsProvider: (param: string) => string | null): string | Error;
