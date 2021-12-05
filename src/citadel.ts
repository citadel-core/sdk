import { Manager } from "./manager/index.js";
import { Middleware } from "./middleware/index.js";
import { joinUrl } from "./common/utils.js";

export default class Citadel {
  readonly manager;
  readonly middleware;
  #jwt = "";

  constructor(baseUrl: string) {
    const middlewareApi = joinUrl(baseUrl, "api");
    const managerApi = joinUrl(baseUrl, "manager-api");
    this.manager = new Manager(managerApi.toString());
    this.middleware = new Middleware(middlewareApi.toString());
  }

  /**
   * Check if the node is online, and what parts are online
   */
  public async isOnline(): Promise<{
    manager: boolean;
    middleware: boolean;
    node: boolean;
    lnd: {
      operational: boolean;
      unlocked: boolean;
    };
  }> {
    const manager = await this.manager.isOnline();
    const middleware = await this.middleware.isOnline();
    let lnd: {
      operational: boolean;
      unlocked: boolean;
    } = {
      operational: false,
      unlocked: false,
    };
    try {
      lnd = await this.middleware.lnd.info.getStatus();
    } catch {}

    return {
      manager,
      middleware,
      node: manager && middleware,
      lnd: lnd,
    };
  }

  /**
   * Login to the node.
   * @param password The users password
   * @param savePw Whether to save the password for later use
   */
  public async login(password: string, totpToken: string): Promise<void> {
    this.jwt = await this.manager.auth.login(password, totpToken);
  }

  /**
   * Refresh the stored JWT
   */
  public async refresh(): Promise<void> {
    this.jwt = await this.manager.auth.refresh();
  }

  public get jwt(): string {
    return this.#jwt;
  }

  public set jwt(newJwt: string) {
    this.#jwt = this.manager.jwt = this.middleware.jwt = newJwt;
  }

  /**
   * Check if a node actually uses Citadel (not Umbrel)
   *
   * @returns {boolean} True if the node is using Citadel
   */
  public async isCitadel(): Promise<boolean> {
    return await this.manager.isCitadel();
  }
}
