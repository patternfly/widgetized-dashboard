import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WidgetLayout from '../WidgetLayout';
import { WidgetMapping, ExtendedTemplateConfig } from '../types';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';

const mockWidgetMapping: WidgetMapping = {
  'test-widget': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'Test Widget',
      icon: <CubeIcon />
    },
    renderWidget: (id) => <div data-testid={`widget-${id}`}>Test Widget Content</div>
  }
};

const mockTemplate: ExtendedTemplateConfig = {
  xl: [
    { i: 'test-widget#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'test-widget', title: 'Test Widget' }
  ],
  lg: [
    { i: 'test-widget#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'test-widget', title: 'Test Widget' }
  ],
  md: [
    { i: 'test-widget#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'test-widget', title: 'Test Widget' }
  ],
  sm: [
    { i: 'test-widget#1', x: 0, y: 0, w: 1, h: 3, widgetType: 'test-widget', title: 'Test Widget' }
  ]
};

const emptyTemplate: ExtendedTemplateConfig = {
  xl: [],
  lg: [],
  md: [],
  sm: []
};

describe('WidgetLayout', () => {
  it('renders without crashing', () => {
    render(
      <WidgetLayout
        widgetMapping={mockWidgetMapping}
        initialTemplate={mockTemplate}
      />
    );
    expect(screen.getByTestId('widget-test-widget#1')).toBeInTheDocument();
  });

  it('shows empty state when no widgets are present', () => {
    render(
      <WidgetLayout
        widgetMapping={mockWidgetMapping}
        initialTemplate={emptyTemplate}
      />
    );
    expect(screen.getByText(/No dashboard content/i)).toBeInTheDocument();
  });

  it('hides empty state when showEmptyState is false', () => {
    render(
      <WidgetLayout
        widgetMapping={mockWidgetMapping}
        initialTemplate={emptyTemplate}
        showEmptyState={false}
      />
    );
    expect(screen.queryByText(/No dashboard content/i)).not.toBeInTheDocument();
  });

  it('hides drawer when showDrawer is false', () => {
    render(
      <WidgetLayout
        widgetMapping={mockWidgetMapping}
        initialTemplate={emptyTemplate}
        showDrawer={false}
        showEmptyState={false}
      />
    );
    // Drawer instructions should not be present
    expect(screen.queryByText(/Add new and previously removed widgets/i)).not.toBeInTheDocument();
  });

  it('renders widget with custom title', () => {
    render(
      <WidgetLayout
        widgetMapping={mockWidgetMapping}
        initialTemplate={mockTemplate}
      />
    );
    expect(screen.getByText('Test Widget')).toBeInTheDocument();
  });

  it('passes onTemplateChange callback to GridLayout', () => {
    const handleChange = jest.fn();
    render(
      <WidgetLayout
        widgetMapping={mockWidgetMapping}
        initialTemplate={mockTemplate}
        onTemplateChange={handleChange}
      />
    );
    // onTemplateChange is invoked by GridLayout during initial layout setup
    expect(handleChange).toHaveBeenCalled();
  });
});

