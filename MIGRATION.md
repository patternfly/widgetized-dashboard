# Migration Guide from widget-layout

This document provides guidance for users migrating from the RedHatInsights/widget-layout repository to this generic PatternFly component.

## What Changed

### Removed Dependencies

The following console-specific dependencies have been removed:

1. **Scalprum** (`@scalprum/react-core`) - Federated module loading
2. **Chrome Services APIs** - API calls for template persistence
3. **useCurrentUser** - Console-specific authentication
4. **useChrome** - Console-specific hooks and analytics
5. **Jotai atoms** - External state management
6. **Console icons and branding**

### New Approach

#### Widget Definition

**Before (widget-layout):**
```typescript
// Widget loaded via Scalprum federated modules
const widgetMapping = {
  'my-widget': {
    scope: 'myApp',
    module: './MyWidget',
    importName: 'MyWidget',
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: { title: 'My Widget' }
  }
};
```

**After (widgetized-dashboard):**
```typescript
// Widget rendered directly via React component
const widgetMapping: WidgetMapping = {
  'my-widget': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'My Widget',
      icon: <CubeIcon />
    },
    renderWidget: (id) => <MyWidgetContent />
  }
};
```

#### Template Management

**Before (widget-layout):**
```typescript
// Templates loaded/saved automatically via Chrome Services API
import { getDashboardTemplates, patchDashboardTemplate } from './api/dashboard-templates';

// Component handles API calls internally
<GridLayout layoutType="landingPage" />
```

**After (widgetized-dashboard):**
```typescript
// Templates managed via props (bring your own state management)
const [template, setTemplate] = useState(loadTemplate());

const handleTemplateChange = async (newTemplate) => {
  setTemplate(newTemplate);
  await saveTemplateToAPI(newTemplate); // Your own API
};

<WidgetLayout
  widgetMapping={widgetMapping}
  initialTemplate={template}
  onTemplateChange={handleTemplateChange}
/>
```

#### State Management

**Before (widget-layout):**
```typescript
// State managed via Jotai atoms
import { useAtom } from 'jotai';
import { templateAtom } from './state/templateAtom';

const [template, setTemplate] = useAtom(templateAtom);
```

**After (widgetized-dashboard):**
```typescript
// State managed via React state or your preferred solution
const [template, setTemplate] = useState(initialTemplate);

// Or use Redux, MobX, Zustand, etc.
```

#### Analytics

**Before (widget-layout):**
```typescript
// Chrome analytics used internally
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const { analytics } = useChrome();
analytics.track('widget-layout.widget-add', { data });
```

**After (widgetized-dashboard):**
```typescript
// Optional analytics via callback
<WidgetLayout
  analytics={(event, data) => {
    yourAnalytics.track(event, data);
  }}
/>
```

## Step-by-Step Migration

### 1. Install Dependencies

```bash
yarn add @patternfly/widgetized-dashboard
```

### 2. Update Widget Definitions

Convert your Scalprum widget definitions to render functions:

```typescript
// Old
{
  'insights-widget': {
    scope: '@redhat-cloud-services/insights',
    module: './InsightsWidget',
    importName: 'default',
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 }
  }
}

// New
{
  'insights-widget': {
    defaults: { w: 2, h: 3, maxH: 6, minH: 2 },
    config: {
      title: 'Insights',
      icon: <InsightsIcon />
    },
    renderWidget: (id) => <InsightsWidget />
  }
}
```

### 3. Implement Template Persistence

Replace Chrome Services API calls with your own persistence layer:

```typescript
// Load from your backend
const loadTemplate = async () => {
  const response = await fetch('/api/dashboard/template');
  return response.json();
};

// Save to your backend
const saveTemplate = async (template) => {
  await fetch('/api/dashboard/template', {
    method: 'POST',
    body: JSON.stringify(template)
  });
};

// Use in component
const MyDashboard = () => {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplate().then(t => {
      setTemplate(t);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <WidgetLayout
      widgetMapping={widgetMapping}
      initialTemplate={template}
      onTemplateChange={saveTemplate}
    />
  );
};
```

### 4. Update Imports

```typescript
// Old
import GridLayout from './Components/DnDLayout/GridLayout';
import { getDashboardTemplates } from './api/dashboard-templates';

// New
import { WidgetLayout, GridLayout, ExtendedTemplateConfig } from '@patternfly/widgetized-dashboard';
```

### 5. Remove State Atoms

If you were using the Jotai atoms, replace them with your own state management:

```typescript
// Old
import { useAtom } from 'jotai';
import { templateAtom } from './state/templateAtom';

// New - use React state, Redux, or your preferred solution
import { useState } from 'react';
const [template, setTemplate] = useState(initialTemplate);
```

## API Mapping

| widget-layout | widgetized-dashboard | Notes |
|--------------|---------------------|-------|
| `getDashboardTemplates()` | `loadTemplate()` | Implement your own |
| `patchDashboardTemplate()` | `saveTemplate()` | Implement your own |
| `useCurrentUser()` | Your auth solution | Use your app's auth |
| `useChrome()` | Props/callbacks | Pass as props |
| Jotai atoms | React state/your store | Bring your own state |
| Scalprum loading | `renderWidget` prop | Direct rendering |

## Breaking Changes

1. **No automatic persistence** - You must implement template loading/saving
2. **No federated modules** - Use direct React components instead
3. **No built-in auth** - Handle authentication in your app layer
4. **State management** - Component is self-contained, no external atoms
5. **Analytics** - Optional callback instead of automatic tracking

## Benefits of Migration

1. **No console dependencies** - Works in any PatternFly application
2. **Simpler mental model** - Props in, callbacks out
3. **Flexible persistence** - Use any backend or storage solution
4. **Better TypeScript support** - Full type definitions
5. **Lighter bundle** - Fewer dependencies
6. **More control** - Explicit state management

## Need Help?

- [Full Documentation](./README.md)
- [Examples](./packages/module/patternfly-docs/content/examples/)
- [Design Guidelines](./packages/module/patternfly-docs/content/design-guidelines/)

