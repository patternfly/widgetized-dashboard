# Widgetized Dashboard

A generic, reusable PatternFly component library providing a customizable widget-based dashboard with drag-and-drop functionality. This library was created by lifting and adapting code from the [RedHatInsights/widget-layout](https://github.com/RedHatInsights/widget-layout) repository, removing console-specific dependencies to make it suitable for any PatternFly application.

## Features

- **Drag-and-Drop Grid Layout**: Powered by `react-grid-layout` with responsive breakpoints
- **Widget Drawer**: Easy widget selection and management
- **Lock/Unlock Widgets**: Prevent accidental changes to widget positions and sizes
- **Resize Widgets**: Adjust widget dimensions with corner handles
- **Responsive Design**: Automatic layout adjustments for xl, lg, md, and sm breakpoints
- **Customizable**: Fully configurable widgets with custom icons, titles, and content
- **TypeScript Support**: Full type definitions included
- **No External Dependencies**: Self-contained state management (no Jotai, Redux, or other state libraries required)

## Installation

```bash
yarn add @patternfly/widgetized-dashboard
```

Or with npm:

```bash
npm install @patternfly/widgetized-dashboard
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
yarn add react react-dom react-router-dom @patternfly/react-core @patternfly/react-icons
```

## Quick Start

```tsx
import React from 'react';
import { WidgetLayout, WidgetMapping, ExtendedTemplateConfig } from '@patternfly/widgetized-dashboard';
import { CubeIcon } from '@patternfly/react-icons';

// Define your widgets
const widgetMapping: WidgetMapping = {
  'example-widget': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'Example Widget',
      icon: <CubeIcon />
    },
    renderWidget: (id) => <div>Widget content goes here</div>
  }
};

// Define initial layout (or load from API/localStorage)
const initialTemplate: ExtendedTemplateConfig = {
  xl: [
    { i: 'example-widget#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'example-widget', title: 'Example Widget' }
  ],
  lg: [
    { i: 'example-widget#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'example-widget', title: 'Example Widget' }
  ],
  md: [
    { i: 'example-widget#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'example-widget', title: 'Example Widget' }
  ],
  sm: [
    { i: 'example-widget#1', x: 0, y: 0, w: 1, h: 3, widgetType: 'example-widget', title: 'Example Widget' }
  ]
};

function App() {
  return (
    <WidgetLayout
      widgetMapping={widgetMapping}
      initialTemplate={initialTemplate}
      onTemplateChange={(template) => {
        // Save template to API or localStorage
        console.log('Template changed:', template);
      }}
    />
  );
}
```

## Documentation

- [Getting Started Guide](./packages/module/patternfly-docs/content/examples/basic.md)
- [API Reference](./packages/module/patternfly-docs/content/design-guidelines/design-guidelines.md)

## Key Components

### WidgetLayout

The main component that provides the complete dashboard experience with grid layout and widget drawer.

### GridLayout

The core layout engine with drag-and-drop functionality (can be used standalone).

### WidgetDrawer

The widget selection drawer (can be used standalone with GridLayout).

### GridTile

Individual widget tile wrapper with actions menu (used internally by GridLayout).

## Differences from widget-layout

This library is based on [RedHatInsights/widget-layout](https://github.com/RedHatInsights/widget-layout) but has been adapted to be a generic, reusable PatternFly component:

### Removed
- ❌ Scalprum federated module loading
- ❌ Chrome Services API calls for template persistence
- ❌ Console-specific authentication (useCurrentUser)
- ❌ Console-specific analytics (useChrome)
- ❌ Jotai state management atoms
- ❌ Console-specific icons and branding

### Added
- ✅ Generic widget rendering via `renderWidget` prop
- ✅ Prop-based template management (bring your own state management)
- ✅ Optional analytics callback
- ✅ Standalone component usage (no external state required)
- ✅ Full TypeScript support
- ✅ Simplified API without console dependencies

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge) with ES6 support.

## License

MIT

## Contributing

### AI-assisted development guidelines

Please reference [PatternFly's AI-assisted development guidelines](https://github.com/patternfly/.github/blob/main/CONTRIBUTING.md) if you'd like to contribute code generated using AI.

## Credits

This library is based on the [RedHatInsights/widget-layout](https://github.com/RedHatInsights/widget-layout) repository, adapted to be a generic PatternFly component.
