// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { BaseNodes, Collection, AssetWallets, Indexers, ValidatorNodes, BaseWallets } from "./collections";
import { Process } from "./processes";
import JRPCClient from "./jrpc-client";
import type { Info } from "./info";
import * as path from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let config = vscode.workspace.getConfiguration("tari");
  let jrpcURL = config.get<string>("jrpcURL");
  if (jrpcURL === undefined) {
    throw new Error("jrpcURL is undefined");
  }

  let jrpcClient = new JRPCClient(jrpcURL);

  let collections = [
    new ValidatorNodes(jrpcClient),
    new AssetWallets(jrpcClient),
    new Indexers(jrpcClient),
    new BaseNodes(jrpcClient),
    new BaseWallets(jrpcClient),
  ];
  const treeDataProvider = new (class implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<
      vscode.TreeItem | undefined
    >();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
      return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
      if (!element) {
        return Promise.resolve(collections);
      }
      if (element instanceof Collection) {
        return element.getChildren();
      }
      if (element instanceof Process) {
        return Promise.resolve(element.children);
      }
      return Promise.resolve([]);
    }

    refresh(item: vscode.TreeItem): void {
      this._onDidChangeTreeData.fire(item);
    }
    async add(item: Collection) {
      await item.add();
      this.refresh(item);
    }
    show(item: Info) {
      item.show();
      this.refresh(item);
    }
    async start(item: Process) {
      await item.start();
      this.refresh(item);
    }
    async stop(item: Process) {
      await item.stop();
      this.refresh(item);
    }
    async webui(item: Process) {
      await item.webui();
    }

    async info(item: Process) {
      let panel = vscode.window.createWebviewPanel("tariInfo", `Info ${item.label}`, vscode.ViewColumn.Active, {
        enableScripts: true,
      });
      // const logs = await item.logs();
      const scriptPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, "dist", "index.js"));
      const cssPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, "dist", "index.css"));
      const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);
      const cssUri = panel.webview.asWebviewUri(cssPathOnDisk);
      const data = { path: `/info/${item.label}`, jrpcURL };
      const initialData = btoa(JSON.stringify(data));
      panel.webview.html = `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <!-- Import the VS Code webview UI toolkit styles -->
          <!-- link rel="stylesheet" href="node_modules/@vscode/webview-ui-toolkit/dist/toolkit.css" / -->
      
          <!-- Import the VS Code webview UI toolkit script -->
          <!-- script src="node_modules/@vscode/webview-ui-toolkit/dist/toolkit.js" -->
          <script>window.initialData="${initialData}"</script>
          <script type="module" crossorigin src="${scriptUri}"></script>
          <link rel="stylesheet" crossorigin href="${cssUri}"> 
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>`;
      panel.webview.onDidReceiveMessage(
        (message) => {
          vscode.commands.executeCommand(message.command, message.data);
        },
        undefined,
        context.subscriptions
      );
    }
  })();

  vscode.window.createTreeView("tari", { treeDataProvider });
  vscode.commands.registerCommand("tari.refreshEntry", (item) => treeDataProvider.refresh(item));
  vscode.commands.registerCommand("tari.show", (item) => treeDataProvider.show(item));
  vscode.commands.registerCommand("tari.add", async (item) => await treeDataProvider.add(item));
  vscode.commands.registerCommand("tari.start", async (item) => await treeDataProvider.start(item));
  vscode.commands.registerCommand("tari.stop", async (item) => await treeDataProvider.stop(item));
  vscode.commands.registerCommand("tari.info", async (item) => await treeDataProvider.info(item));
  vscode.commands.registerCommand("tari.webUI", async (item) => await treeDataProvider.webui(item));
  vscode.commands.registerCommand("tari.openDB", async function (db_file) {
    let content = await jrpcClient.get_file_binary(db_file);
    const decodedBuffer = Buffer.from(content, "base64");
    const decodedUint8Array = new Uint8Array(decodedBuffer);
    let output = vscode.Uri.file(path.join(context.extensionPath, "temp.db"));
    let encoder = new TextEncoder();
    await vscode.workspace.fs.writeFile(output, decodedUint8Array);
    vscode.commands.executeCommand("vscode.open", output);
  });
  vscode.commands.registerCommand("tari.openLog", async function (log_file) {
    let content = await jrpcClient.get_file(log_file);
    const doc = await vscode.workspace.openTextDocument({ language: "log", content });
    await vscode.window.showTextDocument(doc, { preview: false });
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
