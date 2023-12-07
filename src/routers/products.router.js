import { Router } from 'express';
import { needSignin } from '../middlewares/need-signin.middleware.js';
import { ProductsController } from '../controllers/products.controller.js';
import { ProductsService } from '../services/product.service.js';
import { ProductsRepository } from '../repositories/products.repository.js';
import { prisma } from '../utils/prisma/index.js';

const productsRouter = Router();

const productRepository = new ProductsRepository(prisma);
const productsService = new ProductsService(productRepository);
const productsController = new ProductsController(productsService);

// 생성
productsRouter.post('', needSignin, productsController.createProduct);

// 목록 조회
productsRouter.get('', productsController.getProducts);

// 상세 조회
productsRouter.get('/:productId', productsController.getProduct);

// 수정
productsRouter.put('/:productId', needSignin, productsController.editProduct);

// 삭제
productsRouter.delete('/:productId', needSignin, productsController.deleteProduct);


export { productsRouter };
