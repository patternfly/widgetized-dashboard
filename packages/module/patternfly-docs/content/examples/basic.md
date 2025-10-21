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
import { CubeIcon, ChartLineIcon, BellIcon } from '@patternfly/react-icons';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import WidgetLayout from '@patternfly/widgetized-dashboard/dist/esm/WidgetLayout/WidgetLayout';
import GridLayout from '@patternfly/widgetized-dashboard/dist/esm/WidgetLayout/GridLayout';
import WidgetDrawer from '@patternfly/widgetized-dashboard/dist/esm/WidgetLayout/WidgetDrawer';

## Basic usage

The WidgetLayout component provides a complete drag-and-drop dashboard experience with a widget drawer for adding and removing widgets.

### Interactive example

```js file="./BasicExample.tsx"

```

## Locked layout

Use `isLayoutLocked` to prevent users from modifying the layout.

```js file="./LockedLayoutExample.tsx"

```

## Without drawer

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
