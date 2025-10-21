import React, { useState } from 'react';
import GridLayout from './GridLayout';
import WidgetDrawer from './WidgetDrawer';
import { ExtendedTemplateConfig, WidgetMapping, AnalyticsTracker } from './types';

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
    />
  );

  if (!showDrawer) {
    return gridLayout;
  }

  return (
    <WidgetDrawer
      widgetMapping={widgetMapping}
      currentlyUsedWidgets={currentlyUsedWidgets}
      isOpen={drawerOpen}
      onOpenChange={setDrawerOpen}
      instructionText={drawerInstructionText}
    >
      {gridLayout}
    </WidgetDrawer>
  );
};

export default WidgetLayout;

