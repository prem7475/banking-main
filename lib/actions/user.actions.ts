'use server';

import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";

import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import Bank from '../models/Bank';
import User from '../models/User';
import connectToDatabase from '../mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ userId });

    if (user) {
      return parseStringify({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        name: user.name,
        dwollaCustomerUrl: user.dwollaCustomerUrl,
        dwollaCustomerId: user.dwollaCustomerId,
        address1: user.address1,
        city: user.city,
        state: user.state,
        postalCode: user.postalCode,
        dateOfBirth: user.dateOfBirth,
        panNumber: user.panNumber,
        password: user.password,
        upiPin: user.upiPin
      });
    }
    return null;
  } catch (error) {
    console.log(error)
  }
}

export const signIn = async ({ email, password }: signInProps) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '7d' });

    cookies().set("auth-token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      name: user.name,
      dwollaCustomerUrl: user.dwollaCustomerUrl,
      dwollaCustomerId: user.dwollaCustomerId,
      address1: user.address1,
      city: user.city,
      state: user.state,
      postalCode: user.postalCode,
      dateOfBirth: user.dateOfBirth,
      panNumber: user.panNumber,
      password: user.password,
      upiPin: user.upiPin
    });
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName, upiPin } = userData;

  try {
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create Dwolla customer (you'll need to implement this)
    const dwollaCustomerUrl = `https://api-sandbox.dwolla.com/customers/${Date.now()}`;
    const dwollaCustomerId = `customer-${Date.now()}`;

    // Create new user
    const newUser = new User({
      userId: `user-${Date.now()}`,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      upiPin,
      dwollaCustomerUrl,
      dwollaCustomerId,
      address1: userData.address1,
      city: userData.city,
      state: userData.state,
      postalCode: userData.postalCode,
      dateOfBirth: userData.dateOfBirth,
      panNumber: userData.panNumber
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser.userId }, JWT_SECRET, { expiresIn: '7d' });

    cookies().set("auth-token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({
      userId: newUser.userId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      name: newUser.name,
      dwollaCustomerUrl: newUser.dwollaCustomerUrl,
      dwollaCustomerId: newUser.dwollaCustomerId,
      address1: newUser.address1,
      city: newUser.city,
      state: newUser.state,
      postalCode: newUser.postalCode,
      dateOfBirth: newUser.dateOfBirth,
      panNumber: newUser.panNumber,
      password: newUser.password,
      upiPin: newUser.upiPin
    });
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

export async function getLoggedInUser() {
  try {
    const token = cookies().get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectToDatabase();

    const user = await User.findOne({ userId: decoded.userId });

    if (user) {
      return parseStringify({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        name: user.name,
        dwollaCustomerUrl: user.dwollaCustomerUrl,
        dwollaCustomerId: user.dwollaCustomerId,
        address1: user.address1,
        city: user.city,
        state: user.state,
        postalCode: user.postalCode,
        dateOfBirth: user.dateOfBirth,
        panNumber: user.panNumber,
        password: user.password,
        upiPin: user.upiPin
      });
    }

    return null;
  } catch (error) {
    console.log(error)
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    cookies().delete('auth-token');
  } catch (error) {
    return null;
  }
}

export const createLinkToken = async (user: any) => {
  try {
    // For demo purposes, return a mock link token
    const mockLinkToken = 'link-sandbox-mock-token-' + Date.now();
    return parseStringify({ linkToken: mockLinkToken });
  } catch (error) {
    console.log(error);
  }
}

export const getUserUpiPin = async (userId: string) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ userId });

    if (user) {
      return user.upiPin;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getUserTpin = async (userId: string) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ userId });

    if (user) {
      return user.tpin;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
  cardType = 'rupay',
  upiPin,
}: createBankAccountProps & { cardType?: string; upiPin: string }) => {
  try {
    await connectToDatabase();

    const newBank = new Bank({
      userId,
      bankId,
      accountId,
      accessToken,
      fundingSourceUrl,
      shareableId,
      cardType,
      upiPin,
    });

    await newBank.save();

    return parseStringify(newBank);
  } catch (error) {
    console.log(error);
  }
}

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // For demo purposes, simulate successful token exchange
    // Create a mock bank account
    await createBankAccount({
      userId: user.userId,
      bankId: 'mock-bank-id-' + Date.now(),
      accountId: 'mock-account-id-' + Date.now(),
      accessToken: 'mock-access-token',
      fundingSourceUrl: 'https://mock-funding-url.com',
      shareableId: 'mock-shareable-id-' + Date.now(),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
}

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    await connectToDatabase();

    const banks = await Bank.find({ userId });

    return parseStringify(banks);
  } catch (error) {
    console.log(error)
  }
}

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    await connectToDatabase();

    const bank = await Bank.findById(documentId);

    return parseStringify(bank);
  } catch (error) {
    console.log(error)
  }
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    await connectToDatabase();

    const bank = await Bank.findOne({ accountId });

    return parseStringify(bank);
  } catch (error) {
    console.log(error)
  }
}
