# Widgetized Dashboard

A generic, reusable PatternFly component library providing a customizable widget-based dashboard with drag-and-drop functionality.

## Prerequisites

- Node.js 18 or higher
- Yarn 4.10.3 or higher (recommended) or npm
- React 18 (peer dependency)
- React DOM 18 (peer dependency)

## Installation

```bash
yarn add @patternfly/widgetized-dashboard
```

Or with npm:

```bash
npm install @patternfly/widgetized-dashboard
```

### Peer Dependencies

This library requires React 18+ and React DOM 18+ as peer dependencies. Make sure these are installed in your project:

```bash
yarn add react@^18 react-dom@^18
```

## Styles

Import the required stylesheet in your application entry point:

```ts
import '@patternfly/widgetized-dashboard/dist/esm/styles.css';
```

This stylesheet is required for the dashboard layout, drag-and-drop, and widget tile styling. You will also need PatternFly's base styles — see the [PatternFly getting started guide](https://www.patternfly.org/get-started/develop/) for details.

## Quick Start

```tsx
import React from 'react';
import { WidgetLayout, WidgetMapping, ExtendedTemplateConfig } from '@patternfly/widgetized-dashboard';
import '@patternfly/widgetized-dashboard/dist/esm/styles.css';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';

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

## Examples

- [Basic Example](./packages/module/patternfly-docs/content/examples/BasicExample.tsx) - Complete dashboard with drawer
- [Locked Layout Example](./packages/module/patternfly-docs/content/examples/LockedLayoutExample.tsx) - Dashboard with locked widgets
- [Custom Toolbar Example](./packages/module/patternfly-docs/content/examples/CustomToolbarExample.tsx) - Dashboard with custom toolbar controls

## Key Components

### WidgetLayout

The main component that provides the complete dashboard experience with grid layout and widget drawer.

### GridLayout

The core layout engine with drag-and-drop functionality (can be used standalone).

### WidgetDrawer

The widget selection drawer (can be used standalone with GridLayout).

### GridTile

Individual widget tile wrapper with actions menu (used internally by GridLayout).

## Development

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/patternfly/widgetized-dashboard.git
   cd widgetized-dashboard
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```
   This will build the library and start the documentation site at http://localhost:8003

### Building for Production

```bash
yarn build
```

### Testing and Linting

- Run unit tests: `yarn test`
- Run linter: `yarn lint`
- Lint JavaScript: `yarn lint:js`
- Lint Markdown: `yarn lint:md`

### Accessibility Testing

1. Build the docs: `yarn build:docs`
2. Serve the docs: `yarn serve:docs`
3. In a new terminal window, run: `yarn test:a11y`
4. View the generated report: `yarn serve:a11y`

## Contributing

We welcome contributions! Please follow the guidelines below when contributing to this project.

### Component Guidelines

- Follow PatternFly naming conventions
- Include TypeScript definitions for all components and props
- Write unit tests using React Testing Library
- Add documentation examples in `packages/module/patternfly-docs/content/examples/`
- Follow the existing code style and linting rules
- Ensure all tests pass before submitting a pull request

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with appropriate tests
4. Run `yarn lint` and `yarn test` to ensure code quality
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a pull request

### AI-assisted development guidelines

Please reference [PatternFly's AI-assisted development guidelines](https://github.com/patternfly/.github/blob/main/CONTRIBUTING.md) if you'd like to contribute code generated using AI.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Repository

- **Issues**: [GitHub Issues](https://github.com/patternfly/widgetized-dashboard/issues)
- **Source**: [GitHub Repository](https://github.com/patternfly/widgetized-dashboard)


