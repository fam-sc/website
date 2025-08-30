import { lexer } from 'marked';
import { Plugin } from 'vite';

import { renderTokenArray } from './renderer.js';
import { getTokenArrayConfigUsage } from './usage.js';
import { getExports, resolveMaybeTsx } from './utils.js';

export type { MarkdownConfig } from './config.js';

const SUFFIX = '?react';

type SubConfigInfo = {
  id: string;
  exports: string[];
};

function transformMarkdownToModule(
  content: string,
  mainConfigId: string,
  subConfig?: SubConfigInfo
): string {
  const tokens = lexer(content, {
    gfm: true,
  });

  let result = "import {jsx as _jsx} from 'react/jsx-runtime';";

  const { keys, usesFragment } = getTokenArrayConfigUsage(tokens);

  if (keys.length > 0) {
    const mainKeys = subConfig
      ? keys.filter((key) => !subConfig.exports.includes(key))
      : keys;

    result += `import {${mainKeys.join(',')}} from '${mainConfigId}';`;

    if (subConfig) {
      result += `import {${subConfig.exports.join(',')}} from '${subConfig.id}';`;
    }
  }

  if (usesFragment) {
    result += `import {Fragment} from 'react';`;
  }

  const returnValue = renderTokenArray(tokens, 'fragment');

  result += `export default function _(){return ${returnValue};}`;

  return result;
}

export function markdownPlugin(mainConfigPath: string): Plugin {
  const extension = `.md${SUFFIX}`;

  return {
    name: 'markdown-plugin',
    enforce: 'pre',
    async transform(source, id) {
      if (id.endsWith(extension)) {
        const configPath = `${id.slice(0, -extension.length)}.ts`;
        const configId = await resolveMaybeTsx(this, configPath);

        const mainConfigId = await resolveMaybeTsx(this, mainConfigPath);
        if (mainConfigId === null) {
          this.error('Cannot resolve markdown config');
          return;
        }

        let subConfig: SubConfigInfo | undefined;

        if (configId) {
          subConfig = {
            id: configId.id,
            exports: await getExports(configId.id),
          };
        }

        return transformMarkdownToModule(source, mainConfigId.id, subConfig);
      }
    },
  };
}
