import { prisma } from '@/lib/prisma';
import type { Context } from './trpc';

export const createContext = async (): Promise<Context> => {
  return {
    prisma,
  };
};
