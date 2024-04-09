import axios, { AxiosError } from "axios";

class JRPCClient {
  private url: string;

  constructor(url: string) {
    this.url = url;
    console.log("JRPC url", url);
    this.vns()
      .then((result) => {
        console.log("JRPC ping result", result);
      })
      .catch((error) => {
        console.log("JRPC ping error", error);
      });
  }

  private async call(method: string, params: any): Promise<any> {
    try {
      const response = await axios.post(this.url, {
        jsonrpc: "2.0",
        method,
        params,
        id: 1,
      });
      return response.data.result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code outside of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      } else {
        // Unknown error occurred
        console.error(error);
      }
    }
  }

  public ping = async (): Promise<string> => await this.call("ping", {});
  public base_nodes = async (): Promise<{ name: string; grpc: string; is_running: boolean }[]> =>
    await this.call("base_nodes", {});
  public base_wallets = async (): Promise<{ name: string; grpc: string; is_running: boolean }[]> =>
    await this.call("base_wallets", {});
  public vns = async (): Promise<{ name: string; http: string; jrpc: string; is_running: boolean }[]> =>
    await this.call("vns", {});
  public dan_wallets = async (): Promise<{ name: string; http: string; jrpc: string; is_running: boolean }[]> =>
    await this.call("dan_wallets", {});
  public indexers = async (): Promise<{ name: string; http: string; jrpc: string; is_running: boolean }[]> =>
    await this.call("indexers", {});
  public add_base_node = async (): Promise<{ name: string }> => await this.call("add_base_node", {});
  public add_base_wallet = async (): Promise<{ name: string }> => await this.call("add_base_wallet", {});
  public add_asset_wallet = async (): Promise<{ name: string }> => await this.call("add_asset_wallet", {});
  public add_indexer = async (): Promise<{ name: string }> => await this.call("add_indexer", {});
  public add_validator_node = async (): Promise<{ name: string }> => await this.call("add_validator_node", {});
  public start = async (what: string): Promise<{ success: boolean }> => await this.call("start", [what]);
  public is_running = async (what: string): Promise<{ is_running: boolean }> => await this.call("is_running", [what]);
  public stop = async (what: string): Promise<{ success: boolean }> => await this.call("stop", [what]);
  public mine = async (blocks: number): Promise<{}> => await this.call("mine", { blocks });
  public http = async (what: string): Promise<string> => await this.call("http", { what });
  public grpc = async (what: string): Promise<string> => await this.call("grpc", [what]);
  public jprc = async (what: string): Promise<string> => await this.call("jrpc", [what]);
  public get_logs = async (name: string): Promise<any> => await this.call("get_logs", [name]);
  public get_file = async (path: string): Promise<string> => await this.call("get_file", [path]);
  public get_file_binary = async (path: string): Promise<string> => await this.call("get_file_binary", [path]);
}

export default JRPCClient;
