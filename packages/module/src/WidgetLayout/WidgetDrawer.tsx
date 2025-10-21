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
import { CloseIcon, GripVerticalIcon } from '@patternfly/react-icons';
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
}>;

const WidgetWrapper = ({ widgetType, config, onDragStart, onDragEnd }: {
  widgetType: string;
  config?: WidgetConfiguration;
  onDragStart: (widgetType: string) => void;
  onDragEnd: () => void;
}) => {
  const headerActions = (
    <Tooltip content={<p>Drag to add widget</p>}>
      <Icon className="pf-v6-u-pt-md widg-c-drawer__drag-handle">
        <GripVerticalIcon style={{ fill: 'var(--pf-t--global--icon--color--subtle)' }} />
      </Icon>
    </Tooltip>
  );
  
  return (
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
      draggable={true}
      className="grid-tile"
      ouiaId={`add-widget-card-${config?.title || widgetType}`}
    >
      <CardHeader className="pf-v6-u-py-md widg-c-drawer__header" actions={{ actions: headerActions }}>
        <Flex className="pf-v6-u-flex-direction-row pf-v6-u-flex-nowrap">
          {config?.icon && (
            <div className="pf-v6-u-align-self-flex-start widg-c-icon--header pf-v6-u-mr-sm">
              {config.icon}
            </div>
          )}
          <CardTitle className="pf-v6-u-align-self-flex-start">{config?.title || widgetType}</CardTitle>
        </Flex>
      </CardHeader>
    </Card>
  );
};

const WidgetDrawer = ({
  children,
  widgetMapping,
  currentlyUsedWidgets = [],
  isOpen: controlledIsOpen,
  onOpenChange,
  instructionText,
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
      className="widg-c-page__main-section--drawer pf-v6-u-p-md pf-v6-u-p-lg-on-sm"
      style={{
        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
      }}
    >
      <Split className="widg-l-split--add-widget">
        <SplitItem isFilled>
          <Title headingLevel="h2" size="md" className="pf-v6-u-pb-sm">
            {instructionText || (
              <>
                {defaultInstructionText.split('icon').map((part, i) => 
                  i === 0 ? part : (
                    <React.Fragment key={i}>
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
            className="pf-v6-u-pt-0 pf-v6-u-pr-0"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            icon={<CloseIcon />}
            aria-label="Close widget drawer"
          />
        </SplitItem>
      </Split>
      <Gallery className="widg-l-gallery pf-v6-u-pt-sm" hasGutter>
        {filteredWidgetMapping.map(([type, widget], i) => (
            <GalleryItem key={i}>
              <WidgetWrapper
                widgetType={type}
                config={widget.config}
                onDragStart={() => {}}
                onDragEnd={() => {}}
              />
            </GalleryItem>
          ))}
      </Gallery>
    </PageSection>
  );
  
  return (
    <>
      {isOpen ? <div>{panelContent}</div> : null}
      {children}
    </>
  );
};

export default WidgetDrawer;

