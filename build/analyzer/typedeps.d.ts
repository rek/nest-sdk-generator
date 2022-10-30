/**
 * @file Type dependencies builders from the source API
 */
import { ts, Type } from 'ts-morph';
/**
 * Regex to match or replace imported types
 */
export declare const IMPORTED_TYPE_REGEX: RegExp;
/**
 * Type with resolved level 1 dependencies (does not look for dependencies' own dependencies!)
 */
export interface ResolvedTypeDeps {
    /** The original raw type, with import("...") expressions */
    readonly rawType: string;
    /** The resolved type, without imports */
    readonly resolvedType: string;
    /** File from which the type originates */
    readonly relativeFilePath: string;
    /**
     * The type dependencies used by the resolved type
     * A collection of scripts' relative paths mapped with the list of types imported from them
     */
    readonly dependencies: Map<string, string[]>;
    /**
     * Non-native types that are not imported
     * They may be either local types (declared in the same file than the one analyzed) or globally-defined types
     */
    readonly localTypes: string[];
}
/**
 * Resolve the dependencies of a TS-Morph analyzed type
 * @param type
 * @param relativeFilePath
 * @param absoluteSrcPath
 * @returns
 */
export declare function resolveTypeDependencies(type: Type<ts.Type>, relativeFilePath: string, absoluteSrcPath: string): ResolvedTypeDeps;
/**
 * Extract an import type's name from a TS-Morph type
 * @example "import('dir/file').TypeName" => "TypeName"
 * @param type
 * @returns
 */
export declare function getImportResolvedType(type: Type<ts.Type>): string;
/**
 * Convert paths for external files
 * @param importedFilePath
 */
export declare function normalizeExternalFilePath(importedFilePath: string): string;
