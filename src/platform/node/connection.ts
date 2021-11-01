import { request } from "undici";

async function log(message: string) {
  if(process.env.CITADEL_SDK_VERBOSE)
    console.log(message);
}

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
    log(
      `${method} ${this.#baseUrl}${url.startsWith("/") ? url : "/" + url}...`
    );
    const response = await request(
      `${this.#baseUrl}${url.startsWith("/") ? url : "/" + url}`,
      {
        headers,
        method,
        ...(method !== "GET" ? { body: JSON.stringify(body) } : {}),
      }
    );

    if (response.statusCode !== 200) {
      throw new Error(await response.body.text());
    }

    const data = await response.body.json();
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
