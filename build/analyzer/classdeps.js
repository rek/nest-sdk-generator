"use strict";
/**
 * @file Analyze the dependencies of a class analyzed by the TypeScript compiler
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeClassDeps = void 0;
const path = require("path");
const logging_1 = require("../logging");
const typedeps_1 = require("./typedeps");
function analyzeClassDeps(decl, relativeFilePath, absoluteSrcPath) {
    if (path.isAbsolute(relativeFilePath)) {
        (0, logging_1.unreachable)('Internal error: got absolute file path in class dependencies analyzer, when expecting a relative one (got {magentaBright})', relativeFilePath);
    }
    const toLookup = new Array();
    const superClasses = decl.getExtends();
    if (superClasses) {
        for (const sup of Array.isArray(superClasses) ? superClasses : [superClasses]) {
            toLookup.push(sup.getType());
        }
    }
    for (const prop of decl.getProperties()) {
        toLookup.push(prop.getType());
    }
    return toLookup.map((typeText) => (0, typedeps_1.resolveTypeDependencies)(typeText, relativeFilePath, absoluteSrcPath));
}
exports.analyzeClassDeps = analyzeClassDeps;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3NkZXBzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FuYWx5emVyL2NsYXNzZGVwcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILDZCQUE0QjtBQUU1Qix3Q0FBd0M7QUFDeEMseUNBQXNFO0FBRXRFLFNBQWdCLGdCQUFnQixDQUM5QixJQUE2QyxFQUM3QyxnQkFBd0IsRUFDeEIsZUFBdUI7SUFFdkIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7UUFDckMsSUFBQSxxQkFBVyxFQUNULDRIQUE0SCxFQUM1SCxnQkFBZ0IsQ0FDakIsQ0FBQTtLQUNGO0lBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLEVBQWlCLENBQUE7SUFFM0MsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0lBRXRDLElBQUksWUFBWSxFQUFFO1FBQ2hCLEtBQUssTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQzdFLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7U0FDN0I7S0FDRjtJQUVELEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFO1FBQ3ZDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7S0FDOUI7SUFFRCxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLElBQUEsa0NBQXVCLEVBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUE7QUFDekcsQ0FBQztBQTNCRCw0Q0EyQkMifQ==