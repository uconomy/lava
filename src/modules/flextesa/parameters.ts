import { TezosProtocols } from "../tezos";
import { FlextesaAccounts, FlextesaTezosProtocol, FlextesaTezosProtocols } from "./types";

export const flextesaProtocols: FlextesaTezosProtocols = {
  [TezosProtocols.CARTHAGE]: { hash: "PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb", prefix: "006-PsCARTHA", kind: "Carthage" },
  [TezosProtocols.DELPHI]: { hash: "PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo", prefix: "007-PsDELPH1", kind: "Delphi" },
  [TezosProtocols.EDO]: { hash: "PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA", prefix: "008-PtEdoTez", kind: "Edo" },
  [TezosProtocols.FLORENCE]: { hash: "PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i", prefix: "009-PsFLoren", kind: "Florence"},
  [TezosProtocols.GRANADA]: { hash: "PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV", prefix: "010-PtGRANAD", kind: "Granada" },
  [TezosProtocols.HANGZHOU]: { hash: "PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx", prefix: "011-PtHangz2", kind: "Hangzhou" },
};

export const createProtocolParams = (tezosProtocol: TezosProtocols): string[] => {
  const protocol: FlextesaTezosProtocol = flextesaProtocols[tezosProtocol];

  // Configure Tezos node apps with the proper one for selected protocol version
  const params: string[] = [
    "tezos-baker",
    "tezos-endorser",
    "tezos-accuser"
  ].reduce((acc: string[], val: string) => {
    acc.push(`--${val}`, `${val}-${protocol.prefix}`);
    return acc;
  }, []);

  // Specify protocol version and hash
  params.push(
    "--protocol-hash", `${protocol.hash}`,
    "--protocol-kind", `${protocol.kind}`
  );

  return params;
};

// Commands to later add accounts in Flextesa Docker running container
// docker exec -it my-sandbox /bin/sh
// tezos-client --endpoint http://localhost:20000 import secret key alice unencrypted:edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq
// tezos-client --endpoint http://localhost:20000 list known addresses
// tezos-client --endpoint http://localhost:20000 transfer 1.00 from alice to alice
// tezos-client --endpoint http://localhost:20000 bake for alice
export const createAccountsParams = (accounts: FlextesaAccounts, amountTz = 100): string[] => {
  const balance: number = amountTz * Math.pow(10, 9); // XTZ in mutez
  const params: string[] = [];

  for (const name in accounts) {
    const account = accounts[name];

    params.push(...[
      "--add-bootstrap-account", `${name},${account.pk},${account.pkh},unencrypted:${account.sk}@${balance}`,
      "--no-daemons-for", name // DON'T USE THIS OPTION TOGETHER WITH --remove-default-bootstrap-accounts OTHERWISE TAQUITO GETS ANGRY BECAUSE OF EMPTY HEADER BLOCKS
    ]);
  };
  
  return params;
};
