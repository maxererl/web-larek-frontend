# Проектная работа "Веб-ларек"

Проект представляет собой интернет-магазин с интерфейсом добавления товаров в корзину, оформления заказа и подтверждения оплаты. Написан на **TypeScript** и использует **шаблоны HTML**, **событийную архитектуру**, и модели представления.

---

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## 1. Интерфейс `IProductApi`

Реализует API для получения списка товаров, информации о конкретном товаре, а также отправки заказов на сервер.

**Методы:**

- `getProductList(): Promise<Product[]>` — возвращает список всех доступных товаров.
- `getProduct(id: string): Promise<Product>` — возвращает один товар по его ID.
- `makeOrder(orderInfo: OrderInfo): Promise<Order>` — отправляет заказ на сервер и возвращает информацию о заказе.

**Типы данных:**
```ts
type Product = {
  id: string;
  description: string;
  image: string;
  title: string;
  category: 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';
  price: number;
};
```

---

## 2. Интерфейс `IBascetModel`

Отвечает за хранение и управление содержимым корзины. Внутренне использует `Map<string, number>`, где ключ — это ID товара, а значение — его количество.

**Методы:**

- `add(id: string): void` — добавить товар в корзину.
- `remove(id: string): void` — удалить товар из корзины.
- `clear(): void` — очистить корзину.
- `getItems(): Map<string, number>` — получить все элементы корзины.

**Поле:**

- `_items: Map<string, number>` — текущие товары в корзине.

---

## 3. Интерфейс `IFormModel<T, R>`

Определяет контракт для моделей форм (доставка, контактные данные и т.д.).

**Методы:**

- `validate(uncheckedFormData: Partial<T>): ValidityState` — выполняет валидацию переданных данных формы.
- `submit(): Promise<R>` — отправляет данные формы.

**Поле:**

- `formData: T` — текущее состояние формы.

---

## 4. Интерфейс `IFormView`

Специализированная версия интерфейса `IView`, предназначенная для отображения форм.

**Методы:**

- `render(data?: object): HTMLElement` — отрисовывает форму.
- `displayValidationError(fieldName: string, errorMessage: string): void` — отображает ошибку валидации для конкретного поля.

---

## 5. Интерфейс `IModalView<T, D>`

Обобщённый интерфейс модального окна, принимающий шаблон и входные данные.

**Методы:**

- `open(data: D): void` — открывает модальное окно с указанными данными.
- `close(): void` — закрывает модальное окно.

**Поле:**

- `_template: T` — HTML-шаблон модального окна.

---

## 6. Типы событий

Проект построен на **событийной архитектуре**, что позволяет моделям и представлениям быть слабо связанными.

**Типы данных:**
```ts
type ProductEvent = {
  id: string;
};

type OrderEvent = {
  orderData: OrderData;
};

type ContactEvent = {
  contactData: ContactData;
};
```

Дополнительно используется внешний интерфейс `IEvents` для управления подписками на события (см. файл `components/base/events.ts`).

---

## 7. Данные формы для заказа

```ts
type OrderData = {
  payment: string;
  address: string;
};

type ContactData = {
  email: string;
  phone: string;
};

interface OrderFormData {
  order: OrderData;
  contact: ContactData;
}

type OrderInfo = {
  orderData: OrderFormData;
  total: number;
  items: Map<string, number>; // ID и количество товаров
};

type Order = {
  id: string;
  total: number;
};
```