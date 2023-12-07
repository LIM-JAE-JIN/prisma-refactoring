export class ProductsService {
  constructor(productsRepository) {
    this.productsRepository = productsRepository;
  }

  // 생성
  createProduct = async (userId, name, title, content, res) => {
    if (!title) {
      return res.status(400).json({
        success: false,
        message: '제목 입력이 필요합니다.',
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: '설명 입력이 필요합니다.',
      });
    }

    const product = await this.productsRepository.createProduct(userId, title, content);
    return {
      productId: product.productId,
      UserId: product.UserId,
      userName: name,
      title: product.title,
      content: product.content,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }
  };

  // 내림차순 목록조회
  getProducts = async () => {
    const products = await this.productsRepository.getProducts();

    // 내림차순
    products.sort((a, b) => b.createdAt - a.createdAt);

    return products.map((product) => {
      return {
        productId: product.productId,
        title: product.title,
        content: product.content,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    })
  }

  // 상세조회
  getProduct = async (productId, title, content, status, userId, res) => {
    const product = await this.productsRepository.getProduct(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품 조회에 실패했습니다.',
      });
    }

    return {
      productId: product.productId,
      name: product.User.name,
      title: product.title,
      content: product.content,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }
  }

  // 수정
  editProduct = async (productId, title, content, status, userId, res) => {
    // 수정 정보가 하나도 없는 경우
    if (!title && !content && !status) {
      return res.status(400).json({
        success: false,
        message: '수정 정보는 최소 한 가지 이상이어야 합니다.',
      });
    }

    const isValidStatus = status
      ? status === 'FOR_SALE' || status === 'SOLD_OUT'
      : true;

    if (!isValidStatus) {
      return res.status(400).json({
        success: false,
        message: '지원하지 않는 상태입니다. (status: FOR_SALE | SOLD_OUT)',
      });
    }

    // 일치하는 상품이 존재하지 않는 경우
    const product = await this.productsRepository.getProduct(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품 조회에 실패했습니다.',
      });
    }

    // 작성자ID와 인증 정보의 사용자ID가 다른 경우
    const isProductOwner = product.UserId === userId;
    if (!isProductOwner) {
      return res.status(403).json({
        success: false,
        message: '상품 수정 권한이 없습니다.',
      });
    }

    const editProduct = await this.productsRepository.editProduct(productId, title, content, status, userId);

    return {
      productId: editProduct.productId,
      name: editProduct.User.name,
      title: editProduct.title,
      content: editProduct.content,
      status: editProduct.status,
      createdAt: editProduct.createdAt,
      updatedAt: editProduct.updatedAt
    }
  }

  // 삭제
  deleteProduct = async (productId, userId, res) => {
    // 일치하는 상품이 존재하지 않는 경우
    const product = await this.productsRepository.getProduct(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품 조회에 실패했습니다.'
      });
    }

    // 작성자ID와 인증 정보의 사용자ID가 다른 경우
    const isProductOwner = product.UserId === userId;
    if (!isProductOwner) {
      return res.status(403).json({
        success: false,
        message: '상품 삭제 권한이 없습니다.'
      });
    }

    const deleteProduct = await this.productsRepository.deleteProduct(productId, userId);

    return {
      productId: deleteProduct.productId,
      name: deleteProduct.User.name,
      title: deleteProduct.title,
      content: deleteProduct.content,
      status: deleteProduct.status,
      createdAt: deleteProduct.createdAt,
      updatedAt: deleteProduct.updatedAt
    }
  }


}
