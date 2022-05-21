import { User } from "@generated/type-graphql";
import { AuthenticationError, UserInputError } from "apollo-server-core";
import {
  Arg,
  Args,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Context } from "../context";

@InputType()
class UserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
class SigninResponse {
  @Field(() => User, { nullable: true })
  user: User | null;

  @Field()
  token?: string;
}

@Resolver()
export class CustomUserResolver {
  @Mutation(() => SigninResponse, { nullable: true })
  async signin(
    @Arg("data") data: UserInput,
    @Ctx() ctx: Context
  ): Promise<SigninResponse | null> {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new UserInputError("Email incorrect", {
        argumentName: "email",
      });
    }

    const passwordValid = await argon2.verify(
      user.password as any,
      data.password
    );
    if (!passwordValid) {
      throw new AuthenticationError("Password is incorrect", {
        argumentName: "password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.APP_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return {
      user,
      token,
    };
  }
}
