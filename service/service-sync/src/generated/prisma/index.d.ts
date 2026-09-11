
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
 * Model device
 * 
 */
export type device = $Result.DefaultSelection<Prisma.$devicePayload>
/**
 * Model sync_log
 * 
 */
export type sync_log = $Result.DefaultSelection<Prisma.$sync_logPayload>
/**
 * Model sync_conflict
 * 
 */
export type sync_conflict = $Result.DefaultSelection<Prisma.$sync_conflictPayload>
/**
 * Model student_transfer
 * 
 */
export type student_transfer = $Result.DefaultSelection<Prisma.$student_transferPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const device_type: {
  ANDROID: 'ANDROID',
  WINDOWS: 'WINDOWS',
  TABLET: 'TABLET'
};

export type device_type = (typeof device_type)[keyof typeof device_type]


export const sync_direction: {
  PUSH: 'PUSH',
  PULL: 'PULL'
};

export type sync_direction = (typeof sync_direction)[keyof typeof sync_direction]


export const sync_status: {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type sync_status = (typeof sync_status)[keyof typeof sync_status]


export const conflict_resolution: {
  SERVER_WINS: 'SERVER_WINS',
  CLIENT_WINS: 'CLIENT_WINS',
  MERGED: 'MERGED'
};

export type conflict_resolution = (typeof conflict_resolution)[keyof typeof conflict_resolution]


export const transfer_status: {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type transfer_status = (typeof transfer_status)[keyof typeof transfer_status]

}

export type device_type = $Enums.device_type

export const device_type: typeof $Enums.device_type

export type sync_direction = $Enums.sync_direction

export const sync_direction: typeof $Enums.sync_direction

export type sync_status = $Enums.sync_status

export const sync_status: typeof $Enums.sync_status

export type conflict_resolution = $Enums.conflict_resolution

export const conflict_resolution: typeof $Enums.conflict_resolution

export type transfer_status = $Enums.transfer_status

export const transfer_status: typeof $Enums.transfer_status

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Devices
 * const devices = await prisma.device.findMany()
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
   * // Fetch zero or more Devices
   * const devices = await prisma.device.findMany()
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
   * `prisma.device`: Exposes CRUD operations for the **device** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Devices
    * const devices = await prisma.device.findMany()
    * ```
    */
  get device(): Prisma.deviceDelegate<ExtArgs>;

  /**
   * `prisma.sync_log`: Exposes CRUD operations for the **sync_log** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sync_logs
    * const sync_logs = await prisma.sync_log.findMany()
    * ```
    */
  get sync_log(): Prisma.sync_logDelegate<ExtArgs>;

  /**
   * `prisma.sync_conflict`: Exposes CRUD operations for the **sync_conflict** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sync_conflicts
    * const sync_conflicts = await prisma.sync_conflict.findMany()
    * ```
    */
  get sync_conflict(): Prisma.sync_conflictDelegate<ExtArgs>;

  /**
   * `prisma.student_transfer`: Exposes CRUD operations for the **student_transfer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Student_transfers
    * const student_transfers = await prisma.student_transfer.findMany()
    * ```
    */
  get student_transfer(): Prisma.student_transferDelegate<ExtArgs>;
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
    device: 'device',
    sync_log: 'sync_log',
    sync_conflict: 'sync_conflict',
    student_transfer: 'student_transfer'
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
      modelProps: "device" | "sync_log" | "sync_conflict" | "student_transfer"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      device: {
        payload: Prisma.$devicePayload<ExtArgs>
        fields: Prisma.deviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.deviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.deviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicePayload>
          }
          findFirst: {
            args: Prisma.deviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.deviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicePayload>
          }
          findMany: {
            args: Prisma.deviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicePayload>[]
          }
          create: {
            args: Prisma.deviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicePayload>
          }
          createMany: {
            args: Prisma.deviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.deviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicePayload>[]
          }
          delete: {
            args: Prisma.deviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicePayload>
          }
          update: {
            args: Prisma.deviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicePayload>
          }
          deleteMany: {
            args: Prisma.deviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.deviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.deviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicePayload>
          }
          aggregate: {
            args: Prisma.DeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDevice>
          }
          groupBy: {
            args: Prisma.deviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.deviceCountArgs<ExtArgs>
            result: $Utils.Optional<DeviceCountAggregateOutputType> | number
          }
        }
      }
      sync_log: {
        payload: Prisma.$sync_logPayload<ExtArgs>
        fields: Prisma.sync_logFieldRefs
        operations: {
          findUnique: {
            args: Prisma.sync_logFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.sync_logFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>
          }
          findFirst: {
            args: Prisma.sync_logFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.sync_logFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>
          }
          findMany: {
            args: Prisma.sync_logFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>[]
          }
          create: {
            args: Prisma.sync_logCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>
          }
          createMany: {
            args: Prisma.sync_logCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.sync_logCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>[]
          }
          delete: {
            args: Prisma.sync_logDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>
          }
          update: {
            args: Prisma.sync_logUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>
          }
          deleteMany: {
            args: Prisma.sync_logDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.sync_logUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.sync_logUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>
          }
          aggregate: {
            args: Prisma.Sync_logAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSync_log>
          }
          groupBy: {
            args: Prisma.sync_logGroupByArgs<ExtArgs>
            result: $Utils.Optional<Sync_logGroupByOutputType>[]
          }
          count: {
            args: Prisma.sync_logCountArgs<ExtArgs>
            result: $Utils.Optional<Sync_logCountAggregateOutputType> | number
          }
        }
      }
      sync_conflict: {
        payload: Prisma.$sync_conflictPayload<ExtArgs>
        fields: Prisma.sync_conflictFieldRefs
        operations: {
          findUnique: {
            args: Prisma.sync_conflictFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_conflictPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.sync_conflictFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_conflictPayload>
          }
          findFirst: {
            args: Prisma.sync_conflictFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_conflictPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.sync_conflictFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_conflictPayload>
          }
          findMany: {
            args: Prisma.sync_conflictFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_conflictPayload>[]
          }
          create: {
            args: Prisma.sync_conflictCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_conflictPayload>
          }
          createMany: {
            args: Prisma.sync_conflictCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.sync_conflictCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_conflictPayload>[]
          }
          delete: {
            args: Prisma.sync_conflictDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_conflictPayload>
          }
          update: {
            args: Prisma.sync_conflictUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_conflictPayload>
          }
          deleteMany: {
            args: Prisma.sync_conflictDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.sync_conflictUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.sync_conflictUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_conflictPayload>
          }
          aggregate: {
            args: Prisma.Sync_conflictAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSync_conflict>
          }
          groupBy: {
            args: Prisma.sync_conflictGroupByArgs<ExtArgs>
            result: $Utils.Optional<Sync_conflictGroupByOutputType>[]
          }
          count: {
            args: Prisma.sync_conflictCountArgs<ExtArgs>
            result: $Utils.Optional<Sync_conflictCountAggregateOutputType> | number
          }
        }
      }
      student_transfer: {
        payload: Prisma.$student_transferPayload<ExtArgs>
        fields: Prisma.student_transferFieldRefs
        operations: {
          findUnique: {
            args: Prisma.student_transferFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_transferPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.student_transferFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_transferPayload>
          }
          findFirst: {
            args: Prisma.student_transferFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_transferPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.student_transferFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_transferPayload>
          }
          findMany: {
            args: Prisma.student_transferFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_transferPayload>[]
          }
          create: {
            args: Prisma.student_transferCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_transferPayload>
          }
          createMany: {
            args: Prisma.student_transferCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.student_transferCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_transferPayload>[]
          }
          delete: {
            args: Prisma.student_transferDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_transferPayload>
          }
          update: {
            args: Prisma.student_transferUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_transferPayload>
          }
          deleteMany: {
            args: Prisma.student_transferDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.student_transferUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.student_transferUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_transferPayload>
          }
          aggregate: {
            args: Prisma.Student_transferAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudent_transfer>
          }
          groupBy: {
            args: Prisma.student_transferGroupByArgs<ExtArgs>
            result: $Utils.Optional<Student_transferGroupByOutputType>[]
          }
          count: {
            args: Prisma.student_transferCountArgs<ExtArgs>
            result: $Utils.Optional<Student_transferCountAggregateOutputType> | number
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
   * Count Type DeviceCountOutputType
   */

  export type DeviceCountOutputType = {
    sync_logs: number
    conflicts: number
  }

  export type DeviceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sync_logs?: boolean | DeviceCountOutputTypeCountSync_logsArgs
    conflicts?: boolean | DeviceCountOutputTypeCountConflictsArgs
  }

  // Custom InputTypes
  /**
   * DeviceCountOutputType without action
   */
  export type DeviceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceCountOutputType
     */
    select?: DeviceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DeviceCountOutputType without action
   */
  export type DeviceCountOutputTypeCountSync_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sync_logWhereInput
  }

  /**
   * DeviceCountOutputType without action
   */
  export type DeviceCountOutputTypeCountConflictsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sync_conflictWhereInput
  }


  /**
   * Models
   */

  /**
   * Model device
   */

  export type AggregateDevice = {
    _count: DeviceCountAggregateOutputType | null
    _min: DeviceMinAggregateOutputType | null
    _max: DeviceMaxAggregateOutputType | null
  }

  export type DeviceMinAggregateOutputType = {
    id: string | null
    type: $Enums.device_type | null
    name: string | null
    last_seen_at: Date | null
    created_at: Date | null
    deleted_at: Date | null
  }

  export type DeviceMaxAggregateOutputType = {
    id: string | null
    type: $Enums.device_type | null
    name: string | null
    last_seen_at: Date | null
    created_at: Date | null
    deleted_at: Date | null
  }

  export type DeviceCountAggregateOutputType = {
    id: number
    type: number
    name: number
    last_seen_at: number
    created_at: number
    deleted_at: number
    _all: number
  }


  export type DeviceMinAggregateInputType = {
    id?: true
    type?: true
    name?: true
    last_seen_at?: true
    created_at?: true
    deleted_at?: true
  }

  export type DeviceMaxAggregateInputType = {
    id?: true
    type?: true
    name?: true
    last_seen_at?: true
    created_at?: true
    deleted_at?: true
  }

  export type DeviceCountAggregateInputType = {
    id?: true
    type?: true
    name?: true
    last_seen_at?: true
    created_at?: true
    deleted_at?: true
    _all?: true
  }

  export type DeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which device to aggregate.
     */
    where?: deviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of devices to fetch.
     */
    orderBy?: deviceOrderByWithRelationInput | deviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: deviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned devices
    **/
    _count?: true | DeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeviceMaxAggregateInputType
  }

  export type GetDeviceAggregateType<T extends DeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDevice[P]>
      : GetScalarType<T[P], AggregateDevice[P]>
  }




  export type deviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: deviceWhereInput
    orderBy?: deviceOrderByWithAggregationInput | deviceOrderByWithAggregationInput[]
    by: DeviceScalarFieldEnum[] | DeviceScalarFieldEnum
    having?: deviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeviceCountAggregateInputType | true
    _min?: DeviceMinAggregateInputType
    _max?: DeviceMaxAggregateInputType
  }

  export type DeviceGroupByOutputType = {
    id: string
    type: $Enums.device_type
    name: string
    last_seen_at: Date
    created_at: Date
    deleted_at: Date | null
    _count: DeviceCountAggregateOutputType | null
    _min: DeviceMinAggregateOutputType | null
    _max: DeviceMaxAggregateOutputType | null
  }

  type GetDeviceGroupByPayload<T extends deviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeviceGroupByOutputType[P]>
            : GetScalarType<T[P], DeviceGroupByOutputType[P]>
        }
      >
    >


  export type deviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    name?: boolean
    last_seen_at?: boolean
    created_at?: boolean
    deleted_at?: boolean
    sync_logs?: boolean | device$sync_logsArgs<ExtArgs>
    conflicts?: boolean | device$conflictsArgs<ExtArgs>
    _count?: boolean | DeviceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type deviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    name?: boolean
    last_seen_at?: boolean
    created_at?: boolean
    deleted_at?: boolean
  }, ExtArgs["result"]["device"]>

  export type deviceSelectScalar = {
    id?: boolean
    type?: boolean
    name?: boolean
    last_seen_at?: boolean
    created_at?: boolean
    deleted_at?: boolean
  }

  export type deviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sync_logs?: boolean | device$sync_logsArgs<ExtArgs>
    conflicts?: boolean | device$conflictsArgs<ExtArgs>
    _count?: boolean | DeviceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type deviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $devicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "device"
    objects: {
      sync_logs: Prisma.$sync_logPayload<ExtArgs>[]
      conflicts: Prisma.$sync_conflictPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: $Enums.device_type
      name: string
      last_seen_at: Date
      created_at: Date
      deleted_at: Date | null
    }, ExtArgs["result"]["device"]>
    composites: {}
  }

  type deviceGetPayload<S extends boolean | null | undefined | deviceDefaultArgs> = $Result.GetResult<Prisma.$devicePayload, S>

  type deviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<deviceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DeviceCountAggregateInputType | true
    }

  export interface deviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['device'], meta: { name: 'device' } }
    /**
     * Find zero or one Device that matches the filter.
     * @param {deviceFindUniqueArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends deviceFindUniqueArgs>(args: SelectSubset<T, deviceFindUniqueArgs<ExtArgs>>): Prisma__deviceClient<$Result.GetResult<Prisma.$devicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Device that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {deviceFindUniqueOrThrowArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends deviceFindUniqueOrThrowArgs>(args: SelectSubset<T, deviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__deviceClient<$Result.GetResult<Prisma.$devicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Device that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {deviceFindFirstArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends deviceFindFirstArgs>(args?: SelectSubset<T, deviceFindFirstArgs<ExtArgs>>): Prisma__deviceClient<$Result.GetResult<Prisma.$devicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Device that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {deviceFindFirstOrThrowArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends deviceFindFirstOrThrowArgs>(args?: SelectSubset<T, deviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__deviceClient<$Result.GetResult<Prisma.$devicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Devices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {deviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Devices
     * const devices = await prisma.device.findMany()
     * 
     * // Get first 10 Devices
     * const devices = await prisma.device.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deviceWithIdOnly = await prisma.device.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends deviceFindManyArgs>(args?: SelectSubset<T, deviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$devicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Device.
     * @param {deviceCreateArgs} args - Arguments to create a Device.
     * @example
     * // Create one Device
     * const Device = await prisma.device.create({
     *   data: {
     *     // ... data to create a Device
     *   }
     * })
     * 
     */
    create<T extends deviceCreateArgs>(args: SelectSubset<T, deviceCreateArgs<ExtArgs>>): Prisma__deviceClient<$Result.GetResult<Prisma.$devicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Devices.
     * @param {deviceCreateManyArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const device = await prisma.device.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends deviceCreateManyArgs>(args?: SelectSubset<T, deviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Devices and returns the data saved in the database.
     * @param {deviceCreateManyAndReturnArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const device = await prisma.device.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Devices and only return the `id`
     * const deviceWithIdOnly = await prisma.device.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends deviceCreateManyAndReturnArgs>(args?: SelectSubset<T, deviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$devicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Device.
     * @param {deviceDeleteArgs} args - Arguments to delete one Device.
     * @example
     * // Delete one Device
     * const Device = await prisma.device.delete({
     *   where: {
     *     // ... filter to delete one Device
     *   }
     * })
     * 
     */
    delete<T extends deviceDeleteArgs>(args: SelectSubset<T, deviceDeleteArgs<ExtArgs>>): Prisma__deviceClient<$Result.GetResult<Prisma.$devicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Device.
     * @param {deviceUpdateArgs} args - Arguments to update one Device.
     * @example
     * // Update one Device
     * const device = await prisma.device.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends deviceUpdateArgs>(args: SelectSubset<T, deviceUpdateArgs<ExtArgs>>): Prisma__deviceClient<$Result.GetResult<Prisma.$devicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Devices.
     * @param {deviceDeleteManyArgs} args - Arguments to filter Devices to delete.
     * @example
     * // Delete a few Devices
     * const { count } = await prisma.device.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends deviceDeleteManyArgs>(args?: SelectSubset<T, deviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {deviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Devices
     * const device = await prisma.device.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends deviceUpdateManyArgs>(args: SelectSubset<T, deviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Device.
     * @param {deviceUpsertArgs} args - Arguments to update or create a Device.
     * @example
     * // Update or create a Device
     * const device = await prisma.device.upsert({
     *   create: {
     *     // ... data to create a Device
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Device we want to update
     *   }
     * })
     */
    upsert<T extends deviceUpsertArgs>(args: SelectSubset<T, deviceUpsertArgs<ExtArgs>>): Prisma__deviceClient<$Result.GetResult<Prisma.$devicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {deviceCountArgs} args - Arguments to filter Devices to count.
     * @example
     * // Count the number of Devices
     * const count = await prisma.device.count({
     *   where: {
     *     // ... the filter for the Devices we want to count
     *   }
     * })
    **/
    count<T extends deviceCountArgs>(
      args?: Subset<T, deviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Device.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DeviceAggregateArgs>(args: Subset<T, DeviceAggregateArgs>): Prisma.PrismaPromise<GetDeviceAggregateType<T>>

    /**
     * Group by Device.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {deviceGroupByArgs} args - Group by arguments.
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
      T extends deviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: deviceGroupByArgs['orderBy'] }
        : { orderBy?: deviceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, deviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the device model
   */
  readonly fields: deviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for device.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__deviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sync_logs<T extends device$sync_logsArgs<ExtArgs> = {}>(args?: Subset<T, device$sync_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "findMany"> | Null>
    conflicts<T extends device$conflictsArgs<ExtArgs> = {}>(args?: Subset<T, device$conflictsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sync_conflictPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the device model
   */ 
  interface deviceFieldRefs {
    readonly id: FieldRef<"device", 'String'>
    readonly type: FieldRef<"device", 'device_type'>
    readonly name: FieldRef<"device", 'String'>
    readonly last_seen_at: FieldRef<"device", 'DateTime'>
    readonly created_at: FieldRef<"device", 'DateTime'>
    readonly deleted_at: FieldRef<"device", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * device findUnique
   */
  export type deviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the device
     */
    select?: deviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: deviceInclude<ExtArgs> | null
    /**
     * Filter, which device to fetch.
     */
    where: deviceWhereUniqueInput
  }

  /**
   * device findUniqueOrThrow
   */
  export type deviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the device
     */
    select?: deviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: deviceInclude<ExtArgs> | null
    /**
     * Filter, which device to fetch.
     */
    where: deviceWhereUniqueInput
  }

  /**
   * device findFirst
   */
  export type deviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the device
     */
    select?: deviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: deviceInclude<ExtArgs> | null
    /**
     * Filter, which device to fetch.
     */
    where?: deviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of devices to fetch.
     */
    orderBy?: deviceOrderByWithRelationInput | deviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for devices.
     */
    cursor?: deviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of devices.
     */
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * device findFirstOrThrow
   */
  export type deviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the device
     */
    select?: deviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: deviceInclude<ExtArgs> | null
    /**
     * Filter, which device to fetch.
     */
    where?: deviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of devices to fetch.
     */
    orderBy?: deviceOrderByWithRelationInput | deviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for devices.
     */
    cursor?: deviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of devices.
     */
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * device findMany
   */
  export type deviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the device
     */
    select?: deviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: deviceInclude<ExtArgs> | null
    /**
     * Filter, which devices to fetch.
     */
    where?: deviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of devices to fetch.
     */
    orderBy?: deviceOrderByWithRelationInput | deviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing devices.
     */
    cursor?: deviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` devices.
     */
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * device create
   */
  export type deviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the device
     */
    select?: deviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: deviceInclude<ExtArgs> | null
    /**
     * The data needed to create a device.
     */
    data: XOR<deviceCreateInput, deviceUncheckedCreateInput>
  }

  /**
   * device createMany
   */
  export type deviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many devices.
     */
    data: deviceCreateManyInput | deviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * device createManyAndReturn
   */
  export type deviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the device
     */
    select?: deviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many devices.
     */
    data: deviceCreateManyInput | deviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * device update
   */
  export type deviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the device
     */
    select?: deviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: deviceInclude<ExtArgs> | null
    /**
     * The data needed to update a device.
     */
    data: XOR<deviceUpdateInput, deviceUncheckedUpdateInput>
    /**
     * Choose, which device to update.
     */
    where: deviceWhereUniqueInput
  }

  /**
   * device updateMany
   */
  export type deviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update devices.
     */
    data: XOR<deviceUpdateManyMutationInput, deviceUncheckedUpdateManyInput>
    /**
     * Filter which devices to update
     */
    where?: deviceWhereInput
  }

  /**
   * device upsert
   */
  export type deviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the device
     */
    select?: deviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: deviceInclude<ExtArgs> | null
    /**
     * The filter to search for the device to update in case it exists.
     */
    where: deviceWhereUniqueInput
    /**
     * In case the device found by the `where` argument doesn't exist, create a new device with this data.
     */
    create: XOR<deviceCreateInput, deviceUncheckedCreateInput>
    /**
     * In case the device was found with the provided `where` argument, update it with this data.
     */
    update: XOR<deviceUpdateInput, deviceUncheckedUpdateInput>
  }

  /**
   * device delete
   */
  export type deviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the device
     */
    select?: deviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: deviceInclude<ExtArgs> | null
    /**
     * Filter which device to delete.
     */
    where: deviceWhereUniqueInput
  }

  /**
   * device deleteMany
   */
  export type deviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which devices to delete
     */
    where?: deviceWhereInput
  }

  /**
   * device.sync_logs
   */
  export type device$sync_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    where?: sync_logWhereInput
    orderBy?: sync_logOrderByWithRelationInput | sync_logOrderByWithRelationInput[]
    cursor?: sync_logWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Sync_logScalarFieldEnum | Sync_logScalarFieldEnum[]
  }

  /**
   * device.conflicts
   */
  export type device$conflictsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_conflict
     */
    select?: sync_conflictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_conflictInclude<ExtArgs> | null
    where?: sync_conflictWhereInput
    orderBy?: sync_conflictOrderByWithRelationInput | sync_conflictOrderByWithRelationInput[]
    cursor?: sync_conflictWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Sync_conflictScalarFieldEnum | Sync_conflictScalarFieldEnum[]
  }

  /**
   * device without action
   */
  export type deviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the device
     */
    select?: deviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: deviceInclude<ExtArgs> | null
  }


  /**
   * Model sync_log
   */

  export type AggregateSync_log = {
    _count: Sync_logCountAggregateOutputType | null
    _avg: Sync_logAvgAggregateOutputType | null
    _sum: Sync_logSumAggregateOutputType | null
    _min: Sync_logMinAggregateOutputType | null
    _max: Sync_logMaxAggregateOutputType | null
  }

  export type Sync_logAvgAggregateOutputType = {
    record_count: number | null
  }

  export type Sync_logSumAggregateOutputType = {
    record_count: number | null
  }

  export type Sync_logMinAggregateOutputType = {
    id: string | null
    device_id: string | null
    direction: $Enums.sync_direction | null
    status: $Enums.sync_status | null
    record_count: number | null
    created_at: Date | null
    completed_at: Date | null
    error_message: string | null
  }

  export type Sync_logMaxAggregateOutputType = {
    id: string | null
    device_id: string | null
    direction: $Enums.sync_direction | null
    status: $Enums.sync_status | null
    record_count: number | null
    created_at: Date | null
    completed_at: Date | null
    error_message: string | null
  }

  export type Sync_logCountAggregateOutputType = {
    id: number
    device_id: number
    direction: number
    status: number
    record_count: number
    created_at: number
    completed_at: number
    error_message: number
    _all: number
  }


  export type Sync_logAvgAggregateInputType = {
    record_count?: true
  }

  export type Sync_logSumAggregateInputType = {
    record_count?: true
  }

  export type Sync_logMinAggregateInputType = {
    id?: true
    device_id?: true
    direction?: true
    status?: true
    record_count?: true
    created_at?: true
    completed_at?: true
    error_message?: true
  }

  export type Sync_logMaxAggregateInputType = {
    id?: true
    device_id?: true
    direction?: true
    status?: true
    record_count?: true
    created_at?: true
    completed_at?: true
    error_message?: true
  }

  export type Sync_logCountAggregateInputType = {
    id?: true
    device_id?: true
    direction?: true
    status?: true
    record_count?: true
    created_at?: true
    completed_at?: true
    error_message?: true
    _all?: true
  }

  export type Sync_logAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sync_log to aggregate.
     */
    where?: sync_logWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sync_logs to fetch.
     */
    orderBy?: sync_logOrderByWithRelationInput | sync_logOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: sync_logWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sync_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sync_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned sync_logs
    **/
    _count?: true | Sync_logCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Sync_logAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Sync_logSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Sync_logMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Sync_logMaxAggregateInputType
  }

  export type GetSync_logAggregateType<T extends Sync_logAggregateArgs> = {
        [P in keyof T & keyof AggregateSync_log]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSync_log[P]>
      : GetScalarType<T[P], AggregateSync_log[P]>
  }




  export type sync_logGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sync_logWhereInput
    orderBy?: sync_logOrderByWithAggregationInput | sync_logOrderByWithAggregationInput[]
    by: Sync_logScalarFieldEnum[] | Sync_logScalarFieldEnum
    having?: sync_logScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Sync_logCountAggregateInputType | true
    _avg?: Sync_logAvgAggregateInputType
    _sum?: Sync_logSumAggregateInputType
    _min?: Sync_logMinAggregateInputType
    _max?: Sync_logMaxAggregateInputType
  }

  export type Sync_logGroupByOutputType = {
    id: string
    device_id: string
    direction: $Enums.sync_direction
    status: $Enums.sync_status
    record_count: number
    created_at: Date
    completed_at: Date | null
    error_message: string | null
    _count: Sync_logCountAggregateOutputType | null
    _avg: Sync_logAvgAggregateOutputType | null
    _sum: Sync_logSumAggregateOutputType | null
    _min: Sync_logMinAggregateOutputType | null
    _max: Sync_logMaxAggregateOutputType | null
  }

  type GetSync_logGroupByPayload<T extends sync_logGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Sync_logGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Sync_logGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Sync_logGroupByOutputType[P]>
            : GetScalarType<T[P], Sync_logGroupByOutputType[P]>
        }
      >
    >


  export type sync_logSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    device_id?: boolean
    direction?: boolean
    status?: boolean
    record_count?: boolean
    created_at?: boolean
    completed_at?: boolean
    error_message?: boolean
    device?: boolean | deviceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sync_log"]>

  export type sync_logSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    device_id?: boolean
    direction?: boolean
    status?: boolean
    record_count?: boolean
    created_at?: boolean
    completed_at?: boolean
    error_message?: boolean
    device?: boolean | deviceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sync_log"]>

  export type sync_logSelectScalar = {
    id?: boolean
    device_id?: boolean
    direction?: boolean
    status?: boolean
    record_count?: boolean
    created_at?: boolean
    completed_at?: boolean
    error_message?: boolean
  }

  export type sync_logInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | deviceDefaultArgs<ExtArgs>
  }
  export type sync_logIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | deviceDefaultArgs<ExtArgs>
  }

  export type $sync_logPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "sync_log"
    objects: {
      device: Prisma.$devicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      device_id: string
      direction: $Enums.sync_direction
      status: $Enums.sync_status
      record_count: number
      created_at: Date
      completed_at: Date | null
      error_message: string | null
    }, ExtArgs["result"]["sync_log"]>
    composites: {}
  }

  type sync_logGetPayload<S extends boolean | null | undefined | sync_logDefaultArgs> = $Result.GetResult<Prisma.$sync_logPayload, S>

  type sync_logCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<sync_logFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Sync_logCountAggregateInputType | true
    }

  export interface sync_logDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['sync_log'], meta: { name: 'sync_log' } }
    /**
     * Find zero or one Sync_log that matches the filter.
     * @param {sync_logFindUniqueArgs} args - Arguments to find a Sync_log
     * @example
     * // Get one Sync_log
     * const sync_log = await prisma.sync_log.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends sync_logFindUniqueArgs>(args: SelectSubset<T, sync_logFindUniqueArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Sync_log that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {sync_logFindUniqueOrThrowArgs} args - Arguments to find a Sync_log
     * @example
     * // Get one Sync_log
     * const sync_log = await prisma.sync_log.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends sync_logFindUniqueOrThrowArgs>(args: SelectSubset<T, sync_logFindUniqueOrThrowArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Sync_log that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_logFindFirstArgs} args - Arguments to find a Sync_log
     * @example
     * // Get one Sync_log
     * const sync_log = await prisma.sync_log.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends sync_logFindFirstArgs>(args?: SelectSubset<T, sync_logFindFirstArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Sync_log that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_logFindFirstOrThrowArgs} args - Arguments to find a Sync_log
     * @example
     * // Get one Sync_log
     * const sync_log = await prisma.sync_log.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends sync_logFindFirstOrThrowArgs>(args?: SelectSubset<T, sync_logFindFirstOrThrowArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Sync_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_logFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sync_logs
     * const sync_logs = await prisma.sync_log.findMany()
     * 
     * // Get first 10 Sync_logs
     * const sync_logs = await prisma.sync_log.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sync_logWithIdOnly = await prisma.sync_log.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends sync_logFindManyArgs>(args?: SelectSubset<T, sync_logFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Sync_log.
     * @param {sync_logCreateArgs} args - Arguments to create a Sync_log.
     * @example
     * // Create one Sync_log
     * const Sync_log = await prisma.sync_log.create({
     *   data: {
     *     // ... data to create a Sync_log
     *   }
     * })
     * 
     */
    create<T extends sync_logCreateArgs>(args: SelectSubset<T, sync_logCreateArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Sync_logs.
     * @param {sync_logCreateManyArgs} args - Arguments to create many Sync_logs.
     * @example
     * // Create many Sync_logs
     * const sync_log = await prisma.sync_log.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends sync_logCreateManyArgs>(args?: SelectSubset<T, sync_logCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sync_logs and returns the data saved in the database.
     * @param {sync_logCreateManyAndReturnArgs} args - Arguments to create many Sync_logs.
     * @example
     * // Create many Sync_logs
     * const sync_log = await prisma.sync_log.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sync_logs and only return the `id`
     * const sync_logWithIdOnly = await prisma.sync_log.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends sync_logCreateManyAndReturnArgs>(args?: SelectSubset<T, sync_logCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Sync_log.
     * @param {sync_logDeleteArgs} args - Arguments to delete one Sync_log.
     * @example
     * // Delete one Sync_log
     * const Sync_log = await prisma.sync_log.delete({
     *   where: {
     *     // ... filter to delete one Sync_log
     *   }
     * })
     * 
     */
    delete<T extends sync_logDeleteArgs>(args: SelectSubset<T, sync_logDeleteArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Sync_log.
     * @param {sync_logUpdateArgs} args - Arguments to update one Sync_log.
     * @example
     * // Update one Sync_log
     * const sync_log = await prisma.sync_log.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends sync_logUpdateArgs>(args: SelectSubset<T, sync_logUpdateArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Sync_logs.
     * @param {sync_logDeleteManyArgs} args - Arguments to filter Sync_logs to delete.
     * @example
     * // Delete a few Sync_logs
     * const { count } = await prisma.sync_log.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends sync_logDeleteManyArgs>(args?: SelectSubset<T, sync_logDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sync_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_logUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sync_logs
     * const sync_log = await prisma.sync_log.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends sync_logUpdateManyArgs>(args: SelectSubset<T, sync_logUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Sync_log.
     * @param {sync_logUpsertArgs} args - Arguments to update or create a Sync_log.
     * @example
     * // Update or create a Sync_log
     * const sync_log = await prisma.sync_log.upsert({
     *   create: {
     *     // ... data to create a Sync_log
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sync_log we want to update
     *   }
     * })
     */
    upsert<T extends sync_logUpsertArgs>(args: SelectSubset<T, sync_logUpsertArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Sync_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_logCountArgs} args - Arguments to filter Sync_logs to count.
     * @example
     * // Count the number of Sync_logs
     * const count = await prisma.sync_log.count({
     *   where: {
     *     // ... the filter for the Sync_logs we want to count
     *   }
     * })
    **/
    count<T extends sync_logCountArgs>(
      args?: Subset<T, sync_logCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Sync_logCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sync_log.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Sync_logAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Sync_logAggregateArgs>(args: Subset<T, Sync_logAggregateArgs>): Prisma.PrismaPromise<GetSync_logAggregateType<T>>

    /**
     * Group by Sync_log.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_logGroupByArgs} args - Group by arguments.
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
      T extends sync_logGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: sync_logGroupByArgs['orderBy'] }
        : { orderBy?: sync_logGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, sync_logGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSync_logGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the sync_log model
   */
  readonly fields: sync_logFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for sync_log.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__sync_logClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    device<T extends deviceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, deviceDefaultArgs<ExtArgs>>): Prisma__deviceClient<$Result.GetResult<Prisma.$devicePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the sync_log model
   */ 
  interface sync_logFieldRefs {
    readonly id: FieldRef<"sync_log", 'String'>
    readonly device_id: FieldRef<"sync_log", 'String'>
    readonly direction: FieldRef<"sync_log", 'sync_direction'>
    readonly status: FieldRef<"sync_log", 'sync_status'>
    readonly record_count: FieldRef<"sync_log", 'Int'>
    readonly created_at: FieldRef<"sync_log", 'DateTime'>
    readonly completed_at: FieldRef<"sync_log", 'DateTime'>
    readonly error_message: FieldRef<"sync_log", 'String'>
  }
    

  // Custom InputTypes
  /**
   * sync_log findUnique
   */
  export type sync_logFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * Filter, which sync_log to fetch.
     */
    where: sync_logWhereUniqueInput
  }

  /**
   * sync_log findUniqueOrThrow
   */
  export type sync_logFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * Filter, which sync_log to fetch.
     */
    where: sync_logWhereUniqueInput
  }

  /**
   * sync_log findFirst
   */
  export type sync_logFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * Filter, which sync_log to fetch.
     */
    where?: sync_logWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sync_logs to fetch.
     */
    orderBy?: sync_logOrderByWithRelationInput | sync_logOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sync_logs.
     */
    cursor?: sync_logWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sync_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sync_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sync_logs.
     */
    distinct?: Sync_logScalarFieldEnum | Sync_logScalarFieldEnum[]
  }

  /**
   * sync_log findFirstOrThrow
   */
  export type sync_logFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * Filter, which sync_log to fetch.
     */
    where?: sync_logWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sync_logs to fetch.
     */
    orderBy?: sync_logOrderByWithRelationInput | sync_logOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sync_logs.
     */
    cursor?: sync_logWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sync_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sync_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sync_logs.
     */
    distinct?: Sync_logScalarFieldEnum | Sync_logScalarFieldEnum[]
  }

  /**
   * sync_log findMany
   */
  export type sync_logFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * Filter, which sync_logs to fetch.
     */
    where?: sync_logWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sync_logs to fetch.
     */
    orderBy?: sync_logOrderByWithRelationInput | sync_logOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing sync_logs.
     */
    cursor?: sync_logWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sync_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sync_logs.
     */
    skip?: number
    distinct?: Sync_logScalarFieldEnum | Sync_logScalarFieldEnum[]
  }

  /**
   * sync_log create
   */
  export type sync_logCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * The data needed to create a sync_log.
     */
    data: XOR<sync_logCreateInput, sync_logUncheckedCreateInput>
  }

  /**
   * sync_log createMany
   */
  export type sync_logCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many sync_logs.
     */
    data: sync_logCreateManyInput | sync_logCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * sync_log createManyAndReturn
   */
  export type sync_logCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many sync_logs.
     */
    data: sync_logCreateManyInput | sync_logCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * sync_log update
   */
  export type sync_logUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * The data needed to update a sync_log.
     */
    data: XOR<sync_logUpdateInput, sync_logUncheckedUpdateInput>
    /**
     * Choose, which sync_log to update.
     */
    where: sync_logWhereUniqueInput
  }

  /**
   * sync_log updateMany
   */
  export type sync_logUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update sync_logs.
     */
    data: XOR<sync_logUpdateManyMutationInput, sync_logUncheckedUpdateManyInput>
    /**
     * Filter which sync_logs to update
     */
    where?: sync_logWhereInput
  }

  /**
   * sync_log upsert
   */
  export type sync_logUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * The filter to search for the sync_log to update in case it exists.
     */
    where: sync_logWhereUniqueInput
    /**
     * In case the sync_log found by the `where` argument doesn't exist, create a new sync_log with this data.
     */
    create: XOR<sync_logCreateInput, sync_logUncheckedCreateInput>
    /**
     * In case the sync_log was found with the provided `where` argument, update it with this data.
     */
    update: XOR<sync_logUpdateInput, sync_logUncheckedUpdateInput>
  }

  /**
   * sync_log delete
   */
  export type sync_logDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * Filter which sync_log to delete.
     */
    where: sync_logWhereUniqueInput
  }

  /**
   * sync_log deleteMany
   */
  export type sync_logDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sync_logs to delete
     */
    where?: sync_logWhereInput
  }

  /**
   * sync_log without action
   */
  export type sync_logDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
  }


  /**
   * Model sync_conflict
   */

  export type AggregateSync_conflict = {
    _count: Sync_conflictCountAggregateOutputType | null
    _min: Sync_conflictMinAggregateOutputType | null
    _max: Sync_conflictMaxAggregateOutputType | null
  }

  export type Sync_conflictMinAggregateOutputType = {
    id: string | null
    device_id: string | null
    entity_type: string | null
    entity_id: string | null
    server_version: string | null
    client_version: string | null
    resolved_at: Date | null
    resolution: $Enums.conflict_resolution | null
    detected_at: Date | null
  }

  export type Sync_conflictMaxAggregateOutputType = {
    id: string | null
    device_id: string | null
    entity_type: string | null
    entity_id: string | null
    server_version: string | null
    client_version: string | null
    resolved_at: Date | null
    resolution: $Enums.conflict_resolution | null
    detected_at: Date | null
  }

  export type Sync_conflictCountAggregateOutputType = {
    id: number
    device_id: number
    entity_type: number
    entity_id: number
    server_version: number
    client_version: number
    resolved_at: number
    resolution: number
    detected_at: number
    _all: number
  }


  export type Sync_conflictMinAggregateInputType = {
    id?: true
    device_id?: true
    entity_type?: true
    entity_id?: true
    server_version?: true
    client_version?: true
    resolved_at?: true
    resolution?: true
    detected_at?: true
  }

  export type Sync_conflictMaxAggregateInputType = {
    id?: true
    device_id?: true
    entity_type?: true
    entity_id?: true
    server_version?: true
    client_version?: true
    resolved_at?: true
    resolution?: true
    detected_at?: true
  }

  export type Sync_conflictCountAggregateInputType = {
    id?: true
    device_id?: true
    entity_type?: true
    entity_id?: true
    server_version?: true
    client_version?: true
    resolved_at?: true
    resolution?: true
    detected_at?: true
    _all?: true
  }

  export type Sync_conflictAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sync_conflict to aggregate.
     */
    where?: sync_conflictWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sync_conflicts to fetch.
     */
    orderBy?: sync_conflictOrderByWithRelationInput | sync_conflictOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: sync_conflictWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sync_conflicts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sync_conflicts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned sync_conflicts
    **/
    _count?: true | Sync_conflictCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Sync_conflictMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Sync_conflictMaxAggregateInputType
  }

  export type GetSync_conflictAggregateType<T extends Sync_conflictAggregateArgs> = {
        [P in keyof T & keyof AggregateSync_conflict]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSync_conflict[P]>
      : GetScalarType<T[P], AggregateSync_conflict[P]>
  }




  export type sync_conflictGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sync_conflictWhereInput
    orderBy?: sync_conflictOrderByWithAggregationInput | sync_conflictOrderByWithAggregationInput[]
    by: Sync_conflictScalarFieldEnum[] | Sync_conflictScalarFieldEnum
    having?: sync_conflictScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Sync_conflictCountAggregateInputType | true
    _min?: Sync_conflictMinAggregateInputType
    _max?: Sync_conflictMaxAggregateInputType
  }

  export type Sync_conflictGroupByOutputType = {
    id: string
    device_id: string
    entity_type: string
    entity_id: string
    server_version: string
    client_version: string
    resolved_at: Date | null
    resolution: $Enums.conflict_resolution | null
    detected_at: Date
    _count: Sync_conflictCountAggregateOutputType | null
    _min: Sync_conflictMinAggregateOutputType | null
    _max: Sync_conflictMaxAggregateOutputType | null
  }

  type GetSync_conflictGroupByPayload<T extends sync_conflictGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Sync_conflictGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Sync_conflictGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Sync_conflictGroupByOutputType[P]>
            : GetScalarType<T[P], Sync_conflictGroupByOutputType[P]>
        }
      >
    >


  export type sync_conflictSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    device_id?: boolean
    entity_type?: boolean
    entity_id?: boolean
    server_version?: boolean
    client_version?: boolean
    resolved_at?: boolean
    resolution?: boolean
    detected_at?: boolean
    device?: boolean | deviceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sync_conflict"]>

  export type sync_conflictSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    device_id?: boolean
    entity_type?: boolean
    entity_id?: boolean
    server_version?: boolean
    client_version?: boolean
    resolved_at?: boolean
    resolution?: boolean
    detected_at?: boolean
    device?: boolean | deviceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sync_conflict"]>

  export type sync_conflictSelectScalar = {
    id?: boolean
    device_id?: boolean
    entity_type?: boolean
    entity_id?: boolean
    server_version?: boolean
    client_version?: boolean
    resolved_at?: boolean
    resolution?: boolean
    detected_at?: boolean
  }

  export type sync_conflictInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | deviceDefaultArgs<ExtArgs>
  }
  export type sync_conflictIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    device?: boolean | deviceDefaultArgs<ExtArgs>
  }

  export type $sync_conflictPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "sync_conflict"
    objects: {
      device: Prisma.$devicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      device_id: string
      entity_type: string
      entity_id: string
      server_version: string
      client_version: string
      resolved_at: Date | null
      resolution: $Enums.conflict_resolution | null
      detected_at: Date
    }, ExtArgs["result"]["sync_conflict"]>
    composites: {}
  }

  type sync_conflictGetPayload<S extends boolean | null | undefined | sync_conflictDefaultArgs> = $Result.GetResult<Prisma.$sync_conflictPayload, S>

  type sync_conflictCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<sync_conflictFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Sync_conflictCountAggregateInputType | true
    }

  export interface sync_conflictDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['sync_conflict'], meta: { name: 'sync_conflict' } }
    /**
     * Find zero or one Sync_conflict that matches the filter.
     * @param {sync_conflictFindUniqueArgs} args - Arguments to find a Sync_conflict
     * @example
     * // Get one Sync_conflict
     * const sync_conflict = await prisma.sync_conflict.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends sync_conflictFindUniqueArgs>(args: SelectSubset<T, sync_conflictFindUniqueArgs<ExtArgs>>): Prisma__sync_conflictClient<$Result.GetResult<Prisma.$sync_conflictPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Sync_conflict that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {sync_conflictFindUniqueOrThrowArgs} args - Arguments to find a Sync_conflict
     * @example
     * // Get one Sync_conflict
     * const sync_conflict = await prisma.sync_conflict.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends sync_conflictFindUniqueOrThrowArgs>(args: SelectSubset<T, sync_conflictFindUniqueOrThrowArgs<ExtArgs>>): Prisma__sync_conflictClient<$Result.GetResult<Prisma.$sync_conflictPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Sync_conflict that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_conflictFindFirstArgs} args - Arguments to find a Sync_conflict
     * @example
     * // Get one Sync_conflict
     * const sync_conflict = await prisma.sync_conflict.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends sync_conflictFindFirstArgs>(args?: SelectSubset<T, sync_conflictFindFirstArgs<ExtArgs>>): Prisma__sync_conflictClient<$Result.GetResult<Prisma.$sync_conflictPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Sync_conflict that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_conflictFindFirstOrThrowArgs} args - Arguments to find a Sync_conflict
     * @example
     * // Get one Sync_conflict
     * const sync_conflict = await prisma.sync_conflict.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends sync_conflictFindFirstOrThrowArgs>(args?: SelectSubset<T, sync_conflictFindFirstOrThrowArgs<ExtArgs>>): Prisma__sync_conflictClient<$Result.GetResult<Prisma.$sync_conflictPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Sync_conflicts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_conflictFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sync_conflicts
     * const sync_conflicts = await prisma.sync_conflict.findMany()
     * 
     * // Get first 10 Sync_conflicts
     * const sync_conflicts = await prisma.sync_conflict.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sync_conflictWithIdOnly = await prisma.sync_conflict.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends sync_conflictFindManyArgs>(args?: SelectSubset<T, sync_conflictFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sync_conflictPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Sync_conflict.
     * @param {sync_conflictCreateArgs} args - Arguments to create a Sync_conflict.
     * @example
     * // Create one Sync_conflict
     * const Sync_conflict = await prisma.sync_conflict.create({
     *   data: {
     *     // ... data to create a Sync_conflict
     *   }
     * })
     * 
     */
    create<T extends sync_conflictCreateArgs>(args: SelectSubset<T, sync_conflictCreateArgs<ExtArgs>>): Prisma__sync_conflictClient<$Result.GetResult<Prisma.$sync_conflictPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Sync_conflicts.
     * @param {sync_conflictCreateManyArgs} args - Arguments to create many Sync_conflicts.
     * @example
     * // Create many Sync_conflicts
     * const sync_conflict = await prisma.sync_conflict.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends sync_conflictCreateManyArgs>(args?: SelectSubset<T, sync_conflictCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sync_conflicts and returns the data saved in the database.
     * @param {sync_conflictCreateManyAndReturnArgs} args - Arguments to create many Sync_conflicts.
     * @example
     * // Create many Sync_conflicts
     * const sync_conflict = await prisma.sync_conflict.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sync_conflicts and only return the `id`
     * const sync_conflictWithIdOnly = await prisma.sync_conflict.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends sync_conflictCreateManyAndReturnArgs>(args?: SelectSubset<T, sync_conflictCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sync_conflictPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Sync_conflict.
     * @param {sync_conflictDeleteArgs} args - Arguments to delete one Sync_conflict.
     * @example
     * // Delete one Sync_conflict
     * const Sync_conflict = await prisma.sync_conflict.delete({
     *   where: {
     *     // ... filter to delete one Sync_conflict
     *   }
     * })
     * 
     */
    delete<T extends sync_conflictDeleteArgs>(args: SelectSubset<T, sync_conflictDeleteArgs<ExtArgs>>): Prisma__sync_conflictClient<$Result.GetResult<Prisma.$sync_conflictPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Sync_conflict.
     * @param {sync_conflictUpdateArgs} args - Arguments to update one Sync_conflict.
     * @example
     * // Update one Sync_conflict
     * const sync_conflict = await prisma.sync_conflict.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends sync_conflictUpdateArgs>(args: SelectSubset<T, sync_conflictUpdateArgs<ExtArgs>>): Prisma__sync_conflictClient<$Result.GetResult<Prisma.$sync_conflictPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Sync_conflicts.
     * @param {sync_conflictDeleteManyArgs} args - Arguments to filter Sync_conflicts to delete.
     * @example
     * // Delete a few Sync_conflicts
     * const { count } = await prisma.sync_conflict.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends sync_conflictDeleteManyArgs>(args?: SelectSubset<T, sync_conflictDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sync_conflicts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_conflictUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sync_conflicts
     * const sync_conflict = await prisma.sync_conflict.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends sync_conflictUpdateManyArgs>(args: SelectSubset<T, sync_conflictUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Sync_conflict.
     * @param {sync_conflictUpsertArgs} args - Arguments to update or create a Sync_conflict.
     * @example
     * // Update or create a Sync_conflict
     * const sync_conflict = await prisma.sync_conflict.upsert({
     *   create: {
     *     // ... data to create a Sync_conflict
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sync_conflict we want to update
     *   }
     * })
     */
    upsert<T extends sync_conflictUpsertArgs>(args: SelectSubset<T, sync_conflictUpsertArgs<ExtArgs>>): Prisma__sync_conflictClient<$Result.GetResult<Prisma.$sync_conflictPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Sync_conflicts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_conflictCountArgs} args - Arguments to filter Sync_conflicts to count.
     * @example
     * // Count the number of Sync_conflicts
     * const count = await prisma.sync_conflict.count({
     *   where: {
     *     // ... the filter for the Sync_conflicts we want to count
     *   }
     * })
    **/
    count<T extends sync_conflictCountArgs>(
      args?: Subset<T, sync_conflictCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Sync_conflictCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sync_conflict.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Sync_conflictAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Sync_conflictAggregateArgs>(args: Subset<T, Sync_conflictAggregateArgs>): Prisma.PrismaPromise<GetSync_conflictAggregateType<T>>

    /**
     * Group by Sync_conflict.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_conflictGroupByArgs} args - Group by arguments.
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
      T extends sync_conflictGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: sync_conflictGroupByArgs['orderBy'] }
        : { orderBy?: sync_conflictGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, sync_conflictGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSync_conflictGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the sync_conflict model
   */
  readonly fields: sync_conflictFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for sync_conflict.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__sync_conflictClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    device<T extends deviceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, deviceDefaultArgs<ExtArgs>>): Prisma__deviceClient<$Result.GetResult<Prisma.$devicePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the sync_conflict model
   */ 
  interface sync_conflictFieldRefs {
    readonly id: FieldRef<"sync_conflict", 'String'>
    readonly device_id: FieldRef<"sync_conflict", 'String'>
    readonly entity_type: FieldRef<"sync_conflict", 'String'>
    readonly entity_id: FieldRef<"sync_conflict", 'String'>
    readonly server_version: FieldRef<"sync_conflict", 'String'>
    readonly client_version: FieldRef<"sync_conflict", 'String'>
    readonly resolved_at: FieldRef<"sync_conflict", 'DateTime'>
    readonly resolution: FieldRef<"sync_conflict", 'conflict_resolution'>
    readonly detected_at: FieldRef<"sync_conflict", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * sync_conflict findUnique
   */
  export type sync_conflictFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_conflict
     */
    select?: sync_conflictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_conflictInclude<ExtArgs> | null
    /**
     * Filter, which sync_conflict to fetch.
     */
    where: sync_conflictWhereUniqueInput
  }

  /**
   * sync_conflict findUniqueOrThrow
   */
  export type sync_conflictFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_conflict
     */
    select?: sync_conflictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_conflictInclude<ExtArgs> | null
    /**
     * Filter, which sync_conflict to fetch.
     */
    where: sync_conflictWhereUniqueInput
  }

  /**
   * sync_conflict findFirst
   */
  export type sync_conflictFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_conflict
     */
    select?: sync_conflictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_conflictInclude<ExtArgs> | null
    /**
     * Filter, which sync_conflict to fetch.
     */
    where?: sync_conflictWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sync_conflicts to fetch.
     */
    orderBy?: sync_conflictOrderByWithRelationInput | sync_conflictOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sync_conflicts.
     */
    cursor?: sync_conflictWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sync_conflicts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sync_conflicts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sync_conflicts.
     */
    distinct?: Sync_conflictScalarFieldEnum | Sync_conflictScalarFieldEnum[]
  }

  /**
   * sync_conflict findFirstOrThrow
   */
  export type sync_conflictFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_conflict
     */
    select?: sync_conflictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_conflictInclude<ExtArgs> | null
    /**
     * Filter, which sync_conflict to fetch.
     */
    where?: sync_conflictWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sync_conflicts to fetch.
     */
    orderBy?: sync_conflictOrderByWithRelationInput | sync_conflictOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sync_conflicts.
     */
    cursor?: sync_conflictWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sync_conflicts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sync_conflicts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sync_conflicts.
     */
    distinct?: Sync_conflictScalarFieldEnum | Sync_conflictScalarFieldEnum[]
  }

  /**
   * sync_conflict findMany
   */
  export type sync_conflictFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_conflict
     */
    select?: sync_conflictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_conflictInclude<ExtArgs> | null
    /**
     * Filter, which sync_conflicts to fetch.
     */
    where?: sync_conflictWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sync_conflicts to fetch.
     */
    orderBy?: sync_conflictOrderByWithRelationInput | sync_conflictOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing sync_conflicts.
     */
    cursor?: sync_conflictWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sync_conflicts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sync_conflicts.
     */
    skip?: number
    distinct?: Sync_conflictScalarFieldEnum | Sync_conflictScalarFieldEnum[]
  }

  /**
   * sync_conflict create
   */
  export type sync_conflictCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_conflict
     */
    select?: sync_conflictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_conflictInclude<ExtArgs> | null
    /**
     * The data needed to create a sync_conflict.
     */
    data: XOR<sync_conflictCreateInput, sync_conflictUncheckedCreateInput>
  }

  /**
   * sync_conflict createMany
   */
  export type sync_conflictCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many sync_conflicts.
     */
    data: sync_conflictCreateManyInput | sync_conflictCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * sync_conflict createManyAndReturn
   */
  export type sync_conflictCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_conflict
     */
    select?: sync_conflictSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many sync_conflicts.
     */
    data: sync_conflictCreateManyInput | sync_conflictCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_conflictIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * sync_conflict update
   */
  export type sync_conflictUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_conflict
     */
    select?: sync_conflictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_conflictInclude<ExtArgs> | null
    /**
     * The data needed to update a sync_conflict.
     */
    data: XOR<sync_conflictUpdateInput, sync_conflictUncheckedUpdateInput>
    /**
     * Choose, which sync_conflict to update.
     */
    where: sync_conflictWhereUniqueInput
  }

  /**
   * sync_conflict updateMany
   */
  export type sync_conflictUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update sync_conflicts.
     */
    data: XOR<sync_conflictUpdateManyMutationInput, sync_conflictUncheckedUpdateManyInput>
    /**
     * Filter which sync_conflicts to update
     */
    where?: sync_conflictWhereInput
  }

  /**
   * sync_conflict upsert
   */
  export type sync_conflictUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_conflict
     */
    select?: sync_conflictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_conflictInclude<ExtArgs> | null
    /**
     * The filter to search for the sync_conflict to update in case it exists.
     */
    where: sync_conflictWhereUniqueInput
    /**
     * In case the sync_conflict found by the `where` argument doesn't exist, create a new sync_conflict with this data.
     */
    create: XOR<sync_conflictCreateInput, sync_conflictUncheckedCreateInput>
    /**
     * In case the sync_conflict was found with the provided `where` argument, update it with this data.
     */
    update: XOR<sync_conflictUpdateInput, sync_conflictUncheckedUpdateInput>
  }

  /**
   * sync_conflict delete
   */
  export type sync_conflictDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_conflict
     */
    select?: sync_conflictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_conflictInclude<ExtArgs> | null
    /**
     * Filter which sync_conflict to delete.
     */
    where: sync_conflictWhereUniqueInput
  }

  /**
   * sync_conflict deleteMany
   */
  export type sync_conflictDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sync_conflicts to delete
     */
    where?: sync_conflictWhereInput
  }

  /**
   * sync_conflict without action
   */
  export type sync_conflictDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_conflict
     */
    select?: sync_conflictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_conflictInclude<ExtArgs> | null
  }


  /**
   * Model student_transfer
   */

  export type AggregateStudent_transfer = {
    _count: Student_transferCountAggregateOutputType | null
    _min: Student_transferMinAggregateOutputType | null
    _max: Student_transferMaxAggregateOutputType | null
  }

  export type Student_transferMinAggregateOutputType = {
    id: string | null
    from_device_id: string | null
    to_device_id: string | null
    status: $Enums.transfer_status | null
    transferred_at: Date | null
    failed_at: Date | null
    error_reason: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Student_transferMaxAggregateOutputType = {
    id: string | null
    from_device_id: string | null
    to_device_id: string | null
    status: $Enums.transfer_status | null
    transferred_at: Date | null
    failed_at: Date | null
    error_reason: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Student_transferCountAggregateOutputType = {
    id: number
    from_device_id: number
    to_device_id: number
    status: number
    transferred_at: number
    failed_at: number
    error_reason: number
    student_ids: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Student_transferMinAggregateInputType = {
    id?: true
    from_device_id?: true
    to_device_id?: true
    status?: true
    transferred_at?: true
    failed_at?: true
    error_reason?: true
    created_at?: true
    updated_at?: true
  }

  export type Student_transferMaxAggregateInputType = {
    id?: true
    from_device_id?: true
    to_device_id?: true
    status?: true
    transferred_at?: true
    failed_at?: true
    error_reason?: true
    created_at?: true
    updated_at?: true
  }

  export type Student_transferCountAggregateInputType = {
    id?: true
    from_device_id?: true
    to_device_id?: true
    status?: true
    transferred_at?: true
    failed_at?: true
    error_reason?: true
    student_ids?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Student_transferAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which student_transfer to aggregate.
     */
    where?: student_transferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of student_transfers to fetch.
     */
    orderBy?: student_transferOrderByWithRelationInput | student_transferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: student_transferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` student_transfers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` student_transfers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned student_transfers
    **/
    _count?: true | Student_transferCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Student_transferMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Student_transferMaxAggregateInputType
  }

  export type GetStudent_transferAggregateType<T extends Student_transferAggregateArgs> = {
        [P in keyof T & keyof AggregateStudent_transfer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudent_transfer[P]>
      : GetScalarType<T[P], AggregateStudent_transfer[P]>
  }




  export type student_transferGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: student_transferWhereInput
    orderBy?: student_transferOrderByWithAggregationInput | student_transferOrderByWithAggregationInput[]
    by: Student_transferScalarFieldEnum[] | Student_transferScalarFieldEnum
    having?: student_transferScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Student_transferCountAggregateInputType | true
    _min?: Student_transferMinAggregateInputType
    _max?: Student_transferMaxAggregateInputType
  }

  export type Student_transferGroupByOutputType = {
    id: string
    from_device_id: string
    to_device_id: string
    status: $Enums.transfer_status
    transferred_at: Date | null
    failed_at: Date | null
    error_reason: string | null
    student_ids: string[]
    created_at: Date
    updated_at: Date
    _count: Student_transferCountAggregateOutputType | null
    _min: Student_transferMinAggregateOutputType | null
    _max: Student_transferMaxAggregateOutputType | null
  }

  type GetStudent_transferGroupByPayload<T extends student_transferGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Student_transferGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Student_transferGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Student_transferGroupByOutputType[P]>
            : GetScalarType<T[P], Student_transferGroupByOutputType[P]>
        }
      >
    >


  export type student_transferSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    from_device_id?: boolean
    to_device_id?: boolean
    status?: boolean
    transferred_at?: boolean
    failed_at?: boolean
    error_reason?: boolean
    student_ids?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["student_transfer"]>

  export type student_transferSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    from_device_id?: boolean
    to_device_id?: boolean
    status?: boolean
    transferred_at?: boolean
    failed_at?: boolean
    error_reason?: boolean
    student_ids?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["student_transfer"]>

  export type student_transferSelectScalar = {
    id?: boolean
    from_device_id?: boolean
    to_device_id?: boolean
    status?: boolean
    transferred_at?: boolean
    failed_at?: boolean
    error_reason?: boolean
    student_ids?: boolean
    created_at?: boolean
    updated_at?: boolean
  }


  export type $student_transferPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "student_transfer"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      from_device_id: string
      to_device_id: string
      status: $Enums.transfer_status
      transferred_at: Date | null
      failed_at: Date | null
      error_reason: string | null
      student_ids: string[]
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["student_transfer"]>
    composites: {}
  }

  type student_transferGetPayload<S extends boolean | null | undefined | student_transferDefaultArgs> = $Result.GetResult<Prisma.$student_transferPayload, S>

  type student_transferCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<student_transferFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Student_transferCountAggregateInputType | true
    }

  export interface student_transferDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['student_transfer'], meta: { name: 'student_transfer' } }
    /**
     * Find zero or one Student_transfer that matches the filter.
     * @param {student_transferFindUniqueArgs} args - Arguments to find a Student_transfer
     * @example
     * // Get one Student_transfer
     * const student_transfer = await prisma.student_transfer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends student_transferFindUniqueArgs>(args: SelectSubset<T, student_transferFindUniqueArgs<ExtArgs>>): Prisma__student_transferClient<$Result.GetResult<Prisma.$student_transferPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Student_transfer that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {student_transferFindUniqueOrThrowArgs} args - Arguments to find a Student_transfer
     * @example
     * // Get one Student_transfer
     * const student_transfer = await prisma.student_transfer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends student_transferFindUniqueOrThrowArgs>(args: SelectSubset<T, student_transferFindUniqueOrThrowArgs<ExtArgs>>): Prisma__student_transferClient<$Result.GetResult<Prisma.$student_transferPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Student_transfer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {student_transferFindFirstArgs} args - Arguments to find a Student_transfer
     * @example
     * // Get one Student_transfer
     * const student_transfer = await prisma.student_transfer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends student_transferFindFirstArgs>(args?: SelectSubset<T, student_transferFindFirstArgs<ExtArgs>>): Prisma__student_transferClient<$Result.GetResult<Prisma.$student_transferPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Student_transfer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {student_transferFindFirstOrThrowArgs} args - Arguments to find a Student_transfer
     * @example
     * // Get one Student_transfer
     * const student_transfer = await prisma.student_transfer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends student_transferFindFirstOrThrowArgs>(args?: SelectSubset<T, student_transferFindFirstOrThrowArgs<ExtArgs>>): Prisma__student_transferClient<$Result.GetResult<Prisma.$student_transferPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Student_transfers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {student_transferFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Student_transfers
     * const student_transfers = await prisma.student_transfer.findMany()
     * 
     * // Get first 10 Student_transfers
     * const student_transfers = await prisma.student_transfer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const student_transferWithIdOnly = await prisma.student_transfer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends student_transferFindManyArgs>(args?: SelectSubset<T, student_transferFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$student_transferPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Student_transfer.
     * @param {student_transferCreateArgs} args - Arguments to create a Student_transfer.
     * @example
     * // Create one Student_transfer
     * const Student_transfer = await prisma.student_transfer.create({
     *   data: {
     *     // ... data to create a Student_transfer
     *   }
     * })
     * 
     */
    create<T extends student_transferCreateArgs>(args: SelectSubset<T, student_transferCreateArgs<ExtArgs>>): Prisma__student_transferClient<$Result.GetResult<Prisma.$student_transferPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Student_transfers.
     * @param {student_transferCreateManyArgs} args - Arguments to create many Student_transfers.
     * @example
     * // Create many Student_transfers
     * const student_transfer = await prisma.student_transfer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends student_transferCreateManyArgs>(args?: SelectSubset<T, student_transferCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Student_transfers and returns the data saved in the database.
     * @param {student_transferCreateManyAndReturnArgs} args - Arguments to create many Student_transfers.
     * @example
     * // Create many Student_transfers
     * const student_transfer = await prisma.student_transfer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Student_transfers and only return the `id`
     * const student_transferWithIdOnly = await prisma.student_transfer.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends student_transferCreateManyAndReturnArgs>(args?: SelectSubset<T, student_transferCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$student_transferPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Student_transfer.
     * @param {student_transferDeleteArgs} args - Arguments to delete one Student_transfer.
     * @example
     * // Delete one Student_transfer
     * const Student_transfer = await prisma.student_transfer.delete({
     *   where: {
     *     // ... filter to delete one Student_transfer
     *   }
     * })
     * 
     */
    delete<T extends student_transferDeleteArgs>(args: SelectSubset<T, student_transferDeleteArgs<ExtArgs>>): Prisma__student_transferClient<$Result.GetResult<Prisma.$student_transferPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Student_transfer.
     * @param {student_transferUpdateArgs} args - Arguments to update one Student_transfer.
     * @example
     * // Update one Student_transfer
     * const student_transfer = await prisma.student_transfer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends student_transferUpdateArgs>(args: SelectSubset<T, student_transferUpdateArgs<ExtArgs>>): Prisma__student_transferClient<$Result.GetResult<Prisma.$student_transferPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Student_transfers.
     * @param {student_transferDeleteManyArgs} args - Arguments to filter Student_transfers to delete.
     * @example
     * // Delete a few Student_transfers
     * const { count } = await prisma.student_transfer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends student_transferDeleteManyArgs>(args?: SelectSubset<T, student_transferDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Student_transfers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {student_transferUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Student_transfers
     * const student_transfer = await prisma.student_transfer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends student_transferUpdateManyArgs>(args: SelectSubset<T, student_transferUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Student_transfer.
     * @param {student_transferUpsertArgs} args - Arguments to update or create a Student_transfer.
     * @example
     * // Update or create a Student_transfer
     * const student_transfer = await prisma.student_transfer.upsert({
     *   create: {
     *     // ... data to create a Student_transfer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Student_transfer we want to update
     *   }
     * })
     */
    upsert<T extends student_transferUpsertArgs>(args: SelectSubset<T, student_transferUpsertArgs<ExtArgs>>): Prisma__student_transferClient<$Result.GetResult<Prisma.$student_transferPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Student_transfers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {student_transferCountArgs} args - Arguments to filter Student_transfers to count.
     * @example
     * // Count the number of Student_transfers
     * const count = await prisma.student_transfer.count({
     *   where: {
     *     // ... the filter for the Student_transfers we want to count
     *   }
     * })
    **/
    count<T extends student_transferCountArgs>(
      args?: Subset<T, student_transferCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Student_transferCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Student_transfer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Student_transferAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Student_transferAggregateArgs>(args: Subset<T, Student_transferAggregateArgs>): Prisma.PrismaPromise<GetStudent_transferAggregateType<T>>

    /**
     * Group by Student_transfer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {student_transferGroupByArgs} args - Group by arguments.
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
      T extends student_transferGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: student_transferGroupByArgs['orderBy'] }
        : { orderBy?: student_transferGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, student_transferGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudent_transferGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the student_transfer model
   */
  readonly fields: student_transferFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for student_transfer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__student_transferClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the student_transfer model
   */ 
  interface student_transferFieldRefs {
    readonly id: FieldRef<"student_transfer", 'String'>
    readonly from_device_id: FieldRef<"student_transfer", 'String'>
    readonly to_device_id: FieldRef<"student_transfer", 'String'>
    readonly status: FieldRef<"student_transfer", 'transfer_status'>
    readonly transferred_at: FieldRef<"student_transfer", 'DateTime'>
    readonly failed_at: FieldRef<"student_transfer", 'DateTime'>
    readonly error_reason: FieldRef<"student_transfer", 'String'>
    readonly student_ids: FieldRef<"student_transfer", 'String[]'>
    readonly created_at: FieldRef<"student_transfer", 'DateTime'>
    readonly updated_at: FieldRef<"student_transfer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * student_transfer findUnique
   */
  export type student_transferFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_transfer
     */
    select?: student_transferSelect<ExtArgs> | null
    /**
     * Filter, which student_transfer to fetch.
     */
    where: student_transferWhereUniqueInput
  }

  /**
   * student_transfer findUniqueOrThrow
   */
  export type student_transferFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_transfer
     */
    select?: student_transferSelect<ExtArgs> | null
    /**
     * Filter, which student_transfer to fetch.
     */
    where: student_transferWhereUniqueInput
  }

  /**
   * student_transfer findFirst
   */
  export type student_transferFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_transfer
     */
    select?: student_transferSelect<ExtArgs> | null
    /**
     * Filter, which student_transfer to fetch.
     */
    where?: student_transferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of student_transfers to fetch.
     */
    orderBy?: student_transferOrderByWithRelationInput | student_transferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for student_transfers.
     */
    cursor?: student_transferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` student_transfers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` student_transfers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of student_transfers.
     */
    distinct?: Student_transferScalarFieldEnum | Student_transferScalarFieldEnum[]
  }

  /**
   * student_transfer findFirstOrThrow
   */
  export type student_transferFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_transfer
     */
    select?: student_transferSelect<ExtArgs> | null
    /**
     * Filter, which student_transfer to fetch.
     */
    where?: student_transferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of student_transfers to fetch.
     */
    orderBy?: student_transferOrderByWithRelationInput | student_transferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for student_transfers.
     */
    cursor?: student_transferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` student_transfers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` student_transfers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of student_transfers.
     */
    distinct?: Student_transferScalarFieldEnum | Student_transferScalarFieldEnum[]
  }

  /**
   * student_transfer findMany
   */
  export type student_transferFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_transfer
     */
    select?: student_transferSelect<ExtArgs> | null
    /**
     * Filter, which student_transfers to fetch.
     */
    where?: student_transferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of student_transfers to fetch.
     */
    orderBy?: student_transferOrderByWithRelationInput | student_transferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing student_transfers.
     */
    cursor?: student_transferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` student_transfers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` student_transfers.
     */
    skip?: number
    distinct?: Student_transferScalarFieldEnum | Student_transferScalarFieldEnum[]
  }

  /**
   * student_transfer create
   */
  export type student_transferCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_transfer
     */
    select?: student_transferSelect<ExtArgs> | null
    /**
     * The data needed to create a student_transfer.
     */
    data: XOR<student_transferCreateInput, student_transferUncheckedCreateInput>
  }

  /**
   * student_transfer createMany
   */
  export type student_transferCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many student_transfers.
     */
    data: student_transferCreateManyInput | student_transferCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * student_transfer createManyAndReturn
   */
  export type student_transferCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_transfer
     */
    select?: student_transferSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many student_transfers.
     */
    data: student_transferCreateManyInput | student_transferCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * student_transfer update
   */
  export type student_transferUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_transfer
     */
    select?: student_transferSelect<ExtArgs> | null
    /**
     * The data needed to update a student_transfer.
     */
    data: XOR<student_transferUpdateInput, student_transferUncheckedUpdateInput>
    /**
     * Choose, which student_transfer to update.
     */
    where: student_transferWhereUniqueInput
  }

  /**
   * student_transfer updateMany
   */
  export type student_transferUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update student_transfers.
     */
    data: XOR<student_transferUpdateManyMutationInput, student_transferUncheckedUpdateManyInput>
    /**
     * Filter which student_transfers to update
     */
    where?: student_transferWhereInput
  }

  /**
   * student_transfer upsert
   */
  export type student_transferUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_transfer
     */
    select?: student_transferSelect<ExtArgs> | null
    /**
     * The filter to search for the student_transfer to update in case it exists.
     */
    where: student_transferWhereUniqueInput
    /**
     * In case the student_transfer found by the `where` argument doesn't exist, create a new student_transfer with this data.
     */
    create: XOR<student_transferCreateInput, student_transferUncheckedCreateInput>
    /**
     * In case the student_transfer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<student_transferUpdateInput, student_transferUncheckedUpdateInput>
  }

  /**
   * student_transfer delete
   */
  export type student_transferDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_transfer
     */
    select?: student_transferSelect<ExtArgs> | null
    /**
     * Filter which student_transfer to delete.
     */
    where: student_transferWhereUniqueInput
  }

  /**
   * student_transfer deleteMany
   */
  export type student_transferDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which student_transfers to delete
     */
    where?: student_transferWhereInput
  }

  /**
   * student_transfer without action
   */
  export type student_transferDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_transfer
     */
    select?: student_transferSelect<ExtArgs> | null
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


  export const DeviceScalarFieldEnum: {
    id: 'id',
    type: 'type',
    name: 'name',
    last_seen_at: 'last_seen_at',
    created_at: 'created_at',
    deleted_at: 'deleted_at'
  };

  export type DeviceScalarFieldEnum = (typeof DeviceScalarFieldEnum)[keyof typeof DeviceScalarFieldEnum]


  export const Sync_logScalarFieldEnum: {
    id: 'id',
    device_id: 'device_id',
    direction: 'direction',
    status: 'status',
    record_count: 'record_count',
    created_at: 'created_at',
    completed_at: 'completed_at',
    error_message: 'error_message'
  };

  export type Sync_logScalarFieldEnum = (typeof Sync_logScalarFieldEnum)[keyof typeof Sync_logScalarFieldEnum]


  export const Sync_conflictScalarFieldEnum: {
    id: 'id',
    device_id: 'device_id',
    entity_type: 'entity_type',
    entity_id: 'entity_id',
    server_version: 'server_version',
    client_version: 'client_version',
    resolved_at: 'resolved_at',
    resolution: 'resolution',
    detected_at: 'detected_at'
  };

  export type Sync_conflictScalarFieldEnum = (typeof Sync_conflictScalarFieldEnum)[keyof typeof Sync_conflictScalarFieldEnum]


  export const Student_transferScalarFieldEnum: {
    id: 'id',
    from_device_id: 'from_device_id',
    to_device_id: 'to_device_id',
    status: 'status',
    transferred_at: 'transferred_at',
    failed_at: 'failed_at',
    error_reason: 'error_reason',
    student_ids: 'student_ids',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Student_transferScalarFieldEnum = (typeof Student_transferScalarFieldEnum)[keyof typeof Student_transferScalarFieldEnum]


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
   * Reference to a field of type 'device_type'
   */
  export type Enumdevice_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'device_type'>
    


  /**
   * Reference to a field of type 'device_type[]'
   */
  export type ListEnumdevice_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'device_type[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'sync_direction'
   */
  export type Enumsync_directionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'sync_direction'>
    


  /**
   * Reference to a field of type 'sync_direction[]'
   */
  export type ListEnumsync_directionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'sync_direction[]'>
    


  /**
   * Reference to a field of type 'sync_status'
   */
  export type Enumsync_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'sync_status'>
    


  /**
   * Reference to a field of type 'sync_status[]'
   */
  export type ListEnumsync_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'sync_status[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'conflict_resolution'
   */
  export type Enumconflict_resolutionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'conflict_resolution'>
    


  /**
   * Reference to a field of type 'conflict_resolution[]'
   */
  export type ListEnumconflict_resolutionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'conflict_resolution[]'>
    


  /**
   * Reference to a field of type 'transfer_status'
   */
  export type Enumtransfer_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'transfer_status'>
    


  /**
   * Reference to a field of type 'transfer_status[]'
   */
  export type ListEnumtransfer_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'transfer_status[]'>
    


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


  export type deviceWhereInput = {
    AND?: deviceWhereInput | deviceWhereInput[]
    OR?: deviceWhereInput[]
    NOT?: deviceWhereInput | deviceWhereInput[]
    id?: StringFilter<"device"> | string
    type?: Enumdevice_typeFilter<"device"> | $Enums.device_type
    name?: StringFilter<"device"> | string
    last_seen_at?: DateTimeFilter<"device"> | Date | string
    created_at?: DateTimeFilter<"device"> | Date | string
    deleted_at?: DateTimeNullableFilter<"device"> | Date | string | null
    sync_logs?: Sync_logListRelationFilter
    conflicts?: Sync_conflictListRelationFilter
  }

  export type deviceOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    last_seen_at?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    sync_logs?: sync_logOrderByRelationAggregateInput
    conflicts?: sync_conflictOrderByRelationAggregateInput
  }

  export type deviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: deviceWhereInput | deviceWhereInput[]
    OR?: deviceWhereInput[]
    NOT?: deviceWhereInput | deviceWhereInput[]
    type?: Enumdevice_typeFilter<"device"> | $Enums.device_type
    name?: StringFilter<"device"> | string
    last_seen_at?: DateTimeFilter<"device"> | Date | string
    created_at?: DateTimeFilter<"device"> | Date | string
    deleted_at?: DateTimeNullableFilter<"device"> | Date | string | null
    sync_logs?: Sync_logListRelationFilter
    conflicts?: Sync_conflictListRelationFilter
  }, "id">

  export type deviceOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    last_seen_at?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    _count?: deviceCountOrderByAggregateInput
    _max?: deviceMaxOrderByAggregateInput
    _min?: deviceMinOrderByAggregateInput
  }

  export type deviceScalarWhereWithAggregatesInput = {
    AND?: deviceScalarWhereWithAggregatesInput | deviceScalarWhereWithAggregatesInput[]
    OR?: deviceScalarWhereWithAggregatesInput[]
    NOT?: deviceScalarWhereWithAggregatesInput | deviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"device"> | string
    type?: Enumdevice_typeWithAggregatesFilter<"device"> | $Enums.device_type
    name?: StringWithAggregatesFilter<"device"> | string
    last_seen_at?: DateTimeWithAggregatesFilter<"device"> | Date | string
    created_at?: DateTimeWithAggregatesFilter<"device"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"device"> | Date | string | null
  }

  export type sync_logWhereInput = {
    AND?: sync_logWhereInput | sync_logWhereInput[]
    OR?: sync_logWhereInput[]
    NOT?: sync_logWhereInput | sync_logWhereInput[]
    id?: StringFilter<"sync_log"> | string
    device_id?: StringFilter<"sync_log"> | string
    direction?: Enumsync_directionFilter<"sync_log"> | $Enums.sync_direction
    status?: Enumsync_statusFilter<"sync_log"> | $Enums.sync_status
    record_count?: IntFilter<"sync_log"> | number
    created_at?: DateTimeFilter<"sync_log"> | Date | string
    completed_at?: DateTimeNullableFilter<"sync_log"> | Date | string | null
    error_message?: StringNullableFilter<"sync_log"> | string | null
    device?: XOR<DeviceRelationFilter, deviceWhereInput>
  }

  export type sync_logOrderByWithRelationInput = {
    id?: SortOrder
    device_id?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    record_count?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrderInput | SortOrder
    error_message?: SortOrderInput | SortOrder
    device?: deviceOrderByWithRelationInput
  }

  export type sync_logWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: sync_logWhereInput | sync_logWhereInput[]
    OR?: sync_logWhereInput[]
    NOT?: sync_logWhereInput | sync_logWhereInput[]
    device_id?: StringFilter<"sync_log"> | string
    direction?: Enumsync_directionFilter<"sync_log"> | $Enums.sync_direction
    status?: Enumsync_statusFilter<"sync_log"> | $Enums.sync_status
    record_count?: IntFilter<"sync_log"> | number
    created_at?: DateTimeFilter<"sync_log"> | Date | string
    completed_at?: DateTimeNullableFilter<"sync_log"> | Date | string | null
    error_message?: StringNullableFilter<"sync_log"> | string | null
    device?: XOR<DeviceRelationFilter, deviceWhereInput>
  }, "id">

  export type sync_logOrderByWithAggregationInput = {
    id?: SortOrder
    device_id?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    record_count?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrderInput | SortOrder
    error_message?: SortOrderInput | SortOrder
    _count?: sync_logCountOrderByAggregateInput
    _avg?: sync_logAvgOrderByAggregateInput
    _max?: sync_logMaxOrderByAggregateInput
    _min?: sync_logMinOrderByAggregateInput
    _sum?: sync_logSumOrderByAggregateInput
  }

  export type sync_logScalarWhereWithAggregatesInput = {
    AND?: sync_logScalarWhereWithAggregatesInput | sync_logScalarWhereWithAggregatesInput[]
    OR?: sync_logScalarWhereWithAggregatesInput[]
    NOT?: sync_logScalarWhereWithAggregatesInput | sync_logScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"sync_log"> | string
    device_id?: StringWithAggregatesFilter<"sync_log"> | string
    direction?: Enumsync_directionWithAggregatesFilter<"sync_log"> | $Enums.sync_direction
    status?: Enumsync_statusWithAggregatesFilter<"sync_log"> | $Enums.sync_status
    record_count?: IntWithAggregatesFilter<"sync_log"> | number
    created_at?: DateTimeWithAggregatesFilter<"sync_log"> | Date | string
    completed_at?: DateTimeNullableWithAggregatesFilter<"sync_log"> | Date | string | null
    error_message?: StringNullableWithAggregatesFilter<"sync_log"> | string | null
  }

  export type sync_conflictWhereInput = {
    AND?: sync_conflictWhereInput | sync_conflictWhereInput[]
    OR?: sync_conflictWhereInput[]
    NOT?: sync_conflictWhereInput | sync_conflictWhereInput[]
    id?: StringFilter<"sync_conflict"> | string
    device_id?: StringFilter<"sync_conflict"> | string
    entity_type?: StringFilter<"sync_conflict"> | string
    entity_id?: StringFilter<"sync_conflict"> | string
    server_version?: StringFilter<"sync_conflict"> | string
    client_version?: StringFilter<"sync_conflict"> | string
    resolved_at?: DateTimeNullableFilter<"sync_conflict"> | Date | string | null
    resolution?: Enumconflict_resolutionNullableFilter<"sync_conflict"> | $Enums.conflict_resolution | null
    detected_at?: DateTimeFilter<"sync_conflict"> | Date | string
    device?: XOR<DeviceRelationFilter, deviceWhereInput>
  }

  export type sync_conflictOrderByWithRelationInput = {
    id?: SortOrder
    device_id?: SortOrder
    entity_type?: SortOrder
    entity_id?: SortOrder
    server_version?: SortOrder
    client_version?: SortOrder
    resolved_at?: SortOrderInput | SortOrder
    resolution?: SortOrderInput | SortOrder
    detected_at?: SortOrder
    device?: deviceOrderByWithRelationInput
  }

  export type sync_conflictWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: sync_conflictWhereInput | sync_conflictWhereInput[]
    OR?: sync_conflictWhereInput[]
    NOT?: sync_conflictWhereInput | sync_conflictWhereInput[]
    device_id?: StringFilter<"sync_conflict"> | string
    entity_type?: StringFilter<"sync_conflict"> | string
    entity_id?: StringFilter<"sync_conflict"> | string
    server_version?: StringFilter<"sync_conflict"> | string
    client_version?: StringFilter<"sync_conflict"> | string
    resolved_at?: DateTimeNullableFilter<"sync_conflict"> | Date | string | null
    resolution?: Enumconflict_resolutionNullableFilter<"sync_conflict"> | $Enums.conflict_resolution | null
    detected_at?: DateTimeFilter<"sync_conflict"> | Date | string
    device?: XOR<DeviceRelationFilter, deviceWhereInput>
  }, "id">

  export type sync_conflictOrderByWithAggregationInput = {
    id?: SortOrder
    device_id?: SortOrder
    entity_type?: SortOrder
    entity_id?: SortOrder
    server_version?: SortOrder
    client_version?: SortOrder
    resolved_at?: SortOrderInput | SortOrder
    resolution?: SortOrderInput | SortOrder
    detected_at?: SortOrder
    _count?: sync_conflictCountOrderByAggregateInput
    _max?: sync_conflictMaxOrderByAggregateInput
    _min?: sync_conflictMinOrderByAggregateInput
  }

  export type sync_conflictScalarWhereWithAggregatesInput = {
    AND?: sync_conflictScalarWhereWithAggregatesInput | sync_conflictScalarWhereWithAggregatesInput[]
    OR?: sync_conflictScalarWhereWithAggregatesInput[]
    NOT?: sync_conflictScalarWhereWithAggregatesInput | sync_conflictScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"sync_conflict"> | string
    device_id?: StringWithAggregatesFilter<"sync_conflict"> | string
    entity_type?: StringWithAggregatesFilter<"sync_conflict"> | string
    entity_id?: StringWithAggregatesFilter<"sync_conflict"> | string
    server_version?: StringWithAggregatesFilter<"sync_conflict"> | string
    client_version?: StringWithAggregatesFilter<"sync_conflict"> | string
    resolved_at?: DateTimeNullableWithAggregatesFilter<"sync_conflict"> | Date | string | null
    resolution?: Enumconflict_resolutionNullableWithAggregatesFilter<"sync_conflict"> | $Enums.conflict_resolution | null
    detected_at?: DateTimeWithAggregatesFilter<"sync_conflict"> | Date | string
  }

  export type student_transferWhereInput = {
    AND?: student_transferWhereInput | student_transferWhereInput[]
    OR?: student_transferWhereInput[]
    NOT?: student_transferWhereInput | student_transferWhereInput[]
    id?: StringFilter<"student_transfer"> | string
    from_device_id?: StringFilter<"student_transfer"> | string
    to_device_id?: StringFilter<"student_transfer"> | string
    status?: Enumtransfer_statusFilter<"student_transfer"> | $Enums.transfer_status
    transferred_at?: DateTimeNullableFilter<"student_transfer"> | Date | string | null
    failed_at?: DateTimeNullableFilter<"student_transfer"> | Date | string | null
    error_reason?: StringNullableFilter<"student_transfer"> | string | null
    student_ids?: StringNullableListFilter<"student_transfer">
    created_at?: DateTimeFilter<"student_transfer"> | Date | string
    updated_at?: DateTimeFilter<"student_transfer"> | Date | string
  }

  export type student_transferOrderByWithRelationInput = {
    id?: SortOrder
    from_device_id?: SortOrder
    to_device_id?: SortOrder
    status?: SortOrder
    transferred_at?: SortOrderInput | SortOrder
    failed_at?: SortOrderInput | SortOrder
    error_reason?: SortOrderInput | SortOrder
    student_ids?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type student_transferWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: student_transferWhereInput | student_transferWhereInput[]
    OR?: student_transferWhereInput[]
    NOT?: student_transferWhereInput | student_transferWhereInput[]
    from_device_id?: StringFilter<"student_transfer"> | string
    to_device_id?: StringFilter<"student_transfer"> | string
    status?: Enumtransfer_statusFilter<"student_transfer"> | $Enums.transfer_status
    transferred_at?: DateTimeNullableFilter<"student_transfer"> | Date | string | null
    failed_at?: DateTimeNullableFilter<"student_transfer"> | Date | string | null
    error_reason?: StringNullableFilter<"student_transfer"> | string | null
    student_ids?: StringNullableListFilter<"student_transfer">
    created_at?: DateTimeFilter<"student_transfer"> | Date | string
    updated_at?: DateTimeFilter<"student_transfer"> | Date | string
  }, "id">

  export type student_transferOrderByWithAggregationInput = {
    id?: SortOrder
    from_device_id?: SortOrder
    to_device_id?: SortOrder
    status?: SortOrder
    transferred_at?: SortOrderInput | SortOrder
    failed_at?: SortOrderInput | SortOrder
    error_reason?: SortOrderInput | SortOrder
    student_ids?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: student_transferCountOrderByAggregateInput
    _max?: student_transferMaxOrderByAggregateInput
    _min?: student_transferMinOrderByAggregateInput
  }

  export type student_transferScalarWhereWithAggregatesInput = {
    AND?: student_transferScalarWhereWithAggregatesInput | student_transferScalarWhereWithAggregatesInput[]
    OR?: student_transferScalarWhereWithAggregatesInput[]
    NOT?: student_transferScalarWhereWithAggregatesInput | student_transferScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"student_transfer"> | string
    from_device_id?: StringWithAggregatesFilter<"student_transfer"> | string
    to_device_id?: StringWithAggregatesFilter<"student_transfer"> | string
    status?: Enumtransfer_statusWithAggregatesFilter<"student_transfer"> | $Enums.transfer_status
    transferred_at?: DateTimeNullableWithAggregatesFilter<"student_transfer"> | Date | string | null
    failed_at?: DateTimeNullableWithAggregatesFilter<"student_transfer"> | Date | string | null
    error_reason?: StringNullableWithAggregatesFilter<"student_transfer"> | string | null
    student_ids?: StringNullableListFilter<"student_transfer">
    created_at?: DateTimeWithAggregatesFilter<"student_transfer"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"student_transfer"> | Date | string
  }

  export type deviceCreateInput = {
    id?: string
    type: $Enums.device_type
    name: string
    last_seen_at?: Date | string
    created_at?: Date | string
    deleted_at?: Date | string | null
    sync_logs?: sync_logCreateNestedManyWithoutDeviceInput
    conflicts?: sync_conflictCreateNestedManyWithoutDeviceInput
  }

  export type deviceUncheckedCreateInput = {
    id?: string
    type: $Enums.device_type
    name: string
    last_seen_at?: Date | string
    created_at?: Date | string
    deleted_at?: Date | string | null
    sync_logs?: sync_logUncheckedCreateNestedManyWithoutDeviceInput
    conflicts?: sync_conflictUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type deviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumdevice_typeFieldUpdateOperationsInput | $Enums.device_type
    name?: StringFieldUpdateOperationsInput | string
    last_seen_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sync_logs?: sync_logUpdateManyWithoutDeviceNestedInput
    conflicts?: sync_conflictUpdateManyWithoutDeviceNestedInput
  }

  export type deviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumdevice_typeFieldUpdateOperationsInput | $Enums.device_type
    name?: StringFieldUpdateOperationsInput | string
    last_seen_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sync_logs?: sync_logUncheckedUpdateManyWithoutDeviceNestedInput
    conflicts?: sync_conflictUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type deviceCreateManyInput = {
    id?: string
    type: $Enums.device_type
    name: string
    last_seen_at?: Date | string
    created_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type deviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumdevice_typeFieldUpdateOperationsInput | $Enums.device_type
    name?: StringFieldUpdateOperationsInput | string
    last_seen_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type deviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumdevice_typeFieldUpdateOperationsInput | $Enums.device_type
    name?: StringFieldUpdateOperationsInput | string
    last_seen_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type sync_logCreateInput = {
    id?: string
    direction: $Enums.sync_direction
    status?: $Enums.sync_status
    record_count?: number
    created_at?: Date | string
    completed_at?: Date | string | null
    error_message?: string | null
    device: deviceCreateNestedOneWithoutSync_logsInput
  }

  export type sync_logUncheckedCreateInput = {
    id?: string
    device_id: string
    direction: $Enums.sync_direction
    status?: $Enums.sync_status
    record_count?: number
    created_at?: Date | string
    completed_at?: Date | string | null
    error_message?: string | null
  }

  export type sync_logUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: Enumsync_directionFieldUpdateOperationsInput | $Enums.sync_direction
    status?: Enumsync_statusFieldUpdateOperationsInput | $Enums.sync_status
    record_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    device?: deviceUpdateOneRequiredWithoutSync_logsNestedInput
  }

  export type sync_logUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    device_id?: StringFieldUpdateOperationsInput | string
    direction?: Enumsync_directionFieldUpdateOperationsInput | $Enums.sync_direction
    status?: Enumsync_statusFieldUpdateOperationsInput | $Enums.sync_status
    record_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type sync_logCreateManyInput = {
    id?: string
    device_id: string
    direction: $Enums.sync_direction
    status?: $Enums.sync_status
    record_count?: number
    created_at?: Date | string
    completed_at?: Date | string | null
    error_message?: string | null
  }

  export type sync_logUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: Enumsync_directionFieldUpdateOperationsInput | $Enums.sync_direction
    status?: Enumsync_statusFieldUpdateOperationsInput | $Enums.sync_status
    record_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type sync_logUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    device_id?: StringFieldUpdateOperationsInput | string
    direction?: Enumsync_directionFieldUpdateOperationsInput | $Enums.sync_direction
    status?: Enumsync_statusFieldUpdateOperationsInput | $Enums.sync_status
    record_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type sync_conflictCreateInput = {
    id?: string
    entity_type: string
    entity_id: string
    server_version: string
    client_version: string
    resolved_at?: Date | string | null
    resolution?: $Enums.conflict_resolution | null
    detected_at?: Date | string
    device: deviceCreateNestedOneWithoutConflictsInput
  }

  export type sync_conflictUncheckedCreateInput = {
    id?: string
    device_id: string
    entity_type: string
    entity_id: string
    server_version: string
    client_version: string
    resolved_at?: Date | string | null
    resolution?: $Enums.conflict_resolution | null
    detected_at?: Date | string
  }

  export type sync_conflictUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity_type?: StringFieldUpdateOperationsInput | string
    entity_id?: StringFieldUpdateOperationsInput | string
    server_version?: StringFieldUpdateOperationsInput | string
    client_version?: StringFieldUpdateOperationsInput | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableEnumconflict_resolutionFieldUpdateOperationsInput | $Enums.conflict_resolution | null
    detected_at?: DateTimeFieldUpdateOperationsInput | Date | string
    device?: deviceUpdateOneRequiredWithoutConflictsNestedInput
  }

  export type sync_conflictUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    device_id?: StringFieldUpdateOperationsInput | string
    entity_type?: StringFieldUpdateOperationsInput | string
    entity_id?: StringFieldUpdateOperationsInput | string
    server_version?: StringFieldUpdateOperationsInput | string
    client_version?: StringFieldUpdateOperationsInput | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableEnumconflict_resolutionFieldUpdateOperationsInput | $Enums.conflict_resolution | null
    detected_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sync_conflictCreateManyInput = {
    id?: string
    device_id: string
    entity_type: string
    entity_id: string
    server_version: string
    client_version: string
    resolved_at?: Date | string | null
    resolution?: $Enums.conflict_resolution | null
    detected_at?: Date | string
  }

  export type sync_conflictUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity_type?: StringFieldUpdateOperationsInput | string
    entity_id?: StringFieldUpdateOperationsInput | string
    server_version?: StringFieldUpdateOperationsInput | string
    client_version?: StringFieldUpdateOperationsInput | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableEnumconflict_resolutionFieldUpdateOperationsInput | $Enums.conflict_resolution | null
    detected_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sync_conflictUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    device_id?: StringFieldUpdateOperationsInput | string
    entity_type?: StringFieldUpdateOperationsInput | string
    entity_id?: StringFieldUpdateOperationsInput | string
    server_version?: StringFieldUpdateOperationsInput | string
    client_version?: StringFieldUpdateOperationsInput | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableEnumconflict_resolutionFieldUpdateOperationsInput | $Enums.conflict_resolution | null
    detected_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type student_transferCreateInput = {
    id?: string
    from_device_id: string
    to_device_id: string
    status?: $Enums.transfer_status
    transferred_at?: Date | string | null
    failed_at?: Date | string | null
    error_reason?: string | null
    student_ids?: student_transferCreatestudent_idsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type student_transferUncheckedCreateInput = {
    id?: string
    from_device_id: string
    to_device_id: string
    status?: $Enums.transfer_status
    transferred_at?: Date | string | null
    failed_at?: Date | string | null
    error_reason?: string | null
    student_ids?: student_transferCreatestudent_idsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type student_transferUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    from_device_id?: StringFieldUpdateOperationsInput | string
    to_device_id?: StringFieldUpdateOperationsInput | string
    status?: Enumtransfer_statusFieldUpdateOperationsInput | $Enums.transfer_status
    transferred_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error_reason?: NullableStringFieldUpdateOperationsInput | string | null
    student_ids?: student_transferUpdatestudent_idsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type student_transferUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    from_device_id?: StringFieldUpdateOperationsInput | string
    to_device_id?: StringFieldUpdateOperationsInput | string
    status?: Enumtransfer_statusFieldUpdateOperationsInput | $Enums.transfer_status
    transferred_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error_reason?: NullableStringFieldUpdateOperationsInput | string | null
    student_ids?: student_transferUpdatestudent_idsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type student_transferCreateManyInput = {
    id?: string
    from_device_id: string
    to_device_id: string
    status?: $Enums.transfer_status
    transferred_at?: Date | string | null
    failed_at?: Date | string | null
    error_reason?: string | null
    student_ids?: student_transferCreatestudent_idsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type student_transferUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    from_device_id?: StringFieldUpdateOperationsInput | string
    to_device_id?: StringFieldUpdateOperationsInput | string
    status?: Enumtransfer_statusFieldUpdateOperationsInput | $Enums.transfer_status
    transferred_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error_reason?: NullableStringFieldUpdateOperationsInput | string | null
    student_ids?: student_transferUpdatestudent_idsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type student_transferUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    from_device_id?: StringFieldUpdateOperationsInput | string
    to_device_id?: StringFieldUpdateOperationsInput | string
    status?: Enumtransfer_statusFieldUpdateOperationsInput | $Enums.transfer_status
    transferred_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error_reason?: NullableStringFieldUpdateOperationsInput | string | null
    student_ids?: student_transferUpdatestudent_idsInput | string[]
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

  export type Enumdevice_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.device_type | Enumdevice_typeFieldRefInput<$PrismaModel>
    in?: $Enums.device_type[] | ListEnumdevice_typeFieldRefInput<$PrismaModel>
    notIn?: $Enums.device_type[] | ListEnumdevice_typeFieldRefInput<$PrismaModel>
    not?: NestedEnumdevice_typeFilter<$PrismaModel> | $Enums.device_type
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

  export type Sync_logListRelationFilter = {
    every?: sync_logWhereInput
    some?: sync_logWhereInput
    none?: sync_logWhereInput
  }

  export type Sync_conflictListRelationFilter = {
    every?: sync_conflictWhereInput
    some?: sync_conflictWhereInput
    none?: sync_conflictWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type sync_logOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type sync_conflictOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type deviceCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    last_seen_at?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type deviceMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    last_seen_at?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type deviceMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    last_seen_at?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrder
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

  export type Enumdevice_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.device_type | Enumdevice_typeFieldRefInput<$PrismaModel>
    in?: $Enums.device_type[] | ListEnumdevice_typeFieldRefInput<$PrismaModel>
    notIn?: $Enums.device_type[] | ListEnumdevice_typeFieldRefInput<$PrismaModel>
    not?: NestedEnumdevice_typeWithAggregatesFilter<$PrismaModel> | $Enums.device_type
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumdevice_typeFilter<$PrismaModel>
    _max?: NestedEnumdevice_typeFilter<$PrismaModel>
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

  export type Enumsync_directionFilter<$PrismaModel = never> = {
    equals?: $Enums.sync_direction | Enumsync_directionFieldRefInput<$PrismaModel>
    in?: $Enums.sync_direction[] | ListEnumsync_directionFieldRefInput<$PrismaModel>
    notIn?: $Enums.sync_direction[] | ListEnumsync_directionFieldRefInput<$PrismaModel>
    not?: NestedEnumsync_directionFilter<$PrismaModel> | $Enums.sync_direction
  }

  export type Enumsync_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.sync_status | Enumsync_statusFieldRefInput<$PrismaModel>
    in?: $Enums.sync_status[] | ListEnumsync_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.sync_status[] | ListEnumsync_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumsync_statusFilter<$PrismaModel> | $Enums.sync_status
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

  export type DeviceRelationFilter = {
    is?: deviceWhereInput
    isNot?: deviceWhereInput
  }

  export type sync_logCountOrderByAggregateInput = {
    id?: SortOrder
    device_id?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    record_count?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrder
    error_message?: SortOrder
  }

  export type sync_logAvgOrderByAggregateInput = {
    record_count?: SortOrder
  }

  export type sync_logMaxOrderByAggregateInput = {
    id?: SortOrder
    device_id?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    record_count?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrder
    error_message?: SortOrder
  }

  export type sync_logMinOrderByAggregateInput = {
    id?: SortOrder
    device_id?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    record_count?: SortOrder
    created_at?: SortOrder
    completed_at?: SortOrder
    error_message?: SortOrder
  }

  export type sync_logSumOrderByAggregateInput = {
    record_count?: SortOrder
  }

  export type Enumsync_directionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.sync_direction | Enumsync_directionFieldRefInput<$PrismaModel>
    in?: $Enums.sync_direction[] | ListEnumsync_directionFieldRefInput<$PrismaModel>
    notIn?: $Enums.sync_direction[] | ListEnumsync_directionFieldRefInput<$PrismaModel>
    not?: NestedEnumsync_directionWithAggregatesFilter<$PrismaModel> | $Enums.sync_direction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumsync_directionFilter<$PrismaModel>
    _max?: NestedEnumsync_directionFilter<$PrismaModel>
  }

  export type Enumsync_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.sync_status | Enumsync_statusFieldRefInput<$PrismaModel>
    in?: $Enums.sync_status[] | ListEnumsync_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.sync_status[] | ListEnumsync_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumsync_statusWithAggregatesFilter<$PrismaModel> | $Enums.sync_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumsync_statusFilter<$PrismaModel>
    _max?: NestedEnumsync_statusFilter<$PrismaModel>
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

  export type Enumconflict_resolutionNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.conflict_resolution | Enumconflict_resolutionFieldRefInput<$PrismaModel> | null
    in?: $Enums.conflict_resolution[] | ListEnumconflict_resolutionFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.conflict_resolution[] | ListEnumconflict_resolutionFieldRefInput<$PrismaModel> | null
    not?: NestedEnumconflict_resolutionNullableFilter<$PrismaModel> | $Enums.conflict_resolution | null
  }

  export type sync_conflictCountOrderByAggregateInput = {
    id?: SortOrder
    device_id?: SortOrder
    entity_type?: SortOrder
    entity_id?: SortOrder
    server_version?: SortOrder
    client_version?: SortOrder
    resolved_at?: SortOrder
    resolution?: SortOrder
    detected_at?: SortOrder
  }

  export type sync_conflictMaxOrderByAggregateInput = {
    id?: SortOrder
    device_id?: SortOrder
    entity_type?: SortOrder
    entity_id?: SortOrder
    server_version?: SortOrder
    client_version?: SortOrder
    resolved_at?: SortOrder
    resolution?: SortOrder
    detected_at?: SortOrder
  }

  export type sync_conflictMinOrderByAggregateInput = {
    id?: SortOrder
    device_id?: SortOrder
    entity_type?: SortOrder
    entity_id?: SortOrder
    server_version?: SortOrder
    client_version?: SortOrder
    resolved_at?: SortOrder
    resolution?: SortOrder
    detected_at?: SortOrder
  }

  export type Enumconflict_resolutionNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.conflict_resolution | Enumconflict_resolutionFieldRefInput<$PrismaModel> | null
    in?: $Enums.conflict_resolution[] | ListEnumconflict_resolutionFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.conflict_resolution[] | ListEnumconflict_resolutionFieldRefInput<$PrismaModel> | null
    not?: NestedEnumconflict_resolutionNullableWithAggregatesFilter<$PrismaModel> | $Enums.conflict_resolution | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumconflict_resolutionNullableFilter<$PrismaModel>
    _max?: NestedEnumconflict_resolutionNullableFilter<$PrismaModel>
  }

  export type Enumtransfer_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.transfer_status | Enumtransfer_statusFieldRefInput<$PrismaModel>
    in?: $Enums.transfer_status[] | ListEnumtransfer_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.transfer_status[] | ListEnumtransfer_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumtransfer_statusFilter<$PrismaModel> | $Enums.transfer_status
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type student_transferCountOrderByAggregateInput = {
    id?: SortOrder
    from_device_id?: SortOrder
    to_device_id?: SortOrder
    status?: SortOrder
    transferred_at?: SortOrder
    failed_at?: SortOrder
    error_reason?: SortOrder
    student_ids?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type student_transferMaxOrderByAggregateInput = {
    id?: SortOrder
    from_device_id?: SortOrder
    to_device_id?: SortOrder
    status?: SortOrder
    transferred_at?: SortOrder
    failed_at?: SortOrder
    error_reason?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type student_transferMinOrderByAggregateInput = {
    id?: SortOrder
    from_device_id?: SortOrder
    to_device_id?: SortOrder
    status?: SortOrder
    transferred_at?: SortOrder
    failed_at?: SortOrder
    error_reason?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type Enumtransfer_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.transfer_status | Enumtransfer_statusFieldRefInput<$PrismaModel>
    in?: $Enums.transfer_status[] | ListEnumtransfer_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.transfer_status[] | ListEnumtransfer_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumtransfer_statusWithAggregatesFilter<$PrismaModel> | $Enums.transfer_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumtransfer_statusFilter<$PrismaModel>
    _max?: NestedEnumtransfer_statusFilter<$PrismaModel>
  }

  export type sync_logCreateNestedManyWithoutDeviceInput = {
    create?: XOR<sync_logCreateWithoutDeviceInput, sync_logUncheckedCreateWithoutDeviceInput> | sync_logCreateWithoutDeviceInput[] | sync_logUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: sync_logCreateOrConnectWithoutDeviceInput | sync_logCreateOrConnectWithoutDeviceInput[]
    createMany?: sync_logCreateManyDeviceInputEnvelope
    connect?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
  }

  export type sync_conflictCreateNestedManyWithoutDeviceInput = {
    create?: XOR<sync_conflictCreateWithoutDeviceInput, sync_conflictUncheckedCreateWithoutDeviceInput> | sync_conflictCreateWithoutDeviceInput[] | sync_conflictUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: sync_conflictCreateOrConnectWithoutDeviceInput | sync_conflictCreateOrConnectWithoutDeviceInput[]
    createMany?: sync_conflictCreateManyDeviceInputEnvelope
    connect?: sync_conflictWhereUniqueInput | sync_conflictWhereUniqueInput[]
  }

  export type sync_logUncheckedCreateNestedManyWithoutDeviceInput = {
    create?: XOR<sync_logCreateWithoutDeviceInput, sync_logUncheckedCreateWithoutDeviceInput> | sync_logCreateWithoutDeviceInput[] | sync_logUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: sync_logCreateOrConnectWithoutDeviceInput | sync_logCreateOrConnectWithoutDeviceInput[]
    createMany?: sync_logCreateManyDeviceInputEnvelope
    connect?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
  }

  export type sync_conflictUncheckedCreateNestedManyWithoutDeviceInput = {
    create?: XOR<sync_conflictCreateWithoutDeviceInput, sync_conflictUncheckedCreateWithoutDeviceInput> | sync_conflictCreateWithoutDeviceInput[] | sync_conflictUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: sync_conflictCreateOrConnectWithoutDeviceInput | sync_conflictCreateOrConnectWithoutDeviceInput[]
    createMany?: sync_conflictCreateManyDeviceInputEnvelope
    connect?: sync_conflictWhereUniqueInput | sync_conflictWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type Enumdevice_typeFieldUpdateOperationsInput = {
    set?: $Enums.device_type
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type sync_logUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<sync_logCreateWithoutDeviceInput, sync_logUncheckedCreateWithoutDeviceInput> | sync_logCreateWithoutDeviceInput[] | sync_logUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: sync_logCreateOrConnectWithoutDeviceInput | sync_logCreateOrConnectWithoutDeviceInput[]
    upsert?: sync_logUpsertWithWhereUniqueWithoutDeviceInput | sync_logUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: sync_logCreateManyDeviceInputEnvelope
    set?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    disconnect?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    delete?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    connect?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    update?: sync_logUpdateWithWhereUniqueWithoutDeviceInput | sync_logUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: sync_logUpdateManyWithWhereWithoutDeviceInput | sync_logUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: sync_logScalarWhereInput | sync_logScalarWhereInput[]
  }

  export type sync_conflictUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<sync_conflictCreateWithoutDeviceInput, sync_conflictUncheckedCreateWithoutDeviceInput> | sync_conflictCreateWithoutDeviceInput[] | sync_conflictUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: sync_conflictCreateOrConnectWithoutDeviceInput | sync_conflictCreateOrConnectWithoutDeviceInput[]
    upsert?: sync_conflictUpsertWithWhereUniqueWithoutDeviceInput | sync_conflictUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: sync_conflictCreateManyDeviceInputEnvelope
    set?: sync_conflictWhereUniqueInput | sync_conflictWhereUniqueInput[]
    disconnect?: sync_conflictWhereUniqueInput | sync_conflictWhereUniqueInput[]
    delete?: sync_conflictWhereUniqueInput | sync_conflictWhereUniqueInput[]
    connect?: sync_conflictWhereUniqueInput | sync_conflictWhereUniqueInput[]
    update?: sync_conflictUpdateWithWhereUniqueWithoutDeviceInput | sync_conflictUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: sync_conflictUpdateManyWithWhereWithoutDeviceInput | sync_conflictUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: sync_conflictScalarWhereInput | sync_conflictScalarWhereInput[]
  }

  export type sync_logUncheckedUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<sync_logCreateWithoutDeviceInput, sync_logUncheckedCreateWithoutDeviceInput> | sync_logCreateWithoutDeviceInput[] | sync_logUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: sync_logCreateOrConnectWithoutDeviceInput | sync_logCreateOrConnectWithoutDeviceInput[]
    upsert?: sync_logUpsertWithWhereUniqueWithoutDeviceInput | sync_logUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: sync_logCreateManyDeviceInputEnvelope
    set?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    disconnect?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    delete?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    connect?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    update?: sync_logUpdateWithWhereUniqueWithoutDeviceInput | sync_logUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: sync_logUpdateManyWithWhereWithoutDeviceInput | sync_logUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: sync_logScalarWhereInput | sync_logScalarWhereInput[]
  }

  export type sync_conflictUncheckedUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<sync_conflictCreateWithoutDeviceInput, sync_conflictUncheckedCreateWithoutDeviceInput> | sync_conflictCreateWithoutDeviceInput[] | sync_conflictUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: sync_conflictCreateOrConnectWithoutDeviceInput | sync_conflictCreateOrConnectWithoutDeviceInput[]
    upsert?: sync_conflictUpsertWithWhereUniqueWithoutDeviceInput | sync_conflictUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: sync_conflictCreateManyDeviceInputEnvelope
    set?: sync_conflictWhereUniqueInput | sync_conflictWhereUniqueInput[]
    disconnect?: sync_conflictWhereUniqueInput | sync_conflictWhereUniqueInput[]
    delete?: sync_conflictWhereUniqueInput | sync_conflictWhereUniqueInput[]
    connect?: sync_conflictWhereUniqueInput | sync_conflictWhereUniqueInput[]
    update?: sync_conflictUpdateWithWhereUniqueWithoutDeviceInput | sync_conflictUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: sync_conflictUpdateManyWithWhereWithoutDeviceInput | sync_conflictUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: sync_conflictScalarWhereInput | sync_conflictScalarWhereInput[]
  }

  export type deviceCreateNestedOneWithoutSync_logsInput = {
    create?: XOR<deviceCreateWithoutSync_logsInput, deviceUncheckedCreateWithoutSync_logsInput>
    connectOrCreate?: deviceCreateOrConnectWithoutSync_logsInput
    connect?: deviceWhereUniqueInput
  }

  export type Enumsync_directionFieldUpdateOperationsInput = {
    set?: $Enums.sync_direction
  }

  export type Enumsync_statusFieldUpdateOperationsInput = {
    set?: $Enums.sync_status
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type deviceUpdateOneRequiredWithoutSync_logsNestedInput = {
    create?: XOR<deviceCreateWithoutSync_logsInput, deviceUncheckedCreateWithoutSync_logsInput>
    connectOrCreate?: deviceCreateOrConnectWithoutSync_logsInput
    upsert?: deviceUpsertWithoutSync_logsInput
    connect?: deviceWhereUniqueInput
    update?: XOR<XOR<deviceUpdateToOneWithWhereWithoutSync_logsInput, deviceUpdateWithoutSync_logsInput>, deviceUncheckedUpdateWithoutSync_logsInput>
  }

  export type deviceCreateNestedOneWithoutConflictsInput = {
    create?: XOR<deviceCreateWithoutConflictsInput, deviceUncheckedCreateWithoutConflictsInput>
    connectOrCreate?: deviceCreateOrConnectWithoutConflictsInput
    connect?: deviceWhereUniqueInput
  }

  export type NullableEnumconflict_resolutionFieldUpdateOperationsInput = {
    set?: $Enums.conflict_resolution | null
  }

  export type deviceUpdateOneRequiredWithoutConflictsNestedInput = {
    create?: XOR<deviceCreateWithoutConflictsInput, deviceUncheckedCreateWithoutConflictsInput>
    connectOrCreate?: deviceCreateOrConnectWithoutConflictsInput
    upsert?: deviceUpsertWithoutConflictsInput
    connect?: deviceWhereUniqueInput
    update?: XOR<XOR<deviceUpdateToOneWithWhereWithoutConflictsInput, deviceUpdateWithoutConflictsInput>, deviceUncheckedUpdateWithoutConflictsInput>
  }

  export type student_transferCreatestudent_idsInput = {
    set: string[]
  }

  export type Enumtransfer_statusFieldUpdateOperationsInput = {
    set?: $Enums.transfer_status
  }

  export type student_transferUpdatestudent_idsInput = {
    set?: string[]
    push?: string | string[]
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

  export type NestedEnumdevice_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.device_type | Enumdevice_typeFieldRefInput<$PrismaModel>
    in?: $Enums.device_type[] | ListEnumdevice_typeFieldRefInput<$PrismaModel>
    notIn?: $Enums.device_type[] | ListEnumdevice_typeFieldRefInput<$PrismaModel>
    not?: NestedEnumdevice_typeFilter<$PrismaModel> | $Enums.device_type
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

  export type NestedEnumdevice_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.device_type | Enumdevice_typeFieldRefInput<$PrismaModel>
    in?: $Enums.device_type[] | ListEnumdevice_typeFieldRefInput<$PrismaModel>
    notIn?: $Enums.device_type[] | ListEnumdevice_typeFieldRefInput<$PrismaModel>
    not?: NestedEnumdevice_typeWithAggregatesFilter<$PrismaModel> | $Enums.device_type
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumdevice_typeFilter<$PrismaModel>
    _max?: NestedEnumdevice_typeFilter<$PrismaModel>
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

  export type NestedEnumsync_directionFilter<$PrismaModel = never> = {
    equals?: $Enums.sync_direction | Enumsync_directionFieldRefInput<$PrismaModel>
    in?: $Enums.sync_direction[] | ListEnumsync_directionFieldRefInput<$PrismaModel>
    notIn?: $Enums.sync_direction[] | ListEnumsync_directionFieldRefInput<$PrismaModel>
    not?: NestedEnumsync_directionFilter<$PrismaModel> | $Enums.sync_direction
  }

  export type NestedEnumsync_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.sync_status | Enumsync_statusFieldRefInput<$PrismaModel>
    in?: $Enums.sync_status[] | ListEnumsync_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.sync_status[] | ListEnumsync_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumsync_statusFilter<$PrismaModel> | $Enums.sync_status
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

  export type NestedEnumsync_directionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.sync_direction | Enumsync_directionFieldRefInput<$PrismaModel>
    in?: $Enums.sync_direction[] | ListEnumsync_directionFieldRefInput<$PrismaModel>
    notIn?: $Enums.sync_direction[] | ListEnumsync_directionFieldRefInput<$PrismaModel>
    not?: NestedEnumsync_directionWithAggregatesFilter<$PrismaModel> | $Enums.sync_direction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumsync_directionFilter<$PrismaModel>
    _max?: NestedEnumsync_directionFilter<$PrismaModel>
  }

  export type NestedEnumsync_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.sync_status | Enumsync_statusFieldRefInput<$PrismaModel>
    in?: $Enums.sync_status[] | ListEnumsync_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.sync_status[] | ListEnumsync_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumsync_statusWithAggregatesFilter<$PrismaModel> | $Enums.sync_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumsync_statusFilter<$PrismaModel>
    _max?: NestedEnumsync_statusFilter<$PrismaModel>
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

  export type NestedEnumconflict_resolutionNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.conflict_resolution | Enumconflict_resolutionFieldRefInput<$PrismaModel> | null
    in?: $Enums.conflict_resolution[] | ListEnumconflict_resolutionFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.conflict_resolution[] | ListEnumconflict_resolutionFieldRefInput<$PrismaModel> | null
    not?: NestedEnumconflict_resolutionNullableFilter<$PrismaModel> | $Enums.conflict_resolution | null
  }

  export type NestedEnumconflict_resolutionNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.conflict_resolution | Enumconflict_resolutionFieldRefInput<$PrismaModel> | null
    in?: $Enums.conflict_resolution[] | ListEnumconflict_resolutionFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.conflict_resolution[] | ListEnumconflict_resolutionFieldRefInput<$PrismaModel> | null
    not?: NestedEnumconflict_resolutionNullableWithAggregatesFilter<$PrismaModel> | $Enums.conflict_resolution | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumconflict_resolutionNullableFilter<$PrismaModel>
    _max?: NestedEnumconflict_resolutionNullableFilter<$PrismaModel>
  }

  export type NestedEnumtransfer_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.transfer_status | Enumtransfer_statusFieldRefInput<$PrismaModel>
    in?: $Enums.transfer_status[] | ListEnumtransfer_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.transfer_status[] | ListEnumtransfer_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumtransfer_statusFilter<$PrismaModel> | $Enums.transfer_status
  }

  export type NestedEnumtransfer_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.transfer_status | Enumtransfer_statusFieldRefInput<$PrismaModel>
    in?: $Enums.transfer_status[] | ListEnumtransfer_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.transfer_status[] | ListEnumtransfer_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumtransfer_statusWithAggregatesFilter<$PrismaModel> | $Enums.transfer_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumtransfer_statusFilter<$PrismaModel>
    _max?: NestedEnumtransfer_statusFilter<$PrismaModel>
  }

  export type sync_logCreateWithoutDeviceInput = {
    id?: string
    direction: $Enums.sync_direction
    status?: $Enums.sync_status
    record_count?: number
    created_at?: Date | string
    completed_at?: Date | string | null
    error_message?: string | null
  }

  export type sync_logUncheckedCreateWithoutDeviceInput = {
    id?: string
    direction: $Enums.sync_direction
    status?: $Enums.sync_status
    record_count?: number
    created_at?: Date | string
    completed_at?: Date | string | null
    error_message?: string | null
  }

  export type sync_logCreateOrConnectWithoutDeviceInput = {
    where: sync_logWhereUniqueInput
    create: XOR<sync_logCreateWithoutDeviceInput, sync_logUncheckedCreateWithoutDeviceInput>
  }

  export type sync_logCreateManyDeviceInputEnvelope = {
    data: sync_logCreateManyDeviceInput | sync_logCreateManyDeviceInput[]
    skipDuplicates?: boolean
  }

  export type sync_conflictCreateWithoutDeviceInput = {
    id?: string
    entity_type: string
    entity_id: string
    server_version: string
    client_version: string
    resolved_at?: Date | string | null
    resolution?: $Enums.conflict_resolution | null
    detected_at?: Date | string
  }

  export type sync_conflictUncheckedCreateWithoutDeviceInput = {
    id?: string
    entity_type: string
    entity_id: string
    server_version: string
    client_version: string
    resolved_at?: Date | string | null
    resolution?: $Enums.conflict_resolution | null
    detected_at?: Date | string
  }

  export type sync_conflictCreateOrConnectWithoutDeviceInput = {
    where: sync_conflictWhereUniqueInput
    create: XOR<sync_conflictCreateWithoutDeviceInput, sync_conflictUncheckedCreateWithoutDeviceInput>
  }

  export type sync_conflictCreateManyDeviceInputEnvelope = {
    data: sync_conflictCreateManyDeviceInput | sync_conflictCreateManyDeviceInput[]
    skipDuplicates?: boolean
  }

  export type sync_logUpsertWithWhereUniqueWithoutDeviceInput = {
    where: sync_logWhereUniqueInput
    update: XOR<sync_logUpdateWithoutDeviceInput, sync_logUncheckedUpdateWithoutDeviceInput>
    create: XOR<sync_logCreateWithoutDeviceInput, sync_logUncheckedCreateWithoutDeviceInput>
  }

  export type sync_logUpdateWithWhereUniqueWithoutDeviceInput = {
    where: sync_logWhereUniqueInput
    data: XOR<sync_logUpdateWithoutDeviceInput, sync_logUncheckedUpdateWithoutDeviceInput>
  }

  export type sync_logUpdateManyWithWhereWithoutDeviceInput = {
    where: sync_logScalarWhereInput
    data: XOR<sync_logUpdateManyMutationInput, sync_logUncheckedUpdateManyWithoutDeviceInput>
  }

  export type sync_logScalarWhereInput = {
    AND?: sync_logScalarWhereInput | sync_logScalarWhereInput[]
    OR?: sync_logScalarWhereInput[]
    NOT?: sync_logScalarWhereInput | sync_logScalarWhereInput[]
    id?: StringFilter<"sync_log"> | string
    device_id?: StringFilter<"sync_log"> | string
    direction?: Enumsync_directionFilter<"sync_log"> | $Enums.sync_direction
    status?: Enumsync_statusFilter<"sync_log"> | $Enums.sync_status
    record_count?: IntFilter<"sync_log"> | number
    created_at?: DateTimeFilter<"sync_log"> | Date | string
    completed_at?: DateTimeNullableFilter<"sync_log"> | Date | string | null
    error_message?: StringNullableFilter<"sync_log"> | string | null
  }

  export type sync_conflictUpsertWithWhereUniqueWithoutDeviceInput = {
    where: sync_conflictWhereUniqueInput
    update: XOR<sync_conflictUpdateWithoutDeviceInput, sync_conflictUncheckedUpdateWithoutDeviceInput>
    create: XOR<sync_conflictCreateWithoutDeviceInput, sync_conflictUncheckedCreateWithoutDeviceInput>
  }

  export type sync_conflictUpdateWithWhereUniqueWithoutDeviceInput = {
    where: sync_conflictWhereUniqueInput
    data: XOR<sync_conflictUpdateWithoutDeviceInput, sync_conflictUncheckedUpdateWithoutDeviceInput>
  }

  export type sync_conflictUpdateManyWithWhereWithoutDeviceInput = {
    where: sync_conflictScalarWhereInput
    data: XOR<sync_conflictUpdateManyMutationInput, sync_conflictUncheckedUpdateManyWithoutDeviceInput>
  }

  export type sync_conflictScalarWhereInput = {
    AND?: sync_conflictScalarWhereInput | sync_conflictScalarWhereInput[]
    OR?: sync_conflictScalarWhereInput[]
    NOT?: sync_conflictScalarWhereInput | sync_conflictScalarWhereInput[]
    id?: StringFilter<"sync_conflict"> | string
    device_id?: StringFilter<"sync_conflict"> | string
    entity_type?: StringFilter<"sync_conflict"> | string
    entity_id?: StringFilter<"sync_conflict"> | string
    server_version?: StringFilter<"sync_conflict"> | string
    client_version?: StringFilter<"sync_conflict"> | string
    resolved_at?: DateTimeNullableFilter<"sync_conflict"> | Date | string | null
    resolution?: Enumconflict_resolutionNullableFilter<"sync_conflict"> | $Enums.conflict_resolution | null
    detected_at?: DateTimeFilter<"sync_conflict"> | Date | string
  }

  export type deviceCreateWithoutSync_logsInput = {
    id?: string
    type: $Enums.device_type
    name: string
    last_seen_at?: Date | string
    created_at?: Date | string
    deleted_at?: Date | string | null
    conflicts?: sync_conflictCreateNestedManyWithoutDeviceInput
  }

  export type deviceUncheckedCreateWithoutSync_logsInput = {
    id?: string
    type: $Enums.device_type
    name: string
    last_seen_at?: Date | string
    created_at?: Date | string
    deleted_at?: Date | string | null
    conflicts?: sync_conflictUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type deviceCreateOrConnectWithoutSync_logsInput = {
    where: deviceWhereUniqueInput
    create: XOR<deviceCreateWithoutSync_logsInput, deviceUncheckedCreateWithoutSync_logsInput>
  }

  export type deviceUpsertWithoutSync_logsInput = {
    update: XOR<deviceUpdateWithoutSync_logsInput, deviceUncheckedUpdateWithoutSync_logsInput>
    create: XOR<deviceCreateWithoutSync_logsInput, deviceUncheckedCreateWithoutSync_logsInput>
    where?: deviceWhereInput
  }

  export type deviceUpdateToOneWithWhereWithoutSync_logsInput = {
    where?: deviceWhereInput
    data: XOR<deviceUpdateWithoutSync_logsInput, deviceUncheckedUpdateWithoutSync_logsInput>
  }

  export type deviceUpdateWithoutSync_logsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumdevice_typeFieldUpdateOperationsInput | $Enums.device_type
    name?: StringFieldUpdateOperationsInput | string
    last_seen_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    conflicts?: sync_conflictUpdateManyWithoutDeviceNestedInput
  }

  export type deviceUncheckedUpdateWithoutSync_logsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumdevice_typeFieldUpdateOperationsInput | $Enums.device_type
    name?: StringFieldUpdateOperationsInput | string
    last_seen_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    conflicts?: sync_conflictUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type deviceCreateWithoutConflictsInput = {
    id?: string
    type: $Enums.device_type
    name: string
    last_seen_at?: Date | string
    created_at?: Date | string
    deleted_at?: Date | string | null
    sync_logs?: sync_logCreateNestedManyWithoutDeviceInput
  }

  export type deviceUncheckedCreateWithoutConflictsInput = {
    id?: string
    type: $Enums.device_type
    name: string
    last_seen_at?: Date | string
    created_at?: Date | string
    deleted_at?: Date | string | null
    sync_logs?: sync_logUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type deviceCreateOrConnectWithoutConflictsInput = {
    where: deviceWhereUniqueInput
    create: XOR<deviceCreateWithoutConflictsInput, deviceUncheckedCreateWithoutConflictsInput>
  }

  export type deviceUpsertWithoutConflictsInput = {
    update: XOR<deviceUpdateWithoutConflictsInput, deviceUncheckedUpdateWithoutConflictsInput>
    create: XOR<deviceCreateWithoutConflictsInput, deviceUncheckedCreateWithoutConflictsInput>
    where?: deviceWhereInput
  }

  export type deviceUpdateToOneWithWhereWithoutConflictsInput = {
    where?: deviceWhereInput
    data: XOR<deviceUpdateWithoutConflictsInput, deviceUncheckedUpdateWithoutConflictsInput>
  }

  export type deviceUpdateWithoutConflictsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumdevice_typeFieldUpdateOperationsInput | $Enums.device_type
    name?: StringFieldUpdateOperationsInput | string
    last_seen_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sync_logs?: sync_logUpdateManyWithoutDeviceNestedInput
  }

  export type deviceUncheckedUpdateWithoutConflictsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: Enumdevice_typeFieldUpdateOperationsInput | $Enums.device_type
    name?: StringFieldUpdateOperationsInput | string
    last_seen_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sync_logs?: sync_logUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type sync_logCreateManyDeviceInput = {
    id?: string
    direction: $Enums.sync_direction
    status?: $Enums.sync_status
    record_count?: number
    created_at?: Date | string
    completed_at?: Date | string | null
    error_message?: string | null
  }

  export type sync_conflictCreateManyDeviceInput = {
    id?: string
    entity_type: string
    entity_id: string
    server_version: string
    client_version: string
    resolved_at?: Date | string | null
    resolution?: $Enums.conflict_resolution | null
    detected_at?: Date | string
  }

  export type sync_logUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: Enumsync_directionFieldUpdateOperationsInput | $Enums.sync_direction
    status?: Enumsync_statusFieldUpdateOperationsInput | $Enums.sync_status
    record_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type sync_logUncheckedUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: Enumsync_directionFieldUpdateOperationsInput | $Enums.sync_direction
    status?: Enumsync_statusFieldUpdateOperationsInput | $Enums.sync_status
    record_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type sync_logUncheckedUpdateManyWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: Enumsync_directionFieldUpdateOperationsInput | $Enums.sync_direction
    status?: Enumsync_statusFieldUpdateOperationsInput | $Enums.sync_status
    record_count?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type sync_conflictUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity_type?: StringFieldUpdateOperationsInput | string
    entity_id?: StringFieldUpdateOperationsInput | string
    server_version?: StringFieldUpdateOperationsInput | string
    client_version?: StringFieldUpdateOperationsInput | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableEnumconflict_resolutionFieldUpdateOperationsInput | $Enums.conflict_resolution | null
    detected_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sync_conflictUncheckedUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity_type?: StringFieldUpdateOperationsInput | string
    entity_id?: StringFieldUpdateOperationsInput | string
    server_version?: StringFieldUpdateOperationsInput | string
    client_version?: StringFieldUpdateOperationsInput | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableEnumconflict_resolutionFieldUpdateOperationsInput | $Enums.conflict_resolution | null
    detected_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sync_conflictUncheckedUpdateManyWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity_type?: StringFieldUpdateOperationsInput | string
    entity_id?: StringFieldUpdateOperationsInput | string
    server_version?: StringFieldUpdateOperationsInput | string
    client_version?: StringFieldUpdateOperationsInput | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableEnumconflict_resolutionFieldUpdateOperationsInput | $Enums.conflict_resolution | null
    detected_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use DeviceCountOutputTypeDefaultArgs instead
     */
    export type DeviceCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DeviceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use deviceDefaultArgs instead
     */
    export type deviceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = deviceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use sync_logDefaultArgs instead
     */
    export type sync_logArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = sync_logDefaultArgs<ExtArgs>
    /**
     * @deprecated Use sync_conflictDefaultArgs instead
     */
    export type sync_conflictArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = sync_conflictDefaultArgs<ExtArgs>
    /**
     * @deprecated Use student_transferDefaultArgs instead
     */
    export type student_transferArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = student_transferDefaultArgs<ExtArgs>

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