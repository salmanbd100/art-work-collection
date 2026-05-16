import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSelectChange, MatSelect, MatOption } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ArtworksStore } from '../state/artworks.store';
import { ArtWorkCardComponent } from '../../../shared/art-work-card/art-work-card.component';
import { ArtworkSort } from '../../../data/artworks/artworks.types';
import { SearchInputComponent } from './search-input.component';
import { SkeletonCardComponent } from './skeleton-card.component';
import { EmptyStateComponent } from './empty-state.component';
import { ErrorStateComponent } from './error-state.component';
import { useUrlSync } from '../../../core/url-sync';

@Component({
  selector: 'app-artworks-list',
  templateUrl: './artworks-list.page.html',
  styleUrls: ['./artworks-list.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,
    MatOption,
    ArtWorkCardComponent,
    MatPaginator,
    TitleCasePipe,
    SearchInputComponent,
    SkeletonCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
})
export class ArtworksListPage {
  protected store = inject(ArtworksStore);
  protected sortOptions: ArtworkSort[] = ['name', 'artist', 'date'];
  protected readonly skeletonItems = Array.from({ length: 8 });

  constructor() {
    useUrlSync();
  }

  onSearch(q: string): void {
    this.store.setQuery(q);
  }

  onPageChange(event: PageEvent): void {
    this.store.setPerPage(event.pageSize);
    this.store.setPage(event.pageIndex + 1);
  }

  onStyleFilterChange(styles: string[]): void {
    this.store.clearStyles();
    styles.forEach((s) => this.store.toggleStyle(s));
    this.store.setPage(1);
  }

  onChangeSortBy(event: MatSelectChange): void {
    this.store.setSort(event.value as ArtworkSort | null);
    this.store.setPage(1);
  }
}
