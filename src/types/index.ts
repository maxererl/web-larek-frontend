import { Api } from "../components/base/api";
import { IEvents } from "../components/base/events";

export type Product = {
  id: string,
  description: string,
  image: string,
  title: string,
  category: 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое',
  price: number
}

export type OrderData = {
  payment: string,
  address: string
}

export type ContactData = {
  email: string,
  phone: string
}

export interface OrderFormData {
  order: OrderData;
  contact: ContactData;
}

export type OrderInfo = {
  orderData: OrderFormData,
  total: number,
  items: Map<string, Product>;
}

export type Order = {
  id: string,
  total: number
}

export abstract class AbstractProductApi extends Api {
  abstract getProductList(): Promise<Product[]>;
  abstract getProduct(id: string): Promise<Product>;
}

export abstract class AbstractOrderApi extends Api {
  abstract makeOrder(orderInfo: OrderInfo): Promise<Order>;
}

export type ProductApiResponse = {
  total: number,
  items: Product[]
}

export interface IBasketModel {
  _items: Map<string, Product>;
  add(product: Product): void;
  remove(id: string): void;
  getItems(): Product[];
  clear(): void;
}

export abstract class IFormModel<T> {
  protected static formData: OrderInfo = {
    orderData: {
      order: {
        payment: '',
        address: ''
      },
      contact: {
        email: '',
        phone: ''
      }
    },
    total: 0,
    items: undefined
  };
  abstract updateFormData(data: T): void;
  static getFormData(): OrderInfo {
    return IFormModel.formData;
  }
  static updateFormItems(data: Product[]): void {
    IFormModel.formData.items = new Map(data.map(item => [item.id, item]));
  }
  static updateFormTotal(total: number): void {
    IFormModel.formData.total = total;
  }
}

export interface IViewConstructor<T, E extends HTMLElement> {
  new (options: Record<string, string>): IView<T, E>;
}

export interface IView<T, E extends HTMLElement> {
  _options: Record<string, any>;
  render(data?: T): E;
}

export type CardViewOptions = {
  CDN_URL: string,
  cardTemplateElement: HTMLTemplateElement,
  cardsParentElement: HTMLElement,
  cardBlock: string,
  cardElements: Record<string, string>,
  cardCategoryModifiers: Record<string, string>,
  cardNullPricePlaceholder: string
};

export interface IFormView<T> extends IView<T, HTMLFormElement> {
  checkValidity(formElement: HTMLFormElement, ...inputs: any): boolean;
}

export type ModalData<D, E extends HTMLElement> = {
  data: D,
  cnstr: IViewConstructor<D, E>,
  options: Record<string, any>
}

export interface IModalView<D, E extends HTMLElement> {
  _options: Record<string, any>;

  open(data: D, cnstr: IViewConstructor<D, E>, options: Record<string, any>): void;
  close(): void;
}


