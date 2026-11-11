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
propComponents: ['WidgetLayout', 'GridLayout', 'WidgetDrawer', 'AddWidgetsButton']
sortValue: 1
sourceLink: https://github.com/patternfly/widgetized-dashboard
--- 

import { FunctionComponent, useState } from 'react';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import ChartLineIcon from '@patternfly/react-icons/dist/esm/icons/chart-line-icon';
import BellIcon from '@patternfly/react-icons/dist/esm/icons/bell-icon';
import ShieldAltIcon from '@patternfly/react-icons/dist/esm/icons/shield-alt-icon';
import LockIcon from '@patternfly/react-icons/dist/esm/icons/lock-icon';
import LockOpenIcon from '@patternfly/react-icons/dist/esm/icons/lock-open-icon';
import UndoIcon from '@patternfly/react-icons/dist/esm/icons/undo-icon';
import ArrowRightIcon from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import {
  Button,
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
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core';
import { WidgetLayout, GridLayout, WidgetDrawer, AddWidgetsButton } from '@patternfly/widgetized-dashboard';

### Basic usage

The WidgetLayout component provides a complete drag-and-drop dashboard experience with a widget drawer for adding and removing widgets.

### Interactive example

```js file="./BasicExample.tsx" isFullscreen

```

### Locked layout

Use `isLayoutLocked` to prevent users from modifying the layout.

```js file="./LockedLayoutExample.tsx"

```

### Custom toolbar

Use `GridLayout`, `WidgetDrawer`, and `AddWidgetsButton` directly to build a custom toolbar with lock/unlock, reset, and other controls.

```js file="./CustomToolbarExample.tsx" isFullscreen

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
      },
      // Optional header info icon — popover by default
      info: {
        title: 'About this widget',
        content: <p>Short help text explaining what this widget shows.</p>
      }
    },
    renderWidget: (id) => <MyWidgetContent />
  },
  'detailed-widget': {
    defaults: { w: 2, h: 4, maxH: 8, minH: 3 },
    config: {
      title: 'Detailed Widget',
      // Use variant: 'modal' when the help content is long
      info: {
        title: 'Detailed information',
        content: <p>Longer help content that needs more space…</p>,
        variant: 'modal',
        ariaLabel: 'Detailed widget help'
      }
    },
    renderWidget: (id) => <DetailedWidgetContent />
  }
};
```

When `config.info` is set, an info icon appears in the widget header actions. Clicking it opens a **popover** by default, or a **modal** when `variant: 'modal'` is set.

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
| `config.info` | `WidgetInfo` | Optional header info icon; see below |
| `renderWidget` | `(id: string) => ReactNode` | Function that renders the widget content |

### Widget info (`config.info`)

| Property | Type | Description |
|----------|------|-------------|
| `content` | `ReactNode` | Body content shown in the popover or modal (required) |
| `title` | `ReactNode` | Optional header/title for the popover or modal |
| `variant` | `'popover' \| 'modal'` | Presentation style. Defaults to `'popover'`. Use `'modal'` for longer content |
| `ariaLabel` | `string` | Accessible label for the info icon button. Defaults to `"More information"` |

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
