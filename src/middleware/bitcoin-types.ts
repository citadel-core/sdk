export type BitcoinNetwork = "main" | "test" | "regtest";
export type scriptPubkeyType = string;
export type Block = {
  hash: string;
  confirmations: number;
  strippedsize: number;
  size: number;
  weight: number;
  height: number;
  version: number;
  verxionHex: string;
  merkleroot: string;
  tx: Transaction[] | string;
  hex: string;
  time: number;
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  previousblockhash: string;
  nextblockchash?: string;
};
export type ChainInfo = {
  chain: string;
  blocks: number;
  headers: number;
  bestblockchash: number;
  difficulty: number;
  mediantime: number;
  verificationprogress: number;
  initialblockdownload: boolean;
  chainwork: string;
  size_on_disk: number;
  pruned: boolean;
  pruneheight: number;
  automatic_pruning: boolean;
  prune_target_size: number;
  softforks: {
    id: string;
    version: number;
    reject: {
      status: boolean;
    };
  }[];
  bip9_softforks: {
    [key: string]: {
      status: "defined" | "started" | "locked_in" | "active" | "failed";
    };
  }[];
  warnings?: string;
};
export type DecodedRawTransaction = {
  txid: string;
  hash: string;
  size: number;
  vsize: number;
  version: number;
  locktime: number;
  vin: TxIn | TxIn[];
  vout: TxOut | TxOut[];
};
export interface FetchedRawTransaction extends DecodedRawTransaction {
  hex: string;
  blockhash: string;
  confirmations: number;
  time: number;
  blocktime: number;
}
export type MempoolInfo = {
  size: number;
  bytes: number;
  usage: number;
  maxmempol: number;
  mempoolminfee: number;
  minrelaytxfee: number;
};
export type MiningInfo = {
  blocks: number;
  currentblockweight: number;
  currentblocktx: number;
  difficulty: number;
  networkhashps: number;
  pooledtx: number;
  chain: BitcoinNetwork;
  warnings?: string;
};
export type NetworkInfo = {
  version: number;
  subversion: string;
  protocolversion: number;
  localservices: string;
  localrelay: boolean;
  timeoffset: number;
  connections: number;
  networkactive: boolean;
  networks: {
    name: string;
    limited: boolean;
    reachable: boolean;
    proxy: string;
    proxy_randomize_credentials: boolean;
  }[];
  relayfee: number;
  incrementalfee: number;
  localaddresses: {
    address: string;
    port: number;
    score: number;
  }[];
  warnings?: string;
};
export type PeerInfo = {
  id: number;
  addr: string;
  addrbind: string;
  addrlocal: string;
  services: string;
  relaytxs: boolean;
  lastsend: number;
  lastrecv: number;
  bytessent: number;
  bytesrecv: number;
  conntime: number;
  timeoffset: number;
  pingtime: number;
  minping: number;
  version: number;
  subver: string;
  inbound: boolean;
  addnode: boolean;
  startinheight: number;
  banscore: number;
  synced_headers: number;
  synced_blocks: number;
  inflight: number[];
  whitelisted: boolean;
  bytessent_per_msg: {
    [key: string]: number;
  };
  byterecv_per_msg: {
    [key: string]: number;
  };
};
export type Transaction = {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  locktime: number;
  vin: TxIn | TxIn[];
  vout: TxOut | TxOut[];
};
export type TxIn = {
  txid: string;
  vout: number;
  scriptSig: {
    asm: string;
    hex: string;
  };
  txinwitness?: string[];
  sequence: number;
};
export type TxOut = {
  value: number;
  n: number;
  scriptPubKey: {
    asm: string;
    hex: string;
    reqSigs: number;
    type: scriptPubkeyType;
    addresses: string[];
  };
};
