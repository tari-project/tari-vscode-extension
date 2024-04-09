import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jsonRpc } from "../utils/json_rpc";
import {
  VSCodeBadge,
  VSCodeLink,
  VSCodePanelTab,
  VSCodePanelView,
  VSCodePanels,
} from "@vscode/webview-ui-toolkit/react";
import type { VsCodeWebviewApi } from "../App";

interface Log {
  path: string;
  type: string;
  name: string;
}

interface DB {
  path: string;
  name: string;
}

// Rest of the code
export default function Info({ jrpcURL, vscode }: { jrpcURL: string; vscode: VsCodeWebviewApi }) {
  const { name } = useParams<{ name: string }>();
  const [logs, setLogs] = useState<Log[]>([]);
  const [stdout, setStdout] = useState<Log[]>([]);
  const [dbs, setDbs] = useState<DB[]>([]);
  useEffect(() => {
    if (jrpcURL) {
      jsonRpc(jrpcURL, "get_logs", name).then((data) => {
        setLogs(
          data.map((log: [string, string, string]) => ({
            path: log[0].replace(/\\/g, "/"),
            type: log[1],
            name: log[2],
          }))
        );
      });
      jsonRpc(jrpcURL, "get_stdout", name).then((data) => {
        setStdout(
          data.map((log: [string, string, string]) => ({
            path: log[0].replace(/\\/g, "/"),
            type: "stdout",
            name: log[0].replace(/.*(\\|\/)/, "").replace(/.log$/, ""),
          }))
        );
      });
      jsonRpc(jrpcURL, "get_dbs", name).then((data) => {
        setDbs(
          data.map((db: [string, string]) => ({
            path: db[0].replace(/\\/g, "/"),
            name: db[0].replace(/.*(\\|\/)/, "").replace(/\.(sqlite|db)$/, ""),
          }))
        );
      });
    }
  }, [jrpcURL, name]);
  const onClickLog = (path: string) => vscode.postMessage({ command: "tari.openLog", data: path });
  const onClickDB = (path: string) => vscode.postMessage({ command: "tari.openDB", data: path });
  return (
    <>
      <VSCodePanels>
        <VSCodePanelTab id="tab-1">
          LOG
          <VSCodeBadge>{logs.length}</VSCodeBadge>
        </VSCodePanelTab>
        <VSCodePanelTab id="tab-2">
          STDOUT
          <VSCodeBadge>{stdout.length}</VSCodeBadge>
        </VSCodePanelTab>
        <VSCodePanelTab id="tab-3">
          DB
          <VSCodeBadge>{dbs.length}</VSCodeBadge>
        </VSCodePanelTab>
        <VSCodePanelView id="view-1">
          {logs.map((log) => (
            <VSCodeLink key={log.path} onClick={() => onClickLog(log.path)}>
              {log.name}
            </VSCodeLink>
          ))}
        </VSCodePanelView>
        <VSCodePanelView id="view-2">
          {stdout.map((log) => (
            <VSCodeLink key={log.path} onClick={() => onClickLog(log.path)}>
              {log.name}
            </VSCodeLink>
          ))}
        </VSCodePanelView>
        <VSCodePanelView id="view-3">
          {dbs.map((db) => (
            <VSCodeLink key={db.path} onClick={() => onClickDB(db.path)}>
              {db.name}
            </VSCodeLink>
          ))}
        </VSCodePanelView>
      </VSCodePanels>
      {/* <div className="container">
        <div className="inner-container">
          <h3>Logs</h3>
          {logs.map((log) => (
            <VSCodeButton key={log.path} appearance="primary" onClick={() => onClickLog(log.path)}>
              {log.name}
            </VSCodeButton>
          ))}
        </div>
        <div className="inner-container">
          <h3>Stdout</h3>
          {stdout.map((log) => (
            <VSCodeButton key={log.path} onClick={() => onClickLog(log.path)}>
              {log.name}
            </VSCodeButton>
          ))}
        </div>
        <div className="inner-container">
          <h3>DBs:</h3>
          {dbs.map((db) => (
            <VSCodeButton key={db.path} onClick={() => onClickDB(db.path)}>
              {db.name}
            </VSCodeButton>
          ))}
        </div>
      </div> */}
    </>
  );
}
