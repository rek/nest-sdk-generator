/**
 * @file Types extractor to use in the generated SDK
 */
import { Project } from 'ts-morph';
import { MagicType } from '../config';
import { SdkModules } from './controllers';
import { ResolvedTypeDeps } from './typedeps';
/** Valid extensions for TypeScript module files */
export declare const MODULE_EXTENSIONS: string[];
/**
 * Location of an imported type
 */
export interface TypeLocation {
    readonly typename: string;
    readonly relativePathNoExt: string;
}
/**
 * Location of an imported type after figuring out its extension
 */
export interface TypeLocationWithExt extends TypeLocation {
    readonly relativePath: string;
}
/**
 * Extracted imported type
 */
export interface ExtractedType extends TypeLocationWithExt {
    /** Type's declaration */
    readonly content: string;
    /** Type parameters (e.g. <T>) */
    readonly typeParams: string[];
    /** Types this one depends on */
    readonly dependencies: TypeLocationWithExt[];
}
export declare type TypesExtractorContent = Map<string, Map<string, ExtractedType>>;
/**
 * Types extractor
 */
export declare class TypesExtractor {
    /** TS-Morph project */
    readonly project: Project;
    /** Absolute source path */
    readonly absoluteSrcPath: string;
    /** Magic types to replace non-portable types */
    readonly magicTypes: Array<MagicType>;
    /** Extracted types */
    readonly extracted: TypesExtractorContent;
    constructor(
    /** TS-Morph project */
    project: Project, 
    /** Absolute source path */
    absoluteSrcPath: string, 
    /** Magic types to replace non-portable types */
    magicTypes: Array<MagicType>, 
    /** Extracted types */
    extracted?: TypesExtractorContent);
    /**
     * Check if a type has already been extracted
     */
    hasExtractedType(loc: TypeLocationWithExt): boolean;
    /**
     * Get a type that was previously extracted
     */
    getExtractedType(loc: TypeLocationWithExt): ExtractedType | null;
    /**
     * Find the extension of a TypeScript module
     * @param loc
     * @returns
     */
    guessExtractedTypeModuleFileExt(loc: TypeLocation): string | null;
    /**
     * Find if a type has previously been extracted, without providing its extension
     * @param loc
     * @returns
     */
    findExtractedTypeWithoutExt(loc: TypeLocation): ExtractedType | null;
    /**
     * Memorize an extracted type so it can be reused later on
     * @param loc
     * @param extracted
     */
    memorizeExtractedType(loc: TypeLocationWithExt, extracted: ExtractedType): void;
    /**
     * Find the relative file location of a type
     * @param loc
     * @returns
     */
    findTypeRelativeFilePath(loc: TypeLocation): string | Error;
    /**
     * Extract a type
     * @param loc
     * @param typesPath
     * @returns
     */
    extractType(loc: TypeLocation, typesPath?: string[]): ExtractedType | Error;
}
/**
 * Locate the files containing a list of a resolved types
 * @param resolvedTypes
 * @returns
 */
export declare function locateTypesFile(resolvedTypes: Array<ResolvedTypeDeps>): TypeLocation[];
/**
 * Flatten a tree of resolved type dependencies
 * @param sdkModules
 * @returns
 */
export declare function flattenSdkResolvedTypes(sdkModules: SdkModules): ResolvedTypeDeps[];
