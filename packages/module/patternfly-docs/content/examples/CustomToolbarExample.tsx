import React, { useState } from 'react';
import GridLayout from '../../../src/WidgetLayout/GridLayout';
import WidgetDrawer from '../../../src/WidgetLayout/WidgetDrawer';
import AddWidgetsButton from '../../../src/WidgetLayout/AddWidgetsButton';
import { WidgetMapping, ExtendedTemplateConfig } from '../../../src/WidgetLayout/types';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import ChartLineIcon from '@patternfly/react-icons/dist/esm/icons/chart-line-icon';
import BellIcon from '@patternfly/react-icons/dist/esm/icons/bell-icon';
import ShieldAltIcon from '@patternfly/react-icons/dist/esm/icons/shield-alt-icon';
import LockIcon from '@patternfly/react-icons/dist/esm/icons/lock-icon';
import LockOpenIcon from '@patternfly/react-icons/dist/esm/icons/lock-open-icon';
import UndoIcon from '@patternfly/react-icons/dist/esm/icons/undo-icon';
import ArrowRightIcon from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import {
  Card,
  CardBody,
  CardFooter,
  Content,
  ContentVariants,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Icon,
  List,
  ListItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Button,
  Tooltip,
} from '@patternfly/react-core';

// Widget content components
const ClusterOverviewWidget = () => (
  <Card isPlain isFullHeight>
    <CardBody>
      <DescriptionList isHorizontal isCompact>
        <DescriptionListGroup>
          <DescriptionListTerm>Clusters</DescriptionListTerm>
          <DescriptionListDescription>12</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Running</DescriptionListTerm>
          <DescriptionListDescription>10</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Degraded</DescriptionListTerm>
          <DescriptionListDescription>1</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Stopped</DescriptionListTerm>
          <DescriptionListDescription>1</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </CardBody>
    <CardFooter>
      <a href="#">
        View all clusters
        <Icon isInline><ArrowRightIcon /></Icon>
      </a>
    </CardFooter>
  </Card>
);

const RecentActivityWidget = () => (
  <Card isPlain isFullHeight>
    <CardBody>
      <Content component={ContentVariants.p}>Recent deployments and changes across your infrastructure.</Content>
      <List isPlain>
        <ListItem>Production deploy completed — 2 min ago</ListItem>
        <ListItem>Config update applied — 15 min ago</ListItem>
        <ListItem>New node added to cluster-03 — 1 hr ago</ListItem>
        <ListItem>Certificate renewed — 3 hr ago</ListItem>
      </List>
    </CardBody>
    <CardFooter>
      <a href="#">
        View full report
        <Icon isInline><ArrowRightIcon /></Icon>
      </a>
    </CardFooter>
  </Card>
);

const NotificationsWidget = () => (
  <Card isPlain isFullHeight>
    <CardBody>
      <List isPlain>
        <ListItem>3 alerts require attention</ListItem>
        <ListItem>Maintenance window scheduled for Saturday</ListItem>
        <ListItem>2 patches available</ListItem>
      </List>
    </CardBody>
    <CardFooter>
      <a href="https://www.patternfly.org">
        View all notifications
        <Icon isInline><ExternalLinkAltIcon /></Icon>
      </a>
    </CardFooter>
  </Card>
);

const ComplianceWidget = () => (
  <Card isPlain isFullHeight>
    <CardBody>
      <DescriptionList isHorizontal isCompact>
        <DescriptionListGroup>
          <DescriptionListTerm>Compliant</DescriptionListTerm>
          <DescriptionListDescription>87%</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Policies</DescriptionListTerm>
          <DescriptionListDescription>24 active</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Violations</DescriptionListTerm>
          <DescriptionListDescription>3 open</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </CardBody>
    <CardFooter>
      <a href="#">
        View compliance report
        <Icon isInline><ArrowRightIcon /></Icon>
      </a>
    </CardFooter>
  </Card>
);

// Widget mapping with four widgets
const widgetMapping: WidgetMapping = {
  'cluster-overview': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'Cluster Overview',
      icon: <CubeIcon />,
      headerLink: { title: 'View details', href: '#' },
    },
    renderWidget: () => <ClusterOverviewWidget />,
  },
  'recent-activity': {
    defaults: { w: 2, h: 4, maxH: 8, minH: 3 },
    config: {
      title: 'Recent Activity',
      icon: <ChartLineIcon />,
      headerLink: { title: 'View full report', href: '#' },
    },
    renderWidget: () => <RecentActivityWidget />,
  },
  'notifications': {
    defaults: { w: 1, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'Notifications',
      icon: <BellIcon />,
    },
    renderWidget: () => <NotificationsWidget />,
  },
  'compliance': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'Compliance',
      icon: <ShieldAltIcon />,
      headerLink: { title: 'View report', href: '#' },
    },
    renderWidget: () => <ComplianceWidget />,
  },
};

// Initial template — only 2 of 4 widgets placed, leaving 2 for the drawer
const initialTemplate: ExtendedTemplateConfig = {
  xl: [
    { i: 'cluster-overview#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'cluster-overview', title: 'Cluster Overview' },
    { i: 'recent-activity#1', x: 2, y: 0, w: 2, h: 4, widgetType: 'recent-activity', title: 'Recent Activity' },
  ],
  lg: [
    { i: 'cluster-overview#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'cluster-overview', title: 'Cluster Overview' },
    { i: 'recent-activity#1', x: 0, y: 3, w: 2, h: 4, widgetType: 'recent-activity', title: 'Recent Activity' },
  ],
  md: [
    { i: 'cluster-overview#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'cluster-overview', title: 'Cluster Overview' },
    { i: 'recent-activity#1', x: 0, y: 3, w: 2, h: 4, widgetType: 'recent-activity', title: 'Recent Activity' },
  ],
  sm: [
    { i: 'cluster-overview#1', x: 0, y: 0, w: 1, h: 3, widgetType: 'cluster-overview', title: 'Cluster Overview' },
    { i: 'recent-activity#1', x: 0, y: 3, w: 1, h: 4, widgetType: 'recent-activity', title: 'Recent Activity' },
  ],
};

export const CustomToolbarExample: React.FunctionComponent = () => {
  const [template, setTemplate] = useState(initialTemplate);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [currentlyUsedWidgets, setCurrentlyUsedWidgets] = useState<string[]>([]);

  const handleReset = () => {
    setTemplate(initialTemplate);
    setDrawerOpen(false);
  };

  return (
    <div style={{ height: '800px', overflowY: 'scroll' }}>
      <Toolbar isSticky>
        <ToolbarContent>
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <ToolbarItem>
              <Tooltip content={isLocked ? 'Unlock layout' : 'Lock layout'}>
                <Button
                  variant="plain"
                  onClick={() => setIsLocked(!isLocked)}
                  icon={isLocked ? <LockIcon /> : <LockOpenIcon />}
                  aria-label={isLocked ? 'Unlock layout' : 'Lock layout'}
                />
              </Tooltip>
            </ToolbarItem>
            <ToolbarItem>
              <Tooltip content="Reset layout">
                <Button
                  variant="plain"
                  onClick={handleReset}
                  icon={<UndoIcon />}
                  aria-label="Reset layout"
                />
              </Tooltip>
            </ToolbarItem>
            <ToolbarItem>
              <AddWidgetsButton onClick={() => setDrawerOpen(!drawerOpen)} isDisabled={isLocked} />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <WidgetDrawer
        widgetMapping={widgetMapping}
        currentlyUsedWidgets={currentlyUsedWidgets}
        isOpen={drawerOpen && !isLocked}
        onOpenChange={setDrawerOpen}
      >
        <GridLayout
          widgetMapping={widgetMapping}
          template={template}
          onTemplateChange={setTemplate}
          isLayoutLocked={isLocked}
          showEmptyState
          onActiveWidgetsChange={setCurrentlyUsedWidgets}
        />
      </WidgetDrawer>
    </div>
  );
};
