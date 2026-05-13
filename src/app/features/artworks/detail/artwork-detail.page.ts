import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ArtworksApi } from '../../../data/artworks/artworks.api';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { environment } from '@environment';

@Component({
  selector: 'app-artwork-detail',
  templateUrl: './artwork-detail.page.html',
  styleUrls: ['./artwork-detail.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinner, MatButton, RouterLink],
})
export class ArtworkDetailPage {
  private api = inject(ArtworksApi);
  private route = inject(ActivatedRoute);

  private readonly routeId = toSignal(this.route.paramMap.pipe(map((p) => Number(p.get('id')))), {
    initialValue: 0,
  });

  readonly detailResource = rxResource({
    params: () => ({ id: this.routeId() }),
    stream: ({ params }) => this.api.getById(params.id),
  });

  readonly artwork = computed(() => this.detailResource.value()?.artwork);
  readonly iiifUrl = computed(() => this.detailResource.value()?.iiifUrl ?? '');
  readonly imageUrl = computed(() => {
    const art = this.artwork();
    if (!art?.imageId) return environment.defaultImageUrl;
    return `${this.iiifUrl()}/${art.imageId}/full/843,/0/default.jpg`;
  });

  protected readonly defaultImageUrl = environment.defaultImageUrl;

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImageUrl;
  }
}
