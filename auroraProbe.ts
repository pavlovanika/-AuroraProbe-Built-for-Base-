import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  formatEther,
  parseAbi,
} from "viem";
import { base, baseSepolia } from "viem/chains";

type NetworkKey = "base" | "baseSepolia";

const CHAIN_ID: Record<NetworkKey, number> = { base: 8453, baseSepolia: 84532 };

const RPC: Record<NetworkKey, string> = {
  base: (import.meta as any).env?.VITE_BASE_RPC_URL || "https://mainnet.base.org",
  baseSepolia:
    (import.meta as any).env?.VITE_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
};

const EXPLORER: Record<NetworkKey, string> = {
  base: "https://basescan.org",
  baseSepolia: "https://sepolia.basescan.org",
};

const ERC20_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
]);

function $(id: string) {
  const n = document.getElementById(id);
  if (!n) throw new Error(`Missing element #${id}`);
  return n;
}

function log(line: string) {
  const out = $("out");
  out.textContent = `${out.textContent || ""}${line}\n`;
}

function setStatus(text: string) {
  $("status").textContent = text;
}

function isAddress(v: string): v is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(v.trim());
}

function asAddress(v: string): `0x${string}` {
  const t = v.trim();
  if (!isAddress(t)) throw new Error("Invalid EVM address");
  return t;
}

function netKey(v: string): NetworkKey {
  return v === "base" ? "base" : "baseSepolia";
}

export async function runAuroraProbe() {
  $("out").textContent = "";

  const net = netKey(($("network") as HTMLSelectElement).value);
  const chain = net === "base" ? base : baseSepolia;
  const rpcUrl = RPC[net];
  const explorer = EXPLORER[net];
  const expectedChainId = CHAIN_ID[net];

  const appName = "AuroraProbe (Built for Base)";
  const appLogoUrl = "https://base.org/favicon.ico";

  setStatus("Initializing Coinbase Wallet SDK…");

  const sdk = new CoinbaseWalletSDK({ appName, appLogoUrl });
  const provider = sdk.makeWeb3Provider(rpcUrl, expectedChainId);

  const walletClient = createWalletClient({
    chain,
    transport: custom(provider as any),
  });

  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  log(`Built for Base — target=${chain.name} chainId=${expectedChainId}`);
  log(`Explorer: ${explorer}`);
  log(`RPC: ${rpcUrl}`);

  setStatus("Requesting wallet connection…");
  const addresses = (await walletClient.requestAddresses()) as `0x${string}`[];
  const user = addresses?.[0];
  if (!user) throw new Error("No address returned from wallet");

  log(`Connected address: ${user}`);
  log(`Basescan address: ${explorer}/address/${user}`);

  setStatus("Reading onchain state…");
  const [rpcChainId, blockNumber, balanceWei] = await Promise.all([
    publicClient.getChainId(),
    publicClient.getBlockNumber(),
    publicClient.getBalance({ address: user }),
  ]);

  log(`RPC chainId: ${rpcChainId}`);
  log(`Latest block: ${blockNumber}`);
  log(`Native balance: ${formatEther(balanceWei)} ETH`);

  if (rpcChainId !== expectedChainId) {
    log(
      `Warning: expected chainId ${expectedChainId}, but RPC returned ${rpcChainId}.`
    );
  }

  const contractRaw = ($("contract") as HTMLInputElement).value.trim();
  if (contractRaw) {
    const ca = asAddress(contractRaw);
    log(`Contract address: ${ca}`);
    log(`Basescan contract: ${explorer}/address/${ca}`);
    log(`Basescan verification: ${explorer}/address/${ca}#code`);
  }

  const tokenRaw = ($("token") as HTMLInputElement).value.trim();
  if (tokenRaw) {
    const token = asAddress(tokenRaw);

    setStatus("Reading ERC-20 metadata & balance…");
    const [name, symbol, decimals, bal] = await Promise.all([
      publicClient.readContract({ address: token, abi: ERC20_ABI, functionName: "name" }),
      publicClient.readContract({ address: token, abi: ERC20_ABI, functionName: "symbol" }),
      publicClient.readContract({
        address: token,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
      publicClient.readContract({
        address: token,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [user],
      }),
    ]);

    const d = BigInt(decimals as number);
    const denom = 10n ** d;
    const whole = (bal as bigint) / denom;
    const frac = (bal as bigint) % denom;

    log(`Token: ${token}`);
    log(`Token Basescan: ${explorer}/address/${token}`);
    log(`Token name: ${name}`);
    log(`Token symbol: ${symbol}`);
    log(`Token decimals: ${decimals}`);
    log(`Token balance (approx): ${whole}.${frac.toString().padStart(Number(d), "0")}`);
  }

  setStatus("Done.");
}

if (typeof window !== "undefined") {
  (window as any).runAuroraProbe = runAuroraProbe;

  window.addEventListener("DOMContentLoaded", () => {
    const runBtn = document.getElementById("run");
    if (runBtn) {
      runBtn.addEventListener("click", async () => {
        try {
          await runAuroraProbe();
        } catch (e: any) {
          setStatus("Error");
          log(`Error: ${e?.message || String(e)}`);
          console.error(e);
        }
      });
    }
  });
}
