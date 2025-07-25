import { ContactData, IFormView, OrderData } from "../../types";
import { bem, cloneTemplate } from "../../utils/utils";

export class OrderDataFormView implements IFormView<OrderData> {
  constructor(public _options: Record<string, any>) {}

  render(data?: OrderData): HTMLFormElement {
    const formElement = cloneTemplate<HTMLFormElement>(this._options.templateElement);
    const formButtons = Array.from(formElement.querySelector<HTMLElement>( bem(
      this._options.orderBlock,
      this._options.orderElements.buttons
    ).class).children);
    const addressElement = formElement.querySelector(`[name="address"]`) as HTMLInputElement
    const submitButton = formElement.querySelector<HTMLButtonElement>('[type="submit"]');

    if (data.payment) {
      formElement.querySelector(`[name="${data.payment}"]`)
        .classList.add('button_alt-active');
    }
    if (data.address) {
      addressElement.value = data.address;
    }

    if (data.payment || data.address) {
      this.checkValidity(formElement, formButtons, addressElement, submitButton);
    }

    formButtons.forEach(button => {
      button.addEventListener('click', (event: MouseEvent) => {
        this._options.events.emit.call(
          this._options.events,
          'orderFormUpdate',
          { payment: (event.target as HTMLElement).getAttribute('name') }
        );

        (event.target as HTMLElement).classList.add('button_alt-active');
        formButtons.forEach(btn => {
          if (btn !== button) {
            btn.classList.remove('button_alt-active');
          }
        });

        this.checkValidity(formElement, formButtons, addressElement, submitButton);
      });
    });

    addressElement.addEventListener('input', () => {
      this._options.events.emit('orderFormUpdate', {
        address: addressElement.value
      });
      this.checkValidity(formElement, formButtons, addressElement, submitButton)
    });

    submitButton.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      this._options.events.emit('nextFormStep');
    });

    this._options.parentElement.append(formElement);
    return formElement;
  }

  checkValidity(formElement: HTMLFormElement, buttons: Element[], addressElement: HTMLInputElement, submitButton: HTMLButtonElement): boolean {
    const isPaymentValid = buttons.some(button => button.classList.contains('button_alt-active'));
    const isAddressValid = addressElement.value.length > 0;
    let isValid = isPaymentValid && isAddressValid;
    const errorsElement = formElement.querySelector<HTMLElement>( bem(
      this._options.formBlock,
      this._options.formElements.errors
    ).class);

    let validationErrorMessage = '';

    if (!isAddressValid) {
      validationErrorMessage = this._options.emptyAddressText;
    }
    displayValidationError(errorsElement, validationErrorMessage);
    toggleSubmitButtonState(submitButton, isValid);
    return isValid;
  }
}

export class ContactsDataFormView implements IFormView<ContactData> {
  constructor(public _options: Record<string, any>) {}

  render(data?: ContactData): HTMLFormElement {
    const formElement = cloneTemplate<HTMLFormElement>(this._options.templateElement);
    const emailElement = formElement.querySelector(`[name="email"]`) as HTMLInputElement
    const phoneElement = formElement.querySelector(`[name="phone"]`) as HTMLInputElement
    const submitButton = formElement.querySelector<HTMLButtonElement>('[type="submit"]');

    if (data.email) {
      emailElement.value = data.email;
    }
    if (data.phone) {
      phoneElement.value = data.phone;
    }

    if (data.email || data.phone) {
      this.checkValidity(formElement, emailElement, phoneElement, submitButton);
    }

    emailElement.addEventListener('input', () => {
      this._options.events.emit('contactFormUpdate', {
        email: emailElement.value
      });
      this.checkValidity(formElement, emailElement, phoneElement, submitButton)
    });

    phoneElement.addEventListener('input', () => {
      this._options.events.emit('contactFormUpdate', {
        phone: phoneElement.value
      });
      this.checkValidity(formElement, emailElement, phoneElement, submitButton)
    });

    submitButton.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      this._options.events.emit('formSubmit');
    });

    this._options.parentElement.append(formElement);
    return formElement;
  }

  checkValidity(formElement: HTMLFormElement, emailElement: HTMLInputElement, phoneElement: HTMLInputElement, submitButton: HTMLButtonElement): boolean {
    const isEmailValid = emailElement.value.length > 0;
    const isPhoneValid = phoneElement.value.length > 0;
    let isValid = isEmailValid && isPhoneValid;
    const errorsElement = formElement.querySelector<HTMLElement>( bem(
      this._options.formBlock,
      this._options.formElements.errors
    ).class);

    let validationErrorMessage = '';

    if (!isEmailValid) {
      validationErrorMessage = this._options.emptyEmailText;
    }else if (!isPhoneValid) {
      validationErrorMessage = this._options.emptyPhoneText;
    }
    displayValidationError(errorsElement, validationErrorMessage);
    toggleSubmitButtonState(submitButton, isValid);
    return isValid;
  }
}

function displayValidationError(errorsElement: HTMLElement, errorMessage: string): void {
  errorsElement.textContent = errorMessage;
}

function toggleSubmitButtonState(button: HTMLButtonElement, isValid: boolean) {
  button.disabled = !isValid;
}