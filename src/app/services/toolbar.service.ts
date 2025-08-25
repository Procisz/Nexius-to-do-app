import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToolbarService {
    public readonly toolbarElementHeight = signal<number>(0);
}
