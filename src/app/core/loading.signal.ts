import { signal } from '@angular/core';

export const loadingCount = signal(0);
export const isGloballyLoading = () => loadingCount() > 0;
