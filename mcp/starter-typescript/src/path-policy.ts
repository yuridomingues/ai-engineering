import path from "node:path";

const ALLOWED_EXTENSIONS = new Set([
  ".md", ".txt", ".json", ".jsonc", ".yaml", ".yml", ".toml",
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".go", ".rs", ".java", ".cs", ".sql",
  ".css", ".scss", ".html", ".svelte", ".vue"
]);

const DENIED_SEGMENTS = new Set([
  ".git",
  "node_modules",
  ".ssh"
]);

export function resolveReadableProjectFile(root: string, requestedPath: string): string {
  if (!requestedPath || requestedPath.trim().length === 0) {
    throw new Error("path is required");
  }

  if (path.isAbsolute(requestedPath)) {
    throw new Error("absolute paths are not allowed");
  }

  const rootPath = path.resolve(root);
  const candidate = path.resolve(rootPath, requestedPath);
  const relative = path.relative(rootPath, candidate);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("path escapes the configured project root");
  }

  const segments = relative.split(path.sep).filter(Boolean);
  if (segments.some((segment) => DENIED_SEGMENTS.has(segment))) {
    throw new Error("path contains a denied directory");
  }

  const base = path.basename(candidate);
  if (base === ".env" || base.startsWith(".env.")) {
    throw new Error("environment files are not readable");
  }

  if (/\.(pem|key|p12|pfx)$/i.test(base)) {
    throw new Error("key or certificate material is not readable");
  }

  const extension = path.extname(candidate).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error("file type is not in the text allowlist");
  }

  return candidate;
}
