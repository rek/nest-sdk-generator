/**
 * @file Analyzer for the source API's controllers
 */
import { Project } from 'ts-morph';
import { SdkController } from './controller';
export declare type SdkModules = Map<string, Map<string, SdkController>>;
export declare function analyzeControllers(controllers: string[], absoluteSrcPath: string, project: Project): SdkModules;
