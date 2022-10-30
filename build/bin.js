#!/usr/bin/env node
"use strict";
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
const path = require("path");
const analyzer_1 = require("./analyzer");
const config_1 = require("./config");
const generator_1 = require("./generator");
const logging_1 = require("./logging");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const started = Date.now();
        process.chdir(path.dirname(path.resolve(config_1.configPath)));
        switch (process.argv[3]) {
            case '--analyze':
                yield (0, analyzer_1.analyzerCli)(config_1.config);
                break;
            case '--generate':
            case undefined:
                const sdkContent = yield (0, analyzer_1.analyzerCli)(config_1.config);
                yield (0, generator_1.default)(config_1.config, sdkContent);
                break;
            default:
                console.error('ERROR: Unknown action provided (must be either "--analyze" or "--generate")');
                process.exit(1);
        }
        (0, logging_1.println)('{green}', '@ Done in ' + ((Date.now() - started) / 1000).toFixed(2) + 's');
    });
}
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Jpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSw2QkFBNEI7QUFDNUIseUNBQXdDO0FBQ3hDLHFDQUE2QztBQUM3QywyQ0FBc0M7QUFDdEMsdUNBQW1DO0FBRW5DLFNBQWUsSUFBSTs7UUFDakIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBRTFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFVLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFckQsUUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3ZCLEtBQUssV0FBVztnQkFDZCxNQUFNLElBQUEsc0JBQVcsRUFBQyxlQUFNLENBQUMsQ0FBQTtnQkFDekIsTUFBSztZQUVQLEtBQUssWUFBWSxDQUFDO1lBQ2xCLEtBQUssU0FBUztnQkFDWixNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUEsc0JBQVcsRUFBQyxlQUFNLENBQUMsQ0FBQTtnQkFDNUMsTUFBTSxJQUFBLG1CQUFZLEVBQUMsZUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFBO2dCQUN0QyxNQUFLO1lBRVA7Z0JBQ0UsT0FBTyxDQUFDLEtBQUssQ0FBQyw2RUFBNkUsQ0FBQyxDQUFBO2dCQUM1RixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ2xCO1FBRUQsSUFBQSxpQkFBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7SUFDckYsQ0FBQztDQUFBO0FBRUQsSUFBSSxFQUFFLENBQUEifQ==