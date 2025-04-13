declare global {
  declare module 'react' {
    namespace JSX {
      interface IntrinsicElements {
        selectedcontent: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement>,
          HTMLElement
        >;
      }
    }
  }
}
