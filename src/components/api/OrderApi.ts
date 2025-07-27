import { AbstractOrderApi, Order, OrderInfo } from "../../types";

export class OrderApi extends AbstractOrderApi {
    makeOrder(orderInfo: OrderInfo): Promise<Order> {
      return super.post('/order', {
        ...orderInfo.orderData.order,
        ...orderInfo.orderData.contact,
        total: orderInfo.total,
        items: Array.from(orderInfo.items.keys())
      })
      .then(obj => (obj as Order))
      .catch(error => {
        console.error('Ошибка при создании заказа:', error);
        throw error;
      });
    }
  }