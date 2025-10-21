/**
 * Styles for WidgetLayout components using PatternFly tokens
 * This replaces the SCSS files with CSS-in-JS approach
 */

export const gridLayoutStyles = `
  .react-grid-item .react-resizable-handle-nw,
  .react-grid-item .react-resizable-handle-sw,
  .react-grid-item .react-resizable-handle-se {
    display: none;
  }

  .react-grid-item .react-resizable-handle-nw,
  .react-grid-item .react-resizable-handle-se {
    cursor: nwse-resize;
  }

  .react-grid-item .react-resizable-handle-ne,
  .react-grid-item .react-resizable-handle-sw {
    cursor: nesw-resize;
  }

  .react-grid-item:hover:not(.static) .react-resizable-handle-nw,
  .react-grid-item:hover:not(.static) .react-resizable-handle-sw,
  .react-grid-item:hover:not(.static) .react-resizable-handle-se,
  .react-grid-item:active:not(.static) .react-resizable-handle-nw,
  .react-grid-item:active:not(.static) .react-resizable-handle-sw,
  .react-grid-item:active:not(.static) .react-resizable-handle-se {
    display: inherit;
  }

  .react-grid-item.react-grid-placeholder {
    background-color: var(--pf-t--color--gray--60);
    border-radius: 12px;
  }

  .react-grid-item .react-resizable-handle::after {
    display: none;
  }

  .react-grid-item .react-resizable-handle img {
    padding: 3px;
  }

  #widget-layout-container {
    width: 100%;
    min-height: 200px;
  }

  .grid-tile::before {
    z-index: 1;
  }

  .grid-tile {
    background: var(--pf-t--global--background--color--100);
    position: relative;
    height: 100%;
    overflow: hidden;
  }

  .grid-tile .drag-handle {
    cursor: grab;
  }

  .grid-tile .drag-handle.dragging {
    cursor: grabbing;
  }

  .grid-tile.static .drag-handle,
  .grid-tile.static .drag-handle.dragging {
    cursor: not-allowed;
  }

  .grid-tile .pf-v6-c-card__header {
    padding: var(--pf-t--global--spacer--md);
    padding-bottom: var(--pf-t--global--spacer--sm);
    background: var(--pf-t--global--background--color--200);
  }

  .grid-tile .widg-c-icon--header .service-icon {
    height: 28px;
    width: 28px;
  }

  .grid-tile .widg-c-icon--header .pf-v6-svg {
    color: var(--pf-t--color--blue--50);
    height: 22px;
    width: 22px;
    margin-bottom: var(--pf-t--global--spacer--sm);
  }

  .grid-tile .widg-card-header-text {
    gap: 0;
    line-height: 0;
    padding-top: 2px;
  }

  .grid-tile .pf-v6-c-card__header .pf-v6-c-menu-toggle {
    padding-left: 0;
    padding-right: 0;
  }

  .grid-tile .pf-v6-c-card__actions {
    padding-left: var(--pf-t--global--spacer--xs);
  }

  .grid-tile .pf-v6-c-card__body {
    background: var(--pf-t--global--background--color--100);
  }

  .widg-c-drawer__header {
    height: 100%;
  }

  .widg-c-drawer__drag-handle {
    cursor: grab;
  }

  .widg-l-gallery {
    --pf-v6-l-gallery--m-gutter--GridGap: 8px;
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleId = 'widget-layout-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = gridLayoutStyles;
    document.head.appendChild(style);
  }
}

