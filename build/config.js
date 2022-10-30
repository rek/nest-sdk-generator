"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.configPath = void 0;
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
/**
 * Load an existing configuration file and decode it
 * @param configPath
 */
function loadConfigFile(configPath) {
    if (!fs.existsSync(configPath)) {
        console.error(chalk.red('Config file was not found at path: ' + chalk.yellow(path.resolve(configPath))));
        process.exit(4);
    }
    const text = fs.readFileSync(configPath, 'utf8');
    try {
        return JSON.parse(text);
    }
    catch (e) {
        console.error(chalk.red('Failed to parse configuration file: ' + e));
        process.exit(3);
    }
}
exports.configPath = process.argv[2];
if (!exports.configPath) {
    console.error(chalk.red('Please provide a path to the configuration file'));
    process.exit(2);
}
exports.config = loadConfigFile(exports.configPath);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IseUJBQXdCO0FBQ3hCLDZCQUE0QjtBQTJENUI7OztHQUdHO0FBQ0gsU0FBUyxjQUFjLENBQUMsVUFBa0I7SUFDeEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDOUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN4RyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ2hCO0lBRUQsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFFaEQsSUFBSTtRQUNGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN4QjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDcEUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNoQjtBQUNILENBQUM7QUFFWSxRQUFBLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRXpDLElBQUksQ0FBQyxrQkFBVSxFQUFFO0lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLENBQUMsQ0FBQTtJQUMzRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0NBQ2hCO0FBRVksUUFBQSxNQUFNLEdBQUcsY0FBYyxDQUFDLGtCQUFVLENBQUMsQ0FBQSJ9