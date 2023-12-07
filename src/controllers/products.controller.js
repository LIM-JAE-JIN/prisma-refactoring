export class ProductsController {
  constructor(productsService) {
    this.productsService = productsService
  }

  createProduct = async (req, res, next) => {
    try {
      const { userId, name } = res.locals.user;
      const { title, content } = req.body;

      const product = await this.productsService.createProduct(userId, name, title, content, res);

      return res.status(201).json({
        success: true,
        message: '상품 생성에 성공했습니다.',
        data: product
      });
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (req, res, next) => {
    try {
      const products = await this.productsService.getProducts();

      return res.status(200).json({
        success: true,
        message: '상품 목록 조회에 성공했습니다.',
        data: products
      });
    } catch (error) {
      next(error);
    }
  };

  getProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;

      const product = await this.productsService.getProduct(productId, res);

      return res.status(200).json({
        success: true,
        message: '상품 목록 조회에 성공했습니다.',
        data: product
      });
    } catch (error) {
      next(error);
    }
  };

  editProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { title, content, status } = req.body;
      const { userId } = res.locals.user;

      const updatedProduct = await this.productsService.editProduct(productId, title, content, status, userId, res);

      return res.status(200).json({
        success: true,
        message: '상품 수정에 성공했습니다.',
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { userId } = res.locals.user;

      const deleteProduct = await this.productsService.deleteProduct(productId, userId, res);

      return res.status(200).json({
        success: true,
        message: '상품 삭제에 성공했습니다.',
        data: deleteProduct,
      });
    } catch (error) {
      next(error);
    }
  };
}