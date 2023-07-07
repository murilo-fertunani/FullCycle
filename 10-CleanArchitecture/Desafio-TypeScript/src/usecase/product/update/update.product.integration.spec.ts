import { Sequelize } from "sequelize-typescript";
import UpdateProductUseCase from "./update.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";

describe("Test product update use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a product", async () => {
        const repository = new ProductRepository();
        const useCase = new UpdateProductUseCase(repository);

        const product = new Product("123", "Product 1", 10);

        await repository.create(product);

        const input = {
            id: product.id,
            name: "Product 1 Updated",
            price: 11
        };

        const result = await useCase.execute(input);

        expect(result).toEqual(input);
    });
});