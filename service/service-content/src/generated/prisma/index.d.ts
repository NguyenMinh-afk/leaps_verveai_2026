
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model content_item
 * 
 */
export type content_item = $Result.DefaultSelection<Prisma.$content_itemPayload>
/**
 * Model bundle
 * 
 */
export type bundle = $Result.DefaultSelection<Prisma.$bundlePayload>
/**
 * Model bundle_signature
 * 
 */
export type bundle_signature = $Result.DefaultSelection<Prisma.$bundle_signaturePayload>
/**
 * Model review
 * 
 */
export type review = $Result.DefaultSelection<Prisma.$reviewPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const content_type: {
  ITEM_QUESTION: 'ITEM_QUESTION',
  ITEM_EXPLANATION: 'ITEM_EXPLANATION',
  ITEM_MEDIA: 'ITEM_MEDIA'
};

export type content_type = (typeof content_type)[keyof typeof content_type]


export const content_status: {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type content_status = (typeof content_status)[keyof typeof content_status]


export const bundle_status: {
  BUILDING: 'BUILDING',
  BUILT: 'BUILT',
  SIGNED: 'SIGNED',
  PUBLISHED: 'PUBLISHED'
};

export type bundle_status = (typeof bundle_status)[keyof typeof bundle_status]


export const review_status: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type review_status = (typeof review_status)[keyof typeof review_status]

}

export type content_type = $Enums.content_type

export const content_type: typeof $Enums.content_type

export type content_status = $Enums.content_status

export const content_status: typeof $Enums.content_status

export type bundle_status = $Enums.bundle_status

export const bundle_status: typeof $Enums.bundle_status

export type review_status = $Enums.review_status

export const review_status: typeof $Enums.review_status

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Content_items
 * const content_items = await prisma.content_item.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Content_items
   * const content_items = await prisma.content_item.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.content_item`: Exposes CRUD operations for the **content_item** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Content_items
    * const content_items = await prisma.content_item.findMany()
    * ```
    */
  get content_item(): Prisma.content_itemDelegate<ExtArgs>;

  /**
   * `prisma.bundle`: Exposes CRUD operations for the **bundle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bundles
    * const bundles = await prisma.bundle.findMany()
    * ```
    */
  get bundle(): Prisma.bundleDelegate<ExtArgs>;

  /**
   * `prisma.bundle_signature`: Exposes CRUD operations for the **bundle_signature** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bundle_signatures
    * const bundle_signatures = await prisma.bundle_signature.findMany()
    * ```
    */
  get bundle_signature(): Prisma.bundle_signatureDelegate<ExtArgs>;

  /**
   * `prisma.review`: Exposes CRUD operations for the **review** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reviews
    * const reviews = await prisma.review.findMany()
    * ```
    */
  get review(): Prisma.reviewDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    content_item: 'content_item',
    bundle: 'bundle',
    bundle_signature: 'bundle_signature',
    review: 'review'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "content_item" | "bundle" | "bundle_signature" | "review"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      content_item: {
        payload: Prisma.$content_itemPayload<ExtArgs>
        fields: Prisma.content_itemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.content_itemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$content_itemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.content_itemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$content_itemPayload>
          }
          findFirst: {
            args: Prisma.content_itemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$content_itemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.content_itemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$content_itemPayload>
          }
          findMany: {
            args: Prisma.content_itemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$content_itemPayload>[]
          }
          create: {
            args: Prisma.content_itemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$content_itemPayload>
          }
          createMany: {
            args: Prisma.content_itemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.content_itemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$content_itemPayload>[]
          }
          delete: {
            args: Prisma.content_itemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$content_itemPayload>
          }
          update: {
            args: Prisma.content_itemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$content_itemPayload>
          }
          deleteMany: {
            args: Prisma.content_itemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.content_itemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.content_itemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$content_itemPayload>
          }
          aggregate: {
            args: Prisma.Content_itemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContent_item>
          }
          groupBy: {
            args: Prisma.content_itemGroupByArgs<ExtArgs>
            result: $Utils.Optional<Content_itemGroupByOutputType>[]
          }
          count: {
            args: Prisma.content_itemCountArgs<ExtArgs>
            result: $Utils.Optional<Content_itemCountAggregateOutputType> | number
          }
        }
      }
      bundle: {
        payload: Prisma.$bundlePayload<ExtArgs>
        fields: Prisma.bundleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.bundleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.bundleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundlePayload>
          }
          findFirst: {
            args: Prisma.bundleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.bundleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundlePayload>
          }
          findMany: {
            args: Prisma.bundleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundlePayload>[]
          }
          create: {
            args: Prisma.bundleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundlePayload>
          }
          createMany: {
            args: Prisma.bundleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.bundleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundlePayload>[]
          }
          delete: {
            args: Prisma.bundleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundlePayload>
          }
          update: {
            args: Prisma.bundleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundlePayload>
          }
          deleteMany: {
            args: Prisma.bundleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.bundleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.bundleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundlePayload>
          }
          aggregate: {
            args: Prisma.BundleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBundle>
          }
          groupBy: {
            args: Prisma.bundleGroupByArgs<ExtArgs>
            result: $Utils.Optional<BundleGroupByOutputType>[]
          }
          count: {
            args: Prisma.bundleCountArgs<ExtArgs>
            result: $Utils.Optional<BundleCountAggregateOutputType> | number
          }
        }
      }
      bundle_signature: {
        payload: Prisma.$bundle_signaturePayload<ExtArgs>
        fields: Prisma.bundle_signatureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.bundle_signatureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundle_signaturePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.bundle_signatureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundle_signaturePayload>
          }
          findFirst: {
            args: Prisma.bundle_signatureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundle_signaturePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.bundle_signatureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundle_signaturePayload>
          }
          findMany: {
            args: Prisma.bundle_signatureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundle_signaturePayload>[]
          }
          create: {
            args: Prisma.bundle_signatureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundle_signaturePayload>
          }
          createMany: {
            args: Prisma.bundle_signatureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.bundle_signatureCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundle_signaturePayload>[]
          }
          delete: {
            args: Prisma.bundle_signatureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundle_signaturePayload>
          }
          update: {
            args: Prisma.bundle_signatureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundle_signaturePayload>
          }
          deleteMany: {
            args: Prisma.bundle_signatureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.bundle_signatureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.bundle_signatureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bundle_signaturePayload>
          }
          aggregate: {
            args: Prisma.Bundle_signatureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBundle_signature>
          }
          groupBy: {
            args: Prisma.bundle_signatureGroupByArgs<ExtArgs>
            result: $Utils.Optional<Bundle_signatureGroupByOutputType>[]
          }
          count: {
            args: Prisma.bundle_signatureCountArgs<ExtArgs>
            result: $Utils.Optional<Bundle_signatureCountAggregateOutputType> | number
          }
        }
      }
      review: {
        payload: Prisma.$reviewPayload<ExtArgs>
        fields: Prisma.reviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.reviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.reviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reviewPayload>
          }
          findFirst: {
            args: Prisma.reviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.reviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reviewPayload>
          }
          findMany: {
            args: Prisma.reviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reviewPayload>[]
          }
          create: {
            args: Prisma.reviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reviewPayload>
          }
          createMany: {
            args: Prisma.reviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.reviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reviewPayload>[]
          }
          delete: {
            args: Prisma.reviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reviewPayload>
          }
          update: {
            args: Prisma.reviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reviewPayload>
          }
          deleteMany: {
            args: Prisma.reviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.reviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.reviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reviewPayload>
          }
          aggregate: {
            args: Prisma.ReviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReview>
          }
          groupBy: {
            args: Prisma.reviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.reviewCountArgs<ExtArgs>
            result: $Utils.Optional<ReviewCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type Content_itemCountOutputType
   */

  export type Content_itemCountOutputType = {
    reviews: number
  }

  export type Content_itemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviews?: boolean | Content_itemCountOutputTypeCountReviewsArgs
  }

  // Custom InputTypes
  /**
   * Content_itemCountOutputType without action
   */
  export type Content_itemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Content_itemCountOutputType
     */
    select?: Content_itemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Content_itemCountOutputType without action
   */
  export type Content_itemCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reviewWhereInput
  }


  /**
   * Count Type BundleCountOutputType
   */

  export type BundleCountOutputType = {
    signatures: number
  }

  export type BundleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    signatures?: boolean | BundleCountOutputTypeCountSignaturesArgs
  }

  // Custom InputTypes
  /**
   * BundleCountOutputType without action
   */
  export type BundleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BundleCountOutputType
     */
    select?: BundleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BundleCountOutputType without action
   */
  export type BundleCountOutputTypeCountSignaturesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bundle_signatureWhereInput
  }


  /**
   * Models
   */

  /**
   * Model content_item
   */

  export type AggregateContent_item = {
    _count: Content_itemCountAggregateOutputType | null
    _avg: Content_itemAvgAggregateOutputType | null
    _sum: Content_itemSumAggregateOutputType | null
    _min: Content_itemMinAggregateOutputType | null
    _max: Content_itemMaxAggregateOutputType | null
  }

  export type Content_itemAvgAggregateOutputType = {
    difficulty: number | null
  }

  export type Content_itemSumAggregateOutputType = {
    difficulty: number | null
  }

  export type Content_itemMinAggregateOutputType = {
    id: string | null
    type: $Enums.content_type | null
    title: string | null
    body: string | null
    difficulty: number | null
    status: $Enums.content_status | null
    author_id: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type Content_itemMaxAggregateOutputType = {
    id: string | null
    type: $Enums.content_type | null
    title: string | null
    body: string | null
    difficulty: number | null
    status: $Enums.content_status | null
    author_id: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type Content_itemCountAggregateOutputType = {
    id: number
    type: number
    title: number
    body: number
    difficulty: number
    status: number
    author_id: number
    created_at: number
    updated_at: number
    deleted_at: number
    _all: number
  }


  export type Content_itemAvgAggregateInputType = {
    difficulty?: true
  }

  export type Content_itemSumAggregateInputType = {
    difficulty?: true
  }

  export type Content_itemMinAggregateInputType = {
    id?: true
    type?: true
    title?: true
    body?: true
    difficulty?: true
    status?: true
    author_id?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type Content_itemMaxAggregateInputType = {
    id?: true
    type?: true
    title?: true
    body?: true
    difficulty?: true
    status?: true
    author_id?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type Content_itemCountAggregateInputType = {
    id?: true
    type?: true
    title?: true
    body?: true
    difficulty?: true
    status?: true
    author_id?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    _all?: true
  }

  export type Content_itemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which content_item to aggregate.
     */
    where?: content_itemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of content_items to fetch.
     */
    orderBy?: content_itemOrderByWithRelationInput | content_itemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: content_itemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` content_items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` content_items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned content_items
    **/
    _count?: true | Content_itemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Content_itemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Content_itemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Content_itemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Content_itemMaxAggregateInputType
  }

  export type GetContent_itemAggregateType<T extends Content_itemAggregateArgs> = {
        [P in keyof T & keyof AggregateContent_item]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContent_item[P]>
      : GetScalarType<T[P], AggregateContent_item[P]>
  }




  export type content_itemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: content_itemWhereInput
    orderBy?: content_itemOrderByWithAggregationInput | content_itemOrderByWithAggregationInput[]
    by: Content_itemScalarFieldEnum[] | Content_itemScalarFieldEnum
    having?: content_itemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Content_itemCountAggregateInputType | true
    _avg?: Content_itemAvgAggregateInputType
    _sum?: Content_itemSumAggregateInputType
    _min?: Content_itemMinAggregateInputType
    _max?: Content_itemMaxAggregateInputType
  }

  export type Content_itemGroupByOutputType = {
    id: string
    type: $Enums.content_type
    title: string
    body: string
    difficulty: number
    status: $Enums.content_status
    author_id: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
    _count: Content_itemCountAggregateOutputType | null
    _avg: Content_itemAvgAggregateOutputType | null
    _sum: Content_itemSumAggregateOutputType | null
    _min: Content_itemMinAggregateOutputType | null
    _max: Content_itemMaxAggregateOutputType | null
  }

  type GetContent_itemGroupByPayload<T extends content_itemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Content_itemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Content_itemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Content_itemGroupByOutputType[P]>
            : GetScalarType<T[P], Content_itemGroupByOutputType[P]>
        }
      >
    >


  export type content_itemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    difficulty?: boolean
    status?: boolean
    author_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    reviews?: boolean | content_item$reviewsArgs<ExtArgs>
    _count?: boolean | Content_itemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["content_item"]>

  export type content_itemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    difficulty?: boolean
    status?: boolean
    author_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }, ExtArgs["result"]["content_item"]>

  export type content_itemSelectScalar = {
    id?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    difficulty?: boolean
    status?: boolean
    author_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }

  export type content_itemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviews?: boolean | content_item$reviewsArgs<ExtArgs>
    _count?: boolean | Content_itemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type content_itemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $content_itemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "content_item"
    objects: {
      reviews: Prisma.$reviewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: $Enums.content_type
      title: string
      body: string
      difficulty: number
      status: $Enums.content_status
      author_id: string
      created_at: Date
      updated_at: Date
      deleted_at: Date | null
    }, ExtArgs["result"]["content_item"]>
    composites: {}
  }

  type content_itemGetPayload<S extends boolean | null | undefined | content_itemDefaultArgs> = $Result.GetResult<Prisma.$content_itemPayload, S>

  type content_itemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<content_itemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Content_itemCountAggregateInputType | true
    }

  export interface content_itemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['content_item'], meta: { name: 'content_item' } }
    /**
     * Find zero or one Content_item that matches the filter.
     * @param {content_itemFindUniqueArgs} args - Arguments to find a Content_item
     * @example
     * // Get one Content_item
     * const content_item = await prisma.content_item.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends content_itemFindUniqueArgs>(args: SelectSubset<T, content_itemFindUniqueArgs<ExtArgs>>): Prisma__content_itemClient<$Result.GetResult<Prisma.$content_itemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Content_item that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {content_itemFindUniqueOrThrowArgs} args - Arguments to find a Content_item
     * @example
     * // Get one Content_item
     * const content_item = await prisma.content_item.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends content_itemFindUniqueOrThrowArgs>(args: SelectSubset<T, content_itemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__content_itemClient<$Result.GetResult<Prisma.$content_itemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Content_item that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {content_itemFindFirstArgs} args - Arguments to find a Content_item
     * @example
     * // Get one Content_item
     * const content_item = await prisma.content_item.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends content_itemFindFirstArgs>(args?: SelectSubset<T, content_itemFindFirstArgs<ExtArgs>>): Prisma__content_itemClient<$Result.GetResult<Prisma.$content_itemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Content_item that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {content_itemFindFirstOrThrowArgs} args - Arguments to find a Content_item
     * @example
     * // Get one Content_item
     * const content_item = await prisma.content_item.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends content_itemFindFirstOrThrowArgs>(args?: SelectSubset<T, content_itemFindFirstOrThrowArgs<ExtArgs>>): Prisma__content_itemClient<$Result.GetResult<Prisma.$content_itemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Content_items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {content_itemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Content_items
     * const content_items = await prisma.content_item.findMany()
     * 
     * // Get first 10 Content_items
     * const content_items = await prisma.content_item.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const content_itemWithIdOnly = await prisma.content_item.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends content_itemFindManyArgs>(args?: SelectSubset<T, content_itemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$content_itemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Content_item.
     * @param {content_itemCreateArgs} args - Arguments to create a Content_item.
     * @example
     * // Create one Content_item
     * const Content_item = await prisma.content_item.create({
     *   data: {
     *     // ... data to create a Content_item
     *   }
     * })
     * 
     */
    create<T extends content_itemCreateArgs>(args: SelectSubset<T, content_itemCreateArgs<ExtArgs>>): Prisma__content_itemClient<$Result.GetResult<Prisma.$content_itemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Content_items.
     * @param {content_itemCreateManyArgs} args - Arguments to create many Content_items.
     * @example
     * // Create many Content_items
     * const content_item = await prisma.content_item.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends content_itemCreateManyArgs>(args?: SelectSubset<T, content_itemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Content_items and returns the data saved in the database.
     * @param {content_itemCreateManyAndReturnArgs} args - Arguments to create many Content_items.
     * @example
     * // Create many Content_items
     * const content_item = await prisma.content_item.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Content_items and only return the `id`
     * const content_itemWithIdOnly = await prisma.content_item.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends content_itemCreateManyAndReturnArgs>(args?: SelectSubset<T, content_itemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$content_itemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Content_item.
     * @param {content_itemDeleteArgs} args - Arguments to delete one Content_item.
     * @example
     * // Delete one Content_item
     * const Content_item = await prisma.content_item.delete({
     *   where: {
     *     // ... filter to delete one Content_item
     *   }
     * })
     * 
     */
    delete<T extends content_itemDeleteArgs>(args: SelectSubset<T, content_itemDeleteArgs<ExtArgs>>): Prisma__content_itemClient<$Result.GetResult<Prisma.$content_itemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Content_item.
     * @param {content_itemUpdateArgs} args - Arguments to update one Content_item.
     * @example
     * // Update one Content_item
     * const content_item = await prisma.content_item.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends content_itemUpdateArgs>(args: SelectSubset<T, content_itemUpdateArgs<ExtArgs>>): Prisma__content_itemClient<$Result.GetResult<Prisma.$content_itemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Content_items.
     * @param {content_itemDeleteManyArgs} args - Arguments to filter Content_items to delete.
     * @example
     * // Delete a few Content_items
     * const { count } = await prisma.content_item.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends content_itemDeleteManyArgs>(args?: SelectSubset<T, content_itemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Content_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {content_itemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Content_items
     * const content_item = await prisma.content_item.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends content_itemUpdateManyArgs>(args: SelectSubset<T, content_itemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Content_item.
     * @param {content_itemUpsertArgs} args - Arguments to update or create a Content_item.
     * @example
     * // Update or create a Content_item
     * const content_item = await prisma.content_item.upsert({
     *   create: {
     *     // ... data to create a Content_item
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Content_item we want to update
     *   }
     * })
     */
    upsert<T extends content_itemUpsertArgs>(args: SelectSubset<T, content_itemUpsertArgs<ExtArgs>>): Prisma__content_itemClient<$Result.GetResult<Prisma.$content_itemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Content_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {content_itemCountArgs} args - Arguments to filter Content_items to count.
     * @example
     * // Count the number of Content_items
     * const count = await prisma.content_item.count({
     *   where: {
     *     // ... the filter for the Content_items we want to count
     *   }
     * })
    **/
    count<T extends content_itemCountArgs>(
      args?: Subset<T, content_itemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Content_itemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Content_item.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Content_itemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Content_itemAggregateArgs>(args: Subset<T, Content_itemAggregateArgs>): Prisma.PrismaPromise<GetContent_itemAggregateType<T>>

    /**
     * Group by Content_item.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {content_itemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends content_itemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: content_itemGroupByArgs['orderBy'] }
        : { orderBy?: content_itemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, content_itemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContent_itemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the content_item model
   */
  readonly fields: content_itemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for content_item.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__content_itemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reviews<T extends content_item$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, content_item$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reviewPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the content_item model
   */ 
  interface content_itemFieldRefs {
    readonly id: FieldRef<"content_item", 'String'>
    readonly type: FieldRef<"content_item", 'content_type'>
    readonly title: FieldRef<"content_item", 'String'>
    readonly body: FieldRef<"content_item", 'String'>
    readonly difficulty: FieldRef<"content_item", 'Int'>
    readonly status: FieldRef<"content_item", 'content_status'>
    readonly author_id: FieldRef<"content_item", 'String'>
    readonly created_at: FieldRef<"content_item", 'DateTime'>
    readonly updated_at: FieldRef<"content_item", 'DateTime'>
    readonly deleted_at: FieldRef<"content_item", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * content_item findUnique
   */
  export type content_itemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the content_item
     */
    select?: content_itemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: content_itemInclude<ExtArgs> | null
    /**
     * Filter, which content_item to fetch.
     */
    where: content_itemWhereUniqueInput
  }

  /**
   * content_item findUniqueOrThrow
   */
  export type content_itemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the content_item
     */
    select?: content_itemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: content_itemInclude<ExtArgs> | null
    /**
     * Filter, which content_item to fetch.
     */
    where: content_itemWhereUniqueInput
  }

  /**
   * content_item findFirst
   */
  export type content_itemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the content_item
     */
    select?: content_itemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: content_itemInclude<ExtArgs> | null
    /**
     * Filter, which content_item to fetch.
     */
    where?: content_itemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of content_items to fetch.
     */
    orderBy?: content_itemOrderByWithRelationInput | content_itemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for content_items.
     */
    cursor?: content_itemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` content_items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` content_items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of content_items.
     */
    distinct?: Content_itemScalarFieldEnum | Content_itemScalarFieldEnum[]
  }

  /**
   * content_item findFirstOrThrow
   */
  export type content_itemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the content_item
     */
    select?: content_itemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: content_itemInclude<ExtArgs> | null
    /**
     * Filter, which content_item to fetch.
     */
    where?: content_itemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of content_items to fetch.
     */
    orderBy?: content_itemOrderByWithRelationInput | content_itemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for content_items.
     */
    cursor?: content_itemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` content_items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` content_items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of content_items.
     */
    distinct?: Content_itemScalarFieldEnum | Content_itemScalarFieldEnum[]
  }

  /**
   * content_item findMany
   */
  export type content_itemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the content_item
     */
    select?: content_itemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: content_itemInclude<ExtArgs> | null
    /**
     * Filter, which content_items to fetch.
     */
    where?: content_itemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of content_items to fetch.
     */
    orderBy?: content_itemOrderByWithRelationInput | content_itemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing content_items.
     */
    cursor?: content_itemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` content_items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` content_items.
     */
    skip?: number
    distinct?: Content_itemScalarFieldEnum | Content_itemScalarFieldEnum[]
  }

  /**
   * content_item create
   */
  export type content_itemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the content_item
     */
    select?: content_itemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: content_itemInclude<ExtArgs> | null
    /**
     * The data needed to create a content_item.
     */
    data: XOR<content_itemCreateInput, content_itemUncheckedCreateInput>
  }

  /**
   * content_item createMany
   */
  export type content_itemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many content_items.
     */
    data: content_itemCreateManyInput | content_itemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * content_item createManyAndReturn
   */
  export type content_itemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the content_item
     */
    select?: content_itemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many content_items.
     */
    data: content_itemCreateManyInput | content_itemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * content_item update
   */
  export type content_itemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the content_item
     */
    select?: content_itemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: content_itemInclude<ExtArgs> | null
    /**
     * The data needed to update a content_item.
     */
    data: XOR<content_itemUpdateInput, content_itemUncheckedUpdateInput>
    /**
     * Choose, which content_item to update.
     */
    where: content_itemWhereUniqueInput
  }

  /**
   * content_item updateMany
   */
  export type content_itemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update content_items.
     */
    data: XOR<content_itemUpdateManyMutationInput, content_itemUncheckedUpdateManyInput>
    /**
     * Filter which content_items to update
     */
    where?: content_itemWhereInput
  }

  /**
   * content_item upsert
   */
  export type content_itemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the content_item
     */
    select?: content_itemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: content_itemInclude<ExtArgs> | null
    /**
     * The filter to search for the content_item to update in case it exists.
     */
    where: content_itemWhereUniqueInput
    /**
     * In case the content_item found by the `where` argument doesn't exist, create a new content_item with this data.
     */
    create: XOR<content_itemCreateInput, content_itemUncheckedCreateInput>
    /**
     * In case the content_item was found with the provided `where` argument, update it with this data.
     */
    update: XOR<content_itemUpdateInput, content_itemUncheckedUpdateInput>
  }

  /**
   * content_item delete
   */
  export type content_itemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the content_item
     */
    select?: content_itemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: content_itemInclude<ExtArgs> | null
    /**
     * Filter which content_item to delete.
     */
    where: content_itemWhereUniqueInput
  }

  /**
   * content_item deleteMany
   */
  export type content_itemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which content_items to delete
     */
    where?: content_itemWhereInput
  }

  /**
   * content_item.reviews
   */
  export type content_item$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the review
     */
    select?: reviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reviewInclude<ExtArgs> | null
    where?: reviewWhereInput
    orderBy?: reviewOrderByWithRelationInput | reviewOrderByWithRelationInput[]
    cursor?: reviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * content_item without action
   */
  export type content_itemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the content_item
     */
    select?: content_itemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: content_itemInclude<ExtArgs> | null
  }


  /**
   * Model bundle
   */

  export type AggregateBundle = {
    _count: BundleCountAggregateOutputType | null
    _min: BundleMinAggregateOutputType | null
    _max: BundleMaxAggregateOutputType | null
  }

  export type BundleMinAggregateOutputType = {
    id: string | null
    name: string | null
    version: string | null
    status: $Enums.bundle_status | null
    created_at: Date | null
    published_at: Date | null
  }

  export type BundleMaxAggregateOutputType = {
    id: string | null
    name: string | null
    version: string | null
    status: $Enums.bundle_status | null
    created_at: Date | null
    published_at: Date | null
  }

  export type BundleCountAggregateOutputType = {
    id: number
    name: number
    version: number
    status: number
    content_ids: number
    created_at: number
    published_at: number
    _all: number
  }


  export type BundleMinAggregateInputType = {
    id?: true
    name?: true
    version?: true
    status?: true
    created_at?: true
    published_at?: true
  }

  export type BundleMaxAggregateInputType = {
    id?: true
    name?: true
    version?: true
    status?: true
    created_at?: true
    published_at?: true
  }

  export type BundleCountAggregateInputType = {
    id?: true
    name?: true
    version?: true
    status?: true
    content_ids?: true
    created_at?: true
    published_at?: true
    _all?: true
  }

  export type BundleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which bundle to aggregate.
     */
    where?: bundleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bundles to fetch.
     */
    orderBy?: bundleOrderByWithRelationInput | bundleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: bundleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bundles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bundles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned bundles
    **/
    _count?: true | BundleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BundleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BundleMaxAggregateInputType
  }

  export type GetBundleAggregateType<T extends BundleAggregateArgs> = {
        [P in keyof T & keyof AggregateBundle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBundle[P]>
      : GetScalarType<T[P], AggregateBundle[P]>
  }




  export type bundleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bundleWhereInput
    orderBy?: bundleOrderByWithAggregationInput | bundleOrderByWithAggregationInput[]
    by: BundleScalarFieldEnum[] | BundleScalarFieldEnum
    having?: bundleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BundleCountAggregateInputType | true
    _min?: BundleMinAggregateInputType
    _max?: BundleMaxAggregateInputType
  }

  export type BundleGroupByOutputType = {
    id: string
    name: string
    version: string
    status: $Enums.bundle_status
    content_ids: string[]
    created_at: Date
    published_at: Date | null
    _count: BundleCountAggregateOutputType | null
    _min: BundleMinAggregateOutputType | null
    _max: BundleMaxAggregateOutputType | null
  }

  type GetBundleGroupByPayload<T extends bundleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BundleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BundleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BundleGroupByOutputType[P]>
            : GetScalarType<T[P], BundleGroupByOutputType[P]>
        }
      >
    >


  export type bundleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    version?: boolean
    status?: boolean
    content_ids?: boolean
    created_at?: boolean
    published_at?: boolean
    signatures?: boolean | bundle$signaturesArgs<ExtArgs>
    _count?: boolean | BundleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bundle"]>

  export type bundleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    version?: boolean
    status?: boolean
    content_ids?: boolean
    created_at?: boolean
    published_at?: boolean
  }, ExtArgs["result"]["bundle"]>

  export type bundleSelectScalar = {
    id?: boolean
    name?: boolean
    version?: boolean
    status?: boolean
    content_ids?: boolean
    created_at?: boolean
    published_at?: boolean
  }

  export type bundleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    signatures?: boolean | bundle$signaturesArgs<ExtArgs>
    _count?: boolean | BundleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type bundleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $bundlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "bundle"
    objects: {
      signatures: Prisma.$bundle_signaturePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      version: string
      status: $Enums.bundle_status
      content_ids: string[]
      created_at: Date
      published_at: Date | null
    }, ExtArgs["result"]["bundle"]>
    composites: {}
  }

  type bundleGetPayload<S extends boolean | null | undefined | bundleDefaultArgs> = $Result.GetResult<Prisma.$bundlePayload, S>

  type bundleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<bundleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BundleCountAggregateInputType | true
    }

  export interface bundleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['bundle'], meta: { name: 'bundle' } }
    /**
     * Find zero or one Bundle that matches the filter.
     * @param {bundleFindUniqueArgs} args - Arguments to find a Bundle
     * @example
     * // Get one Bundle
     * const bundle = await prisma.bundle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends bundleFindUniqueArgs>(args: SelectSubset<T, bundleFindUniqueArgs<ExtArgs>>): Prisma__bundleClient<$Result.GetResult<Prisma.$bundlePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Bundle that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {bundleFindUniqueOrThrowArgs} args - Arguments to find a Bundle
     * @example
     * // Get one Bundle
     * const bundle = await prisma.bundle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends bundleFindUniqueOrThrowArgs>(args: SelectSubset<T, bundleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__bundleClient<$Result.GetResult<Prisma.$bundlePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Bundle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bundleFindFirstArgs} args - Arguments to find a Bundle
     * @example
     * // Get one Bundle
     * const bundle = await prisma.bundle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends bundleFindFirstArgs>(args?: SelectSubset<T, bundleFindFirstArgs<ExtArgs>>): Prisma__bundleClient<$Result.GetResult<Prisma.$bundlePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Bundle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bundleFindFirstOrThrowArgs} args - Arguments to find a Bundle
     * @example
     * // Get one Bundle
     * const bundle = await prisma.bundle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends bundleFindFirstOrThrowArgs>(args?: SelectSubset<T, bundleFindFirstOrThrowArgs<ExtArgs>>): Prisma__bundleClient<$Result.GetResult<Prisma.$bundlePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Bundles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bundleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bundles
     * const bundles = await prisma.bundle.findMany()
     * 
     * // Get first 10 Bundles
     * const bundles = await prisma.bundle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bundleWithIdOnly = await prisma.bundle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends bundleFindManyArgs>(args?: SelectSubset<T, bundleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bundlePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Bundle.
     * @param {bundleCreateArgs} args - Arguments to create a Bundle.
     * @example
     * // Create one Bundle
     * const Bundle = await prisma.bundle.create({
     *   data: {
     *     // ... data to create a Bundle
     *   }
     * })
     * 
     */
    create<T extends bundleCreateArgs>(args: SelectSubset<T, bundleCreateArgs<ExtArgs>>): Prisma__bundleClient<$Result.GetResult<Prisma.$bundlePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Bundles.
     * @param {bundleCreateManyArgs} args - Arguments to create many Bundles.
     * @example
     * // Create many Bundles
     * const bundle = await prisma.bundle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends bundleCreateManyArgs>(args?: SelectSubset<T, bundleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bundles and returns the data saved in the database.
     * @param {bundleCreateManyAndReturnArgs} args - Arguments to create many Bundles.
     * @example
     * // Create many Bundles
     * const bundle = await prisma.bundle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bundles and only return the `id`
     * const bundleWithIdOnly = await prisma.bundle.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends bundleCreateManyAndReturnArgs>(args?: SelectSubset<T, bundleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bundlePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Bundle.
     * @param {bundleDeleteArgs} args - Arguments to delete one Bundle.
     * @example
     * // Delete one Bundle
     * const Bundle = await prisma.bundle.delete({
     *   where: {
     *     // ... filter to delete one Bundle
     *   }
     * })
     * 
     */
    delete<T extends bundleDeleteArgs>(args: SelectSubset<T, bundleDeleteArgs<ExtArgs>>): Prisma__bundleClient<$Result.GetResult<Prisma.$bundlePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Bundle.
     * @param {bundleUpdateArgs} args - Arguments to update one Bundle.
     * @example
     * // Update one Bundle
     * const bundle = await prisma.bundle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends bundleUpdateArgs>(args: SelectSubset<T, bundleUpdateArgs<ExtArgs>>): Prisma__bundleClient<$Result.GetResult<Prisma.$bundlePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Bundles.
     * @param {bundleDeleteManyArgs} args - Arguments to filter Bundles to delete.
     * @example
     * // Delete a few Bundles
     * const { count } = await prisma.bundle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends bundleDeleteManyArgs>(args?: SelectSubset<T, bundleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bundles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bundleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bundles
     * const bundle = await prisma.bundle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends bundleUpdateManyArgs>(args: SelectSubset<T, bundleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Bundle.
     * @param {bundleUpsertArgs} args - Arguments to update or create a Bundle.
     * @example
     * // Update or create a Bundle
     * const bundle = await prisma.bundle.upsert({
     *   create: {
     *     // ... data to create a Bundle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bundle we want to update
     *   }
     * })
     */
    upsert<T extends bundleUpsertArgs>(args: SelectSubset<T, bundleUpsertArgs<ExtArgs>>): Prisma__bundleClient<$Result.GetResult<Prisma.$bundlePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Bundles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bundleCountArgs} args - Arguments to filter Bundles to count.
     * @example
     * // Count the number of Bundles
     * const count = await prisma.bundle.count({
     *   where: {
     *     // ... the filter for the Bundles we want to count
     *   }
     * })
    **/
    count<T extends bundleCountArgs>(
      args?: Subset<T, bundleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BundleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bundle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BundleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BundleAggregateArgs>(args: Subset<T, BundleAggregateArgs>): Prisma.PrismaPromise<GetBundleAggregateType<T>>

    /**
     * Group by Bundle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bundleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends bundleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: bundleGroupByArgs['orderBy'] }
        : { orderBy?: bundleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, bundleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBundleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the bundle model
   */
  readonly fields: bundleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for bundle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__bundleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    signatures<T extends bundle$signaturesArgs<ExtArgs> = {}>(args?: Subset<T, bundle$signaturesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bundle_signaturePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the bundle model
   */ 
  interface bundleFieldRefs {
    readonly id: FieldRef<"bundle", 'String'>
    readonly name: FieldRef<"bundle", 'String'>
    readonly version: FieldRef<"bundle", 'String'>
    readonly status: FieldRef<"bundle", 'bundle_status'>
    readonly content_ids: FieldRef<"bundle", 'String[]'>
    readonly created_at: FieldRef<"bundle", 'DateTime'>
    readonly published_at: FieldRef<"bundle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * bundle findUnique
   */
  export type bundleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle
     */
    select?: bundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundleInclude<ExtArgs> | null
    /**
     * Filter, which bundle to fetch.
     */
    where: bundleWhereUniqueInput
  }

  /**
   * bundle findUniqueOrThrow
   */
  export type bundleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle
     */
    select?: bundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundleInclude<ExtArgs> | null
    /**
     * Filter, which bundle to fetch.
     */
    where: bundleWhereUniqueInput
  }

  /**
   * bundle findFirst
   */
  export type bundleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle
     */
    select?: bundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundleInclude<ExtArgs> | null
    /**
     * Filter, which bundle to fetch.
     */
    where?: bundleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bundles to fetch.
     */
    orderBy?: bundleOrderByWithRelationInput | bundleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for bundles.
     */
    cursor?: bundleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bundles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bundles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of bundles.
     */
    distinct?: BundleScalarFieldEnum | BundleScalarFieldEnum[]
  }

  /**
   * bundle findFirstOrThrow
   */
  export type bundleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle
     */
    select?: bundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundleInclude<ExtArgs> | null
    /**
     * Filter, which bundle to fetch.
     */
    where?: bundleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bundles to fetch.
     */
    orderBy?: bundleOrderByWithRelationInput | bundleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for bundles.
     */
    cursor?: bundleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bundles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bundles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of bundles.
     */
    distinct?: BundleScalarFieldEnum | BundleScalarFieldEnum[]
  }

  /**
   * bundle findMany
   */
  export type bundleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle
     */
    select?: bundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundleInclude<ExtArgs> | null
    /**
     * Filter, which bundles to fetch.
     */
    where?: bundleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bundles to fetch.
     */
    orderBy?: bundleOrderByWithRelationInput | bundleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing bundles.
     */
    cursor?: bundleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bundles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bundles.
     */
    skip?: number
    distinct?: BundleScalarFieldEnum | BundleScalarFieldEnum[]
  }

  /**
   * bundle create
   */
  export type bundleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle
     */
    select?: bundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundleInclude<ExtArgs> | null
    /**
     * The data needed to create a bundle.
     */
    data: XOR<bundleCreateInput, bundleUncheckedCreateInput>
  }

  /**
   * bundle createMany
   */
  export type bundleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many bundles.
     */
    data: bundleCreateManyInput | bundleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * bundle createManyAndReturn
   */
  export type bundleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle
     */
    select?: bundleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many bundles.
     */
    data: bundleCreateManyInput | bundleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * bundle update
   */
  export type bundleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle
     */
    select?: bundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundleInclude<ExtArgs> | null
    /**
     * The data needed to update a bundle.
     */
    data: XOR<bundleUpdateInput, bundleUncheckedUpdateInput>
    /**
     * Choose, which bundle to update.
     */
    where: bundleWhereUniqueInput
  }

  /**
   * bundle updateMany
   */
  export type bundleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update bundles.
     */
    data: XOR<bundleUpdateManyMutationInput, bundleUncheckedUpdateManyInput>
    /**
     * Filter which bundles to update
     */
    where?: bundleWhereInput
  }

  /**
   * bundle upsert
   */
  export type bundleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle
     */
    select?: bundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundleInclude<ExtArgs> | null
    /**
     * The filter to search for the bundle to update in case it exists.
     */
    where: bundleWhereUniqueInput
    /**
     * In case the bundle found by the `where` argument doesn't exist, create a new bundle with this data.
     */
    create: XOR<bundleCreateInput, bundleUncheckedCreateInput>
    /**
     * In case the bundle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<bundleUpdateInput, bundleUncheckedUpdateInput>
  }

  /**
   * bundle delete
   */
  export type bundleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle
     */
    select?: bundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundleInclude<ExtArgs> | null
    /**
     * Filter which bundle to delete.
     */
    where: bundleWhereUniqueInput
  }

  /**
   * bundle deleteMany
   */
  export type bundleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which bundles to delete
     */
    where?: bundleWhereInput
  }

  /**
   * bundle.signatures
   */
  export type bundle$signaturesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle_signature
     */
    select?: bundle_signatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundle_signatureInclude<ExtArgs> | null
    where?: bundle_signatureWhereInput
    orderBy?: bundle_signatureOrderByWithRelationInput | bundle_signatureOrderByWithRelationInput[]
    cursor?: bundle_signatureWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Bundle_signatureScalarFieldEnum | Bundle_signatureScalarFieldEnum[]
  }

  /**
   * bundle without action
   */
  export type bundleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle
     */
    select?: bundleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundleInclude<ExtArgs> | null
  }


  /**
   * Model bundle_signature
   */

  export type AggregateBundle_signature = {
    _count: Bundle_signatureCountAggregateOutputType | null
    _min: Bundle_signatureMinAggregateOutputType | null
    _max: Bundle_signatureMaxAggregateOutputType | null
  }

  export type Bundle_signatureMinAggregateOutputType = {
    id: string | null
    bundle_id: string | null
    public_key_fingerprint: string | null
    signature: string | null
    signed_at: Date | null
  }

  export type Bundle_signatureMaxAggregateOutputType = {
    id: string | null
    bundle_id: string | null
    public_key_fingerprint: string | null
    signature: string | null
    signed_at: Date | null
  }

  export type Bundle_signatureCountAggregateOutputType = {
    id: number
    bundle_id: number
    public_key_fingerprint: number
    signature: number
    signed_at: number
    _all: number
  }


  export type Bundle_signatureMinAggregateInputType = {
    id?: true
    bundle_id?: true
    public_key_fingerprint?: true
    signature?: true
    signed_at?: true
  }

  export type Bundle_signatureMaxAggregateInputType = {
    id?: true
    bundle_id?: true
    public_key_fingerprint?: true
    signature?: true
    signed_at?: true
  }

  export type Bundle_signatureCountAggregateInputType = {
    id?: true
    bundle_id?: true
    public_key_fingerprint?: true
    signature?: true
    signed_at?: true
    _all?: true
  }

  export type Bundle_signatureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which bundle_signature to aggregate.
     */
    where?: bundle_signatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bundle_signatures to fetch.
     */
    orderBy?: bundle_signatureOrderByWithRelationInput | bundle_signatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: bundle_signatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bundle_signatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bundle_signatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned bundle_signatures
    **/
    _count?: true | Bundle_signatureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Bundle_signatureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Bundle_signatureMaxAggregateInputType
  }

  export type GetBundle_signatureAggregateType<T extends Bundle_signatureAggregateArgs> = {
        [P in keyof T & keyof AggregateBundle_signature]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBundle_signature[P]>
      : GetScalarType<T[P], AggregateBundle_signature[P]>
  }




  export type bundle_signatureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bundle_signatureWhereInput
    orderBy?: bundle_signatureOrderByWithAggregationInput | bundle_signatureOrderByWithAggregationInput[]
    by: Bundle_signatureScalarFieldEnum[] | Bundle_signatureScalarFieldEnum
    having?: bundle_signatureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Bundle_signatureCountAggregateInputType | true
    _min?: Bundle_signatureMinAggregateInputType
    _max?: Bundle_signatureMaxAggregateInputType
  }

  export type Bundle_signatureGroupByOutputType = {
    id: string
    bundle_id: string
    public_key_fingerprint: string
    signature: string
    signed_at: Date
    _count: Bundle_signatureCountAggregateOutputType | null
    _min: Bundle_signatureMinAggregateOutputType | null
    _max: Bundle_signatureMaxAggregateOutputType | null
  }

  type GetBundle_signatureGroupByPayload<T extends bundle_signatureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Bundle_signatureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Bundle_signatureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Bundle_signatureGroupByOutputType[P]>
            : GetScalarType<T[P], Bundle_signatureGroupByOutputType[P]>
        }
      >
    >


  export type bundle_signatureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bundle_id?: boolean
    public_key_fingerprint?: boolean
    signature?: boolean
    signed_at?: boolean
    bundle?: boolean | bundleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bundle_signature"]>

  export type bundle_signatureSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bundle_id?: boolean
    public_key_fingerprint?: boolean
    signature?: boolean
    signed_at?: boolean
    bundle?: boolean | bundleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bundle_signature"]>

  export type bundle_signatureSelectScalar = {
    id?: boolean
    bundle_id?: boolean
    public_key_fingerprint?: boolean
    signature?: boolean
    signed_at?: boolean
  }

  export type bundle_signatureInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | bundleDefaultArgs<ExtArgs>
  }
  export type bundle_signatureIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bundle?: boolean | bundleDefaultArgs<ExtArgs>
  }

  export type $bundle_signaturePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "bundle_signature"
    objects: {
      bundle: Prisma.$bundlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bundle_id: string
      public_key_fingerprint: string
      signature: string
      signed_at: Date
    }, ExtArgs["result"]["bundle_signature"]>
    composites: {}
  }

  type bundle_signatureGetPayload<S extends boolean | null | undefined | bundle_signatureDefaultArgs> = $Result.GetResult<Prisma.$bundle_signaturePayload, S>

  type bundle_signatureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<bundle_signatureFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Bundle_signatureCountAggregateInputType | true
    }

  export interface bundle_signatureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['bundle_signature'], meta: { name: 'bundle_signature' } }
    /**
     * Find zero or one Bundle_signature that matches the filter.
     * @param {bundle_signatureFindUniqueArgs} args - Arguments to find a Bundle_signature
     * @example
     * // Get one Bundle_signature
     * const bundle_signature = await prisma.bundle_signature.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends bundle_signatureFindUniqueArgs>(args: SelectSubset<T, bundle_signatureFindUniqueArgs<ExtArgs>>): Prisma__bundle_signatureClient<$Result.GetResult<Prisma.$bundle_signaturePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Bundle_signature that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {bundle_signatureFindUniqueOrThrowArgs} args - Arguments to find a Bundle_signature
     * @example
     * // Get one Bundle_signature
     * const bundle_signature = await prisma.bundle_signature.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends bundle_signatureFindUniqueOrThrowArgs>(args: SelectSubset<T, bundle_signatureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__bundle_signatureClient<$Result.GetResult<Prisma.$bundle_signaturePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Bundle_signature that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bundle_signatureFindFirstArgs} args - Arguments to find a Bundle_signature
     * @example
     * // Get one Bundle_signature
     * const bundle_signature = await prisma.bundle_signature.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends bundle_signatureFindFirstArgs>(args?: SelectSubset<T, bundle_signatureFindFirstArgs<ExtArgs>>): Prisma__bundle_signatureClient<$Result.GetResult<Prisma.$bundle_signaturePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Bundle_signature that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bundle_signatureFindFirstOrThrowArgs} args - Arguments to find a Bundle_signature
     * @example
     * // Get one Bundle_signature
     * const bundle_signature = await prisma.bundle_signature.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends bundle_signatureFindFirstOrThrowArgs>(args?: SelectSubset<T, bundle_signatureFindFirstOrThrowArgs<ExtArgs>>): Prisma__bundle_signatureClient<$Result.GetResult<Prisma.$bundle_signaturePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Bundle_signatures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bundle_signatureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bundle_signatures
     * const bundle_signatures = await prisma.bundle_signature.findMany()
     * 
     * // Get first 10 Bundle_signatures
     * const bundle_signatures = await prisma.bundle_signature.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bundle_signatureWithIdOnly = await prisma.bundle_signature.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends bundle_signatureFindManyArgs>(args?: SelectSubset<T, bundle_signatureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bundle_signaturePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Bundle_signature.
     * @param {bundle_signatureCreateArgs} args - Arguments to create a Bundle_signature.
     * @example
     * // Create one Bundle_signature
     * const Bundle_signature = await prisma.bundle_signature.create({
     *   data: {
     *     // ... data to create a Bundle_signature
     *   }
     * })
     * 
     */
    create<T extends bundle_signatureCreateArgs>(args: SelectSubset<T, bundle_signatureCreateArgs<ExtArgs>>): Prisma__bundle_signatureClient<$Result.GetResult<Prisma.$bundle_signaturePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Bundle_signatures.
     * @param {bundle_signatureCreateManyArgs} args - Arguments to create many Bundle_signatures.
     * @example
     * // Create many Bundle_signatures
     * const bundle_signature = await prisma.bundle_signature.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends bundle_signatureCreateManyArgs>(args?: SelectSubset<T, bundle_signatureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bundle_signatures and returns the data saved in the database.
     * @param {bundle_signatureCreateManyAndReturnArgs} args - Arguments to create many Bundle_signatures.
     * @example
     * // Create many Bundle_signatures
     * const bundle_signature = await prisma.bundle_signature.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bundle_signatures and only return the `id`
     * const bundle_signatureWithIdOnly = await prisma.bundle_signature.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends bundle_signatureCreateManyAndReturnArgs>(args?: SelectSubset<T, bundle_signatureCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bundle_signaturePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Bundle_signature.
     * @param {bundle_signatureDeleteArgs} args - Arguments to delete one Bundle_signature.
     * @example
     * // Delete one Bundle_signature
     * const Bundle_signature = await prisma.bundle_signature.delete({
     *   where: {
     *     // ... filter to delete one Bundle_signature
     *   }
     * })
     * 
     */
    delete<T extends bundle_signatureDeleteArgs>(args: SelectSubset<T, bundle_signatureDeleteArgs<ExtArgs>>): Prisma__bundle_signatureClient<$Result.GetResult<Prisma.$bundle_signaturePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Bundle_signature.
     * @param {bundle_signatureUpdateArgs} args - Arguments to update one Bundle_signature.
     * @example
     * // Update one Bundle_signature
     * const bundle_signature = await prisma.bundle_signature.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends bundle_signatureUpdateArgs>(args: SelectSubset<T, bundle_signatureUpdateArgs<ExtArgs>>): Prisma__bundle_signatureClient<$Result.GetResult<Prisma.$bundle_signaturePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Bundle_signatures.
     * @param {bundle_signatureDeleteManyArgs} args - Arguments to filter Bundle_signatures to delete.
     * @example
     * // Delete a few Bundle_signatures
     * const { count } = await prisma.bundle_signature.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends bundle_signatureDeleteManyArgs>(args?: SelectSubset<T, bundle_signatureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bundle_signatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bundle_signatureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bundle_signatures
     * const bundle_signature = await prisma.bundle_signature.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends bundle_signatureUpdateManyArgs>(args: SelectSubset<T, bundle_signatureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Bundle_signature.
     * @param {bundle_signatureUpsertArgs} args - Arguments to update or create a Bundle_signature.
     * @example
     * // Update or create a Bundle_signature
     * const bundle_signature = await prisma.bundle_signature.upsert({
     *   create: {
     *     // ... data to create a Bundle_signature
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bundle_signature we want to update
     *   }
     * })
     */
    upsert<T extends bundle_signatureUpsertArgs>(args: SelectSubset<T, bundle_signatureUpsertArgs<ExtArgs>>): Prisma__bundle_signatureClient<$Result.GetResult<Prisma.$bundle_signaturePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Bundle_signatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bundle_signatureCountArgs} args - Arguments to filter Bundle_signatures to count.
     * @example
     * // Count the number of Bundle_signatures
     * const count = await prisma.bundle_signature.count({
     *   where: {
     *     // ... the filter for the Bundle_signatures we want to count
     *   }
     * })
    **/
    count<T extends bundle_signatureCountArgs>(
      args?: Subset<T, bundle_signatureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Bundle_signatureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bundle_signature.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Bundle_signatureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Bundle_signatureAggregateArgs>(args: Subset<T, Bundle_signatureAggregateArgs>): Prisma.PrismaPromise<GetBundle_signatureAggregateType<T>>

    /**
     * Group by Bundle_signature.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bundle_signatureGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends bundle_signatureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: bundle_signatureGroupByArgs['orderBy'] }
        : { orderBy?: bundle_signatureGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, bundle_signatureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBundle_signatureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the bundle_signature model
   */
  readonly fields: bundle_signatureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for bundle_signature.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__bundle_signatureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bundle<T extends bundleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, bundleDefaultArgs<ExtArgs>>): Prisma__bundleClient<$Result.GetResult<Prisma.$bundlePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the bundle_signature model
   */ 
  interface bundle_signatureFieldRefs {
    readonly id: FieldRef<"bundle_signature", 'String'>
    readonly bundle_id: FieldRef<"bundle_signature", 'String'>
    readonly public_key_fingerprint: FieldRef<"bundle_signature", 'String'>
    readonly signature: FieldRef<"bundle_signature", 'String'>
    readonly signed_at: FieldRef<"bundle_signature", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * bundle_signature findUnique
   */
  export type bundle_signatureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle_signature
     */
    select?: bundle_signatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundle_signatureInclude<ExtArgs> | null
    /**
     * Filter, which bundle_signature to fetch.
     */
    where: bundle_signatureWhereUniqueInput
  }

  /**
   * bundle_signature findUniqueOrThrow
   */
  export type bundle_signatureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle_signature
     */
    select?: bundle_signatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundle_signatureInclude<ExtArgs> | null
    /**
     * Filter, which bundle_signature to fetch.
     */
    where: bundle_signatureWhereUniqueInput
  }

  /**
   * bundle_signature findFirst
   */
  export type bundle_signatureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle_signature
     */
    select?: bundle_signatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundle_signatureInclude<ExtArgs> | null
    /**
     * Filter, which bundle_signature to fetch.
     */
    where?: bundle_signatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bundle_signatures to fetch.
     */
    orderBy?: bundle_signatureOrderByWithRelationInput | bundle_signatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for bundle_signatures.
     */
    cursor?: bundle_signatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bundle_signatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bundle_signatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of bundle_signatures.
     */
    distinct?: Bundle_signatureScalarFieldEnum | Bundle_signatureScalarFieldEnum[]
  }

  /**
   * bundle_signature findFirstOrThrow
   */
  export type bundle_signatureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle_signature
     */
    select?: bundle_signatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundle_signatureInclude<ExtArgs> | null
    /**
     * Filter, which bundle_signature to fetch.
     */
    where?: bundle_signatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bundle_signatures to fetch.
     */
    orderBy?: bundle_signatureOrderByWithRelationInput | bundle_signatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for bundle_signatures.
     */
    cursor?: bundle_signatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bundle_signatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bundle_signatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of bundle_signatures.
     */
    distinct?: Bundle_signatureScalarFieldEnum | Bundle_signatureScalarFieldEnum[]
  }

  /**
   * bundle_signature findMany
   */
  export type bundle_signatureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle_signature
     */
    select?: bundle_signatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundle_signatureInclude<ExtArgs> | null
    /**
     * Filter, which bundle_signatures to fetch.
     */
    where?: bundle_signatureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bundle_signatures to fetch.
     */
    orderBy?: bundle_signatureOrderByWithRelationInput | bundle_signatureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing bundle_signatures.
     */
    cursor?: bundle_signatureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bundle_signatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bundle_signatures.
     */
    skip?: number
    distinct?: Bundle_signatureScalarFieldEnum | Bundle_signatureScalarFieldEnum[]
  }

  /**
   * bundle_signature create
   */
  export type bundle_signatureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle_signature
     */
    select?: bundle_signatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundle_signatureInclude<ExtArgs> | null
    /**
     * The data needed to create a bundle_signature.
     */
    data: XOR<bundle_signatureCreateInput, bundle_signatureUncheckedCreateInput>
  }

  /**
   * bundle_signature createMany
   */
  export type bundle_signatureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many bundle_signatures.
     */
    data: bundle_signatureCreateManyInput | bundle_signatureCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * bundle_signature createManyAndReturn
   */
  export type bundle_signatureCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle_signature
     */
    select?: bundle_signatureSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many bundle_signatures.
     */
    data: bundle_signatureCreateManyInput | bundle_signatureCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundle_signatureIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * bundle_signature update
   */
  export type bundle_signatureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle_signature
     */
    select?: bundle_signatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundle_signatureInclude<ExtArgs> | null
    /**
     * The data needed to update a bundle_signature.
     */
    data: XOR<bundle_signatureUpdateInput, bundle_signatureUncheckedUpdateInput>
    /**
     * Choose, which bundle_signature to update.
     */
    where: bundle_signatureWhereUniqueInput
  }

  /**
   * bundle_signature updateMany
   */
  export type bundle_signatureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update bundle_signatures.
     */
    data: XOR<bundle_signatureUpdateManyMutationInput, bundle_signatureUncheckedUpdateManyInput>
    /**
     * Filter which bundle_signatures to update
     */
    where?: bundle_signatureWhereInput
  }

  /**
   * bundle_signature upsert
   */
  export type bundle_signatureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle_signature
     */
    select?: bundle_signatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundle_signatureInclude<ExtArgs> | null
    /**
     * The filter to search for the bundle_signature to update in case it exists.
     */
    where: bundle_signatureWhereUniqueInput
    /**
     * In case the bundle_signature found by the `where` argument doesn't exist, create a new bundle_signature with this data.
     */
    create: XOR<bundle_signatureCreateInput, bundle_signatureUncheckedCreateInput>
    /**
     * In case the bundle_signature was found with the provided `where` argument, update it with this data.
     */
    update: XOR<bundle_signatureUpdateInput, bundle_signatureUncheckedUpdateInput>
  }

  /**
   * bundle_signature delete
   */
  export type bundle_signatureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle_signature
     */
    select?: bundle_signatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundle_signatureInclude<ExtArgs> | null
    /**
     * Filter which bundle_signature to delete.
     */
    where: bundle_signatureWhereUniqueInput
  }

  /**
   * bundle_signature deleteMany
   */
  export type bundle_signatureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which bundle_signatures to delete
     */
    where?: bundle_signatureWhereInput
  }

  /**
   * bundle_signature without action
   */
  export type bundle_signatureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bundle_signature
     */
    select?: bundle_signatureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bundle_signatureInclude<ExtArgs> | null
  }


  /**
   * Model review
   */

  export type AggregateReview = {
    _count: ReviewCountAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  export type ReviewMinAggregateOutputType = {
    id: string | null
    content_id: string | null
    reviewer_id: string | null
    status: $Enums.review_status | null
    comment: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ReviewMaxAggregateOutputType = {
    id: string | null
    content_id: string | null
    reviewer_id: string | null
    status: $Enums.review_status | null
    comment: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ReviewCountAggregateOutputType = {
    id: number
    content_id: number
    reviewer_id: number
    status: number
    comment: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ReviewMinAggregateInputType = {
    id?: true
    content_id?: true
    reviewer_id?: true
    status?: true
    comment?: true
    created_at?: true
    updated_at?: true
  }

  export type ReviewMaxAggregateInputType = {
    id?: true
    content_id?: true
    reviewer_id?: true
    status?: true
    comment?: true
    created_at?: true
    updated_at?: true
  }

  export type ReviewCountAggregateInputType = {
    id?: true
    content_id?: true
    reviewer_id?: true
    status?: true
    comment?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ReviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which review to aggregate.
     */
    where?: reviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reviews to fetch.
     */
    orderBy?: reviewOrderByWithRelationInput | reviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: reviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned reviews
    **/
    _count?: true | ReviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReviewMaxAggregateInputType
  }

  export type GetReviewAggregateType<T extends ReviewAggregateArgs> = {
        [P in keyof T & keyof AggregateReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReview[P]>
      : GetScalarType<T[P], AggregateReview[P]>
  }




  export type reviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reviewWhereInput
    orderBy?: reviewOrderByWithAggregationInput | reviewOrderByWithAggregationInput[]
    by: ReviewScalarFieldEnum[] | ReviewScalarFieldEnum
    having?: reviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReviewCountAggregateInputType | true
    _min?: ReviewMinAggregateInputType
    _max?: ReviewMaxAggregateInputType
  }

  export type ReviewGroupByOutputType = {
    id: string
    content_id: string
    reviewer_id: string
    status: $Enums.review_status
    comment: string | null
    created_at: Date
    updated_at: Date
    _count: ReviewCountAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  type GetReviewGroupByPayload<T extends reviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReviewGroupByOutputType[P]>
            : GetScalarType<T[P], ReviewGroupByOutputType[P]>
        }
      >
    >


  export type reviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content_id?: boolean
    reviewer_id?: boolean
    status?: boolean
    comment?: boolean
    created_at?: boolean
    updated_at?: boolean
    content?: boolean | content_itemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type reviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content_id?: boolean
    reviewer_id?: boolean
    status?: boolean
    comment?: boolean
    created_at?: boolean
    updated_at?: boolean
    content?: boolean | content_itemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type reviewSelectScalar = {
    id?: boolean
    content_id?: boolean
    reviewer_id?: boolean
    status?: boolean
    comment?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type reviewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    content?: boolean | content_itemDefaultArgs<ExtArgs>
  }
  export type reviewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    content?: boolean | content_itemDefaultArgs<ExtArgs>
  }

  export type $reviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "review"
    objects: {
      content: Prisma.$content_itemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content_id: string
      reviewer_id: string
      status: $Enums.review_status
      comment: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["review"]>
    composites: {}
  }

  type reviewGetPayload<S extends boolean | null | undefined | reviewDefaultArgs> = $Result.GetResult<Prisma.$reviewPayload, S>

  type reviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<reviewFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReviewCountAggregateInputType | true
    }

  export interface reviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['review'], meta: { name: 'review' } }
    /**
     * Find zero or one Review that matches the filter.
     * @param {reviewFindUniqueArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends reviewFindUniqueArgs>(args: SelectSubset<T, reviewFindUniqueArgs<ExtArgs>>): Prisma__reviewClient<$Result.GetResult<Prisma.$reviewPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Review that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {reviewFindUniqueOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends reviewFindUniqueOrThrowArgs>(args: SelectSubset<T, reviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__reviewClient<$Result.GetResult<Prisma.$reviewPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Review that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reviewFindFirstArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends reviewFindFirstArgs>(args?: SelectSubset<T, reviewFindFirstArgs<ExtArgs>>): Prisma__reviewClient<$Result.GetResult<Prisma.$reviewPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Review that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reviewFindFirstOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends reviewFindFirstOrThrowArgs>(args?: SelectSubset<T, reviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__reviewClient<$Result.GetResult<Prisma.$reviewPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Reviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reviews
     * const reviews = await prisma.review.findMany()
     * 
     * // Get first 10 Reviews
     * const reviews = await prisma.review.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reviewWithIdOnly = await prisma.review.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends reviewFindManyArgs>(args?: SelectSubset<T, reviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reviewPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Review.
     * @param {reviewCreateArgs} args - Arguments to create a Review.
     * @example
     * // Create one Review
     * const Review = await prisma.review.create({
     *   data: {
     *     // ... data to create a Review
     *   }
     * })
     * 
     */
    create<T extends reviewCreateArgs>(args: SelectSubset<T, reviewCreateArgs<ExtArgs>>): Prisma__reviewClient<$Result.GetResult<Prisma.$reviewPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Reviews.
     * @param {reviewCreateManyArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends reviewCreateManyArgs>(args?: SelectSubset<T, reviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reviews and returns the data saved in the database.
     * @param {reviewCreateManyAndReturnArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends reviewCreateManyAndReturnArgs>(args?: SelectSubset<T, reviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reviewPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Review.
     * @param {reviewDeleteArgs} args - Arguments to delete one Review.
     * @example
     * // Delete one Review
     * const Review = await prisma.review.delete({
     *   where: {
     *     // ... filter to delete one Review
     *   }
     * })
     * 
     */
    delete<T extends reviewDeleteArgs>(args: SelectSubset<T, reviewDeleteArgs<ExtArgs>>): Prisma__reviewClient<$Result.GetResult<Prisma.$reviewPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Review.
     * @param {reviewUpdateArgs} args - Arguments to update one Review.
     * @example
     * // Update one Review
     * const review = await prisma.review.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends reviewUpdateArgs>(args: SelectSubset<T, reviewUpdateArgs<ExtArgs>>): Prisma__reviewClient<$Result.GetResult<Prisma.$reviewPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Reviews.
     * @param {reviewDeleteManyArgs} args - Arguments to filter Reviews to delete.
     * @example
     * // Delete a few Reviews
     * const { count } = await prisma.review.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends reviewDeleteManyArgs>(args?: SelectSubset<T, reviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends reviewUpdateManyArgs>(args: SelectSubset<T, reviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Review.
     * @param {reviewUpsertArgs} args - Arguments to update or create a Review.
     * @example
     * // Update or create a Review
     * const review = await prisma.review.upsert({
     *   create: {
     *     // ... data to create a Review
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Review we want to update
     *   }
     * })
     */
    upsert<T extends reviewUpsertArgs>(args: SelectSubset<T, reviewUpsertArgs<ExtArgs>>): Prisma__reviewClient<$Result.GetResult<Prisma.$reviewPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reviewCountArgs} args - Arguments to filter Reviews to count.
     * @example
     * // Count the number of Reviews
     * const count = await prisma.review.count({
     *   where: {
     *     // ... the filter for the Reviews we want to count
     *   }
     * })
    **/
    count<T extends reviewCountArgs>(
      args?: Subset<T, reviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReviewAggregateArgs>(args: Subset<T, ReviewAggregateArgs>): Prisma.PrismaPromise<GetReviewAggregateType<T>>

    /**
     * Group by Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reviewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends reviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: reviewGroupByArgs['orderBy'] }
        : { orderBy?: reviewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, reviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the review model
   */
  readonly fields: reviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for review.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__reviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    content<T extends content_itemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, content_itemDefaultArgs<ExtArgs>>): Prisma__content_itemClient<$Result.GetResult<Prisma.$content_itemPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the review model
   */ 
  interface reviewFieldRefs {
    readonly id: FieldRef<"review", 'String'>
    readonly content_id: FieldRef<"review", 'String'>
    readonly reviewer_id: FieldRef<"review", 'String'>
    readonly status: FieldRef<"review", 'review_status'>
    readonly comment: FieldRef<"review", 'String'>
    readonly created_at: FieldRef<"review", 'DateTime'>
    readonly updated_at: FieldRef<"review", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * review findUnique
   */
  export type reviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the review
     */
    select?: reviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reviewInclude<ExtArgs> | null
    /**
     * Filter, which review to fetch.
     */
    where: reviewWhereUniqueInput
  }

  /**
   * review findUniqueOrThrow
   */
  export type reviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the review
     */
    select?: reviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reviewInclude<ExtArgs> | null
    /**
     * Filter, which review to fetch.
     */
    where: reviewWhereUniqueInput
  }

  /**
   * review findFirst
   */
  export type reviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the review
     */
    select?: reviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reviewInclude<ExtArgs> | null
    /**
     * Filter, which review to fetch.
     */
    where?: reviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reviews to fetch.
     */
    orderBy?: reviewOrderByWithRelationInput | reviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for reviews.
     */
    cursor?: reviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * review findFirstOrThrow
   */
  export type reviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the review
     */
    select?: reviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reviewInclude<ExtArgs> | null
    /**
     * Filter, which review to fetch.
     */
    where?: reviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reviews to fetch.
     */
    orderBy?: reviewOrderByWithRelationInput | reviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for reviews.
     */
    cursor?: reviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * review findMany
   */
  export type reviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the review
     */
    select?: reviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reviewInclude<ExtArgs> | null
    /**
     * Filter, which reviews to fetch.
     */
    where?: reviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reviews to fetch.
     */
    orderBy?: reviewOrderByWithRelationInput | reviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing reviews.
     */
    cursor?: reviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reviews.
     */
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * review create
   */
  export type reviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the review
     */
    select?: reviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reviewInclude<ExtArgs> | null
    /**
     * The data needed to create a review.
     */
    data: XOR<reviewCreateInput, reviewUncheckedCreateInput>
  }

  /**
   * review createMany
   */
  export type reviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many reviews.
     */
    data: reviewCreateManyInput | reviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * review createManyAndReturn
   */
  export type reviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the review
     */
    select?: reviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many reviews.
     */
    data: reviewCreateManyInput | reviewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reviewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * review update
   */
  export type reviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the review
     */
    select?: reviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reviewInclude<ExtArgs> | null
    /**
     * The data needed to update a review.
     */
    data: XOR<reviewUpdateInput, reviewUncheckedUpdateInput>
    /**
     * Choose, which review to update.
     */
    where: reviewWhereUniqueInput
  }

  /**
   * review updateMany
   */
  export type reviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update reviews.
     */
    data: XOR<reviewUpdateManyMutationInput, reviewUncheckedUpdateManyInput>
    /**
     * Filter which reviews to update
     */
    where?: reviewWhereInput
  }

  /**
   * review upsert
   */
  export type reviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the review
     */
    select?: reviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reviewInclude<ExtArgs> | null
    /**
     * The filter to search for the review to update in case it exists.
     */
    where: reviewWhereUniqueInput
    /**
     * In case the review found by the `where` argument doesn't exist, create a new review with this data.
     */
    create: XOR<reviewCreateInput, reviewUncheckedCreateInput>
    /**
     * In case the review was found with the provided `where` argument, update it with this data.
     */
    update: XOR<reviewUpdateInput, reviewUncheckedUpdateInput>
  }

  /**
   * review delete
   */
  export type reviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the review
     */
    select?: reviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reviewInclude<ExtArgs> | null
    /**
     * Filter which review to delete.
     */
    where: reviewWhereUniqueInput
  }

  /**
   * review deleteMany
   */
  export type reviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which reviews to delete
     */
    where?: reviewWhereInput
  }

  /**
   * review without action
   */
  export type reviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the review
     */
    select?: reviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reviewInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Content_itemScalarFieldEnum: {
    id: 'id',
    type: 'type',
    title: 'title',
    body: 'body',
    difficulty: 'difficulty',
    status: 'status',
    author_id: 'author_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at'
  };

  export type Content_itemScalarFieldEnum = (typeof Content_itemScalarFieldEnum)[keyof typeof Content_itemScalarFieldEnum]


  export const BundleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    version: 'version',
    status: 'status',
    content_ids: 'content_ids',
    created_at: 'created_at',
    published_at: 'published_at'
  };

  export type BundleScalarFieldEnum = (typeof BundleScalarFieldEnum)[keyof typeof BundleScalarFieldEnum]


  export const Bundle_signatureScalarFieldEnum: {
    id: 'id',
    bundle_id: 'bundle_id',
    public_key_fingerprint: 'public_key_fingerprint',
    signature: 'signature',
    signed_at: 'signed_at'
  };

  export type Bundle_signatureScalarFieldEnum = (typeof Bundle_signatureScalarFieldEnum)[keyof typeof Bundle_signatureScalarFieldEnum]


  export const ReviewScalarFieldEnum: {
    id: 'id',
    content_id: 'content_id',
    reviewer_id: 'reviewer_id',
    status: 'status',
    comment: 'comment',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ReviewScalarFieldEnum = (typeof ReviewScalarFieldEnum)[keyof typeof ReviewScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'content_type'
   */
  export type Enumcontent_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'content_type'>
    


  /**
   * Reference to a field of type 'content_type[]'
   */
  export type ListEnumcontent_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'content_type[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'content_status'
   */
  export type Enumcontent_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'content_status'>
    


  /**
   * Reference to a field of type 'content_status[]'
   */
  export type ListEnumcontent_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'content_status[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'bundle_status'
   */
  export type Enumbundle_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'bundle_status'>
    


  /**
   * Reference to a field of type 'bundle_status[]'
   */
  export type ListEnumbundle_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'bundle_status[]'>
    


  /**
   * Reference to a field of type 'review_status'
   */
  export type Enumreview_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'review_status'>
    


  /**
   * Reference to a field of type 'review_status[]'
   */
  export type ListEnumreview_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'review_status[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type content_itemWhereInput = {
    AND?: content_itemWhereInput | content_itemWhereInput[]
    OR?: content_itemWhereInput[]
    NOT?: content_itemWhereInput | content_itemWhereInput[]
    id?: StringFilter<"content_item"> | string
    type?: Enumcontent_typeFilter<"content_item"> | $Enums.content_type
    title?: StringFilter<"content_item"> | string
    body?: StringFilter<"content_item"> | string
    difficulty?: IntFilter<"content_item"> | number
    status?: Enumcontent_statusFilter<"content_item"> | $Enums.content_status
    author_id?: StringFilter<"content_item"> | string
    created_at?: DateTimeFilter<"content_item"> | Date | string
    updated_at?: DateTimeFilter<"content_item"> | Date | string
    deleted_at?: DateTimeNullableFilter<"content_item"> | Date | string | null
    reviews?: ReviewListRelationFilter
  }

  export type content_itemOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    difficulty?: SortOrder
    status?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    reviews?: reviewOrderByRelationAggregateInput
  }

  export type content_itemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: content_itemWhereInput | content_itemWhereInput[]
    OR?: content_itemWhereInput[]
    NOT?: content_itemWhereInput | content_itemWhereInput[]
    type?: Enumcontent_typeFilter<"content_item"> | $Enums.content_type
    title?: StringFilter<"content_item"> | string
    body?: StringFilter<"content_item"> | string
    difficulty?: IntFilter<"content_item"> | number
    status?: Enumcontent_statusFilter<"content_item"> | $Enums.content_status
    author_id?: StringFilter<"content_item"> | string
    created_at?: DateTimeFilter<"content_item"> | Date | string
    updated_at?: DateTimeFilter<"content_item"> | Date | string
    deleted_at?: DateTimeNullableFilter<"content_item"> | Date | string | null
    reviews?: ReviewListRelationFilter
  }, "id">

  export type content_itemOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    difficulty?: SortOrder
    status?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    _count?: content_itemCountOrderByAggregateInput
    _avg?: content_itemAvgOrderByAggregateInput
    _max?: content_itemMaxOrderByAggregateInput
    _min?: content_itemMinOrderByAggregateInput
    _sum?: content_itemSumOrderByAggregateInput
  }

  export type content_itemScalarWhereWithAggregatesInput = {
    AND?: content_itemScalarWhereWithAggregatesInput | content_itemScalarWhereWithAggregatesInput[]
    OR?: content_itemScalarWhereWithAggregatesInput[]
    NOT?: content_itemScalarWhereWithAggregatesInput | content_itemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"content_item"> | string
    type?: Enumcontent_typeWithAggregatesFilter<"content_item"> | $Enums.content_type
    title?: StringWithAggregatesFilter<"content_item"> | string
    body?: StringWithAggregatesFilter<"content_item"> | string
    difficulty?: IntWithAggregatesFilter<"content_item"> | number
    status?: Enumcontent_statusWithAggregatesFilter<"content_item"> | $Enums.content_status
    author_id?: StringWithAggregatesFilter<"content_item"> | string
    created_at?: DateTimeWithAggregatesFilter<"content_item"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"content_item"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"content_item"> | Date | string | null
  }

  export type bundleWhereInput = {
    AND?: bundleWhereInput | bundleWhereInput[]
    OR?: bundleWhereInput[]
    NOT?: bundleWhereInput | bundleWhereInput[]
    id?: StringFilter<"bundle"> | string
    name?: StringFilter<"bundle"> | string
    version?: StringFilter<"bundle"> | string
    status?: Enumbundle_statusFilter<"bundle"> | $Enums.bundle_status
    content_ids?: StringNullableListFilter<"bundle">
    created_at?: DateTimeFilter<"bundle"> | Date | string
    published_at?: DateTimeNullableFilter<"bundle"> | Date | string | null
    signatures?: Bundle_signatureListRelationFilter
  }

  export type bundleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    version?: SortOrder
    status?: SortOrder
    content_ids?: SortOrder
    created_at?: SortOrder
    published_at?: SortOrderInput | SortOrder
    signatures?: bundle_signatureOrderByRelationAggregateInput
  }

  export type bundleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: bundleWhereInput | bundleWhereInput[]
    OR?: bundleWhereInput[]
    NOT?: bundleWhereInput | bundleWhereInput[]
    name?: StringFilter<"bundle"> | string
    version?: StringFilter<"bundle"> | string
    status?: Enumbundle_statusFilter<"bundle"> | $Enums.bundle_status
    content_ids?: StringNullableListFilter<"bundle">
    created_at?: DateTimeFilter<"bundle"> | Date | string
    published_at?: DateTimeNullableFilter<"bundle"> | Date | string | null
    signatures?: Bundle_signatureListRelationFilter
  }, "id">

  export type bundleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    version?: SortOrder
    status?: SortOrder
    content_ids?: SortOrder
    created_at?: SortOrder
    published_at?: SortOrderInput | SortOrder
    _count?: bundleCountOrderByAggregateInput
    _max?: bundleMaxOrderByAggregateInput
    _min?: bundleMinOrderByAggregateInput
  }

  export type bundleScalarWhereWithAggregatesInput = {
    AND?: bundleScalarWhereWithAggregatesInput | bundleScalarWhereWithAggregatesInput[]
    OR?: bundleScalarWhereWithAggregatesInput[]
    NOT?: bundleScalarWhereWithAggregatesInput | bundleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"bundle"> | string
    name?: StringWithAggregatesFilter<"bundle"> | string
    version?: StringWithAggregatesFilter<"bundle"> | string
    status?: Enumbundle_statusWithAggregatesFilter<"bundle"> | $Enums.bundle_status
    content_ids?: StringNullableListFilter<"bundle">
    created_at?: DateTimeWithAggregatesFilter<"bundle"> | Date | string
    published_at?: DateTimeNullableWithAggregatesFilter<"bundle"> | Date | string | null
  }

  export type bundle_signatureWhereInput = {
    AND?: bundle_signatureWhereInput | bundle_signatureWhereInput[]
    OR?: bundle_signatureWhereInput[]
    NOT?: bundle_signatureWhereInput | bundle_signatureWhereInput[]
    id?: StringFilter<"bundle_signature"> | string
    bundle_id?: StringFilter<"bundle_signature"> | string
    public_key_fingerprint?: StringFilter<"bundle_signature"> | string
    signature?: StringFilter<"bundle_signature"> | string
    signed_at?: DateTimeFilter<"bundle_signature"> | Date | string
    bundle?: XOR<BundleRelationFilter, bundleWhereInput>
  }

  export type bundle_signatureOrderByWithRelationInput = {
    id?: SortOrder
    bundle_id?: SortOrder
    public_key_fingerprint?: SortOrder
    signature?: SortOrder
    signed_at?: SortOrder
    bundle?: bundleOrderByWithRelationInput
  }

  export type bundle_signatureWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: bundle_signatureWhereInput | bundle_signatureWhereInput[]
    OR?: bundle_signatureWhereInput[]
    NOT?: bundle_signatureWhereInput | bundle_signatureWhereInput[]
    bundle_id?: StringFilter<"bundle_signature"> | string
    public_key_fingerprint?: StringFilter<"bundle_signature"> | string
    signature?: StringFilter<"bundle_signature"> | string
    signed_at?: DateTimeFilter<"bundle_signature"> | Date | string
    bundle?: XOR<BundleRelationFilter, bundleWhereInput>
  }, "id">

  export type bundle_signatureOrderByWithAggregationInput = {
    id?: SortOrder
    bundle_id?: SortOrder
    public_key_fingerprint?: SortOrder
    signature?: SortOrder
    signed_at?: SortOrder
    _count?: bundle_signatureCountOrderByAggregateInput
    _max?: bundle_signatureMaxOrderByAggregateInput
    _min?: bundle_signatureMinOrderByAggregateInput
  }

  export type bundle_signatureScalarWhereWithAggregatesInput = {
    AND?: bundle_signatureScalarWhereWithAggregatesInput | bundle_signatureScalarWhereWithAggregatesInput[]
    OR?: bundle_signatureScalarWhereWithAggregatesInput[]
    NOT?: bundle_signatureScalarWhereWithAggregatesInput | bundle_signatureScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"bundle_signature"> | string
    bundle_id?: StringWithAggregatesFilter<"bundle_signature"> | string
    public_key_fingerprint?: StringWithAggregatesFilter<"bundle_signature"> | string
    signature?: StringWithAggregatesFilter<"bundle_signature"> | string
    signed_at?: DateTimeWithAggregatesFilter<"bundle_signature"> | Date | string
  }

  export type reviewWhereInput = {
    AND?: reviewWhereInput | reviewWhereInput[]
    OR?: reviewWhereInput[]
    NOT?: reviewWhereInput | reviewWhereInput[]
    id?: StringFilter<"review"> | string
    content_id?: StringFilter<"review"> | string
    reviewer_id?: StringFilter<"review"> | string
    status?: Enumreview_statusFilter<"review"> | $Enums.review_status
    comment?: StringNullableFilter<"review"> | string | null
    created_at?: DateTimeFilter<"review"> | Date | string
    updated_at?: DateTimeFilter<"review"> | Date | string
    content?: XOR<Content_itemRelationFilter, content_itemWhereInput>
  }

  export type reviewOrderByWithRelationInput = {
    id?: SortOrder
    content_id?: SortOrder
    reviewer_id?: SortOrder
    status?: SortOrder
    comment?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    content?: content_itemOrderByWithRelationInput
  }

  export type reviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: reviewWhereInput | reviewWhereInput[]
    OR?: reviewWhereInput[]
    NOT?: reviewWhereInput | reviewWhereInput[]
    content_id?: StringFilter<"review"> | string
    reviewer_id?: StringFilter<"review"> | string
    status?: Enumreview_statusFilter<"review"> | $Enums.review_status
    comment?: StringNullableFilter<"review"> | string | null
    created_at?: DateTimeFilter<"review"> | Date | string
    updated_at?: DateTimeFilter<"review"> | Date | string
    content?: XOR<Content_itemRelationFilter, content_itemWhereInput>
  }, "id">

  export type reviewOrderByWithAggregationInput = {
    id?: SortOrder
    content_id?: SortOrder
    reviewer_id?: SortOrder
    status?: SortOrder
    comment?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: reviewCountOrderByAggregateInput
    _max?: reviewMaxOrderByAggregateInput
    _min?: reviewMinOrderByAggregateInput
  }

  export type reviewScalarWhereWithAggregatesInput = {
    AND?: reviewScalarWhereWithAggregatesInput | reviewScalarWhereWithAggregatesInput[]
    OR?: reviewScalarWhereWithAggregatesInput[]
    NOT?: reviewScalarWhereWithAggregatesInput | reviewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"review"> | string
    content_id?: StringWithAggregatesFilter<"review"> | string
    reviewer_id?: StringWithAggregatesFilter<"review"> | string
    status?: Enumreview_statusWithAggregatesFilter<"review"> | $Enums.review_status
    comment?: StringNullableWithAggregatesFilter<"review"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"review"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"review"> | Date | string
  }

  export type content_itemCreateInput = {
    id?: string
    type: $Enums.content_type
    title: string
    body: string
    difficulty?: number
    status?: $Enums.content_status
    author_id: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    reviews?: reviewCreateNestedManyWithoutContentInput
  }

  export type content_itemUncheckedCreateInput = {
    id?: string
    type: $Enums.content_type
    title: string
    body: string
    difficulty?: number
    status?: $Enums.content_status
    author_id: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    reviews?: reviewUncheckedCreateNestedManyWithoutContentInput
  }

  export type content_itemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumcontent_typeFieldUpdateOperationsInput | $Enums.content_type
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    status?: Enumcontent_statusFieldUpdateOperationsInput | $Enums.content_status
    author_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviews?: reviewUpdateManyWithoutContentNestedInput
  }

  export type content_itemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumcontent_typeFieldUpdateOperationsInput | $Enums.content_type
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    status?: Enumcontent_statusFieldUpdateOperationsInput | $Enums.content_status
    author_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviews?: reviewUncheckedUpdateManyWithoutContentNestedInput
  }

  export type content_itemCreateManyInput = {
    id?: string
    type: $Enums.content_type
    title: string
    body: string
    difficulty?: number
    status?: $Enums.content_status
    author_id: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type content_itemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumcontent_typeFieldUpdateOperationsInput | $Enums.content_type
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    status?: Enumcontent_statusFieldUpdateOperationsInput | $Enums.content_status
    author_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type content_itemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumcontent_typeFieldUpdateOperationsInput | $Enums.content_type
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    status?: Enumcontent_statusFieldUpdateOperationsInput | $Enums.content_status
    author_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type bundleCreateInput = {
    id?: string
    name: string
    version?: string
    status?: $Enums.bundle_status
    content_ids?: bundleCreatecontent_idsInput | string[]
    created_at?: Date | string
    published_at?: Date | string | null
    signatures?: bundle_signatureCreateNestedManyWithoutBundleInput
  }

  export type bundleUncheckedCreateInput = {
    id?: string
    name: string
    version?: string
    status?: $Enums.bundle_status
    content_ids?: bundleCreatecontent_idsInput | string[]
    created_at?: Date | string
    published_at?: Date | string | null
    signatures?: bundle_signatureUncheckedCreateNestedManyWithoutBundleInput
  }

  export type bundleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: Enumbundle_statusFieldUpdateOperationsInput | $Enums.bundle_status
    content_ids?: bundleUpdatecontent_idsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signatures?: bundle_signatureUpdateManyWithoutBundleNestedInput
  }

  export type bundleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: Enumbundle_statusFieldUpdateOperationsInput | $Enums.bundle_status
    content_ids?: bundleUpdatecontent_idsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    signatures?: bundle_signatureUncheckedUpdateManyWithoutBundleNestedInput
  }

  export type bundleCreateManyInput = {
    id?: string
    name: string
    version?: string
    status?: $Enums.bundle_status
    content_ids?: bundleCreatecontent_idsInput | string[]
    created_at?: Date | string
    published_at?: Date | string | null
  }

  export type bundleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: Enumbundle_statusFieldUpdateOperationsInput | $Enums.bundle_status
    content_ids?: bundleUpdatecontent_idsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type bundleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: Enumbundle_statusFieldUpdateOperationsInput | $Enums.bundle_status
    content_ids?: bundleUpdatecontent_idsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type bundle_signatureCreateInput = {
    id?: string
    public_key_fingerprint: string
    signature: string
    signed_at?: Date | string
    bundle: bundleCreateNestedOneWithoutSignaturesInput
  }

  export type bundle_signatureUncheckedCreateInput = {
    id?: string
    bundle_id: string
    public_key_fingerprint: string
    signature: string
    signed_at?: Date | string
  }

  export type bundle_signatureUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    public_key_fingerprint?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    signed_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bundle?: bundleUpdateOneRequiredWithoutSignaturesNestedInput
  }

  export type bundle_signatureUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bundle_id?: StringFieldUpdateOperationsInput | string
    public_key_fingerprint?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    signed_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bundle_signatureCreateManyInput = {
    id?: string
    bundle_id: string
    public_key_fingerprint: string
    signature: string
    signed_at?: Date | string
  }

  export type bundle_signatureUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    public_key_fingerprint?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    signed_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bundle_signatureUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bundle_id?: StringFieldUpdateOperationsInput | string
    public_key_fingerprint?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    signed_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type reviewCreateInput = {
    id?: string
    reviewer_id: string
    status?: $Enums.review_status
    comment?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    content: content_itemCreateNestedOneWithoutReviewsInput
  }

  export type reviewUncheckedCreateInput = {
    id?: string
    content_id: string
    reviewer_id: string
    status?: $Enums.review_status
    comment?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type reviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewer_id?: StringFieldUpdateOperationsInput | string
    status?: Enumreview_statusFieldUpdateOperationsInput | $Enums.review_status
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: content_itemUpdateOneRequiredWithoutReviewsNestedInput
  }

  export type reviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content_id?: StringFieldUpdateOperationsInput | string
    reviewer_id?: StringFieldUpdateOperationsInput | string
    status?: Enumreview_statusFieldUpdateOperationsInput | $Enums.review_status
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type reviewCreateManyInput = {
    id?: string
    content_id: string
    reviewer_id: string
    status?: $Enums.review_status
    comment?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type reviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewer_id?: StringFieldUpdateOperationsInput | string
    status?: Enumreview_statusFieldUpdateOperationsInput | $Enums.review_status
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type reviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content_id?: StringFieldUpdateOperationsInput | string
    reviewer_id?: StringFieldUpdateOperationsInput | string
    status?: Enumreview_statusFieldUpdateOperationsInput | $Enums.review_status
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type Enumcontent_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.content_type | Enumcontent_typeFieldRefInput<$PrismaModel>
    in?: $Enums.content_type[] | ListEnumcontent_typeFieldRefInput<$PrismaModel>
    notIn?: $Enums.content_type[] | ListEnumcontent_typeFieldRefInput<$PrismaModel>
    not?: NestedEnumcontent_typeFilter<$PrismaModel> | $Enums.content_type
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type Enumcontent_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.content_status | Enumcontent_statusFieldRefInput<$PrismaModel>
    in?: $Enums.content_status[] | ListEnumcontent_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.content_status[] | ListEnumcontent_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumcontent_statusFilter<$PrismaModel> | $Enums.content_status
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ReviewListRelationFilter = {
    every?: reviewWhereInput
    some?: reviewWhereInput
    none?: reviewWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type reviewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type content_itemCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    difficulty?: SortOrder
    status?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type content_itemAvgOrderByAggregateInput = {
    difficulty?: SortOrder
  }

  export type content_itemMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    difficulty?: SortOrder
    status?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type content_itemMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    difficulty?: SortOrder
    status?: SortOrder
    author_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type content_itemSumOrderByAggregateInput = {
    difficulty?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type Enumcontent_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.content_type | Enumcontent_typeFieldRefInput<$PrismaModel>
    in?: $Enums.content_type[] | ListEnumcontent_typeFieldRefInput<$PrismaModel>
    notIn?: $Enums.content_type[] | ListEnumcontent_typeFieldRefInput<$PrismaModel>
    not?: NestedEnumcontent_typeWithAggregatesFilter<$PrismaModel> | $Enums.content_type
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumcontent_typeFilter<$PrismaModel>
    _max?: NestedEnumcontent_typeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type Enumcontent_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.content_status | Enumcontent_statusFieldRefInput<$PrismaModel>
    in?: $Enums.content_status[] | ListEnumcontent_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.content_status[] | ListEnumcontent_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumcontent_statusWithAggregatesFilter<$PrismaModel> | $Enums.content_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumcontent_statusFilter<$PrismaModel>
    _max?: NestedEnumcontent_statusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type Enumbundle_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.bundle_status | Enumbundle_statusFieldRefInput<$PrismaModel>
    in?: $Enums.bundle_status[] | ListEnumbundle_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.bundle_status[] | ListEnumbundle_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumbundle_statusFilter<$PrismaModel> | $Enums.bundle_status
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type Bundle_signatureListRelationFilter = {
    every?: bundle_signatureWhereInput
    some?: bundle_signatureWhereInput
    none?: bundle_signatureWhereInput
  }

  export type bundle_signatureOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type bundleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    version?: SortOrder
    status?: SortOrder
    content_ids?: SortOrder
    created_at?: SortOrder
    published_at?: SortOrder
  }

  export type bundleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    version?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    published_at?: SortOrder
  }

  export type bundleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    version?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    published_at?: SortOrder
  }

  export type Enumbundle_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.bundle_status | Enumbundle_statusFieldRefInput<$PrismaModel>
    in?: $Enums.bundle_status[] | ListEnumbundle_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.bundle_status[] | ListEnumbundle_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumbundle_statusWithAggregatesFilter<$PrismaModel> | $Enums.bundle_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumbundle_statusFilter<$PrismaModel>
    _max?: NestedEnumbundle_statusFilter<$PrismaModel>
  }

  export type BundleRelationFilter = {
    is?: bundleWhereInput
    isNot?: bundleWhereInput
  }

  export type bundle_signatureCountOrderByAggregateInput = {
    id?: SortOrder
    bundle_id?: SortOrder
    public_key_fingerprint?: SortOrder
    signature?: SortOrder
    signed_at?: SortOrder
  }

  export type bundle_signatureMaxOrderByAggregateInput = {
    id?: SortOrder
    bundle_id?: SortOrder
    public_key_fingerprint?: SortOrder
    signature?: SortOrder
    signed_at?: SortOrder
  }

  export type bundle_signatureMinOrderByAggregateInput = {
    id?: SortOrder
    bundle_id?: SortOrder
    public_key_fingerprint?: SortOrder
    signature?: SortOrder
    signed_at?: SortOrder
  }

  export type Enumreview_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.review_status | Enumreview_statusFieldRefInput<$PrismaModel>
    in?: $Enums.review_status[] | ListEnumreview_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.review_status[] | ListEnumreview_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumreview_statusFilter<$PrismaModel> | $Enums.review_status
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type Content_itemRelationFilter = {
    is?: content_itemWhereInput
    isNot?: content_itemWhereInput
  }

  export type reviewCountOrderByAggregateInput = {
    id?: SortOrder
    content_id?: SortOrder
    reviewer_id?: SortOrder
    status?: SortOrder
    comment?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type reviewMaxOrderByAggregateInput = {
    id?: SortOrder
    content_id?: SortOrder
    reviewer_id?: SortOrder
    status?: SortOrder
    comment?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type reviewMinOrderByAggregateInput = {
    id?: SortOrder
    content_id?: SortOrder
    reviewer_id?: SortOrder
    status?: SortOrder
    comment?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type Enumreview_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.review_status | Enumreview_statusFieldRefInput<$PrismaModel>
    in?: $Enums.review_status[] | ListEnumreview_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.review_status[] | ListEnumreview_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumreview_statusWithAggregatesFilter<$PrismaModel> | $Enums.review_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumreview_statusFilter<$PrismaModel>
    _max?: NestedEnumreview_statusFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type reviewCreateNestedManyWithoutContentInput = {
    create?: XOR<reviewCreateWithoutContentInput, reviewUncheckedCreateWithoutContentInput> | reviewCreateWithoutContentInput[] | reviewUncheckedCreateWithoutContentInput[]
    connectOrCreate?: reviewCreateOrConnectWithoutContentInput | reviewCreateOrConnectWithoutContentInput[]
    createMany?: reviewCreateManyContentInputEnvelope
    connect?: reviewWhereUniqueInput | reviewWhereUniqueInput[]
  }

  export type reviewUncheckedCreateNestedManyWithoutContentInput = {
    create?: XOR<reviewCreateWithoutContentInput, reviewUncheckedCreateWithoutContentInput> | reviewCreateWithoutContentInput[] | reviewUncheckedCreateWithoutContentInput[]
    connectOrCreate?: reviewCreateOrConnectWithoutContentInput | reviewCreateOrConnectWithoutContentInput[]
    createMany?: reviewCreateManyContentInputEnvelope
    connect?: reviewWhereUniqueInput | reviewWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type Enumcontent_typeFieldUpdateOperationsInput = {
    set?: $Enums.content_type
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type Enumcontent_statusFieldUpdateOperationsInput = {
    set?: $Enums.content_status
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type reviewUpdateManyWithoutContentNestedInput = {
    create?: XOR<reviewCreateWithoutContentInput, reviewUncheckedCreateWithoutContentInput> | reviewCreateWithoutContentInput[] | reviewUncheckedCreateWithoutContentInput[]
    connectOrCreate?: reviewCreateOrConnectWithoutContentInput | reviewCreateOrConnectWithoutContentInput[]
    upsert?: reviewUpsertWithWhereUniqueWithoutContentInput | reviewUpsertWithWhereUniqueWithoutContentInput[]
    createMany?: reviewCreateManyContentInputEnvelope
    set?: reviewWhereUniqueInput | reviewWhereUniqueInput[]
    disconnect?: reviewWhereUniqueInput | reviewWhereUniqueInput[]
    delete?: reviewWhereUniqueInput | reviewWhereUniqueInput[]
    connect?: reviewWhereUniqueInput | reviewWhereUniqueInput[]
    update?: reviewUpdateWithWhereUniqueWithoutContentInput | reviewUpdateWithWhereUniqueWithoutContentInput[]
    updateMany?: reviewUpdateManyWithWhereWithoutContentInput | reviewUpdateManyWithWhereWithoutContentInput[]
    deleteMany?: reviewScalarWhereInput | reviewScalarWhereInput[]
  }

  export type reviewUncheckedUpdateManyWithoutContentNestedInput = {
    create?: XOR<reviewCreateWithoutContentInput, reviewUncheckedCreateWithoutContentInput> | reviewCreateWithoutContentInput[] | reviewUncheckedCreateWithoutContentInput[]
    connectOrCreate?: reviewCreateOrConnectWithoutContentInput | reviewCreateOrConnectWithoutContentInput[]
    upsert?: reviewUpsertWithWhereUniqueWithoutContentInput | reviewUpsertWithWhereUniqueWithoutContentInput[]
    createMany?: reviewCreateManyContentInputEnvelope
    set?: reviewWhereUniqueInput | reviewWhereUniqueInput[]
    disconnect?: reviewWhereUniqueInput | reviewWhereUniqueInput[]
    delete?: reviewWhereUniqueInput | reviewWhereUniqueInput[]
    connect?: reviewWhereUniqueInput | reviewWhereUniqueInput[]
    update?: reviewUpdateWithWhereUniqueWithoutContentInput | reviewUpdateWithWhereUniqueWithoutContentInput[]
    updateMany?: reviewUpdateManyWithWhereWithoutContentInput | reviewUpdateManyWithWhereWithoutContentInput[]
    deleteMany?: reviewScalarWhereInput | reviewScalarWhereInput[]
  }

  export type bundleCreatecontent_idsInput = {
    set: string[]
  }

  export type bundle_signatureCreateNestedManyWithoutBundleInput = {
    create?: XOR<bundle_signatureCreateWithoutBundleInput, bundle_signatureUncheckedCreateWithoutBundleInput> | bundle_signatureCreateWithoutBundleInput[] | bundle_signatureUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: bundle_signatureCreateOrConnectWithoutBundleInput | bundle_signatureCreateOrConnectWithoutBundleInput[]
    createMany?: bundle_signatureCreateManyBundleInputEnvelope
    connect?: bundle_signatureWhereUniqueInput | bundle_signatureWhereUniqueInput[]
  }

  export type bundle_signatureUncheckedCreateNestedManyWithoutBundleInput = {
    create?: XOR<bundle_signatureCreateWithoutBundleInput, bundle_signatureUncheckedCreateWithoutBundleInput> | bundle_signatureCreateWithoutBundleInput[] | bundle_signatureUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: bundle_signatureCreateOrConnectWithoutBundleInput | bundle_signatureCreateOrConnectWithoutBundleInput[]
    createMany?: bundle_signatureCreateManyBundleInputEnvelope
    connect?: bundle_signatureWhereUniqueInput | bundle_signatureWhereUniqueInput[]
  }

  export type Enumbundle_statusFieldUpdateOperationsInput = {
    set?: $Enums.bundle_status
  }

  export type bundleUpdatecontent_idsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type bundle_signatureUpdateManyWithoutBundleNestedInput = {
    create?: XOR<bundle_signatureCreateWithoutBundleInput, bundle_signatureUncheckedCreateWithoutBundleInput> | bundle_signatureCreateWithoutBundleInput[] | bundle_signatureUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: bundle_signatureCreateOrConnectWithoutBundleInput | bundle_signatureCreateOrConnectWithoutBundleInput[]
    upsert?: bundle_signatureUpsertWithWhereUniqueWithoutBundleInput | bundle_signatureUpsertWithWhereUniqueWithoutBundleInput[]
    createMany?: bundle_signatureCreateManyBundleInputEnvelope
    set?: bundle_signatureWhereUniqueInput | bundle_signatureWhereUniqueInput[]
    disconnect?: bundle_signatureWhereUniqueInput | bundle_signatureWhereUniqueInput[]
    delete?: bundle_signatureWhereUniqueInput | bundle_signatureWhereUniqueInput[]
    connect?: bundle_signatureWhereUniqueInput | bundle_signatureWhereUniqueInput[]
    update?: bundle_signatureUpdateWithWhereUniqueWithoutBundleInput | bundle_signatureUpdateWithWhereUniqueWithoutBundleInput[]
    updateMany?: bundle_signatureUpdateManyWithWhereWithoutBundleInput | bundle_signatureUpdateManyWithWhereWithoutBundleInput[]
    deleteMany?: bundle_signatureScalarWhereInput | bundle_signatureScalarWhereInput[]
  }

  export type bundle_signatureUncheckedUpdateManyWithoutBundleNestedInput = {
    create?: XOR<bundle_signatureCreateWithoutBundleInput, bundle_signatureUncheckedCreateWithoutBundleInput> | bundle_signatureCreateWithoutBundleInput[] | bundle_signatureUncheckedCreateWithoutBundleInput[]
    connectOrCreate?: bundle_signatureCreateOrConnectWithoutBundleInput | bundle_signatureCreateOrConnectWithoutBundleInput[]
    upsert?: bundle_signatureUpsertWithWhereUniqueWithoutBundleInput | bundle_signatureUpsertWithWhereUniqueWithoutBundleInput[]
    createMany?: bundle_signatureCreateManyBundleInputEnvelope
    set?: bundle_signatureWhereUniqueInput | bundle_signatureWhereUniqueInput[]
    disconnect?: bundle_signatureWhereUniqueInput | bundle_signatureWhereUniqueInput[]
    delete?: bundle_signatureWhereUniqueInput | bundle_signatureWhereUniqueInput[]
    connect?: bundle_signatureWhereUniqueInput | bundle_signatureWhereUniqueInput[]
    update?: bundle_signatureUpdateWithWhereUniqueWithoutBundleInput | bundle_signatureUpdateWithWhereUniqueWithoutBundleInput[]
    updateMany?: bundle_signatureUpdateManyWithWhereWithoutBundleInput | bundle_signatureUpdateManyWithWhereWithoutBundleInput[]
    deleteMany?: bundle_signatureScalarWhereInput | bundle_signatureScalarWhereInput[]
  }

  export type bundleCreateNestedOneWithoutSignaturesInput = {
    create?: XOR<bundleCreateWithoutSignaturesInput, bundleUncheckedCreateWithoutSignaturesInput>
    connectOrCreate?: bundleCreateOrConnectWithoutSignaturesInput
    connect?: bundleWhereUniqueInput
  }

  export type bundleUpdateOneRequiredWithoutSignaturesNestedInput = {
    create?: XOR<bundleCreateWithoutSignaturesInput, bundleUncheckedCreateWithoutSignaturesInput>
    connectOrCreate?: bundleCreateOrConnectWithoutSignaturesInput
    upsert?: bundleUpsertWithoutSignaturesInput
    connect?: bundleWhereUniqueInput
    update?: XOR<XOR<bundleUpdateToOneWithWhereWithoutSignaturesInput, bundleUpdateWithoutSignaturesInput>, bundleUncheckedUpdateWithoutSignaturesInput>
  }

  export type content_itemCreateNestedOneWithoutReviewsInput = {
    create?: XOR<content_itemCreateWithoutReviewsInput, content_itemUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: content_itemCreateOrConnectWithoutReviewsInput
    connect?: content_itemWhereUniqueInput
  }

  export type Enumreview_statusFieldUpdateOperationsInput = {
    set?: $Enums.review_status
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type content_itemUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<content_itemCreateWithoutReviewsInput, content_itemUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: content_itemCreateOrConnectWithoutReviewsInput
    upsert?: content_itemUpsertWithoutReviewsInput
    connect?: content_itemWhereUniqueInput
    update?: XOR<XOR<content_itemUpdateToOneWithWhereWithoutReviewsInput, content_itemUpdateWithoutReviewsInput>, content_itemUncheckedUpdateWithoutReviewsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumcontent_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.content_type | Enumcontent_typeFieldRefInput<$PrismaModel>
    in?: $Enums.content_type[] | ListEnumcontent_typeFieldRefInput<$PrismaModel>
    notIn?: $Enums.content_type[] | ListEnumcontent_typeFieldRefInput<$PrismaModel>
    not?: NestedEnumcontent_typeFilter<$PrismaModel> | $Enums.content_type
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumcontent_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.content_status | Enumcontent_statusFieldRefInput<$PrismaModel>
    in?: $Enums.content_status[] | ListEnumcontent_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.content_status[] | ListEnumcontent_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumcontent_statusFilter<$PrismaModel> | $Enums.content_status
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumcontent_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.content_type | Enumcontent_typeFieldRefInput<$PrismaModel>
    in?: $Enums.content_type[] | ListEnumcontent_typeFieldRefInput<$PrismaModel>
    notIn?: $Enums.content_type[] | ListEnumcontent_typeFieldRefInput<$PrismaModel>
    not?: NestedEnumcontent_typeWithAggregatesFilter<$PrismaModel> | $Enums.content_type
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumcontent_typeFilter<$PrismaModel>
    _max?: NestedEnumcontent_typeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumcontent_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.content_status | Enumcontent_statusFieldRefInput<$PrismaModel>
    in?: $Enums.content_status[] | ListEnumcontent_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.content_status[] | ListEnumcontent_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumcontent_statusWithAggregatesFilter<$PrismaModel> | $Enums.content_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumcontent_statusFilter<$PrismaModel>
    _max?: NestedEnumcontent_statusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumbundle_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.bundle_status | Enumbundle_statusFieldRefInput<$PrismaModel>
    in?: $Enums.bundle_status[] | ListEnumbundle_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.bundle_status[] | ListEnumbundle_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumbundle_statusFilter<$PrismaModel> | $Enums.bundle_status
  }

  export type NestedEnumbundle_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.bundle_status | Enumbundle_statusFieldRefInput<$PrismaModel>
    in?: $Enums.bundle_status[] | ListEnumbundle_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.bundle_status[] | ListEnumbundle_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumbundle_statusWithAggregatesFilter<$PrismaModel> | $Enums.bundle_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumbundle_statusFilter<$PrismaModel>
    _max?: NestedEnumbundle_statusFilter<$PrismaModel>
  }

  export type NestedEnumreview_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.review_status | Enumreview_statusFieldRefInput<$PrismaModel>
    in?: $Enums.review_status[] | ListEnumreview_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.review_status[] | ListEnumreview_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumreview_statusFilter<$PrismaModel> | $Enums.review_status
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumreview_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.review_status | Enumreview_statusFieldRefInput<$PrismaModel>
    in?: $Enums.review_status[] | ListEnumreview_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.review_status[] | ListEnumreview_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumreview_statusWithAggregatesFilter<$PrismaModel> | $Enums.review_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumreview_statusFilter<$PrismaModel>
    _max?: NestedEnumreview_statusFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type reviewCreateWithoutContentInput = {
    id?: string
    reviewer_id: string
    status?: $Enums.review_status
    comment?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type reviewUncheckedCreateWithoutContentInput = {
    id?: string
    reviewer_id: string
    status?: $Enums.review_status
    comment?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type reviewCreateOrConnectWithoutContentInput = {
    where: reviewWhereUniqueInput
    create: XOR<reviewCreateWithoutContentInput, reviewUncheckedCreateWithoutContentInput>
  }

  export type reviewCreateManyContentInputEnvelope = {
    data: reviewCreateManyContentInput | reviewCreateManyContentInput[]
    skipDuplicates?: boolean
  }

  export type reviewUpsertWithWhereUniqueWithoutContentInput = {
    where: reviewWhereUniqueInput
    update: XOR<reviewUpdateWithoutContentInput, reviewUncheckedUpdateWithoutContentInput>
    create: XOR<reviewCreateWithoutContentInput, reviewUncheckedCreateWithoutContentInput>
  }

  export type reviewUpdateWithWhereUniqueWithoutContentInput = {
    where: reviewWhereUniqueInput
    data: XOR<reviewUpdateWithoutContentInput, reviewUncheckedUpdateWithoutContentInput>
  }

  export type reviewUpdateManyWithWhereWithoutContentInput = {
    where: reviewScalarWhereInput
    data: XOR<reviewUpdateManyMutationInput, reviewUncheckedUpdateManyWithoutContentInput>
  }

  export type reviewScalarWhereInput = {
    AND?: reviewScalarWhereInput | reviewScalarWhereInput[]
    OR?: reviewScalarWhereInput[]
    NOT?: reviewScalarWhereInput | reviewScalarWhereInput[]
    id?: StringFilter<"review"> | string
    content_id?: StringFilter<"review"> | string
    reviewer_id?: StringFilter<"review"> | string
    status?: Enumreview_statusFilter<"review"> | $Enums.review_status
    comment?: StringNullableFilter<"review"> | string | null
    created_at?: DateTimeFilter<"review"> | Date | string
    updated_at?: DateTimeFilter<"review"> | Date | string
  }

  export type bundle_signatureCreateWithoutBundleInput = {
    id?: string
    public_key_fingerprint: string
    signature: string
    signed_at?: Date | string
  }

  export type bundle_signatureUncheckedCreateWithoutBundleInput = {
    id?: string
    public_key_fingerprint: string
    signature: string
    signed_at?: Date | string
  }

  export type bundle_signatureCreateOrConnectWithoutBundleInput = {
    where: bundle_signatureWhereUniqueInput
    create: XOR<bundle_signatureCreateWithoutBundleInput, bundle_signatureUncheckedCreateWithoutBundleInput>
  }

  export type bundle_signatureCreateManyBundleInputEnvelope = {
    data: bundle_signatureCreateManyBundleInput | bundle_signatureCreateManyBundleInput[]
    skipDuplicates?: boolean
  }

  export type bundle_signatureUpsertWithWhereUniqueWithoutBundleInput = {
    where: bundle_signatureWhereUniqueInput
    update: XOR<bundle_signatureUpdateWithoutBundleInput, bundle_signatureUncheckedUpdateWithoutBundleInput>
    create: XOR<bundle_signatureCreateWithoutBundleInput, bundle_signatureUncheckedCreateWithoutBundleInput>
  }

  export type bundle_signatureUpdateWithWhereUniqueWithoutBundleInput = {
    where: bundle_signatureWhereUniqueInput
    data: XOR<bundle_signatureUpdateWithoutBundleInput, bundle_signatureUncheckedUpdateWithoutBundleInput>
  }

  export type bundle_signatureUpdateManyWithWhereWithoutBundleInput = {
    where: bundle_signatureScalarWhereInput
    data: XOR<bundle_signatureUpdateManyMutationInput, bundle_signatureUncheckedUpdateManyWithoutBundleInput>
  }

  export type bundle_signatureScalarWhereInput = {
    AND?: bundle_signatureScalarWhereInput | bundle_signatureScalarWhereInput[]
    OR?: bundle_signatureScalarWhereInput[]
    NOT?: bundle_signatureScalarWhereInput | bundle_signatureScalarWhereInput[]
    id?: StringFilter<"bundle_signature"> | string
    bundle_id?: StringFilter<"bundle_signature"> | string
    public_key_fingerprint?: StringFilter<"bundle_signature"> | string
    signature?: StringFilter<"bundle_signature"> | string
    signed_at?: DateTimeFilter<"bundle_signature"> | Date | string
  }

  export type bundleCreateWithoutSignaturesInput = {
    id?: string
    name: string
    version?: string
    status?: $Enums.bundle_status
    content_ids?: bundleCreatecontent_idsInput | string[]
    created_at?: Date | string
    published_at?: Date | string | null
  }

  export type bundleUncheckedCreateWithoutSignaturesInput = {
    id?: string
    name: string
    version?: string
    status?: $Enums.bundle_status
    content_ids?: bundleCreatecontent_idsInput | string[]
    created_at?: Date | string
    published_at?: Date | string | null
  }

  export type bundleCreateOrConnectWithoutSignaturesInput = {
    where: bundleWhereUniqueInput
    create: XOR<bundleCreateWithoutSignaturesInput, bundleUncheckedCreateWithoutSignaturesInput>
  }

  export type bundleUpsertWithoutSignaturesInput = {
    update: XOR<bundleUpdateWithoutSignaturesInput, bundleUncheckedUpdateWithoutSignaturesInput>
    create: XOR<bundleCreateWithoutSignaturesInput, bundleUncheckedCreateWithoutSignaturesInput>
    where?: bundleWhereInput
  }

  export type bundleUpdateToOneWithWhereWithoutSignaturesInput = {
    where?: bundleWhereInput
    data: XOR<bundleUpdateWithoutSignaturesInput, bundleUncheckedUpdateWithoutSignaturesInput>
  }

  export type bundleUpdateWithoutSignaturesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: Enumbundle_statusFieldUpdateOperationsInput | $Enums.bundle_status
    content_ids?: bundleUpdatecontent_idsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type bundleUncheckedUpdateWithoutSignaturesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: Enumbundle_statusFieldUpdateOperationsInput | $Enums.bundle_status
    content_ids?: bundleUpdatecontent_idsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    published_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type content_itemCreateWithoutReviewsInput = {
    id?: string
    type: $Enums.content_type
    title: string
    body: string
    difficulty?: number
    status?: $Enums.content_status
    author_id: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type content_itemUncheckedCreateWithoutReviewsInput = {
    id?: string
    type: $Enums.content_type
    title: string
    body: string
    difficulty?: number
    status?: $Enums.content_status
    author_id: string
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type content_itemCreateOrConnectWithoutReviewsInput = {
    where: content_itemWhereUniqueInput
    create: XOR<content_itemCreateWithoutReviewsInput, content_itemUncheckedCreateWithoutReviewsInput>
  }

  export type content_itemUpsertWithoutReviewsInput = {
    update: XOR<content_itemUpdateWithoutReviewsInput, content_itemUncheckedUpdateWithoutReviewsInput>
    create: XOR<content_itemCreateWithoutReviewsInput, content_itemUncheckedCreateWithoutReviewsInput>
    where?: content_itemWhereInput
  }

  export type content_itemUpdateToOneWithWhereWithoutReviewsInput = {
    where?: content_itemWhereInput
    data: XOR<content_itemUpdateWithoutReviewsInput, content_itemUncheckedUpdateWithoutReviewsInput>
  }

  export type content_itemUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumcontent_typeFieldUpdateOperationsInput | $Enums.content_type
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    status?: Enumcontent_statusFieldUpdateOperationsInput | $Enums.content_status
    author_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type content_itemUncheckedUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumcontent_typeFieldUpdateOperationsInput | $Enums.content_type
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    status?: Enumcontent_statusFieldUpdateOperationsInput | $Enums.content_status
    author_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type reviewCreateManyContentInput = {
    id?: string
    reviewer_id: string
    status?: $Enums.review_status
    comment?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type reviewUpdateWithoutContentInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewer_id?: StringFieldUpdateOperationsInput | string
    status?: Enumreview_statusFieldUpdateOperationsInput | $Enums.review_status
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type reviewUncheckedUpdateWithoutContentInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewer_id?: StringFieldUpdateOperationsInput | string
    status?: Enumreview_statusFieldUpdateOperationsInput | $Enums.review_status
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type reviewUncheckedUpdateManyWithoutContentInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewer_id?: StringFieldUpdateOperationsInput | string
    status?: Enumreview_statusFieldUpdateOperationsInput | $Enums.review_status
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bundle_signatureCreateManyBundleInput = {
    id?: string
    public_key_fingerprint: string
    signature: string
    signed_at?: Date | string
  }

  export type bundle_signatureUpdateWithoutBundleInput = {
    id?: StringFieldUpdateOperationsInput | string
    public_key_fingerprint?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    signed_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bundle_signatureUncheckedUpdateWithoutBundleInput = {
    id?: StringFieldUpdateOperationsInput | string
    public_key_fingerprint?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    signed_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bundle_signatureUncheckedUpdateManyWithoutBundleInput = {
    id?: StringFieldUpdateOperationsInput | string
    public_key_fingerprint?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    signed_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use Content_itemCountOutputTypeDefaultArgs instead
     */
    export type Content_itemCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Content_itemCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BundleCountOutputTypeDefaultArgs instead
     */
    export type BundleCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BundleCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use content_itemDefaultArgs instead
     */
    export type content_itemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = content_itemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use bundleDefaultArgs instead
     */
    export type bundleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = bundleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use bundle_signatureDefaultArgs instead
     */
    export type bundle_signatureArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = bundle_signatureDefaultArgs<ExtArgs>
    /**
     * @deprecated Use reviewDefaultArgs instead
     */
    export type reviewArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = reviewDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}