import type { HttpHandler } from 'msw';
import { delay, http, HttpResponse } from 'msw';

import type {
    CreateTodoMockPayload,
    GetTodosMockResponse,
    Todo,
} from '../app/services/todo.service';
import { API_PATHS } from '../app/utils/constants/api.constants';
import { FILTER_VALUES } from '../app/utils/constants/form.constants';
import { generateRandomId } from '../app/utils/functions/id-generator';

import { createListTodosResponse, createRandomDelay } from './functions';
import { mockTodos } from './mock.data';

const todos: Todo[] = [...mockTodos];

export const handlers: HttpHandler[] = [
    http.post(`/api/${API_PATHS.CreateTodo}`, async ({ request }) => {
        const body = (await request.json().catch(() => null)) as {
            payload?: CreateTodoMockPayload;
        } | null;
        const payload: CreateTodoMockPayload | undefined = body?.payload;

        if (!payload) {
            return HttpResponse.json({ message: 'Invalid payload. ' }, { status: 400 });
        }

        const newTodo: Todo = {
            id: generateRandomId(10),
            label: payload.label,
            description: payload.description,
            completed: false,
            createdAt: Date.now(),
        };

        todos.unshift(newTodo);

        await delay(createRandomDelay(500, 1000));
        return HttpResponse.json(newTodo, { status: 201 });
    }),

    http.get(`/api/${API_PATHS.ListTodos}`, async ({ request }) => {
        const url: URL = new URL(request.url);
        const filter = url.searchParams.get('filter') ?? FILTER_VALUES.All;
        const searchTerm = url.searchParams.get('searchTerm') ?? '';
        const pageSize = Number(url.searchParams.get('pageSize')) || 25;
        const pageIndex = Number(url.searchParams.get('pageIndex')) || 0;

        const response: GetTodosMockResponse = createListTodosResponse(
            todos,
            filter,
            searchTerm,
            pageSize,
            pageIndex,
        );

        await delay(createRandomDelay());
        return HttpResponse.json(response);
    }),

    http.put(`/api/${API_PATHS.UpdateTodo}`, async ({ request }) => {
        const body = (await request.json().catch(() => null)) as { todo?: Todo } | null;
        const payload: Todo | undefined = body?.todo;

        if (!payload) {
            return HttpResponse.json({ message: 'Invalid payload. ' }, { status: 400 });
        }

        const foundTodoIndex: number = todos.findIndex((todo: Todo) => todo.id === payload.id);
        const existingTodo: Todo | undefined = todos.at(foundTodoIndex);

        if (!existingTodo) {
            return HttpResponse.json({ message: 'Todo not found' }, { status: 404 });
        }

        const merged: Todo = {
            ...existingTodo,
            ...payload,
            createdAt: existingTodo.createdAt,
        };

        todos[foundTodoIndex] = merged;

        return HttpResponse.json(merged);
    }),

    http.delete(`/api/${API_PATHS.DeleteTodo}`, ({ request }) => {
        const url: URL = new URL(request.url);
        const todoId = url.searchParams.get('todoId') ?? '';

        if (!todoId) {
            return HttpResponse.json({ message: 'Invalid payload. ' }, { status: 400 });
        }

        const foundTodoIndex: number = todos.findIndex((todo: Todo) => todo.id === todoId);
        if (foundTodoIndex === -1) {
            return HttpResponse.json({ message: 'Todo not found' }, { status: 404 });
        }

        todos.splice(foundTodoIndex, 1);

        return new HttpResponse(null, { status: 204 });
    }),
];
