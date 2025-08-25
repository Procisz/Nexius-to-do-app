import { MatPaginatorIntl } from '@angular/material/paginator';

export function huPaginatorIntl(): MatPaginatorIntl {
    const intl = new MatPaginatorIntl();

    intl.itemsPerPageLabel = 'Elem oldalanként:';
    intl.nextPageLabel = 'Következő oldal';
    intl.previousPageLabel = 'Előző oldal';
    intl.firstPageLabel = 'Első oldal';
    intl.lastPageLabel = 'Utolsó oldal';

    intl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
        const total = Math.max(0, length);
        const size = Math.max(1, Math.floor(pageSize || 0));

        if (total === 0) return `0 - 0 / 0`;

        const maxPageIndex = Math.max(0, Math.ceil(total / size) - 1);
        const safePage = Math.min(Math.max(0, Math.floor(page || 0)), maxPageIndex);

        const start = safePage * size;
        const end = Math.min(start + size, total);

        return `${start + 1} - ${end} / ${total}`;
    };

    return intl;
}
