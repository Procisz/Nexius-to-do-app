import type { BreakpointState } from '@angular/cdk/layout';
import { BreakpointObserver } from '@angular/cdk/layout';
import { provideZonelessChangeDetection } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { App } from './app';
import { ToolbarService } from './services/toolbar.service';

describe('[COMPONENT] App', () => {
    let fixture: ComponentFixture<App>;
    let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;
    let toolbarService: ToolbarService;

    beforeEach(async () => {
        breakpointObserver = jasmine.createSpyObj<BreakpointObserver>('BreakpointObserver', [
            'observe',
            'isMatched',
        ]);
        breakpointObserver.isMatched.and.returnValue(true);

        const initialState: BreakpointState = { matches: true, breakpoints: {} };
        breakpointObserver.observe.and.returnValue(of(initialState));

        toolbarService = {
            toolbarElementHeight: { set: jasmine.createSpy('set') },
        } as unknown as ToolbarService;

        await TestBed.configureTestingModule({
            imports: [App],
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([]),
                { provide: BreakpointObserver, useValue: breakpointObserver },
                { provide: ToolbarService, useValue: toolbarService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(App);
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('calls BreakpointObserver with the expected media query', () => {
        fixture.detectChanges();

        const expectedQuery = '(min-width: 1024px)';

        const observeCalls = breakpointObserver.observe.calls;
        expect(observeCalls.count()).toBeGreaterThanOrEqual(1);

        const observeUsedExpectedQuery: boolean = observeCalls
            .allArgs()
            .some(([query]) =>
                Array.isArray(query) ? query.includes(expectedQuery) : query === expectedQuery,
            );
        expect(observeUsedExpectedQuery).toBeTrue();

        const isMatchedCalls = breakpointObserver.isMatched.calls;
        expect(isMatchedCalls.count()).toBeGreaterThanOrEqual(1);

        const isMatchedUsedExpectedQuery = isMatchedCalls
            .allArgs()
            .some(([query]) =>
                Array.isArray(query) ? query.includes(expectedQuery) : query === expectedQuery,
            );
        expect(isMatchedUsedExpectedQuery).toBeTrue();
    });
});
