# pi-mode-toggle

Togglable skill modes for [pi](https://pi.dev) — Cursor-style Custom Modes.
Pin any skill so it stays in context every turn, unpin to go back to normal.
All mid-session, no restart.

## Install

```bash
pi install git:github.com/Zane-dev16/pi-mode-toggle
```

Or try it once without installing:

```bash
pi -e git:github.com/Zane-dev16/pi-mode-toggle
```

## Usage

```
/mode pstack-lib   # pin a skill as the current mode
/mode              # show current mode
/mode off          # unpin, back to normal
```

Skills resolve from (first hit wins):

- `<cwd>/.pi/skills/<name>/SKILL.md`
- `<cwd>/.agents/skills/<name>/SKILL.md`
- `~/.pi/agent/skills/<name>/SKILL.md`
- `~/.agents/skills/<name>/SKILL.md`

## How it differs

- `/skill:name` loads a skill for one task only.
- `.pi/APPEND_SYSTEM.md` pins instructions force-always per project.
- `/mode <name>` pins a skill until `/mode off` — a real toggle.

## License

MIT
