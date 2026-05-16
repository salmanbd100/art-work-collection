import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ErrorStateComponent } from './error-state.component';
import { vi } from 'vitest';

describe('ErrorStateComponent', () => {
  it('renders error message', async () => {
    await render(ErrorStateComponent);
    expect(screen.getByText(/something went wrong/i)).toBeTruthy();
  });

  it('has role="alert" so screen readers announce it immediately', async () => {
    const { container } = await render(ErrorStateComponent);
    expect(container.querySelector('[role="alert"]')).toBeTruthy();
  });

  it('retry button calls store.retry when clicked', async () => {
    const retry = vi.fn();
    const user = userEvent.setup();
    await render(ErrorStateComponent, { on: { retry } });
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
