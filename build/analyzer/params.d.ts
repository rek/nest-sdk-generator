/**
 * @file Analyzer for the source API's controllers' methods' parameters
 */
import { ParameterDeclaration } from 'ts-morph';
import { SdkHttpMethod } from './methods';
import { Route } from './route';
import { ResolvedTypeDeps } from './typedeps';
/**
 * SDK interface for a controller's method's parameters
 */
export interface SdkMethodParams {
    /** Route parameters */
    parameters: Map<string, ResolvedTypeDeps> | null;
    /** Query parameters */
    query: Map<string, ResolvedTypeDeps> | null;
    /** Body parameters */
    body: SdkMethodBodyParam | null;
}
/**
 * Single body parameter in a SDK's method
 */
export declare type SdkMethodBodyParam = {
    full: true;
    type: ResolvedTypeDeps;
} | {
    full: false;
    fields: Map<string, ResolvedTypeDeps>;
};
/**
 * Generate a SDK interface for a controller's method's parameters
 * @param httpMethod The method's HTTP method
 * @param route The method's route
 * @param args The method's arguments
 * @param filePath Path to the controller's file
 * @param absoluteSrcPath Absolute path to the source directory
 * @returns A SDK interface for the method's parameters
 */
export declare function analyzeParams(httpMethod: SdkHttpMethod, route: Route, args: ParameterDeclaration[], filePath: string, absoluteSrcPath: string): SdkMethodParams | Error;
