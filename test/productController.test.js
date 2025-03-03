require('dotenv').config();
jest.setTimeout(60000); 

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('../routes/productRoutes');
const Product = require('../models/Product');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', productRoutes);

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST;
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Product API Endpoints', () => {
  let productId;

  it('should create a new product (POST /products)', async () => {
    const newProduct = {
      name: 'Test Product',
      description: 'Test Description',
      image: 'https://example.com/image.jpg',
      category: 'Camisetas',
      size: 'M',
      price: 19.99,
    };

    const response = await request(app)
      .post('/products')
      .send(newProduct)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(newProduct.name);
    productId = response.body._id;
  });

  it('should get all products (GET /products)', async () => {
    const response = await request(app)
      .get('/products')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a product by id (GET /products/:id)', async () => {
    const response = await request(app)
      .get(`/products/${productId}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', productId);
  });

  it('should update a product (PUT /products/:id)', async () => {
    const updatedData = { name: 'Updated Test Product' };

    const response = await request(app)
      .put(`/products/${productId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty('name', updatedData.name);
  });

  it('should delete a product (DELETE /products/:id)', async () => {
    const response = await request(app)
      .delete(`/products/${productId}`)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Producto eliminado correctamente');
  });
});