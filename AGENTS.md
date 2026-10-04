# AGENTS.md: blockchainlab-sdk

Instructions for AI coding agents (Grok, Cursor, Claude Code, Codex, Copilot and others) working **in** this repo or **using it as a building block**. Humans: see [README.md](README.md).

## What this is

Typed TypeScript and Python clients for the Blockchain Lab Open Data API: 20 nightly-rebuilt blockchain datasets (chains, RPC health, DeFi TVL, stablecoins, yields, L2 metrics, hacks, OFAC addresses, EIPs/ERCs/BIPs, grants, hackathons).

- Kind: library · stability: `stable` · licence: MIT
- Machine-readable manifest: [`blocks.json`](blocks.json) (schema: [BLOCKS-SCHEMA](https://github.com/Blockchains/.github/blob/main/docs/BLOCKS-SCHEMA.md))
- How it fits with the other Blockchains repos: [Build with Blocks](https://github.com/Blockchains/.github/blob/main/docs/BUILD-WITH-BLOCKS.md)

## Setup

```bash
npm ci                      # TypeScript client (builds ts/dist via prepare)
pip install ./python          # Python client, stdlib only
```

## Build and test

```bash
npm test                                  # tsc + live test against every dataset
cd python && python -m unittest -v tests/test_live.py
python3 scripts/gen.py && git diff --exit-code   # types must match the live JSON Schemas
```

Tests hit **live** public networks/APIs (the org rule is no mocks). A failure can be an upstream outage: re-run before changing code.

## Structure

| Path | What |
|---|---|
| `ts/src/index.ts` | `BlockchainLab` client (fetch, cache, timeouts) and convenience helpers |
| `ts/src/types.ts` | generated row/envelope types, do not hand-edit |
| `ts/src/datasets.ts` | generated dataset map + `SCHEMA_VERSION` |
| `ts/test/live.test.mjs` | live tests |
| `python/blockchainlab_sdk/` | Python client (`__init__.py`), generated `types.py`, `datasets.py` |
| `scripts/gen.py` | regenerates TS + Python types from the API's JSON Schemas |
| `.github/workflows/ci.yml` | Node 18/20/22 + Python 3.9/3.11/3.13 matrix, types-in-sync, install-from-GitHub check |

## Conventions

- Generated files (`ts/src/types.ts`, `ts/src/datasets.ts`, `python/blockchainlab_sdk/types.py`, `datasets.py`) come from `scripts/gen.py`; change the generator, not the output.
- Keep TS and Python helpers in parity (camelCase in TS, snake_case in Python).
- Zero runtime dependencies: TS uses global `fetch`, Python uses `urllib`.

## Extension points

- New helper: add a method to `BlockchainLab` in `ts/src/index.ts` and the matching snake_case one in `python/blockchainlab_sdk/__init__.py`, plus a live test.
- New dataset: add it to blockchainlab-api first, then run `python3 scripts/gen.py`.
- Self-hosted data: pass `baseUrl` / `base_url` pointing at a copy of the API.

## Do

- Pin a tag or commit when depending on it from another repo.
- Use `bl.dataset(name)` for anything without a helper; it is fully typed by name.

## Don't

- Hand-edit generated type files.
- Add runtime dependencies.
- Invent data, mock network responses in shipped code, or hard-code values that should come from the live source; every repo here is 'no mocks, real data'.
- Commit secrets, keys or `.env` files. Run `gitleaks` before pushing; CI and the org policy reject leaks.

## Using it from another project

- **blockchainlab-sdk** (npm): `npm i github:Blockchains/blockchainlab-sdk`
- **blockchainlab_sdk** (pypi): `pip install "git+https://github.com/Blockchains/blockchainlab-sdk#subdirectory=python"`

See the README section [Use as a building block](README.md#use-as-a-building-block) for a copy-paste example.

## Related blocks

- [Blockchains/blockchainlab-api](https://github.com/Blockchains/blockchainlab-api): the data source; the SDK types are generated from its JSON Schemas (scripts/gen.py)
- [Blockchains/blockchainlab-mcp](https://github.com/Blockchains/blockchainlab-mcp): same data exposed as MCP tools for AI agents; use the SDK in app code, the MCP server in agent clients
- [Blockchains/forge-usd-priced-membership-nft](https://github.com/Blockchains/forge-usd-priced-membership-nft): pick a healthy RPC (healthyRpcs) and screen wallets (isSanctioned) in a dApp front end around the contracts
- [Blockchains/grokhack-forge](https://github.com/Blockchains/grokhack-forge): add SDK calls as Grok tools in a composed chat app (see Build with Blocks recipe 2)
- [Blockchains/blockchains.github.io](https://github.com/Blockchains/blockchains.github.io): the hub pages read the same API
