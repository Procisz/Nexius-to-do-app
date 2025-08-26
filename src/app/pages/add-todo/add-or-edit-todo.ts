import { NgClass } from '@angular/common';
import type { Signal } from '@angular/core';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';

import { FormControlErrorsPipe } from '../../pipes/form-control-errors.pipe';
import type { Todo } from '../../services/todo.service';
import { TodoService } from '../../services/todo.service';
import { ROUTE_PATHS } from '../../utils/constants/router.constants';

const fb = new FormBuilder();

@Component({
    selector: 'app-add-or-edit-todo',
    templateUrl: './add-or-edit.todo.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButtonToggleModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        FormControlErrorsPipe,
        NgClass,
        MatDialogModule,
    ],
})
export class AddOrEditTodo {
    protected readonly dataInEditMode =
        inject<Signal<Todo | null> | null>(MAT_DIALOG_DATA, { optional: true }) ??
        signal<Todo | null>(null);

    private readonly _todoService = inject(TodoService);
    private readonly _snackBar = inject(MatSnackBar);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _router = inject(Router);

    protected readonly form = fb.group({
        label: fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(100)]),
        description: fb.nonNullable.control<string>('', [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10_000),
        ]),
    });
    protected readonly isFormSubmitting = signal<boolean>(false);
    protected readonly pageTitle = computed<string>(() => {
        const data = this.dataInEditMode();

        if (!data) return 'Új TODO létrehozása';

        return `"${data.label}" feladat szerkesztése`;
    });

    private readonly _dialogRef = inject(MatDialogRef<AddOrEditTodo>, { optional: true });

    constructor() {
        effect(() => {
            const dataInEditMode = this.dataInEditMode();
            if (!dataInEditMode) return;

            this.form.setValue({
                label: dataInEditMode?.label ?? '',
                description: dataInEditMode?.description ?? '',
            });
        });
    }

    protected onSubmit(): void {
        if (this.form.invalid) return;

        this.isFormSubmitting.set(true);

        if (this.dataInEditMode()) {
            this._updateExistingTodo();
        } else {
            this._createNewTodo();
        }
    }

    private _createNewTodo(): void {
        this._todoService
            .createTodo$(this.form.getRawValue())
            .pipe(
                tap((response: Todo) => {
                    this._snackBar.open(`"${response.label}" feladat létrehozva.`, 'Bezárás', {
                        duration: 3000,
                    });
                    void this._router.navigate([ROUTE_PATHS.ListTodos]);
                }),
                takeUntilDestroyed(this._destroyRef),
                finalize(() => this.isFormSubmitting.set(false)),
            )
            .subscribe();
    }

    private _updateExistingTodo(): void {
        const oldTodo: Todo | null = this.dataInEditMode();
        if (!oldTodo) return;

        const payload: Todo = { ...oldTodo, ...this.form.getRawValue() };

        this._todoService
            .updateTodo$(payload)
            .pipe(
                tap((response: Todo) => {
                    this._snackBar.open(
                        `"${response.label}" feladat adatai frissítve.`,
                        'Bezárás',
                        { duration: 3000 },
                    );

                    this._dialogRef?.close(response);
                }),
                takeUntilDestroyed(this._destroyRef),
                finalize(() => this.isFormSubmitting.set(false)),
            )
            .subscribe();
    }
}
