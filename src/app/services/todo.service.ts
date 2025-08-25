import type { HttpResourceRef } from '@angular/common/http';
import { HttpClient, httpResource } from '@angular/common/http';
import type { Signal } from '@angular/core';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { z as zod } from 'zod';

import { API_PATHS } from '../utils/constants/api.constants';
import type { FILTER_VALUES } from '../utils/constants/form.constants';

const TODO_SCHEMA = zod.object({
    id: zod.string(),
    label: zod.string(),
    description: zod.string(),
    completed: zod.boolean(),
    createdAt: zod.number(),
});

const GET_TODOS_MOCK_RESPONSE_SCHEMA = zod.object({
    totalItems: zod.number(),
    items: zod.array(TODO_SCHEMA),
});

export type Todo = {
    id: string;
    label: string;
    description: string;
    completed: boolean;
    createdAt: number; // timestamp
};
export type CreateTodoMockPayload = {
    label: string;
    description: string;
};
export type GetTodosMockResponse = {
    totalItems: number;
    items: Todo[];
};

@Injectable({ providedIn: 'root' })
export class TodoService {
    private readonly _http = inject(HttpClient);

    public createTodo$(payload: CreateTodoMockPayload): Observable<Todo> {
        return this._http.post<Todo>(`/api/${API_PATHS.CreateTodo}`, { payload });
    }

    public getTodosResource(
        filterSignal: Signal<(typeof FILTER_VALUES)[keyof typeof FILTER_VALUES]>,
        searchSignal: Signal<string>,
        pageSize: Signal<number>,
        pageIndex: Signal<number>,
    ): HttpResourceRef<GetTodosMockResponse | undefined> {
        return httpResource<GetTodosMockResponse>(
            () => ({
                method: 'GET',
                url: `/api/${API_PATHS.ListTodos}`,
                params: {
                    filter: filterSignal(),
                    searchTerm: searchSignal(),
                    pageSize: pageSize(),
                    pageIndex: pageIndex(),
                },
            }),
            {
                parse: (rawData: unknown): GetTodosMockResponse => {
                    const parsedResponse: GetTodosMockResponse =
                        GET_TODOS_MOCK_RESPONSE_SCHEMA.parse(rawData);
                    return {
                        totalItems: parsedResponse.totalItems,
                        items: [...parsedResponse.items].sort(
                            (a: Todo, b: Todo) => b.createdAt - a.createdAt,
                        ),
                    };
                },
            },
        );
    }

    public updateTodo$(todo: Todo): Observable<Todo> {
        return this._http.put<Todo>(`/api/${API_PATHS.UpdateTodo}`, { todo });
    }

    public deleteTodo$(todoId: string): Observable<void> {
        return this._http.delete<void>(`/api/${API_PATHS.DeleteTodo}`, { params: { todoId } });
    }
}
