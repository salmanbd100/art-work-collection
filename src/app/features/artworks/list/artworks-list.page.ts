import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSelectChange, MatSelect, MatOption } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
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
  protected selectedStyles: string[] = [];
  protected readonly skeletonItems = Array.from({ length: 8 });

  constructor() {
    useUrlSync();
  }

  onSearch(q: string): void {
    this.store.setQuery(q);
  }

  onPageChange(event: PageEvent): void {
    this.store.setPage(event.pageIndex + 1);
    this.store.setPerPage(event.pageSize);
    this.selectedStyles = [];
  }

  onStyleFilterChange(styles: string[]): void {
    this.selectedStyles = styles;
    this.store.clearStyles();
    styles.forEach((s) => this.store.toggleStyle(s));
    this.store.setSort(null);
  }

  onChangeSortBy(event: MatSelectChange): void {
    this.selectedStyles = [];
    this.store.clearStyles();
    this.store.setSort((event.value as string).toLowerCase() as ArtworkSort);
  }
}
