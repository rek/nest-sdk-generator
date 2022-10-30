/**
 * @file Interface for prettifying generated files
 */
import { Config } from '../config';
/**
 * Find a .prettierrc configuration file in the current directory or above
 */
export declare function findPrettierConfig(config: Config): object;
/**
 * Prettify a TypeScript or JSON input
 * @param source
 * @param config
 * @param parser
 * @returns
 */
export declare function prettify(source: string, config: object, parser: 'typescript' | 'json'): string;
