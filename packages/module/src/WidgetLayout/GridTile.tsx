import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Divider,
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
import { CompressIcon, EllipsisVIcon, ExpandIcon, GripVerticalIcon, LockIcon, MinusCircleIcon, UnlockIcon } from '@patternfly/react-icons';
import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Layout } from 'react-grid-layout';
import { ExtendedLayoutItem, WidgetConfiguration, AnalyticsTracker } from './types';

export type SetWidgetAttribute = <T extends string | number | boolean>(id: string, attributeName: keyof ExtendedLayoutItem, value: T) => void;

export type GridTileProps = React.PropsWithChildren<{
  widgetType: string;
  icon?: React.ReactNode;
  setIsDragging: (isDragging: boolean) => void;
  isDragging: boolean;
  setWidgetAttribute: SetWidgetAttribute;
  widgetConfig: Layout & {
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
          ouiaId="autosize-widget"
          isDisabled={isMaximized || widgetConfig.static}
          onClick={() => {
            setWidgetAttribute(widgetConfig.i, 'h', widgetConfig.maxH ?? widgetConfig.h);
            setIsOpen(false);
          }}
          icon={<ExpandIcon />}
        >
          Autosize height to content
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
            <Icon className="pf-v6-u-pb-2xl" status={widgetConfig.static ? undefined : 'danger'}>
              <MinusCircleIcon />
            </Icon>
          }
          isDisabled={widgetConfig.static}
        >
          Remove
          <HelperText>
            <HelperTextItem className="pf-v6-u-text-wrap">
              {"All 'removed' widgets can be added back by clicking the 'Add widgets' button."}
            </HelperTextItem>
          </HelperText>
        </DropdownItem>
      </>
    );
  }, [widgetConfig.h, widgetConfig.maxH, widgetConfig.minH, widgetConfig.static, widgetConfig.i, setWidgetAttribute, removeWidget, analytics, widgetType]);

  const headerActions = (
    <>
      <Tooltip content={<p>Actions</p>}>
        <Dropdown
          ouiaId={`${widgetType}-widget`}
          popperProps={{
            appendTo: document.body,
            maxWidth: '300px',
            position: 'right',
          }}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              isExpanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
              variant="plain"
              aria-label="widget actions menu toggle"
            >
              <EllipsisVIcon aria-hidden="true" />
            </MenuToggle>
          )}
          isOpen={isOpen}
          onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
        >
          <DropdownList>{dropdownItems}</DropdownList>
        </Dropdown>
      </Tooltip>
      <Tooltip aria-label="Move widget" content={<p>{widgetConfig.static ? 'Widget locked' : 'Move'}</p>}>
        <Icon
          onMouseDown={() => {
            setIsDragging(true);
            analytics?.('widget-layout.widget-move', { widgetType });
          }}
          onMouseUp={() => setIsDragging(false)}
          className={clsx('drag-handle', {
            dragging: isDragging,
          })}
        >
          <GripVerticalIcon style={{ fill: 'var(--pf-t--global--icon--color--subtle)' }} />
        </Icon>
      </Tooltip>
    </>
  );

  return (
    <Card
      ouiaId={`${widgetType}-widget`}
      className={clsx('grid-tile', {
        static: widgetConfig.static,
      })}
    >
      <CardHeader className="pf-v6-u-pr-lg" actions={{ actions: headerActions }}>
        <Flex>
          <Flex className="pf-v6-u-flex-direction-row pf-v6-u-flex-nowrap">
            {widgetConfig?.config?.icon && (
              <div className="pf-v6-u-align-self-flex-start widg-c-icon--header pf-v6-u-mr-sm">
                {isLoaded ? widgetConfig.config.icon : <Skeleton shape="circle" width="25px" height="25px" />}
              </div>
            )}
            <Flex className="pf-v6-u-flex-direction-row widg-card-header-text">
              {isLoaded ? (
                <CardTitle
                  style={{
                    userSelect: isDragging ? 'none' : 'auto',
                  }}
                  className="pf-v6-u-align-self-flex-start"
                >
                  {widgetConfig?.config?.title || widgetType}
                </CardTitle>
              ) : (
                <Skeleton width="50%" />
              )}
              {hasHeader && isLoaded && (
                <FlexItem>
                  <Button
                    className="pf-v6-u-font-weight-bold pf-v6-u-font-size-xs pf-v6-u-p-0"
                    variant="link"
                    component={(props) => <Link {...props} to={linkHref} target={linkTarget} />}
                  >
                    {headerLink.title}
                  </Button>
                </FlexItem>
              )}
            </Flex>
          </Flex>
        </Flex>
      </CardHeader>
      <Divider />
      <CardBody className="pf-v6-u-p-0">{children}</CardBody>
    </Card>
  );
};

export default GridTile;

