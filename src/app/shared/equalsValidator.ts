import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import { Directive, Input } from "@angular/core";

@Directive({
    selector: '[appConfirmEqualValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: confirmEqualsValidatorDirective,
        multi: true
    }]
})

export class confirmEqualsValidatorDirective implements Validator {
    @Input() appConfirmEqualValidator!: string;
    validate(control: AbstractControl): {[key:string]: any} | null {
        const controlToCompare = control.parent?.get(this.appConfirmEqualValidator);
        if(controlToCompare && controlToCompare.value !== control.value) {
            return { 'notEqual': true };
        }
        return null;
    }

}

