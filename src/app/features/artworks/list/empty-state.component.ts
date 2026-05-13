import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
  template: `
    <div class="empty-state" role="status">
      <p class="empty-message">No artworks found{{ query() ? ' for "' + query() + '"' : '' }}.</p>
      @if (query()) {
        <button mat-button (click)="cleared.emit()">Clear search</button>
      }
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 80px 0;
      }
      .empty-message {
        font-size: 1.1rem;
        color: rgba(0, 0, 0, 0.54);
      }
    `,
  ],
})
export class EmptyStateComponent {
  readonly query = input('');
  readonly cleared = output<void>();
}
