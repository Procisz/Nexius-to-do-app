import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
    selector: 'app-add-todo',
    templateUrl: './add-todo.html',
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
    ],
})
export class AddTodo {
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

    protected onSubmit(): void {
        if (this.form.invalid) return;

        this.isFormSubmitting.set(true);

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
}
