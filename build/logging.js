"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.println = exports.warn = exports.unreachable = exports.panic = exports.format = void 0;
const chalk = require("chalk");
const config_1 = require("./config");
function format(message, ...params) {
    return message.replace(/\{(black|red|green|yellow|blue|magenta|cyan|white|gray|grey|blackBright|redBright|greenBright|yellowBright|blueBright|magentaBright|cyanBright|whiteBright|)\}/g, (match, color) => {
        var _a;
        const param = (_a = params.shift()) !== null && _a !== void 0 ? _a : panic(`In message:\n> {}\nMissing parameter:\n> {}`, message, match);
        return color && config_1.config.noColor !== false ? chalk[color](param) : param;
    });
}
exports.format = format;
function panic(message, ...params) {
    console.error(chalk.redBright('ERROR: ' + format(message, ...params)));
    process.exit(1);
}
exports.panic = panic;
function unreachable(message, ...params) {
    panic(message, ...params);
}
exports.unreachable = unreachable;
function warn(message, ...params) {
    console.warn(chalk.yellow(format(message, ...params)));
}
exports.warn = warn;
function println(message, ...params) {
    console.log(format(message, ...params));
}
exports.println = println;
function debug(message, ...params) {
    if (config_1.config.verbose) {
        console.warn(chalk.cyan(format(message, ...params)));
    }
}
exports.debug = debug;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dnaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUE4QjtBQUM5QixxQ0FBaUM7QUFFakMsU0FBZ0IsTUFBTSxDQUFDLE9BQWUsRUFBRSxHQUFHLE1BQThCO0lBQ3ZFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FDcEIsaUtBQWlLLEVBQ2pLLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFOztRQUNmLE1BQU0sS0FBSyxHQUFHLE1BQUEsTUFBTSxDQUFDLEtBQUssRUFBRSxtQ0FBSSxLQUFLLENBQUMsNkNBQTZDLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ3BHLE9BQU8sS0FBSyxJQUFJLGVBQU0sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBRSxLQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTtJQUNqRixDQUFDLENBQ0YsQ0FBQTtBQUNILENBQUM7QUFSRCx3QkFRQztBQUVELFNBQWdCLEtBQUssQ0FBQyxPQUFlLEVBQUUsR0FBRyxNQUE4QjtJQUN0RSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdEUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNqQixDQUFDO0FBSEQsc0JBR0M7QUFFRCxTQUFnQixXQUFXLENBQUMsT0FBZSxFQUFFLEdBQUcsTUFBOEI7SUFDNUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFBO0FBQzNCLENBQUM7QUFGRCxrQ0FFQztBQUVELFNBQWdCLElBQUksQ0FBQyxPQUFlLEVBQUUsR0FBRyxNQUE4QjtJQUNyRSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN4RCxDQUFDO0FBRkQsb0JBRUM7QUFFRCxTQUFnQixPQUFPLENBQUMsT0FBZSxFQUFFLEdBQUcsTUFBOEI7SUFDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQTtBQUN6QyxDQUFDO0FBRkQsMEJBRUM7QUFFRCxTQUFnQixLQUFLLENBQUMsT0FBZSxFQUFFLEdBQUcsTUFBOEI7SUFDdEUsSUFBSSxlQUFNLENBQUMsT0FBTyxFQUFFO1FBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ3JEO0FBQ0gsQ0FBQztBQUpELHNCQUlDIn0=