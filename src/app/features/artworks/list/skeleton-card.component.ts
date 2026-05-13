import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .skeleton {
          animation: none !important;
        }
      }
      .skeleton-card {
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
      }
      .skeleton {
        background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 4px;
      }
      .skeleton-img {
        width: 100%;
        height: 200px;
        border-radius: 0;
      }
      .skeleton-body {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .skeleton-title {
        height: 20px;
        width: 80%;
      }
      .skeleton-text {
        height: 14px;
        width: 100%;
      }
      .skeleton-text.short {
        width: 60%;
      }
    `,
  ],
})
export class SkeletonCardComponent {}
