export interface Turnstile {
  ready(callback: () => void): void;
  render(
    element: string | HTMLElement,
    options: {
      sitekey: string;
      theme?: 'light' | 'dark' | 'auto';
      size?: 'normal' | 'flexible' | 'compact';
      language?: string;
      callback: (token: string) => void;
    }
  ): void;
  reset(widgetId: string): void;
}
