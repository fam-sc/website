export type Robots = {
  Sitemap?: string;
  Allow?: string;
  Disallow?: string;
  'User-agent'?: string;
};

export function generateRobots(robots: Robots) {
  return (
    Object.entries(robots)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
  );
}
