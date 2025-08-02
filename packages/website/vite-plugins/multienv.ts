import path from 'node:path';

import { Plugin } from 'vite';

type Host = 'cf' | 'node' | 'mock';
type VirtualModule = { name: string; type: 'ts' | 'tsx' };

const virtualModules: VirtualModule[] = [
  { name: 'utils/reactDomEnv', type: 'tsx' },
  { name: 'utils/apiEnv', type: 'ts' },
  { name: 'api/media/resize', type: 'ts' },
];

function resolveHost(hostOverride: Host | undefined, mode: string): Host {
  if (hostOverride !== undefined) {
    return hostOverride;
  }

  const isLocal = process.env.LOCAL === '1';

  return (mode === 'staging' || mode === 'production') && !isLocal
    ? 'cf'
    : 'node';
}

export function multienvPlugin(hostOverride?: Host): Plugin {
  let host: Host | undefined;

  return {
    name: 'multienv-plugin',
    enforce: 'pre',
    configResolved(config) {
      host = resolveHost(hostOverride, config.mode);
    },
    resolveId(id) {
      const module = virtualModules.find(
        (value) => `virtual:${value.name}` === id
      );

      if (module !== undefined) {
        return path.join(
          import.meta.dirname,
          '../src',
          `${module.name}.${host}.${module.type}`
        );
      }
    },
  };
}
