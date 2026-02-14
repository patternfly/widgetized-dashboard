import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GridTile, { GridTileProps } from '../GridTile';

const createProps = (overrides?: Partial<GridTileProps>): GridTileProps => ({
  widgetType: 'test-widget',
  isDragging: false,
  setIsDragging: jest.fn(),
  setWidgetAttribute: jest.fn(),
  widgetConfig: {
    i: 'test-widget-1',
    x: 0,
    y: 0,
    w: 2,
    h: 3,
    maxH: 6,
    minH: 2,
    colWidth: 100,
  },
  removeWidget: jest.fn(),
  children: <div data-testid="widget-content">Widget Content</div>,
  isLoaded: true,
  ...overrides,
});

const defaultProps = createProps();

describe('GridTile - wrapperProps and cardBodyProps', () => {
  describe('wrapperProps', () => {
    it('should pass wrapperProps to the Card wrapper component', () => {
      const wrapperProps = {
        'data-testid': 'custom-card-wrapper',
        'aria-label': 'Custom card label',
      };

      render(
        <GridTile
          {...defaultProps}
          widgetConfig={{
            ...defaultProps.widgetConfig,
            config: {
              wrapperProps,
            },
          }}
        />
      );

      const cardWrapper = screen.getByTestId('custom-card-wrapper');
      expect(cardWrapper).toBeInTheDocument();
      expect(cardWrapper).toHaveAttribute('aria-label', 'Custom card label');
    });

    it('should merge custom className with default className in wrapperProps', () => {
      const wrapperProps = {
        className: 'custom-wrapper-class',
        'data-testid': 'card-with-custom-class',
      };

      render(
        <GridTile
          {...defaultProps}
          widgetConfig={{
            ...defaultProps.widgetConfig,
            config: {
              wrapperProps,
            },
          }}
        />
      );

      const cardWrapper = screen.getByTestId('card-with-custom-class');
      expect(cardWrapper).toHaveClass('pf-v6-widget-grid-tile');
      expect(cardWrapper).toHaveClass('custom-wrapper-class');
    });
  });

  describe('cardBodyProps', () => {
    it('should pass cardBodyProps to the CardBody component', () => {
      const cardBodyProps = {
        'data-testid': 'custom-card-body',
        'aria-label': 'Custom card body label',
      };

      render(
        <GridTile
          {...defaultProps}
          widgetConfig={{
            ...defaultProps.widgetConfig,
            config: {
              cardBodyProps,
            },
          }}
        />
      );

      const cardBody = screen.getByTestId('custom-card-body');
      expect(cardBody).toBeInTheDocument();
      expect(cardBody).toHaveAttribute('aria-label', 'Custom card body label');
    });

    it('should merge custom className with default className in cardBodyProps', () => {
      const cardBodyProps = {
        className: 'custom-body-class',
        'data-testid': 'body-with-custom-class',
      };

      render(
        <GridTile
          {...defaultProps}
          widgetConfig={{
            ...defaultProps.widgetConfig,
            config: {
              cardBodyProps,
            },
          }}
        />
      );

      const cardBody = screen.getByTestId('body-with-custom-class');
      expect(cardBody).toHaveClass('pf-v6-widget-grid-tile__body');
      expect(cardBody).toHaveClass('custom-body-class');
    });
  });

  describe('both props together', () => {
    it('should correctly apply both wrapperProps and cardBodyProps simultaneously', () => {
      const wrapperProps = {
        className: 'custom-wrapper',
        'data-testid': 'combined-wrapper',
      };

      const cardBodyProps = {
        className: 'custom-body',
        'data-testid': 'combined-body',
      };

      render(
        <GridTile
          {...defaultProps}
          widgetConfig={{
            ...defaultProps.widgetConfig,
            config: {
              wrapperProps,
              cardBodyProps,
            },
          }}
        />
      );

      const cardWrapper = screen.getByTestId('combined-wrapper');
      expect(cardWrapper).toHaveClass('pf-v6-widget-grid-tile');
      expect(cardWrapper).toHaveClass('custom-wrapper');

      const cardBody = screen.getByTestId('combined-body');
      expect(cardBody).toHaveClass('pf-v6-widget-grid-tile__body');
      expect(cardBody).toHaveClass('custom-body');
    });
  });
});

describe('GridTile - widget actions', () => {
  const openActionsMenu = async () => {
    const toggle = screen.getByRole('button', { name: /widget actions/i });
    await userEvent.click(toggle);
  };

  it('renders lock action and calls setWidgetAttribute on click', async () => {
    const setWidgetAttribute = jest.fn();
    render(<GridTile {...createProps({ setWidgetAttribute })} />);

    await openActionsMenu();
    await userEvent.click(screen.getByText('Lock location and size'));

    expect(setWidgetAttribute).toHaveBeenCalledWith('test-widget-1', 'static', true);
  });

  it('renders unlock action when widget is static', async () => {
    const setWidgetAttribute = jest.fn();
    render(
      <GridTile
        {...createProps({
          setWidgetAttribute,
          widgetConfig: { ...createProps().widgetConfig, static: true },
        })}
      />
    );

    await openActionsMenu();
    await userEvent.click(screen.getByText('Unlock location and size'));

    expect(setWidgetAttribute).toHaveBeenCalledWith('test-widget-1', 'static', false);
  });

  it('calls setWidgetAttribute with maxH on maximize', async () => {
    const setWidgetAttribute = jest.fn();
    render(<GridTile {...createProps({ setWidgetAttribute })} />);

    await openActionsMenu();
    await userEvent.click(screen.getByText('Maximize height'));

    expect(setWidgetAttribute).toHaveBeenCalledWith('test-widget-1', 'h', 6);
  });

  it('calls setWidgetAttribute with minH on minimize', async () => {
    const setWidgetAttribute = jest.fn();
    render(<GridTile {...createProps({ setWidgetAttribute })} />);

    await openActionsMenu();
    await userEvent.click(screen.getByText('Minimize height'));

    expect(setWidgetAttribute).toHaveBeenCalledWith('test-widget-1', 'h', 2);
  });

  it('disables maximize when already at maxH', async () => {
    render(
      <GridTile
        {...createProps({
          widgetConfig: { ...createProps().widgetConfig, h: 6, maxH: 6 },
        })}
      />
    );

    await openActionsMenu();
    const maximizeItem = screen.getByText('Maximize height').closest('button');
    expect(maximizeItem).toBeDisabled();
  });

  it('disables minimize when already at minH', async () => {
    render(
      <GridTile
        {...createProps({
          widgetConfig: { ...createProps().widgetConfig, h: 2, minH: 2 },
        })}
      />
    );

    await openActionsMenu();
    const minimizeItem = screen.getByText('Minimize height').closest('button');
    expect(minimizeItem).toBeDisabled();
  });

  it('calls removeWidget on remove action', async () => {
    const removeWidget = jest.fn();
    render(<GridTile {...createProps({ removeWidget })} />);

    await openActionsMenu();
    await userEvent.click(screen.getByText('Remove'));

    expect(removeWidget).toHaveBeenCalledWith('test-widget-1');
  });

  it('disables actions when widget is static', async () => {
    render(
      <GridTile
        {...createProps({
          widgetConfig: { ...createProps().widgetConfig, static: true },
        })}
      />
    );

    await openActionsMenu();

    const maximizeItem = screen.getByText('Maximize height').closest('button');
    const minimizeItem = screen.getByText('Minimize height').closest('button');
    const removeItem = screen.getByText('Remove').closest('button');

    expect(maximizeItem).toBeDisabled();
    expect(minimizeItem).toBeDisabled();
    expect(removeItem).toBeDisabled();
  });
});

describe('GridTile - header link', () => {
  it('renders header link when configured', () => {
    render(
      <GridTile
        {...createProps({
          widgetConfig: {
            ...createProps().widgetConfig,
            config: {
              title: 'Test Widget',
              headerLink: { title: 'View details', href: '#' },
            },
          },
        })}
      />
    );

    expect(screen.getByText('View details')).toBeInTheDocument();
  });

  it('does not render header link when not configured', () => {
    render(
      <GridTile
        {...createProps({
          widgetConfig: {
            ...createProps().widgetConfig,
            config: { title: 'Test Widget' },
          },
        })}
      />
    );

    expect(screen.queryByText('View details')).not.toBeInTheDocument();
  });

  it('renders widget title from config', () => {
    render(
      <GridTile
        {...createProps({
          widgetConfig: {
            ...createProps().widgetConfig,
            config: { title: 'My Custom Title' },
          },
        })}
      />
    );

    expect(screen.getByText('My Custom Title')).toBeInTheDocument();
  });

  it('falls back to widgetType when no title configured', () => {
    render(<GridTile {...createProps()} />);
    expect(screen.getByText('test-widget')).toBeInTheDocument();
  });
});
