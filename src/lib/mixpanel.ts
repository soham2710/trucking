// lib/mixpanel.ts
import mixpanel from 'mixpanel-browser';
import React from 'react';

const MIXPANEL_TOKEN = 'aaa18717adfa752e6898ec2bf2fd06c5';

export type ShippingType = 'ltl' | 'ftl';

interface PageViewProperties {
  path: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

interface FormSubmissionProperties {
  shipping_type: ShippingType;
  pickup_zip: string;
  delivery_zip: string;
  form_completion_time?: number;
}

class MixpanelTracker {
  private static instance: MixpanelTracker;
  private initialized = false;

  private constructor() {}

  public static getInstance(): MixpanelTracker {
    if (!MixpanelTracker.instance) {
      MixpanelTracker.instance = new MixpanelTracker();
    }
    return MixpanelTracker.instance;
  }

  public init() {
    if (this.initialized) return;

    try {
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: false,
        persistence: "localStorage"
      });
      this.initialized = true;
      console.log('Mixpanel initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Mixpanel:', error);
    }
  }

  public trackPageView(properties: PageViewProperties) {
    if (!this.initialized) {
      console.warn('Mixpanel not initialized');
      return;
    }

    try {
      mixpanel.track('Page View', {
        ...properties,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  // Add to MixpanelTracker class
  public trackButtonClick(buttonName: string, properties?: Record<string, any>) {
    if (!this.initialized) return;
    try {
      mixpanel.track('Button Click', {
        button_name: buttonName,
        ...properties,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to track button click:', error);
    }
  }

  public trackFormSubmission(properties: FormSubmissionProperties) {
    if (!this.initialized) {
      console.warn('Mixpanel not initialized');
      return;
    }

    try {
      mixpanel.track('Form Submission', {
        ...properties,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to track form submission:', error);
    }
  }
}

export const mixpanelTracker = MixpanelTracker.getInstance();

export const useFormStartTime = () => {
  const [startTime] = React.useState<number>(Date.now());
  return startTime;
};