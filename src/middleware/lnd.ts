import { ApiConnection } from "platform/connection.js";
import { LNDChannel } from "./lnd/channel.js";
import { LNDInfo } from "./lnd/info.js";
import { LNDLightning } from "./lnd/lightning.js";
import { LNDWallet } from "./lnd/wallet.js";

export class MiddlewareLND extends ApiConnection {
  #channel: LNDChannel;
  #info: LNDInfo;
  #lightning: LNDLightning;
  #wallet: LNDWallet;
  constructor(baseUrl: string) {
    super(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v1/lnd`);
    this.#channel = new LNDChannel(
      `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v1/lnd`
    );
    this.#info = new LNDInfo(
      `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v1/lnd`
    );
    this.#lightning = new LNDLightning(
      `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v1/lnd`
    );
    this.#wallet = new LNDWallet(
      `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v1/lnd`
    );
  }

  public set jwt(newJwt: string) {
    this._jwt = newJwt;
    this.#channel.jwt = newJwt;
    this.#info.jwt = newJwt;
    this.#lightning.jwt = newJwt;
  }

  public async address(): Promise<string> {
    return (await this.get("address")) as string;
  }

  public async signMessage(message: string): Promise<string> {
    return (await this.post("util/sign-message", { message })) as string;
  }

  public get channel(): LNDChannel {
    return this.#channel;
  }

  public get info(): LNDInfo {
    return this.#info;
  }

  public get lightning(): LNDLightning {
    return this.#lightning;
  }

  public get wallet(): LNDWallet {
    return this.#wallet;
  }
}
