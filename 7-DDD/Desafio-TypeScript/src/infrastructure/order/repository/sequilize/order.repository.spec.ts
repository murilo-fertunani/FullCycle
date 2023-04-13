import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 1);
    const order = new Order("1", "1", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({ include: [{ model: OrderItemModel, required: true}], where: { id: "1" } });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "1",
      total: 10,
      items: [
        {
          id: "1",
          order_id: "1",
          product_id: "1",
          name: "Product 1",
          quantity: 1,
          price: 10
        }
      ]
    });

    const customer2 = new Customer("2", "Customer 2");
    const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
    customer2.changeAddress(address2);
    await customerRepository.create(customer2);

    const product2 = new Product("2", "Product 2", 20);
    await productRepository.create(product2);

    orderItem.changeName(product2.name);
    orderItem.changeProductId(product2.id);
    orderItem.changeQuantity(2);
    orderItem.changePrice(product2.price);

    order.changeCustomerId(customer2.id);
    order.changeItems([orderItem]);

    await orderRepository.update(order);

    const orderModel2 = await OrderModel.findOne({ include: [{ model: OrderItemModel, required: true}], where: { id: "1" } });

    expect(orderModel2.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "2",
      total: 40,
      items: [
        {
          id: "1",
          order_id: "1",
          product_id: "2",
          name: "Product 2",
          quantity: 2,
          price: 20
        }
      ]
    });
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 1);
    const order = new Order("1", "1", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({ include: [{ model: OrderItemModel, required: true}], where: { id: "1" } });

    const foundOrder = await orderRepository.find("1");

    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder.id,
      customer_id: foundOrder.customerId,
      total: orderItem.price,
      items: [
        {
          id: orderItem.id,
          order_id: order.id,
          product_id: orderItem.productId,
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
        }
      ]
    });
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem1 = new OrderItem("1", product.name, product.price, product.id, 1);
    const orderItem2 = new OrderItem("2", product.name, product.price, product.id, 2);

    const order1 = new Order("1", "1", [orderItem1]);
    const order2 = new Order("2", "1", [orderItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();
    const orders = [order1, order2];

    expect(orders).toEqual(foundOrders);    
  });
});
