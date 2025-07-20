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

---

## Архитектура проекта

Архитектура разделена на несколько основных частей:

- **Модели данных** — управляют состоянием корзины и форм.
- **Представления (Views)** — компоненты, отвечающие за отображение интерфейса.
- **Модальные окна** — используются для взаимодействия с пользователем (корзина, оформление заказа, подтверждение).
- **API** — взаимодействие с сервером для получения товаров и оформления заказа.
- **Событийная система (`IEvents`)** — реализует паттерн "Наблюдатель" и обеспечивает связь между компонентами.

### Взаимодействие компонентов

1. Пользователь выбирает товар — происходит событие `ProductEvent`.
2. Товар добавляется в `BasketModel`.
3. При оформлении запускается `FormModel`, проверяет данные через `validate`.
4. Собранные данные передаются в `ProductApi.makeOrder()`.
5. После успеха показывается модальное окно с подтверждением.

---

## 1. Класс `Api`

Базовый класс для выполнения HTTP-запросов.

```ts
class Api {
  constructor(baseUrl: string, options: RequestInit = {});
}
```

- `baseUrl: string` — базовый URL для всех запросов.
- `options: RequestInit` — глобальные опции fetch-запросов, например, заголовки.

Этот класс предоставляет методы для выполнения запросов и может быть расширен для конкретных API.

---

## 2. Класс `ProductApi` (интерфейс `IProductApi` расширяет класс Api)

Класс реализует работу с API товаров и оформления заказов.

```ts
class ProductApi implements IProductApi {
  getProductList(): Promise<Product>;
  getProduct(id: string): Promise<Product>;
  makeOrder(orderInfo: OrderInfo): Promise<Order>;
}
```

**Методы:**

- `getProductList()` — загружает список всех товаров.
- `getProduct(id)` — получает товар по его `id`.
- `makeOrder(orderInfo)` — отправляет заказ на сервер.

---

## 3. Класс `BasketModel` (интерфейс `IBascetModel`)

Хранит состояние корзины и управляет её содержимым.

```ts
class BasketModel implements IBascetModel {
  private _items: Map<string, number>;
  add(id: string): void;
  remove(id: string): void;
  clear(): void;
  getItems(): Map<string, number>;
}
```

**Методы:**

- `add(id: string): void` — добавляет предмет в корзину.
- `remove(id: string): void` — убирает товар из корзины.
- `clear(): void` — удаляет все товары из корзины.
- `getItems(): Map<string, number>` — возвращает все товары из корзины.

**Поле:**

- `_items` — карта товаров в корзине: ключ — `id`, значение — количество.

---

## 4. Класс `FormModel<T>` (интерфейс `IFormModel<T>`)

Универсальная модель для форм ввода данных.

```ts
class FormModel<T> implements IFormModel<T> {
  formData: T;
  validate(data: Partial<T>): ValidationResult<T>;
  submit(): void;
}
```

**Конструктор:**

- `initialData` — начальные значения полей формы (`formData`).

**Методы:**

- `validate(data)` — проверяет корректность данных и возвращает ошибки.
- `submit()` — создаёт событие отправки формы.

**Поле:**

- `formData` — хранит текущее состояние формы.

---

## 5. Интерфейс `IFormView`

Специализированная версия интерфейса `IView`, предназначенная для отображения форм.

**Методы:**

- `render(data?: object): HTMLElement` — отрисовывает форму.
- `displayValidationError(fieldName: string, errorMessage: string): void` — отображает ошибку валидации для конкретного поля.

---

## 6. Интерфейс `IModalView<T, D>`

Обобщённый интерфейс модального окна, принимающий шаблон и входные данные.

**Методы:**

- `open(data: D): void` — открывает модальное окно с указанными данными.
- `close(): void` — закрывает модальное окно.

**Поле:**

- `_template: T` — HTML-шаблон модального окна.

---

## 7. Типы событий

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

## 8. Данные формы для заказа

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