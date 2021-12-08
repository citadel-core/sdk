import { request } from "undici";
import BaseCitadel from "../../citadel.js";

export default class Citadel extends BaseCitadel {
  /**
   * Try to discover a node on the network
   * @returns The discovered node or false if none found
   */
  public static async discover(): Promise<string | false> {
    for (const hostname of ["citadel.local", "citadel"]) {
      try {
        await request(`http://${hostname}`);
        return hostname;
      } catch {
        continue;
      }
    }
    return false;
  }
}
