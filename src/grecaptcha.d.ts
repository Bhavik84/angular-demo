declare const grecaptcha: {
  render: (element: string | HTMLElement, options: object) => string;
  reset: (widgetId?: string) => void;
  getResponse: (widgetId?: string) => string;
  execute: (siteKey: string, options?: object) => Promise<string>;
};
