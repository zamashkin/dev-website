(() => {
  const key = window.POSTHOG_KEY;
  const host = window.POSTHOG_HOST;
  const isDevelopment = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    || window.location.protocol === 'file:';

  if (!key || !host) {
    if (isDevelopment) {
      const missingVariable = !key ? 'POSTHOG_KEY' : 'POSTHOG_HOST';
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`);
    }
    return;
  }

  const posthog = window.posthog = window.posthog || [];
  if (!posthog.__SV) {
    posthog._i = [];
    ['capture', 'captureLog'].forEach((method) => {
      posthog[method] = (...args) => posthog.push([method, ...args]);
    });
    posthog.init = (projectToken, options) => {
      posthog._i.push([projectToken, options]);
    };
    posthog.__SV = 1;
  }

  posthog.init(key, {
    api_host: host,
    defaults: '2026-05-30',
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    logs: {
      serviceName: 'portfolio-web',
      environment: isDevelopment ? 'development' : 'production',
    },
  });

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `${host.replace('.i.posthog.com', '-assets.i.posthog.com')}/static/array.js`;
  document.head.append(script);
})();
