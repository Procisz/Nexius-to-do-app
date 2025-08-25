import type { GetTodosMockResponse, Todo } from '../app/services/todo.service';
import { FILTER_VALUES } from '../app/utils/constants/form.constants';

export function createListTodosResponse(
    todos: Todo[],
    filter: string,
    searchTerm: string,
    pageSize: number,
    pageIndex: number,
): GetTodosMockResponse {
    const result: GetTodosMockResponse = {
        totalItems: todos.length,
        items: todos,
    };

    if (filter && filter !== FILTER_VALUES.All) {
        result.items = result.items.filter((todo: Todo) =>
            filter === FILTER_VALUES.Completed ? todo.completed : !todo.completed,
        );
    }

    if (searchTerm)
        result.items = result.items.filter((todo: Todo) =>
            normalizeString(todo.description).includes(normalizeString(searchTerm)),
        );

    const total: number = result.items.length;
    const safePageSize: number = Math.max(1, Number.isFinite(pageSize) ? Math.floor(pageSize) : 10);
    const maxPageIndex: number = Math.max(0, Math.ceil(total / safePageSize) - 1);
    const safePageIndex: number = Math.min(
        Math.max(0, Number.isFinite(pageIndex) ? Math.floor(pageIndex) : 0),
        maxPageIndex,
    );

    const start: number = safePageIndex * safePageSize;
    result.items = result.items.slice(start, start + safePageSize);

    result.totalItems = total;
    result.items = [...result.items].sort((a: Todo, b: Todo) => a.createdAt - b.createdAt);

    return result;
}

export function createRandomDelay(min = 0, max = 500): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalizeString(stringValue: string): string {
    return cleanWord(stringValue)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('hu');
}

function cleanWord(word: string): string {
    return word.replace(/[\p{P}\p{S}\s]+/gu, '');
}
