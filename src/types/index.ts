import { IEvents } from "../components/base/events";

type Product = {
  id: string,
  description: string,
  image: string,
  title: string,
  category: 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое',
  price: number
}

type OrderData = {
  payment: string,
  address: string
}

type ContactData = {
  email: string,
  phone: string
}

interface OrderFormData {
  order: OrderData;
  contact: ContactData;
}

type OrderInfo = {
  orderData: OrderFormData,
  total: number,
  items: Map<string, number>;
}

type Order = {
  id: string,
  total: number
}

interface IProductApi {
  getProductList(): Promise<Product[]>;
  getProduct(id: string): Promise<Product>;
  makeOrder(orderInfo: OrderInfo): Promise<Order>;
}

interface IBascetModel {
  _items: Map<string, number>;
  add(id: string): void;
  remove(id: string): void;
  getItems(): Map<string, number>;
  clear(): void;
}

interface IFormModel<T, R> {
  formData: T;
  validate(uncheckedFormData: Partial<T>): ValidityState;
  submit(): Promise<R>;
}

interface IViewConstructor {
  new (container: HTMLElement, events?: IEvents): IView;
}

interface IView {
  render(data?: object): HTMLElement;
}

interface IFormView extends IView {
  displayValidationError(fieldName: string, errorMessage: string): void;
}

interface IModalView<T extends HTMLElement, D> {
  _template: T;

  open(data: D): void;
  close(): void;
}

type ProductEvent = {
  id: string
}

type OrderEvent = {
  orderData: OrderData
}

type ContactEvent = {
  contactData: ContactData
}
