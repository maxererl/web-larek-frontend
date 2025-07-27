import { AbstractOrderApi, ContactData, IFormModel, Order, OrderData } from "../../types";

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