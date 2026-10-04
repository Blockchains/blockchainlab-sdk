// AUTO-GENERATED dataset registry.
import type * as T from './types.js';
export const DATASETS = {
 "bips": "Bitcoin Improvement Proposals index parsed from bitcoin/bips.",
 "bridges": "Cross-chain and canonical bridges ranked by TVL (DefiLlama bridge categories).",
 "chains": "EVM chain registry: chain IDs, native currency, public RPC endpoints and explorers.",
 "chains-tvl": "DeFi TVL by chain (USD). Snapshot from DefiLlama.",
 "dex-volumes": "DEX trading volume by protocol (top 300 by 24h). Snapshot from DefiLlama.",
 "eips": "EIPS index (number, title, status, type, category) parsed from ethereum/EIPs.",
 "ercs": "ERCS index (number, title, status, type, category) parsed from ethereum/ERCs.",
 "events": "Upcoming blockchain events from the Blockchain Lab feeds.",
 "fees": "Protocol fees by protocol (top 300 by 24h). Snapshot from DefiLlama.",
 "glossary": "Plain-language blockchain glossary from blockchainlab.com (concepts, protocol profiles, failure classes, stack layers).",
 "grants": "Directory of blockchain ecosystem grant / funding programmes with official links. Curated by Blockchain Lab; link status re-checked nightly. No amounts are listed \u2014 read each programme's own page.",
 "hackathons": "Open and upcoming blockchain hackathons (Devpost, ETHGlobal).",
 "l2-metrics": "Ethereum L2/L3 scaling projects: stage, category, stack, risk summary and Total Value Secured breakdown. From L2BEAT.",
 "protocols": "Top 500 DeFi protocols by TVL (USD), excluding CEXs. Snapshot from DefiLlama; not investment advice.",
 "rpc-health": "Health of popular free public RPC endpoints (EVM chains, Solana, Bitcoin): reachability, latency, block lag vs best endpoint, chain-ID check. Probed from a GitHub Actions runner (US) at build time.",
 "sanctioned-addresses": "Digital currency addresses on the US Treasury OFAC SDN list, per asset. Extracted daily from the official SDN XML by github.com/0xB10C. Compliance screening aid only \u2014 verify against the official list.",
 "security-incidents": "Public record of crypto hacks and exploits: date, protocol, technique, classification, amount lost/returned. From DefiLlama's hacks database.",
 "stablecoins": "Stablecoins by circulating supply with price, peg mechanism and 1d/7d/30d supply change. Snapshot from DefiLlama.",
 "whitepapers": "Blockchain Lab research corpus \u2014 whitepaper metadata (no paper text). Original sources linked.",
 "yields": "Top 500 DeFi yield pools by TVL (>= $10m) with APY, base/reward split, IL risk. Snapshot from DefiLlama; APYs change constantly and are not advice."
} as const;
export type DatasetName = keyof typeof DATASETS;
export interface DatasetMap {
  "bips": T.BipsDataset;
  "bridges": T.BridgesDataset;
  "chains": T.ChainsDataset;
  "chains-tvl": T.ChainsTvlDataset;
  "dex-volumes": T.DexVolumesDataset;
  "eips": T.EipsDataset;
  "ercs": T.ErcsDataset;
  "events": T.EventsDataset;
  "fees": T.FeesDataset;
  "glossary": T.GlossaryDataset;
  "grants": T.GrantsDataset;
  "hackathons": T.HackathonsDataset;
  "l2-metrics": T.L2MetricsDataset;
  "protocols": T.ProtocolsDataset;
  "rpc-health": T.RpcHealthDataset;
  "sanctioned-addresses": T.SanctionedAddressesDataset;
  "security-incidents": T.SecurityIncidentsDataset;
  "stablecoins": T.StablecoinsDataset;
  "whitepapers": T.WhitepapersDataset;
  "yields": T.YieldsDataset;
}
export const SCHEMA_VERSION = "1.1.0";
