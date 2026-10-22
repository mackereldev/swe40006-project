import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/**/*.test.ts"],
        fileParallelism: false,
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            exclude: [
                "src/index.ts",
                "src/prisma/**",
            ],
            reporter: ["text", "html", "json-summary"],
            thresholds: {
                lines: 95,
                statements: 95,
                functions: 95,
                branches: 95,
            },
        },
    },
});
