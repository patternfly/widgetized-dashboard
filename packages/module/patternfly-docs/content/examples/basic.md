---
# Sidenav top-level section
# should be the same for all markdown files
section: extensions
# Sidenav secondary level section
# should be the same for all markdown files
id: Widgetized dashboard
# Tab (react | react-demos | html | html-demos | design-guidelines | accessibility)
source: react
# If you use typescript, the name of the interface to display props for
# These are found through the sourceProps function provided in patternfly-docs.source.js
propComponents: ['WidgetLayout', 'GridLayout', 'WidgetDrawer']
sortValue: 1
sourceLink: https://github.com/patternfly/widgetized-dashboard
--- 

import { FunctionComponent, useState } from 'react';
import { ExternalLinkAltIcon, ArrowRightIcon, CubeIcon, ChartLineIcon, BellIcon } from '@patternfly/react-icons';
import { Card, CardBody, CardFooter, Content, Icon } from '@patternfly/react-core';
import { WidgetLayout, GridLayout, WidgetDrawer } from '@patternfly/widgetized-dashboard';

### Basic usage

The WidgetLayout component provides a complete drag-and-drop dashboard experience with a widget drawer for adding and removing widgets.

### Interactive example

```js file="./BasicExample.tsx" isFullscreen

```

### Locked layout

Use `isLayoutLocked` to prevent users from modifying the layout.

```js file="./LockedLayoutExample.tsx"

```

### Without drawer

You can hide the widget drawer by setting `showDrawer={false}`.

```js file="./WithoutDrawerExample.tsx"

```

## Key features

- **Drag and drop**: Drag widgets from the drawer to add them to the dashboard
- **Resize**: Drag corner handles to resize widgets
- **Lock/unlock**: Lock widgets to prevent accidental changes
- **Responsive**: Automatically adjusts layout for different screen sizes (xl, lg, md, sm)
- **Persistent**: Save and restore layouts using the `onTemplateChange` callback

## Widget mapping

Define your widgets using the `WidgetMapping` type:

```typescript
const widgetMapping: WidgetMapping = {
  'my-widget': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'My Widget',
      icon: <MyIcon />,
      headerLink: {
        title: 'View details',
        href: '/details'
      }
    },
    renderWidget: (id) => <MyWidgetContent />
  }
};
```

### Widget configuration options

| Property | Type | Description |
|----------|------|-------------|
| `defaults.w` | `number` | Default width in grid columns |
| `defaults.h` | `number` | Default height in grid rows |
| `defaults.maxH` | `number` | Maximum height the widget can be resized to |
| `defaults.minH` | `number` | Minimum height the widget can be resized to |
| `config.title` | `string` | Widget title displayed in the header |
| `config.icon` | `ReactNode` | Icon displayed next to the title |
| `config.headerLink` | `{ title: string, href: string }` | Optional link displayed in the widget header |
| `renderWidget` | `(id: string) => ReactNode` | Function that renders the widget content |

## Template configuration

Define your initial layout using the `ExtendedTemplateConfig` type:

```typescript
const initialTemplate: ExtendedTemplateConfig = {
  xl: [
    { i: 'my-widget#1', x: 0, y: 0, w: 2, h: 3, widgetType: 'my-widget', title: 'My Widget' }
  ],
  lg: [...],
  md: [...],
  sm: [...]
};
```

Each breakpoint (xl, lg, md, sm) should have its own layout configuration to ensure proper responsive behavior.

### Layout item properties

#### Required properties

| Property | Type | Description |
|----------|------|-------------|
| `i` | `string` | Unique identifier in format `widgetType#uuid` (e.g., `'my-widget#1'`) |
| `x` | `number` | X position in grid columns (0-indexed from left) |
| `y` | `number` | Y position in grid rows (0-indexed from top) |
| `w` | `number` | Width in grid columns |
| `h` | `number` | Height in grid rows |
| `widgetType` | `string` | Must match a key in `widgetMapping` |
| `title` | `string` | Display title for this widget instance |

#### Optional properties

| Property | Type | Description |
|----------|------|-------------|
| `minW` | `number` | Minimum width during resize |
| `maxW` | `number` | Maximum width during resize |
| `minH` | `number` | Minimum height during resize |
| `maxH` | `number` | Maximum height during resize |
| `static` | `boolean` | If `true`, widget cannot be moved or resized |
| `locked` | `boolean` | If `true`, widget is locked in place |
| `config` | `WidgetConfiguration` | Override the widget's default config for this instance |
