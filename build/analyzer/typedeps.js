"use strict";
/**
 * @file Type dependencies builders from the source API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeExternalFilePath = exports.getImportResolvedType = exports.resolveTypeDependencies = exports.IMPORTED_TYPE_REGEX = void 0;
const path = require("path");
const logging_1 = require("../logging");
/**
 * Regex to match or replace imported types
 */
exports.IMPORTED_TYPE_REGEX = /\bimport\(['"]([^'"]+)['"]\)\.([a-zA-Z0-9_]+)\b/g;
/**
 * Resolve the dependencies of a TS-Morph analyzed type
 * @param type
 * @param relativeFilePath
 * @param absoluteSrcPath
 * @returns
 */
function resolveTypeDependencies(type, relativeFilePath, absoluteSrcPath) {
    /** Raw type's text (e.g. `Array<import("somefile.ts").SomeType>`) */
    const rawType = type.getText();
    if (path.isAbsolute(relativeFilePath)) {
        (0, logging_1.unreachable)('Internal error: got absolute file path in type dependencies resolver, when expecting a relative one (got {magentaBright})', relativeFilePath);
    }
    let dependencies = new Map();
    let localTypes = [];
    /** Resolved type (without import statements) */
    const resolvedType = rawType.replace(exports.IMPORTED_TYPE_REGEX, (_, matchedFilePath, type) => {
        const filePath = path.isAbsolute(matchedFilePath) ? path.relative(absoluteSrcPath, matchedFilePath) : matchedFilePath;
        const deps = dependencies.get(filePath);
        if (deps) {
            if (!deps.includes(type)) {
                deps.push(type);
            }
        }
        else {
            dependencies.set(filePath, [type]);
        }
        return type;
    });
    if (resolvedType.includes('import(')) {
        (0, logging_1.unreachable)('Internal error: resolved still contains an {magenta} statement: {green}', 'import(...)', resolvedType);
    }
    for (const depFile of dependencies.keys()) {
        if (path.isAbsolute(depFile)) {
            (0, logging_1.unreachable)('Internal error: resolved absolute file path in type dependencies, when should have resolved a relative one\nIn type: {yellow}\nGot: {magentaBright}', type.getText(), depFile);
        }
    }
    return {
        rawType,
        relativeFilePath,
        resolvedType,
        dependencies,
        localTypes,
    };
}
exports.resolveTypeDependencies = resolveTypeDependencies;
/**
 * Extract an import type's name from a TS-Morph type
 * @example "import('dir/file').TypeName" => "TypeName"
 * @param type
 * @returns
 */
function getImportResolvedType(type) {
    return type.getText().replace(exports.IMPORTED_TYPE_REGEX, (_, __, typename) => typename);
}
exports.getImportResolvedType = getImportResolvedType;
/**
 * Convert paths for external files
 * @param importedFilePath
 */
function normalizeExternalFilePath(importedFilePath) {
    importedFilePath = path.normalize(importedFilePath);
    if (!importedFilePath.startsWith('../')) {
        return importedFilePath;
    }
    let level = 0;
    while (importedFilePath.startsWith('../')) {
        level++;
        importedFilePath = importedFilePath.substr(3);
    }
    return `_external${level}/${importedFilePath}`;
}
exports.normalizeExternalFilePath = normalizeExternalFilePath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWRlcHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYW5hbHl6ZXIvdHlwZWRlcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOzs7QUFFSCw2QkFBNEI7QUFFNUIsd0NBQXdDO0FBRXhDOztHQUVHO0FBQ1UsUUFBQSxtQkFBbUIsR0FBRyxrREFBa0QsQ0FBQTtBQTRCckY7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsdUJBQXVCLENBQUMsSUFBbUIsRUFBRSxnQkFBd0IsRUFBRSxlQUF1QjtJQUM1RyxxRUFBcUU7SUFDckUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBRTlCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1FBQ3JDLElBQUEscUJBQVcsRUFDVCwySEFBMkgsRUFDM0gsZ0JBQWdCLENBQ2pCLENBQUE7S0FDRjtJQUVELElBQUksWUFBWSxHQUFxQyxJQUFJLEdBQUcsRUFBRSxDQUFBO0lBQzlELElBQUksVUFBVSxHQUFtQyxFQUFFLENBQUE7SUFFbkQsZ0RBQWdEO0lBQ2hELE1BQU0sWUFBWSxHQUFxQyxPQUFPLENBQUMsT0FBTyxDQUFDLDJCQUFtQixFQUFFLENBQUMsQ0FBQyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUN2SCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFBO1FBRXJILE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFdkMsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUNoQjtTQUNGO2FBQU07WUFDTCxZQUFZLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7U0FDbkM7UUFFRCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3BDLElBQUEscUJBQVcsRUFBQyx5RUFBeUUsRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUE7S0FDcEg7SUFFRCxLQUFLLE1BQU0sT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUN6QyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDNUIsSUFBQSxxQkFBVyxFQUNULHFKQUFxSixFQUNySixJQUFJLENBQUMsT0FBTyxFQUFFLEVBQ2QsT0FBTyxDQUNSLENBQUE7U0FDRjtLQUNGO0lBRUQsT0FBTztRQUNMLE9BQU87UUFDUCxnQkFBZ0I7UUFDaEIsWUFBWTtRQUNaLFlBQVk7UUFDWixVQUFVO0tBQ1gsQ0FBQTtBQUNILENBQUM7QUFwREQsMERBb0RDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixxQkFBcUIsQ0FBQyxJQUFtQjtJQUN2RCxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsMkJBQW1CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDbkYsQ0FBQztBQUZELHNEQUVDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0IseUJBQXlCLENBQUMsZ0JBQXdCO0lBQ2hFLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtJQUVuRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZDLE9BQU8sZ0JBQWdCLENBQUE7S0FDeEI7SUFFRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUE7SUFFYixPQUFPLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN6QyxLQUFLLEVBQUUsQ0FBQTtRQUNQLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUM5QztJQUVELE9BQU8sWUFBWSxLQUFLLElBQUksZ0JBQWdCLEVBQUUsQ0FBQTtBQUNoRCxDQUFDO0FBZkQsOERBZUMifQ==