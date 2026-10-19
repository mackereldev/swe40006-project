import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defaultAllowedOrigins, defineConfig } from "vite";

export default defineConfig({
    plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] }),
    ],
    server: {
        cors: {
            origin: [
                defaultAllowedOrigins,
                process.env["VITE_API_URL"]!,
            ],
        },
    },
});
