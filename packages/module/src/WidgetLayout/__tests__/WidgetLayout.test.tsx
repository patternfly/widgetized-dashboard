import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const twoWidgetMapping: WidgetMapping = {
  ...mockWidgetMapping,
  'new-widget': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: { title: 'New Widget' },
    renderWidget: (id) => <div data-testid={`new-widget-${id}`}>New Widget Content</div>
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

  it('adds a widget to the top-left with the keyboard', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <WidgetLayout
        widgetMapping={twoWidgetMapping}
        initialTemplate={mockTemplate}
        onTemplateChange={handleChange}
        initialDrawerOpen={true}
      />
    );

    const widgetCard = screen.getByRole('button', { name: /New Widget/ });
    widgetCard.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('New Widget Content')).toBeInTheDocument();
    expect(handleChange).toHaveBeenLastCalledWith(expect.objectContaining({
      xl: [
        expect.objectContaining({ widgetType: 'new-widget', x: 0, y: 0 }),
        expect.objectContaining({ i: 'test-widget#1', y: 3 }),
      ],
      sm: [
        expect.objectContaining({ widgetType: 'new-widget', x: 0, y: 0, w: 1 }),
        expect.objectContaining({ i: 'test-widget#1', y: 3 }),
      ],
    }));
  });
});

