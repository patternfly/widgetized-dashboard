import type { LayoutItem } from 'react-grid-layout';

export const widgetIdSeparator = '#';

export type Variants = 'sm' | 'md' | 'lg' | 'xl';

export type LayoutWithTitle = LayoutItem & { title: string };

export type TemplateConfig = {
  [k in Variants]: LayoutWithTitle[];
};

export type PartialTemplateConfig = Partial<TemplateConfig>;

// Extended type the UI tracks
export type ExtendedLayoutItem = LayoutWithTitle & {
  widgetType: string;
  config?: WidgetConfiguration;
  locked?: boolean;
};

// Extended type the UI tracks
export type ExtendedTemplateConfig = {
  [k in Variants]: ExtendedLayoutItem[];
};

// Extended type the UI tracks
export type PartialExtendedTemplateConfig = Partial<ExtendedTemplateConfig>;

export interface WidgetDefaults {
  w: number;
  h: number;
  maxH: number;
  minH: number;
}

export interface WidgetHeaderLink {
  title?: string;
  href?: string;
}

export interface WidgetConfiguration {
  icon?: React.ReactNode;
  headerLink?: WidgetHeaderLink;
  title?: string;
}

/**
 * Widget definition with rendering function
 */
export interface WidgetDefinition {
  /** Unique widget type identifier */
  widgetType: string;
  /** Default dimensions for the widget */
  defaults: WidgetDefaults;
  /** Widget configuration (title, icon, header link) */
  config?: WidgetConfiguration;
  /** Function that renders the widget content */
  renderWidget: (widgetId: string) => React.ReactNode;
}

/**
 * Widget mapping keyed by widget type
 */
export interface WidgetMapping {
  [widgetType: string]: Omit<WidgetDefinition, 'widgetType'>;
}

/**
 * Notification type for user feedback
 */
export interface Notification {
  variant: 'success' | 'danger' | 'warning' | 'info' | 'default';
  title: string;
  description?: string;
}

/**
 * Analytics tracking function (optional)
 */
export type AnalyticsTracker = (event: string, data?: Record<string, unknown>) => void;

