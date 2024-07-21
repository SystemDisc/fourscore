interface DataLayer {
  event: string;
}

interface GASignupEvent extends DataLayer {
  event: 'sign_up';
  engagement_time_msec?: number;
  method?: string;
  value?: number;
  currency?: string;
  user_email?: string;
  campaign?: string;
  gclid?: string;
}

interface GAPageviewEvent extends DataLayer {
  event: 'pageview';
  pagePath: string;
  pageTitle: strng;
  visitorType: 'voter' | 'candidate' | 'unknown';
}

interface Window<T extends DataLayer = DataLayer> {
  dataLayer: T[];
}
