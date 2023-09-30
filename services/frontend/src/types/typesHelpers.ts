import {AppRouter} from '@remrob/api';
import type {
  // inferRouterInputs,
  inferRouterOutputs,
} from '@trpc/server';

export type TrpcReturnTypes = inferRouterOutputs<AppRouter>;

export type AsyncReturnType<T extends (..._args: any) => Promise<any>> =
  Awaited<ReturnType<T>>;

/* type ConvertToStringValue<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown> | undefined
    ? ConvertToStringValue<T[K]>
    : string;
}; */

export type ConvertObjectToString<O extends object> = {
  [K in keyof O]: O[K] extends any[]
    ? []
    : O[K] extends Date
    ? string
    : O[K] extends object
    ? ConvertObjectToString<O[K]>
    : string;
};
