import React from 'react';
import WidgetLayout from '../../../src/WidgetLayout/WidgetLayout';
import { WidgetMapping, ExtendedTemplateConfig } from '../../../src/WidgetLayout/types';
import { CubeIcon, ChartLineIcon } from '@patternfly/react-icons';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';

// Example widget content components
const ExampleWidget1 = () => (
  <Card isPlain>
    <CardBody>
      <CardTitle>Example Widget 1</CardTitle>
      <p>This is the content of the first example widget.</p>
      <p>You can put any React content here!</p>
    </CardBody>
  </Card>
);

const ExampleWidget2 = () => (
  <Card isPlain>
    <CardBody>
      <CardTitle>Chart Widget</CardTitle>
      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Chart content would go here</p>
      </div>
    </CardBody>
  </Card>
);

// Define widget mapping
const widgetMapping: WidgetMapping = {
  'example-widget-1': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'Example Widget',
      icon: <CubeIcon />,
      headerLink: {
        title: 'View details',
        href: '#'
      }
    },
    renderWidget: () => <ExampleWidget1 />
  },
  'chart-widget': {
    defaults: { w: 2, h: 4, maxH: 8, minH: 3 },
    config: {
      title: 'Performance Chart',
      icon: <ChartLineIcon />
    },
    renderWidget: () => <ExampleWidget2 />
  }
};

// Define initial template
const initialTemplate: ExtendedTemplateConfig = {
  xl: [
    { i: 'example-widget-1#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'example-widget-1', title: 'Example Widget' },
    { i: 'chart-widget#1', x: 2, y: 0, w: 2, h: 4, widgetType: 'chart-widget', title: 'Performance Chart' }
  ],
  lg: [
    { i: 'example-widget-1#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'example-widget-1', title: 'Example Widget' },
    { i: 'chart-widget#1', x: 0, y: 3, w: 2, h: 4, widgetType: 'chart-widget', title: 'Performance Chart' }
  ],
  md: [
    { i: 'example-widget-1#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'example-widget-1', title: 'Example Widget' },
    { i: 'chart-widget#1', x: 0, y: 3, w: 2, h: 4, widgetType: 'chart-widget', title: 'Performance Chart' }
  ],
  sm: [
    { i: 'example-widget-1#1', x: 0, y: 0, w: 1, h: 3, widgetType: 'example-widget-1', title: 'Example Widget' },
    { i: 'chart-widget#1', x: 0, y: 3, w: 1, h: 4, widgetType: 'chart-widget', title: 'Performance Chart' }
  ]
};

export const LockedLayoutExample: React.FunctionComponent = () => (
  <div style={{ height: '600px' }}>
    <WidgetLayout
      widgetMapping={widgetMapping}
      initialTemplate={initialTemplate}
      isLayoutLocked={true}
      showDrawer={false}
    />
  </div>
);

