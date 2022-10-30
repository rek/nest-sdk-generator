export declare function findFileAbove(pattern: string | RegExp, dir: string): string | null;
/**
 * Find all files matching a pattern, recursively
 * @param pattern The pattern to look for
 * @param dir The root directory to start searching from
 * @param relative Get relative paths instead of absolute paths (default: true)
 * @returns A list of paths
 */
export declare function findFilesRecursive(pattern: string | RegExp, dir: string, relative?: boolean): string[];
