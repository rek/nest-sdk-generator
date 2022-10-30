"use strict";
/**
 * @file Interface for prettifying generated files
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettify = exports.findPrettierConfig = void 0;
const fs = require("fs");
const prettier = require("prettier");
const logging_1 = require("../logging");
const utils_1 = require("../utils");
/**
 * Find a .prettierrc configuration file in the current directory or above
 */
function findPrettierConfig(config) {
    var _a;
    let prettierConfigPath = (_a = config.prettierConfig) !== null && _a !== void 0 ? _a : (0, utils_1.findFileAbove)('.prettierrc', config.sdkOutput);
    if (!prettierConfigPath) {
        return {};
    }
    if (!fs.existsSync(prettierConfigPath)) {
        (0, logging_1.panic)('Prettier configuration was not found at specified path {magenta}', prettierConfigPath);
    }
    const text = fs.readFileSync(prettierConfigPath, 'utf8');
    try {
        return JSON.parse(text);
    }
    catch (e) {
        throw new Error('Failed to parse Prettier configuration: ' + e);
    }
}
exports.findPrettierConfig = findPrettierConfig;
/**
 * Prettify a TypeScript or JSON input
 * @param source
 * @param config
 * @param parser
 * @returns
 */
function prettify(source, config, parser) {
    return prettier.format(source, Object.assign({ parser }, config));
}
exports.prettify = prettify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldHRpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZ2VuZXJhdG9yL3ByZXR0aWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7O0FBRUgseUJBQXdCO0FBQ3hCLHFDQUFvQztBQUVwQyx3Q0FBa0M7QUFDbEMsb0NBQXdDO0FBRXhDOztHQUVHO0FBQ0gsU0FBZ0Isa0JBQWtCLENBQUMsTUFBYzs7SUFDL0MsSUFBSSxrQkFBa0IsR0FBRyxNQUFBLE1BQU0sQ0FBQyxjQUFjLG1DQUFJLElBQUEscUJBQWEsRUFBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBRWhHLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtRQUN2QixPQUFPLEVBQUUsQ0FBQTtLQUNWO0lBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsRUFBRTtRQUN0QyxJQUFBLGVBQUssRUFBQyxrRUFBa0UsRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO0tBQzlGO0lBRUQsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUV4RCxJQUFJO1FBQ0YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3hCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0tBQ2hFO0FBQ0gsQ0FBQztBQWxCRCxnREFrQkM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixRQUFRLENBQUMsTUFBYyxFQUFFLE1BQWMsRUFBRSxNQUE2QjtJQUNwRixPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxrQkFDM0IsTUFBTSxJQUNILE1BQU0sRUFDVCxDQUFBO0FBQ0osQ0FBQztBQUxELDRCQUtDIn0=