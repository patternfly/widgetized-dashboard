# Architecture Overview

## Component Structure

The Widgetized Dashboard is composed of several key components that work together to provide a complete dashboard experience:

```
WidgetLayout (main component)
├── WidgetDrawer (widget selection)
│   └── WidgetWrapper (draggable widget cards)
└── GridLayout (drag-and-drop grid)
    └── GridTile (individual widget wrapper)
        └── Widget Content (user-provided via renderWidget)
```

## Core Components

### 1. WidgetLayout
The top-level component that orchestrates the entire dashboard experience.

**Responsibilities:**
- Manages overall state (template, drawer open/close)
- Coordinates between GridLayout and WidgetDrawer
- Provides unified API for consumers

**State:**
- `template`: Current layout configuration
- `drawerOpen`: Whether widget drawer is visible
- `currentlyUsedWidgets`: List of widget types in use

### 2. GridLayout
The core layout engine powered by `react-grid-layout`.

**Responsibilities:**
- Rendering the responsive grid
- Handling drag-and-drop operations
- Managing widget positions and sizes
- Responsive breakpoint handling
- Widget CRUD operations

**Key Features:**
- 4 responsive breakpoints (xl, lg, md, sm)
- Drag-and-drop from drawer
- Resize with corner handles
- Lock/unlock individual widgets
- Empty state display

**State:**
- `isDragging`: Drag operation in progress
- `isInitialRender`: Skip save on first render
- `layoutVariant`: Current breakpoint
- `layoutWidth`: Container width
- `currentDropInItem`: Widget being dragged

### 3. GridTile
Wrapper component for individual widgets.

**Responsibilities:**
- Render widget content
- Provide widget actions menu
- Display widget header with icon and title
- Handle widget-level interactions

**Features:**
- Lock/unlock toggle
- Autosize to max height
- Minimize to min height
- Remove widget
- Optional header link
- Drag handle

### 4. WidgetDrawer
Side panel for selecting widgets to add.

**Responsibilities:**
- Display available widgets
- Filter out currently used widgets
- Provide drag source for new widgets
- Instructions for users

## Data Flow

### Template Management

```
┌─────────────┐
│   Parent    │
│  Component  │
└──────┬──────┘
       │
       │ initialTemplate (prop)
       ▼
┌─────────────┐
│ WidgetLayout│
│   (state)   │
└──────┬──────┘
       │
       │ template (prop)
       ▼
┌─────────────┐
│ GridLayout  │
│  (renders)  │
└──────┬──────┘
       │
       │ onChange
       ▼
┌─────────────┐
│onTemplateChange│
│  (callback)  │
└──────┬──────┘
       │
       │ save to API/storage
       ▼
┌─────────────┐
│   Parent    │
│  Component  │
└─────────────┘
```

### Widget Rendering

```
┌──────────────┐
│WidgetMapping │
│  (config)    │
└──────┬───────┘
       │
       │ widgetType → renderWidget
       ▼
┌──────────────┐
│  GridTile    │
│  (wrapper)   │
└──────┬───────┘
       │
       │ renders children
       ▼
┌──────────────┐
│Widget Content│
│ (React node) │
└──────────────┘
```

## State Management

The component uses **local React state** for all state management:

- No external state libraries required (no Jotai, Redux, etc.)
- Parent controls template via `initialTemplate` and `onTemplateChange`
- Internal state synchronized with props
- Callbacks for notifications, analytics, etc.

### State Flow

```typescript
// Parent manages template
const [template, setTemplate] = useState(initialTemplate);

// WidgetLayout receives and manages internally
<WidgetLayout
  initialTemplate={template}
  onTemplateChange={(newTemplate) => {
    setTemplate(newTemplate);
    saveToAPI(newTemplate);
  }}
/>

// Internal state stays in sync
useEffect(() => {
  setInternalTemplate(template);
}, [template]);
```

## Responsive Design

### Breakpoints

| Breakpoint | Width      | Columns | Use Case |
|-----------|------------|---------|----------|
| xl        | ≥1550px    | 4       | Large desktop |
| lg        | 1400-1549px| 3       | Desktop |
| md        | 1100-1399px| 2       | Tablet landscape |
| sm        | 800-1099px | 1       | Tablet portrait |

### Grid System

- **Row Height**: 56px (fixed)
- **Container**: 100% width, min-height 200px
- **Columns**: Responsive (4/3/2/1)
- **Gutter**: Managed by react-grid-layout

### Responsive Behavior

```typescript
// Auto-detect breakpoint on mount and resize
const observer = new ResizeObserver((entries) => {
  const width = entries[0].contentRect.width;
  const variant = getGridDimensions(width);
  setLayoutVariant(variant);
});
```

Each template must define layouts for all breakpoints:

```typescript
const template: ExtendedTemplateConfig = {
  xl: [...], // 4 columns
  lg: [...], // 3 columns
  md: [...], // 2 columns
  sm: [...]  // 1 column
};
```

## Type System

### Core Types

```typescript
// Widget definition
type WidgetMapping = {
  [widgetType: string]: {
    defaults: WidgetDefaults;
    config?: WidgetConfiguration;
    renderWidget: (widgetId: string) => React.ReactNode;
  };
};

// Layout configuration
type ExtendedTemplateConfig = {
  xl: ExtendedLayoutItem[];
  lg: ExtendedLayoutItem[];
  md: ExtendedLayoutItem[];
  sm: ExtendedLayoutItem[];
};

// Individual widget placement
type ExtendedLayoutItem = Layout & {
  widgetType: string;
  title: string;
  config?: WidgetConfiguration;
  locked?: boolean;
};
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**
   - `useMemo` for dropping item template
   - `useMemo` for dropdown items
   - `useMemo` for header links

2. **Conditional Rendering**
   - Empty state only when needed
   - Drawer only when `showDrawer={true}`
   - Resize handles only on hover

3. **Event Handling**
   - No inline function creation in render
   - Callbacks defined at component level
   - Event handlers properly memoized

4. **Grid Reset**
   - Key prop forces remount on breakpoint change
   - Necessary for proper react-grid-layout behavior
   - `key={'grid-' + layoutVariant}`

## Integration Points

### With PatternFly

- Uses PatternFly Card for widget containers
- Uses PatternFly EmptyState for empty dashboard
- Uses PatternFly Dropdown for actions menu
- Uses PatternFly Icons throughout
- Follows PatternFly design tokens

### With react-grid-layout

- Wraps ReactGridLayout component
- Custom resize handles
- Custom drag handles
- Responsive breakpoints
- Layout persistence

### With React Router

- Optional Link component in GridTile
- Handles internal/external links
- Target blank for external links

## Extensibility

### Custom Empty State

```typescript
<WidgetLayout
  emptyStateComponent={<MyCustomEmptyState />}
/>
```

### Custom Analytics

```typescript
<WidgetLayout
  analytics={(event, data) => {
    myAnalytics.track(event, data);
  }}
/>
```

### Custom Notifications

```typescript
<WidgetLayout
  onNotification={(notification) => {
    toast.show(notification.title, {
      variant: notification.variant
    });
  }}
/>
```

## File Structure

```
src/WidgetLayout/
├── types.ts                 # TypeScript type definitions
├── utils.ts                 # Utility functions
├── GridLayout.tsx          # Main grid component
├── GridLayout.scss         # Grid styles
├── GridTile.tsx            # Widget wrapper component
├── GridTile.scss           # Tile styles
├── WidgetDrawer.tsx        # Widget selection drawer
├── WidgetDrawer.scss       # Drawer styles
├── WidgetLayout.tsx        # Main component
├── index.ts                # Public exports
├── resize-handle.svg       # Resize handle icon
└── __tests__/             # Test files
    ├── WidgetLayout.test.tsx
    ├── utils.test.ts
    └── __snapshots__/
```

## Dependencies

### Runtime Dependencies

- `react` & `react-dom` (peer)
- `react-router-dom` (peer)
- `@patternfly/react-core`
- `@patternfly/react-icons`
- `react-grid-layout`
- `clsx`

### Development Dependencies

- `@types/react-grid-layout`
- TypeScript
- Jest & Testing Library

## Browser Support

Modern browsers with ES6 support:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

## Future Enhancements

Potential areas for extension:

1. **Widget Templates** - Pre-defined layout templates
2. **Export/Import** - JSON export/import of layouts
3. **Undo/Redo** - Layout change history
4. **Widget Groups** - Grouping related widgets
5. **Themes** - Custom color schemes
6. **Animations** - Smooth transitions
7. **Touch Support** - Better mobile experience

