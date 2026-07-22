import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from '../components/ui/Card';

describe('Card UI Component', () => {
  it('renders children content inside glass card container', () => {
    render(
      <Card glow="blue">
        <p>Telemetry Card Content</p>
      </Card>
    );
    expect(screen.getByText('Telemetry Card Content')).toBeDefined();
  });
});
