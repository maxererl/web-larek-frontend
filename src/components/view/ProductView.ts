import { CardViewOptions, IView, Product } from '../../types';
import { bem, cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';

export class ProductCardView implements IView<Product, HTMLButtonElement> {
  constructor(public _options: Record<string, any>) {}

  render(data?: Product): HTMLButtonElement {
    const cardElement = cloneTemplate<HTMLButtonElement>(this._options.templateElement);
    if (!data) {
      this._options.parentElement.append(cardElement);
      return cardElement;
    }
    const card = this.createCard(cardElement, data);

    cardElement.addEventListener('click', () => {
      this._options.events.emit('openCardPreview', {
        data,
        cnstr: ProductCardPreviewView,
        options: this._options.cardPreviewOptions
      });
    });

    this._options.parentElement.append(card);
    return card;
  }


  private createCard(cardElement: HTMLButtonElement, product: Product): HTMLButtonElement {
    const cardCategory = cardElement.querySelector( bem(this._options.cardBlock, this._options.cardElements.category).class );
    const cardTitle = cardElement.querySelector( bem(this._options.cardBlock, this._options.cardElements.title).class );
    const cardImage = cardElement.querySelector<HTMLImageElement>( bem(this._options.cardBlock, this._options.cardElements.image).class );
    const cardPrice = cardElement.querySelector( bem(this._options.cardBlock, this._options.cardElements.price).class );

    // Set card category
    cardCategory.textContent = product.category;
    cardCategory.classList.add( bem(
      this._options.cardBlock,
      this._options.cardElements.category,
      this._options.cardCategoryModifiers[product.category]
    ).name );

    // Set card title
    cardTitle.textContent = product.title;

    // Set card image
    cardImage.src = this._options.CDN_URL + product.image;
    cardImage.alt = product.title + ' изображение';

    // Set card price
    cardPrice.textContent = `${product.price ?
      product.price + ' ' + this._options.cardCurrency
      : this._options.cardNullPricePlaceholder }`;

    return cardElement;
  }
}

export class ProductCardPreviewView implements IView<Product, HTMLDivElement> {
  constructor(public _options: Record<string, any>) {};

  render(data?: Product): HTMLDivElement {
    const cardPreviewElement = cloneTemplate<HTMLDivElement>(this._options.templateElement);
    if (!data) {
      this._options.parentElement.append(cardPreviewElement);
      return cardPreviewElement;
    }
    const card = this.createCard(cardPreviewElement, data);
    const button = card.querySelector(this._options.cardElements.addToBasketButton);

    if (this._options.availability.isAvailable) {
      if (this._options.availability.isInBasket) {
        button.textContent = this._options.availability.alreadyInBasketText;
        button.addEventListener('click', () => {
          this._options.events.emit('removeFromBasket', data);
          this._options.events.emit('closeModal');
        });
      } else {
        button.textContent = this._options.availability.availableText;
        button.addEventListener('click', () => {
          this._options.events.emit('addToBasket', data);
        });
      }
    }

    this._options.parentElement.append(card);
    return card;
  }

  private createCard(cardPreviewElement: HTMLDivElement, product: Product): HTMLDivElement {
    const cardCategory = cardPreviewElement.querySelector( bem(this._options.cardBlock, this._options.cardElements.category).class );
    const cardTitle = cardPreviewElement.querySelector( bem(this._options.cardBlock, this._options.cardElements.title).class );
    const cardImage = cardPreviewElement.querySelector<HTMLImageElement>( bem(this._options.cardBlock, this._options.cardElements.image).class );
    const cardText = cardPreviewElement.querySelector( bem(this._options.cardBlock, this._options.cardElements.text).class );
    const cardPrice = cardPreviewElement.querySelector( bem(this._options.cardBlock, this._options.cardElements.price).class );
    const button = cardPreviewElement.querySelector(this._options.cardElements.addToBasketButton);

    // Set availability button text
    if (this._options.availability.isAvailable) {
      if (this._options.availability.isInBasket) {
        button.textContent = this._options.availability.alreadyInBasketText;
      } else {
        button.textContent = this._options.availability.availableText;
      }
    } else {
      button.classList.add('card__button_disabled');
      button.disabled = true;
      button.textContent = this._options.availability.notAvailableText;
    }

    // Set card category
    cardCategory.textContent = product.category;
    cardCategory.classList.add( bem(
      this._options.cardBlock,
      this._options.cardElements.category,
      this._options.cardCategoryModifiers[product.category]
    ).name );

    // Set card title
    cardTitle.textContent = product.title;

    // Set card image
    cardImage.src = this._options.CDN_URL + product.image;
    cardImage.alt = product.title + ' изображение';

    // Set card text
    cardText.textContent = product.description;

    // Set card price
    cardPrice.textContent = `${product.price ?
      product.price + ' ' + this._options.cardCurrency
      : this._options.cardNullPricePlaceholder }`;
    return cardPreviewElement;
  }
}

export class CompactCardView implements IView<Product, HTMLLIElement> {
  constructor(public _options: Record<string, any>) {}

  render(data?: Product): HTMLLIElement {
    const cardCompactElement = cloneTemplate<HTMLLIElement>(this._options.templateElement);
    if (!data) {
      this._options.parentElement.append(cardCompactElement);
      return cardCompactElement;
    }
    const card = this.createCard(cardCompactElement, data, 0);
    this._options.parentElement.append(card);
    return card;
  }

  private createCard(cardCompactElement: HTMLLIElement, product: Product, index: number): HTMLLIElement {
    const cardTitle = cardCompactElement.querySelector( bem(this._options.cardBlock, this._options.cardCompactElements.title).class );
    const cardPrice = cardCompactElement.querySelector( bem(this._options.cardBlock, this._options.cardCompactElements.price).class );
    const button = cardCompactElement.querySelector( bem(this._options.cardBlock, this._options.cardCompactElements.removeFromBasketButton).class );

    // Set card index

    // Set card title
    cardTitle.textContent = product.title;

    // Set card price
    cardPrice.textContent = `${ product.price + ' ' + this._options.cardCurrency }`;

    button.addEventListener('click', () => {
      this._options.events.emit('removeFromBasket', product);
      cardCompactElement.remove();
    });

    return cardCompactElement;
  }
}