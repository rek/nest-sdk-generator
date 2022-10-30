/**
 * @file Analyze the dependencies of a class analyzed by the TypeScript compiler
 */
import { ClassDeclaration, InterfaceDeclaration } from 'ts-morph';
import { ResolvedTypeDeps } from './typedeps';
export declare function analyzeClassDeps(decl: ClassDeclaration | InterfaceDeclaration, relativeFilePath: string, absoluteSrcPath: string): ResolvedTypeDeps[];
