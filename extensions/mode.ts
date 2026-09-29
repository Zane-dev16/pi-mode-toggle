/**
 * Mode Toggle Extension
 *
 * Pin any skill as a togglable mode (Cursor-style Custom Modes).
 * The pinned skill's SKILL.md is appended to the system prompt on every
 * turn until unpinned — all mid-session, no restart, no /reload.
 *
 * Usage:
 * 1. Install: pi install git:github.com/Zane-dev16/pi-mode-toggle
 * 2. /mode pstack-lib  - pin a skill as the current mode
 * 3. /mode             - show current mode
 * 4. /mode off         - unpin, back to normal
 *
 * Skills resolve from (first hit wins):
 * - <cwd>/.pi/skills/<name>/SKILL.md
 * - <cwd>/.agents/skills/<name>/SKILL.md
 * - ~/.pi/agent/skills/<name>/SKILL.md
 * - ~/.agents/skills/<name>/SKILL.md
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

let mode: string | null = null;
let cachedBody: string | null = null;

function findSkill(cwd: string, name: string): string | null {
	const bases = [
		join(cwd, ".pi", "skills"),
		join(cwd, ".agents", "skills"),
		join(homedir(), ".pi", "agent", "skills"),
		join(homedir(), ".agents", "skills"),
	];
	for (const base of bases) {
		const dirSkill = join(base, name, "SKILL.md");
		if (existsSync(dirSkill)) return dirSkill;
		const fileSkill = join(base, `${name}.md`);
		if (existsSync(fileSkill)) return fileSkill;
	}
	return null;
}

export default function modeToggleExtension(pi: ExtensionAPI) {
	pi.registerCommand("mode", {
		description: "Pin a skill as mode: /mode <name>, /mode off, /mode (status)",
		handler: async (args, ctx) => {
			const name = (args || "").trim();
			if (!name) {
				ctx.ui.notify(mode ? `mode: ${mode}` : "mode off", "info");
				return;
			}
			if (name === "off") {
				mode = null;
				cachedBody = null;
				ctx.ui.notify("mode off", "info");
				return;
			}
			const cwd = ctx.cwd ?? process.cwd();
			const path = findSkill(cwd, name);
			if (!path) {
				ctx.ui.notify(`skill not found: ${name}`, "error");
				return;
			}
			mode = name;
			cachedBody = readFileSync(path, "utf8");
			ctx.ui.notify(`mode: ${name}`, "info");
		},
	});

	pi.on("before_agent_start", async (event) => {
		if (!mode || !cachedBody) return undefined;
		return {
			systemPrompt: `${event.systemPrompt}\n\n# MODE: ${mode}\n${cachedBody}`,
		};
	});
}
