import { ApiConnection } from "platform/connection.js";
import {
  ForwardingHistoryResponse,
  Invoice,
  Payment,
  SendResponse,
} from "../autogenerated-types";

type invoice = {
  rHash: Buffer;
  paymentRequest: string;
  rHashStr: string;
};

export class LNDLightning extends ApiConnection {
  constructor(baseUrl: string) {
    super(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}lightning`);
  }

  public set jwt(newJwt: string) {
    this._jwt = newJwt;
  }

  public async addInvoice(amt: string, memo = ""): Promise<Invoice> {
    return (await this.post("/addInvoice", {
      memo,
      value: amt,
    })) as Invoice;
  }

  public async forwardingHistory(
    startTime: number,
    endTime: number,
    indexOffset: number
  ): Promise<ForwardingHistoryResponse> {
    return (await this.get(
      `/forwardingHistory?startTime=${startTime}&endTime=${endTime}&indexOffset=${indexOffset}`
    )) as ForwardingHistoryResponse;
  }

  public async parsePaymentRequest(paymentRequest: string): Promise<invoice> {
    return (await this.get(
      `/invoice?paymentRequest=${paymentRequest}`
    )) as invoice;
  }

  public async invoices(): Promise<Invoice[]> {
    return (await this.get("/invoices")) as Invoice[];
  }

  public async payInvoice(
    paymentRequest: string,
    amt?: number
  ): Promise<SendResponse> {
    return (await this.post("/payInvoice", {
      paymentRequest,
      amt,
    })) as SendResponse;
  }

  public async getPayments(): Promise<Payment[]> {
    return (await this.get("/payments")) as Payment[];
  }
}
