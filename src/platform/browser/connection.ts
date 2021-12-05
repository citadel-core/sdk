import { joinUrl } from "../../common/utils.js";

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
    body: unknown = {},
    auth = true
  ): Promise<ResponseType> {
    url = joinUrl(this.#baseUrl, url);
    let authHeader = "";
    if (this._jwt) authHeader = `JWT ${this._jwt}`;
    let headers: Record<string, string> = {};
    if (method !== "GET") {
      headers = {
        "Content-type": "application/json",
      };
    }
    if (authHeader && auth)
      headers = {
        ...headers,
        Authorization: authHeader,
      };
    console.log(`[${method}] ${url}`);
    if (method !== "GET") {
      console.log(`body: ${JSON.stringify(body, undefined, 2)}`);
    }

    const response = await fetch(url, {
      headers,
      method,
      ...(method !== "GET" ? { body: JSON.stringify(body) } : {}),
    });

    if (response.status !== 200) {
      throw new Error(await response.text());
    }

    const data = await response.text();
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
    url: string,
    auth = true,
  ): Promise<ResponseType> {
    return await this.#request<ResponseType>(url, "GET", undefined, auth);
  }

  protected async post<ResponseType = unknown>(
    url: string,
    body: unknown = {},
    auth = true,
  ): Promise<ResponseType> {
    return await this.#request<ResponseType>(url, "POST", body, auth);
  }

  protected async put<ResponseType = unknown>(
    url: string,
    body: unknown = {},
    auth = true,
  ): Promise<ResponseType> {
    return await this.#request<ResponseType>(url, "PUT", body, auth);
  }

  protected async delete<ResponseType = unknown>(
    url: string,
    body: unknown = {},
    auth = true,
  ): Promise<ResponseType> {
    return await this.#request<ResponseType>(url, "DELETE", body, auth);
  }
}
