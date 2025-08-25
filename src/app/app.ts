import type { BreakpointState } from '@angular/cdk/layout';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import type { ElementRef } from '@angular/core';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { distinctUntilChanged, map, throttleTime } from 'rxjs';

import { ToolbarService } from './services/toolbar.service';
import { ROUTE_PATHS } from './utils/constants/router.constants';

type MenuItem = {
    label: string;
    path: string;
    icon: string;
};

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatSidenavModule,
        MatButtonModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        RouterModule,
        NgClass,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './app.html',
})
export class App {
    private readonly _breakpointObserver = inject(BreakpointObserver);
    private readonly _toolbarService = inject(ToolbarService);

    protected readonly toolbarRef = viewChild<ElementRef<HTMLElement>>('toolbar');

    private readonly _desktopQuery = '(min-width: 1024px)';
    protected readonly isDesktop = toSignal(
        this._breakpointObserver.observe(this._desktopQuery).pipe(
            throttleTime(100, undefined, { leading: false, trailing: true }),
            map((state: BreakpointState) => state.matches),
            distinctUntilChanged(),
        ),
        { initialValue: this._breakpointObserver.isMatched(this._desktopQuery) },
    );
    protected readonly fixedTopGap = 56;
    protected readonly menuItems: MenuItem[] = [
        { label: 'Új TODO elem létrehozása', path: ROUTE_PATHS.AddDodo, icon: 'add' },
        { label: 'TODO elemek listázása', path: ROUTE_PATHS.ListTodos, icon: 'list' },
    ];

    private readonly defaultToolbarHeight = 64;
    private readonly _toolbarHeight = computed<number>(
        () =>
            this.toolbarRef()?.nativeElement?.getBoundingClientRect().height ??
            this.defaultToolbarHeight,
    );

    constructor() {
        effect(() => this._toolbarService.toolbarElementHeight.set(this._toolbarHeight()));
    }
}
