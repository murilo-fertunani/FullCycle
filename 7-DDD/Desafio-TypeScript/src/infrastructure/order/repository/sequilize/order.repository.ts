import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total()
      },
      {
        where: {
          id: entity.id,
        }
      }
    );

    entity.items.forEach(async (item) => {
      await OrderItemModel.update(
        {
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        },
        {
          where: {
            id: item.id
          }
        }
      )
    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ include: [{ model: OrderItemModel, required: true}], where: { id } });

    return new Order(orderModel.id, orderModel.customer_id, orderModel.items?.map((item) => 
      new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))
    );
  }
  
  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: [{ model: OrderItemModel, required: true}] });

    return orderModels.map((orderModel) =>
      new Order(orderModel.id, orderModel.customer_id, orderModel.items?.map((item) => 
        new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)))
    );
  }
}
