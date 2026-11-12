import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Flex,
  Gallery,
  GalleryItem,
  Icon,
  PageSection,
  Split,
  SplitItem,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import React, { useState } from 'react';
import CloseIcon from '@patternfly/react-icons/dist/esm/icons/close-icon';
import GripVerticalIcon from '@patternfly/react-icons/dist/esm/icons/grip-vertical-icon';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { WidgetMapping, WidgetConfiguration } from './types';

export type WidgetDrawerProps = React.PropsWithChildren<{
  /** Widget mapping definition */
  widgetMapping: WidgetMapping;
  /** List of currently used widget types (to filter out from drawer) */
  currentlyUsedWidgets?: string[];
  /** Whether the drawer is expanded */
  isOpen?: boolean;
  /** Callback when drawer open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Custom instruction text */
  instructionText?: string;
  /** Callback when widget drag starts from drawer */
  onWidgetDragStart?: (widgetType: string) => void;
  /** Callback when widget drag ends */
  onWidgetDragEnd?: () => void;
  /** Callback when a widget is added with the keyboard */
  onWidgetAdd?: (widgetType: string) => void;
  /** Whether additions are unavailable because the layout is locked */
  isDisabled?: boolean;
}>;

const WidgetWrapper = ({ widgetType, config, onDragStart, onDragEnd, onAdd, isDisabled }: {
  widgetType: string;
  config?: WidgetConfiguration;
  onDragStart: (widgetType: string) => void;
  onDragEnd: () => void;
  onAdd?: (widgetType: string) => void;
  isDisabled?: boolean;
}) => (
    <Card
      onDragStart={(e) => {
        const nodeRect = (e.target as HTMLElement).getBoundingClientRect();

        if (e.dataTransfer) {
          e.dataTransfer.setDragImage(
            e.target as HTMLDivElement,
            e.clientX - nodeRect.left,
            e.clientY - nodeRect.top
          );
        }

        if (e.dataTransfer) {
          e.dataTransfer.setData('text', widgetType);
        }

        onDragStart(widgetType);
      }}
      onDragEnd={onDragEnd}

      unselectable="on"
      draggable={!isDisabled}
      className="pf-v6-widget-grid-tile"
      ouiaId={`add-widget-card-${config?.title || widgetType}`}
    >
      <CardHeader
        className="pf-v6-widget-drawer__header"
        actions={{
          actions: (
            <>
              <Tooltip content={<p>Drag to add widget</p>}>
                <Icon className="pf-v6-widget-drawer__drag-handle">
                  <GripVerticalIcon />
                </Icon>
              </Tooltip>
              <Button
                variant="plain"
                className="pf-v6-widget-drawer__add-button"
                icon={<PlusCircleIcon />}
                aria-label={`Add ${config?.title || widgetType} widget to dashboard`}
                isDisabled={isDisabled}
                onClick={() => onAdd?.(widgetType)}
              />
            </>
          ),
          hasNoOffset: true,
        }}
      >
        <Flex className="pf-v6-widget-header-layout">
          {config?.icon && (
            <Icon size="md">
              {config.icon}
            </Icon>
          )}
          <CardTitle className="pf-v6-widget-grid-tile__title">{config?.title || widgetType}</CardTitle>
        </Flex>
      </CardHeader>
    </Card>
);

const WidgetDrawer = ({
  children,
  widgetMapping,
  currentlyUsedWidgets = [],
  isOpen: controlledIsOpen,
  onOpenChange,
  instructionText,
  onWidgetDragStart,
  onWidgetDragEnd,
  onWidgetAdd,
  isDisabled,
}: WidgetDrawerProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;

  const filteredWidgetMapping = Object.entries(widgetMapping).filter(([type]) => !currentlyUsedWidgets.includes(type));

  const defaultInstructionText = `Add new and previously removed widgets by clicking the icon, then drag and drop to a new location. Drag the corners of the cards to resize widgets.`;

  const panelContent = (
    <PageSection
      hasBodyWrapper={false}
      className="pf-v6-widget-page__main-section--drawer"
    >
      <Split>
        <SplitItem isFilled>
          <Title headingLevel="h2" size="md" className="pf-v6-widget-drawer__title">
            {instructionText || (
              <>
                {defaultInstructionText.split('icon').map((part, index) =>
                  index === 0 ? part : (
                    <React.Fragment key={`icon-${index}`}>
                      <GripVerticalIcon />
                      {part}
                    </React.Fragment>
                  )
                )}
              </>
            )}
          </Title>
        </SplitItem>
        <SplitItem>
          <Button
            variant="plain"
            className="pf-v6-widget-drawer__close-button"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            icon={<CloseIcon />}
            aria-label="Close widget drawer"
          />
        </SplitItem>
      </Split>
      <Gallery className="pf-v6-widget-gallery" hasGutter>
        {filteredWidgetMapping.map(([type, widget]) => (
            <GalleryItem key={type}>
              <WidgetWrapper
                widgetType={type}
                config={widget.config}
                onDragStart={(widgetType) => onWidgetDragStart?.(widgetType)}
                onDragEnd={() => onWidgetDragEnd?.()}
                onAdd={onWidgetAdd}
                isDisabled={isDisabled}
              />
            </GalleryItem>
          ))}
      </Gallery>
    </PageSection>
  );

  return (
    <>
      {isOpen && <div>{panelContent}</div>}
      {children}
    </>
  );
};

export default WidgetDrawer;
