import { Mutex } from "async-mutex";

let json_id = 0;
const mutex_id = new Mutex();

export async function jsonRpc(address: string, method: string, ...args: unknown[]) {
  let id;
  await mutex_id.runExclusive(() => {
    id = json_id;
    json_id += 1;
  });
  // console.log(address, method, args, id);
  const headers: { [key: string]: string } = { "Content-Type": "application/json" };
  const response = await fetch(address, {
    method: "POST",
    body: JSON.stringify({
      method: method,
      jsonrpc: "2.0",
      id: id,
      params: [...args],
    }),
    headers: headers,
  });
  // console.log(response);
  const json = await response.json();
  if (json.error) {
    console.error(method);
    console.error(...args);
    console.error(json.error);
    throw json.error;
  }
  return json.result;
}
