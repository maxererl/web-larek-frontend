# Проектная работа "Веб-ларек"

Проект представляет собой интернет-магазин с интерфейсом добавления товаров в корзину, оформления заказа и подтверждения оплаты. Написан на **TypeScript** и использует **шаблоны HTML**, **событийную архитектуру**, и модели представления.

---

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/base/ — папка с апи сервисами
- src/components/model/ — папка с моделями данных
- src/components/view/ — папка с представлениями

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

Проект построен на основе **MVP (Model-View-Presenter)** архитектуры с использованием **событийной системы** для связи между компонентами. Архитектура разделена на несколько основных частей:

- **Модели данных (Model)** — управляют состоянием корзины и форм
- **Представления (View)** — компоненты, отвечающие за отображение интерфейса
- **Событийная система (EventEmitter)** — реализует паттерн "Наблюдатель" и обеспечивает связь между компонентами
- **API слой** — взаимодействие с сервером для получения товаров и оформления заказа

### Поток данных в приложении

1. Пользователь взаимодействует с интерфейсом (View)
2. View генерирует события через EventEmitter
3. Обработчики событий обновляют модели (Model)
4. Модели уведомляют представления об изменениях через события
5. Представления обновляют интерфейс

---

## Базовые классы

### Абстрактный класс `FormView<T>`

Базовый абстрактный класс для всех форм приложения. Реализует интерфейс `IFormView<T>` и предоставляет общую функциональность для работы с формами.

**Конструктор:**

```typescript
constructor(public _options: Record<string, any>)
```

- `_options` — настройки формы (шаблон, родительский элемент, CSS-классы, события)

**Свойства:**

- `_options: Record<string, any>` — конфигурация представления

**Абстрактные методы:**

- `abstract render(data?: T): HTMLFormElement` — создает и отображает форму
- `abstract checkValidity(formElement: HTMLFormElement, ...inputs: any): boolean` — проверяет валидность формы
- `protected abstract getSubmitEventName(): string` — возвращает имя события для отправки формы

**Защищенные методы:**

- `protected setupForm(data?: T): HTMLFormElement` — создает базовую структуру формы из шаблона
- `protected setupSubmitButton(submitButton: HTMLButtonElement): void` — настраивает обработчик кнопки отправки
- `protected displayValidationError(errorsElement: HTMLElement, errorMessage: string): void` — отображает ошибки валидации
- `protected toggleSubmitButtonState(button: HTMLButtonElement, isValid: boolean): void` — управляет состоянием кнопки отправки
- `protected getErrorsElement(formElement: HTMLFormElement): HTMLElement` — получает элемент для отображения ошибок

### Класс `Api`

Базовый класс для выполнения HTTP-запросов к серверу.

**Конструктор:**

```typescript
constructor(baseUrl: string, options: RequestInit = {})
```

- `baseUrl: string` — базовый URL для всех запросов
- `options: RequestInit` — глобальные опции fetch-запросов (заголовки, методы и т.д.)

**Свойства:**

- `readonly baseUrl: string` — базовый URL API
- `protected options: RequestInit` — настройки запросов

**Методы:**

- `protected handleResponse(response: Response): Promise<object>` — обрабатывает ответ сервера, проверяет статус и парсит JSON
- `get(uri: string): Promise<object>` — выполняет GET-запрос по указанному URI
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` — выполняет POST/PUT/DELETE запрос с данными

### Класс `EventEmitter`

Реализует паттерн "Наблюдатель" для событийной архитектуры приложения.

**Конструктор:**

```typescript
constructor();
```

**Свойства:**

- `_events: Map<EventName, Set<Subscriber>>` — карта событий и их подписчиков

**Методы:**

- `on<T extends object>(eventName: EventName, callback: (event: T) => void): void` — подписывается на событие
- `off(eventName: EventName, callback: Subscriber): void` — отписывается от события
- `emit<T extends object>(eventName: string, data?: T): void` — генерирует событие с данными
- `onAll(callback: (event: EmitterEvent) => void): void` — подписывается на все события
- `offAll(): void` — сбрасывает все обработчики
- `trigger<T extends object>(eventName: string, context?: Partial<T>): (event: object) => void` — создает триггер-функцию для генерации события

---

## Модели данных

### Класс `ProductApi`

Наследует `AbstractProductApi`, который расширяет базовый класс `Api`. Отвечает за взаимодействие с API товаров.

**Конструктор:**

```typescript
constructor(baseUrl: string, options?: RequestInit)
```

- `baseUrl: string` — базовый URL API

**Методы:**

- `getProductList(): Promise<Product[]>` — получает список всех товаров с сервера, возвращает массив товаров или пустой массив при ошибке
- `getProduct(id: string): Promise<Product>` — получает конкретный товар по его идентификатору

### Класс `OrderApi`

Наследует `AbstractOrderApi`, который расширяет базовый класс `Api`. Отвечает за оформление заказов.

**Конструктор:**

```typescript
constructor(baseUrl: string, options?: RequestInit)
```

- `baseUrl: string` — базовый URL API

**Методы:**

- `makeOrder(orderInfo: OrderInfo): Promise<Order>` — отправляет данные заказа на сервер, возвращает информацию о созданном заказе

### Класс `BasketModel`

Реализует интерфейс `IBasketModel`. Управляет состоянием корзины покупок.

**Конструктор:**

```typescript
constructor();
```

**Свойства:**

- `_items: Map<string, Product>` — карта товаров в корзине, где ключ — ID товара, значение — объект товара

**Методы:**

- `add(product: Product): void` — добавляет товар в корзину
- `remove(id: string): void` — удаляет товар из корзины по ID
- `getItems(): Product[]` — возвращает массив всех товаров в корзине
- `clear(): void` — очищает корзину от всех товаров
- `hasItem(id: string): boolean` — проверяет наличие товара в корзине

### Абстрактный класс `IFormModel<T>`

Базовый класс для работы с формами заказа. Содержит статические методы для управления общими данными формы.

**Статические свойства:**

- `protected static formData: OrderInfo` — общие данные формы заказа

**Абстрактные методы:**

- `abstract updateFormData(data: T): void` — обновляет данные формы

**Статические методы:**

- `static getFormData(): OrderInfo` — возвращает текущие данные формы
- `static updateFormItems(data: Product[]): void` — обновляет список товаров в заказе
- `static updateFormTotal(total: number): void` — обновляет общую стоимость заказа

### Класс `OrderDataFormModel`

Наследует `IFormModel<OrderData>`. Управляет данными формы заказа (способ оплаты и адрес).

**Конструктор:**

```typescript
constructor();
```

**Методы:**

- `updateFormData(data: Partial<OrderData>): void` — обновляет данные заказа (payment, address)

### Класс `ContactDataFormModel`

Наследует `IFormModel<ContactData>`. Управляет контактными данными формы заказа.

**Конструктор:**

```typescript
constructor(private api: AbstractOrderApi)
```

- `api: AbstractOrderApi` — экземпляр API для отправки заказа

**Свойства:**

- `private api: AbstractOrderApi` — API для работы с заказами

**Методы:**

- `updateFormData(data: Partial<ContactData>): void` — обновляет контактные данные (email, phone)
- `submit(): Promise<Order>` — отправляет заказ через API

---

## Представления (Views)

### Класс `ModalView<D, E extends HTMLElement>`

Реализует интерфейс `IModalView<D, E>`. Управляет модальными окнами приложения.

**Конструктор:**

```typescript
constructor(public _options: Record<string, any>)
```

- `_options` — настройки модального окна (контейнер, CSS-классы, модификаторы)

**Свойства:**

- `_options: Record<string, any>` — конфигурация модального окна

**Методы:**

- `open(data: D, cnstr: IViewConstructor<D, E>, options: Record<string, any>): void` — открывает модальное окно с указанными данными и конструктором представления
- `close(): void` — закрывает модальное окно и очищает его содержимое
- `private clearModalContent(): void` — очищает содержимое модального окна

### Класс `ProductCardView`

Реализует интерфейс `IView<Product, HTMLButtonElement>`. Отображает карточку товара в каталоге.

**Конструктор:**

```typescript
constructor(public _options: Record<string, any>)
```

- `_options` — настройки отображения (шаблон, родительский элемент, CSS-классы, CDN URL и т.д.)

**Свойства:**

- `_options: Record<string, any>` — конфигурация представления

**Методы:**

- `render(data?: Product): HTMLButtonElement` — создает и отображает карточку товара, добавляет обработчик клика для открытия превью
- `private createCard(cardElement: HTMLButtonElement, product: Product): HTMLButtonElement` — заполняет карточку данными товара (категория, название, изображение, цена)

### Класс `ProductCardPreviewView`

Реализует интерфейс `IView<Product, HTMLDivElement>`. Отображает детальную информацию о товаре в модальном окне.

**Конструктор:**

```typescript
constructor(public _options: Record<string, any>)
```

- `_options` — настройки отображения (шаблон, CSS-классы, доступность товара и т.д.)

**Свойства:**

- `_options: Record<string, any>` — конфигурация представления

**Методы:**

- `render(data?: Product): HTMLDivElement` — создает превью товара с кнопкой добавления/удаления из корзины
- `private createCard(cardPreviewElement: HTMLDivElement, product: Product): HTMLDivElement` — заполняет превью полной информацией о товаре (включая описание)

### Класс `CompactCardView`

Реализует интерфейс `IView<Product, HTMLLIElement>`. Отображает компактную карточку товара в корзине.

**Конструктор:**

```typescript
constructor(public _options: Record<string, any>)
```

- `_options` — настройки отображения (шаблон, CSS-классы, события)

**Свойства:**

- `_options: Record<string, any>` — конфигурация представления

**Методы:**

- `render(data?: Product): HTMLLIElement` — создает компактную карточку товара для корзины
- `private createCard(cardCompactElement: HTMLLIElement, product: Product, index: number): HTMLLIElement` — заполняет карточку названием, ценой и кнопкой удаления

### Класс `BasketView`

Реализует интерфейс `IView<Product[], HTMLDivElement>`. Отображает содержимое корзины.

**Конструктор:**

```typescript
constructor(public _options: Record<string, any>)
```

- `_options` — настройки отображения (шаблон, CSS-классы, валюта, текст пустой корзины и т.д.)

**Свойства:**

- `_options: Record<string, any>` — конфигурация представления

**Методы:**

- `render(data?: Product[]): HTMLDivElement` — отображает корзину с товарами или сообщение о пустой корзине
- `updateBasketElements(cardsListElement: HTMLElement, priceElement: HTMLElement, basketButton: HTMLButtonElement): void` — обновляет элементы корзины (нумерация, общая стоимость, состояние кнопки)

### Класс `OrderDataFormView`

Наследует абстрактный класс `FormView<OrderData>` и реализует интерфейс `IFormView<OrderData>`. Отображает форму выбора способа оплаты и ввода адреса.

**Конструктор:**

```typescript
constructor(public _options: Record<string, any>)
```

- `_options` — настройки формы (шаблон, CSS-классы, тексты ошибок, события)

**Свойства:**

- `_options: Record<string, any>` — конфигурация представления (наследуется от базового класса)

**Методы:**

- `render(data?: OrderData): HTMLFormElement` — создает форму заказа с кнопками выбора оплаты и полем адреса, устанавливает обработчики событий
- `checkValidity(formElement: HTMLFormElement, buttons: Element[], addressElement: HTMLInputElement, submitButton: HTMLButtonElement): boolean` — проверяет валидность формы (выбран способ оплаты и введен адрес), отображает ошибки валидации
- `protected getSubmitEventName(): string` — возвращает имя события для отправки формы (`'nextFormStep'`)
- `private setupPaymentButtons()` — настраивает обработчики кликов для кнопок выбора способа оплаты
- `private setupAddressInput()` — настраивает обработчик ввода для поля адреса

### Класс `ContactsDataFormView`

Наследует абстрактный класс `FormView<ContactData>` и реализует интерфейс `IFormView<ContactData>`. Отображает форму ввода контактных данных.

**Конструктор:**

```typescript
constructor(public _options: Record<string, any>)
```

- `_options` — настройки формы (шаблон, CSS-классы, тексты ошибок, события)

**Свойства:**

- `_options: Record<string, any>` — конфигурация представления (наследуется от базового класса)

**Методы:**

- `render(data?: ContactData): HTMLFormElement` — создает форму с полями email и телефона, устанавливает обработчики событий
- `checkValidity(formElement: HTMLFormElement, emailElement: HTMLInputElement, phoneElement: HTMLInputElement, submitButton: HTMLButtonElement): boolean` — проверяет заполненность обязательных полей, отображает ошибки валидации
- `protected getSubmitEventName(): string` — возвращает имя события для отправки формы (`'formSubmit'`)
- `private setupEmailInput()` — настраивает обработчик ввода для поля email
- `private setupPhoneInput()` — настраивает обработчик ввода для поля телефона

### Класс `SuccessView`

Реализует интерфейс `IView<Order, HTMLDivElement>`. Отображает сообщение об успешном оформлении заказа.

**Конструктор:**

```typescript
constructor(public _options: Record<string, any>)
```

- `_options` — настройки представления (шаблон, CSS-классы, события)

**Свойства:**

- `_options: Record<string, any>` — конфигурация представления

**Методы:**

- `render(data: Order): HTMLDivElement` — отображает сообщение об успешном заказе с суммой списания

---

## Типы данных

### Основные типы

```typescript
// Товар
type Product = {
	id: string; // Уникальный идентификатор
	description: string; // Описание товара
	image: string; // Путь к изображению
	title: string; // Название товара
	category: 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое'; // Категория
	price: number; // Цена в синапсах
};

// Данные заказа
type OrderData = {
	payment: string; // Способ оплаты
	address: string; // Адрес доставки
};

// Контактные данные
type ContactData = {
	email: string; // Email покупателя
	phone: string; // Телефон покупателя
};

// Полные данные формы заказа
interface OrderFormData {
	order: OrderData; // Данные заказа
	contact: ContactData; // Контактные данные
}

// Информация для отправки заказа
type OrderInfo = {
	orderData: OrderFormData; // Данные форм
	total: number; // Общая стоимость
	items: Map<string, Product>; // Товары в заказе
};

// Ответ сервера при создании заказа
type Order = {
	id: string; // ID созданного заказа
	total: number; // Итоговая сумма
};
```

### Интерфейсы

```typescript
// Интерфейс модели корзины
interface IBasketModel {
	_items: Map<string, Product>;
	add(product: Product): void;
	remove(id: string): void;
	getItems(): Product[];
	clear(): void;
}

// Интерфейс представления
interface IView<T, E extends HTMLElement> {
	_options: Record<string, any>;
	render(data?: T): E;
}

// Интерфейс формы
interface IFormView<T> extends IView<T, HTMLFormElement> {
	checkValidity(formElement: HTMLFormElement, ...inputs: any): boolean;
}

// Интерфейс модального окна
interface IModalView<D, E extends HTMLElement> {
	_options: Record<string, any>;
	open(
		data: D,
		cnstr: IViewConstructor<D, E>,
		options: Record<string, any>
	): void;
	close(): void;
}

// Интерфейс событийной системы
interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}
```

---

## События приложения

Приложение использует событийную архитектуру для связи между компонентами:

### События товаров

- `openCardPreview` — открытие превью товара
- `addToBasket` — добавление товара в корзину
- `removeFromBasket` — удаление товара из корзины

### События корзины

- `openBasketModal` — открытие модального окна корзины
- `makeOrder` — переход к оформлению заказа

### События форм

- `orderFormUpdate` — обновление данных формы заказа
- `contactFormUpdate` — обновление контактных данных
- `nextFormStep` — переход к следующему шагу оформления
- `formSubmit` — отправка заказа

### События модальных окон

- `closeModal` — закрытие модального окна
- `orderSuccess` — успешное оформление заказа

---

## Взаимодействие компонентов

1. **Загрузка товаров**: `ProductApi.getProductList()` → `ProductCardView.render()`
2. **Просмотр товара**: клик по карточке → событие `openCardPreview` → `ModalView.open()` с `ProductCardPreviewView`
3. **Добавление в корзину**: клик "В корзину" → событие `addToBasket` → `BasketModel.add()`
4. **Просмотр корзины**: клик на иконку корзины → событие `openBasketModal` → `ModalView.open()` с `BasketView`
5. **Оформление заказа**: клик "Оформить" → событие `makeOrder` → `ModalView.open()` с `OrderDataFormView`
6. **Заполнение форм**: ввод данных → события `orderFormUpdate`/`contactFormUpdate` → обновление моделей форм
7. **Отправка заказа**: клик "Оплатить" → событие `formSubmit` → `ContactDataFormModel.submit()` → `OrderApi.makeOrder()`
8. **Подтверждение**: успешный ответ → событие `orderSuccess` → `ModalView.open()` с `SuccessView`

Все взаимодействия происходят через `EventEmitter`, что обеспечивает слабую связанность компонентов и легкость тестирования.
