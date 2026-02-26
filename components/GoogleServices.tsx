import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSettings } from './SettingsProvider';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GoogleServices: React.FC = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const gaId = settings.googleAnalyticsId?.trim();
  const verification = settings.googleSiteVerification?.trim();
  const gtmId = settings.googleTagManagerId?.trim();

  useEffect(() => {
    if (!gaId) return;

    const scriptId = 'ga4-loader';
    const inlineId = 'ga4-inline';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);
    }

    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };
    }

    if (!document.getElementById(inlineId)) {
      const inlineScript = document.createElement('script');
      inlineScript.id = inlineId;
      inlineScript.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
      `;
      document.head.appendChild(inlineScript);
    }

    window.gtag('js', new Date());
    window.gtag('config', gaId, { send_page_view: false });
  }, [gaId]);

  useEffect(() => {
    if (!gaId || !window.gtag) return;
    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_path: pagePath
    });
  }, [gaId, location.pathname, location.search, location.hash]);

  useEffect(() => {
    const noscriptId = 'gtm-noscript';
    const existing = document.getElementById(noscriptId);

    if (!gtmId) {
      if (existing) existing.remove();
      return;
    }

    if (!existing) {
      const noscript = document.createElement('noscript');
      noscript.id = noscriptId;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      noscript.appendChild(iframe);
      document.body.prepend(noscript);
      return;
    }

    const iframe = existing.querySelector('iframe');
    if (iframe) {
      iframe.setAttribute('src', `https://www.googletagmanager.com/ns.html?id=${gtmId}`);
    }
  }, [gtmId]);

  return (
    <Helmet>
      {verification && (
        <meta name="google-site-verification" content={verification} />
      )}
      {gtmId && (
        <script>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
        </script>
      )}
    </Helmet>
  );
};

export default GoogleServices;
