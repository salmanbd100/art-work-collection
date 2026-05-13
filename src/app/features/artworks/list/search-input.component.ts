import {
  Component,
  ChangeDetectionStrategy,
  output,
  signal,
  OnInit,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatFormField, MatLabel, MatInput, MatSuffix, MatIconButton, MatIcon],
  template: `
    <mat-form-field appearance="outline" class="search-field">
      <mat-label>Search artworks</mat-label>
      <input
        matInput
        [(ngModel)]="rawValue"
        (ngModelChange)="onInput($event)"
        [attr.aria-label]="'Search artworks'"
      />
      @if (rawValue()) {
        <button mat-icon-button matSuffix (click)="clear()" aria-label="Clear search">
          <mat-icon>close</mat-icon>
        </button>
      }
    </mat-form-field>
  `,
  styles: [
    `
      .search-field {
        width: 100%;
        min-width: 200px;
      }
    `,
  ],
})
export class SearchInputComponent implements OnInit {
  readonly searched = output<string>();
  protected rawValue = signal('');
  private readonly input$ = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.input$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => this.searched.emit(v));
  }

  protected onInput(v: string): void {
    this.input$.next(v);
  }

  protected clear(): void {
    this.rawValue.set('');
    this.input$.next('');
  }
}
