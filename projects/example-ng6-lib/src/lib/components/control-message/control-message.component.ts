import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'control-messages',
  templateUrl: `./control-message.component.html`,
  styleUrls: ['./control-message.component.scss']
})
export class ControlMessageComponent {
  public _errorMessage: string;

  @Input()
  public control: FormControl | null = null;

  @Input()
  public submitted = false;

  @Input()
  public group: FormGroup;

  @Input()
  public name: string;

  constructor(private readonly service: ValidationService) {}

  get errorMessage() {
    const control = this.control ? this.control : this.group ? this.group.controls[this.name] : null;

    if (control) {
      for (const propertyName in control.errors) {
        if (control.errors.hasOwnProperty(propertyName) && (control.touched || this.submitted)) {
          return this.service.getValidatorErrorMessage(propertyName);
        }
      }
    }

    return null;
  }
}
