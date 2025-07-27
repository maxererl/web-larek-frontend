import { AbstractProductApi, Product, ProductApiResponse } from '../../types';

export class ProductApi extends AbstractProductApi {
  getProductList(): Promise<Product[]> {
    return super.get('/product')
      .then(obj => (obj as ProductApiResponse).items)
      .catch((): [] => []);
  }

  getProduct(id: string): Promise<Product> {
    return super.get('/product/' + id)
      .then(obj => (obj as Product))
      .catch(error => {
        console.error('Ошибка при получении продукта:', error);
        throw error;
      });
  }
}
