"use strict";
/**
 * @file Types extractor to use in the generated SDK
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenSdkResolvedTypes = exports.locateTypesFile = exports.TypesExtractor = exports.MODULE_EXTENSIONS = void 0;
const path = require("path");
const ts_morph_1 = require("ts-morph");
const logging_1 = require("../logging");
const classdeps_1 = require("./classdeps");
const typedeps_1 = require("./typedeps");
/** Valid extensions for TypeScript module files */
exports.MODULE_EXTENSIONS = ['.ts', '.d.ts', '.tsx', '.d.tsx', '.js', '.jsx'];
/**
 * Types extractor
 */
class TypesExtractor {
    constructor(
    /** TS-Morph project */
    project, 
    /** Absolute source path */
    absoluteSrcPath, 
    /** Magic types to replace non-portable types */
    magicTypes, 
    /** Extracted types */
    extracted = new Map()) {
        this.project = project;
        this.absoluteSrcPath = absoluteSrcPath;
        this.magicTypes = magicTypes;
        this.extracted = extracted;
    }
    /**
     * Check if a type has already been extracted
     */
    hasExtractedType(loc) {
        const files = this.extracted.get(loc.relativePath);
        return files ? files.has(loc.typename) : false;
    }
    /**
     * Get a type that was previously extracted
     */
    getExtractedType(loc) {
        var _a, _b;
        return (_b = (_a = this.extracted.get(loc.relativePath)) === null || _a === void 0 ? void 0 : _a.get(loc.typename)) !== null && _b !== void 0 ? _b : null;
    }
    /**
     * Find the extension of a TypeScript module
     * @param loc
     * @returns
     */
    guessExtractedTypeModuleFileExt(loc) {
        for (const ext of exports.MODULE_EXTENSIONS) {
            if (this.extracted.has(loc.relativePathNoExt + ext)) {
                return loc.relativePathNoExt + ext;
            }
        }
        return null;
    }
    /**
     * Find if a type has previously been extracted, without providing its extension
     * @param loc
     * @returns
     */
    findExtractedTypeWithoutExt(loc) {
        var _a;
        for (const ext of exports.MODULE_EXTENSIONS) {
            const typ = (_a = this.extracted.get(loc.relativePathNoExt + ext)) === null || _a === void 0 ? void 0 : _a.get(loc.typename);
            if (typ) {
                return typ;
            }
        }
        return null;
    }
    /**
     * Memorize an extracted type so it can be reused later on
     * @param loc
     * @param extracted
     */
    memorizeExtractedType(loc, extracted) {
        let files = this.extracted.get(loc.relativePath);
        if (!files) {
            files = new Map();
            this.extracted.set(loc.relativePath, files);
        }
        if (!files.has(loc.typename)) {
            files.set(loc.typename, extracted);
        }
    }
    /**
     * Find the relative file location of a type
     * @param loc
     * @returns
     */
    findTypeRelativeFilePath(loc) {
        if (path.isAbsolute(loc.relativePathNoExt)) {
            (0, logging_1.unreachable)('Internal error: got absolute file path in types extractor, when expecting a relative one (got {magentaBright})', loc.relativePathNoExt);
        }
        const absolutePathNoExt = path.resolve(this.absoluteSrcPath, loc.relativePathNoExt);
        const cached = this.findExtractedTypeWithoutExt(loc);
        if (cached) {
            return cached.relativePath;
        }
        let relativeFilePath = null;
        for (const ext of exports.MODULE_EXTENSIONS) {
            try {
                this.project.getSourceFileOrThrow(absolutePathNoExt + ext);
                relativeFilePath = loc.relativePathNoExt + ext;
            }
            catch (e) {
                continue;
            }
        }
        return (relativeFilePath !== null && relativeFilePath !== void 0 ? relativeFilePath : new Error((0, logging_1.format)('File {magenta} was not found (was expected to contain dependency type {yellow})', loc.relativePathNoExt, loc.typename)));
    }
    /**
     * Extract a type
     * @param loc
     * @param typesPath
     * @returns
     */
    extractType(loc, typesPath = []) {
        var _a, _b;
        if (path.isAbsolute(loc.relativePathNoExt)) {
            (0, logging_1.unreachable)('Internal error: got absolute file path in types extractor, when expecting a relative one (got {magentaBright})', loc.relativePathNoExt);
        }
        // Get the absolute path of the type's parent file
        // We don't know its extension yet as imported file names in import statements don't have an extension
        const absolutePathNoExt = path.resolve(this.absoluteSrcPath, loc.relativePathNoExt);
        // If the type is already in cache, return it directly
        const cached = this.findExtractedTypeWithoutExt(loc);
        if (cached) {
            return cached;
        }
        // Try to find the path with extension of the file and get it as a TS-Morph file
        let fileAndPath = null;
        for (const ext of exports.MODULE_EXTENSIONS) {
            try {
                fileAndPath = [this.project.getSourceFileOrThrow(absolutePathNoExt + ext), loc.relativePathNoExt + ext];
            }
            catch (e) {
                continue;
            }
        }
        if (!fileAndPath) {
            return new Error((0, logging_1.format)('File {magenta} was not found (was expected to contain dependency type {yellow})', loc.relativePathNoExt, loc.typename));
        }
        const [file, relativeFilePath] = fileAndPath;
        // Use magic types to replace non-portable types
        for (const magicType of this.magicTypes) {
            if (relativeFilePath.endsWith(`node_modules/${magicType.nodeModuleFilePath}`) && loc.typename === magicType.typeName) {
                (0, logging_1.debug)('-> '.repeat(typesPath.length + 1) +
                    'Found magic type {yellow} from external module file {magentaBright}, using provided placeholder.', loc.typename, relativeFilePath);
                const extracted = {
                    content: '/** @file Magic placeholder from configuration file */\n\n' + magicType.placeholderContent,
                    relativePath: relativeFilePath,
                    relativePathNoExt: loc.relativePathNoExt,
                    typename: loc.typename,
                    typeParams: [],
                    dependencies: [],
                };
                typesPath.pop();
                let types = this.extracted.get(relativeFilePath);
                if (!types) {
                    types = new Map();
                    this.extracted.set(relativeFilePath, types);
                }
                types.set(loc.typename, extracted);
                return extracted;
            }
        }
        (0, logging_1.debug)('-> '.repeat(typesPath.length + 1) + 'Extracting type {yellow} from file {magentaBright}...', loc.typename, relativeFilePath);
        // Analyze the type's declaration
        const decl = file.forEachChildAsArray().find((node) => {
            return ((ts_morph_1.Node.isEnumDeclaration(node) ||
                ts_morph_1.Node.isTypeAliasDeclaration(node) ||
                ts_morph_1.Node.isInterfaceDeclaration(node) ||
                ts_morph_1.Node.isClassDeclaration(node) ||
                ts_morph_1.Node.isFunctionDeclaration(node)) &&
                node.getName() === loc.typename);
        });
        if (!decl) {
            return new Error((0, logging_1.format)(`Type {yellow} was not found in file {magenta}`, loc.typename, relativeFilePath));
        }
        // Handle a limitation of the tool: you can't import two types from two files at the same path with just two different extensions
        // Example: importing a type named "User" from two files in the same directory called "user.entity.ts" and "user.entity.js"
        const typ = this.findExtractedTypeWithoutExt(loc);
        if (typ && typ.relativePath !== relativeFilePath) {
            (0, logging_1.panic)('Found two conflicting files at same path but with different extensions:\n> {magentaBright}\n> {magentaBright}', typ.relativePath, relativeFilePath);
        }
        /** Resolved type's dependencies */
        let resolvedDeps;
        /** Type's parameters (e.g. <T>) */
        let typeParams;
        /** Type declaration */
        let extractedDecl = decl.getText();
        // Handle enumerations
        if (ts_morph_1.Node.isEnumDeclaration(decl)) {
            resolvedDeps = [];
            typeParams = [];
        }
        // Handle type aliases
        else if (ts_morph_1.Node.isTypeAliasDeclaration(decl)) {
            resolvedDeps = [(0, typedeps_1.resolveTypeDependencies)(decl.getType(), relativeFilePath, this.absoluteSrcPath)];
            typeParams = [];
        }
        // Handle interfaces
        else if (ts_morph_1.Node.isInterfaceDeclaration(decl)) {
            resolvedDeps = (0, classdeps_1.analyzeClassDeps)(decl, relativeFilePath, this.absoluteSrcPath);
            typeParams = decl.getTypeParameters().map((tp) => tp.getText());
        }
        // Handle classes
        // Methods are not handled because they shouldn't be used as DTOs and won't be decodable from JSON in all cases
        // This part is tricky as we remake the class from scratch using the informations we have on it, given we have to get rid
        //  of methods as well as removing decorators
        else if (ts_morph_1.Node.isClassDeclaration(decl)) {
            const classHead = decl.getText().match(/\b(export[^{]+class[^{]+{)/);
            if (!classHead) {
                (0, logging_1.unreachable)('Internal error: failed to match class head in declaration: {yellow}', decl.getText());
            }
            extractedDecl = classHead[1];
            const index = (_a = decl.getType().getStringIndexType()) !== null && _a !== void 0 ? _a : decl.getType().getNumberIndexType();
            if (index) {
                extractedDecl += '\npublic [input: string | number]: ' + (0, typedeps_1.getImportResolvedType)(index);
            }
            // Export all members
            for (const member of decl.getMembers()) {
                if (!ts_morph_1.Node.isPropertyDeclaration(member)) {
                    (0, logging_1.warn)('Found non-property member in class {cyan}: {magenta}', (_b = decl.getName()) !== null && _b !== void 0 ? _b : '<anonymous>', member.getText());
                    continue;
                }
                const memberType = member.getType();
                extractedDecl += `\npublic ${member.getName()}${member.getText().includes('?') ? '?' : member.getText().includes('!:') ? '!' : ''}: ${(0, typedeps_1.getImportResolvedType)(memberType)};`;
            }
            extractedDecl += '\n}';
            resolvedDeps = (0, classdeps_1.analyzeClassDeps)(decl, relativeFilePath, this.absoluteSrcPath);
            typeParams = decl.getTypeParameters().map((tp) => tp.getText());
        }
        // Handle functions
        else if (ts_morph_1.Node.isFunctionDeclaration(decl)) {
            resolvedDeps = [];
            typeParams = [];
        }
        // Handle unknown types
        else {
            (0, logging_1.panic)('Unknown node type when extracting types: ' + decl.getKindName());
        }
        /** Normalized dependencies */
        const dependencies = [];
        // Ensure we're not stuck in an infinite loop where we analyze a type A, then its dependency B, which itself depends on A, and so on
        if (typesPath.includes(loc.typename)) {
            (0, logging_1.unreachable)(`Internal error: infinite loop detected in types extracted: {yellow}`, typesPath.join(' -> '));
        }
        typesPath.push(loc.typename);
        // Analyze all dependencies
        for (const dependencyLoc of locateTypesFile(resolvedDeps)) {
            // If the "dependency" is one of the type's parameters (e.g. "T"), ignore this part
            if (typeParams.includes(dependencyLoc.typename)) {
                continue;
            }
            // Find the dependency's relative path
            let relativePath;
            const cached = this.findExtractedTypeWithoutExt(dependencyLoc);
            if (cached) {
                relativePath = cached.relativePath;
            }
            else if (typesPath.includes(dependencyLoc.typename)) {
                relativePath = this.findTypeRelativeFilePath(dependencyLoc);
            }
            else {
                const extracted = this.extractType(dependencyLoc, typesPath);
                relativePath = extracted instanceof Error ? extracted : extracted.relativePath;
            }
            if (relativePath instanceof Error) {
                return new Error((0, logging_1.format)('├─ Failed to extract type {yellow} due to an error in dependency type {yellow}\nfrom file {magenta} :\n{}', loc.typename, dependencyLoc.typename, relativeFilePath, relativePath.message.replace(/^/gm, '  ')));
            }
            // Update dependencies
            dependencies.push(Object.assign(Object.assign({}, dependencyLoc), { relativePath }));
        }
        const extracted = Object.assign(Object.assign({}, loc), { relativePath: relativeFilePath, typeParams, content: extractedDecl, dependencies });
        typesPath.pop();
        let types = this.extracted.get(relativeFilePath);
        if (!types) {
            types = new Map();
            this.extracted.set(relativeFilePath, types);
        }
        // Save the dependency
        types.set(loc.typename, extracted);
        return extracted;
    }
}
exports.TypesExtractor = TypesExtractor;
/**
 * Locate the files containing a list of a resolved types
 * @param resolvedTypes
 * @returns
 */
function locateTypesFile(resolvedTypes) {
    const out = new Array();
    for (const resolved of resolvedTypes) {
        for (const [file, types] of resolved.dependencies) {
            for (const typename of types) {
                if (!out.find((loc) => loc.typename === typename && loc.relativePathNoExt === file)) {
                    out.push({ typename, relativePathNoExt: file });
                }
            }
        }
        for (const typename of resolved.localTypes) {
            if (!out.find((loc) => loc.typename === typename && loc.relativePathNoExt === resolved.relativeFilePath)) {
                out.push({ typename, relativePathNoExt: resolved.relativeFilePath });
            }
        }
    }
    return out;
}
exports.locateTypesFile = locateTypesFile;
/**
 * Flatten a tree of resolved type dependencies
 * @param sdkModules
 * @returns
 */
function flattenSdkResolvedTypes(sdkModules) {
    const flattened = new Array();
    for (const module of sdkModules.values()) {
        for (const controller of module.values()) {
            for (const method of controller.methods.values()) {
                const { parameters: args, query, body } = method.params;
                flattened.push(method.returnType);
                if (args) {
                    flattened.push(...args.values());
                }
                if (query) {
                    flattened.push(...query.values());
                }
                if (!body) {
                    continue;
                }
                if (body.full) {
                    flattened.push(body.type);
                }
                else {
                    flattened.push(...body.fields.values());
                }
            }
        }
    }
    return flattened;
}
exports.flattenSdkResolvedTypes = flattenSdkResolvedTypes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FuYWx5emVyL2V4dHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILDZCQUE0QjtBQUM1Qix1Q0FBb0Q7QUFFcEQsd0NBQW9FO0FBQ3BFLDJDQUE4QztBQUU5Qyx5Q0FBNkY7QUFFN0YsbURBQW1EO0FBQ3RDLFFBQUEsaUJBQWlCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBa0NsRjs7R0FFRztBQUNILE1BQWEsY0FBYztJQUN6QjtJQUNFLHVCQUF1QjtJQUNQLE9BQWdCO0lBRWhDLDJCQUEyQjtJQUNYLGVBQXVCO0lBRXZDLGdEQUFnRDtJQUNoQyxVQUE0QjtJQUU1QyxzQkFBc0I7SUFDTixZQUFtQyxJQUFJLEdBQUcsRUFBRTtRQVQ1QyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBR2hCLG9CQUFlLEdBQWYsZUFBZSxDQUFRO1FBR3ZCLGVBQVUsR0FBVixVQUFVLENBQWtCO1FBRzVCLGNBQVMsR0FBVCxTQUFTLENBQW1DO0lBQzNELENBQUM7SUFFSjs7T0FFRztJQUNILGdCQUFnQixDQUFDLEdBQXdCO1FBQ3ZDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUNsRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTtJQUNoRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxnQkFBZ0IsQ0FBQyxHQUF3Qjs7UUFDdkMsT0FBTyxNQUFBLE1BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQywwQ0FBRSxHQUFH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