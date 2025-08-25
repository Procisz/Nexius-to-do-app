import { DatePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import type { MatCheckboxChange } from '@angular/material/checkbox';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, filter, switchMap, tap } from 'rxjs';

import { DeleteConfirmation } from '../../components/dialogs/delete-confirmation/delete-confirmation';
import { Paginator } from '../../components/paginator/paginator';
import { StopPropagationDirective } from '../../directives/stop-propagation.directive';
import type { GetTodosMockResponse, Todo } from '../../services/todo.service';
import { TodoService } from '../../services/todo.service';
import { ToolbarService } from '../../services/toolbar.service';
import { FILTER_VALUES } from '../../utils/constants/form.constants';

import { filterValues, type Filter } from './list-todos.data';

const fb = new FormBuilder();

@Component({
    selector: 'app-list-todos',
    imports: [
        MatButtonToggleModule,
        FormsModule,
        ReactiveFormsModule,
        MatExpansionModule,
        MatProgressBarModule,
        MatCheckboxModule,
        StopPropagationDirective,
        MatIconModule,
        DatePipe,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        Paginator,
    ],
    templateUrl: './list-todos.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListTodos {
    private readonly _todoService = inject(TodoService);
    private readonly _toolbarService = inject(ToolbarService);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _dialog = inject(MatDialog);
    private readonly _snackBar = inject(MatSnackBar);

    protected readonly filters: Filter[] = filterValues;
    protected readonly accordionRef = viewChild.required(MatAccordion);
    protected readonly form = fb.group({
        filter: fb.nonNullable.control<(typeof FILTER_VALUES)[keyof typeof FILTER_VALUES]>(
            FILTER_VALUES.All,
        ),
        search: fb.nonNullable.control<string>('', [Validators.maxLength(100)]),
    });
    private readonly _filterValue = toSignal(this.form.controls.filter.valueChanges, {
        initialValue: this.form.controls.filter.value,
    });
    private readonly _searchValue = toSignal(
        this.form.controls.search.valueChanges.pipe(debounceTime(300)),
        { initialValue: this.form.controls.search.value },
    );
    protected readonly pageSize = signal<number>(25);
    protected readonly pageIndex = signal<number>(0);
    protected readonly pageSizeOptions = signal<number[]>([5, 10, 15, 25, 50]);
    protected readonly todos = this._todoService.getTodosResource(
        this._filterValue,
        this._searchValue,
        this.pageSize,
        this.pageIndex,
    );

    protected readonly contentHeight = computed<string>(
        () => `calc(100svh - ${this._toolbarService.toolbarElementHeight()}px)`,
    );

    protected onTodoCheckboxChanged(event: MatCheckboxChange, todo: Todo): void {
        this._todoService
            .updateTodo$({ ...todo, completed: event.checked })
            .pipe(
                tap((response: Todo) => this._updateTodos(response)),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe();
    }

    protected onDeleteTodoButtonClicked(todo: Todo): void {
        const dialogRef = this._dialog.open(DeleteConfirmation, { data: todo });

        dialogRef
            .afterClosed()
            .pipe(
                filter(Boolean),
                switchMap(() => this._todoService.deleteTodo$(todo.id)),
                tap(() => {
                    this._snackBar.open(`"${todo.label}" elem törölve.`, 'Bezárás', {
                        duration: 2000,
                    });
                    this.todos.reload();
                }),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe();
    }

    private _updateTodos(updatedTodo: Todo): void {
        this.todos.update((currentValue: GetTodosMockResponse | undefined) => {
            if (!currentValue) return undefined;

            const updatedTodos: Todo[] = currentValue.items.map((todo: Todo) =>
                todo.id === updatedTodo.id ? updatedTodo : todo,
            );

            return { ...currentValue, items: updatedTodos };
        });

        if (this.form.controls.filter.value !== FILTER_VALUES.All) {
            this.todos.reload();
        }
    }

    protected readonly FILTER_VALUES = FILTER_VALUES;
}
