/**
 * @file Entrypoint of the source API analyzer, used to generate the final SDK
 */
import { Config } from '../config';
import { SdkModules } from './controllers';
import { TypesExtractorContent } from './extractor';
export interface SdkContent {
    readonly modules: SdkModules;
    readonly types: TypesExtractorContent;
}
export interface MagicType {
    readonly package: string;
    readonly typeName: string;
    readonly content: string;
}
export declare function analyzerCli(config: Config): Promise<SdkContent>;
