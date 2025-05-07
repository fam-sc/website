export function getEnvChecked(name: string): string {
  const result = process.env[name];
  if (result === undefined) {
    throw new Error(`No ${name} in env`);
  }

  return result;
}
