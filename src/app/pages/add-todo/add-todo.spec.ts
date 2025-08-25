import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import type { Todo } from '../../services/todo.service';
import { TodoService } from '../../services/todo.service';
import { ROUTE_PATHS } from '../../utils/constants/router.constants';
import { generateRandomId } from '../../utils/functions/id-generator';

import { AddTodo } from './add-todo';

const MOCK_TODO: Todo = {
    id: generateRandomId(10),
    label: 'Kenyeret venni',
    description: 'Kovászos, glutén és élesztő mentes',
    completed: false,
    createdAt: Date.now(),
};

describe('[COMPONENT] AddTodo', () => {
    let component: AddTodo;
    let fixture: ComponentFixture<AddTodo>;

    let todoService: jasmine.SpyObj<TodoService>;
    let matSnackBar: jasmine.SpyObj<MatSnackBar>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        todoService = jasmine.createSpyObj<TodoService>('TodoService', ['createTodo$']);
        matSnackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [AddTodo],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                { provide: TodoService, useValue: todoService },
                { provide: MatSnackBar, useValue: matSnackBar },
                { provide: Router, useValue: router },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddTodo);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onSubmit: submits valid form, shows snackbar, navigates, and resets submitting flag', () => {
        const host: HTMLElement = fixture.nativeElement;
        const labelInput: HTMLInputElement | null = host.querySelector<HTMLInputElement>(
            'input[formControlName="label"]',
        );
        const descriptionInput: HTMLInputElement | null = host.querySelector<HTMLInputElement>(
            'textarea[formControlName="description"], input[formControlName="description"]',
        );

        if (!labelInput || !descriptionInput) {
            fail('Label or description input not found');
            return;
        }

        labelInput.value = MOCK_TODO.label;
        labelInput.dispatchEvent(new Event('input', { bubbles: true }));
        descriptionInput.value = MOCK_TODO.description;
        descriptionInput.dispatchEvent(new Event('input', { bubbles: true }));

        todoService.createTodo$.and.returnValue(of(MOCK_TODO));

        const form: HTMLFormElement | null = host.querySelector<HTMLFormElement>('form');
        if (!form) {
            fail('Form element not found');
            return;
        }

        form.dispatchEvent(new Event('submit'));

        expect(todoService.createTodo$).toHaveBeenCalledOnceWith({
            label: MOCK_TODO.label,
            description: MOCK_TODO.description,
        });

        expect(matSnackBar.open).toHaveBeenCalled();
        const [snackBarMessage, snackBarAction, snackBarConfig] =
            matSnackBar.open.calls.mostRecent().args as [string, string, { duration?: number }];
        expect(snackBarMessage).toContain(`"${MOCK_TODO.label}" feladat létrehozva.`);
        expect(snackBarAction).toBe('Bezárás');
        expect(snackBarConfig?.duration).toBe(3000);

        expect(router.navigate).toHaveBeenCalledOnceWith([ROUTE_PATHS.ListTodos]);
    });

    it('onSubmit: does nothing when form is invalid (no service/snackbar/navigation)', () => {
        const host: HTMLElement = fixture.nativeElement;
        const form: HTMLFormElement | null = host.querySelector<HTMLFormElement>('form');
        if (!form) {
            fail('Form element not found');
            return;
        }
        form.dispatchEvent(new Event('submit'));

        expect(todoService.createTodo$).not.toHaveBeenCalled();
        expect(matSnackBar.open).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
    });
});
