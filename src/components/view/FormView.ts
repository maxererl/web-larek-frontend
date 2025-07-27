import { ContactData, FormView, OrderData } from "../../types";
import { bem } from "../../utils/utils";

export class OrderDataFormView extends FormView<OrderData> {
  protected getSubmitEventName(): string {
    return 'nextFormStep';
  }

  render(data?: OrderData): HTMLFormElement {
    const formElement = this.setupForm(data);
    const formButtons = Array.from(formElement.querySelector<HTMLElement>(bem(
      this._options.orderBlock,
      this._options.orderElements.buttons
    ).class).children);
    const addressElement = formElement.querySelector(`[name="address"]`) as HTMLInputElement;
    const submitButton = formElement.querySelector<HTMLButtonElement>('[type="submit"]');

    if (data?.payment) {
      formElement.querySelector(`[name="${data.payment}"]`)
        ?.classList.add('button_alt-active');
    }
    if (data?.address) {
      addressElement.value = data.address;
    }

    if (data?.payment || data?.address) {
      this.checkValidity(formElement, formButtons, addressElement, submitButton);
    }

    this.setupPaymentButtons(formButtons, formElement, addressElement, submitButton);
    this.setupAddressInput(addressElement, formElement, formButtons, submitButton);

    return formElement;
  }

  private setupPaymentButtons(formButtons: Element[], formElement: HTMLFormElement, addressElement: HTMLInputElement, submitButton: HTMLButtonElement): void {
    formButtons.forEach(button => {
      button.addEventListener('click', (event: MouseEvent) => {
        this._options.events.emit('orderFormUpdate', {
          payment: (event.target as HTMLElement).getAttribute('name')
        });

        formButtons.forEach(btn => btn.classList.remove('button_alt-active'));
        (event.target as HTMLElement).classList.add('button_alt-active');

        this.checkValidity(formElement, formButtons, addressElement, submitButton);
      });
    });
  }

  private setupAddressInput(addressElement: HTMLInputElement, formElement: HTMLFormElement, formButtons: Element[], submitButton: HTMLButtonElement): void {
    addressElement.addEventListener('input', () => {
      this._options.events.emit('orderFormUpdate', {
        address: addressElement.value
      });
      this.checkValidity(formElement, formButtons, addressElement, submitButton);
    });
  }

  checkValidity(formElement: HTMLFormElement, buttons: Element[], addressElement: HTMLInputElement, submitButton: HTMLButtonElement): boolean {
    const isPaymentValid = buttons.some(button => button.classList.contains('button_alt-active'));
    const isAddressValid = addressElement.value.length > 0;
    const isValid = isPaymentValid && isAddressValid;
    const errorsElement = this.getErrorsElement(formElement);

    let validationErrorMessage = '';
    if (!isAddressValid) {
      validationErrorMessage = this._options.emptyAddressText;
    }

    this.displayValidationError(errorsElement, validationErrorMessage);
    this.toggleSubmitButtonState(submitButton, isValid);
    return isValid;
  }
}

export class ContactsDataFormView extends FormView<ContactData> {
  protected getSubmitEventName(): string {
    return 'formSubmit';
  }

  render(data?: ContactData): HTMLFormElement {
    const formElement = this.setupForm(data);
    const emailElement = formElement.querySelector(`[name="email"]`) as HTMLInputElement;
    const phoneElement = formElement.querySelector(`[name="phone"]`) as HTMLInputElement;
    const submitButton = formElement.querySelector<HTMLButtonElement>('[type="submit"]');

    if (data?.email) {
      emailElement.value = data.email;
    }
    if (data?.phone) {
      phoneElement.value = data.phone;
    }

    if (data?.email || data?.phone) {
      this.checkValidity(formElement, emailElement, phoneElement, submitButton);
    }

    this.setupEmailInput(emailElement, formElement, phoneElement, submitButton);
    this.setupPhoneInput(phoneElement, formElement, emailElement, submitButton);

    return formElement;
  }

  private setupEmailInput(emailElement: HTMLInputElement, formElement: HTMLFormElement, phoneElement: HTMLInputElement, submitButton: HTMLButtonElement): void {
    emailElement.addEventListener('input', () => {
      this._options.events.emit('contactFormUpdate', {
        email: emailElement.value
      });
      this.checkValidity(formElement, emailElement, phoneElement, submitButton);
    });
  }

  private setupPhoneInput(phoneElement: HTMLInputElement, formElement: HTMLFormElement, emailElement: HTMLInputElement, submitButton: HTMLButtonElement): void {
    phoneElement.addEventListener('input', () => {
      this._options.events.emit('contactFormUpdate', {
        phone: phoneElement.value
      });
      this.checkValidity(formElement, emailElement, phoneElement, submitButton);
    });
  }

  checkValidity(formElement: HTMLFormElement, emailElement: HTMLInputElement, phoneElement: HTMLInputElement, submitButton: HTMLButtonElement): boolean {
    const isEmailValid = emailElement.value.length > 0;
    const isPhoneValid = phoneElement.value.length > 0;
    const isValid = isEmailValid && isPhoneValid;
    const errorsElement = this.getErrorsElement(formElement);

    let validationErrorMessage = '';
    if (!isEmailValid) {
      validationErrorMessage = this._options.emptyEmailText;
    } else if (!isPhoneValid) {
      validationErrorMessage = this._options.emptyPhoneText;
    }

    this.displayValidationError(errorsElement, validationErrorMessage);
    this.toggleSubmitButtonState(submitButton, isValid);
    return isValid;
  }
}