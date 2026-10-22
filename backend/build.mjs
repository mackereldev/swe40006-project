import dotenv from "dotenv";
import esbuild from "esbuild";

dotenv.config();

await esbuild.build({
    entryPoints: ["src/index.ts"],
    platform: "node",
    bundle: true,
    minify: true,
    outfile: "dist/index.cjs",
    define: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
        "process.env.PROD_FRONTEND_ORIGIN": JSON.stringify(process.env.PROD_FRONTEND_ORIGIN || ""),
    },
});
