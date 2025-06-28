import { Plugin } from 'vite';
import path from 'node:path';

type VirtualModule = { name: string; type: 'ts' | 'tsx' };

const virtualModules: VirtualModule[] = [
  { name: 'utils/reactDomEnv', type: 'tsx' },
  { name: 'utils/apiEnv', type: 'ts' },
  { name: 'api/media/resize', type: 'ts' },
];

export function multienvPlugin(): Plugin {
  let host: string | undefined;

  return {
    name: 'multienv-plugin',
    enforce: 'pre',
    configResolved(config) {
      host =
        config.mode === 'staging' || config.mode === 'production'
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
