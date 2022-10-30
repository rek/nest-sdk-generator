/**
 * @file Generate SDK modules
 */
import { SdkModules } from '../analyzer/controllers';
import { SdkMethod } from '../analyzer/methods';
import { SdkMethodParams } from '../analyzer/params';
/**
 * Generate the SDK's module and controllers files
 * @param modules
 * @returns
 */
export declare function generateSdkModules(modules: SdkModules): Map<string, string>;
/**
 * Generate the method parameters for a given SDK method
 * @param params
 * @returns
 */
export declare function generateSdkMethodParams(params: SdkMethodParams): string;
/**
 * Generate a request call to Central for the generated files
 * @param method
 * @returns
 */
export declare function generateCentralRequest(method: SdkMethod): string;
