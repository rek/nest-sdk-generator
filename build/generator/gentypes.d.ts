/**
 * @file Generate type files for the SDK
 */
import { TypesExtractorContent } from '../analyzer/extractor';
/**
 * Generate the non-formatted type files which will be used by the SDK's route functions
 * @param sdkTypes
 * @returns
 */
export declare function generateSdkTypeFiles(sdkTypes: TypesExtractorContent): Map<string, string>;
