/**
 * @file Analyzer for the source API's modules
 */
import { Project } from 'ts-morph';
/**
 * Get the name of a module
 * @param project TS-Morph project the module is contained in
 * @param modulePath Path to the module's file
 * @param sourcePath Path to the TypeScript root directory
 */
export declare function getModuleName(project: Project, modulePath: string, sourcePath: string): string;
