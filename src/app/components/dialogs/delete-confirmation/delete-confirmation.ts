import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import type { Todo } from '../../../services/todo.service';

@Component({
    selector: 'app-delete-confirmation',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatDialogModule],
    template: `
        <h2 mat-dialog-title>Feladat törlése</h2>
        <mat-dialog-content class="mat-typography">
            <h3>
                Biztosan törölni szeretnéd a(z) <strong>{{ data.label }}</strong> elemet?
            </h3>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button matButton mat-dialog-close>Nem, vissza</button>
            <button matButton [mat-dialog-close]="true" cdkFocusInitial>Igen, törlöm</button>
        </mat-dialog-actions>
    `,
})
export class DeleteConfirmation {
    protected readonly data = inject<Todo>(MAT_DIALOG_DATA);
}
