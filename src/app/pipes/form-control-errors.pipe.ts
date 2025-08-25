import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { ValidationErrors } from '@angular/forms';

@Pipe({ name: 'formControlErrors' })
export class FormControlErrorsPipe implements PipeTransform {
    transform(errors: ValidationErrors | null | undefined): string | undefined {
        if (!errors) return;

        let result: string | undefined;

        if (errors['required']) {
            result = 'Kötelező mező.';
        } else if (errors['minlength']) {
            result = `Legalább ${errors['minlength'].requiredLength} karakter szükséges.`;
        } else if (errors['maxlength']) {
            result = `Legfeljebb ${errors['maxlength'].requiredLength} karakter megadása lehetséges.`;
        }

        return result;
    }
}
