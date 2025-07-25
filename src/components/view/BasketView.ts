

// 	<template id="basket">
// 		<div class="basket">
// 			<h2 class="modal__title">Корзина</h2>
// 			<ul class="basket__list"></ul>
// 			<div class="modal__actions">
// 				<button class="button basket__button">Оформить</button>
// 				<span class="basket__price">0 синапсов</span>
// 			</div>
// 		</div>
// 	</template>

import { IView, Product } from "../../types";
import { bem, cloneTemplate } from "../../utils/utils";
import { CompactCardView } from "./ProductView";

export class BasketView implements IView<Product[], HTMLDivElement> {
  constructor(public _options: Record<string, any>) {};

  render(data?: Product[]): HTMLDivElement {
    const basketElement = cloneTemplate<HTMLDivElement>(this._options.templateElement);
    const cardsListElement = basketElement.querySelector<HTMLElement>(bem(
      this._options.basketBlock,
      this._options.basketElements.list
    ).class);

    const basketButton = basketElement.querySelector<HTMLButtonElement>( bem(
      this._options.basketBlock,
      this._options.basketElements.button
    ).class )

    if (!data || data.length === 0) {
      const emptyTextElement = document.createElement('p');
      emptyTextElement.classList.add('basket__empty-text');
      emptyTextElement.textContent = this._options.emptyBasketText;
      cardsListElement.replaceWith(emptyTextElement);

      basketButton.disabled = true;

      this._options.parentElement.append(basketElement);
      return basketElement;
    }

    const priceElement = basketElement.querySelector<HTMLElement>( bem(
      this._options.basketBlock,
      this._options.basketElements.price
    ).class);

    this._options.cardCompactOptions.parentElement = cardsListElement;
    const cards: HTMLLIElement[] = data.map(product => new CompactCardView(this._options.cardCompactOptions).render(product));
    this.updateBasketElements(cardsListElement, priceElement, basketButton)

    basketElement.addEventListener('click', (event: MouseEvent) => {
      if ((event.target as HTMLElement).classList.contains( bem(
        this._options.cardCompactOptions.cardBlock,
        this._options.cardCompactOptions.cardCompactElements.removeFromBasketButton
      ).name)) {
        this.updateBasketElements(cardsListElement, priceElement, basketButton);
      }
    });

    basketButton.addEventListener('click', () => {
      this._options.events.emit('makeOrder');
    });

    this._options.parentElement.append(basketElement);
    return basketElement;
  }

  updateBasketElements(cardsListElement: HTMLElement, priceElement: HTMLElement, basketButton: HTMLButtonElement): void {
    const cardElements = Array.from(cardsListElement.querySelectorAll(bem(
      this._options.cardCompactOptions.cardBlock
    ).class));

    if (!cardElements || cardElements.length === 0) {
      const emptyTextElement = document.createElement('p');
      emptyTextElement.classList.add('basket__empty-text');
      emptyTextElement.textContent = this._options.emptyBasketText;
      cardsListElement.replaceWith(emptyTextElement);

      basketButton.disabled = true;
    }

    cardElements.forEach((card, index) => {
      const cardIndex = card.querySelector(bem(
        this._options.basketBlock,
        this._options.basketElements.index
      ).class);
      if (cardIndex) cardIndex.textContent = (index + 1).toString();
    });

    const totalPrice = cardElements.reduce((acc, card) => {
      const cardPrice = card.querySelector(bem(
        this._options.cardCompactOptions.cardBlock,
        this._options.cardCompactOptions.cardCompactElements.price
      ).class);
      return acc + (cardPrice ? parseFloat(cardPrice.textContent) : 0);
    }, 0);

    priceElement.textContent = `${totalPrice} ${this._options.basketCurrency}`;
  }
}

// <template id="card-basket">
// 		<li class="basket__item card card_compact">
// 			<span class="basket__item-index"></span>
// 			<span class="card__title"></span>
// 			<span class="card__price"></span>
// 			<button class="basket__item-delete card__button" aria-label="удалить"></button>
// 		</li>
// 	</template>