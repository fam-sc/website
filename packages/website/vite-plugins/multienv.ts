import path from 'node:path';

import { Plugin } from 'vite';

type VirtualModule = { name: string; type: 'ts' | 'tsx' };

const virtualModules: VirtualModule[] = [
  { name: 'utils/reactDomEnv', type: 'tsx' },
  { name: 'utils/apiEnv', type: 'ts' },
  { name: 'api/media/resize', type: 'ts' },
];

export function multienvPlugin(): Plugin {
  let host: string | undefined;
  const isLocal = process.env.LOCAL === '1';

  return {
    name: 'multienv-plugin',
    enforce: 'pre',
    configResolved(config) {
      const { mode } = config;

      host =
        (mode === 'staging' || mode === 'production') && !isLocal
          ? 'cf'
          : 'node';
    },
    resolveId(id) {
      const module = virtualModules.find(
        (value) => `virtual:${value.name}` === id
      );

      if (module !== undefined) {
        return path.resolve(
          path.join('.', 'src', `${module.name}.${host}.${module.type}`)
        );
      }
    },
  };
}
