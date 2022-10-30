"use strict";
/**
 * @file Entrypoint of the source API analyzer, used to generate the final SDK
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzerCli = void 0;
const fs = require("fs");
const path = require("path");
const ts_morph_1 = require("ts-morph");
const logging_1 = require("../logging");
const builtin_1 = require("./builtin");
const controllers_1 = require("./controllers");
const extractor_1 = require("./extractor");
function analyzerCli(config) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const started = Date.now();
        const sourcePath = path.resolve(process.cwd(), config.apiInputPath);
        if (!sourcePath)
            (0, logging_1.panic)('Please provide a source directory');
        if (!fs.existsSync(sourcePath))
            (0, logging_1.panic)('Provided source path {magentaBright} does not exist', sourcePath);
        if (!fs.lstatSync(sourcePath).isDirectory())
            (0, logging_1.panic)('Provided source path is not a directory');
        (0, logging_1.debug)(`Analyzing from source directory {yellow}`, sourcePath);
        if (config.jsonOutput) {
            const jsonOutputParentDir = path.dirname(path.resolve(process.cwd(), config.jsonOutput));
            if (!fs.existsSync(jsonOutputParentDir)) {
                (0, logging_1.panic)("Output file's parent directory {magentaBright} does not exist.", jsonOutputParentDir);
            }
            (0, logging_1.debug)('Writing output to {yellow}', config.jsonOutput, config.jsonPrettyOutput ? 'beautified' : 'minified');
        }
        // ====== Find & parse 'tsconfig.json' ====== //
        const tsConfigFileName = config.tsconfigFile || 'tsconfig.json';
        const tsConfigFilePath = path.join(sourcePath, tsConfigFileName);
        if (!fs.existsSync(tsConfigFilePath)) {
            (0, logging_1.panic)('No {yellow} file found in provided source path {yellow}', tsConfigFileName, sourcePath);
        }
        // Create a 'ts-morph' project
        const project = new ts_morph_1.Project({
            tsConfigFilePath,
        });
        // Get the list of all TypeScript files in the source directory
        const sourceTSFiles = project.getSourceFiles().map((file) => path.relative(sourcePath, file.getFilePath()));
        (0, logging_1.debug)(`Found {magentaBright} source files.`, sourceTSFiles.length);
        // Add them
        (0, logging_1.debug)('\nAdding them to the source project...');
        let progressByTenth = 0;
        let strLen = sourceTSFiles.length.toString().length;
        const hasProgress = (filesTreated) => filesTreated / sourceTSFiles.length >= (progressByTenth + 1) / 10;
        const controllers = [];
        for (let i = 0; i < sourceTSFiles.length; i++) {
            const file = sourceTSFiles[i];
            if (file.endsWith('.controller.ts')) {
                controllers.push(file);
            }
            if (hasProgress(i + 1)) {
                while (hasProgress(i + 1))
                    progressByTenth++;
                (0, logging_1.debug)('| Progress: {yellow} ({magentaBright} files) - {green} controller{} found', (progressByTenth * 10).toString().padStart(3, ' ') + '%', `${(i + 1).toString().padStart(strLen, ' ')} / ${sourceTSFiles.length}`, controllers.length.toString().padStart(strLen, ''), controllers.length > 1 ? 's' : '');
            }
        }
        (0, logging_1.debug)('All files were added successfully.\n');
        const modules = (0, controllers_1.analyzeControllers)(controllers, sourcePath, project);
        // Builtin magic types are concatenated **after** the configuration's ones, as this allows users to
        // override the builtin ones if they want. Do **not** change the concatenation order!
        const magicTypes = ((_a = config.magicTypes) !== null && _a !== void 0 ? _a : []).concat(builtin_1.builtinMagicTypes);
        const typesCache = new extractor_1.TypesExtractor(project, sourcePath, magicTypes);
        const typesToExtract = (0, extractor_1.locateTypesFile)((0, extractor_1.flattenSdkResolvedTypes)(modules));
        (0, logging_1.debug)('\n==== Extracting {} type' + (typesToExtract.length > 1 ? 's' : '') + ' ====\n', typesToExtract.length);
        for (const loc of typesToExtract) {
            const result = typesCache.extractType(loc);
            if (result instanceof Error) {
                (0, logging_1.panic)(result.message);
            }
        }
        const content = {
            modules,
            types: typesCache.extracted,
        };
        if (config.jsonOutput) {
            fs.writeFileSync(config.jsonOutput, JSON.stringify(content, (_, v) => (v instanceof Map ? Object.fromEntries(v) : v), config.jsonPrettyOutput ? 4 : 0), 'utf8');
        }
        (0, logging_1.debug)('\n===== Done in {green}! ====', ((Date.now() - started) / 1000).toFixed(2) + 's');
        return content;
    });
}
exports.analyzerCli = analyzerCli;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYW5hbHl6ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOzs7Ozs7Ozs7Ozs7QUFFSCx5QkFBd0I7QUFDeEIsNkJBQTRCO0FBQzVCLHVDQUFrQztBQUVsQyx3Q0FBeUM7QUFDekMsdUNBQTZDO0FBQzdDLCtDQUE4RDtBQUM5RCwyQ0FBNkc7QUFhN0csU0FBc0IsV0FBVyxDQUFDLE1BQWM7OztRQUM5QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7UUFFMUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBRW5FLElBQUksQ0FBQyxVQUFVO1lBQUUsSUFBQSxlQUFLLEVBQUMsbUNBQW1DLENBQUMsQ0FBQTtRQUUzRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7WUFBRSxJQUFBLGVBQUssRUFBQyxxREFBcUQsRUFBRSxVQUFVLENBQUMsQ0FBQTtRQUN4RyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLEVBQUU7WUFBRSxJQUFBLGVBQUssRUFBQyx5Q0FBeUMsQ0FBQyxDQUFBO1FBRTdGLElBQUEsZUFBSyxFQUFDLDBDQUEwQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO1FBRTdELElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUNyQixNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7WUFFeEYsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsRUFBRTtnQkFDdkMsSUFB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