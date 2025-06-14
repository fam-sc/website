import { Plugin } from 'vite';
import path from 'node:path';

type VirtualModule = { name: string; type: 'ts' | 'tsx' };

const virtualModules: VirtualModule[] = [
  { name: 'utils/reactDomEnv', type: 'tsx' },
  { name: 'utils/apiEnv', type: 'ts' },
];

export function multienvPlugin(): Plugin {
  const host =
    process.env.NODE_ENV === 'development' || process.env.LOCAL === '1'
      ? 'node'
      : 'cf';

  return {
    name: 'multienv-plugin',
    enforce: 'pre',
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
    resolveImportMeta(property) {
      console.log(property);
      if (property === 'HOST') {
        console.log('HOST');
        return `'${host}'`;
      }
    },
  };
}
