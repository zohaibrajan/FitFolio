export function FormWrapper({ title, children }) {
  return (
    <>
      <h1>{title}</h1>
      <div>{children}</div>
    </>
  );
}
