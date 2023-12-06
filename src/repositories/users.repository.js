export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findEmail = async (email) => {
    const existedUser = await this.prisma.users.findUnique({
      where: { email }
    });
    return existedUser;
  };

  findName = async (name) => {
    const findName = await this.prisma.users.findUnique({
      where: { name }
    });
    return findName;
  }

  createUser = async (email, hashedPassword, name) => {
    const createUser = await this.prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })

    return createUser;
  };

}