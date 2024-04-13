# Market Management API

This API provides functionalities to manage products and categories for a marketplace.

## Usage

### Install Dependencies

```bash
npm install
```

### Back-end/Express Server

```bash
npm start
```

Visit `http://localhost:3000`

### Environment Variables

Add your PostgreSQL URL to the `.env` file.

```
DATABASE_URL="your_database_url"
```

## REST Endpoints

### Products

| Endpoint       | Description    | Method | Body                    |
| -------------- | -------------- | ------ | ----------------------- |
| /products    | Get all products  | GET    | None  |
| /products/:id | Get products by id | GET    | None |
| /products/categories/:categoryid | Get products by category | GET  | None   |
| /products     | Add product       | POST   | { name, description, price, currency, quantity, active, category_id } |
| /products/:id | Update product   | PUT    | { name, description, price, currency, quantity, active, category_id } |
| /products/:id| Delete product    | DELETE | None |

### Categories

| Endpoint       | Description    | Method | Body |
| -------------- | -------------- | ------ | ------- |
| /categories | Get all categories    | GET | None |
| /categories/:id | Get category by id | GET | None |
| /categories | Add a categorie | POST | { name }  |
| /categories/:id | Update categorie   | PUT | { name } |
| /categoriesd/:id | Delete categorie   | DELETE | None |
