/**
 * @file Entrypoint of the SDK generator
 */
import { SdkContent } from '../analyzer';
import { Config } from '../config';
export default function generatorCli(config: Config, sdkContent: SdkContent): Promise<void>;
