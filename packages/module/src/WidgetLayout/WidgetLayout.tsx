import React, { useState } from 'react';
import { Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import GridLayout from './GridLayout';
import WidgetDrawer from './WidgetDrawer';
import AddWidgetsButton from './AddWidgetsButton';
import { ExtendedTemplateConfig, WidgetMapping, AnalyticsTracker } from './types';
import { defaultColumns, getWidgetIdentifier, isWidgetType } from './utils';

export interface WidgetLayoutProps {
  /** Widget mapping definition */
  widgetMapping: WidgetMapping;
  /** Initial template configuration */
  initialTemplate: ExtendedTemplateConfig;
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
  /** Whether to show the widget drawer */
  showDrawer?: boolean;
  /** Whether to show the empty state when no widgets exist */
  showEmptyState?: boolean;
  /** Custom instruction text for the drawer */
  drawerInstructionText?: string;
  /** Whether the drawer is initially open */
  initialDrawerOpen?: boolean;
};

const WidgetLayout = ({
  widgetMapping,
  initialTemplate,
  onTemplateChange,
  isLayoutLocked = false,
  emptyStateComponent,
  documentationLink,
  analytics,
  showDrawer = true,
  showEmptyState = true,
  drawerInstructionText,
  initialDrawerOpen = false,
}: WidgetLayoutProps) => {
  const [template, setTemplate] = useState<ExtendedTemplateConfig>(initialTemplate);
  const [drawerOpen, setDrawerOpen] = useState(initialDrawerOpen);
  const [currentlyUsedWidgets, setCurrentlyUsedWidgets] = useState<string[]>([]);
  const [droppingWidgetType, setDroppingWidgetType] = useState<string | undefined>();

  const createSerializableConfig = (config?: WidgetMapping[string]['config']) => {
    if (!config) { return undefined; }
    return {
      ...(config.title && { title: config.title }),
      ...(config.headerLink && { headerLink: config.headerLink })
    };
  };

  const addWidgetAtOrigin = (widgetType: string) => {
    if (isLayoutLocked || !isWidgetType(widgetMapping, widgetType)) { return; }
    const widget = widgetMapping[widgetType];
    if (!widget) { return; }

    const newTemplate = Object.entries(template).reduce((acc, [size, layout]) => {
      const newWidget = {
        ...widget.defaults,
        w: Math.min(widget.defaults.w, defaultColumns[size as keyof typeof defaultColumns]),
        x: 0,
        y: 0,
        widgetType,
        i: getWidgetIdentifier(widgetType),
        title: 'New title',
        config: createSerializableConfig(widget.config)
      };

      return {
        ...acc,
        [size]: [
          newWidget,
          ...layout.map((item) => ({ ...item, y: item.y + newWidget.h })),
        ],
      };
    }, {} as ExtendedTemplateConfig);

    handleTemplateChange(newTemplate);
    setCurrentlyUsedWidgets(newTemplate.xl.map((item) => item.widgetType));
    analytics?.('widget-layout.widget-add', { data: widgetType });
  };

  const handleTemplateChange = (newTemplate: ExtendedTemplateConfig) => {
    setTemplate(newTemplate);
    onTemplateChange?.(newTemplate);
  };

  const handleDrawerExpandChange = (expanded: boolean) => {
    setDrawerOpen(expanded);
  };

  const handleActiveWidgetsChange = (widgetTypes: string[]) => {
    setCurrentlyUsedWidgets(widgetTypes);
  };

  const gridLayout = (
    <GridLayout
      widgetMapping={widgetMapping}
      template={template}
      onTemplateChange={handleTemplateChange}
      isLayoutLocked={isLayoutLocked}
      emptyStateComponent={emptyStateComponent}
      documentationLink={documentationLink}
      analytics={analytics}
      showEmptyState={showEmptyState}
      onDrawerExpandChange={handleDrawerExpandChange}
      onActiveWidgetsChange={handleActiveWidgetsChange}
      droppingWidgetType={droppingWidgetType}
    />
  );

  if (!showDrawer) {
    return gridLayout;
  }

  return (
    <>
      <Toolbar isSticky>
        <ToolbarContent>
          <ToolbarItem align={{ default: 'alignEnd' }}>
            <AddWidgetsButton onClick={() => setDrawerOpen(!drawerOpen)} />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <WidgetDrawer
        widgetMapping={widgetMapping}
        currentlyUsedWidgets={currentlyUsedWidgets}
        isOpen={drawerOpen}
        onOpenChange={setDrawerOpen}
        instructionText={drawerInstructionText}
        onWidgetDragStart={setDroppingWidgetType}
        onWidgetDragEnd={() => setDroppingWidgetType(undefined)}
        onWidgetAdd={addWidgetAtOrigin}
        isDisabled={isLayoutLocked}
      >
        {gridLayout}
      </WidgetDrawer>
    </>
  );
};

export default WidgetLayout;

