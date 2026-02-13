import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WidgetDrawer from '../WidgetDrawer';
import { WidgetMapping } from '../types';

const widgetMapping: WidgetMapping = {
  'widget-a': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: { title: 'Widget A' },
    renderWidget: () => <div>A</div>,
  },
  'widget-b': {
    defaults: { w: 1, h: 3, maxH: 6, minH: 2 },
    config: { title: 'Widget B' },
    renderWidget: () => <div>B</div>,
  },
  'widget-c': {
    defaults: { w: 2, h: 4, maxH: 8, minH: 3 },
    config: { title: 'Widget C' },
    renderWidget: () => <div>C</div>,
  },
};

describe('WidgetDrawer', () => {
  it('renders children when closed', () => {
    render(
      <WidgetDrawer widgetMapping={widgetMapping} isOpen={false}>
        <div data-testid="child-content">Dashboard</div>
      </WidgetDrawer>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('does not render drawer panel when closed', () => {
    render(
      <WidgetDrawer widgetMapping={widgetMapping} isOpen={false}>
        <div>Dashboard</div>
      </WidgetDrawer>
    );
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument();
  });

  it('renders all widgets in drawer when open with none in use', () => {
    render(
      <WidgetDrawer widgetMapping={widgetMapping} isOpen={true}>
        <div>Dashboard</div>
      </WidgetDrawer>
    );
    expect(screen.getByText('Widget A')).toBeInTheDocument();
    expect(screen.getByText('Widget B')).toBeInTheDocument();
    expect(screen.getByText('Widget C')).toBeInTheDocument();
  });

  it('filters out currently used widgets', () => {
    render(
      <WidgetDrawer
        widgetMapping={widgetMapping}
        currentlyUsedWidgets={['widget-a', 'widget-c']}
        isOpen={true}
      >
        <div>Dashboard</div>
      </WidgetDrawer>
    );
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument();
    expect(screen.getByText('Widget B')).toBeInTheDocument();
    expect(screen.queryByText('Widget C')).not.toBeInTheDocument();
  });

  it('shows no widget cards when all widgets are in use', () => {
    render(
      <WidgetDrawer
        widgetMapping={widgetMapping}
        currentlyUsedWidgets={['widget-a', 'widget-b', 'widget-c']}
        isOpen={true}
      >
        <div>Dashboard</div>
      </WidgetDrawer>
    );
    // Drawer panel is rendered but no widget cards inside
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument();
    expect(screen.queryByText('Widget B')).not.toBeInTheDocument();
    expect(screen.queryByText('Widget C')).not.toBeInTheDocument();
  });

  it('renders custom instruction text', () => {
    render(
      <WidgetDrawer
        widgetMapping={widgetMapping}
        isOpen={true}
        instructionText="Drag widgets below to add them."
      >
        <div>Dashboard</div>
      </WidgetDrawer>
    );
    expect(screen.getByText('Drag widgets below to add them.')).toBeInTheDocument();
  });

  it('renders default instruction text when none provided', () => {
    render(
      <WidgetDrawer widgetMapping={widgetMapping} isOpen={true}>
        <div>Dashboard</div>
      </WidgetDrawer>
    );
    expect(screen.getByText(/Add new and previously removed widgets/)).toBeInTheDocument();
  });
});
