"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFilesRecursive = exports.findFileAbove = void 0;
const fs = require("fs");
const path = require("path");
function findFileAbove(pattern, dir) {
    if (!path.isAbsolute(dir)) {
        // Get an absolute path to allow getting its parent using path.dirname()
        dir = path.resolve(process.cwd(), dir);
    }
    // The previous directory
    // This is used to check if we reached the top-level directory ; for instance on Linux:
    // > path.dirname('/') === '/'
    // So if the previous directory and the current one are equal, this means we reached the top-level directory
    let prevDir = dir;
    let items = [];
    // Search until we find the desired file
    while ((items = fs.readdirSync(dir).filter((item) => (pattern instanceof RegExp ? pattern.exec(item) : pattern === item))).length === 0) {
        // Get path to the parent directory
        dir = path.dirname(dir);
        // If the path is empty or equal to the previous path, we reached the top-level directory
        if (!dir || prevDir === dir) {
            return null;
        }
        prevDir = dir;
    }
    // Success!
    return path.resolve(dir, items[0]);
}
exports.findFileAbove = findFileAbove;
/**
 * Find all files matching a pattern, recursively
 * @param pattern The pattern to look for
 * @param dir The root directory to start searching from
 * @param relative Get relative paths instead of absolute paths (default: true)
 * @returns A list of paths
 */
function findFilesRecursive(pattern, dir, relative = true) {
    const cwd = process.cwd();
    function find(pattern, rootDir, currDir) {
        return fs
            .readdirSync(currDir)
            .map((item) => {
            const fullPath = path.resolve(currDir, item);
            return fs.lstatSync(fullPath).isDirectory()
                ? find(pattern, rootDir, fullPath)
                : (typeof pattern === 'string' ? item === pattern : pattern.exec(item))
                    ? [relative ? path.relative(rootDir, fullPath) : path.resolve(cwd, currDir, item)]
                    : [];
        })
            .flat();
    }
    return find(pattern, dir, dir);
}
exports.findFilesRecursive = findFilesRecursive;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXdCO0FBQ3hCLDZCQUE0QjtBQUU1QixTQUFnQixhQUFhLENBQUMsT0FBd0IsRUFBRSxHQUFXO0lBQ2pFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3pCLHdFQUF3RTtRQUN4RSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUE7S0FDdkM7SUFFRCx5QkFBeUI7SUFDekIsdUZBQXVGO0lBQ3ZGLDhCQUE4QjtJQUM5Qiw0R0FBNEc7SUFDNUcsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFBO0lBRWpCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQTtJQUVkLHdDQUF3QztJQUN4QyxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN2SSxtQ0FBbUM7UUFDbkMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFdkIseUZBQXlGO1FBQ3pGLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxLQUFLLEdBQUcsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQTtTQUNaO1FBRUQsT0FBTyxHQUFHLEdBQUcsQ0FBQTtLQUNkO0lBRUQsV0FBVztJQUNYLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDcEMsQ0FBQztBQTdCRCxzQ0E2QkM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixrQkFBa0IsQ0FBQyxPQUF3QixFQUFFLEdBQVcsRUFBRSxRQUFRLEdBQUcsSUFBSTtJQUN2RixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7SUFFekIsU0FBUyxJQUFJLENBQUMsT0FBd0IsRUFBRSxPQUFlLEVBQUUsT0FBZTtRQUN0RSxPQUFPLEVBQUU7YUFDTixXQUFXLENBQUMsT0FBTyxDQUFDO2FBQ3BCLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ1osTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFNUMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRTtnQkFDekMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsT0FBTyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN2RSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2xGLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDUixDQUFDLENBQUM7YUFDRCxJQUFJLEVBQUUsQ0FBQTtJQUNYLENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ2hDLENBQUM7QUFuQkQsZ0RBbUJDIn0=