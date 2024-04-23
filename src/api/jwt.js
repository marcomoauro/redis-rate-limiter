import jwt from 'jsonwebtoken';
import {APIError401} from "../errors.js";

export const createToken = (payload) => jwt.sign(payload ?? {}, process.env.JWT_SECRET);

export const decodeToken = (token, secret) => {
  try {
    jwt.verify(token, secret); // check if token is expired
    return jwt.decode(token); // decode payload
  } catch (error) {
    throw new APIError401();
  }
};