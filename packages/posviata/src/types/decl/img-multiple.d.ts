const _default: { src: string; width: number; height: number }[];

declare module '*.png?multiple' {
  export default _default;
}

declare module '*.jpg?multiple' {
  export default _default;
}

declare module '*.jpeg?multiple' {
  export default _default;
}

declare module '*.webp?multiple' {
  export default _default;
}
