import { Request } from "express";
import { AuthChecker } from "type-graphql";
import { MyContext } from "../types";
import jwt from "jsonwebtoken";

export const customAuthChecker: AuthChecker<MyContext> = ({ context }) => {
  const token = context.req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, process.env.APP_SECRET);
  } catch (error) {
    return false;
  }

  return true;
};
