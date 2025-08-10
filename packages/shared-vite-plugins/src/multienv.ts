import path from 'node:path';

import { Plugin, ResolvedConfig } from 'vite';

export type Host = 'cf' | 'node' | 'mock';
export type VirtualModule = { name: string; type: 'ts' | 'tsx' };

function resolveHost(hostOverride: Host | undefined, mode: string): Host {
  if (hostOverride !== undefined) {
    return hostOverride;
  }

  const isLocal = process.env.LOCAL === '1';

  return (mode === 'staging' || mode === 'production') && !isLocal
    ? 'cf'
    : 'node';
}

export function multienvPlugin(
  virtualModules: VirtualModule[],
  hostOverride?: Host
): Plugin {
  let host: Host | undefined;
  let config: ResolvedConfig;

  return {
    name: 'multienv-plugin',
    enforce: 'pre',
    configResolved(_config) {
      config = _config;
      host = resolveHost(hostOverride, _config.mode);
    },
    resolveId(id) {
      const module = virtualModules.find(
        (value) => `virtual:${value.name}` === id
      );

      if (module !== undefined) {
        return path.join(
          config.root,
          `./src/${module.name}.${host}.${module.type}`
        );
      }
    },
  };
}
