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
      icon: <MyIcon />
    },
    renderWidget: (id) => <MyWidgetContent />
  }
};
```

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
