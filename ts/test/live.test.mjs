// Live tests against the production API (no mocks). Run after `npm run build`.
import assert from "node:assert/strict";
import { BlockchainLab, DATASETS, SCHEMA_VERSION } from "../dist/index.js";
const bl = new BlockchainLab();
const cat = await bl.catalogue();
assert.deepEqual(new Set(cat.datasets.map(d => d.dataset)), new Set(Object.keys(DATASETS)), "SDK dataset list out of sync with API catalogue — run scripts/gen.py");
assert.equal(cat.schema_version.split(".")[0], SCHEMA_VERSION.split(".")[0]);
for (const name of Object.keys(DATASETS)) { const d = await bl.dataset(name); assert.equal(d.dataset, name); assert.ok(Array.isArray(d.data) && d.data.length > 0, name + " empty"); console.log(`  ✓ ${name.padEnd(22)} ${String(d.data.length).padStart(5)} rows  ${d.generated_at}`); }
assert.equal((await bl.chain(8453)).name.includes("Base"), true); console.log("  ✓ chain(8453) is Base");
const usdt = await bl.stablecoin("USDT"); assert.ok(usdt.circulating > 1e10); console.log("  ✓ stablecoin(USDT) circulating $" + (usdt.circulating / 1e9).toFixed(1) + "bn");
assert.ok((await bl.topYields({ stablecoinOnly: true, limit: 5 })).every(y => y.stablecoin)); console.log("  ✓ topYields(stablecoinOnly)");
assert.ok((await bl.l2("base"))?.stage); console.log("  ✓ l2('base') stage " + (await bl.l2("base")).stage);
const sanc = (await bl.rows("sanctioned-addresses")).find(x => x.chain === "ETH"); assert.equal(await bl.isSanctioned(sanc.address), true); assert.equal(await bl.isSanctioned("0x000000000000000000000000000000000000dEaD"), false); console.log("  ✓ isSanctioned");
assert.ok((await bl.healthyRpcs("ethereum")).length >= 1); console.log("  ✓ healthyRpcs(ethereum)");
assert.ok((await bl.incidents({ minUsd: 1e8 })).length > 10); console.log("  ✓ incidents(minUsd 100m)");
assert.equal((await bl.eip(4337))?.number, 4337); console.log("  ✓ eip(4337)");
console.log("ALL OK");
