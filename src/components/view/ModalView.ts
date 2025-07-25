import { IModalView, IViewConstructor, ModalData, Product } from '../../types';
import { bem } from '../../utils/utils';
import { IEvents } from '../base/events';



export class ModalView<D, E extends HTMLElement> implements IModalView<D, E> {
  constructor(public _options: Record<string, any>) {}

  open(data: D, cnstr: IViewConstructor<D, E>, options: Record<string, any>): void {
    this.clearModalContent(); // Clear previous content
    options.parentElement = this._options.modalContainer.querySelector(bem (
      this._options.modalBlock, 
      this._options.modalElements.content
    ).class);
    new cnstr(options).render(data);
    this._options.modalContainer.classList.add(bem (
      this._options.modalBlock,
      undefined,
      this._options.modalModifiers.active
    ).name);
  }

  close(): void {
    this._options.modalContainer.classList.remove(bem (
      this._options.modalBlock,
      undefined,
      this._options.modalModifiers.active
    ).name);
    this.clearModalContent(); // Clear modal content
  }

  private clearModalContent(): void {
    this._options.modalContainer.querySelector(bem (
      this._options.modalBlock,
      this._options.modalElements.content
    ).class).innerHTML = ''; // Clear previous content
  }
}
