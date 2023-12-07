export class ProductsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createProduct = async (userId, title, content) => {
    const createProduct = await this.prisma.products.create({
      data: {
        UserId: userId,
        title,
        content
      }
    })
    return createProduct;
  }

  getProducts = async () => {
    const products = await this.prisma.products.findMany();

    return products;
  }

  getProduct = async (productId) => {
    const product = await this.prisma.products.findFirst({
      where: { productId: +productId, },
      include: { User: { select: { name: true } } }
    });

    console.log(product)
    return product;
  }

  editProduct = async (productId, title, content, status, userId) => {
    const editProduct = await this.prisma.products.update({
      where: {
        productId: +productId,
        UserId: +userId
      },
      data: { title, content, status },
      include: { User: { select: { name: true } } }
    })
    console.log(editProduct)
    return editProduct;
  }

  deleteProduct = async (productId, userId) => {
    const deleteProduct = await this.prisma.products.delete({
      where: {
        productId: +productId,
        UserId: +userId
      },
      include: { User: { select: { name: true } } }
    })

    return deleteProduct;
  }

}