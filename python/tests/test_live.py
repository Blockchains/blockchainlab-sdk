"""Live tests against the production API (no mocks)."""
import unittest
from blockchainlab_sdk import BlockchainLab, DATASETS, SCHEMA_VERSION

bl = BlockchainLab()

class Live(unittest.TestCase):
    def test_catalogue_in_sync(self):
        cat = bl.catalogue()
        self.assertEqual({d["dataset"] for d in cat["datasets"]}, set(DATASETS))
        self.assertEqual(cat["schema_version"].split(".")[0], SCHEMA_VERSION.split(".")[0])
    def test_every_dataset_nonempty(self):
        for n in DATASETS:
            d = bl.dataset(n); self.assertEqual(d["dataset"], n); self.assertGreater(len(d["data"]), 0, n)
    def test_helpers(self):
        self.assertIn("Base", bl.chain(8453)["name"])
        self.assertGreater(bl.stablecoin("USDC")["circulating"], 1e10)
        self.assertTrue(all(y["stablecoin"] for y in bl.top_yields(stablecoin_only=True, limit=5)))
        self.assertTrue(bl.l2("base")["stage"])
        eth = next(x for x in bl.rows("sanctioned-addresses") if x["chain"] == "ETH")
        self.assertTrue(bl.is_sanctioned(eth["address"])); self.assertFalse(bl.is_sanctioned("0x000000000000000000000000000000000000dEaD"))
        self.assertGreaterEqual(len(bl.healthy_rpcs("ethereum")), 1)
        self.assertGreater(len(bl.incidents(min_usd=1e8)), 10)
        self.assertEqual(bl.eip(4337)["number"], 4337)
    def test_unknown_dataset(self):
        with self.assertRaises(KeyError): bl.dataset("nope")

if __name__ == "__main__":
    unittest.main()
