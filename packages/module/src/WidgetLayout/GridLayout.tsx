import 'react-grid-layout/css/styles.css';
import './styles';
import ReactGridLayout, { useContainerWidth, LayoutItem } from 'react-grid-layout';
import GridTile, { SetWidgetAttribute } from './GridTile';
import { useEffect, useMemo, useState } from 'react';
import { isWidgetType } from './utils';
import React from 'react';
import {
  ExtendedLayoutItem,
  Variants,
  WidgetMapping,
  ExtendedTemplateConfig,
  AnalyticsTracker,
  WidgetConfiguration,
} from './types';
import { Button, EmptyState, EmptyStateActions, EmptyStateBody, EmptyStateVariant, PageSection } from '@patternfly/react-core';
import { ExternalLinkAltIcon, GripVerticalIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { columns, breakpoints, droppingElemId, getWidgetIdentifier, extendLayout, getGridDimensions } from './utils';

export const defaultBreakpoints = breakpoints;

const createSerializableConfig = (config?: WidgetConfiguration) => {
  if (!config) return undefined;
  return {
    ...(config.title && { title: config.title }),
    ...(config.headerLink && { headerLink: config.headerLink })
  };
};

// SVG resize handle as inline data URI
const resizeHandleSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDEuMTQyODZMMTQuODU3MSAwTDAgMTQuODU3MVYxNkgxLjE0Mjg2TDE2IDEuMTQyODZaIiBmaWxsPSIjRDJEMkQyIi8+Cjwvc3ZnPgo=';

const getResizeHandle = (resizeHandleAxis: string, ref: React.Ref<HTMLElement>) => (
    <div ref={ref as React.Ref<HTMLDivElement>} className={`react-resizable-handle react-resizable-handle-${resizeHandleAxis}`}>
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
  /** Widget type currently being dragged from drawer */
  droppingWidgetType?: string;
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
  droppingWidgetType,
}: GridLayoutProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [layoutVariant, setLayoutVariant] = useState<Variants>('xl');
  
  // Use v2 hook for container width measurement
  const { width: layoutWidth, containerRef, mounted } = useContainerWidth();

  const [internalTemplate, setInternalTemplate] = useState<ExtendedTemplateConfig>(template);

  // Sync external template changes to internal state
  useEffect(() => {
    setInternalTemplate(template);
  }, [template]);

  const droppingItemTemplate = useMemo(() => {
    if (droppingWidgetType && isWidgetType(widgetMapping, droppingWidgetType)) {
      const widget = widgetMapping[droppingWidgetType];
      if (!widget) {return undefined;}
      return {
        ...widget.defaults,
        i: droppingElemId,
        x: 0,
        y: 0,
      };
    }
    return undefined;
  }, [droppingWidgetType, widgetMapping]);

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

  const onDrop = (_layout: readonly LayoutItem[], layoutItem: LayoutItem | undefined, event: Event) => {
    if (!layoutItem) return;
    const dragEvent = event as DragEvent;
    const data = dragEvent.dataTransfer?.getData('text') || '';
    if (isWidgetType(widgetMapping, data)) {
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
          config: createSerializableConfig(widget.config)
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
    dragEvent.preventDefault();
  };

  const onLayoutChange = (currentLayout: readonly LayoutItem[]) => {
    if (isInitialRender) {
      setIsInitialRender(false);
      const activeWidgets = activeLayout.map((item) => item.widgetType);
      onActiveWidgetsChange?.(activeWidgets);
      return;
    }
    if (isLayoutLocked || droppingWidgetType) {
      return;
    }

    // Create mutable copy of readonly layout for extendLayout
    const newTemplate = extendLayout({ ...internalTemplate, [layoutVariant]: [...currentLayout] });
    const activeWidgets = activeLayout.map((item) => item.widgetType);
    onActiveWidgetsChange?.(activeWidgets);
    
    setInternalTemplate(newTemplate);
    onTemplateChange?.(newTemplate);
  };

  // Update layout variant when container width changes
  useEffect(() => {
    if (mounted && layoutWidth > 0) {
      const variant: Variants = getGridDimensions(layoutWidth);
      setLayoutVariant(variant);
    }
  }, [layoutWidth, mounted]);

  const activeLayout = internalTemplate[layoutVariant] || [];
  
  // Use default width before mount, actual width after
  const effectiveWidth = mounted && layoutWidth > 0 ? layoutWidth : 1200;
  
  return (
    <div id="widget-layout-container" style={{ position: 'relative' }} ref={containerRef}>
      {activeLayout.length === 0 && !droppingWidgetType && showEmptyState && (
        emptyStateComponent || <LayoutEmptyState onDrawerExpandChange={onDrawerExpandChange} documentationLink={documentationLink} />
      )}
      {mounted && <ReactGridLayout
        key={'grid-' + layoutVariant}
        layout={internalTemplate[layoutVariant]}
        width={effectiveWidth}
        droppingItem={droppingItemTemplate}
        gridConfig={{
          cols: columns[layoutVariant],
          rowHeight: 56,
        }}
        dragConfig={{
          handle: '.drag-handle',
          enabled: !isLayoutLocked,
        }}
        resizeConfig={{
          enabled: !isLayoutLocked,
          handles: ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'],
          handleComponent: getResizeHandle,
        }}
        dropConfig={{
          enabled: !isLayoutLocked,
        }}
        onDrop={onDrop}
        onDragStart={() => {}}
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
                  widgetConfig={{ ...layoutItem, colWidth: effectiveWidth / columns[layoutVariant], config }}
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
      </ReactGridLayout>}
    </div>
  );
};

export default GridLayout;

