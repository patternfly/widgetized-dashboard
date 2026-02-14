import React from 'react';
import WidgetLayout from '../../../src/WidgetLayout/WidgetLayout';
import { WidgetMapping, ExtendedTemplateConfig } from '../../../src/WidgetLayout/types';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import ChartLineIcon from '@patternfly/react-icons/dist/esm/icons/chart-line-icon';
import BellIcon from '@patternfly/react-icons/dist/esm/icons/bell-icon';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import ArrowRightIcon from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon';
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
} from '@patternfly/react-core';

// A simple overview widget with key stats
const OverviewWidget = () => (
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
        <Icon isInline>
          <ArrowRightIcon />
        </Icon>
      </a>
    </CardFooter>
  </Card>
);

// A widget showing recent activity
const ActivityWidget = () => (
  <Card isPlain isFullHeight>
    <CardBody>
      <Content component={ContentVariants.p}>Recent deployments and changes across your infrastructure.</Content>
      <List isPlain>
        <ListItem>Production deploy completed — 2 min ago</ListItem>
        <ListItem>Config update applied — 15 min ago</ListItem>
        <ListItem>New node added to cluster-03 — 1 hr ago</ListItem>
        <ListItem>Certificate renewed — 3 hr ago</ListItem>
        <ListItem>Scaling policy triggered — 5 hr ago</ListItem>
      </List>
    </CardBody>
    <CardFooter>
      <a href="#">
        View full report
        <Icon isInline>
          <ArrowRightIcon />
        </Icon>
      </a>
    </CardFooter>
  </Card>
);

// A notifications widget
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
        <Icon isInline>
          <ExternalLinkAltIcon />
        </Icon>
      </a>
    </CardFooter>
  </Card>
);

// Define widget mapping
const widgetMapping: WidgetMapping = {
  'overview-widget': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'Cluster Overview',
      icon: <CubeIcon />,
      headerLink: {
        title: 'View details',
        href: '#'
      }
    },
    renderWidget: () => <OverviewWidget />
  },
  'activity-widget': {
    defaults: { w: 2, h: 4, maxH: 8, minH: 3 },
    config: {
      title: 'Recent Activity',
      icon: <ChartLineIcon />,
      headerLink: {
        title: 'View full report',
        href: '#'
      }
    },
    renderWidget: () => <ActivityWidget />
  },
  'notifications-widget': {
    defaults: { w: 1, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'Notifications',
      icon: <BellIcon />
    },
    renderWidget: () => <NotificationsWidget />
  }
};

// Define initial template
const initialTemplate: ExtendedTemplateConfig = {
  xl: [
    { i: 'overview-widget#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'overview-widget', title: 'Cluster Overview' },
    { i: 'activity-widget#1', x: 2, y: 0, w: 2, h: 4, widgetType: 'activity-widget', title: 'Recent Activity' },
  ],
  lg: [
    { i: 'overview-widget#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'overview-widget', title: 'Cluster Overview' },
    { i: 'activity-widget#1', x: 0, y: 3, w: 2, h: 4, widgetType: 'activity-widget', title: 'Recent Activity' },
  ],
  md: [
    { i: 'overview-widget#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'overview-widget', title: 'Cluster Overview' },
    { i: 'activity-widget#1', x: 0, y: 3, w: 2, h: 4, widgetType: 'activity-widget', title: 'Recent Activity' },
  ],
  sm: [
    { i: 'overview-widget#1', x: 0, y: 0, w: 1, h: 3, widgetType: 'overview-widget', title: 'Cluster Overview' },
    { i: 'activity-widget#1', x: 0, y: 3, w: 1, h: 4, widgetType: 'activity-widget', title: 'Recent Activity' },
  ]
};

export const BasicExample: React.FunctionComponent = () => {
  const [template, setTemplate] = React.useState(initialTemplate);

  return (
    <div style={{ height: '800px', overflowY: 'scroll' }}>
      <WidgetLayout
        widgetMapping={widgetMapping}
        initialTemplate={template}
        onTemplateChange={setTemplate}
        documentationLink="https://www.patternfly.org"
        initialDrawerOpen={true}
      />
    </div>
  );
};
