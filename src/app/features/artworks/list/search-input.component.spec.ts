import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { SearchInputComponent } from './search-input.component';
import { vi } from 'vitest';

describe('SearchInputComponent', () => {
  it('renders a search input', async () => {
    await render(SearchInputComponent, { componentInputs: { value: '' } });
    expect(screen.getByRole('textbox', { name: /search artworks/i })).toBeTruthy();
  });

  it('emits debounced search output after typing', async () => {
    const searched = vi.fn();
    const user = userEvent.setup();
    await render(SearchInputComponent, {
      componentInputs: { value: '' },
      on: { searched },
    });
    const input = screen.getByRole('textbox', { name: /search artworks/i });
    await user.type(input, 'monet');
    // Wait >300ms for debounce
    await new Promise((r) => setTimeout(r, 350));
    expect(searched).toHaveBeenCalledWith('monet');
  }, 2000);

  it('shows clear button when input has value', async () => {
    const user = userEvent.setup();
    await render(SearchInputComponent, { componentInputs: { value: '' } });
    const input = screen.getByRole('textbox', { name: /search artworks/i });
    await user.type(input, 'x');
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getByRole('button', { name: /clear search/i })).toBeTruthy();
  });

  it('emits empty string on clear', async () => {
    const searched = vi.fn();
    const user = userEvent.setup();
    await render(SearchInputComponent, {
      componentInputs: { value: '' },
      on: { searched },
    });
    const input = screen.getByRole('textbox', { name: /search artworks/i });
    await user.type(input, 'monet');
    await new Promise((r) => setTimeout(r, 350));
    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    await user.click(clearBtn);
    await new Promise((r) => setTimeout(r, 350));
    expect(searched).toHaveBeenLastCalledWith('');
  }, 3000);
});
