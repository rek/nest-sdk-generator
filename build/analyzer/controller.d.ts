/**
 * @file Analyzer for the source API's controllers (singles)
 */
import { Project } from 'ts-morph';
import { SdkMethod } from './methods';
/**
 * SDK interface of a controller
 */
export interface SdkController {
    /** Original controller file's path */
    readonly path: string;
    /** Name of the controller's class, camel cased */
    readonly camelClassName: string;
    /** Name the controller is registered under */
    readonly registrationName: string;
    /** Controller's methods */
    readonly methods: SdkMethod[];
}
/**
 * Generate a SDK interface for a controller
 * @param project TS-Morph project the controller is contained in
 * @param controllerPath Path to the controller's file
 * @param absoluteSrcPath Absolute path to the source directory
 * @returns The SDK interface of the provided controller
 */
export declare function analyzeController(project: Project, controllerPath: string, absoluteSrcPath: string): SdkController | null | Error;
