import {
  getWidgetIdentifier,
  mapWidgetDefaults,
  getGridDimensions,
  isWidgetType,
  extendLayout,
  mapTemplateConfigToExtendedTemplateConfig,
} from '../utils';
import { ExtendedTemplateConfig, TemplateConfig } from '../types';

describe('utils', () => {
  describe('getWidgetIdentifier', () => {
    it('creates identifier with widgetType and uuid', () => {
      const result = getWidgetIdentifier('my-widget', 'test-uuid');
      expect(result).toBe('my-widget#test-uuid');
    });

    it('generates random uuid when not provided', () => {
      const result1 = getWidgetIdentifier('my-widget');
      const result2 = getWidgetIdentifier('my-widget');
      expect(result1).toMatch(/^my-widget#/);
      expect(result2).toMatch(/^my-widget#/);
      expect(result1).not.toBe(result2);
    });
  });

  describe('mapWidgetDefaults', () => {
    it('splits identifier into widgetType and uuid', () => {
      const [widgetType, uuid] = mapWidgetDefaults('my-widget#test-uuid');
      expect(widgetType).toBe('my-widget');
      expect(uuid).toBe('test-uuid');
    });
  });

  describe('getGridDimensions', () => {
    it('returns xl for width >= 1550', () => {
      expect(getGridDimensions(1550)).toBe('xl');
      expect(getGridDimensions(2000)).toBe('xl');
    });

    it('returns lg for width 1400-1549', () => {
      expect(getGridDimensions(1400)).toBe('lg');
      expect(getGridDimensions(1549)).toBe('lg');
    });

    it('returns md for width 1100-1399', () => {
      expect(getGridDimensions(1100)).toBe('md');
      expect(getGridDimensions(1399)).toBe('md');
    });

    it('returns sm for width < 1100', () => {
      expect(getGridDimensions(800)).toBe('sm');
      expect(getGridDimensions(1099)).toBe('sm');
    });
  });

  describe('isWidgetType', () => {
    it('returns true if type exists in mapping', () => {
      const mapping = { 'widget-1': {}, 'widget-2': {} };
      expect(isWidgetType(mapping, 'widget-1')).toBe(true);
    });

    it('returns false if type does not exist in mapping', () => {
      const mapping = { 'widget-1': {} };
      expect(isWidgetType(mapping, 'widget-2')).toBe(false);
    });
  });

  describe('extendLayout', () => {
    it('filters out dropping element', () => {
      const config: ExtendedTemplateConfig = {
        xl: [
          { i: 'widget-1#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'widget-1', title: 'Widget 1' },
          { i: '__dropping-elem__', x: 2, y: 0, w: 2, h: 3, widgetType: 'widget-2', title: 'Dropping' }
        ],
        lg: [],
        md: [],
        sm: []
      };

      const result = extendLayout(config);
      expect(result.xl).toHaveLength(1);
      expect(result.xl[0].i).toBe('widget-1#1');
    });

    it('adds widgetType from identifier', () => {
      const config: ExtendedTemplateConfig = {
        xl: [{ i: 'my-widget#123', x: 0, y: 0, w: 2, h: 3, widgetType: '', title: 'Widget' }],
        lg: [],
        md: [],
        sm: []
      };

      const result = extendLayout(config);
      expect(result.xl[0].widgetType).toBe('my-widget');
    });
  });

  describe('mapTemplateConfigToExtendedTemplateConfig', () => {
    it('converts TemplateConfig to ExtendedTemplateConfig', () => {
      const config: TemplateConfig = {
        xl: [{ i: 'widget-1#1', x: 0, y: 0, w: 2, h: 3, title: 'Widget 1' }],
        lg: [],
        md: [],
        sm: []
      };

      const result = mapTemplateConfigToExtendedTemplateConfig(config);
      expect(result.xl[0].widgetType).toBe('widget-1');
      expect(result.xl[0].i).toBe('widget-1#1');
    });
  });
});

