declare module '*.html?t' {
  export default function html(subs: Record<string, unknown>): string;
}

declare module '*.txt?t' {
  export default function text(subs: Record<string, unknown>): string;
}
