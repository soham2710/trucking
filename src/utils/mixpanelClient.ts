let mixpanelInitialized = false;

const initMixpanel = () => {
  if (!mixpanelInitialized && typeof window !== 'undefined') {
    import('mixpanel-browser').then((mixpanel) => {
      mixpanel.init("aaa18717adfa752e6898ec2bf2fd06c5", {
        debug: true,
        track_pageview: true,
        persistence: "localStorage"
      });
      (window as any).mixpanel = mixpanel;
      mixpanelInitialized = true;
    });
  }
};

export default initMixpanel;