# blockchainlab-sdk

![blockchainlab-sdk](social-preview.png)

**Typed TypeScript + Python clients for the [Blockchain Lab Open Data API](https://blockchains.github.io/blockchainlab-api/)** — 20 free, versioned, nightly-rebuilt datasets: EVM chains & RPCs, DeFi TVL, stablecoins, yields, bridges, DEX volumes, protocol fees, L2BEAT L2 metrics, security incidents (hacks), OFAC-sanctioned addresses, public RPC health, EIPs/ERCs/BIPs, whitepapers, grants, hackathons.

> Built by **Blockchain Lab — [blockchainlab.com](https://blockchainlab.com/?utm_source=github&utm_medium=readme&utm_campaign=blockchainlab-sdk)**

Types are **generated from the API's JSON Schemas** (`scripts/gen.py`); CI regenerates them daily and fails if the API drifted, and the live test suite hits every dataset in production (no mocks).

## TypeScript / JavaScript (Node ≥ 18, browsers, Deno, Bun)

```bash
npm i github:Blockchains/blockchainlab-sdk
```

```ts
import { BlockchainLab } from "blockchainlab-sdk";
const bl = new BlockchainLab();
const usdc = await bl.stablecoin("USDC");               // StablecoinsRow | null
const base = await bl.l2("base");                       // stage, TVS breakdown, risks (L2BEAT)
const rpcs = await bl.healthyRpcs("ethereum");          // fastest healthy public RPCs
const hacks = await bl.incidents({ since: "2026-01-01", minUsd: 1e7 });
const flagged = await bl.isSanctioned("0x…");           // OFAC SDN list
const { data, generated_at } = await bl.dataset("dex-volumes"); // fully typed by name
```

## Python (3.9+, standard library only)

```bash
pip install "git+https://github.com/Blockchains/blockchainlab-sdk#subdirectory=python"
```

```python
from blockchainlab_sdk import BlockchainLab
bl = BlockchainLab()
print(bl.stablecoin("USDT")["circulating"])
for y in bl.top_yields(stablecoin_only=True, limit=5): print(y["project"], y["symbol"], y["apy"])
print(bl.l2("arbitrum")["stage"], bl.is_sanctioned("0x…"))
```

## Datasets

`bips` · `bridges` · `chains` · `chains-tvl` · `dex-volumes` · `eips` · `ercs` · `events` · `fees` · `glossary` · `grants` · `hackathons` · `l2-metrics` · `protocols` · `rpc-health` · `sanctioned-addresses` · `security-incidents` · `stablecoins` · `whitepapers` · `yields` — see the [catalogue](https://blockchains.github.io/blockchainlab-api/v1/index.json), [OpenAPI](https://blockchains.github.io/blockchainlab-api/openapi.yaml) and [changelog/versioning](https://github.com/Blockchains/blockchainlab-api/blob/main/CHANGELOG.md).

## Versioning & releases

SDK version tracks the API `schema_version` (1.1.x ↔ API schema 1.1). The client warns if the server's schema major differs. Pushing a `v*` tag builds the npm tarball and Python wheel and attaches them to a GitHub Release. Registry publishing (npm / PyPI) is a deliberate manual step: `cd ts && npm publish` / `python -m build python && twine upload dist/*`.

## Related

[Blockchain Lab hub](https://blockchains.github.io/) · [Tools (26)](https://blockchains.github.io/blockchainlab-tools/) · [MCP server](https://github.com/Blockchains/blockchainlab-mcp) · [Labs](https://github.com/Blockchains/blockchainlab-labs)

MIT. Data belongs to each named source — attribute the source and Blockchain Lab.

<!-- blocks:start -->
## Use as a building block

> **For AI agents and builders:** read [`AGENTS.md`](AGENTS.md) (setup, commands, structure, rules), [`llms.txt`](llms.txt) (doc map) and the machine-readable [`blocks.json`](blocks.json) ([schema](https://github.com/Blockchains/.github/blob/main/docs/BLOCKS-SCHEMA.md)). How all Blockchains blocks fit together: **[Build with Blocks](https://github.com/Blockchains/.github/blob/main/docs/BUILD-WITH-BLOCKS.md)** · org catalogue: [https://blockchains.github.io/blocks.json](https://blockchains.github.io/blocks.json).

**What it exports**

| Export | Type | Install / access |
|---|---|---|
| `blockchainlab-sdk` | npm | `npm i github:Blockchains/blockchainlab-sdk` |
| `blockchainlab_sdk` | pypi | `pip install "git+https://github.com/Blockchains/blockchainlab-sdk#subdirectory=python"` |

`blockchainlab-sdk` exports: `BlockchainLab`, `DATASETS`, `SCHEMA_VERSION`, `DEFAULT_BASE`, `DatasetName`, `DatasetMap`, `<Dataset>Row types`

`blockchainlab_sdk` exports: `BlockchainLab`

**Minimal example** (run on 2026-10-04 with Node 20 after `npm i github:Blockchains/blockchainlab-sdk`)

```ts
import { BlockchainLab } from "blockchainlab-sdk";
const bl = new BlockchainLab();                       // no API key
const usdc = await bl.stablecoin("USDC");             // StablecoinsRow | null
const [fastest] = await bl.healthyRpcs("ethereum");   // RpcHealthRow, sorted by latency
const base = await bl.chain(8453);                    // ChainsRow (RPCs, explorers, currency)
const flagged = await bl.isSanctioned("0x0000000000000000000000000000000000000000"); // false
console.log(usdc?.circulating, fastest?.url, base?.name, flagged);
```

**Inputs → outputs**

- In: `dataset name` (DatasetName) one of the 20 API datasets; `filters` (args) symbol, chainId, chain, since, minUsd, limit, address
- Out: `typed rows` (<Dataset>Row[]) from the API envelope's data array; `envelope` (Envelope<T>) dataset, schema_version, generated_at, source, count, data

**Composes with**

- [Blockchains/blockchainlab-api](https://github.com/Blockchains/blockchainlab-api): the data source; the SDK types are generated from its JSON Schemas (scripts/gen.py)
- [Blockchains/blockchainlab-mcp](https://github.com/Blockchains/blockchainlab-mcp): same data exposed as MCP tools for AI agents; use the SDK in app code, the MCP server in agent clients
- [Blockchains/forge-usd-priced-membership-nft](https://github.com/Blockchains/forge-usd-priced-membership-nft): pick a healthy RPC (healthyRpcs) and screen wallets (isSanctioned) in a dApp front end around the contracts
- [Blockchains/grokhack-forge](https://github.com/Blockchains/grokhack-forge): add SDK calls as Grok tools in a composed chat app (see Build with Blocks recipe 2)
- [Blockchains/blockchains.github.io](https://github.com/Blockchains/blockchains.github.io): the hub pages read the same API

**Versioning & stability:** `stable`. SDK version tracks the API `schema_version` (1.1.x ↔ schema 1.1); the client warns when the server's schema major differs. Releases are `v*` tags (npm tarball + wheel attached to the GitHub Release); not yet on the npm/PyPI registries, so install from GitHub and pin a tag or commit (`#v1.1.0`).
<!-- blocks:end -->

## Configuration

No API key. Client options:

| TypeScript (`new BlockchainLab({...})`) | Python (`BlockchainLab(...)`) | Default |
|---|---|---|
| `baseUrl` | `base_url` | `https://blockchains.github.io/blockchainlab-api` |
| `cacheTtlMs` | `cache_ttl` (seconds) | 10 min / 600 s |
| `timeoutMs` | `timeout` (seconds) | 20 s / 30 s |
| `fetch` | — | `globalThis.fetch` |

## Licence

MIT, see [LICENSE](LICENSE).

## Contributing

Issues and pull requests are welcome. Please read the [contributing guide](https://github.com/Blockchains/.github/blob/main/CONTRIBUTING.md), [code of conduct](https://github.com/Blockchains/.github/blob/main/CODE_OF_CONDUCT.md) and [security policy](https://github.com/Blockchains/.github/blob/main/SECURITY.md) first.

---
Built by Blockchain Lab — [blockchainlab.com](https://blockchainlab.com/?utm_source=github&utm_medium=readme&utm_campaign=blockchainlab-sdk)
