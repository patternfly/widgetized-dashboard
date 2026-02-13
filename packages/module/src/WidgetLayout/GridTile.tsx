import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  HelperText,
  HelperTextItem,
  Icon,
  MenuToggle,
  MenuToggleElement,
  Skeleton,
  Tooltip,
} from '@patternfly/react-core';
import CompressIcon from '@patternfly/react-icons/dist/esm/icons/compress-icon';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-icon';
import GripVerticalIcon from '@patternfly/react-icons/dist/esm/icons/grip-vertical-icon';
import LockIcon from '@patternfly/react-icons/dist/esm/icons/lock-icon';
import MinusCircleIcon from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import UnlockIcon from '@patternfly/react-icons/dist/esm/icons/unlock-icon';
import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { LayoutItem } from 'react-grid-layout';
import { ExtendedLayoutItem, WidgetConfiguration, AnalyticsTracker } from './types';

export type SetWidgetAttribute = <T extends string | number | boolean>(id: string, attributeName: keyof ExtendedLayoutItem, value: T) => void;

export type GridTileProps = React.PropsWithChildren<{
  widgetType: string;
  icon?: React.ReactNode;
  setIsDragging: (isDragging: boolean) => void;
  isDragging: boolean;
  setWidgetAttribute: SetWidgetAttribute;
  widgetConfig: LayoutItem & {
    colWidth: number;
    locked?: boolean;
    config?: WidgetConfiguration;
  };
  removeWidget: (id: string) => void;
  children: React.ReactNode;
  isLoaded?: boolean;
  analytics?: AnalyticsTracker;
}>;

const GridTile = ({
  widgetType,
  isDragging,
  setIsDragging,
  setWidgetAttribute,
  widgetConfig,
  removeWidget,
  children,
  isLoaded = true,
  analytics,
}: GridTileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { headerLink } = widgetConfig.config || {};
  const hasHeader = headerLink && headerLink.href && headerLink.title;

  const [linkHref, linkTarget] = useMemo(() => {
    if (!headerLink?.href) {
      return [];
    }

    try {
      const url = new URL(headerLink.href);
      return url.origin === window.location.origin ? [url.pathname, undefined] : [headerLink.href, '_blank'];
    } catch {
      return [headerLink.href];
    }
  }, [headerLink?.href]);

  const dropdownItems = useMemo(() => {
    const isMaximized = widgetConfig.h === widgetConfig.maxH;
    const isMinimized = widgetConfig.h === widgetConfig.minH;
    return (
      <>
        <DropdownItem
          ouiaId={widgetConfig.static ? 'unlock-widget' : 'lock-widget'}
          onClick={() => {
            setIsOpen(false);
            setWidgetAttribute(widgetConfig.i, 'static', !widgetConfig.static);
          }}
          icon={widgetConfig.static ? <UnlockIcon /> : <LockIcon />}
        >
          {widgetConfig.static ? 'Unlock location and size' : 'Lock location and size'}
        </DropdownItem>
        <DropdownItem
          ouiaId="maximize-widget"
          isDisabled={isMaximized || widgetConfig.static}
          onClick={() => {
            setWidgetAttribute(widgetConfig.i, 'h', widgetConfig.maxH ?? widgetConfig.h);
            setIsOpen(false);
          }}
          icon={<ExpandIcon />}
        >
          Maximize height
        </DropdownItem>
        <DropdownItem
          ouiaId="minimize-widget"
          onClick={() => {
            setWidgetAttribute(widgetConfig.i, 'h', widgetConfig.minH ?? widgetConfig.h);
            setIsOpen(false);
          }}
          isDisabled={isMinimized || widgetConfig.static}
          icon={<CompressIcon />}
        >
          Minimize height
        </DropdownItem>
        <DropdownItem
          ouiaId="remove-widget"
          onClick={() => {
            removeWidget(widgetConfig.i);
            analytics?.('widget-layout.widget-remove', { widgetType });
          }}
          icon={
            <Icon className="pf-v6-widget-grid-tile__remove-icon" status={widgetConfig.static ? undefined : 'danger'}>
              <MinusCircleIcon />
            </Icon>
          }
          isDisabled={widgetConfig.static}
        >
          Remove
          <HelperText>
            <HelperTextItem className="pf-v6-widget-grid-tile__remove-helper-text">
              {"All 'removed' widgets can be added back by clicking the 'Add widgets' button."}
            </HelperTextItem>
          </HelperText>
        </DropdownItem>
      </>
    );
  }, [widgetConfig.h, widgetConfig.maxH, widgetConfig.minH, widgetConfig.static, widgetConfig.i, setWidgetAttribute, removeWidget, analytics, widgetType]);

  const headerActions = (
    <>
      <Dropdown
          ouiaId={`${widgetType}-widget`}
          popperProps={{
            appendTo: document.body,
            maxWidth: '300px',
            position: 'right',
          }}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              className="pf-v6-widget-grid-tile__menu-toggle"
              ref={toggleRef}
              isExpanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
              variant="plain"
              aria-label="Widget actions"
            >
              <EllipsisVIcon aria-hidden="true" />
            </MenuToggle>
          )}
          isOpen={isOpen}
          onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
        >
          <DropdownList>{dropdownItems}</DropdownList>
        </Dropdown>
      <Tooltip content={<p>{widgetConfig.static ? 'Widget locked' : 'Move'}</p>}>
        <Icon
          onMouseDown={() => {
            setIsDragging(true);
            analytics?.('widget-layout.widget-move', { widgetType });
          }}
          onMouseUp={() => setIsDragging(false)}
          className={clsx('pf-v6-widget-drag-handle', {
            'pf-v6-widget-drag-handle--dragging': isDragging,
          })}
        >
          <GripVerticalIcon />
        </Icon>
      </Tooltip>
    </>
  );

  return (
    <Card
      {...widgetConfig.config?.wrapperProps}
      ouiaId={`${widgetType}-widget`}
      className={clsx('pf-v6-widget-grid-tile', widgetConfig.config?.wrapperProps?.className, {
        'pf-v6-widget-grid-tile--static': widgetConfig.static,
      })}
    >
      <CardHeader className="pf-v6-widget-grid-tile__header" actions={{ actions: headerActions }}>
        <Flex>
          <Flex className="pf-v6-widget-header-layout">
            {widgetConfig?.config?.icon && (
              <Icon size="md">
                {isLoaded ? widgetConfig.config.icon : <Skeleton shape="circle" width="25px" height="25px" />}
              </Icon>
            )}
            <Flex className="pf-v6-widget-card-header-text">
              {isLoaded ? (
                <CardTitle
                  className={clsx('pf-v6-widget-grid-tile__title', {
                    'pf-v6-widget-grid-tile__title--dragging': isDragging,
                  })}
                >
                  {widgetConfig?.config?.title || widgetType}
                </CardTitle>
              ) : (
                <Skeleton width="50%" />
              )}
              {hasHeader && isLoaded && (
                <FlexItem>
                  <Button
                    className="pf-v6-widget-grid-tile__header-link"
                    variant="link"
                    component="a"
                    href={linkHref}
                    target={linkTarget}
                  >
                    {headerLink.title}
                  </Button>
                </FlexItem>
              )}
            </Flex>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody {...widgetConfig.config?.cardBodyProps} className={clsx('pf-v6-widget-grid-tile__body', widgetConfig.config?.cardBodyProps?.className)}>{children}</CardBody>
    </Card>
  );
};

export default GridTile;
