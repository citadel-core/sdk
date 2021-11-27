import { ApiConnection } from "platform/connection.js";
import { joinUrl } from "../common/utils.js";
import type { app } from "../common/types";

export class ManagerApps extends ApiConnection {
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, "v1/apps"));
  }

  /**
   * List all apps
   *
   * @param installed Set this to true if you only want a list of installed apps
   * @returns A list of apps with metadata
   */
  async list(installed = false): Promise<app[]> {
    return await this.get<app[]>(installed ? "/?installed=1" : "/");
  }

  /**
   * Install an app
   *
   * @param id The id of the app
   */
  async install(id: string): Promise<void> {
    await this.post(`/${id}/install`);
  }
  /**
   * Unnstall an app
   *
   * @param id The id of the app
   */
  async uninstall(id: string): Promise<void> {
    await this.post(`/${id}/uninstall`);
  }
}
