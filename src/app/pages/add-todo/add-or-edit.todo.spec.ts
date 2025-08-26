import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import type { Todo } from '../../services/todo.service';
import { TodoService } from '../../services/todo.service';
import { ROUTE_PATHS } from '../../utils/constants/router.constants';
import { generateRandomId } from '../../utils/functions/id-generator';

import { AddOrEditTodo } from './add-or-edit-todo';

const MOCK_TODO: Todo = {
    id: generateRandomId(10),
    label: 'Kenyeret venni',
    description: 'Kovászos, glutén és élesztő mentes',
    completed: false,
    createdAt: Date.now(),
};

function fillForm(host: HTMLElement, label: string, description: string): void {
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

    labelInput.value = label;
    labelInput.dispatchEvent(new Event('input', { bubbles: true }));
    descriptionInput.value = description;
    descriptionInput.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('[COMPONENT] AddOrEditTodo', () => {
    let component: AddOrEditTodo;
    let fixture: ComponentFixture<AddOrEditTodo>;

    let todoService: jasmine.SpyObj<TodoService>;
    let matSnackBar: jasmine.SpyObj<MatSnackBar>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        todoService = jasmine.createSpyObj<TodoService>('TodoService', ['createTodo$']);
        matSnackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [AddOrEditTodo],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                { provide: TodoService, useValue: todoService },
                { provide: MatSnackBar, useValue: matSnackBar },
                { provide: Router, useValue: router },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddOrEditTodo);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => expect(component).toBeTruthy());
});

describe('[COMPONENT] AddOrEditTodo — create new todo flow', () => {
    let fixture: ComponentFixture<AddOrEditTodo>;
    let todoService: jasmine.SpyObj<TodoService>;
    let matSnackBar: jasmine.SpyObj<MatSnackBar>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        todoService = jasmine.createSpyObj<TodoService>('TodoService', [
            'createTodo$',
            'updateTodo$',
        ]);
        matSnackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [AddOrEditTodo],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                { provide: TodoService, useValue: todoService },
                { provide: MatSnackBar, useValue: matSnackBar },
                { provide: Router, useValue: router },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddOrEditTodo);
        fixture.detectChanges();
    });

    it('does nothing when form invalid', () => {
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

    it('creates a new todo, shows snackbar, and navigates away', () => {
        const host: HTMLElement = fixture.nativeElement;
        fillForm(host, MOCK_TODO.label, MOCK_TODO.description);

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
            matSnackBar.open.calls.mostRecent().args;

        expect(snackBarMessage).toContain(`"${MOCK_TODO.label}" feladat létrehozva.`);
        expect(snackBarAction).toBe('Bezárás');
        expect(snackBarConfig?.duration).toBe(3000);
        expect(router.navigate).toHaveBeenCalledOnceWith([ROUTE_PATHS.ListTodos]);
    });
});

describe('[COMPONENT] AddOrEditTodo — edit existing todo flow', () => {
    let fixture: ComponentFixture<AddOrEditTodo>;
    let todoService: jasmine.SpyObj<TodoService>;
    let matSnackBar: jasmine.SpyObj<MatSnackBar>;
    let router: jasmine.SpyObj<Router>;
    const dialogClose = jasmine.createSpy('close');

    beforeEach(async () => {
        todoService = jasmine.createSpyObj<TodoService>('TodoService', [
            'createTodo$',
            'updateTodo$',
        ]);
        matSnackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [AddOrEditTodo],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                { provide: TodoService, useValue: todoService },
                { provide: MatSnackBar, useValue: matSnackBar },
                { provide: Router, useValue: router },
                { provide: MatDialogRef, useValue: { close: dialogClose } },
                { provide: MAT_DIALOG_DATA, useValue: signal<Todo | null>(MOCK_TODO) },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddOrEditTodo);
        fixture.detectChanges();
    });

    it('prefills the form with the provided todo', () => {
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

        expect(labelInput.value).toBe(MOCK_TODO.label);
        expect(descriptionInput.value).toBe(MOCK_TODO.description);
    });

    it('updates existing todo, shows snackbar, and closes dialog (no navigate)', () => {
        const host: HTMLElement = fixture.nativeElement;
        const newLabel = 'new label';
        const newDescription = 'new description';
        fillForm(host, newLabel, newDescription);

        const updatedTodo: Todo = { ...MOCK_TODO, label: newLabel, description: newDescription };
        todoService.updateTodo$.and.returnValue(of(updatedTodo));
        const form: HTMLFormElement | null = host.querySelector<HTMLFormElement>('form');
        if (!form) {
            fail('Form element not found');
            return;
        }
        form.dispatchEvent(new Event('submit'));

        expect(todoService.updateTodo$).toHaveBeenCalledOnceWith(updatedTodo);
        expect(matSnackBar.open).toHaveBeenCalled();

        const [snackBarMessage, snackBarAction, snackBarConfig] =
            matSnackBar.open.calls.mostRecent().args;

        expect(snackBarMessage).toContain(`"${updatedTodo.label}" feladat adatai frissítve.`);
        expect(snackBarAction).toBe('Bezárás');
        expect(snackBarConfig?.duration).toBe(3000);
        expect(router.navigate).not.toHaveBeenCalled();
    });
});
