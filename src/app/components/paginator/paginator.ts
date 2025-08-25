import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import type { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-paginator',
    imports: [MatPaginatorModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <mat-paginator
            #paginator
            class="demo-paginator"
            (page)="handlePageEvent($event)"
            [length]="totalItems()"
            [pageSize]="pageSize()"
            [showFirstLastButtons]="true"
            [pageSizeOptions]="pageSizeOptions()"
            [pageIndex]="pageIndex()"
        />
    `,
})
export class Paginator {
    public readonly pageSize = model.required<number>();
    public readonly pageIndex = model.required<number>();
    public readonly totalItems = input.required<number>();
    public readonly pageSizeOptions = input.required<number[]>();

    protected handlePageEvent(event: PageEvent): void {
        this.pageSize.set(event.pageSize);
        this.pageIndex.set(event.pageIndex);
    }
}
