import './scss/styles.scss';
import { ProductApi } from './components/api/ProductApi';
import { ProductCardPreviewView, ProductCardView } from './components/view/ProductView';
import { CardViewOptions, ContactData, IFormModel, ModalData, Order, OrderData, Product } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ModalView } from './components/view/ModalView';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/model/BasketModel';
import { BasketView } from './components/view/BasketView';
import { ContactsDataFormView, OrderDataFormView } from './components/view/FormView';
import { ContactDataFormModel, OrderDataFormModel } from './components/model/FormModel';
import { SuccessView } from './components/view/SuccessView';
import { OrderApi } from './components/api/OrderApi';

const productApi = new ProductApi(API_URL);
const basket = new BasketModel();
const orderDataFormModel = new OrderDataFormModel();
const orderApi = new OrderApi(API_URL);
const contactsDataFormModel = new ContactDataFormModel(orderApi);

const basketBlock = 'basket';
const basketElements: Record<string, string> = {
  title: 'title',
  list: 'list',
  index: 'item-index',
  button: 'button',
  price: 'price'
}
const headerBasketElement = document.querySelector<HTMLElement>('.header__basket');
const headerBasketCounter = headerBasketElement.querySelector<HTMLElement>('.header__basket-counter');

// Card properties
const cardsParentElement = document.querySelector<HTMLUListElement>('.gallery');
const cardTemplateElement = document.querySelector<HTMLTemplateElement>('#card-catalog');
const orderFormTemplateElement = document.querySelector<HTMLTemplateElement>('#order');
const contactsFormTemplateElement = document.querySelector<HTMLTemplateElement>('#contacts');
const successTemplateElement = document.querySelector<HTMLTemplateElement>('#success');

const formBlock = 'form';
const orderBlock = 'order';
const cardBlock = 'card';
const successBlock = 'order-success';

const cardElements: Record<string, string> = {
  category: 'category',
  title: 'title',
  image: 'image',
  price: 'price'
}

const cardCategoryModifiers: Record<string, string> = {
  'софт-скил': 'soft',
  'хард-скил': 'hard',
  'другое': 'other',
  'дополнительное': 'additional',
  'кнопка': 'button'
}

const emptyBasketText = 'Корзина пуста';
const cardNullPricePlaceholder = 'Бесценно';
const cardCurrency = 'синапсов';

// Card preview properties
const cardPreviewTemplateElement = document.querySelector<HTMLTemplateElement>('#card-preview');
const cardCompactTemplateElement = document.querySelector<HTMLTemplateElement>('#card-basket');
const basketTemplateElement = document.querySelector<HTMLTemplateElement>('#basket');

const cardPreviewElements: Record<string, string> = {
  category: 'category',
  title: 'title',
  image: 'image',
  text: 'text',
  price: 'price',
  addToBasketButton: '.button',
}

const cardCompactElements: Record<string, string> = {
  title: 'title',
  price: 'price',
  removeFromBasketButton: 'button'
}

const successElements: Record<string, string> = {
  description: 'description',
  closeButton: 'close'
}

const eventEmitter = new EventEmitter();

const cardAvailability = {
  isAvailable: true,
  isInBasket: false,
  availableText: 'В корзину',
  notAvailableText: 'Недоступно',
  alreadyInBasketText: 'Удалить из корзины'
};

const cardPreviewOptions: Record<string, any> = {
  CDN_URL,
  templateElement: cardPreviewTemplateElement,
  cardBlock,
  cardElements: cardPreviewElements,
  cardCategoryModifiers,
  cardNullPricePlaceholder,
  cardCurrency,
  availability: cardAvailability,
  events: eventEmitter
}

const cardViewOptions: Record<string, any> = {
  CDN_URL,
  templateElement: cardTemplateElement,
  parentElement: cardsParentElement,
  cardBlock,
  cardElements: cardElements,
  cardCategoryModifiers,
  cardNullPricePlaceholder,
  cardCurrency,
  cardPreviewOptions,
  events: eventEmitter
}

const cardCompactOptions: Record<string, any> = {
  templateElement: cardCompactTemplateElement,
  cardBlock,
  cardCompactElements,
  cardCurrency,
  events: eventEmitter
}

const basketViewOptions = {
  templateElement: basketTemplateElement,
  basketBlock,
  basketElements,
  basketCurrency: cardCurrency,
  emptyBasketText,
  cardCompactOptions,
  events: eventEmitter
}

const orderElements: Record<string, string> = {
  buttons: 'buttons'
}

const formElements: Record<string, string> = {
  errors: 'errors'
}

const orderFormViewOptions: Record<string, any> = {
  templateElement: orderFormTemplateElement,
  formBlock,
  orderBlock,
  orderElements,
  formElements,
  emptyAddressText: 'Необходимо указать адрес',
  events: eventEmitter
}

const contactsFormViewOptions: Record<string, any> = {
  templateElement: contactsFormTemplateElement,
  formBlock,
  orderBlock,
  orderElements,
  formElements,
  emptyEmailText: 'Необходимо указать email',
  emptyPhoneText: 'Необходимо указать телефон',
  events: eventEmitter
}

const successViewOptions: Record<string, any> = {
  templateElement: successTemplateElement,
  successBlock,
  successElements,
  events: eventEmitter
}

// Modal properties
const modalBlock = 'modal';

const modalElements: Record<string, string> = {
  content: 'content',
  closeButton: 'close'
}

const modalModifiers: Record<string, string> = {
  active: 'active'
}

const modalContainer = document.querySelector<HTMLElement>('#modal-container');

const modalViewOptions: Record<string, any> = {
  modalContainer,
  modalBlock,
  modalElements,
  modalModifiers,
  events: eventEmitter
}

const cardView = new ProductCardView(cardViewOptions);

productApi.getProductList()
  .then(products => products.forEach(product => cardView.render(product)))
  .catch(error => console.error('Ошибка при загрузке списка продуктов:', error));

const modalView = new ModalView(modalViewOptions);

// Add custom event listeners

eventEmitter.on('openCardPreview', (data: ModalData<Product, HTMLDivElement>) => {
  data.options.availability.isAvailable = data.data.price ? true : false;
  data.options.availability.isInBasket = basket.hasItem(data.data.id);
  modalView.open(data.data, data.cnstr, data.options);
});

eventEmitter.on('closeModal', () => {
  modalView.close();
});

eventEmitter.on('addToBasket', (product: Product) => {
  basket.add(product);
  headerBasketCounter.textContent = basket.getItems().length.toString();
  eventEmitter.emit('closeModal');
});

eventEmitter.on('removeFromBasket', (product: Product) => {
  basket.remove(product.id);
  headerBasketCounter.textContent = basket.getItems().length.toString();
});

eventEmitter.on('openBasketModal', (data: ModalData<Product[], HTMLDivElement>) => {
  modalView.open(data.data, data.cnstr, data.options);
});

eventEmitter.on('makeOrder', () => {
  modalView.open(IFormModel.getFormData().orderData.order, OrderDataFormView, orderFormViewOptions);
  IFormModel.updateFormItems(basket.getItems());
  IFormModel.updateFormTotal(basket.getItems().reduce((total, item) => total + (item.price || 0), 0));
});

eventEmitter.on('orderFormUpdate', (formData: Partial<OrderData>) => {
  orderDataFormModel.updateFormData(formData);
});

eventEmitter.on('nextFormStep', () => {
  modalView.open(IFormModel.getFormData().orderData.contact, ContactsDataFormView, contactsFormViewOptions);
})

eventEmitter.on('contactFormUpdate', (formData: Partial<ContactData>) => {
  contactsDataFormModel.updateFormData(formData);
});

eventEmitter.on('formSubmit', () => {
  contactsDataFormModel.submit()
    .then(order => eventEmitter.emit('orderSuccess', order))
    .then(() => basket.clear())
    .then(() => headerBasketCounter.textContent = '0')
    .catch(error => console.error('Ошибка при отправке заказа:', error));
})

eventEmitter.on('orderSuccess', (order: Order) => {
  modalView.open(order, SuccessView, successViewOptions);
})

// Add event listeners

headerBasketElement.addEventListener('click', () => {
  eventEmitter.emit('openBasketModal', {
    data: basket.getItems(),
    cnstr: BasketView,
    options: basketViewOptions
  });
});