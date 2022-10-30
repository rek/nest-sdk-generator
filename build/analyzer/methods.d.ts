/**
 * @file Analyzer for the source API's methods
 */
import { ClassDeclaration } from 'ts-morph';
import { SdkMethodParams } from './params';
import { Route } from './route';
import { ResolvedTypeDeps } from './typedeps';
/**
 * SDK interface for a single controller's method
 */
export interface SdkMethod {
    /** Method's name */
    readonly name: string;
    /** Method's HTTP method (e.g. GET / POST) */
    readonly httpMethod: SdkHttpMethod;
    /** Method's return type with resolved dependencies */
    readonly returnType: ResolvedTypeDeps;
    /** Method's parsed route */
    readonly route: Route;
    /** Method's URI path */
    readonly uriPath: string;
    /** Method's parameters */
    readonly params: SdkMethodParams;
}
/**
 * HTTP method of a controller's method
 */
export declare enum SdkHttpMethod {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Patch = "PATCH",
    Delete = "DELETE"
}
/**
 * Generate a SDK interface for a controller
 * @param controllerClass The class declaration of the controller
 * @param controllerUriPrefix Optional URI prefix for this controller (e.g. `@Controller("registrationName")`)
 * @param filePath Path to the controller's file
 * @param absoluteSrcPath Absolute path to the source directory
 */
export declare function analyzeMethods(controllerClass: ClassDeclaration, controllerUriPrefix: string | null, filePath: string, absoluteSrcPath: string): SdkMethod[] | Error;
