import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GridLayout from '../GridLayout';
import { WidgetMapping, ExtendedTemplateConfig } from '../types';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';

// Mock react-grid-layout v2 — ReactGridLayout can't render in jsdom
// so we replace it with a pass-through that renders children and triggers onLayoutChange
jest.mock('react-grid-layout', () => {
  const React = require('react');
  const MockGridLayout = ({ children, onLayoutChange, layout }: {
    children: React.ReactNode;
    onLayoutChange?: (layout: unknown[]) => void;
    layout?: unknown[];
    [key: string]: unknown;
  }) => {
    const calledRef = React.useRef(false);
    React.useEffect(() => {
      if (!calledRef.current) {
        calledRef.current = true;
        onLayoutChange?.(layout || []);
      }
    });
    return <div data-testid="mock-grid-layout">{children}</div>;
  };
  return {
    __esModule: true,
    default: MockGridLayout,
    useContainerWidth: () => ({
      width: 1600,
      containerRef: React.createRef(),
      mounted: true,
    }),
  };
});

const widgetMapping: WidgetMapping = {
  'widget-a': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'Widget A',
      icon: <CubeIcon />,
    },
    renderWidget: (id) => <div data-testid={`content-${id}`}>Content A</div>,
  },
  'widget-b': {
    defaults: { w: 1, h: 4, maxH: 8, minH: 3 },
    config: {
      title: 'Widget B',
    },
    renderWidget: (id) => <div data-testid={`content-${id}`}>Content B</div>,
  },
};

const template: ExtendedTemplateConfig = {
  xl: [
    { i: 'widget-a#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'widget-a', title: 'Widget A' },
    { i: 'widget-b#1', x: 2, y: 0, w: 1, h: 4, widgetType: 'widget-b', title: 'Widget B' },
  ],
  lg: [
    { i: 'widget-a#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'widget-a', title: 'Widget A' },
    { i: 'widget-b#1', x: 0, y: 3, w: 1, h: 4, widgetType: 'widget-b', title: 'Widget B' },
  ],
  md: [
    { i: 'widget-a#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'widget-a', title: 'Widget A' },
    { i: 'widget-b#1', x: 0, y: 3, w: 1, h: 4, widgetType: 'widget-b', title: 'Widget B' },
  ],
  sm: [
    { i: 'widget-a#1', x: 0, y: 0, w: 1, h: 3, widgetType: 'widget-a', title: 'Widget A' },
    { i: 'widget-b#1', x: 0, y: 3, w: 1, h: 4, widgetType: 'widget-b', title: 'Widget B' },
  ],
};

const emptyTemplate: ExtendedTemplateConfig = {
  xl: [],
  lg: [],
  md: [],
  sm: [],
};

describe('GridLayout', () => {
  describe('rendering', () => {
    it('renders all widgets from the template', () => {
      render(
        <GridLayout
          widgetMapping={widgetMapping}
          template={template}
        />
      );
      expect(screen.getByText('Widget A')).toBeInTheDocument();
      expect(screen.getByText('Widget B')).toBeInTheDocument();
    });

    it('renders widget content via renderWidget', () => {
      render(
        <GridLayout
          widgetMapping={widgetMapping}
          template={template}
        />
      );
      expect(screen.getByTestId('content-widget-a#1')).toBeInTheDocument();
      expect(screen.getByTestId('content-widget-b#1')).toBeInTheDocument();
    });

    it('skips widgets with unknown widgetType', () => {
      const badTemplate: ExtendedTemplateConfig = {
        xl: [
          { i: 'unknown#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'nonexistent', title: 'Ghost' },
          { i: 'widget-a#1', x: 2, y: 0, w: 2, h: 3, widgetType: 'widget-a', title: 'Widget A' },
        ],
        lg: [], md: [], sm: [],
      };
      render(
        <GridLayout
          widgetMapping={widgetMapping}
          template={badTemplate}
        />
      );
      expect(screen.queryByText('Ghost')).not.toBeInTheDocument();
      expect(screen.getByText('Widget A')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows empty state when template has no widgets', () => {
      render(
        <GridLayout
          widgetMapping={widgetMapping}
          template={emptyTemplate}
        />
      );
      expect(screen.getByText(/No dashboard content/i)).toBeInTheDocument();
    });

    it('hides empty state when showEmptyState is false', () => {
      render(
        <GridLayout
          widgetMapping={widgetMapping}
          template={emptyTemplate}
          showEmptyState={false}
        />
      );
      expect(screen.queryByText(/No dashboard content/i)).not.toBeInTheDocument();
    });

    it('renders custom empty state component', () => {
      render(
        <GridLayout
          widgetMapping={widgetMapping}
          template={emptyTemplate}
          emptyStateComponent={<div data-testid="custom-empty">No widgets here</div>}
        />
      );
      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
      expect(screen.queryByText(/No dashboard content/i)).not.toBeInTheDocument();
    });

    it('renders documentation link in empty state', () => {
      render(
        <GridLayout
          widgetMapping={widgetMapping}
          template={emptyTemplate}
          documentationLink="https://example.com/docs"
        />
      );
      const link = screen.getByText(/Learn more about widget dashboard/i);
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', 'https://example.com/docs');
      expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('calls onDrawerExpandChange(true) when empty state renders', () => {
      const onDrawerExpandChange = jest.fn();
      render(
        <GridLayout
          widgetMapping={widgetMapping}
          template={emptyTemplate}
          onDrawerExpandChange={onDrawerExpandChange}
        />
      );
      expect(onDrawerExpandChange).toHaveBeenCalledWith(true);
    });
  });

  describe('locked layout', () => {
    it('renders widgets when layout is locked', () => {
      render(
        <GridLayout
          widgetMapping={widgetMapping}
          template={template}
          isLayoutLocked
        />
      );
      expect(screen.getByText('Widget A')).toBeInTheDocument();
      expect(screen.getByText('Widget B')).toBeInTheDocument();
    });
  });

  describe('callbacks', () => {
    it('calls onActiveWidgetsChange on initial render', () => {
      const onActiveWidgetsChange = jest.fn();
      render(
        <GridLayout
          widgetMapping={widgetMapping}
          template={template}
          onActiveWidgetsChange={onActiveWidgetsChange}
        />
      );
      expect(onActiveWidgetsChange).toHaveBeenCalledWith(['widget-a', 'widget-b']);
    });
  });

  describe('droppingWidgetType', () => {
    it('hides empty state when a widget is being dropped', () => {
      render(
        <GridLayout
          widgetMapping={widgetMapping}
          template={emptyTemplate}
          droppingWidgetType="widget-a"
        />
      );
      expect(screen.queryByText(/No dashboard content/i)).not.toBeInTheDocument();
    });
  });

  describe('template sync', () => {
    it('updates when template prop changes', () => {
      const { rerender } = render(
        <GridLayout
          widgetMapping={widgetMapping}
          template={template}
        />
      );
      expect(screen.getByText('Widget A')).toBeInTheDocument();
      expect(screen.getByText('Widget B')).toBeInTheDocument();

      // Re-render with only widget-a
      const singleWidgetTemplate: ExtendedTemplateConfig = {
        xl: [
          { i: 'widget-a#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'widget-a', title: 'Widget A' },
        ],
        lg: [
          { i: 'widget-a#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'widget-a', title: 'Widget A' },
        ],
        md: [
          { i: 'widget-a#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'widget-a', title: 'Widget A' },
        ],
        sm: [
          { i: 'widget-a#1', x: 0, y: 0, w: 1, h: 3, widgetType: 'widget-a', title: 'Widget A' },
        ],
      };
      rerender(
        <GridLayout
          widgetMapping={widgetMapping}
          template={singleWidgetTemplate}
        />
      );
      expect(screen.getByText('Widget A')).toBeInTheDocument();
      expect(screen.queryByText('Widget B')).not.toBeInTheDocument();
    });
  });
});
