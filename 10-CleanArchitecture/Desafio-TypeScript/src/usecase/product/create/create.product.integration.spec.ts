import { Sequelize } from "sequelize-typescript";
import CreateProductUseCase from "./create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

describe("Test create product use case", () => {
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

    it("should create a product", async () => {
        const repository = new ProductRepository();
        const useCase = new CreateProductUseCase(repository);

        const input = {
            name: "Product 1",
            price: 10
        };

        const result = await useCase.execute(input);

        expect(result).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        });
    });
});
