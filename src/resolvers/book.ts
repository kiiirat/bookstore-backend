import { Arg, Ctx, Field, ObjectType, Query } from "type-graphql";
import { Book } from "@generated/type-graphql";
import { MyContext } from "../types";

@ObjectType()
class PaginatedBooksResponse {
  @Field(() => [Book])
  list: Book[];

  @Field()
  pages: number;
}

export class CustomBookResolver {
  @Query(() => PaginatedBooksResponse)
  async paginatedBooks(
    @Arg("take") take: number,
    @Arg("page") page: number,
    @Ctx() ctx: MyContext
  ) {
    const aggregateBooks = await ctx.prisma.book.aggregate({
      _count: true,
    });

    const offset = (page - 1) * take;
    const list = await ctx.prisma.book.findMany({
      take,
      skip: offset,
    });

    console.log(offset);

    const pages = Math.ceil(aggregateBooks._count / take);

    return {
      list,
      pages,
    };
  }
}
