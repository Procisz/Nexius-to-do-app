import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { tap } from 'rxjs';

import { API_PATHS } from '../utils/constants/api.constants';
import { FILTER_VALUES } from '../utils/constants/form.constants';
import { generateRandomId } from '../utils/functions/id-generator';

import {
    TodoService,
    type CreateTodoMockPayload,
    type GetTodosMockResponse,
    type Todo,
} from './todo.service';

const MOCK_TODO: Todo = {
    id: generateRandomId(10),
    label: 'Kenyeret venni',
    description: 'Kovászos, glutén és élesztő mentes',
    completed: false,
    createdAt: Date.now(),
};

describe('[SERVICE] TodoService', () => {
    let todoService: TodoService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                provideHttpClientTesting(),
                TodoService,
            ],
        });

        todoService = TestBed.inject(TodoService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpTestingController.verify());

    it('createTodo$: issues POST to correct endpoint with payload and returns created todo', () => {
        const payload: CreateTodoMockPayload = {
            label: MOCK_TODO.label,
            description: MOCK_TODO.description,
        };

        let response: Todo | undefined;
        todoService
            .createTodo$(payload)
            .pipe(tap((value: Todo) => (response = value)))
            .subscribe();

        const requestToWatch = httpTestingController.expectOne(
            (request) =>
                request.method === 'POST' && request.url === `/api/${API_PATHS.CreateTodo}`,
        );
        expect(requestToWatch.request.body).toEqual({ payload });

        requestToWatch.flush(MOCK_TODO);

        expect(response).toBeDefined();
        expect(response).toEqual(MOCK_TODO);
    });

    it('updateTodo$: issues PUT to correct endpoint with todo body and returns updated todo', () => {
        const updatedTodo: Todo = { ...MOCK_TODO, completed: true };

        let response: Todo | undefined;
        todoService
            .updateTodo$(updatedTodo)
            .pipe(tap((value: Todo) => (response = value)))
            .subscribe();

        const requestToWatch = httpTestingController.expectOne(
            (request) => request.method === 'PUT' && request.url === `/api/${API_PATHS.UpdateTodo}`,
        );
        expect(requestToWatch.request.body).toEqual({ todo: updatedTodo });

        requestToWatch.flush(updatedTodo);

        expect(response).toEqual(updatedTodo);
    });

    it('deleteTodo$: issues DELETE to correct endpoint with todoId param', () => {
        const todoId: string = MOCK_TODO.id;

        todoService.deleteTodo$(todoId).subscribe();

        const requestToWatch = httpTestingController.expectOne(
            (request) =>
                request.method === 'DELETE' &&
                request.url === `/api/${API_PATHS.DeleteTodo}` &&
                request.params.get('todoId') === todoId,
        );

        expect(requestToWatch.request.params.get('todoId')).toBe(todoId);

        requestToWatch.flush(null);
    });

    it('getTodosResource: issues GET with params from signals and returns items sorted by createdAt desc', async () => {
        const filterSignal = signal<(typeof FILTER_VALUES)[keyof typeof FILTER_VALUES]>(
            FILTER_VALUES.All,
        );
        const searchSignal = signal<string>('');
        const pageSizeSignal = signal<number>(25);
        const pageIndexSignal = signal<number>(0);

        const httpResourceRef = TestBed.runInInjectionContext(() =>
            todoService.getTodosResource(
                filterSignal,
                searchSignal,
                pageSizeSignal,
                pageIndexSignal,
            ),
        );

        await new Promise((resolve) => setTimeout(resolve, 0));

        const requestToWatch = httpTestingController.expectOne(
            (req) => req.method === 'GET' && req.url === `/api/${API_PATHS.ListTodos}`,
        );

        expect(requestToWatch.request.params.get('filter')).toBe(filterSignal());
        expect(requestToWatch.request.params.get('searchTerm')).toBe(searchSignal());
        expect(requestToWatch.request.params.get('pageSize')).toBe(String(pageSizeSignal()));
        expect(requestToWatch.request.params.get('pageIndex')).toBe(String(pageIndexSignal()));

        const backendResponse: GetTodosMockResponse = {
            totalItems: 3,
            items: [
                { id: 'a', label: 'A', description: 'A', completed: false, createdAt: 64352435345 },
                { id: 'b', label: 'B', description: 'B', completed: false, createdAt: 79756456756 },
                { id: 'c', label: 'C', description: 'C', completed: true, createdAt: 89756456756 },
            ],
        };
        requestToWatch.flush(backendResponse);

        await new Promise((resolve) => setTimeout(resolve, 0));

        const value: GetTodosMockResponse | undefined = httpResourceRef.value();
        expect(value).toBeDefined();
        expect(value!.totalItems).toBe(3);
        expect(value!.items.map((todo: Todo) => todo.id)).toEqual(['c', 'b', 'a']);
    });
});
