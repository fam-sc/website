import fsp from 'node:fs/promises';
import path from 'node:path';

async function main() {
  const componentPath = process.argv[2];
  console.log(componentPath);

  const fullComponentPath = path.join(
    import.meta.dirname,
    '../src/components',
    componentPath
  );

  const componentName = path.basename(componentPath);

  await fsp.mkdir(fullComponentPath);
  await fsp.writeFile(
    path.join(fullComponentPath, `${componentName}.tsx`),
    `import styles from './${componentName}.module.scss';

export interface ${componentName}Props {
}

export function ${componentName}({}: ${componentName}Props) {
}

`,
    'utf8'
  );

  await fsp.writeFile(
    path.join(fullComponentPath, `${componentName}.module.scss`),
    '',
    'utf8'
  );

  await fsp.writeFile(
    path.join(fullComponentPath, 'index.ts'),
    `export type * from './${componentName}';\nexport { ${componentName} } from './${componentName}';\n`,
    'utf8'
  );
}

void main();
