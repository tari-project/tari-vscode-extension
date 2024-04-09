export default function ErrorPage({ error }: { error: string }) {
  return (
    <div>
      <div>Path {window.location.pathname}</div>
      <div>Error {error}</div>
    </div>
  );
}
