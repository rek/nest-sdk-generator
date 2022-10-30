/**
 * The configuration file's content
 * For details on what these options do, see the project's README
 */
export interface Config {
    /** Enable verbose mode */
    readonly verbose?: boolean;
    /** Disable colored output */
    readonly noColor?: boolean;
    /** Path to the API's source directory */
    readonly apiInputPath: string;
    /** Path to generate the SDK at */
    readonly sdkOutput: string;
    /** Path to the SDK interface file */
    readonly sdkInterfacePath: string;
    /** List of magic types */
    readonly magicTypes?: MagicType[];
    /** Show a JSON output */
    readonly jsonOutput?: string;
    /** Prettify the JSON output */
    readonly jsonPrettyOutput?: boolean;
    /** Prettify the generated files (enabled by default) */
    readonly prettify?: boolean;
    /** Path to Prettier's configuration file */
    readonly prettierConfig?: string;
    /** Path to custom tsconfig file */
    readonly tsconfigFile?: string;
    /** If the output directory already exists, overwrite it (enabled by default) */
    readonly overwriteOldOutputDir?: boolean;
    /** If the SDK interface file does not exist yet, create one automatically (enabled by default) */
    readonly generateDefaultSdkInterface?: boolean;
    /** Write generation timestamp in each TypeScript file (enabled by default) */
    readonly generateTimestamps?: boolean;
}
/**
 * Magic type used to replace a non-compatible type in the generated SDK
 */
export interface MagicType {
    readonly nodeModuleFilePath: string;
    readonly typeName: string;
    readonly placeholderContent: string;
}
export declare const configPath: string;
export declare const config: Config;
