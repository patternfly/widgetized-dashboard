import { ExtendedTemplateConfig, TemplateConfig, Variants, widgetIdSeparator } from './types';

export const droppingElemId = '__dropping-elem__';

export const columns: Record<Variants, number> = { xl: 4, lg: 3, md: 2, sm: 1 };

export const breakpoints: Record<Variants, number> = { xl: 1550, lg: 1400, md: 1100, sm: 800 };

/**
 * Generate a unique widget identifier
 */
export const getWidgetIdentifier = (widgetType: string, uniqueId: string = crypto.randomUUID()): string => `${widgetType}${widgetIdSeparator}${uniqueId}`;

/**
 * Parse widget identifier into type and unique ID
 */
export const mapWidgetDefaults = (id: string): [string, string] => {
  const [widgetType, i] = id.split(widgetIdSeparator);
  return [widgetType ?? '', i ?? ''];
};

/**
 * Map template config to extended template config with widget types
 */
export const mapTemplateConfigToExtendedTemplateConfig = (templateConfig: TemplateConfig): ExtendedTemplateConfig => {
  const result: ExtendedTemplateConfig = { sm: [], md: [], lg: [], xl: [] };
  (Object.keys(templateConfig) as Variants[]).forEach((key) => {
    result[key] = templateConfig[key].map((layoutWithTitle) => ({
      ...layoutWithTitle,
      widgetType: mapWidgetDefaults(layoutWithTitle.i)[0],
    }));
  });
  return result;
};

/**
 * Extend layout by filtering out dropping elements and adding widget types
 */
export const extendLayout = (extendedTemplateConfig: ExtendedTemplateConfig): ExtendedTemplateConfig => {
  const result: ExtendedTemplateConfig = { sm: [], md: [], lg: [], xl: [] };
  (Object.keys(extendedTemplateConfig) as Variants[]).forEach((key) => {
    result[key] = extendedTemplateConfig[key]
      .filter(({ i }) => i !== droppingElemId)
      .map((item) => ({
        ...item,
        widgetType: mapWidgetDefaults(item.i)[0],
      }));
  });
  return result;
};

/**
 * Get grid dimensions based on container width
 */
export function getGridDimensions(currentWidth: number): Variants {
  if (currentWidth >= breakpoints.xl) {
    return 'xl';
  }
  if (currentWidth >= breakpoints.lg) {
    return 'lg';
  }
  if (currentWidth >= breakpoints.md) {
    return 'md';
  }
  return 'sm';
}

/**
 * Check if a type exists in the widget mapping
 */
export function isWidgetType(widgetMapping: Record<string, unknown>, type: string): boolean {
  return Object.keys(widgetMapping).includes(type);
}

