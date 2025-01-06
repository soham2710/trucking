// components/MixpanelProvider.tsx
'use client';
import { useEffect } from 'react';
import mixpanel from 'mixpanel-browser';

try {
  mixpanel.init("aaa18717adfa752e6898ec2bf2fd06c5", {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
    loaded: (mixpanel) => {
      window.mixpanel = mixpanel;
    }
  });
} catch (error) {
  console.error('Mixpanel initialization error:', error);
}