import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GridTile, { GridTileProps } from '../GridTile';

const defaultProps: GridTileProps = {
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
    colWidth: 100,
  },
  removeWidget: jest.fn(),
  children: <div data-testid="widget-content">Widget Content</div>,
  isLoaded: true,
};

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
      expect(cardWrapper).toHaveClass('grid-tile');
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
      expect(cardBody).toHaveClass('pf-v6-u-p-0');
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
      expect(cardWrapper).toHaveClass('grid-tile');
      expect(cardWrapper).toHaveClass('custom-wrapper');

      const cardBody = screen.getByTestId('combined-body');
      expect(cardBody).toHaveClass('pf-v6-u-p-0');
      expect(cardBody).toHaveClass('custom-body');
    });
  });
});
