import { ApiConnection } from "platform/connection.js";
import { NewAddressResponse } from "./autogenerated-types.js";
import { LNDChannel } from "./lnd/channel.js";
import { LNDInfo } from "./lnd/info.js";
import { LNDLightning } from "./lnd/lightning.js";
import { LNDWallet } from "./lnd/wallet.js";
import { joinUrl } from "../common/utils.js";
import { LNDTransaction } from "./lnd/transaction.js";
import { RequestFunction } from "src/common/types.js";

export class MiddlewareLND extends ApiConnection {
  readonly channel: LNDChannel;
  readonly info: LNDInfo;
  readonly lightning: LNDLightning;
  readonly wallet: LNDWallet;
  readonly transaction: LNDTransaction;
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, `v1/lnd`));
    const url = joinUrl(baseUrl, `v1/lnd`);
    this.channel = new LNDChannel(url);
    this.info = new LNDInfo(url);
    this.lightning = new LNDLightning(url);
    this.wallet = new LNDWallet(url);
    this.transaction = new LNDTransaction(url);
  }

  public set jwt(newJwt: string) {
    // This is ugly, but makes the final bundle smaller
    this._jwt =
      this.channel.jwt =
      this.info.jwt =
      this.lightning.jwt =
      this.transaction.jwt =
      this.wallet.jwt =
        newJwt;
  }
  
  public set requestFunc(requestFunc: RequestFunction) {
    this.channel.requestFunc =
      this.info.requestFunc =
      this.lightning.requestFunc =
      this.transaction.requestFunc =
      this.wallet.requestFunc =
      this._requestFunc =
        requestFunc;
  }

  public async address(): Promise<NewAddressResponse> {
    return await this.get<NewAddressResponse>("address");
  }

  public async signMessage(message: string): Promise<string> {
    return (
      await this.post<{ signature: string }>("util/sign-message", { message })
    ).signature;
  }
  public async validateMessage(
    message: string,
    signature: string
  ): Promise<{
    pubkey: string;
    valid: boolean;
  }> {
    return await this.post<{
      pubkey: string;
      valid: boolean;
    }>("util/verify-message", { message, signature });
  }
}
