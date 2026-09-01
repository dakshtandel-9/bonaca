/** An external platform where a visitor can check availability or enquire. */
export interface BookingPlatform {
  id: string;
  name: string;
  /** Placeholder ("#") until real listing URLs are supplied. */
  url: string;
  description: string;
  /** Whether the link leaves this website. */
  external: boolean;
  /** Marks the single preferred booking destination. */
  primary: boolean;
}
