import { AbstractOrderApi, ContactData, IFormModel, Order, OrderData, OrderFormData, OrderInfo } from "../../types";

export class OrderApi extends AbstractOrderApi {
  makeOrder(orderInfo: OrderInfo): Promise<Order> {
    return super.post('/order', {
      ...orderInfo.orderData.order,
      ...orderInfo.orderData.contact,
      total: orderInfo.total,
      items: Array.from(orderInfo.items.keys())
    })
    .then(obj => (obj as Order));
  }
}

export class OrderDataFormModel extends IFormModel<OrderData> {
  updateFormData(data: Partial<OrderData>): void {
    IFormModel.formData.orderData.order = { ...IFormModel.formData.orderData.order, ...data };
  }
}

export class ContactDataFormModel extends IFormModel<ContactData> {
  constructor(private api: AbstractOrderApi) {super();}
  updateFormData(data: Partial<ContactData>): void {
    IFormModel.formData.orderData.contact = { ...IFormModel.formData.orderData.contact, ...data };
  }

  submit(): Promise<Order> {
    return this.api.makeOrder(IFormModel.formData);
  }
}