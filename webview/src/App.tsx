import { Route, Routes, useNavigate } from "react-router-dom";
import Info from "./routes/Info";
import ErrorPage from "./routes/ErrorPage";
import { useEffect, useRef, useState } from "react";

export interface VsCodeWebviewApi {
  postMessage(message: object): void;
}

declare global {
  interface Window {
    initialData?: string;
    acquireVsCodeApi(): VsCodeWebviewApi;
  }
}

export default function App() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  const [jrpcURL, setJrpcURL] = useState("");
  const [error, setError] = useState("");
  const [vscode, setVscode] = useState<VsCodeWebviewApi>();
  const setInitialData = (initialData: string) => {
    try {
      const data = JSON.parse(atob(initialData));
      setJrpcURL(data.jrpcURL);
      navigateRef.current(data.path, { replace: true });
    } catch (e) {
      setError(`${e}`);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined" && window.initialData) {
      setVscode(window.acquireVsCodeApi());
      setInitialData(window.initialData);
    } else {
      setInitialData("eyJwYXRoIjoiL2xvZ3MvVmFsaWRhdG9yTm9kZV8wIiwianJwY1VSTCI6Imh0dHA6Ly8xMjcuMC4wLjE6MTgwMDYifQ==");
      // setJrpcURL("http://127.0.0.1:18006");
      // navigateRef.current("/logs/ValidatorNode_0");
      // setError("No initial data");
    }
  }, []);

  if (vscode === undefined) {
    return <ErrorPage error="vscode is undefined" />;
  }

  return (
    <Routes>
      <Route path="info/:name" element={<Info jrpcURL={jrpcURL} vscode={vscode} />} />
      <Route path="*" element={<ErrorPage error={error} />} />
    </Routes>
  );
}
