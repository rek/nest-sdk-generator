"use strict";
/**
 * @file Generate type files for the SDK
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSdkTypeFiles = void 0;
const path = require("path");
const typedeps_1 = require("../analyzer/typedeps");
/**
 * Generate the non-formatted type files which will be used by the SDK's route functions
 * @param sdkTypes
 * @returns
 */
function generateSdkTypeFiles(sdkTypes) {
    /** Generated type files */
    const genFiles = new Map();
    // While analyzing the controllers' content, all types used by their methods have been extracted
    // The list of these types is then provided to this function as the `sdkTypes` argument, allowing us
    //  to establish the list of all dependencies.
    for (const [file, types] of sdkTypes) {
        const out = [];
        /** List of imports in the current file */
        const imports = new Map();
        // Iterate over all types in the current `file`
        for (const extracted of types.values()) {
            // Iterate over all of the extracted type's dependencies
            for (const dep of extracted.dependencies) {
                // If the dependency is from the same file, then we have nothing to do
                if (dep.relativePath === file) {
                    continue;
                }
                // Push the typename to the list of imports
                let imported = imports.get(dep.relativePathNoExt);
                if (!imported) {
                    imported = [dep.typename];
                    imports.set(dep.relativePathNoExt, imported);
                }
                if (!imported.includes(dep.typename)) {
                    imported.push(dep.typename);
                }
            }
        }
        // Generate an import statement for each imported type
        out.push([...imports]
            .map(([depFile, types]) => {
            let depPath = path.relative(path.dirname(file), (0, typedeps_1.normalizeExternalFilePath)(depFile)).replace(/\\/g, '/');
            if (!depPath.includes('/'))
                depPath = './' + depPath;
            return `import type { ${types.join(', ')} } from "${depPath.startsWith('./') || depPath.startsWith('../') ? depPath : './' + depPath}"`;
        })
            .join('\n'));
        // Add the extracted types' declaration, indented
        for (const extracted of types.values()) {
            out.push(extracted.content.replace(/^/gm, '  '));
        }
        // Generate the type file
        genFiles.set(file, out.join('\n'));
    }
    return genFiles;
}
exports.generateSdkTypeFiles = generateSdkTypeFiles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VudHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZ2VuZXJhdG9yL2dlbnR5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7O0FBRUgsNkJBQTRCO0FBRTVCLG1EQUFnRTtBQUVoRTs7OztHQUlHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsUUFBK0I7SUFDbEUsMkJBQTJCO0lBQzNCLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFBO0lBRTFDLGdHQUFnRztJQUNoRyxvR0FBb0c7SUFDcEcsOENBQThDO0lBQzlDLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxRQUFRLEVBQUU7UUFDcEMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFBO1FBRWQsMENBQTBDO1FBQzFDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxFQUFvQixDQUFBO1FBRTNDLCtDQUErQztRQUMvQyxLQUFLLE1BQU0sU0FBUyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN0Qyx3REFBd0Q7WUFDeEQsS0FBSyxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsWUFBWSxFQUFFO2dCQUN4QyxzRUFBc0U7Z0JBQ3RFLElBQUksR0FBRyxDQUFDLFlBQVksS0FBSyxJQUFJLEVBQUU7b0JBQzdCLFNBQVE7aUJBQ1Q7Z0JBRUQsMkNBQTJDO2dCQUMzQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO2dCQUVqRCxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNiLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtvQkFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUE7aUJBQzdDO2dCQUVELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDcEMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7aUJBQzVCO2FBQ0Y7U0FDRjtRQUVELHNEQUFzRDtRQUN0RCxHQUFHLENBQUMsSUFBSSxDQUNOLENBQUMsR0FBRyxPQUFPLENBQUM7YUFDVCxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFO1lBQ3hCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFBLG9DQUF5QixFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUN2RyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7Z0JBQUUsT0FBTyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUE7WUFDcEQsT0FBTyxpQkFBaUIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFDdEMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxPQUMzRSxHQUFHLENBQUE7UUFDTCxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ2QsQ0FBQTtRQUVELGlEQUFpRDtRQUNqRCxLQUFLLE1BQU0sU0FBUyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN0QyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO1NBQ2pEO1FBRUQseUJBQXlCO1FBQ3pCLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtLQUNuQztJQUVELE9BQU8sUUFBUSxDQUFBO0FBQ2pCLENBQUM7QUEzREQsb0RBMkRDIn0=