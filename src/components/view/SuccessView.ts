import { IView, Order } from "../../types";
import { bem, cloneTemplate } from "../../utils/utils";

export class SuccessView implements IView<Order, HTMLDivElement> {
  constructor(public _options: Record<string, any>) {};

  render(data: Order): HTMLDivElement {
    const successElement = cloneTemplate<HTMLDivElement>(this._options.templateElement);
    const description = successElement.querySelector(bem ( 
      this._options.successBlock,
      this._options.successElements.description
    ).class);
    const closeButton = successElement.querySelector(bem ( 
      this._options.successBlock,
      this._options.successElements.closeButton
    ).class);

    description.textContent = `Списано ${data.total} синапсов`;
    closeButton.addEventListener('click', () => {
      this._options.events.emit('closeModal');
    })

    this._options.parentElement.append(successElement);
    return successElement;
  }
}