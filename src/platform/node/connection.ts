import { joinUrl } from "../../common/utils.js";
import { request } from "undici";

export abstract class ApiConnection {
  #baseUrl: string;
  protected _jwt = "";

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl;
  }

  public set jwt(jwt: string) {
    this._jwt = jwt;
  }

  async #request<ResponseType = unknown>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body: unknown = {}
  ): Promise<ResponseType> {
    url = joinUrl(this.#baseUrl, url);
    let authHeader = "";
    if (this.jwt) authHeader = `JWT ${this.jwt}`;
    let headers: Record<string, string> = {};
    if (method !== "GET") {
      headers = {
        "Content-type": "application/json",
      };
    }
    if (authHeader)
      headers = {
        ...headers,
        Authorization: authHeader,
      };
    if (process.env.CITADEL_SDK_VERBOSE) {
      console.log(`[${method}] ${url}`);
      if (method !== "GET") {
        console.log(`body: ${JSON.stringify(body, undefined, 2)}`);
      }
    }

    const response = await request(url, {
      headers,
      method,
      ...(method !== "GET" ? { body: JSON.stringify(body) } : {}),
    });

    if (response.statusCode !== 200) {
      throw new Error(await response.body.text());
    }

    const data = await response.body.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      throw new Error(`Received invalid data: ${data}`);
    }

    if (typeof parsed === "string") {
      throw new Error(parsed);
    }

    return parsed as ResponseType;
  }

  protected async get<ResponseType = unknown>(
    url: string
  ): Promise<ResponseType> {
    return await this.#request<ResponseType>(url);
  }

  protected async post<ResponseType = unknown>(
    url: string,
    body: unknown = {}
  ): Promise<ResponseType> {
    return await this.#request<ResponseType>(url, "POST", body);
  }

  protected async put<ResponseType = unknown>(
    url: string,
    body: unknown = {}
  ): Promise<ResponseType> {
    return await this.#request<ResponseType>(url, "PUT", body);
  }

  protected async delete<ResponseType = unknown>(
    url: string,
    body: unknown = {}
  ): Promise<ResponseType> {
    return await this.#request<ResponseType>(url, "DELETE", body);
  }
}
