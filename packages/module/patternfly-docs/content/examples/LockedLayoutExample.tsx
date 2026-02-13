import React from 'react';
import WidgetLayout from '../../../src/WidgetLayout/WidgetLayout';
import { WidgetMapping, ExtendedTemplateConfig } from '../../../src/WidgetLayout/types';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import ChartLineIcon from '@patternfly/react-icons/dist/esm/icons/chart-line-icon';
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

// Define widget mapping
const widgetMapping: WidgetMapping = {
  'cluster-overview': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'Cluster Overview',
      icon: <CubeIcon />,
      headerLink: {
        title: 'View details',
        href: '#'
      }
    },
    renderWidget: () => <ClusterOverviewWidget />
  },
  'recent-activity': {
    defaults: { w: 2, h: 4, maxH: 8, minH: 3 },
    config: {
      title: 'Recent Activity',
      icon: <ChartLineIcon />,
      headerLink: {
        title: 'View full report',
        href: '#'
      }
    },
    renderWidget: () => <RecentActivityWidget />
  }
};

// Define initial template with locked widgets
const initialTemplate: ExtendedTemplateConfig = {
  xl: [
    { i: 'cluster-overview#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'cluster-overview', title: 'Cluster Overview', static: true },
    { i: 'recent-activity#1', x: 2, y: 0, w: 2, h: 4, widgetType: 'recent-activity', title: 'Recent Activity', static: true }
  ],
  lg: [
    { i: 'cluster-overview#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'cluster-overview', title: 'Cluster Overview', static: true },
    { i: 'recent-activity#1', x: 0, y: 3, w: 2, h: 4, widgetType: 'recent-activity', title: 'Recent Activity', static: true }
  ],
  md: [
    { i: 'cluster-overview#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'cluster-overview', title: 'Cluster Overview', static: true },
    { i: 'recent-activity#1', x: 0, y: 3, w: 2, h: 4, widgetType: 'recent-activity', title: 'Recent Activity', static: true }
  ],
  sm: [
    { i: 'cluster-overview#1', x: 0, y: 0, w: 1, h: 3, widgetType: 'cluster-overview', title: 'Cluster Overview', static: true },
    { i: 'recent-activity#1', x: 0, y: 3, w: 1, h: 4, widgetType: 'recent-activity', title: 'Recent Activity', static: true }
  ]
};

export const LockedLayoutExample: React.FunctionComponent = () => (
  <div style={{ height: '600px', overflowY: 'scroll' }}>
    <WidgetLayout
      widgetMapping={widgetMapping}
      initialTemplate={initialTemplate}
      isLayoutLocked={true}
      showDrawer={false}
    />
  </div>
);
