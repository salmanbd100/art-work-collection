import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-error-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
  template: `
    <div class="error-state" role="alert">
      <p class="error-message">Something went wrong loading the artworks.</p>
      <button mat-flat-button color="primary" (click)="retry.emit()">Try again</button>
    </div>
  `,
  styles: [
    `
      .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 80px 0;
      }
      .error-message {
        font-size: 1.1rem;
        color: rgba(0, 0, 0, 0.54);
      }
    `,
  ],
})
export class ErrorStateComponent {
  readonly retry = output<void>();
}
