// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import solidJs from "@astrojs/solid-js";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	output: "server",

	adapter: node({
		mode: "standalone",
	}),

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [solidJs()],
});
