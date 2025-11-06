import 'react-grid-layout/css/styles.css';
import './styles';
import ReactGridLayout, { Layout, ReactGridLayoutProps } from 'react-grid-layout';
import GridTile, { SetWidgetAttribute } from './GridTile';
import { useEffect, useMemo, useRef, useState } from 'react';
import { isWidgetType } from './utils';
import React from 'react';
import {
  ExtendedLayoutItem,
  Variants,
  WidgetMapping,
  ExtendedTemplateConfig,
  AnalyticsTracker,
} from './types';
import { Button, EmptyState, EmptyStateActions, EmptyStateBody, EmptyStateVariant, PageSection } from '@patternfly/react-core';
import { ExternalLinkAltIcon, GripVerticalIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { columns, breakpoints, droppingElemId, getWidgetIdentifier, extendLayout, getGridDimensions } from './utils';

export const defaultBreakpoints = breakpoints;

// SVG resize handle as inline data URI
const resizeHandleSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDEuMTQyODZMMTQuODU3MSAwTDAgMTQuODU3MVYxNkgxLjE0Mjg2TDE2IDEuMTQyODZaIiBmaWxsPSIjRDJEMkQyIi8+Cjwvc3ZnPgo=';

const getResizeHandle = (resizeHandleAxis: string, ref: React.Ref<HTMLDivElement>) => (
    <div ref={ref} className={`react-resizable-handle react-resizable-handle-${resizeHandleAxis}`}>
      <img src={resizeHandleSvg} alt="Resize handle" />
    </div>
  );

export interface GridLayoutProps {
  /** Widget mapping definition */
  widgetMapping: WidgetMapping;
  /** Current template configuration */
  template: ExtendedTemplateConfig;
  /** Callback when template changes */
  onTemplateChange?: (template: ExtendedTemplateConfig) => void;
  /** Whether the layout is locked (disables drag, drop, resize) */
  isLayoutLocked?: boolean;
  /** Custom empty state component */
  emptyStateComponent?: React.ReactNode;
  /** Documentation link for empty state */
  documentationLink?: string;
  /** Analytics tracker (optional) */
  analytics?: AnalyticsTracker;
  /** Whether to show the empty state when no widgets exist */
  showEmptyState?: boolean;
  /** Callback when drawer should be expanded */
  onDrawerExpandChange?: (expanded: boolean) => void;
  /** Currently active widgets (for tracking) */
  onActiveWidgetsChange?: (widgetTypes: string[]) => void;
}

const LayoutEmptyState = ({
  onDrawerExpandChange,
  documentationLink,
}: {
  onDrawerExpandChange?: (expanded: boolean) => void;
  documentationLink?: string;
}) => {
  useEffect(() => {
    onDrawerExpandChange?.(true);
  }, [onDrawerExpandChange]);

  return (
    <PageSection hasBodyWrapper={false} className="empty-layout pf-v6-u-p-0">
      <EmptyState headingLevel="h2" icon={PlusCircleIcon} titleText="No dashboard content" variant={EmptyStateVariant.lg} className="pf-v6-u-p-sm">
        <EmptyStateBody>
          You don't have any widgets on your dashboard. To populate your dashboard, drag <GripVerticalIcon /> items from the widget drawer to this
          dashboard.
        </EmptyStateBody>
        {documentationLink && (
          <EmptyStateActions>
            <Button variant="link" icon={<ExternalLinkAltIcon />} iconPosition="end" component="a" href={documentationLink} target="_blank">
              Learn more about widget dashboard
            </Button>
          </EmptyStateActions>
        )}
      </EmptyState>
    </PageSection>
  );
};

const GridLayout = ({
  widgetMapping,
  template,
  onTemplateChange,
  isLayoutLocked = false,
  emptyStateComponent,
  documentationLink,
  analytics,
  showEmptyState = true,
  onDrawerExpandChange,
  onActiveWidgetsChange,
}: GridLayoutProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [layoutVariant, setLayoutVariant] = useState<Variants>('xl');
  const [layoutWidth, setLayoutWidth] = useState<number>(1200);
  const layoutRef = useRef<HTMLDivElement>(null);

  const [currentDropInItem, setCurrentDropInItem] = useState<string | undefined>();
  const [internalTemplate, setInternalTemplate] = useState<ExtendedTemplateConfig>(template);

  // Sync external template changes to internal state
  useEffect(() => {
    setInternalTemplate(template);
  }, [template]);

  const droppingItemTemplate: ReactGridLayoutProps['droppingItem'] = useMemo(() => {
    if (currentDropInItem && isWidgetType(widgetMapping, currentDropInItem)) {
      const widget = widgetMapping[currentDropInItem];
      if (!widget) {return undefined;}
      return {
        ...widget.defaults,
        i: droppingElemId,
        widgetType: currentDropInItem,
        title: 'New title',
        config: widget.config,
      };
    }
    return undefined;
  }, [currentDropInItem, widgetMapping]);

  const setWidgetAttribute: SetWidgetAttribute = (id, attributeName, value) => {
    const newTemplate = Object.entries(internalTemplate).reduce(
      (acc, [size, layout]) => ({
        ...acc,
        [size]: layout.map((widget) => (widget.i === id ? { ...widget, [attributeName]: value } : widget)),
      }),
      {} as ExtendedTemplateConfig
    );
    setInternalTemplate(newTemplate);
    onTemplateChange?.(newTemplate);
  };

  const removeWidget = (id: string) => {
    const newTemplate = Object.entries(internalTemplate).reduce(
      (acc, [size, layout]) => ({
        ...acc,
        [size]: layout.filter((widget) => widget.i !== id),
      }),
      {} as ExtendedTemplateConfig
    );
    setInternalTemplate(newTemplate);
    onTemplateChange?.(newTemplate);
  };

  const onDrop: ReactGridLayoutProps['onDrop'] = (_layout: ExtendedLayoutItem[], layoutItem: ExtendedLayoutItem, event: DragEvent) => {
    const data = event.dataTransfer?.getData('text') || '';
    if (isWidgetType(widgetMapping, data)) {
      setCurrentDropInItem(undefined);
      const widget = widgetMapping[data];
      if (!widget) {return;}
      const newTemplate = Object.entries(internalTemplate).reduce((acc, [size, layout]) => {
        const newWidget = {
          ...layoutItem,
          ...widget.defaults,
          // make sure the configuration is valid for all layout sizes
          w: size === layoutVariant ? layoutItem.w : Math.min(widget.defaults.w, columns[size as Variants]),
          x: size === layoutVariant ? layoutItem.x : Math.min(layoutItem.x, columns[size as Variants]),
          widgetType: data,
          i: getWidgetIdentifier(data),
          title: 'New title',
          config: widget.config,
        };
        return {
          ...acc,
          [size]: layout.reduce<ExtendedLayoutItem[]>(
            (acc, curr) => {
              if (curr.x + curr.w > newWidget.x && curr.y + curr.h <= newWidget.y) {
                acc.push(curr);
              } else {
                // push the current items down on the Y axis if they are supposed to be below the new widget
                acc.push({ ...curr, y: curr.y + curr.h });
              }
              return acc;
            },
            [newWidget]
          ),
        };
      }, {} as ExtendedTemplateConfig);
      
      setInternalTemplate(newTemplate);
      onTemplateChange?.(newTemplate);
      analytics?.('widget-layout.widget-add', { data });
    }
    event.preventDefault();
  };

  const onLayoutChange = (currentLayout: Layout[]) => {
    if (isInitialRender) {
      setIsInitialRender(false);
      const activeWidgets = activeLayout.map((item) => item.widgetType);
      onActiveWidgetsChange?.(activeWidgets);
      return;
    }
    if (isLayoutLocked || currentDropInItem) {
      return;
    }

    const newTemplate = extendLayout({ ...internalTemplate, [layoutVariant]: currentLayout });
    const activeWidgets = activeLayout.map((item) => item.widgetType);
    onActiveWidgetsChange?.(activeWidgets);
    
    setInternalTemplate(newTemplate);
    onTemplateChange?.(newTemplate);
  };

  useEffect(() => {
    const currentWidth = layoutRef.current?.getBoundingClientRect().width ?? 1200;
    const variant: Variants = getGridDimensions(currentWidth);
    setLayoutVariant(variant);
    setLayoutWidth(currentWidth);
    
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) {return;}

      const currentWidth = entries[0].contentRect.width;
      const variant: Variants = getGridDimensions(currentWidth);
      setLayoutVariant(variant);
      setLayoutWidth(currentWidth);
    });
    
    if (layoutRef.current) {
      observer.observe(layoutRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const activeLayout = internalTemplate[layoutVariant] || [];
  
  return (
    <div id="widget-layout-container" style={{ position: 'relative' }} ref={layoutRef}>
      {activeLayout.length === 0 && !currentDropInItem && showEmptyState && (
        emptyStateComponent || <LayoutEmptyState onDrawerExpandChange={onDrawerExpandChange} documentationLink={documentationLink} />
      )}
      <ReactGridLayout
        key={'grid-' + layoutVariant}
        draggableHandle=".drag-handle"
        layout={internalTemplate[layoutVariant]}
        cols={columns[layoutVariant]}
        rowHeight={56}
        width={layoutWidth}
        isDraggable={!isLayoutLocked}
        isResizable={!isLayoutLocked}
        resizeHandle={getResizeHandle as unknown as ReactGridLayoutProps['resizeHandle']}
        resizeHandles={['sw', 'nw', 'se', 'ne']}
        droppingItem={droppingItemTemplate}
        isDroppable={!isLayoutLocked}
        onDrop={onDrop}
        onDragStart={() => setCurrentDropInItem(undefined)}
        useCSSTransforms
        verticalCompact
        onLayoutChange={onLayoutChange}
      >
        {activeLayout
          .map((layoutItem, index) => {
            const { widgetType } = layoutItem;
            const widget = widgetMapping[widgetType];
            if (!widget) {
              return null;
            }
            const config = widgetMapping[widgetType]?.config;
            return (
              <div key={layoutItem.i} data-grid={layoutItem} tabIndex={index} className={`widget-columns-${layoutItem.w} widget-rows-${layoutItem.h}`}>
                <GridTile
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                  widgetType={widgetType}
                  widgetConfig={{ ...layoutItem, colWidth: layoutWidth / columns[layoutVariant], config }}
                  setWidgetAttribute={setWidgetAttribute}
                  removeWidget={removeWidget}
                  analytics={analytics}
                >
                  {widget.renderWidget(layoutItem.i)}
                </GridTile>
              </div>
            );
          })
          .filter((layoutItem) => layoutItem !== null)}
      </ReactGridLayout>
    </div>
  );
};

export default GridLayout;

