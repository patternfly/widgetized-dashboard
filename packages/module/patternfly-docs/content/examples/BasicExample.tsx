import React from 'react';
import WidgetLayout from '../../../src/WidgetLayout/WidgetLayout';
import { WidgetMapping, ExtendedTemplateConfig } from '../../../src/WidgetLayout/types';
import { CubeIcon, ChartLineIcon, BellIcon, ExternalLinkAltIcon, ArrowRightIcon } from '@patternfly/react-icons';
import { Card, CardBody, CardFooter, Content, Icon } from '@patternfly/react-core';

interface SimpleWidgetProps {
  id: number;
  body: string;
  linkTitle: string;
  url: string;
  isExternal?: boolean;
}

const CardExample: React.FunctionComponent<SimpleWidgetProps> = (props) => (
  <Card isPlain>
    <CardBody className="pf-v6-u-p-md pf-v6-u-pb-0">
      <Content
        key={props.id}
        className="pf-v6-u-display-flex pf-v6-u-flex-direction-column"
      >
        <Content component="p" className="pf-v6-u-flex-grow-1">
          {props.body}
        </Content>
      </Content>
    </CardBody>
    <CardFooter className="pf-v6-u-p-md">
      {props.isExternal ? (
        <a href={props.url}>
          {props.linkTitle}
          <Icon className="pf-v6-u-ml-sm" isInline>
            <ExternalLinkAltIcon />
          </Icon>
        </a>
      ) : (
        <a href={props.url}>
          {props.linkTitle}
          <Icon className="pf-v6-u-ml-sm" isInline>
            <ArrowRightIcon />
          </Icon>
        </a>
      )}
    </CardFooter>
  </Card>
);

// Example widget content components
const ExampleWidget1 = () => (
  <CardExample
    id={1}
    body="This is the content of the first example widget. You can put any React content here!"
    linkTitle="View details"
    url="https://www.patternfly.org"
    isExternal={true}
  />
);

const ExampleWidget2 = () => (
  <CardExample
    id={2}
    body="Chart and visualization content would be displayed here."
    linkTitle="View full report"
    url="#"
    isExternal={false}
  />
);

const ExampleWidget3 = () => (
  <CardExample
    id={3}
    body="Recent notifications and updates will appear in this widget."
    linkTitle="View all notifications"
    url="#"
    isExternal={false}
  />
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
      title: 'Chart Widget',
      icon: <ChartLineIcon />
    },
    renderWidget: () => <ExampleWidget2 />
  },
  'notifications-widget': {
    defaults: { w: 1, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'Notification Widget',
      icon: <BellIcon />
    },
    renderWidget: () => <ExampleWidget3 />
  }
};

// Define initial template
const initialTemplate: ExtendedTemplateConfig = {
  xl: [
    { i: 'example-widget-1#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'example-widget-1', title: 'Example Widget' },
    { i: 'chart-widget#1', x: 2, y: 0, w: 2, h: 4, widgetType: 'chart-widget', title: 'Chart Widget' }
  ],
  lg: [
    { i: 'example-widget-1#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'example-widget-1', title: 'Example Widget' },
    { i: 'chart-widget#1', x: 0, y: 3, w: 2, h: 4, widgetType: 'chart-widget', title: 'Chart Widget' }
  ],
  md: [
    { i: 'example-widget-1#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'example-widget-1', title: 'Example Widget' },
    { i: 'chart-widget#1', x: 0, y: 3, w: 2, h: 4, widgetType: 'chart-widget', title: 'Chart Widget' }
  ],
  sm: [
    { i: 'example-widget-1#1', x: 0, y: 0, w: 1, h: 3, widgetType: 'example-widget-1', title: 'Example Widget' },
    { i: 'chart-widget#1', x: 0, y: 3, w: 1, h: 4, widgetType: 'chart-widget', title: 'Chart Widget' }
  ]
};

export const BasicExample: React.FunctionComponent = () => {
  const [template, setTemplate] = React.useState(initialTemplate);

  return (
    <div style={{ height: '600px', width: '100%', overflow: 'auto', position: 'relative', isolation: 'isolate' }}>
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
