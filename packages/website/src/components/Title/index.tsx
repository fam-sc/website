export function Title({ children }: { children: string }) {
  return (
    <>
      <title>{`${children} | СР ФПМ`}</title>
      <meta property="og:title" content={children} />
    </>
  );
}
