# ml0x

> Your engineering multiplier. One developer. 100-person output.

**[ml0x.com](https://ml0x.com/)** — Open-source agentic engineering pipeline built on Karpathy's context engineering, Claude Code, NASA-grade quality gates, and cost-optimized model routing.

## What This Is

A copy-paste ready framework that turns a solo developer into a 100-person team using autonomous AI agents. Every script production-tested. Every claim sourced from 150+ references.

## Key Multipliers

| Multiplier | Impact | Source |
|---|---|---|
| Harness engineering | 6-10x on same model | Hashline: 6.7% → 68.3% |
| Model routing | 48-85% cost savings | RouteLLM (ICLR 2025) |
| Prompt caching | 90% input savings | Anthropic cache pricing |
| Loop budgets | $0 runaway costs | Prevents $47K incidents |
| Quality gates | 7-stage fail-fast | NASA Power of 10 |
| Multi-agent | Parallel execution | Separate write/review |
| Memory system | Compounding knowledge | Karpathy's LLM Wiki |

## Quick Start

```bash
git clone https://github.com/theluckystrike/100xagenticdev.git
cd 100xagenticdev
cp CLAUDE.md ~/your-project/
bash config/mcp-setup.sh
bash scripts/pipeline.sh "Your task here"
```

## Pipeline Architecture

```
ORCHESTRATOR    Shell scripts · Cron · GitHub Actions
─────────────────────────────────────────────────────
AGENT LAYER     PLAN (Opus) · CODE (Sonnet) · REVIEW (Opus) · TEST (Haiku)
─────────────────────────────────────────────────────
MCP SERVERS     Memory · GitHub · Search · Browser · Context7
─────────────────────────────────────────────────────
QUALITY GATES   Prettier → ESLint → tsc → Vitest → Semgrep → Gitleaks
─────────────────────────────────────────────────────
COST CONTROL    Model routing · Prompt caching · Token budgets
─────────────────────────────────────────────────────
MEMORY          Conversations → Daily Logs → Wiki → Next Session
```

## Source Repository

All pipeline code, configs, scripts, and research: **[theluckystrike/100xagenticdev](https://github.com/theluckystrike/100xagenticdev)**

## License

MIT
