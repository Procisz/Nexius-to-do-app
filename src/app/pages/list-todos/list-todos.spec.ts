import { provideZonelessChangeDetection } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import type { GetTodosMockResponse, Todo } from '../../services/todo.service';
import { TodoService } from '../../services/todo.service';
import { ToolbarService } from '../../services/toolbar.service';
import { generateRandomId } from '../../utils/functions/id-generator';

import { ListTodos } from './list-todos';

const MOCK_TODO: Todo = {
    id: generateRandomId(10),
    label: 'Kenyeret venni',
    description: 'Kovászos, glutén és élesztő mentes',
    completed: false,
    createdAt: Date.now(),
};

type HttpResourceRefStub<T> = {
    value: () => T | undefined;
    error: () => unknown;
    isLoading: () => boolean;
    isReloading: () => boolean;
    reload: () => void;
    update: (updater: (current: T | undefined) => T | undefined) => void;
};

class ListTodosTestClass extends ListTodos {
    public deleteTodoForTestCases(todo: Todo): void {
        this.onDeleteTodoButtonClicked(todo);
    }
}

describe('[COMPONENT] ListTodos', () => {
    let fixture: ComponentFixture<ListTodosTestClass>;
    let component: ListTodosTestClass;

    let todoService: jasmine.SpyObj<TodoService>;
    let matDialog: jasmine.SpyObj<MatDialog>;
    let matSnackBar: jasmine.SpyObj<MatSnackBar>;
    let toolbarService: jasmine.SpyObj<ToolbarService>;
    let httpResourceRef: HttpResourceRefStub<GetTodosMockResponse | undefined>;

    beforeEach(async () => {
        todoService = jasmine.createSpyObj<TodoService>('TodoService', [
            'getTodosResource',
            'updateTodo$',
            'deleteTodo$',
        ]);

        httpResourceRef = {
            value: (): GetTodosMockResponse | undefined => undefined,
            error: (): unknown => null,
            isLoading: (): boolean => false,
            isReloading: (): boolean => false,
            reload: jasmine.createSpy('reload'),
            update: jasmine.createSpy('update'),
        };
        todoService.getTodosResource.and.returnValue(
            httpResourceRef as unknown as ReturnType<TodoService['getTodosResource']>,
        );

        matDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
        matSnackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

        toolbarService = jasmine.createSpyObj<ToolbarService>('ToolbarService', [
            'toolbarElementHeight',
        ]);
        toolbarService.toolbarElementHeight.and.returnValue(64);

        await TestBed.configureTestingModule({
            imports: [ListTodosTestClass],
            providers: [
                provideZonelessChangeDetection(),
                { provide: TodoService, useValue: todoService },
                { provide: MatDialog, useValue: matDialog },
                { provide: MatSnackBar, useValue: matSnackBar },
                { provide: ToolbarService, useValue: toolbarService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ListTodosTestClass);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => expect(component).toBeTruthy());

    it('onDeleteTodoButtonClicked: green flow if TODO is eligible for deletion', () => {
        const dialogRefStub = {
            afterClosed: () => of(true),
        } as unknown as MatDialogRef<unknown, boolean>;

        matDialog.open.and.returnValue(dialogRefStub);
        todoService.deleteTodo$.and.returnValue(of(void 0));
        component.deleteTodoForTestCases(MOCK_TODO);

        expect(matSnackBar.open).toHaveBeenCalledWith(
            `"${MOCK_TODO.label}" elem törölve.`,
            'Bezárás',
            jasmine.objectContaining({ duration: 2000 }),
        );
        expect(httpResourceRef.reload).toHaveBeenCalled();
    });
});
