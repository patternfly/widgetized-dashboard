import type { LayoutItem } from 'react-grid-layout';
import { CardProps, CardBodyProps } from '@patternfly/react-core';

export const widgetIdSeparator = '#';

export type Variants = 'sm' | 'md' | 'lg' | 'xl';

export interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

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

export interface WidgetInfo {
  /** Body content shown in the popover or modal */
  content: React.ReactNode;
  /** Optional header/title for the popover or modal */
  title?: React.ReactNode;
  /** Defaults to 'popover'. Use 'modal' for longer content. */
  variant?: 'popover' | 'modal';
  /** Accessible label for the info icon button (default: "More information") */
  ariaLabel?: string;
}

export interface WidgetConfiguration {
  icon?: React.ReactNode;
  headerLink?: WidgetHeaderLink;
  title?: string;
  wrapperProps?: Omit<CardProps, 'children'>;
  cardBodyProps?: Omit<CardBodyProps, 'children'>;
  info?: WidgetInfo;
}

/**
 * Widget definition with rendering function
 */
export interface WidgetDefinition {
  /** Unique widget type identifier */
  widgetType: string;
  /** Default dimensions for the widget */
  defaults: WidgetDefaults;
  /** Widget configuration (title, icon, header link, info) */
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

