import { Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, tap } from 'rxjs';

@Directive({
    selector: '[appStopPropagation]',
})
export class StopPropagationDirective {
    private readonly elementRef = inject(ElementRef<HTMLElement>);

    constructor() {
        fromEvent<MouseEvent>(this.elementRef.nativeElement, 'click')
            .pipe(
                tap((event: MouseEvent) => {
                    event.stopPropagation();
                    event.preventDefault();
                }),
                takeUntilDestroyed(),
            )
            .subscribe();
    }
}
