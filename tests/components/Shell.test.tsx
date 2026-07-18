import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Shell } from '@/components/layout/Shell';
import { StadiumProvider } from '@/context/StadiumContext';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/'
}));

describe('UI Shell Accessibility Tests', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <StadiumProvider>
        <Shell>
          <div id="test-content">
            <h1>Test Content</h1>
            <p>Welcome to StadiumFlow AI.</p>
          </div>
        </Shell>
      </StadiumProvider>
    );

    const results = await axe(container);
    
    // Assert on violations directly
    expect(results.violations).toEqual([]);
  });
});
