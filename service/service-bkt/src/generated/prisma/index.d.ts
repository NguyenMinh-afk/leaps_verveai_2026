
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
 * Model skill
 * 
 */
export type skill = $Result.DefaultSelection<Prisma.$skillPayload>
/**
 * Model diagnosis
 * 
 */
export type diagnosis = $Result.DefaultSelection<Prisma.$diagnosisPayload>
/**
 * Model evidence
 * 
 */
export type evidence = $Result.DefaultSelection<Prisma.$evidencePayload>
/**
 * Model intervention
 * 
 */
export type intervention = $Result.DefaultSelection<Prisma.$interventionPayload>
/**
 * Model intervention_note
 * 
 */
export type intervention_note = $Result.DefaultSelection<Prisma.$intervention_notePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const diagnosis_status: {
  PENDING: 'PENDING',
  DIAGNOSED: 'DIAGNOSED',
  MASTERED: 'MASTERED',
  STRUGGLING: 'STRUGGLING'
};

export type diagnosis_status = (typeof diagnosis_status)[keyof typeof diagnosis_status]


export const evidence_quality: {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  UNKNOWN: 'UNKNOWN'
};

export type evidence_quality = (typeof evidence_quality)[keyof typeof evidence_quality]


export const intervention_status: {
  ACTIVE: 'ACTIVE',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED'
};

export type intervention_status = (typeof intervention_status)[keyof typeof intervention_status]

}

export type diagnosis_status = $Enums.diagnosis_status

export const diagnosis_status: typeof $Enums.diagnosis_status

export type evidence_quality = $Enums.evidence_quality

export const evidence_quality: typeof $Enums.evidence_quality

export type intervention_status = $Enums.intervention_status

export const intervention_status: typeof $Enums.intervention_status

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Skills
 * const skills = await prisma.skill.findMany()
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
   * // Fetch zero or more Skills
   * const skills = await prisma.skill.findMany()
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
   * `prisma.skill`: Exposes CRUD operations for the **skill** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Skills
    * const skills = await prisma.skill.findMany()
    * ```
    */
  get skill(): Prisma.skillDelegate<ExtArgs>;

  /**
   * `prisma.diagnosis`: Exposes CRUD operations for the **diagnosis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Diagnoses
    * const diagnoses = await prisma.diagnosis.findMany()
    * ```
    */
  get diagnosis(): Prisma.diagnosisDelegate<ExtArgs>;

  /**
   * `prisma.evidence`: Exposes CRUD operations for the **evidence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Evidences
    * const evidences = await prisma.evidence.findMany()
    * ```
    */
  get evidence(): Prisma.evidenceDelegate<ExtArgs>;

  /**
   * `prisma.intervention`: Exposes CRUD operations for the **intervention** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Interventions
    * const interventions = await prisma.intervention.findMany()
    * ```
    */
  get intervention(): Prisma.interventionDelegate<ExtArgs>;

  /**
   * `prisma.intervention_note`: Exposes CRUD operations for the **intervention_note** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Intervention_notes
    * const intervention_notes = await prisma.intervention_note.findMany()
    * ```
    */
  get intervention_note(): Prisma.intervention_noteDelegate<ExtArgs>;
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
    skill: 'skill',
    diagnosis: 'diagnosis',
    evidence: 'evidence',
    intervention: 'intervention',
    intervention_note: 'intervention_note'
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
      modelProps: "skill" | "diagnosis" | "evidence" | "intervention" | "intervention_note"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      skill: {
        payload: Prisma.$skillPayload<ExtArgs>
        fields: Prisma.skillFieldRefs
        operations: {
          findUnique: {
            args: Prisma.skillFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$skillPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.skillFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$skillPayload>
          }
          findFirst: {
            args: Prisma.skillFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$skillPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.skillFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$skillPayload>
          }
          findMany: {
            args: Prisma.skillFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$skillPayload>[]
          }
          create: {
            args: Prisma.skillCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$skillPayload>
          }
          createMany: {
            args: Prisma.skillCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.skillCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$skillPayload>[]
          }
          delete: {
            args: Prisma.skillDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$skillPayload>
          }
          update: {
            args: Prisma.skillUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$skillPayload>
          }
          deleteMany: {
            args: Prisma.skillDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.skillUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.skillUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$skillPayload>
          }
          aggregate: {
            args: Prisma.SkillAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSkill>
          }
          groupBy: {
            args: Prisma.skillGroupByArgs<ExtArgs>
            result: $Utils.Optional<SkillGroupByOutputType>[]
          }
          count: {
            args: Prisma.skillCountArgs<ExtArgs>
            result: $Utils.Optional<SkillCountAggregateOutputType> | number
          }
        }
      }
      diagnosis: {
        payload: Prisma.$diagnosisPayload<ExtArgs>
        fields: Prisma.diagnosisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.diagnosisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diagnosisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.diagnosisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diagnosisPayload>
          }
          findFirst: {
            args: Prisma.diagnosisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diagnosisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.diagnosisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diagnosisPayload>
          }
          findMany: {
            args: Prisma.diagnosisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diagnosisPayload>[]
          }
          create: {
            args: Prisma.diagnosisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diagnosisPayload>
          }
          createMany: {
            args: Prisma.diagnosisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.diagnosisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diagnosisPayload>[]
          }
          delete: {
            args: Prisma.diagnosisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diagnosisPayload>
          }
          update: {
            args: Prisma.diagnosisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diagnosisPayload>
          }
          deleteMany: {
            args: Prisma.diagnosisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.diagnosisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.diagnosisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diagnosisPayload>
          }
          aggregate: {
            args: Prisma.DiagnosisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiagnosis>
          }
          groupBy: {
            args: Prisma.diagnosisGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiagnosisGroupByOutputType>[]
          }
          count: {
            args: Prisma.diagnosisCountArgs<ExtArgs>
            result: $Utils.Optional<DiagnosisCountAggregateOutputType> | number
          }
        }
      }
      evidence: {
        payload: Prisma.$evidencePayload<ExtArgs>
        fields: Prisma.evidenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.evidenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$evidencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.evidenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$evidencePayload>
          }
          findFirst: {
            args: Prisma.evidenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$evidencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.evidenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$evidencePayload>
          }
          findMany: {
            args: Prisma.evidenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$evidencePayload>[]
          }
          create: {
            args: Prisma.evidenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$evidencePayload>
          }
          createMany: {
            args: Prisma.evidenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.evidenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$evidencePayload>[]
          }
          delete: {
            args: Prisma.evidenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$evidencePayload>
          }
          update: {
            args: Prisma.evidenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$evidencePayload>
          }
          deleteMany: {
            args: Prisma.evidenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.evidenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.evidenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$evidencePayload>
          }
          aggregate: {
            args: Prisma.EvidenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvidence>
          }
          groupBy: {
            args: Prisma.evidenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<EvidenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.evidenceCountArgs<ExtArgs>
            result: $Utils.Optional<EvidenceCountAggregateOutputType> | number
          }
        }
      }
      intervention: {
        payload: Prisma.$interventionPayload<ExtArgs>
        fields: Prisma.interventionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.interventionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$interventionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.interventionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$interventionPayload>
          }
          findFirst: {
            args: Prisma.interventionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$interventionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.interventionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$interventionPayload>
          }
          findMany: {
            args: Prisma.interventionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$interventionPayload>[]
          }
          create: {
            args: Prisma.interventionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$interventionPayload>
          }
          createMany: {
            args: Prisma.interventionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.interventionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$interventionPayload>[]
          }
          delete: {
            args: Prisma.interventionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$interventionPayload>
          }
          update: {
            args: Prisma.interventionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$interventionPayload>
          }
          deleteMany: {
            args: Prisma.interventionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.interventionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.interventionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$interventionPayload>
          }
          aggregate: {
            args: Prisma.InterventionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIntervention>
          }
          groupBy: {
            args: Prisma.interventionGroupByArgs<ExtArgs>
            result: $Utils.Optional<InterventionGroupByOutputType>[]
          }
          count: {
            args: Prisma.interventionCountArgs<ExtArgs>
            result: $Utils.Optional<InterventionCountAggregateOutputType> | number
          }
        }
      }
      intervention_note: {
        payload: Prisma.$intervention_notePayload<ExtArgs>
        fields: Prisma.intervention_noteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.intervention_noteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$intervention_notePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.intervention_noteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$intervention_notePayload>
          }
          findFirst: {
            args: Prisma.intervention_noteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$intervention_notePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.intervention_noteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$intervention_notePayload>
          }
          findMany: {
            args: Prisma.intervention_noteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$intervention_notePayload>[]
          }
          create: {
            args: Prisma.intervention_noteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$intervention_notePayload>
          }
          createMany: {
            args: Prisma.intervention_noteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.intervention_noteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$intervention_notePayload>[]
          }
          delete: {
            args: Prisma.intervention_noteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$intervention_notePayload>
          }
          update: {
            args: Prisma.intervention_noteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$intervention_notePayload>
          }
          deleteMany: {
            args: Prisma.intervention_noteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.intervention_noteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.intervention_noteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$intervention_notePayload>
          }
          aggregate: {
            args: Prisma.Intervention_noteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIntervention_note>
          }
          groupBy: {
            args: Prisma.intervention_noteGroupByArgs<ExtArgs>
            result: $Utils.Optional<Intervention_noteGroupByOutputType>[]
          }
          count: {
            args: Prisma.intervention_noteCountArgs<ExtArgs>
            result: $Utils.Optional<Intervention_noteCountAggregateOutputType> | number
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
   * Count Type SkillCountOutputType
   */

  export type SkillCountOutputType = {
    diagnoses: number
    interventions: number
  }

  export type SkillCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diagnoses?: boolean | SkillCountOutputTypeCountDiagnosesArgs
    interventions?: boolean | SkillCountOutputTypeCountInterventionsArgs
  }

  // Custom InputTypes
  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCountOutputType
     */
    select?: SkillCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeCountDiagnosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: diagnosisWhereInput
  }

  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeCountInterventionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: interventionWhereInput
  }


  /**
   * Count Type DiagnosisCountOutputType
   */

  export type DiagnosisCountOutputType = {
    evidence: number
  }

  export type DiagnosisCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    evidence?: boolean | DiagnosisCountOutputTypeCountEvidenceArgs
  }

  // Custom InputTypes
  /**
   * DiagnosisCountOutputType without action
   */
  export type DiagnosisCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisCountOutputType
     */
    select?: DiagnosisCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DiagnosisCountOutputType without action
   */
  export type DiagnosisCountOutputTypeCountEvidenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: evidenceWhereInput
  }


  /**
   * Count Type InterventionCountOutputType
   */

  export type InterventionCountOutputType = {
    notes_list: number
  }

  export type InterventionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notes_list?: boolean | InterventionCountOutputTypeCountNotes_listArgs
  }

  // Custom InputTypes
  /**
   * InterventionCountOutputType without action
   */
  export type InterventionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionCountOutputType
     */
    select?: InterventionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InterventionCountOutputType without action
   */
  export type InterventionCountOutputTypeCountNotes_listArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: intervention_noteWhereInput
  }


  /**
   * Models
   */

  /**
   * Model skill
   */

  export type AggregateSkill = {
    _count: SkillCountAggregateOutputType | null
    _avg: SkillAvgAggregateOutputType | null
    _sum: SkillSumAggregateOutputType | null
    _min: SkillMinAggregateOutputType | null
    _max: SkillMaxAggregateOutputType | null
  }

  export type SkillAvgAggregateOutputType = {
    difficulty: number | null
  }

  export type SkillSumAggregateOutputType = {
    difficulty: number | null
  }

  export type SkillMinAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    difficulty: number | null
    description: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SkillMaxAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    difficulty: number | null
    description: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SkillCountAggregateOutputType = {
    id: number
    code: number
    name: number
    difficulty: number
    description: number
    prereq_skills: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type SkillAvgAggregateInputType = {
    difficulty?: true
  }

  export type SkillSumAggregateInputType = {
    difficulty?: true
  }

  export type SkillMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    difficulty?: true
    description?: true
    created_at?: true
    updated_at?: true
  }

  export type SkillMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    difficulty?: true
    description?: true
    created_at?: true
    updated_at?: true
  }

  export type SkillCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    difficulty?: true
    description?: true
    prereq_skills?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type SkillAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which skill to aggregate.
     */
    where?: skillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of skills to fetch.
     */
    orderBy?: skillOrderByWithRelationInput | skillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: skillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned skills
    **/
    _count?: true | SkillCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SkillAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SkillSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SkillMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SkillMaxAggregateInputType
  }

  export type GetSkillAggregateType<T extends SkillAggregateArgs> = {
        [P in keyof T & keyof AggregateSkill]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSkill[P]>
      : GetScalarType<T[P], AggregateSkill[P]>
  }




  export type skillGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: skillWhereInput
    orderBy?: skillOrderByWithAggregationInput | skillOrderByWithAggregationInput[]
    by: SkillScalarFieldEnum[] | SkillScalarFieldEnum
    having?: skillScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SkillCountAggregateInputType | true
    _avg?: SkillAvgAggregateInputType
    _sum?: SkillSumAggregateInputType
    _min?: SkillMinAggregateInputType
    _max?: SkillMaxAggregateInputType
  }

  export type SkillGroupByOutputType = {
    id: string
    code: string
    name: string
    difficulty: number
    description: string | null
    prereq_skills: string[]
    created_at: Date
    updated_at: Date
    _count: SkillCountAggregateOutputType | null
    _avg: SkillAvgAggregateOutputType | null
    _sum: SkillSumAggregateOutputType | null
    _min: SkillMinAggregateOutputType | null
    _max: SkillMaxAggregateOutputType | null
  }

  type GetSkillGroupByPayload<T extends skillGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SkillGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SkillGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SkillGroupByOutputType[P]>
            : GetScalarType<T[P], SkillGroupByOutputType[P]>
        }
      >
    >


  export type skillSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    difficulty?: boolean
    description?: boolean
    prereq_skills?: boolean
    created_at?: boolean
    updated_at?: boolean
    diagnoses?: boolean | skill$diagnosesArgs<ExtArgs>
    interventions?: boolean | skill$interventionsArgs<ExtArgs>
    _count?: boolean | SkillCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skill"]>

  export type skillSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    difficulty?: boolean
    description?: boolean
    prereq_skills?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["skill"]>

  export type skillSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    difficulty?: boolean
    description?: boolean
    prereq_skills?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type skillInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diagnoses?: boolean | skill$diagnosesArgs<ExtArgs>
    interventions?: boolean | skill$interventionsArgs<ExtArgs>
    _count?: boolean | SkillCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type skillIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $skillPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "skill"
    objects: {
      diagnoses: Prisma.$diagnosisPayload<ExtArgs>[]
      interventions: Prisma.$interventionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      name: string
      difficulty: number
      description: string | null
      prereq_skills: string[]
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["skill"]>
    composites: {}
  }

  type skillGetPayload<S extends boolean | null | undefined | skillDefaultArgs> = $Result.GetResult<Prisma.$skillPayload, S>

  type skillCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<skillFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SkillCountAggregateInputType | true
    }

  export interface skillDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['skill'], meta: { name: 'skill' } }
    /**
     * Find zero or one Skill that matches the filter.
     * @param {skillFindUniqueArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends skillFindUniqueArgs>(args: SelectSubset<T, skillFindUniqueArgs<ExtArgs>>): Prisma__skillClient<$Result.GetResult<Prisma.$skillPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Skill that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {skillFindUniqueOrThrowArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends skillFindUniqueOrThrowArgs>(args: SelectSubset<T, skillFindUniqueOrThrowArgs<ExtArgs>>): Prisma__skillClient<$Result.GetResult<Prisma.$skillPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Skill that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {skillFindFirstArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends skillFindFirstArgs>(args?: SelectSubset<T, skillFindFirstArgs<ExtArgs>>): Prisma__skillClient<$Result.GetResult<Prisma.$skillPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Skill that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {skillFindFirstOrThrowArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends skillFindFirstOrThrowArgs>(args?: SelectSubset<T, skillFindFirstOrThrowArgs<ExtArgs>>): Prisma__skillClient<$Result.GetResult<Prisma.$skillPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Skills that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {skillFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Skills
     * const skills = await prisma.skill.findMany()
     * 
     * // Get first 10 Skills
     * const skills = await prisma.skill.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const skillWithIdOnly = await prisma.skill.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends skillFindManyArgs>(args?: SelectSubset<T, skillFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$skillPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Skill.
     * @param {skillCreateArgs} args - Arguments to create a Skill.
     * @example
     * // Create one Skill
     * const Skill = await prisma.skill.create({
     *   data: {
     *     // ... data to create a Skill
     *   }
     * })
     * 
     */
    create<T extends skillCreateArgs>(args: SelectSubset<T, skillCreateArgs<ExtArgs>>): Prisma__skillClient<$Result.GetResult<Prisma.$skillPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Skills.
     * @param {skillCreateManyArgs} args - Arguments to create many Skills.
     * @example
     * // Create many Skills
     * const skill = await prisma.skill.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends skillCreateManyArgs>(args?: SelectSubset<T, skillCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Skills and returns the data saved in the database.
     * @param {skillCreateManyAndReturnArgs} args - Arguments to create many Skills.
     * @example
     * // Create many Skills
     * const skill = await prisma.skill.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Skills and only return the `id`
     * const skillWithIdOnly = await prisma.skill.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends skillCreateManyAndReturnArgs>(args?: SelectSubset<T, skillCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$skillPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Skill.
     * @param {skillDeleteArgs} args - Arguments to delete one Skill.
     * @example
     * // Delete one Skill
     * const Skill = await prisma.skill.delete({
     *   where: {
     *     // ... filter to delete one Skill
     *   }
     * })
     * 
     */
    delete<T extends skillDeleteArgs>(args: SelectSubset<T, skillDeleteArgs<ExtArgs>>): Prisma__skillClient<$Result.GetResult<Prisma.$skillPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Skill.
     * @param {skillUpdateArgs} args - Arguments to update one Skill.
     * @example
     * // Update one Skill
     * const skill = await prisma.skill.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends skillUpdateArgs>(args: SelectSubset<T, skillUpdateArgs<ExtArgs>>): Prisma__skillClient<$Result.GetResult<Prisma.$skillPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Skills.
     * @param {skillDeleteManyArgs} args - Arguments to filter Skills to delete.
     * @example
     * // Delete a few Skills
     * const { count } = await prisma.skill.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends skillDeleteManyArgs>(args?: SelectSubset<T, skillDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Skills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {skillUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Skills
     * const skill = await prisma.skill.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends skillUpdateManyArgs>(args: SelectSubset<T, skillUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Skill.
     * @param {skillUpsertArgs} args - Arguments to update or create a Skill.
     * @example
     * // Update or create a Skill
     * const skill = await prisma.skill.upsert({
     *   create: {
     *     // ... data to create a Skill
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Skill we want to update
     *   }
     * })
     */
    upsert<T extends skillUpsertArgs>(args: SelectSubset<T, skillUpsertArgs<ExtArgs>>): Prisma__skillClient<$Result.GetResult<Prisma.$skillPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Skills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {skillCountArgs} args - Arguments to filter Skills to count.
     * @example
     * // Count the number of Skills
     * const count = await prisma.skill.count({
     *   where: {
     *     // ... the filter for the Skills we want to count
     *   }
     * })
    **/
    count<T extends skillCountArgs>(
      args?: Subset<T, skillCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SkillCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Skill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SkillAggregateArgs>(args: Subset<T, SkillAggregateArgs>): Prisma.PrismaPromise<GetSkillAggregateType<T>>

    /**
     * Group by Skill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {skillGroupByArgs} args - Group by arguments.
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
      T extends skillGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: skillGroupByArgs['orderBy'] }
        : { orderBy?: skillGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, skillGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSkillGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the skill model
   */
  readonly fields: skillFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for skill.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__skillClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    diagnoses<T extends skill$diagnosesArgs<ExtArgs> = {}>(args?: Subset<T, skill$diagnosesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$diagnosisPayload<ExtArgs>, T, "findMany"> | Null>
    interventions<T extends skill$interventionsArgs<ExtArgs> = {}>(args?: Subset<T, skill$interventionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$interventionPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the skill model
   */ 
  interface skillFieldRefs {
    readonly id: FieldRef<"skill", 'String'>
    readonly code: FieldRef<"skill", 'String'>
    readonly name: FieldRef<"skill", 'String'>
    readonly difficulty: FieldRef<"skill", 'Int'>
    readonly description: FieldRef<"skill", 'String'>
    readonly prereq_skills: FieldRef<"skill", 'String[]'>
    readonly created_at: FieldRef<"skill", 'DateTime'>
    readonly updated_at: FieldRef<"skill", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * skill findUnique
   */
  export type skillFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the skill
     */
    select?: skillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: skillInclude<ExtArgs> | null
    /**
     * Filter, which skill to fetch.
     */
    where: skillWhereUniqueInput
  }

  /**
   * skill findUniqueOrThrow
   */
  export type skillFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the skill
     */
    select?: skillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: skillInclude<ExtArgs> | null
    /**
     * Filter, which skill to fetch.
     */
    where: skillWhereUniqueInput
  }

  /**
   * skill findFirst
   */
  export type skillFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the skill
     */
    select?: skillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: skillInclude<ExtArgs> | null
    /**
     * Filter, which skill to fetch.
     */
    where?: skillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of skills to fetch.
     */
    orderBy?: skillOrderByWithRelationInput | skillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for skills.
     */
    cursor?: skillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * skill findFirstOrThrow
   */
  export type skillFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the skill
     */
    select?: skillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: skillInclude<ExtArgs> | null
    /**
     * Filter, which skill to fetch.
     */
    where?: skillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of skills to fetch.
     */
    orderBy?: skillOrderByWithRelationInput | skillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for skills.
     */
    cursor?: skillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * skill findMany
   */
  export type skillFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the skill
     */
    select?: skillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: skillInclude<ExtArgs> | null
    /**
     * Filter, which skills to fetch.
     */
    where?: skillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of skills to fetch.
     */
    orderBy?: skillOrderByWithRelationInput | skillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing skills.
     */
    cursor?: skillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` skills.
     */
    skip?: number
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * skill create
   */
  export type skillCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the skill
     */
    select?: skillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: skillInclude<ExtArgs> | null
    /**
     * The data needed to create a skill.
     */
    data: XOR<skillCreateInput, skillUncheckedCreateInput>
  }

  /**
   * skill createMany
   */
  export type skillCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many skills.
     */
    data: skillCreateManyInput | skillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * skill createManyAndReturn
   */
  export type skillCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the skill
     */
    select?: skillSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many skills.
     */
    data: skillCreateManyInput | skillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * skill update
   */
  export type skillUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the skill
     */
    select?: skillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: skillInclude<ExtArgs> | null
    /**
     * The data needed to update a skill.
     */
    data: XOR<skillUpdateInput, skillUncheckedUpdateInput>
    /**
     * Choose, which skill to update.
     */
    where: skillWhereUniqueInput
  }

  /**
   * skill updateMany
   */
  export type skillUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update skills.
     */
    data: XOR<skillUpdateManyMutationInput, skillUncheckedUpdateManyInput>
    /**
     * Filter which skills to update
     */
    where?: skillWhereInput
  }

  /**
   * skill upsert
   */
  export type skillUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the skill
     */
    select?: skillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: skillInclude<ExtArgs> | null
    /**
     * The filter to search for the skill to update in case it exists.
     */
    where: skillWhereUniqueInput
    /**
     * In case the skill found by the `where` argument doesn't exist, create a new skill with this data.
     */
    create: XOR<skillCreateInput, skillUncheckedCreateInput>
    /**
     * In case the skill was found with the provided `where` argument, update it with this data.
     */
    update: XOR<skillUpdateInput, skillUncheckedUpdateInput>
  }

  /**
   * skill delete
   */
  export type skillDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the skill
     */
    select?: skillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: skillInclude<ExtArgs> | null
    /**
     * Filter which skill to delete.
     */
    where: skillWhereUniqueInput
  }

  /**
   * skill deleteMany
   */
  export type skillDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which skills to delete
     */
    where?: skillWhereInput
  }

  /**
   * skill.diagnoses
   */
  export type skill$diagnosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diagnosis
     */
    select?: diagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: diagnosisInclude<ExtArgs> | null
    where?: diagnosisWhereInput
    orderBy?: diagnosisOrderByWithRelationInput | diagnosisOrderByWithRelationInput[]
    cursor?: diagnosisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DiagnosisScalarFieldEnum | DiagnosisScalarFieldEnum[]
  }

  /**
   * skill.interventions
   */
  export type skill$interventionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention
     */
    select?: interventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: interventionInclude<ExtArgs> | null
    where?: interventionWhereInput
    orderBy?: interventionOrderByWithRelationInput | interventionOrderByWithRelationInput[]
    cursor?: interventionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InterventionScalarFieldEnum | InterventionScalarFieldEnum[]
  }

  /**
   * skill without action
   */
  export type skillDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the skill
     */
    select?: skillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: skillInclude<ExtArgs> | null
  }


  /**
   * Model diagnosis
   */

  export type AggregateDiagnosis = {
    _count: DiagnosisCountAggregateOutputType | null
    _avg: DiagnosisAvgAggregateOutputType | null
    _sum: DiagnosisSumAggregateOutputType | null
    _min: DiagnosisMinAggregateOutputType | null
    _max: DiagnosisMaxAggregateOutputType | null
  }

  export type DiagnosisAvgAggregateOutputType = {
    p_known: number | null
    confidence: number | null
  }

  export type DiagnosisSumAggregateOutputType = {
    p_known: number | null
    confidence: number | null
  }

  export type DiagnosisMinAggregateOutputType = {
    id: string | null
    student_id: string | null
    skill_id: string | null
    p_known: number | null
    confidence: number | null
    status: $Enums.diagnosis_status | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type DiagnosisMaxAggregateOutputType = {
    id: string | null
    student_id: string | null
    skill_id: string | null
    p_known: number | null
    confidence: number | null
    status: $Enums.diagnosis_status | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type DiagnosisCountAggregateOutputType = {
    id: number
    student_id: number
    skill_id: number
    p_known: number
    confidence: number
    status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type DiagnosisAvgAggregateInputType = {
    p_known?: true
    confidence?: true
  }

  export type DiagnosisSumAggregateInputType = {
    p_known?: true
    confidence?: true
  }

  export type DiagnosisMinAggregateInputType = {
    id?: true
    student_id?: true
    skill_id?: true
    p_known?: true
    confidence?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type DiagnosisMaxAggregateInputType = {
    id?: true
    student_id?: true
    skill_id?: true
    p_known?: true
    confidence?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type DiagnosisCountAggregateInputType = {
    id?: true
    student_id?: true
    skill_id?: true
    p_known?: true
    confidence?: true
    status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type DiagnosisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which diagnosis to aggregate.
     */
    where?: diagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of diagnoses to fetch.
     */
    orderBy?: diagnosisOrderByWithRelationInput | diagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: diagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` diagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` diagnoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned diagnoses
    **/
    _count?: true | DiagnosisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DiagnosisAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DiagnosisSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiagnosisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiagnosisMaxAggregateInputType
  }

  export type GetDiagnosisAggregateType<T extends DiagnosisAggregateArgs> = {
        [P in keyof T & keyof AggregateDiagnosis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiagnosis[P]>
      : GetScalarType<T[P], AggregateDiagnosis[P]>
  }




  export type diagnosisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: diagnosisWhereInput
    orderBy?: diagnosisOrderByWithAggregationInput | diagnosisOrderByWithAggregationInput[]
    by: DiagnosisScalarFieldEnum[] | DiagnosisScalarFieldEnum
    having?: diagnosisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiagnosisCountAggregateInputType | true
    _avg?: DiagnosisAvgAggregateInputType
    _sum?: DiagnosisSumAggregateInputType
    _min?: DiagnosisMinAggregateInputType
    _max?: DiagnosisMaxAggregateInputType
  }

  export type DiagnosisGroupByOutputType = {
    id: string
    student_id: string
    skill_id: string
    p_known: number
    confidence: number
    status: $Enums.diagnosis_status
    created_at: Date
    updated_at: Date
    _count: DiagnosisCountAggregateOutputType | null
    _avg: DiagnosisAvgAggregateOutputType | null
    _sum: DiagnosisSumAggregateOutputType | null
    _min: DiagnosisMinAggregateOutputType | null
    _max: DiagnosisMaxAggregateOutputType | null
  }

  type GetDiagnosisGroupByPayload<T extends diagnosisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiagnosisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiagnosisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiagnosisGroupByOutputType[P]>
            : GetScalarType<T[P], DiagnosisGroupByOutputType[P]>
        }
      >
    >


  export type diagnosisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    skill_id?: boolean
    p_known?: boolean
    confidence?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    skill?: boolean | skillDefaultArgs<ExtArgs>
    evidence?: boolean | diagnosis$evidenceArgs<ExtArgs>
    _count?: boolean | DiagnosisCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["diagnosis"]>

  export type diagnosisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    skill_id?: boolean
    p_known?: boolean
    confidence?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    skill?: boolean | skillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["diagnosis"]>

  export type diagnosisSelectScalar = {
    id?: boolean
    student_id?: boolean
    skill_id?: boolean
    p_known?: boolean
    confidence?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type diagnosisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skill?: boolean | skillDefaultArgs<ExtArgs>
    evidence?: boolean | diagnosis$evidenceArgs<ExtArgs>
    _count?: boolean | DiagnosisCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type diagnosisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skill?: boolean | skillDefaultArgs<ExtArgs>
  }

  export type $diagnosisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "diagnosis"
    objects: {
      skill: Prisma.$skillPayload<ExtArgs>
      evidence: Prisma.$evidencePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      student_id: string
      skill_id: string
      p_known: number
      confidence: number
      status: $Enums.diagnosis_status
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["diagnosis"]>
    composites: {}
  }

  type diagnosisGetPayload<S extends boolean | null | undefined | diagnosisDefaultArgs> = $Result.GetResult<Prisma.$diagnosisPayload, S>

  type diagnosisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<diagnosisFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DiagnosisCountAggregateInputType | true
    }

  export interface diagnosisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['diagnosis'], meta: { name: 'diagnosis' } }
    /**
     * Find zero or one Diagnosis that matches the filter.
     * @param {diagnosisFindUniqueArgs} args - Arguments to find a Diagnosis
     * @example
     * // Get one Diagnosis
     * const diagnosis = await prisma.diagnosis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends diagnosisFindUniqueArgs>(args: SelectSubset<T, diagnosisFindUniqueArgs<ExtArgs>>): Prisma__diagnosisClient<$Result.GetResult<Prisma.$diagnosisPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Diagnosis that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {diagnosisFindUniqueOrThrowArgs} args - Arguments to find a Diagnosis
     * @example
     * // Get one Diagnosis
     * const diagnosis = await prisma.diagnosis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends diagnosisFindUniqueOrThrowArgs>(args: SelectSubset<T, diagnosisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__diagnosisClient<$Result.GetResult<Prisma.$diagnosisPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Diagnosis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {diagnosisFindFirstArgs} args - Arguments to find a Diagnosis
     * @example
     * // Get one Diagnosis
     * const diagnosis = await prisma.diagnosis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends diagnosisFindFirstArgs>(args?: SelectSubset<T, diagnosisFindFirstArgs<ExtArgs>>): Prisma__diagnosisClient<$Result.GetResult<Prisma.$diagnosisPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Diagnosis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {diagnosisFindFirstOrThrowArgs} args - Arguments to find a Diagnosis
     * @example
     * // Get one Diagnosis
     * const diagnosis = await prisma.diagnosis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends diagnosisFindFirstOrThrowArgs>(args?: SelectSubset<T, diagnosisFindFirstOrThrowArgs<ExtArgs>>): Prisma__diagnosisClient<$Result.GetResult<Prisma.$diagnosisPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Diagnoses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {diagnosisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Diagnoses
     * const diagnoses = await prisma.diagnosis.findMany()
     * 
     * // Get first 10 Diagnoses
     * const diagnoses = await prisma.diagnosis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const diagnosisWithIdOnly = await prisma.diagnosis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends diagnosisFindManyArgs>(args?: SelectSubset<T, diagnosisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$diagnosisPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Diagnosis.
     * @param {diagnosisCreateArgs} args - Arguments to create a Diagnosis.
     * @example
     * // Create one Diagnosis
     * const Diagnosis = await prisma.diagnosis.create({
     *   data: {
     *     // ... data to create a Diagnosis
     *   }
     * })
     * 
     */
    create<T extends diagnosisCreateArgs>(args: SelectSubset<T, diagnosisCreateArgs<ExtArgs>>): Prisma__diagnosisClient<$Result.GetResult<Prisma.$diagnosisPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Diagnoses.
     * @param {diagnosisCreateManyArgs} args - Arguments to create many Diagnoses.
     * @example
     * // Create many Diagnoses
     * const diagnosis = await prisma.diagnosis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends diagnosisCreateManyArgs>(args?: SelectSubset<T, diagnosisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Diagnoses and returns the data saved in the database.
     * @param {diagnosisCreateManyAndReturnArgs} args - Arguments to create many Diagnoses.
     * @example
     * // Create many Diagnoses
     * const diagnosis = await prisma.diagnosis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Diagnoses and only return the `id`
     * const diagnosisWithIdOnly = await prisma.diagnosis.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends diagnosisCreateManyAndReturnArgs>(args?: SelectSubset<T, diagnosisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$diagnosisPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Diagnosis.
     * @param {diagnosisDeleteArgs} args - Arguments to delete one Diagnosis.
     * @example
     * // Delete one Diagnosis
     * const Diagnosis = await prisma.diagnosis.delete({
     *   where: {
     *     // ... filter to delete one Diagnosis
     *   }
     * })
     * 
     */
    delete<T extends diagnosisDeleteArgs>(args: SelectSubset<T, diagnosisDeleteArgs<ExtArgs>>): Prisma__diagnosisClient<$Result.GetResult<Prisma.$diagnosisPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Diagnosis.
     * @param {diagnosisUpdateArgs} args - Arguments to update one Diagnosis.
     * @example
     * // Update one Diagnosis
     * const diagnosis = await prisma.diagnosis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends diagnosisUpdateArgs>(args: SelectSubset<T, diagnosisUpdateArgs<ExtArgs>>): Prisma__diagnosisClient<$Result.GetResult<Prisma.$diagnosisPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Diagnoses.
     * @param {diagnosisDeleteManyArgs} args - Arguments to filter Diagnoses to delete.
     * @example
     * // Delete a few Diagnoses
     * const { count } = await prisma.diagnosis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends diagnosisDeleteManyArgs>(args?: SelectSubset<T, diagnosisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Diagnoses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {diagnosisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Diagnoses
     * const diagnosis = await prisma.diagnosis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends diagnosisUpdateManyArgs>(args: SelectSubset<T, diagnosisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Diagnosis.
     * @param {diagnosisUpsertArgs} args - Arguments to update or create a Diagnosis.
     * @example
     * // Update or create a Diagnosis
     * const diagnosis = await prisma.diagnosis.upsert({
     *   create: {
     *     // ... data to create a Diagnosis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Diagnosis we want to update
     *   }
     * })
     */
    upsert<T extends diagnosisUpsertArgs>(args: SelectSubset<T, diagnosisUpsertArgs<ExtArgs>>): Prisma__diagnosisClient<$Result.GetResult<Prisma.$diagnosisPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Diagnoses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {diagnosisCountArgs} args - Arguments to filter Diagnoses to count.
     * @example
     * // Count the number of Diagnoses
     * const count = await prisma.diagnosis.count({
     *   where: {
     *     // ... the filter for the Diagnoses we want to count
     *   }
     * })
    **/
    count<T extends diagnosisCountArgs>(
      args?: Subset<T, diagnosisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiagnosisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Diagnosis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DiagnosisAggregateArgs>(args: Subset<T, DiagnosisAggregateArgs>): Prisma.PrismaPromise<GetDiagnosisAggregateType<T>>

    /**
     * Group by Diagnosis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {diagnosisGroupByArgs} args - Group by arguments.
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
      T extends diagnosisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: diagnosisGroupByArgs['orderBy'] }
        : { orderBy?: diagnosisGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, diagnosisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiagnosisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the diagnosis model
   */
  readonly fields: diagnosisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for diagnosis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__diagnosisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    skill<T extends skillDefaultArgs<ExtArgs> = {}>(args?: Subset<T, skillDefaultArgs<ExtArgs>>): Prisma__skillClient<$Result.GetResult<Prisma.$skillPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    evidence<T extends diagnosis$evidenceArgs<ExtArgs> = {}>(args?: Subset<T, diagnosis$evidenceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$evidencePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the diagnosis model
   */ 
  interface diagnosisFieldRefs {
    readonly id: FieldRef<"diagnosis", 'String'>
    readonly student_id: FieldRef<"diagnosis", 'String'>
    readonly skill_id: FieldRef<"diagnosis", 'String'>
    readonly p_known: FieldRef<"diagnosis", 'Float'>
    readonly confidence: FieldRef<"diagnosis", 'Float'>
    readonly status: FieldRef<"diagnosis", 'diagnosis_status'>
    readonly created_at: FieldRef<"diagnosis", 'DateTime'>
    readonly updated_at: FieldRef<"diagnosis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * diagnosis findUnique
   */
  export type diagnosisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diagnosis
     */
    select?: diagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: diagnosisInclude<ExtArgs> | null
    /**
     * Filter, which diagnosis to fetch.
     */
    where: diagnosisWhereUniqueInput
  }

  /**
   * diagnosis findUniqueOrThrow
   */
  export type diagnosisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diagnosis
     */
    select?: diagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: diagnosisInclude<ExtArgs> | null
    /**
     * Filter, which diagnosis to fetch.
     */
    where: diagnosisWhereUniqueInput
  }

  /**
   * diagnosis findFirst
   */
  export type diagnosisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diagnosis
     */
    select?: diagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: diagnosisInclude<ExtArgs> | null
    /**
     * Filter, which diagnosis to fetch.
     */
    where?: diagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of diagnoses to fetch.
     */
    orderBy?: diagnosisOrderByWithRelationInput | diagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for diagnoses.
     */
    cursor?: diagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` diagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` diagnoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of diagnoses.
     */
    distinct?: DiagnosisScalarFieldEnum | DiagnosisScalarFieldEnum[]
  }

  /**
   * diagnosis findFirstOrThrow
   */
  export type diagnosisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diagnosis
     */
    select?: diagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: diagnosisInclude<ExtArgs> | null
    /**
     * Filter, which diagnosis to fetch.
     */
    where?: diagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of diagnoses to fetch.
     */
    orderBy?: diagnosisOrderByWithRelationInput | diagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for diagnoses.
     */
    cursor?: diagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` diagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` diagnoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of diagnoses.
     */
    distinct?: DiagnosisScalarFieldEnum | DiagnosisScalarFieldEnum[]
  }

  /**
   * diagnosis findMany
   */
  export type diagnosisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diagnosis
     */
    select?: diagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: diagnosisInclude<ExtArgs> | null
    /**
     * Filter, which diagnoses to fetch.
     */
    where?: diagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of diagnoses to fetch.
     */
    orderBy?: diagnosisOrderByWithRelationInput | diagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing diagnoses.
     */
    cursor?: diagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` diagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` diagnoses.
     */
    skip?: number
    distinct?: DiagnosisScalarFieldEnum | DiagnosisScalarFieldEnum[]
  }

  /**
   * diagnosis create
   */
  export type diagnosisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diagnosis
     */
    select?: diagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: diagnosisInclude<ExtArgs> | null
    /**
     * The data needed to create a diagnosis.
     */
    data: XOR<diagnosisCreateInput, diagnosisUncheckedCreateInput>
  }

  /**
   * diagnosis createMany
   */
  export type diagnosisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many diagnoses.
     */
    data: diagnosisCreateManyInput | diagnosisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * diagnosis createManyAndReturn
   */
  export type diagnosisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diagnosis
     */
    select?: diagnosisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many diagnoses.
     */
    data: diagnosisCreateManyInput | diagnosisCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: diagnosisIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * diagnosis update
   */
  export type diagnosisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diagnosis
     */
    select?: diagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: diagnosisInclude<ExtArgs> | null
    /**
     * The data needed to update a diagnosis.
     */
    data: XOR<diagnosisUpdateInput, diagnosisUncheckedUpdateInput>
    /**
     * Choose, which diagnosis to update.
     */
    where: diagnosisWhereUniqueInput
  }

  /**
   * diagnosis updateMany
   */
  export type diagnosisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update diagnoses.
     */
    data: XOR<diagnosisUpdateManyMutationInput, diagnosisUncheckedUpdateManyInput>
    /**
     * Filter which diagnoses to update
     */
    where?: diagnosisWhereInput
  }

  /**
   * diagnosis upsert
   */
  export type diagnosisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diagnosis
     */
    select?: diagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: diagnosisInclude<ExtArgs> | null
    /**
     * The filter to search for the diagnosis to update in case it exists.
     */
    where: diagnosisWhereUniqueInput
    /**
     * In case the diagnosis found by the `where` argument doesn't exist, create a new diagnosis with this data.
     */
    create: XOR<diagnosisCreateInput, diagnosisUncheckedCreateInput>
    /**
     * In case the diagnosis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<diagnosisUpdateInput, diagnosisUncheckedUpdateInput>
  }

  /**
   * diagnosis delete
   */
  export type diagnosisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diagnosis
     */
    select?: diagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: diagnosisInclude<ExtArgs> | null
    /**
     * Filter which diagnosis to delete.
     */
    where: diagnosisWhereUniqueInput
  }

  /**
   * diagnosis deleteMany
   */
  export type diagnosisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which diagnoses to delete
     */
    where?: diagnosisWhereInput
  }

  /**
   * diagnosis.evidence
   */
  export type diagnosis$evidenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the evidence
     */
    select?: evidenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: evidenceInclude<ExtArgs> | null
    where?: evidenceWhereInput
    orderBy?: evidenceOrderByWithRelationInput | evidenceOrderByWithRelationInput[]
    cursor?: evidenceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EvidenceScalarFieldEnum | EvidenceScalarFieldEnum[]
  }

  /**
   * diagnosis without action
   */
  export type diagnosisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diagnosis
     */
    select?: diagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: diagnosisInclude<ExtArgs> | null
  }


  /**
   * Model evidence
   */

  export type AggregateEvidence = {
    _count: EvidenceCountAggregateOutputType | null
    _avg: EvidenceAvgAggregateOutputType | null
    _sum: EvidenceSumAggregateOutputType | null
    _min: EvidenceMinAggregateOutputType | null
    _max: EvidenceMaxAggregateOutputType | null
  }

  export type EvidenceAvgAggregateOutputType = {
    confidence: number | null
  }

  export type EvidenceSumAggregateOutputType = {
    confidence: number | null
  }

  export type EvidenceMinAggregateOutputType = {
    id: string | null
    diagnosis_id: string | null
    item_id: string | null
    extracted_answer: string | null
    correct: boolean | null
    confidence: number | null
    quality: $Enums.evidence_quality | null
    created_at: Date | null
  }

  export type EvidenceMaxAggregateOutputType = {
    id: string | null
    diagnosis_id: string | null
    item_id: string | null
    extracted_answer: string | null
    correct: boolean | null
    confidence: number | null
    quality: $Enums.evidence_quality | null
    created_at: Date | null
  }

  export type EvidenceCountAggregateOutputType = {
    id: number
    diagnosis_id: number
    item_id: number
    extracted_answer: number
    correct: number
    confidence: number
    quality: number
    created_at: number
    _all: number
  }


  export type EvidenceAvgAggregateInputType = {
    confidence?: true
  }

  export type EvidenceSumAggregateInputType = {
    confidence?: true
  }

  export type EvidenceMinAggregateInputType = {
    id?: true
    diagnosis_id?: true
    item_id?: true
    extracted_answer?: true
    correct?: true
    confidence?: true
    quality?: true
    created_at?: true
  }

  export type EvidenceMaxAggregateInputType = {
    id?: true
    diagnosis_id?: true
    item_id?: true
    extracted_answer?: true
    correct?: true
    confidence?: true
    quality?: true
    created_at?: true
  }

  export type EvidenceCountAggregateInputType = {
    id?: true
    diagnosis_id?: true
    item_id?: true
    extracted_answer?: true
    correct?: true
    confidence?: true
    quality?: true
    created_at?: true
    _all?: true
  }

  export type EvidenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which evidence to aggregate.
     */
    where?: evidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of evidences to fetch.
     */
    orderBy?: evidenceOrderByWithRelationInput | evidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: evidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` evidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` evidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned evidences
    **/
    _count?: true | EvidenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EvidenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EvidenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EvidenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EvidenceMaxAggregateInputType
  }

  export type GetEvidenceAggregateType<T extends EvidenceAggregateArgs> = {
        [P in keyof T & keyof AggregateEvidence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvidence[P]>
      : GetScalarType<T[P], AggregateEvidence[P]>
  }




  export type evidenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: evidenceWhereInput
    orderBy?: evidenceOrderByWithAggregationInput | evidenceOrderByWithAggregationInput[]
    by: EvidenceScalarFieldEnum[] | EvidenceScalarFieldEnum
    having?: evidenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EvidenceCountAggregateInputType | true
    _avg?: EvidenceAvgAggregateInputType
    _sum?: EvidenceSumAggregateInputType
    _min?: EvidenceMinAggregateInputType
    _max?: EvidenceMaxAggregateInputType
  }

  export type EvidenceGroupByOutputType = {
    id: string
    diagnosis_id: string
    item_id: string
    extracted_answer: string | null
    correct: boolean | null
    confidence: number
    quality: $Enums.evidence_quality
    created_at: Date
    _count: EvidenceCountAggregateOutputType | null
    _avg: EvidenceAvgAggregateOutputType | null
    _sum: EvidenceSumAggregateOutputType | null
    _min: EvidenceMinAggregateOutputType | null
    _max: EvidenceMaxAggregateOutputType | null
  }

  type GetEvidenceGroupByPayload<T extends evidenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EvidenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EvidenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EvidenceGroupByOutputType[P]>
            : GetScalarType<T[P], EvidenceGroupByOutputType[P]>
        }
      >
    >


  export type evidenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    diagnosis_id?: boolean
    item_id?: boolean
    extracted_answer?: boolean
    correct?: boolean
    confidence?: boolean
    quality?: boolean
    created_at?: boolean
    diagnosis?: boolean | diagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evidence"]>

  export type evidenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    diagnosis_id?: boolean
    item_id?: boolean
    extracted_answer?: boolean
    correct?: boolean
    confidence?: boolean
    quality?: boolean
    created_at?: boolean
    diagnosis?: boolean | diagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evidence"]>

  export type evidenceSelectScalar = {
    id?: boolean
    diagnosis_id?: boolean
    item_id?: boolean
    extracted_answer?: boolean
    correct?: boolean
    confidence?: boolean
    quality?: boolean
    created_at?: boolean
  }

  export type evidenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diagnosis?: boolean | diagnosisDefaultArgs<ExtArgs>
  }
  export type evidenceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diagnosis?: boolean | diagnosisDefaultArgs<ExtArgs>
  }

  export type $evidencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "evidence"
    objects: {
      diagnosis: Prisma.$diagnosisPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      diagnosis_id: string
      item_id: string
      extracted_answer: string | null
      correct: boolean | null
      confidence: number
      quality: $Enums.evidence_quality
      created_at: Date
    }, ExtArgs["result"]["evidence"]>
    composites: {}
  }

  type evidenceGetPayload<S extends boolean | null | undefined | evidenceDefaultArgs> = $Result.GetResult<Prisma.$evidencePayload, S>

  type evidenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<evidenceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EvidenceCountAggregateInputType | true
    }

  export interface evidenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['evidence'], meta: { name: 'evidence' } }
    /**
     * Find zero or one Evidence that matches the filter.
     * @param {evidenceFindUniqueArgs} args - Arguments to find a Evidence
     * @example
     * // Get one Evidence
     * const evidence = await prisma.evidence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends evidenceFindUniqueArgs>(args: SelectSubset<T, evidenceFindUniqueArgs<ExtArgs>>): Prisma__evidenceClient<$Result.GetResult<Prisma.$evidencePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Evidence that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {evidenceFindUniqueOrThrowArgs} args - Arguments to find a Evidence
     * @example
     * // Get one Evidence
     * const evidence = await prisma.evidence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends evidenceFindUniqueOrThrowArgs>(args: SelectSubset<T, evidenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__evidenceClient<$Result.GetResult<Prisma.$evidencePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Evidence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {evidenceFindFirstArgs} args - Arguments to find a Evidence
     * @example
     * // Get one Evidence
     * const evidence = await prisma.evidence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends evidenceFindFirstArgs>(args?: SelectSubset<T, evidenceFindFirstArgs<ExtArgs>>): Prisma__evidenceClient<$Result.GetResult<Prisma.$evidencePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Evidence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {evidenceFindFirstOrThrowArgs} args - Arguments to find a Evidence
     * @example
     * // Get one Evidence
     * const evidence = await prisma.evidence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends evidenceFindFirstOrThrowArgs>(args?: SelectSubset<T, evidenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__evidenceClient<$Result.GetResult<Prisma.$evidencePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Evidences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {evidenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Evidences
     * const evidences = await prisma.evidence.findMany()
     * 
     * // Get first 10 Evidences
     * const evidences = await prisma.evidence.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const evidenceWithIdOnly = await prisma.evidence.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends evidenceFindManyArgs>(args?: SelectSubset<T, evidenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$evidencePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Evidence.
     * @param {evidenceCreateArgs} args - Arguments to create a Evidence.
     * @example
     * // Create one Evidence
     * const Evidence = await prisma.evidence.create({
     *   data: {
     *     // ... data to create a Evidence
     *   }
     * })
     * 
     */
    create<T extends evidenceCreateArgs>(args: SelectSubset<T, evidenceCreateArgs<ExtArgs>>): Prisma__evidenceClient<$Result.GetResult<Prisma.$evidencePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Evidences.
     * @param {evidenceCreateManyArgs} args - Arguments to create many Evidences.
     * @example
     * // Create many Evidences
     * const evidence = await prisma.evidence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends evidenceCreateManyArgs>(args?: SelectSubset<T, evidenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Evidences and returns the data saved in the database.
     * @param {evidenceCreateManyAndReturnArgs} args - Arguments to create many Evidences.
     * @example
     * // Create many Evidences
     * const evidence = await prisma.evidence.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Evidences and only return the `id`
     * const evidenceWithIdOnly = await prisma.evidence.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends evidenceCreateManyAndReturnArgs>(args?: SelectSubset<T, evidenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$evidencePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Evidence.
     * @param {evidenceDeleteArgs} args - Arguments to delete one Evidence.
     * @example
     * // Delete one Evidence
     * const Evidence = await prisma.evidence.delete({
     *   where: {
     *     // ... filter to delete one Evidence
     *   }
     * })
     * 
     */
    delete<T extends evidenceDeleteArgs>(args: SelectSubset<T, evidenceDeleteArgs<ExtArgs>>): Prisma__evidenceClient<$Result.GetResult<Prisma.$evidencePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Evidence.
     * @param {evidenceUpdateArgs} args - Arguments to update one Evidence.
     * @example
     * // Update one Evidence
     * const evidence = await prisma.evidence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends evidenceUpdateArgs>(args: SelectSubset<T, evidenceUpdateArgs<ExtArgs>>): Prisma__evidenceClient<$Result.GetResult<Prisma.$evidencePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Evidences.
     * @param {evidenceDeleteManyArgs} args - Arguments to filter Evidences to delete.
     * @example
     * // Delete a few Evidences
     * const { count } = await prisma.evidence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends evidenceDeleteManyArgs>(args?: SelectSubset<T, evidenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Evidences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {evidenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Evidences
     * const evidence = await prisma.evidence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends evidenceUpdateManyArgs>(args: SelectSubset<T, evidenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Evidence.
     * @param {evidenceUpsertArgs} args - Arguments to update or create a Evidence.
     * @example
     * // Update or create a Evidence
     * const evidence = await prisma.evidence.upsert({
     *   create: {
     *     // ... data to create a Evidence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Evidence we want to update
     *   }
     * })
     */
    upsert<T extends evidenceUpsertArgs>(args: SelectSubset<T, evidenceUpsertArgs<ExtArgs>>): Prisma__evidenceClient<$Result.GetResult<Prisma.$evidencePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Evidences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {evidenceCountArgs} args - Arguments to filter Evidences to count.
     * @example
     * // Count the number of Evidences
     * const count = await prisma.evidence.count({
     *   where: {
     *     // ... the filter for the Evidences we want to count
     *   }
     * })
    **/
    count<T extends evidenceCountArgs>(
      args?: Subset<T, evidenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EvidenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Evidence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EvidenceAggregateArgs>(args: Subset<T, EvidenceAggregateArgs>): Prisma.PrismaPromise<GetEvidenceAggregateType<T>>

    /**
     * Group by Evidence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {evidenceGroupByArgs} args - Group by arguments.
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
      T extends evidenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: evidenceGroupByArgs['orderBy'] }
        : { orderBy?: evidenceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, evidenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEvidenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the evidence model
   */
  readonly fields: evidenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for evidence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__evidenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    diagnosis<T extends diagnosisDefaultArgs<ExtArgs> = {}>(args?: Subset<T, diagnosisDefaultArgs<ExtArgs>>): Prisma__diagnosisClient<$Result.GetResult<Prisma.$diagnosisPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the evidence model
   */ 
  interface evidenceFieldRefs {
    readonly id: FieldRef<"evidence", 'String'>
    readonly diagnosis_id: FieldRef<"evidence", 'String'>
    readonly item_id: FieldRef<"evidence", 'String'>
    readonly extracted_answer: FieldRef<"evidence", 'String'>
    readonly correct: FieldRef<"evidence", 'Boolean'>
    readonly confidence: FieldRef<"evidence", 'Float'>
    readonly quality: FieldRef<"evidence", 'evidence_quality'>
    readonly created_at: FieldRef<"evidence", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * evidence findUnique
   */
  export type evidenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the evidence
     */
    select?: evidenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: evidenceInclude<ExtArgs> | null
    /**
     * Filter, which evidence to fetch.
     */
    where: evidenceWhereUniqueInput
  }

  /**
   * evidence findUniqueOrThrow
   */
  export type evidenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the evidence
     */
    select?: evidenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: evidenceInclude<ExtArgs> | null
    /**
     * Filter, which evidence to fetch.
     */
    where: evidenceWhereUniqueInput
  }

  /**
   * evidence findFirst
   */
  export type evidenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the evidence
     */
    select?: evidenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: evidenceInclude<ExtArgs> | null
    /**
     * Filter, which evidence to fetch.
     */
    where?: evidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of evidences to fetch.
     */
    orderBy?: evidenceOrderByWithRelationInput | evidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for evidences.
     */
    cursor?: evidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` evidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` evidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of evidences.
     */
    distinct?: EvidenceScalarFieldEnum | EvidenceScalarFieldEnum[]
  }

  /**
   * evidence findFirstOrThrow
   */
  export type evidenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the evidence
     */
    select?: evidenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: evidenceInclude<ExtArgs> | null
    /**
     * Filter, which evidence to fetch.
     */
    where?: evidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of evidences to fetch.
     */
    orderBy?: evidenceOrderByWithRelationInput | evidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for evidences.
     */
    cursor?: evidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` evidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` evidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of evidences.
     */
    distinct?: EvidenceScalarFieldEnum | EvidenceScalarFieldEnum[]
  }

  /**
   * evidence findMany
   */
  export type evidenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the evidence
     */
    select?: evidenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: evidenceInclude<ExtArgs> | null
    /**
     * Filter, which evidences to fetch.
     */
    where?: evidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of evidences to fetch.
     */
    orderBy?: evidenceOrderByWithRelationInput | evidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing evidences.
     */
    cursor?: evidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` evidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` evidences.
     */
    skip?: number
    distinct?: EvidenceScalarFieldEnum | EvidenceScalarFieldEnum[]
  }

  /**
   * evidence create
   */
  export type evidenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the evidence
     */
    select?: evidenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: evidenceInclude<ExtArgs> | null
    /**
     * The data needed to create a evidence.
     */
    data: XOR<evidenceCreateInput, evidenceUncheckedCreateInput>
  }

  /**
   * evidence createMany
   */
  export type evidenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many evidences.
     */
    data: evidenceCreateManyInput | evidenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * evidence createManyAndReturn
   */
  export type evidenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the evidence
     */
    select?: evidenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many evidences.
     */
    data: evidenceCreateManyInput | evidenceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: evidenceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * evidence update
   */
  export type evidenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the evidence
     */
    select?: evidenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: evidenceInclude<ExtArgs> | null
    /**
     * The data needed to update a evidence.
     */
    data: XOR<evidenceUpdateInput, evidenceUncheckedUpdateInput>
    /**
     * Choose, which evidence to update.
     */
    where: evidenceWhereUniqueInput
  }

  /**
   * evidence updateMany
   */
  export type evidenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update evidences.
     */
    data: XOR<evidenceUpdateManyMutationInput, evidenceUncheckedUpdateManyInput>
    /**
     * Filter which evidences to update
     */
    where?: evidenceWhereInput
  }

  /**
   * evidence upsert
   */
  export type evidenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the evidence
     */
    select?: evidenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: evidenceInclude<ExtArgs> | null
    /**
     * The filter to search for the evidence to update in case it exists.
     */
    where: evidenceWhereUniqueInput
    /**
     * In case the evidence found by the `where` argument doesn't exist, create a new evidence with this data.
     */
    create: XOR<evidenceCreateInput, evidenceUncheckedCreateInput>
    /**
     * In case the evidence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<evidenceUpdateInput, evidenceUncheckedUpdateInput>
  }

  /**
   * evidence delete
   */
  export type evidenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the evidence
     */
    select?: evidenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: evidenceInclude<ExtArgs> | null
    /**
     * Filter which evidence to delete.
     */
    where: evidenceWhereUniqueInput
  }

  /**
   * evidence deleteMany
   */
  export type evidenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which evidences to delete
     */
    where?: evidenceWhereInput
  }

  /**
   * evidence without action
   */
  export type evidenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the evidence
     */
    select?: evidenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: evidenceInclude<ExtArgs> | null
  }


  /**
   * Model intervention
   */

  export type AggregateIntervention = {
    _count: InterventionCountAggregateOutputType | null
    _avg: InterventionAvgAggregateOutputType | null
    _sum: InterventionSumAggregateOutputType | null
    _min: InterventionMinAggregateOutputType | null
    _max: InterventionMaxAggregateOutputType | null
  }

  export type InterventionAvgAggregateOutputType = {
    priority: number | null
  }

  export type InterventionSumAggregateOutputType = {
    priority: number | null
  }

  export type InterventionMinAggregateOutputType = {
    id: string | null
    student_id: string | null
    skill_id: string | null
    priority: number | null
    status: $Enums.intervention_status | null
    teacher_id: string | null
    notes: string | null
    created_at: Date | null
    resolved_at: Date | null
  }

  export type InterventionMaxAggregateOutputType = {
    id: string | null
    student_id: string | null
    skill_id: string | null
    priority: number | null
    status: $Enums.intervention_status | null
    teacher_id: string | null
    notes: string | null
    created_at: Date | null
    resolved_at: Date | null
  }

  export type InterventionCountAggregateOutputType = {
    id: number
    student_id: number
    skill_id: number
    priority: number
    status: number
    teacher_id: number
    notes: number
    created_at: number
    resolved_at: number
    _all: number
  }


  export type InterventionAvgAggregateInputType = {
    priority?: true
  }

  export type InterventionSumAggregateInputType = {
    priority?: true
  }

  export type InterventionMinAggregateInputType = {
    id?: true
    student_id?: true
    skill_id?: true
    priority?: true
    status?: true
    teacher_id?: true
    notes?: true
    created_at?: true
    resolved_at?: true
  }

  export type InterventionMaxAggregateInputType = {
    id?: true
    student_id?: true
    skill_id?: true
    priority?: true
    status?: true
    teacher_id?: true
    notes?: true
    created_at?: true
    resolved_at?: true
  }

  export type InterventionCountAggregateInputType = {
    id?: true
    student_id?: true
    skill_id?: true
    priority?: true
    status?: true
    teacher_id?: true
    notes?: true
    created_at?: true
    resolved_at?: true
    _all?: true
  }

  export type InterventionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which intervention to aggregate.
     */
    where?: interventionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of interventions to fetch.
     */
    orderBy?: interventionOrderByWithRelationInput | interventionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: interventionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` interventions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` interventions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned interventions
    **/
    _count?: true | InterventionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InterventionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InterventionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InterventionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InterventionMaxAggregateInputType
  }

  export type GetInterventionAggregateType<T extends InterventionAggregateArgs> = {
        [P in keyof T & keyof AggregateIntervention]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIntervention[P]>
      : GetScalarType<T[P], AggregateIntervention[P]>
  }




  export type interventionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: interventionWhereInput
    orderBy?: interventionOrderByWithAggregationInput | interventionOrderByWithAggregationInput[]
    by: InterventionScalarFieldEnum[] | InterventionScalarFieldEnum
    having?: interventionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InterventionCountAggregateInputType | true
    _avg?: InterventionAvgAggregateInputType
    _sum?: InterventionSumAggregateInputType
    _min?: InterventionMinAggregateInputType
    _max?: InterventionMaxAggregateInputType
  }

  export type InterventionGroupByOutputType = {
    id: string
    student_id: string
    skill_id: string
    priority: number
    status: $Enums.intervention_status
    teacher_id: string | null
    notes: string | null
    created_at: Date
    resolved_at: Date | null
    _count: InterventionCountAggregateOutputType | null
    _avg: InterventionAvgAggregateOutputType | null
    _sum: InterventionSumAggregateOutputType | null
    _min: InterventionMinAggregateOutputType | null
    _max: InterventionMaxAggregateOutputType | null
  }

  type GetInterventionGroupByPayload<T extends interventionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InterventionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InterventionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InterventionGroupByOutputType[P]>
            : GetScalarType<T[P], InterventionGroupByOutputType[P]>
        }
      >
    >


  export type interventionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    skill_id?: boolean
    priority?: boolean
    status?: boolean
    teacher_id?: boolean
    notes?: boolean
    created_at?: boolean
    resolved_at?: boolean
    skill?: boolean | skillDefaultArgs<ExtArgs>
    notes_list?: boolean | intervention$notes_listArgs<ExtArgs>
    _count?: boolean | InterventionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["intervention"]>

  export type interventionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    skill_id?: boolean
    priority?: boolean
    status?: boolean
    teacher_id?: boolean
    notes?: boolean
    created_at?: boolean
    resolved_at?: boolean
    skill?: boolean | skillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["intervention"]>

  export type interventionSelectScalar = {
    id?: boolean
    student_id?: boolean
    skill_id?: boolean
    priority?: boolean
    status?: boolean
    teacher_id?: boolean
    notes?: boolean
    created_at?: boolean
    resolved_at?: boolean
  }

  export type interventionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skill?: boolean | skillDefaultArgs<ExtArgs>
    notes_list?: boolean | intervention$notes_listArgs<ExtArgs>
    _count?: boolean | InterventionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type interventionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skill?: boolean | skillDefaultArgs<ExtArgs>
  }

  export type $interventionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "intervention"
    objects: {
      skill: Prisma.$skillPayload<ExtArgs>
      notes_list: Prisma.$intervention_notePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      student_id: string
      skill_id: string
      priority: number
      status: $Enums.intervention_status
      teacher_id: string | null
      notes: string | null
      created_at: Date
      resolved_at: Date | null
    }, ExtArgs["result"]["intervention"]>
    composites: {}
  }

  type interventionGetPayload<S extends boolean | null | undefined | interventionDefaultArgs> = $Result.GetResult<Prisma.$interventionPayload, S>

  type interventionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<interventionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InterventionCountAggregateInputType | true
    }

  export interface interventionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['intervention'], meta: { name: 'intervention' } }
    /**
     * Find zero or one Intervention that matches the filter.
     * @param {interventionFindUniqueArgs} args - Arguments to find a Intervention
     * @example
     * // Get one Intervention
     * const intervention = await prisma.intervention.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends interventionFindUniqueArgs>(args: SelectSubset<T, interventionFindUniqueArgs<ExtArgs>>): Prisma__interventionClient<$Result.GetResult<Prisma.$interventionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Intervention that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {interventionFindUniqueOrThrowArgs} args - Arguments to find a Intervention
     * @example
     * // Get one Intervention
     * const intervention = await prisma.intervention.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends interventionFindUniqueOrThrowArgs>(args: SelectSubset<T, interventionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__interventionClient<$Result.GetResult<Prisma.$interventionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Intervention that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {interventionFindFirstArgs} args - Arguments to find a Intervention
     * @example
     * // Get one Intervention
     * const intervention = await prisma.intervention.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends interventionFindFirstArgs>(args?: SelectSubset<T, interventionFindFirstArgs<ExtArgs>>): Prisma__interventionClient<$Result.GetResult<Prisma.$interventionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Intervention that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {interventionFindFirstOrThrowArgs} args - Arguments to find a Intervention
     * @example
     * // Get one Intervention
     * const intervention = await prisma.intervention.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends interventionFindFirstOrThrowArgs>(args?: SelectSubset<T, interventionFindFirstOrThrowArgs<ExtArgs>>): Prisma__interventionClient<$Result.GetResult<Prisma.$interventionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Interventions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {interventionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Interventions
     * const interventions = await prisma.intervention.findMany()
     * 
     * // Get first 10 Interventions
     * const interventions = await prisma.intervention.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const interventionWithIdOnly = await prisma.intervention.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends interventionFindManyArgs>(args?: SelectSubset<T, interventionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$interventionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Intervention.
     * @param {interventionCreateArgs} args - Arguments to create a Intervention.
     * @example
     * // Create one Intervention
     * const Intervention = await prisma.intervention.create({
     *   data: {
     *     // ... data to create a Intervention
     *   }
     * })
     * 
     */
    create<T extends interventionCreateArgs>(args: SelectSubset<T, interventionCreateArgs<ExtArgs>>): Prisma__interventionClient<$Result.GetResult<Prisma.$interventionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Interventions.
     * @param {interventionCreateManyArgs} args - Arguments to create many Interventions.
     * @example
     * // Create many Interventions
     * const intervention = await prisma.intervention.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends interventionCreateManyArgs>(args?: SelectSubset<T, interventionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Interventions and returns the data saved in the database.
     * @param {interventionCreateManyAndReturnArgs} args - Arguments to create many Interventions.
     * @example
     * // Create many Interventions
     * const intervention = await prisma.intervention.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Interventions and only return the `id`
     * const interventionWithIdOnly = await prisma.intervention.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends interventionCreateManyAndReturnArgs>(args?: SelectSubset<T, interventionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$interventionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Intervention.
     * @param {interventionDeleteArgs} args - Arguments to delete one Intervention.
     * @example
     * // Delete one Intervention
     * const Intervention = await prisma.intervention.delete({
     *   where: {
     *     // ... filter to delete one Intervention
     *   }
     * })
     * 
     */
    delete<T extends interventionDeleteArgs>(args: SelectSubset<T, interventionDeleteArgs<ExtArgs>>): Prisma__interventionClient<$Result.GetResult<Prisma.$interventionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Intervention.
     * @param {interventionUpdateArgs} args - Arguments to update one Intervention.
     * @example
     * // Update one Intervention
     * const intervention = await prisma.intervention.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends interventionUpdateArgs>(args: SelectSubset<T, interventionUpdateArgs<ExtArgs>>): Prisma__interventionClient<$Result.GetResult<Prisma.$interventionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Interventions.
     * @param {interventionDeleteManyArgs} args - Arguments to filter Interventions to delete.
     * @example
     * // Delete a few Interventions
     * const { count } = await prisma.intervention.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends interventionDeleteManyArgs>(args?: SelectSubset<T, interventionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Interventions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {interventionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Interventions
     * const intervention = await prisma.intervention.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends interventionUpdateManyArgs>(args: SelectSubset<T, interventionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Intervention.
     * @param {interventionUpsertArgs} args - Arguments to update or create a Intervention.
     * @example
     * // Update or create a Intervention
     * const intervention = await prisma.intervention.upsert({
     *   create: {
     *     // ... data to create a Intervention
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Intervention we want to update
     *   }
     * })
     */
    upsert<T extends interventionUpsertArgs>(args: SelectSubset<T, interventionUpsertArgs<ExtArgs>>): Prisma__interventionClient<$Result.GetResult<Prisma.$interventionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Interventions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {interventionCountArgs} args - Arguments to filter Interventions to count.
     * @example
     * // Count the number of Interventions
     * const count = await prisma.intervention.count({
     *   where: {
     *     // ... the filter for the Interventions we want to count
     *   }
     * })
    **/
    count<T extends interventionCountArgs>(
      args?: Subset<T, interventionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InterventionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Intervention.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InterventionAggregateArgs>(args: Subset<T, InterventionAggregateArgs>): Prisma.PrismaPromise<GetInterventionAggregateType<T>>

    /**
     * Group by Intervention.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {interventionGroupByArgs} args - Group by arguments.
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
      T extends interventionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: interventionGroupByArgs['orderBy'] }
        : { orderBy?: interventionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, interventionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInterventionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the intervention model
   */
  readonly fields: interventionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for intervention.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__interventionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    skill<T extends skillDefaultArgs<ExtArgs> = {}>(args?: Subset<T, skillDefaultArgs<ExtArgs>>): Prisma__skillClient<$Result.GetResult<Prisma.$skillPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    notes_list<T extends intervention$notes_listArgs<ExtArgs> = {}>(args?: Subset<T, intervention$notes_listArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$intervention_notePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the intervention model
   */ 
  interface interventionFieldRefs {
    readonly id: FieldRef<"intervention", 'String'>
    readonly student_id: FieldRef<"intervention", 'String'>
    readonly skill_id: FieldRef<"intervention", 'String'>
    readonly priority: FieldRef<"intervention", 'Int'>
    readonly status: FieldRef<"intervention", 'intervention_status'>
    readonly teacher_id: FieldRef<"intervention", 'String'>
    readonly notes: FieldRef<"intervention", 'String'>
    readonly created_at: FieldRef<"intervention", 'DateTime'>
    readonly resolved_at: FieldRef<"intervention", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * intervention findUnique
   */
  export type interventionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention
     */
    select?: interventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: interventionInclude<ExtArgs> | null
    /**
     * Filter, which intervention to fetch.
     */
    where: interventionWhereUniqueInput
  }

  /**
   * intervention findUniqueOrThrow
   */
  export type interventionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention
     */
    select?: interventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: interventionInclude<ExtArgs> | null
    /**
     * Filter, which intervention to fetch.
     */
    where: interventionWhereUniqueInput
  }

  /**
   * intervention findFirst
   */
  export type interventionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention
     */
    select?: interventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: interventionInclude<ExtArgs> | null
    /**
     * Filter, which intervention to fetch.
     */
    where?: interventionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of interventions to fetch.
     */
    orderBy?: interventionOrderByWithRelationInput | interventionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for interventions.
     */
    cursor?: interventionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` interventions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` interventions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of interventions.
     */
    distinct?: InterventionScalarFieldEnum | InterventionScalarFieldEnum[]
  }

  /**
   * intervention findFirstOrThrow
   */
  export type interventionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention
     */
    select?: interventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: interventionInclude<ExtArgs> | null
    /**
     * Filter, which intervention to fetch.
     */
    where?: interventionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of interventions to fetch.
     */
    orderBy?: interventionOrderByWithRelationInput | interventionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for interventions.
     */
    cursor?: interventionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` interventions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` interventions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of interventions.
     */
    distinct?: InterventionScalarFieldEnum | InterventionScalarFieldEnum[]
  }

  /**
   * intervention findMany
   */
  export type interventionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention
     */
    select?: interventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: interventionInclude<ExtArgs> | null
    /**
     * Filter, which interventions to fetch.
     */
    where?: interventionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of interventions to fetch.
     */
    orderBy?: interventionOrderByWithRelationInput | interventionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing interventions.
     */
    cursor?: interventionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` interventions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` interventions.
     */
    skip?: number
    distinct?: InterventionScalarFieldEnum | InterventionScalarFieldEnum[]
  }

  /**
   * intervention create
   */
  export type interventionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention
     */
    select?: interventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: interventionInclude<ExtArgs> | null
    /**
     * The data needed to create a intervention.
     */
    data: XOR<interventionCreateInput, interventionUncheckedCreateInput>
  }

  /**
   * intervention createMany
   */
  export type interventionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many interventions.
     */
    data: interventionCreateManyInput | interventionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * intervention createManyAndReturn
   */
  export type interventionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention
     */
    select?: interventionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many interventions.
     */
    data: interventionCreateManyInput | interventionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: interventionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * intervention update
   */
  export type interventionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention
     */
    select?: interventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: interventionInclude<ExtArgs> | null
    /**
     * The data needed to update a intervention.
     */
    data: XOR<interventionUpdateInput, interventionUncheckedUpdateInput>
    /**
     * Choose, which intervention to update.
     */
    where: interventionWhereUniqueInput
  }

  /**
   * intervention updateMany
   */
  export type interventionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update interventions.
     */
    data: XOR<interventionUpdateManyMutationInput, interventionUncheckedUpdateManyInput>
    /**
     * Filter which interventions to update
     */
    where?: interventionWhereInput
  }

  /**
   * intervention upsert
   */
  export type interventionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention
     */
    select?: interventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: interventionInclude<ExtArgs> | null
    /**
     * The filter to search for the intervention to update in case it exists.
     */
    where: interventionWhereUniqueInput
    /**
     * In case the intervention found by the `where` argument doesn't exist, create a new intervention with this data.
     */
    create: XOR<interventionCreateInput, interventionUncheckedCreateInput>
    /**
     * In case the intervention was found with the provided `where` argument, update it with this data.
     */
    update: XOR<interventionUpdateInput, interventionUncheckedUpdateInput>
  }

  /**
   * intervention delete
   */
  export type interventionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention
     */
    select?: interventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: interventionInclude<ExtArgs> | null
    /**
     * Filter which intervention to delete.
     */
    where: interventionWhereUniqueInput
  }

  /**
   * intervention deleteMany
   */
  export type interventionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which interventions to delete
     */
    where?: interventionWhereInput
  }

  /**
   * intervention.notes_list
   */
  export type intervention$notes_listArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention_note
     */
    select?: intervention_noteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: intervention_noteInclude<ExtArgs> | null
    where?: intervention_noteWhereInput
    orderBy?: intervention_noteOrderByWithRelationInput | intervention_noteOrderByWithRelationInput[]
    cursor?: intervention_noteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Intervention_noteScalarFieldEnum | Intervention_noteScalarFieldEnum[]
  }

  /**
   * intervention without action
   */
  export type interventionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention
     */
    select?: interventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: interventionInclude<ExtArgs> | null
  }


  /**
   * Model intervention_note
   */

  export type AggregateIntervention_note = {
    _count: Intervention_noteCountAggregateOutputType | null
    _min: Intervention_noteMinAggregateOutputType | null
    _max: Intervention_noteMaxAggregateOutputType | null
  }

  export type Intervention_noteMinAggregateOutputType = {
    id: string | null
    intervention_id: string | null
    teacher_id: string | null
    content: string | null
    created_at: Date | null
  }

  export type Intervention_noteMaxAggregateOutputType = {
    id: string | null
    intervention_id: string | null
    teacher_id: string | null
    content: string | null
    created_at: Date | null
  }

  export type Intervention_noteCountAggregateOutputType = {
    id: number
    intervention_id: number
    teacher_id: number
    content: number
    created_at: number
    _all: number
  }


  export type Intervention_noteMinAggregateInputType = {
    id?: true
    intervention_id?: true
    teacher_id?: true
    content?: true
    created_at?: true
  }

  export type Intervention_noteMaxAggregateInputType = {
    id?: true
    intervention_id?: true
    teacher_id?: true
    content?: true
    created_at?: true
  }

  export type Intervention_noteCountAggregateInputType = {
    id?: true
    intervention_id?: true
    teacher_id?: true
    content?: true
    created_at?: true
    _all?: true
  }

  export type Intervention_noteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which intervention_note to aggregate.
     */
    where?: intervention_noteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of intervention_notes to fetch.
     */
    orderBy?: intervention_noteOrderByWithRelationInput | intervention_noteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: intervention_noteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` intervention_notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` intervention_notes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned intervention_notes
    **/
    _count?: true | Intervention_noteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Intervention_noteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Intervention_noteMaxAggregateInputType
  }

  export type GetIntervention_noteAggregateType<T extends Intervention_noteAggregateArgs> = {
        [P in keyof T & keyof AggregateIntervention_note]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIntervention_note[P]>
      : GetScalarType<T[P], AggregateIntervention_note[P]>
  }




  export type intervention_noteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: intervention_noteWhereInput
    orderBy?: intervention_noteOrderByWithAggregationInput | intervention_noteOrderByWithAggregationInput[]
    by: Intervention_noteScalarFieldEnum[] | Intervention_noteScalarFieldEnum
    having?: intervention_noteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Intervention_noteCountAggregateInputType | true
    _min?: Intervention_noteMinAggregateInputType
    _max?: Intervention_noteMaxAggregateInputType
  }

  export type Intervention_noteGroupByOutputType = {
    id: string
    intervention_id: string
    teacher_id: string
    content: string
    created_at: Date
    _count: Intervention_noteCountAggregateOutputType | null
    _min: Intervention_noteMinAggregateOutputType | null
    _max: Intervention_noteMaxAggregateOutputType | null
  }

  type GetIntervention_noteGroupByPayload<T extends intervention_noteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Intervention_noteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Intervention_noteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Intervention_noteGroupByOutputType[P]>
            : GetScalarType<T[P], Intervention_noteGroupByOutputType[P]>
        }
      >
    >


  export type intervention_noteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    intervention_id?: boolean
    teacher_id?: boolean
    content?: boolean
    created_at?: boolean
    intervention?: boolean | interventionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["intervention_note"]>

  export type intervention_noteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    intervention_id?: boolean
    teacher_id?: boolean
    content?: boolean
    created_at?: boolean
    intervention?: boolean | interventionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["intervention_note"]>

  export type intervention_noteSelectScalar = {
    id?: boolean
    intervention_id?: boolean
    teacher_id?: boolean
    content?: boolean
    created_at?: boolean
  }

  export type intervention_noteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    intervention?: boolean | interventionDefaultArgs<ExtArgs>
  }
  export type intervention_noteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    intervention?: boolean | interventionDefaultArgs<ExtArgs>
  }

  export type $intervention_notePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "intervention_note"
    objects: {
      intervention: Prisma.$interventionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      intervention_id: string
      teacher_id: string
      content: string
      created_at: Date
    }, ExtArgs["result"]["intervention_note"]>
    composites: {}
  }

  type intervention_noteGetPayload<S extends boolean | null | undefined | intervention_noteDefaultArgs> = $Result.GetResult<Prisma.$intervention_notePayload, S>

  type intervention_noteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<intervention_noteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Intervention_noteCountAggregateInputType | true
    }

  export interface intervention_noteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['intervention_note'], meta: { name: 'intervention_note' } }
    /**
     * Find zero or one Intervention_note that matches the filter.
     * @param {intervention_noteFindUniqueArgs} args - Arguments to find a Intervention_note
     * @example
     * // Get one Intervention_note
     * const intervention_note = await prisma.intervention_note.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends intervention_noteFindUniqueArgs>(args: SelectSubset<T, intervention_noteFindUniqueArgs<ExtArgs>>): Prisma__intervention_noteClient<$Result.GetResult<Prisma.$intervention_notePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Intervention_note that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {intervention_noteFindUniqueOrThrowArgs} args - Arguments to find a Intervention_note
     * @example
     * // Get one Intervention_note
     * const intervention_note = await prisma.intervention_note.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends intervention_noteFindUniqueOrThrowArgs>(args: SelectSubset<T, intervention_noteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__intervention_noteClient<$Result.GetResult<Prisma.$intervention_notePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Intervention_note that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {intervention_noteFindFirstArgs} args - Arguments to find a Intervention_note
     * @example
     * // Get one Intervention_note
     * const intervention_note = await prisma.intervention_note.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends intervention_noteFindFirstArgs>(args?: SelectSubset<T, intervention_noteFindFirstArgs<ExtArgs>>): Prisma__intervention_noteClient<$Result.GetResult<Prisma.$intervention_notePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Intervention_note that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {intervention_noteFindFirstOrThrowArgs} args - Arguments to find a Intervention_note
     * @example
     * // Get one Intervention_note
     * const intervention_note = await prisma.intervention_note.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends intervention_noteFindFirstOrThrowArgs>(args?: SelectSubset<T, intervention_noteFindFirstOrThrowArgs<ExtArgs>>): Prisma__intervention_noteClient<$Result.GetResult<Prisma.$intervention_notePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Intervention_notes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {intervention_noteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Intervention_notes
     * const intervention_notes = await prisma.intervention_note.findMany()
     * 
     * // Get first 10 Intervention_notes
     * const intervention_notes = await prisma.intervention_note.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const intervention_noteWithIdOnly = await prisma.intervention_note.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends intervention_noteFindManyArgs>(args?: SelectSubset<T, intervention_noteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$intervention_notePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Intervention_note.
     * @param {intervention_noteCreateArgs} args - Arguments to create a Intervention_note.
     * @example
     * // Create one Intervention_note
     * const Intervention_note = await prisma.intervention_note.create({
     *   data: {
     *     // ... data to create a Intervention_note
     *   }
     * })
     * 
     */
    create<T extends intervention_noteCreateArgs>(args: SelectSubset<T, intervention_noteCreateArgs<ExtArgs>>): Prisma__intervention_noteClient<$Result.GetResult<Prisma.$intervention_notePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Intervention_notes.
     * @param {intervention_noteCreateManyArgs} args - Arguments to create many Intervention_notes.
     * @example
     * // Create many Intervention_notes
     * const intervention_note = await prisma.intervention_note.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends intervention_noteCreateManyArgs>(args?: SelectSubset<T, intervention_noteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Intervention_notes and returns the data saved in the database.
     * @param {intervention_noteCreateManyAndReturnArgs} args - Arguments to create many Intervention_notes.
     * @example
     * // Create many Intervention_notes
     * const intervention_note = await prisma.intervention_note.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Intervention_notes and only return the `id`
     * const intervention_noteWithIdOnly = await prisma.intervention_note.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends intervention_noteCreateManyAndReturnArgs>(args?: SelectSubset<T, intervention_noteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$intervention_notePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Intervention_note.
     * @param {intervention_noteDeleteArgs} args - Arguments to delete one Intervention_note.
     * @example
     * // Delete one Intervention_note
     * const Intervention_note = await prisma.intervention_note.delete({
     *   where: {
     *     // ... filter to delete one Intervention_note
     *   }
     * })
     * 
     */
    delete<T extends intervention_noteDeleteArgs>(args: SelectSubset<T, intervention_noteDeleteArgs<ExtArgs>>): Prisma__intervention_noteClient<$Result.GetResult<Prisma.$intervention_notePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Intervention_note.
     * @param {intervention_noteUpdateArgs} args - Arguments to update one Intervention_note.
     * @example
     * // Update one Intervention_note
     * const intervention_note = await prisma.intervention_note.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends intervention_noteUpdateArgs>(args: SelectSubset<T, intervention_noteUpdateArgs<ExtArgs>>): Prisma__intervention_noteClient<$Result.GetResult<Prisma.$intervention_notePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Intervention_notes.
     * @param {intervention_noteDeleteManyArgs} args - Arguments to filter Intervention_notes to delete.
     * @example
     * // Delete a few Intervention_notes
     * const { count } = await prisma.intervention_note.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends intervention_noteDeleteManyArgs>(args?: SelectSubset<T, intervention_noteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Intervention_notes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {intervention_noteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Intervention_notes
     * const intervention_note = await prisma.intervention_note.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends intervention_noteUpdateManyArgs>(args: SelectSubset<T, intervention_noteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Intervention_note.
     * @param {intervention_noteUpsertArgs} args - Arguments to update or create a Intervention_note.
     * @example
     * // Update or create a Intervention_note
     * const intervention_note = await prisma.intervention_note.upsert({
     *   create: {
     *     // ... data to create a Intervention_note
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Intervention_note we want to update
     *   }
     * })
     */
    upsert<T extends intervention_noteUpsertArgs>(args: SelectSubset<T, intervention_noteUpsertArgs<ExtArgs>>): Prisma__intervention_noteClient<$Result.GetResult<Prisma.$intervention_notePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Intervention_notes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {intervention_noteCountArgs} args - Arguments to filter Intervention_notes to count.
     * @example
     * // Count the number of Intervention_notes
     * const count = await prisma.intervention_note.count({
     *   where: {
     *     // ... the filter for the Intervention_notes we want to count
     *   }
     * })
    **/
    count<T extends intervention_noteCountArgs>(
      args?: Subset<T, intervention_noteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Intervention_noteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Intervention_note.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Intervention_noteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Intervention_noteAggregateArgs>(args: Subset<T, Intervention_noteAggregateArgs>): Prisma.PrismaPromise<GetIntervention_noteAggregateType<T>>

    /**
     * Group by Intervention_note.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {intervention_noteGroupByArgs} args - Group by arguments.
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
      T extends intervention_noteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: intervention_noteGroupByArgs['orderBy'] }
        : { orderBy?: intervention_noteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, intervention_noteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIntervention_noteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the intervention_note model
   */
  readonly fields: intervention_noteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for intervention_note.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__intervention_noteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    intervention<T extends interventionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, interventionDefaultArgs<ExtArgs>>): Prisma__interventionClient<$Result.GetResult<Prisma.$interventionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the intervention_note model
   */ 
  interface intervention_noteFieldRefs {
    readonly id: FieldRef<"intervention_note", 'String'>
    readonly intervention_id: FieldRef<"intervention_note", 'String'>
    readonly teacher_id: FieldRef<"intervention_note", 'String'>
    readonly content: FieldRef<"intervention_note", 'String'>
    readonly created_at: FieldRef<"intervention_note", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * intervention_note findUnique
   */
  export type intervention_noteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention_note
     */
    select?: intervention_noteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: intervention_noteInclude<ExtArgs> | null
    /**
     * Filter, which intervention_note to fetch.
     */
    where: intervention_noteWhereUniqueInput
  }

  /**
   * intervention_note findUniqueOrThrow
   */
  export type intervention_noteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention_note
     */
    select?: intervention_noteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: intervention_noteInclude<ExtArgs> | null
    /**
     * Filter, which intervention_note to fetch.
     */
    where: intervention_noteWhereUniqueInput
  }

  /**
   * intervention_note findFirst
   */
  export type intervention_noteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention_note
     */
    select?: intervention_noteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: intervention_noteInclude<ExtArgs> | null
    /**
     * Filter, which intervention_note to fetch.
     */
    where?: intervention_noteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of intervention_notes to fetch.
     */
    orderBy?: intervention_noteOrderByWithRelationInput | intervention_noteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for intervention_notes.
     */
    cursor?: intervention_noteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` intervention_notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` intervention_notes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of intervention_notes.
     */
    distinct?: Intervention_noteScalarFieldEnum | Intervention_noteScalarFieldEnum[]
  }

  /**
   * intervention_note findFirstOrThrow
   */
  export type intervention_noteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention_note
     */
    select?: intervention_noteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: intervention_noteInclude<ExtArgs> | null
    /**
     * Filter, which intervention_note to fetch.
     */
    where?: intervention_noteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of intervention_notes to fetch.
     */
    orderBy?: intervention_noteOrderByWithRelationInput | intervention_noteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for intervention_notes.
     */
    cursor?: intervention_noteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` intervention_notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` intervention_notes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of intervention_notes.
     */
    distinct?: Intervention_noteScalarFieldEnum | Intervention_noteScalarFieldEnum[]
  }

  /**
   * intervention_note findMany
   */
  export type intervention_noteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention_note
     */
    select?: intervention_noteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: intervention_noteInclude<ExtArgs> | null
    /**
     * Filter, which intervention_notes to fetch.
     */
    where?: intervention_noteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of intervention_notes to fetch.
     */
    orderBy?: intervention_noteOrderByWithRelationInput | intervention_noteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing intervention_notes.
     */
    cursor?: intervention_noteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` intervention_notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` intervention_notes.
     */
    skip?: number
    distinct?: Intervention_noteScalarFieldEnum | Intervention_noteScalarFieldEnum[]
  }

  /**
   * intervention_note create
   */
  export type intervention_noteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention_note
     */
    select?: intervention_noteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: intervention_noteInclude<ExtArgs> | null
    /**
     * The data needed to create a intervention_note.
     */
    data: XOR<intervention_noteCreateInput, intervention_noteUncheckedCreateInput>
  }

  /**
   * intervention_note createMany
   */
  export type intervention_noteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many intervention_notes.
     */
    data: intervention_noteCreateManyInput | intervention_noteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * intervention_note createManyAndReturn
   */
  export type intervention_noteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention_note
     */
    select?: intervention_noteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many intervention_notes.
     */
    data: intervention_noteCreateManyInput | intervention_noteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: intervention_noteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * intervention_note update
   */
  export type intervention_noteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention_note
     */
    select?: intervention_noteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: intervention_noteInclude<ExtArgs> | null
    /**
     * The data needed to update a intervention_note.
     */
    data: XOR<intervention_noteUpdateInput, intervention_noteUncheckedUpdateInput>
    /**
     * Choose, which intervention_note to update.
     */
    where: intervention_noteWhereUniqueInput
  }

  /**
   * intervention_note updateMany
   */
  export type intervention_noteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update intervention_notes.
     */
    data: XOR<intervention_noteUpdateManyMutationInput, intervention_noteUncheckedUpdateManyInput>
    /**
     * Filter which intervention_notes to update
     */
    where?: intervention_noteWhereInput
  }

  /**
   * intervention_note upsert
   */
  export type intervention_noteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention_note
     */
    select?: intervention_noteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: intervention_noteInclude<ExtArgs> | null
    /**
     * The filter to search for the intervention_note to update in case it exists.
     */
    where: intervention_noteWhereUniqueInput
    /**
     * In case the intervention_note found by the `where` argument doesn't exist, create a new intervention_note with this data.
     */
    create: XOR<intervention_noteCreateInput, intervention_noteUncheckedCreateInput>
    /**
     * In case the intervention_note was found with the provided `where` argument, update it with this data.
     */
    update: XOR<intervention_noteUpdateInput, intervention_noteUncheckedUpdateInput>
  }

  /**
   * intervention_note delete
   */
  export type intervention_noteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention_note
     */
    select?: intervention_noteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: intervention_noteInclude<ExtArgs> | null
    /**
     * Filter which intervention_note to delete.
     */
    where: intervention_noteWhereUniqueInput
  }

  /**
   * intervention_note deleteMany
   */
  export type intervention_noteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which intervention_notes to delete
     */
    where?: intervention_noteWhereInput
  }

  /**
   * intervention_note without action
   */
  export type intervention_noteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the intervention_note
     */
    select?: intervention_noteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: intervention_noteInclude<ExtArgs> | null
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


  export const SkillScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    difficulty: 'difficulty',
    description: 'description',
    prereq_skills: 'prereq_skills',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type SkillScalarFieldEnum = (typeof SkillScalarFieldEnum)[keyof typeof SkillScalarFieldEnum]


  export const DiagnosisScalarFieldEnum: {
    id: 'id',
    student_id: 'student_id',
    skill_id: 'skill_id',
    p_known: 'p_known',
    confidence: 'confidence',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type DiagnosisScalarFieldEnum = (typeof DiagnosisScalarFieldEnum)[keyof typeof DiagnosisScalarFieldEnum]


  export const EvidenceScalarFieldEnum: {
    id: 'id',
    diagnosis_id: 'diagnosis_id',
    item_id: 'item_id',
    extracted_answer: 'extracted_answer',
    correct: 'correct',
    confidence: 'confidence',
    quality: 'quality',
    created_at: 'created_at'
  };

  export type EvidenceScalarFieldEnum = (typeof EvidenceScalarFieldEnum)[keyof typeof EvidenceScalarFieldEnum]


  export const InterventionScalarFieldEnum: {
    id: 'id',
    student_id: 'student_id',
    skill_id: 'skill_id',
    priority: 'priority',
    status: 'status',
    teacher_id: 'teacher_id',
    notes: 'notes',
    created_at: 'created_at',
    resolved_at: 'resolved_at'
  };

  export type InterventionScalarFieldEnum = (typeof InterventionScalarFieldEnum)[keyof typeof InterventionScalarFieldEnum]


  export const Intervention_noteScalarFieldEnum: {
    id: 'id',
    intervention_id: 'intervention_id',
    teacher_id: 'teacher_id',
    content: 'content',
    created_at: 'created_at'
  };

  export type Intervention_noteScalarFieldEnum = (typeof Intervention_noteScalarFieldEnum)[keyof typeof Intervention_noteScalarFieldEnum]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'diagnosis_status'
   */
  export type Enumdiagnosis_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'diagnosis_status'>
    


  /**
   * Reference to a field of type 'diagnosis_status[]'
   */
  export type ListEnumdiagnosis_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'diagnosis_status[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'evidence_quality'
   */
  export type Enumevidence_qualityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'evidence_quality'>
    


  /**
   * Reference to a field of type 'evidence_quality[]'
   */
  export type ListEnumevidence_qualityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'evidence_quality[]'>
    


  /**
   * Reference to a field of type 'intervention_status'
   */
  export type Enumintervention_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'intervention_status'>
    


  /**
   * Reference to a field of type 'intervention_status[]'
   */
  export type ListEnumintervention_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'intervention_status[]'>
    
  /**
   * Deep Input Types
   */


  export type skillWhereInput = {
    AND?: skillWhereInput | skillWhereInput[]
    OR?: skillWhereInput[]
    NOT?: skillWhereInput | skillWhereInput[]
    id?: StringFilter<"skill"> | string
    code?: StringFilter<"skill"> | string
    name?: StringFilter<"skill"> | string
    difficulty?: IntFilter<"skill"> | number
    description?: StringNullableFilter<"skill"> | string | null
    prereq_skills?: StringNullableListFilter<"skill">
    created_at?: DateTimeFilter<"skill"> | Date | string
    updated_at?: DateTimeFilter<"skill"> | Date | string
    diagnoses?: DiagnosisListRelationFilter
    interventions?: InterventionListRelationFilter
  }

  export type skillOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    difficulty?: SortOrder
    description?: SortOrderInput | SortOrder
    prereq_skills?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    diagnoses?: diagnosisOrderByRelationAggregateInput
    interventions?: interventionOrderByRelationAggregateInput
  }

  export type skillWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: skillWhereInput | skillWhereInput[]
    OR?: skillWhereInput[]
    NOT?: skillWhereInput | skillWhereInput[]
    name?: StringFilter<"skill"> | string
    difficulty?: IntFilter<"skill"> | number
    description?: StringNullableFilter<"skill"> | string | null
    prereq_skills?: StringNullableListFilter<"skill">
    created_at?: DateTimeFilter<"skill"> | Date | string
    updated_at?: DateTimeFilter<"skill"> | Date | string
    diagnoses?: DiagnosisListRelationFilter
    interventions?: InterventionListRelationFilter
  }, "id" | "code">

  export type skillOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    difficulty?: SortOrder
    description?: SortOrderInput | SortOrder
    prereq_skills?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: skillCountOrderByAggregateInput
    _avg?: skillAvgOrderByAggregateInput
    _max?: skillMaxOrderByAggregateInput
    _min?: skillMinOrderByAggregateInput
    _sum?: skillSumOrderByAggregateInput
  }

  export type skillScalarWhereWithAggregatesInput = {
    AND?: skillScalarWhereWithAggregatesInput | skillScalarWhereWithAggregatesInput[]
    OR?: skillScalarWhereWithAggregatesInput[]
    NOT?: skillScalarWhereWithAggregatesInput | skillScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"skill"> | string
    code?: StringWithAggregatesFilter<"skill"> | string
    name?: StringWithAggregatesFilter<"skill"> | string
    difficulty?: IntWithAggregatesFilter<"skill"> | number
    description?: StringNullableWithAggregatesFilter<"skill"> | string | null
    prereq_skills?: StringNullableListFilter<"skill">
    created_at?: DateTimeWithAggregatesFilter<"skill"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"skill"> | Date | string
  }

  export type diagnosisWhereInput = {
    AND?: diagnosisWhereInput | diagnosisWhereInput[]
    OR?: diagnosisWhereInput[]
    NOT?: diagnosisWhereInput | diagnosisWhereInput[]
    id?: StringFilter<"diagnosis"> | string
    student_id?: StringFilter<"diagnosis"> | string
    skill_id?: StringFilter<"diagnosis"> | string
    p_known?: FloatFilter<"diagnosis"> | number
    confidence?: FloatFilter<"diagnosis"> | number
    status?: Enumdiagnosis_statusFilter<"diagnosis"> | $Enums.diagnosis_status
    created_at?: DateTimeFilter<"diagnosis"> | Date | string
    updated_at?: DateTimeFilter<"diagnosis"> | Date | string
    skill?: XOR<SkillRelationFilter, skillWhereInput>
    evidence?: EvidenceListRelationFilter
  }

  export type diagnosisOrderByWithRelationInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    p_known?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    skill?: skillOrderByWithRelationInput
    evidence?: evidenceOrderByRelationAggregateInput
  }

  export type diagnosisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: diagnosisWhereInput | diagnosisWhereInput[]
    OR?: diagnosisWhereInput[]
    NOT?: diagnosisWhereInput | diagnosisWhereInput[]
    student_id?: StringFilter<"diagnosis"> | string
    skill_id?: StringFilter<"diagnosis"> | string
    p_known?: FloatFilter<"diagnosis"> | number
    confidence?: FloatFilter<"diagnosis"> | number
    status?: Enumdiagnosis_statusFilter<"diagnosis"> | $Enums.diagnosis_status
    created_at?: DateTimeFilter<"diagnosis"> | Date | string
    updated_at?: DateTimeFilter<"diagnosis"> | Date | string
    skill?: XOR<SkillRelationFilter, skillWhereInput>
    evidence?: EvidenceListRelationFilter
  }, "id">

  export type diagnosisOrderByWithAggregationInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    p_known?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: diagnosisCountOrderByAggregateInput
    _avg?: diagnosisAvgOrderByAggregateInput
    _max?: diagnosisMaxOrderByAggregateInput
    _min?: diagnosisMinOrderByAggregateInput
    _sum?: diagnosisSumOrderByAggregateInput
  }

  export type diagnosisScalarWhereWithAggregatesInput = {
    AND?: diagnosisScalarWhereWithAggregatesInput | diagnosisScalarWhereWithAggregatesInput[]
    OR?: diagnosisScalarWhereWithAggregatesInput[]
    NOT?: diagnosisScalarWhereWithAggregatesInput | diagnosisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"diagnosis"> | string
    student_id?: StringWithAggregatesFilter<"diagnosis"> | string
    skill_id?: StringWithAggregatesFilter<"diagnosis"> | string
    p_known?: FloatWithAggregatesFilter<"diagnosis"> | number
    confidence?: FloatWithAggregatesFilter<"diagnosis"> | number
    status?: Enumdiagnosis_statusWithAggregatesFilter<"diagnosis"> | $Enums.diagnosis_status
    created_at?: DateTimeWithAggregatesFilter<"diagnosis"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"diagnosis"> | Date | string
  }

  export type evidenceWhereInput = {
    AND?: evidenceWhereInput | evidenceWhereInput[]
    OR?: evidenceWhereInput[]
    NOT?: evidenceWhereInput | evidenceWhereInput[]
    id?: StringFilter<"evidence"> | string
    diagnosis_id?: StringFilter<"evidence"> | string
    item_id?: StringFilter<"evidence"> | string
    extracted_answer?: StringNullableFilter<"evidence"> | string | null
    correct?: BoolNullableFilter<"evidence"> | boolean | null
    confidence?: FloatFilter<"evidence"> | number
    quality?: Enumevidence_qualityFilter<"evidence"> | $Enums.evidence_quality
    created_at?: DateTimeFilter<"evidence"> | Date | string
    diagnosis?: XOR<DiagnosisRelationFilter, diagnosisWhereInput>
  }

  export type evidenceOrderByWithRelationInput = {
    id?: SortOrder
    diagnosis_id?: SortOrder
    item_id?: SortOrder
    extracted_answer?: SortOrderInput | SortOrder
    correct?: SortOrderInput | SortOrder
    confidence?: SortOrder
    quality?: SortOrder
    created_at?: SortOrder
    diagnosis?: diagnosisOrderByWithRelationInput
  }

  export type evidenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: evidenceWhereInput | evidenceWhereInput[]
    OR?: evidenceWhereInput[]
    NOT?: evidenceWhereInput | evidenceWhereInput[]
    diagnosis_id?: StringFilter<"evidence"> | string
    item_id?: StringFilter<"evidence"> | string
    extracted_answer?: StringNullableFilter<"evidence"> | string | null
    correct?: BoolNullableFilter<"evidence"> | boolean | null
    confidence?: FloatFilter<"evidence"> | number
    quality?: Enumevidence_qualityFilter<"evidence"> | $Enums.evidence_quality
    created_at?: DateTimeFilter<"evidence"> | Date | string
    diagnosis?: XOR<DiagnosisRelationFilter, diagnosisWhereInput>
  }, "id">

  export type evidenceOrderByWithAggregationInput = {
    id?: SortOrder
    diagnosis_id?: SortOrder
    item_id?: SortOrder
    extracted_answer?: SortOrderInput | SortOrder
    correct?: SortOrderInput | SortOrder
    confidence?: SortOrder
    quality?: SortOrder
    created_at?: SortOrder
    _count?: evidenceCountOrderByAggregateInput
    _avg?: evidenceAvgOrderByAggregateInput
    _max?: evidenceMaxOrderByAggregateInput
    _min?: evidenceMinOrderByAggregateInput
    _sum?: evidenceSumOrderByAggregateInput
  }

  export type evidenceScalarWhereWithAggregatesInput = {
    AND?: evidenceScalarWhereWithAggregatesInput | evidenceScalarWhereWithAggregatesInput[]
    OR?: evidenceScalarWhereWithAggregatesInput[]
    NOT?: evidenceScalarWhereWithAggregatesInput | evidenceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"evidence"> | string
    diagnosis_id?: StringWithAggregatesFilter<"evidence"> | string
    item_id?: StringWithAggregatesFilter<"evidence"> | string
    extracted_answer?: StringNullableWithAggregatesFilter<"evidence"> | string | null
    correct?: BoolNullableWithAggregatesFilter<"evidence"> | boolean | null
    confidence?: FloatWithAggregatesFilter<"evidence"> | number
    quality?: Enumevidence_qualityWithAggregatesFilter<"evidence"> | $Enums.evidence_quality
    created_at?: DateTimeWithAggregatesFilter<"evidence"> | Date | string
  }

  export type interventionWhereInput = {
    AND?: interventionWhereInput | interventionWhereInput[]
    OR?: interventionWhereInput[]
    NOT?: interventionWhereInput | interventionWhereInput[]
    id?: StringFilter<"intervention"> | string
    student_id?: StringFilter<"intervention"> | string
    skill_id?: StringFilter<"intervention"> | string
    priority?: IntFilter<"intervention"> | number
    status?: Enumintervention_statusFilter<"intervention"> | $Enums.intervention_status
    teacher_id?: StringNullableFilter<"intervention"> | string | null
    notes?: StringNullableFilter<"intervention"> | string | null
    created_at?: DateTimeFilter<"intervention"> | Date | string
    resolved_at?: DateTimeNullableFilter<"intervention"> | Date | string | null
    skill?: XOR<SkillRelationFilter, skillWhereInput>
    notes_list?: Intervention_noteListRelationFilter
  }

  export type interventionOrderByWithRelationInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    teacher_id?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    created_at?: SortOrder
    resolved_at?: SortOrderInput | SortOrder
    skill?: skillOrderByWithRelationInput
    notes_list?: intervention_noteOrderByRelationAggregateInput
  }

  export type interventionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: interventionWhereInput | interventionWhereInput[]
    OR?: interventionWhereInput[]
    NOT?: interventionWhereInput | interventionWhereInput[]
    student_id?: StringFilter<"intervention"> | string
    skill_id?: StringFilter<"intervention"> | string
    priority?: IntFilter<"intervention"> | number
    status?: Enumintervention_statusFilter<"intervention"> | $Enums.intervention_status
    teacher_id?: StringNullableFilter<"intervention"> | string | null
    notes?: StringNullableFilter<"intervention"> | string | null
    created_at?: DateTimeFilter<"intervention"> | Date | string
    resolved_at?: DateTimeNullableFilter<"intervention"> | Date | string | null
    skill?: XOR<SkillRelationFilter, skillWhereInput>
    notes_list?: Intervention_noteListRelationFilter
  }, "id">

  export type interventionOrderByWithAggregationInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    teacher_id?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    created_at?: SortOrder
    resolved_at?: SortOrderInput | SortOrder
    _count?: interventionCountOrderByAggregateInput
    _avg?: interventionAvgOrderByAggregateInput
    _max?: interventionMaxOrderByAggregateInput
    _min?: interventionMinOrderByAggregateInput
    _sum?: interventionSumOrderByAggregateInput
  }

  export type interventionScalarWhereWithAggregatesInput = {
    AND?: interventionScalarWhereWithAggregatesInput | interventionScalarWhereWithAggregatesInput[]
    OR?: interventionScalarWhereWithAggregatesInput[]
    NOT?: interventionScalarWhereWithAggregatesInput | interventionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"intervention"> | string
    student_id?: StringWithAggregatesFilter<"intervention"> | string
    skill_id?: StringWithAggregatesFilter<"intervention"> | string
    priority?: IntWithAggregatesFilter<"intervention"> | number
    status?: Enumintervention_statusWithAggregatesFilter<"intervention"> | $Enums.intervention_status
    teacher_id?: StringNullableWithAggregatesFilter<"intervention"> | string | null
    notes?: StringNullableWithAggregatesFilter<"intervention"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"intervention"> | Date | string
    resolved_at?: DateTimeNullableWithAggregatesFilter<"intervention"> | Date | string | null
  }

  export type intervention_noteWhereInput = {
    AND?: intervention_noteWhereInput | intervention_noteWhereInput[]
    OR?: intervention_noteWhereInput[]
    NOT?: intervention_noteWhereInput | intervention_noteWhereInput[]
    id?: StringFilter<"intervention_note"> | string
    intervention_id?: StringFilter<"intervention_note"> | string
    teacher_id?: StringFilter<"intervention_note"> | string
    content?: StringFilter<"intervention_note"> | string
    created_at?: DateTimeFilter<"intervention_note"> | Date | string
    intervention?: XOR<InterventionRelationFilter, interventionWhereInput>
  }

  export type intervention_noteOrderByWithRelationInput = {
    id?: SortOrder
    intervention_id?: SortOrder
    teacher_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    intervention?: interventionOrderByWithRelationInput
  }

  export type intervention_noteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: intervention_noteWhereInput | intervention_noteWhereInput[]
    OR?: intervention_noteWhereInput[]
    NOT?: intervention_noteWhereInput | intervention_noteWhereInput[]
    intervention_id?: StringFilter<"intervention_note"> | string
    teacher_id?: StringFilter<"intervention_note"> | string
    content?: StringFilter<"intervention_note"> | string
    created_at?: DateTimeFilter<"intervention_note"> | Date | string
    intervention?: XOR<InterventionRelationFilter, interventionWhereInput>
  }, "id">

  export type intervention_noteOrderByWithAggregationInput = {
    id?: SortOrder
    intervention_id?: SortOrder
    teacher_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    _count?: intervention_noteCountOrderByAggregateInput
    _max?: intervention_noteMaxOrderByAggregateInput
    _min?: intervention_noteMinOrderByAggregateInput
  }

  export type intervention_noteScalarWhereWithAggregatesInput = {
    AND?: intervention_noteScalarWhereWithAggregatesInput | intervention_noteScalarWhereWithAggregatesInput[]
    OR?: intervention_noteScalarWhereWithAggregatesInput[]
    NOT?: intervention_noteScalarWhereWithAggregatesInput | intervention_noteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"intervention_note"> | string
    intervention_id?: StringWithAggregatesFilter<"intervention_note"> | string
    teacher_id?: StringWithAggregatesFilter<"intervention_note"> | string
    content?: StringWithAggregatesFilter<"intervention_note"> | string
    created_at?: DateTimeWithAggregatesFilter<"intervention_note"> | Date | string
  }

  export type skillCreateInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: skillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    diagnoses?: diagnosisCreateNestedManyWithoutSkillInput
    interventions?: interventionCreateNestedManyWithoutSkillInput
  }

  export type skillUncheckedCreateInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: skillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    diagnoses?: diagnosisUncheckedCreateNestedManyWithoutSkillInput
    interventions?: interventionUncheckedCreateNestedManyWithoutSkillInput
  }

  export type skillUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: skillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: diagnosisUpdateManyWithoutSkillNestedInput
    interventions?: interventionUpdateManyWithoutSkillNestedInput
  }

  export type skillUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: skillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: diagnosisUncheckedUpdateManyWithoutSkillNestedInput
    interventions?: interventionUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type skillCreateManyInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: skillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type skillUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: skillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type skillUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: skillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type diagnosisCreateInput = {
    id?: string
    student_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.diagnosis_status
    created_at?: Date | string
    updated_at?: Date | string
    skill: skillCreateNestedOneWithoutDiagnosesInput
    evidence?: evidenceCreateNestedManyWithoutDiagnosisInput
  }

  export type diagnosisUncheckedCreateInput = {
    id?: string
    student_id: string
    skill_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.diagnosis_status
    created_at?: Date | string
    updated_at?: Date | string
    evidence?: evidenceUncheckedCreateNestedManyWithoutDiagnosisInput
  }

  export type diagnosisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: Enumdiagnosis_statusFieldUpdateOperationsInput | $Enums.diagnosis_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    skill?: skillUpdateOneRequiredWithoutDiagnosesNestedInput
    evidence?: evidenceUpdateManyWithoutDiagnosisNestedInput
  }

  export type diagnosisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: Enumdiagnosis_statusFieldUpdateOperationsInput | $Enums.diagnosis_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: evidenceUncheckedUpdateManyWithoutDiagnosisNestedInput
  }

  export type diagnosisCreateManyInput = {
    id?: string
    student_id: string
    skill_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.diagnosis_status
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type diagnosisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: Enumdiagnosis_statusFieldUpdateOperationsInput | $Enums.diagnosis_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type diagnosisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: Enumdiagnosis_statusFieldUpdateOperationsInput | $Enums.diagnosis_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type evidenceCreateInput = {
    id?: string
    item_id: string
    extracted_answer?: string | null
    correct?: boolean | null
    confidence?: number
    quality?: $Enums.evidence_quality
    created_at?: Date | string
    diagnosis: diagnosisCreateNestedOneWithoutEvidenceInput
  }

  export type evidenceUncheckedCreateInput = {
    id?: string
    diagnosis_id: string
    item_id: string
    extracted_answer?: string | null
    correct?: boolean | null
    confidence?: number
    quality?: $Enums.evidence_quality
    created_at?: Date | string
  }

  export type evidenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: Enumevidence_qualityFieldUpdateOperationsInput | $Enums.evidence_quality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnosis?: diagnosisUpdateOneRequiredWithoutEvidenceNestedInput
  }

  export type evidenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    diagnosis_id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: Enumevidence_qualityFieldUpdateOperationsInput | $Enums.evidence_quality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type evidenceCreateManyInput = {
    id?: string
    diagnosis_id: string
    item_id: string
    extracted_answer?: string | null
    correct?: boolean | null
    confidence?: number
    quality?: $Enums.evidence_quality
    created_at?: Date | string
  }

  export type evidenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: Enumevidence_qualityFieldUpdateOperationsInput | $Enums.evidence_quality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type evidenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    diagnosis_id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: Enumevidence_qualityFieldUpdateOperationsInput | $Enums.evidence_quality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type interventionCreateInput = {
    id?: string
    student_id: string
    priority?: number
    status?: $Enums.intervention_status
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
    skill: skillCreateNestedOneWithoutInterventionsInput
    notes_list?: intervention_noteCreateNestedManyWithoutInterventionInput
  }

  export type interventionUncheckedCreateInput = {
    id?: string
    student_id: string
    skill_id: string
    priority?: number
    status?: $Enums.intervention_status
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
    notes_list?: intervention_noteUncheckedCreateNestedManyWithoutInterventionInput
  }

  export type interventionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: Enumintervention_statusFieldUpdateOperationsInput | $Enums.intervention_status
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    skill?: skillUpdateOneRequiredWithoutInterventionsNestedInput
    notes_list?: intervention_noteUpdateManyWithoutInterventionNestedInput
  }

  export type interventionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: Enumintervention_statusFieldUpdateOperationsInput | $Enums.intervention_status
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes_list?: intervention_noteUncheckedUpdateManyWithoutInterventionNestedInput
  }

  export type interventionCreateManyInput = {
    id?: string
    student_id: string
    skill_id: string
    priority?: number
    status?: $Enums.intervention_status
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
  }

  export type interventionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: Enumintervention_statusFieldUpdateOperationsInput | $Enums.intervention_status
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type interventionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: Enumintervention_statusFieldUpdateOperationsInput | $Enums.intervention_status
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type intervention_noteCreateInput = {
    id?: string
    teacher_id: string
    content: string
    created_at?: Date | string
    intervention: interventionCreateNestedOneWithoutNotes_listInput
  }

  export type intervention_noteUncheckedCreateInput = {
    id?: string
    intervention_id: string
    teacher_id: string
    content: string
    created_at?: Date | string
  }

  export type intervention_noteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    intervention?: interventionUpdateOneRequiredWithoutNotes_listNestedInput
  }

  export type intervention_noteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    intervention_id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type intervention_noteCreateManyInput = {
    id?: string
    intervention_id: string
    teacher_id: string
    content: string
    created_at?: Date | string
  }

  export type intervention_noteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type intervention_noteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    intervention_id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type DiagnosisListRelationFilter = {
    every?: diagnosisWhereInput
    some?: diagnosisWhereInput
    none?: diagnosisWhereInput
  }

  export type InterventionListRelationFilter = {
    every?: interventionWhereInput
    some?: interventionWhereInput
    none?: interventionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type diagnosisOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type interventionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type skillCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    prereq_skills?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type skillAvgOrderByAggregateInput = {
    difficulty?: SortOrder
  }

  export type skillMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type skillMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type skillSumOrderByAggregateInput = {
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

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type Enumdiagnosis_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.diagnosis_status | Enumdiagnosis_statusFieldRefInput<$PrismaModel>
    in?: $Enums.diagnosis_status[] | ListEnumdiagnosis_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.diagnosis_status[] | ListEnumdiagnosis_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumdiagnosis_statusFilter<$PrismaModel> | $Enums.diagnosis_status
  }

  export type SkillRelationFilter = {
    is?: skillWhereInput
    isNot?: skillWhereInput
  }

  export type EvidenceListRelationFilter = {
    every?: evidenceWhereInput
    some?: evidenceWhereInput
    none?: evidenceWhereInput
  }

  export type evidenceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type diagnosisCountOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    p_known?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type diagnosisAvgOrderByAggregateInput = {
    p_known?: SortOrder
    confidence?: SortOrder
  }

  export type diagnosisMaxOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    p_known?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type diagnosisMinOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    p_known?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type diagnosisSumOrderByAggregateInput = {
    p_known?: SortOrder
    confidence?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type Enumdiagnosis_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.diagnosis_status | Enumdiagnosis_statusFieldRefInput<$PrismaModel>
    in?: $Enums.diagnosis_status[] | ListEnumdiagnosis_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.diagnosis_status[] | ListEnumdiagnosis_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumdiagnosis_statusWithAggregatesFilter<$PrismaModel> | $Enums.diagnosis_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumdiagnosis_statusFilter<$PrismaModel>
    _max?: NestedEnumdiagnosis_statusFilter<$PrismaModel>
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type Enumevidence_qualityFilter<$PrismaModel = never> = {
    equals?: $Enums.evidence_quality | Enumevidence_qualityFieldRefInput<$PrismaModel>
    in?: $Enums.evidence_quality[] | ListEnumevidence_qualityFieldRefInput<$PrismaModel>
    notIn?: $Enums.evidence_quality[] | ListEnumevidence_qualityFieldRefInput<$PrismaModel>
    not?: NestedEnumevidence_qualityFilter<$PrismaModel> | $Enums.evidence_quality
  }

  export type DiagnosisRelationFilter = {
    is?: diagnosisWhereInput
    isNot?: diagnosisWhereInput
  }

  export type evidenceCountOrderByAggregateInput = {
    id?: SortOrder
    diagnosis_id?: SortOrder
    item_id?: SortOrder
    extracted_answer?: SortOrder
    correct?: SortOrder
    confidence?: SortOrder
    quality?: SortOrder
    created_at?: SortOrder
  }

  export type evidenceAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type evidenceMaxOrderByAggregateInput = {
    id?: SortOrder
    diagnosis_id?: SortOrder
    item_id?: SortOrder
    extracted_answer?: SortOrder
    correct?: SortOrder
    confidence?: SortOrder
    quality?: SortOrder
    created_at?: SortOrder
  }

  export type evidenceMinOrderByAggregateInput = {
    id?: SortOrder
    diagnosis_id?: SortOrder
    item_id?: SortOrder
    extracted_answer?: SortOrder
    correct?: SortOrder
    confidence?: SortOrder
    quality?: SortOrder
    created_at?: SortOrder
  }

  export type evidenceSumOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type Enumevidence_qualityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.evidence_quality | Enumevidence_qualityFieldRefInput<$PrismaModel>
    in?: $Enums.evidence_quality[] | ListEnumevidence_qualityFieldRefInput<$PrismaModel>
    notIn?: $Enums.evidence_quality[] | ListEnumevidence_qualityFieldRefInput<$PrismaModel>
    not?: NestedEnumevidence_qualityWithAggregatesFilter<$PrismaModel> | $Enums.evidence_quality
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumevidence_qualityFilter<$PrismaModel>
    _max?: NestedEnumevidence_qualityFilter<$PrismaModel>
  }

  export type Enumintervention_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.intervention_status | Enumintervention_statusFieldRefInput<$PrismaModel>
    in?: $Enums.intervention_status[] | ListEnumintervention_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.intervention_status[] | ListEnumintervention_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumintervention_statusFilter<$PrismaModel> | $Enums.intervention_status
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

  export type Intervention_noteListRelationFilter = {
    every?: intervention_noteWhereInput
    some?: intervention_noteWhereInput
    none?: intervention_noteWhereInput
  }

  export type intervention_noteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type interventionCountOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    teacher_id?: SortOrder
    notes?: SortOrder
    created_at?: SortOrder
    resolved_at?: SortOrder
  }

  export type interventionAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type interventionMaxOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    teacher_id?: SortOrder
    notes?: SortOrder
    created_at?: SortOrder
    resolved_at?: SortOrder
  }

  export type interventionMinOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    teacher_id?: SortOrder
    notes?: SortOrder
    created_at?: SortOrder
    resolved_at?: SortOrder
  }

  export type interventionSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type Enumintervention_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.intervention_status | Enumintervention_statusFieldRefInput<$PrismaModel>
    in?: $Enums.intervention_status[] | ListEnumintervention_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.intervention_status[] | ListEnumintervention_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumintervention_statusWithAggregatesFilter<$PrismaModel> | $Enums.intervention_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumintervention_statusFilter<$PrismaModel>
    _max?: NestedEnumintervention_statusFilter<$PrismaModel>
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

  export type InterventionRelationFilter = {
    is?: interventionWhereInput
    isNot?: interventionWhereInput
  }

  export type intervention_noteCountOrderByAggregateInput = {
    id?: SortOrder
    intervention_id?: SortOrder
    teacher_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
  }

  export type intervention_noteMaxOrderByAggregateInput = {
    id?: SortOrder
    intervention_id?: SortOrder
    teacher_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
  }

  export type intervention_noteMinOrderByAggregateInput = {
    id?: SortOrder
    intervention_id?: SortOrder
    teacher_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
  }

  export type skillCreateprereq_skillsInput = {
    set: string[]
  }

  export type diagnosisCreateNestedManyWithoutSkillInput = {
    create?: XOR<diagnosisCreateWithoutSkillInput, diagnosisUncheckedCreateWithoutSkillInput> | diagnosisCreateWithoutSkillInput[] | diagnosisUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: diagnosisCreateOrConnectWithoutSkillInput | diagnosisCreateOrConnectWithoutSkillInput[]
    createMany?: diagnosisCreateManySkillInputEnvelope
    connect?: diagnosisWhereUniqueInput | diagnosisWhereUniqueInput[]
  }

  export type interventionCreateNestedManyWithoutSkillInput = {
    create?: XOR<interventionCreateWithoutSkillInput, interventionUncheckedCreateWithoutSkillInput> | interventionCreateWithoutSkillInput[] | interventionUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: interventionCreateOrConnectWithoutSkillInput | interventionCreateOrConnectWithoutSkillInput[]
    createMany?: interventionCreateManySkillInputEnvelope
    connect?: interventionWhereUniqueInput | interventionWhereUniqueInput[]
  }

  export type diagnosisUncheckedCreateNestedManyWithoutSkillInput = {
    create?: XOR<diagnosisCreateWithoutSkillInput, diagnosisUncheckedCreateWithoutSkillInput> | diagnosisCreateWithoutSkillInput[] | diagnosisUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: diagnosisCreateOrConnectWithoutSkillInput | diagnosisCreateOrConnectWithoutSkillInput[]
    createMany?: diagnosisCreateManySkillInputEnvelope
    connect?: diagnosisWhereUniqueInput | diagnosisWhereUniqueInput[]
  }

  export type interventionUncheckedCreateNestedManyWithoutSkillInput = {
    create?: XOR<interventionCreateWithoutSkillInput, interventionUncheckedCreateWithoutSkillInput> | interventionCreateWithoutSkillInput[] | interventionUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: interventionCreateOrConnectWithoutSkillInput | interventionCreateOrConnectWithoutSkillInput[]
    createMany?: interventionCreateManySkillInputEnvelope
    connect?: interventionWhereUniqueInput | interventionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
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

  export type skillUpdateprereq_skillsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type diagnosisUpdateManyWithoutSkillNestedInput = {
    create?: XOR<diagnosisCreateWithoutSkillInput, diagnosisUncheckedCreateWithoutSkillInput> | diagnosisCreateWithoutSkillInput[] | diagnosisUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: diagnosisCreateOrConnectWithoutSkillInput | diagnosisCreateOrConnectWithoutSkillInput[]
    upsert?: diagnosisUpsertWithWhereUniqueWithoutSkillInput | diagnosisUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: diagnosisCreateManySkillInputEnvelope
    set?: diagnosisWhereUniqueInput | diagnosisWhereUniqueInput[]
    disconnect?: diagnosisWhereUniqueInput | diagnosisWhereUniqueInput[]
    delete?: diagnosisWhereUniqueInput | diagnosisWhereUniqueInput[]
    connect?: diagnosisWhereUniqueInput | diagnosisWhereUniqueInput[]
    update?: diagnosisUpdateWithWhereUniqueWithoutSkillInput | diagnosisUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: diagnosisUpdateManyWithWhereWithoutSkillInput | diagnosisUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: diagnosisScalarWhereInput | diagnosisScalarWhereInput[]
  }

  export type interventionUpdateManyWithoutSkillNestedInput = {
    create?: XOR<interventionCreateWithoutSkillInput, interventionUncheckedCreateWithoutSkillInput> | interventionCreateWithoutSkillInput[] | interventionUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: interventionCreateOrConnectWithoutSkillInput | interventionCreateOrConnectWithoutSkillInput[]
    upsert?: interventionUpsertWithWhereUniqueWithoutSkillInput | interventionUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: interventionCreateManySkillInputEnvelope
    set?: interventionWhereUniqueInput | interventionWhereUniqueInput[]
    disconnect?: interventionWhereUniqueInput | interventionWhereUniqueInput[]
    delete?: interventionWhereUniqueInput | interventionWhereUniqueInput[]
    connect?: interventionWhereUniqueInput | interventionWhereUniqueInput[]
    update?: interventionUpdateWithWhereUniqueWithoutSkillInput | interventionUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: interventionUpdateManyWithWhereWithoutSkillInput | interventionUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: interventionScalarWhereInput | interventionScalarWhereInput[]
  }

  export type diagnosisUncheckedUpdateManyWithoutSkillNestedInput = {
    create?: XOR<diagnosisCreateWithoutSkillInput, diagnosisUncheckedCreateWithoutSkillInput> | diagnosisCreateWithoutSkillInput[] | diagnosisUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: diagnosisCreateOrConnectWithoutSkillInput | diagnosisCreateOrConnectWithoutSkillInput[]
    upsert?: diagnosisUpsertWithWhereUniqueWithoutSkillInput | diagnosisUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: diagnosisCreateManySkillInputEnvelope
    set?: diagnosisWhereUniqueInput | diagnosisWhereUniqueInput[]
    disconnect?: diagnosisWhereUniqueInput | diagnosisWhereUniqueInput[]
    delete?: diagnosisWhereUniqueInput | diagnosisWhereUniqueInput[]
    connect?: diagnosisWhereUniqueInput | diagnosisWhereUniqueInput[]
    update?: diagnosisUpdateWithWhereUniqueWithoutSkillInput | diagnosisUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: diagnosisUpdateManyWithWhereWithoutSkillInput | diagnosisUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: diagnosisScalarWhereInput | diagnosisScalarWhereInput[]
  }

  export type interventionUncheckedUpdateManyWithoutSkillNestedInput = {
    create?: XOR<interventionCreateWithoutSkillInput, interventionUncheckedCreateWithoutSkillInput> | interventionCreateWithoutSkillInput[] | interventionUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: interventionCreateOrConnectWithoutSkillInput | interventionCreateOrConnectWithoutSkillInput[]
    upsert?: interventionUpsertWithWhereUniqueWithoutSkillInput | interventionUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: interventionCreateManySkillInputEnvelope
    set?: interventionWhereUniqueInput | interventionWhereUniqueInput[]
    disconnect?: interventionWhereUniqueInput | interventionWhereUniqueInput[]
    delete?: interventionWhereUniqueInput | interventionWhereUniqueInput[]
    connect?: interventionWhereUniqueInput | interventionWhereUniqueInput[]
    update?: interventionUpdateWithWhereUniqueWithoutSkillInput | interventionUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: interventionUpdateManyWithWhereWithoutSkillInput | interventionUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: interventionScalarWhereInput | interventionScalarWhereInput[]
  }

  export type skillCreateNestedOneWithoutDiagnosesInput = {
    create?: XOR<skillCreateWithoutDiagnosesInput, skillUncheckedCreateWithoutDiagnosesInput>
    connectOrCreate?: skillCreateOrConnectWithoutDiagnosesInput
    connect?: skillWhereUniqueInput
  }

  export type evidenceCreateNestedManyWithoutDiagnosisInput = {
    create?: XOR<evidenceCreateWithoutDiagnosisInput, evidenceUncheckedCreateWithoutDiagnosisInput> | evidenceCreateWithoutDiagnosisInput[] | evidenceUncheckedCreateWithoutDiagnosisInput[]
    connectOrCreate?: evidenceCreateOrConnectWithoutDiagnosisInput | evidenceCreateOrConnectWithoutDiagnosisInput[]
    createMany?: evidenceCreateManyDiagnosisInputEnvelope
    connect?: evidenceWhereUniqueInput | evidenceWhereUniqueInput[]
  }

  export type evidenceUncheckedCreateNestedManyWithoutDiagnosisInput = {
    create?: XOR<evidenceCreateWithoutDiagnosisInput, evidenceUncheckedCreateWithoutDiagnosisInput> | evidenceCreateWithoutDiagnosisInput[] | evidenceUncheckedCreateWithoutDiagnosisInput[]
    connectOrCreate?: evidenceCreateOrConnectWithoutDiagnosisInput | evidenceCreateOrConnectWithoutDiagnosisInput[]
    createMany?: evidenceCreateManyDiagnosisInputEnvelope
    connect?: evidenceWhereUniqueInput | evidenceWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type Enumdiagnosis_statusFieldUpdateOperationsInput = {
    set?: $Enums.diagnosis_status
  }

  export type skillUpdateOneRequiredWithoutDiagnosesNestedInput = {
    create?: XOR<skillCreateWithoutDiagnosesInput, skillUncheckedCreateWithoutDiagnosesInput>
    connectOrCreate?: skillCreateOrConnectWithoutDiagnosesInput
    upsert?: skillUpsertWithoutDiagnosesInput
    connect?: skillWhereUniqueInput
    update?: XOR<XOR<skillUpdateToOneWithWhereWithoutDiagnosesInput, skillUpdateWithoutDiagnosesInput>, skillUncheckedUpdateWithoutDiagnosesInput>
  }

  export type evidenceUpdateManyWithoutDiagnosisNestedInput = {
    create?: XOR<evidenceCreateWithoutDiagnosisInput, evidenceUncheckedCreateWithoutDiagnosisInput> | evidenceCreateWithoutDiagnosisInput[] | evidenceUncheckedCreateWithoutDiagnosisInput[]
    connectOrCreate?: evidenceCreateOrConnectWithoutDiagnosisInput | evidenceCreateOrConnectWithoutDiagnosisInput[]
    upsert?: evidenceUpsertWithWhereUniqueWithoutDiagnosisInput | evidenceUpsertWithWhereUniqueWithoutDiagnosisInput[]
    createMany?: evidenceCreateManyDiagnosisInputEnvelope
    set?: evidenceWhereUniqueInput | evidenceWhereUniqueInput[]
    disconnect?: evidenceWhereUniqueInput | evidenceWhereUniqueInput[]
    delete?: evidenceWhereUniqueInput | evidenceWhereUniqueInput[]
    connect?: evidenceWhereUniqueInput | evidenceWhereUniqueInput[]
    update?: evidenceUpdateWithWhereUniqueWithoutDiagnosisInput | evidenceUpdateWithWhereUniqueWithoutDiagnosisInput[]
    updateMany?: evidenceUpdateManyWithWhereWithoutDiagnosisInput | evidenceUpdateManyWithWhereWithoutDiagnosisInput[]
    deleteMany?: evidenceScalarWhereInput | evidenceScalarWhereInput[]
  }

  export type evidenceUncheckedUpdateManyWithoutDiagnosisNestedInput = {
    create?: XOR<evidenceCreateWithoutDiagnosisInput, evidenceUncheckedCreateWithoutDiagnosisInput> | evidenceCreateWithoutDiagnosisInput[] | evidenceUncheckedCreateWithoutDiagnosisInput[]
    connectOrCreate?: evidenceCreateOrConnectWithoutDiagnosisInput | evidenceCreateOrConnectWithoutDiagnosisInput[]
    upsert?: evidenceUpsertWithWhereUniqueWithoutDiagnosisInput | evidenceUpsertWithWhereUniqueWithoutDiagnosisInput[]
    createMany?: evidenceCreateManyDiagnosisInputEnvelope
    set?: evidenceWhereUniqueInput | evidenceWhereUniqueInput[]
    disconnect?: evidenceWhereUniqueInput | evidenceWhereUniqueInput[]
    delete?: evidenceWhereUniqueInput | evidenceWhereUniqueInput[]
    connect?: evidenceWhereUniqueInput | evidenceWhereUniqueInput[]
    update?: evidenceUpdateWithWhereUniqueWithoutDiagnosisInput | evidenceUpdateWithWhereUniqueWithoutDiagnosisInput[]
    updateMany?: evidenceUpdateManyWithWhereWithoutDiagnosisInput | evidenceUpdateManyWithWhereWithoutDiagnosisInput[]
    deleteMany?: evidenceScalarWhereInput | evidenceScalarWhereInput[]
  }

  export type diagnosisCreateNestedOneWithoutEvidenceInput = {
    create?: XOR<diagnosisCreateWithoutEvidenceInput, diagnosisUncheckedCreateWithoutEvidenceInput>
    connectOrCreate?: diagnosisCreateOrConnectWithoutEvidenceInput
    connect?: diagnosisWhereUniqueInput
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type Enumevidence_qualityFieldUpdateOperationsInput = {
    set?: $Enums.evidence_quality
  }

  export type diagnosisUpdateOneRequiredWithoutEvidenceNestedInput = {
    create?: XOR<diagnosisCreateWithoutEvidenceInput, diagnosisUncheckedCreateWithoutEvidenceInput>
    connectOrCreate?: diagnosisCreateOrConnectWithoutEvidenceInput
    upsert?: diagnosisUpsertWithoutEvidenceInput
    connect?: diagnosisWhereUniqueInput
    update?: XOR<XOR<diagnosisUpdateToOneWithWhereWithoutEvidenceInput, diagnosisUpdateWithoutEvidenceInput>, diagnosisUncheckedUpdateWithoutEvidenceInput>
  }

  export type skillCreateNestedOneWithoutInterventionsInput = {
    create?: XOR<skillCreateWithoutInterventionsInput, skillUncheckedCreateWithoutInterventionsInput>
    connectOrCreate?: skillCreateOrConnectWithoutInterventionsInput
    connect?: skillWhereUniqueInput
  }

  export type intervention_noteCreateNestedManyWithoutInterventionInput = {
    create?: XOR<intervention_noteCreateWithoutInterventionInput, intervention_noteUncheckedCreateWithoutInterventionInput> | intervention_noteCreateWithoutInterventionInput[] | intervention_noteUncheckedCreateWithoutInterventionInput[]
    connectOrCreate?: intervention_noteCreateOrConnectWithoutInterventionInput | intervention_noteCreateOrConnectWithoutInterventionInput[]
    createMany?: intervention_noteCreateManyInterventionInputEnvelope
    connect?: intervention_noteWhereUniqueInput | intervention_noteWhereUniqueInput[]
  }

  export type intervention_noteUncheckedCreateNestedManyWithoutInterventionInput = {
    create?: XOR<intervention_noteCreateWithoutInterventionInput, intervention_noteUncheckedCreateWithoutInterventionInput> | intervention_noteCreateWithoutInterventionInput[] | intervention_noteUncheckedCreateWithoutInterventionInput[]
    connectOrCreate?: intervention_noteCreateOrConnectWithoutInterventionInput | intervention_noteCreateOrConnectWithoutInterventionInput[]
    createMany?: intervention_noteCreateManyInterventionInputEnvelope
    connect?: intervention_noteWhereUniqueInput | intervention_noteWhereUniqueInput[]
  }

  export type Enumintervention_statusFieldUpdateOperationsInput = {
    set?: $Enums.intervention_status
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type skillUpdateOneRequiredWithoutInterventionsNestedInput = {
    create?: XOR<skillCreateWithoutInterventionsInput, skillUncheckedCreateWithoutInterventionsInput>
    connectOrCreate?: skillCreateOrConnectWithoutInterventionsInput
    upsert?: skillUpsertWithoutInterventionsInput
    connect?: skillWhereUniqueInput
    update?: XOR<XOR<skillUpdateToOneWithWhereWithoutInterventionsInput, skillUpdateWithoutInterventionsInput>, skillUncheckedUpdateWithoutInterventionsInput>
  }

  export type intervention_noteUpdateManyWithoutInterventionNestedInput = {
    create?: XOR<intervention_noteCreateWithoutInterventionInput, intervention_noteUncheckedCreateWithoutInterventionInput> | intervention_noteCreateWithoutInterventionInput[] | intervention_noteUncheckedCreateWithoutInterventionInput[]
    connectOrCreate?: intervention_noteCreateOrConnectWithoutInterventionInput | intervention_noteCreateOrConnectWithoutInterventionInput[]
    upsert?: intervention_noteUpsertWithWhereUniqueWithoutInterventionInput | intervention_noteUpsertWithWhereUniqueWithoutInterventionInput[]
    createMany?: intervention_noteCreateManyInterventionInputEnvelope
    set?: intervention_noteWhereUniqueInput | intervention_noteWhereUniqueInput[]
    disconnect?: intervention_noteWhereUniqueInput | intervention_noteWhereUniqueInput[]
    delete?: intervention_noteWhereUniqueInput | intervention_noteWhereUniqueInput[]
    connect?: intervention_noteWhereUniqueInput | intervention_noteWhereUniqueInput[]
    update?: intervention_noteUpdateWithWhereUniqueWithoutInterventionInput | intervention_noteUpdateWithWhereUniqueWithoutInterventionInput[]
    updateMany?: intervention_noteUpdateManyWithWhereWithoutInterventionInput | intervention_noteUpdateManyWithWhereWithoutInterventionInput[]
    deleteMany?: intervention_noteScalarWhereInput | intervention_noteScalarWhereInput[]
  }

  export type intervention_noteUncheckedUpdateManyWithoutInterventionNestedInput = {
    create?: XOR<intervention_noteCreateWithoutInterventionInput, intervention_noteUncheckedCreateWithoutInterventionInput> | intervention_noteCreateWithoutInterventionInput[] | intervention_noteUncheckedCreateWithoutInterventionInput[]
    connectOrCreate?: intervention_noteCreateOrConnectWithoutInterventionInput | intervention_noteCreateOrConnectWithoutInterventionInput[]
    upsert?: intervention_noteUpsertWithWhereUniqueWithoutInterventionInput | intervention_noteUpsertWithWhereUniqueWithoutInterventionInput[]
    createMany?: intervention_noteCreateManyInterventionInputEnvelope
    set?: intervention_noteWhereUniqueInput | intervention_noteWhereUniqueInput[]
    disconnect?: intervention_noteWhereUniqueInput | intervention_noteWhereUniqueInput[]
    delete?: intervention_noteWhereUniqueInput | intervention_noteWhereUniqueInput[]
    connect?: intervention_noteWhereUniqueInput | intervention_noteWhereUniqueInput[]
    update?: intervention_noteUpdateWithWhereUniqueWithoutInterventionInput | intervention_noteUpdateWithWhereUniqueWithoutInterventionInput[]
    updateMany?: intervention_noteUpdateManyWithWhereWithoutInterventionInput | intervention_noteUpdateManyWithWhereWithoutInterventionInput[]
    deleteMany?: intervention_noteScalarWhereInput | intervention_noteScalarWhereInput[]
  }

  export type interventionCreateNestedOneWithoutNotes_listInput = {
    create?: XOR<interventionCreateWithoutNotes_listInput, interventionUncheckedCreateWithoutNotes_listInput>
    connectOrCreate?: interventionCreateOrConnectWithoutNotes_listInput
    connect?: interventionWhereUniqueInput
  }

  export type interventionUpdateOneRequiredWithoutNotes_listNestedInput = {
    create?: XOR<interventionCreateWithoutNotes_listInput, interventionUncheckedCreateWithoutNotes_listInput>
    connectOrCreate?: interventionCreateOrConnectWithoutNotes_listInput
    upsert?: interventionUpsertWithoutNotes_listInput
    connect?: interventionWhereUniqueInput
    update?: XOR<XOR<interventionUpdateToOneWithWhereWithoutNotes_listInput, interventionUpdateWithoutNotes_listInput>, interventionUncheckedUpdateWithoutNotes_listInput>
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

  export type NestedEnumdiagnosis_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.diagnosis_status | Enumdiagnosis_statusFieldRefInput<$PrismaModel>
    in?: $Enums.diagnosis_status[] | ListEnumdiagnosis_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.diagnosis_status[] | ListEnumdiagnosis_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumdiagnosis_statusFilter<$PrismaModel> | $Enums.diagnosis_status
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumdiagnosis_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.diagnosis_status | Enumdiagnosis_statusFieldRefInput<$PrismaModel>
    in?: $Enums.diagnosis_status[] | ListEnumdiagnosis_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.diagnosis_status[] | ListEnumdiagnosis_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumdiagnosis_statusWithAggregatesFilter<$PrismaModel> | $Enums.diagnosis_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumdiagnosis_statusFilter<$PrismaModel>
    _max?: NestedEnumdiagnosis_statusFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedEnumevidence_qualityFilter<$PrismaModel = never> = {
    equals?: $Enums.evidence_quality | Enumevidence_qualityFieldRefInput<$PrismaModel>
    in?: $Enums.evidence_quality[] | ListEnumevidence_qualityFieldRefInput<$PrismaModel>
    notIn?: $Enums.evidence_quality[] | ListEnumevidence_qualityFieldRefInput<$PrismaModel>
    not?: NestedEnumevidence_qualityFilter<$PrismaModel> | $Enums.evidence_quality
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumevidence_qualityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.evidence_quality | Enumevidence_qualityFieldRefInput<$PrismaModel>
    in?: $Enums.evidence_quality[] | ListEnumevidence_qualityFieldRefInput<$PrismaModel>
    notIn?: $Enums.evidence_quality[] | ListEnumevidence_qualityFieldRefInput<$PrismaModel>
    not?: NestedEnumevidence_qualityWithAggregatesFilter<$PrismaModel> | $Enums.evidence_quality
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumevidence_qualityFilter<$PrismaModel>
    _max?: NestedEnumevidence_qualityFilter<$PrismaModel>
  }

  export type NestedEnumintervention_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.intervention_status | Enumintervention_statusFieldRefInput<$PrismaModel>
    in?: $Enums.intervention_status[] | ListEnumintervention_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.intervention_status[] | ListEnumintervention_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumintervention_statusFilter<$PrismaModel> | $Enums.intervention_status
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

  export type NestedEnumintervention_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.intervention_status | Enumintervention_statusFieldRefInput<$PrismaModel>
    in?: $Enums.intervention_status[] | ListEnumintervention_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.intervention_status[] | ListEnumintervention_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumintervention_statusWithAggregatesFilter<$PrismaModel> | $Enums.intervention_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumintervention_statusFilter<$PrismaModel>
    _max?: NestedEnumintervention_statusFilter<$PrismaModel>
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

  export type diagnosisCreateWithoutSkillInput = {
    id?: string
    student_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.diagnosis_status
    created_at?: Date | string
    updated_at?: Date | string
    evidence?: evidenceCreateNestedManyWithoutDiagnosisInput
  }

  export type diagnosisUncheckedCreateWithoutSkillInput = {
    id?: string
    student_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.diagnosis_status
    created_at?: Date | string
    updated_at?: Date | string
    evidence?: evidenceUncheckedCreateNestedManyWithoutDiagnosisInput
  }

  export type diagnosisCreateOrConnectWithoutSkillInput = {
    where: diagnosisWhereUniqueInput
    create: XOR<diagnosisCreateWithoutSkillInput, diagnosisUncheckedCreateWithoutSkillInput>
  }

  export type diagnosisCreateManySkillInputEnvelope = {
    data: diagnosisCreateManySkillInput | diagnosisCreateManySkillInput[]
    skipDuplicates?: boolean
  }

  export type interventionCreateWithoutSkillInput = {
    id?: string
    student_id: string
    priority?: number
    status?: $Enums.intervention_status
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
    notes_list?: intervention_noteCreateNestedManyWithoutInterventionInput
  }

  export type interventionUncheckedCreateWithoutSkillInput = {
    id?: string
    student_id: string
    priority?: number
    status?: $Enums.intervention_status
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
    notes_list?: intervention_noteUncheckedCreateNestedManyWithoutInterventionInput
  }

  export type interventionCreateOrConnectWithoutSkillInput = {
    where: interventionWhereUniqueInput
    create: XOR<interventionCreateWithoutSkillInput, interventionUncheckedCreateWithoutSkillInput>
  }

  export type interventionCreateManySkillInputEnvelope = {
    data: interventionCreateManySkillInput | interventionCreateManySkillInput[]
    skipDuplicates?: boolean
  }

  export type diagnosisUpsertWithWhereUniqueWithoutSkillInput = {
    where: diagnosisWhereUniqueInput
    update: XOR<diagnosisUpdateWithoutSkillInput, diagnosisUncheckedUpdateWithoutSkillInput>
    create: XOR<diagnosisCreateWithoutSkillInput, diagnosisUncheckedCreateWithoutSkillInput>
  }

  export type diagnosisUpdateWithWhereUniqueWithoutSkillInput = {
    where: diagnosisWhereUniqueInput
    data: XOR<diagnosisUpdateWithoutSkillInput, diagnosisUncheckedUpdateWithoutSkillInput>
  }

  export type diagnosisUpdateManyWithWhereWithoutSkillInput = {
    where: diagnosisScalarWhereInput
    data: XOR<diagnosisUpdateManyMutationInput, diagnosisUncheckedUpdateManyWithoutSkillInput>
  }

  export type diagnosisScalarWhereInput = {
    AND?: diagnosisScalarWhereInput | diagnosisScalarWhereInput[]
    OR?: diagnosisScalarWhereInput[]
    NOT?: diagnosisScalarWhereInput | diagnosisScalarWhereInput[]
    id?: StringFilter<"diagnosis"> | string
    student_id?: StringFilter<"diagnosis"> | string
    skill_id?: StringFilter<"diagnosis"> | string
    p_known?: FloatFilter<"diagnosis"> | number
    confidence?: FloatFilter<"diagnosis"> | number
    status?: Enumdiagnosis_statusFilter<"diagnosis"> | $Enums.diagnosis_status
    created_at?: DateTimeFilter<"diagnosis"> | Date | string
    updated_at?: DateTimeFilter<"diagnosis"> | Date | string
  }

  export type interventionUpsertWithWhereUniqueWithoutSkillInput = {
    where: interventionWhereUniqueInput
    update: XOR<interventionUpdateWithoutSkillInput, interventionUncheckedUpdateWithoutSkillInput>
    create: XOR<interventionCreateWithoutSkillInput, interventionUncheckedCreateWithoutSkillInput>
  }

  export type interventionUpdateWithWhereUniqueWithoutSkillInput = {
    where: interventionWhereUniqueInput
    data: XOR<interventionUpdateWithoutSkillInput, interventionUncheckedUpdateWithoutSkillInput>
  }

  export type interventionUpdateManyWithWhereWithoutSkillInput = {
    where: interventionScalarWhereInput
    data: XOR<interventionUpdateManyMutationInput, interventionUncheckedUpdateManyWithoutSkillInput>
  }

  export type interventionScalarWhereInput = {
    AND?: interventionScalarWhereInput | interventionScalarWhereInput[]
    OR?: interventionScalarWhereInput[]
    NOT?: interventionScalarWhereInput | interventionScalarWhereInput[]
    id?: StringFilter<"intervention"> | string
    student_id?: StringFilter<"intervention"> | string
    skill_id?: StringFilter<"intervention"> | string
    priority?: IntFilter<"intervention"> | number
    status?: Enumintervention_statusFilter<"intervention"> | $Enums.intervention_status
    teacher_id?: StringNullableFilter<"intervention"> | string | null
    notes?: StringNullableFilter<"intervention"> | string | null
    created_at?: DateTimeFilter<"intervention"> | Date | string
    resolved_at?: DateTimeNullableFilter<"intervention"> | Date | string | null
  }

  export type skillCreateWithoutDiagnosesInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: skillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    interventions?: interventionCreateNestedManyWithoutSkillInput
  }

  export type skillUncheckedCreateWithoutDiagnosesInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: skillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    interventions?: interventionUncheckedCreateNestedManyWithoutSkillInput
  }

  export type skillCreateOrConnectWithoutDiagnosesInput = {
    where: skillWhereUniqueInput
    create: XOR<skillCreateWithoutDiagnosesInput, skillUncheckedCreateWithoutDiagnosesInput>
  }

  export type evidenceCreateWithoutDiagnosisInput = {
    id?: string
    item_id: string
    extracted_answer?: string | null
    correct?: boolean | null
    confidence?: number
    quality?: $Enums.evidence_quality
    created_at?: Date | string
  }

  export type evidenceUncheckedCreateWithoutDiagnosisInput = {
    id?: string
    item_id: string
    extracted_answer?: string | null
    correct?: boolean | null
    confidence?: number
    quality?: $Enums.evidence_quality
    created_at?: Date | string
  }

  export type evidenceCreateOrConnectWithoutDiagnosisInput = {
    where: evidenceWhereUniqueInput
    create: XOR<evidenceCreateWithoutDiagnosisInput, evidenceUncheckedCreateWithoutDiagnosisInput>
  }

  export type evidenceCreateManyDiagnosisInputEnvelope = {
    data: evidenceCreateManyDiagnosisInput | evidenceCreateManyDiagnosisInput[]
    skipDuplicates?: boolean
  }

  export type skillUpsertWithoutDiagnosesInput = {
    update: XOR<skillUpdateWithoutDiagnosesInput, skillUncheckedUpdateWithoutDiagnosesInput>
    create: XOR<skillCreateWithoutDiagnosesInput, skillUncheckedCreateWithoutDiagnosesInput>
    where?: skillWhereInput
  }

  export type skillUpdateToOneWithWhereWithoutDiagnosesInput = {
    where?: skillWhereInput
    data: XOR<skillUpdateWithoutDiagnosesInput, skillUncheckedUpdateWithoutDiagnosesInput>
  }

  export type skillUpdateWithoutDiagnosesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: skillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    interventions?: interventionUpdateManyWithoutSkillNestedInput
  }

  export type skillUncheckedUpdateWithoutDiagnosesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: skillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    interventions?: interventionUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type evidenceUpsertWithWhereUniqueWithoutDiagnosisInput = {
    where: evidenceWhereUniqueInput
    update: XOR<evidenceUpdateWithoutDiagnosisInput, evidenceUncheckedUpdateWithoutDiagnosisInput>
    create: XOR<evidenceCreateWithoutDiagnosisInput, evidenceUncheckedCreateWithoutDiagnosisInput>
  }

  export type evidenceUpdateWithWhereUniqueWithoutDiagnosisInput = {
    where: evidenceWhereUniqueInput
    data: XOR<evidenceUpdateWithoutDiagnosisInput, evidenceUncheckedUpdateWithoutDiagnosisInput>
  }

  export type evidenceUpdateManyWithWhereWithoutDiagnosisInput = {
    where: evidenceScalarWhereInput
    data: XOR<evidenceUpdateManyMutationInput, evidenceUncheckedUpdateManyWithoutDiagnosisInput>
  }

  export type evidenceScalarWhereInput = {
    AND?: evidenceScalarWhereInput | evidenceScalarWhereInput[]
    OR?: evidenceScalarWhereInput[]
    NOT?: evidenceScalarWhereInput | evidenceScalarWhereInput[]
    id?: StringFilter<"evidence"> | string
    diagnosis_id?: StringFilter<"evidence"> | string
    item_id?: StringFilter<"evidence"> | string
    extracted_answer?: StringNullableFilter<"evidence"> | string | null
    correct?: BoolNullableFilter<"evidence"> | boolean | null
    confidence?: FloatFilter<"evidence"> | number
    quality?: Enumevidence_qualityFilter<"evidence"> | $Enums.evidence_quality
    created_at?: DateTimeFilter<"evidence"> | Date | string
  }

  export type diagnosisCreateWithoutEvidenceInput = {
    id?: string
    student_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.diagnosis_status
    created_at?: Date | string
    updated_at?: Date | string
    skill: skillCreateNestedOneWithoutDiagnosesInput
  }

  export type diagnosisUncheckedCreateWithoutEvidenceInput = {
    id?: string
    student_id: string
    skill_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.diagnosis_status
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type diagnosisCreateOrConnectWithoutEvidenceInput = {
    where: diagnosisWhereUniqueInput
    create: XOR<diagnosisCreateWithoutEvidenceInput, diagnosisUncheckedCreateWithoutEvidenceInput>
  }

  export type diagnosisUpsertWithoutEvidenceInput = {
    update: XOR<diagnosisUpdateWithoutEvidenceInput, diagnosisUncheckedUpdateWithoutEvidenceInput>
    create: XOR<diagnosisCreateWithoutEvidenceInput, diagnosisUncheckedCreateWithoutEvidenceInput>
    where?: diagnosisWhereInput
  }

  export type diagnosisUpdateToOneWithWhereWithoutEvidenceInput = {
    where?: diagnosisWhereInput
    data: XOR<diagnosisUpdateWithoutEvidenceInput, diagnosisUncheckedUpdateWithoutEvidenceInput>
  }

  export type diagnosisUpdateWithoutEvidenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: Enumdiagnosis_statusFieldUpdateOperationsInput | $Enums.diagnosis_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    skill?: skillUpdateOneRequiredWithoutDiagnosesNestedInput
  }

  export type diagnosisUncheckedUpdateWithoutEvidenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: Enumdiagnosis_statusFieldUpdateOperationsInput | $Enums.diagnosis_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type skillCreateWithoutInterventionsInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: skillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    diagnoses?: diagnosisCreateNestedManyWithoutSkillInput
  }

  export type skillUncheckedCreateWithoutInterventionsInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: skillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    diagnoses?: diagnosisUncheckedCreateNestedManyWithoutSkillInput
  }

  export type skillCreateOrConnectWithoutInterventionsInput = {
    where: skillWhereUniqueInput
    create: XOR<skillCreateWithoutInterventionsInput, skillUncheckedCreateWithoutInterventionsInput>
  }

  export type intervention_noteCreateWithoutInterventionInput = {
    id?: string
    teacher_id: string
    content: string
    created_at?: Date | string
  }

  export type intervention_noteUncheckedCreateWithoutInterventionInput = {
    id?: string
    teacher_id: string
    content: string
    created_at?: Date | string
  }

  export type intervention_noteCreateOrConnectWithoutInterventionInput = {
    where: intervention_noteWhereUniqueInput
    create: XOR<intervention_noteCreateWithoutInterventionInput, intervention_noteUncheckedCreateWithoutInterventionInput>
  }

  export type intervention_noteCreateManyInterventionInputEnvelope = {
    data: intervention_noteCreateManyInterventionInput | intervention_noteCreateManyInterventionInput[]
    skipDuplicates?: boolean
  }

  export type skillUpsertWithoutInterventionsInput = {
    update: XOR<skillUpdateWithoutInterventionsInput, skillUncheckedUpdateWithoutInterventionsInput>
    create: XOR<skillCreateWithoutInterventionsInput, skillUncheckedCreateWithoutInterventionsInput>
    where?: skillWhereInput
  }

  export type skillUpdateToOneWithWhereWithoutInterventionsInput = {
    where?: skillWhereInput
    data: XOR<skillUpdateWithoutInterventionsInput, skillUncheckedUpdateWithoutInterventionsInput>
  }

  export type skillUpdateWithoutInterventionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: skillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: diagnosisUpdateManyWithoutSkillNestedInput
  }

  export type skillUncheckedUpdateWithoutInterventionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: skillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: diagnosisUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type intervention_noteUpsertWithWhereUniqueWithoutInterventionInput = {
    where: intervention_noteWhereUniqueInput
    update: XOR<intervention_noteUpdateWithoutInterventionInput, intervention_noteUncheckedUpdateWithoutInterventionInput>
    create: XOR<intervention_noteCreateWithoutInterventionInput, intervention_noteUncheckedCreateWithoutInterventionInput>
  }

  export type intervention_noteUpdateWithWhereUniqueWithoutInterventionInput = {
    where: intervention_noteWhereUniqueInput
    data: XOR<intervention_noteUpdateWithoutInterventionInput, intervention_noteUncheckedUpdateWithoutInterventionInput>
  }

  export type intervention_noteUpdateManyWithWhereWithoutInterventionInput = {
    where: intervention_noteScalarWhereInput
    data: XOR<intervention_noteUpdateManyMutationInput, intervention_noteUncheckedUpdateManyWithoutInterventionInput>
  }

  export type intervention_noteScalarWhereInput = {
    AND?: intervention_noteScalarWhereInput | intervention_noteScalarWhereInput[]
    OR?: intervention_noteScalarWhereInput[]
    NOT?: intervention_noteScalarWhereInput | intervention_noteScalarWhereInput[]
    id?: StringFilter<"intervention_note"> | string
    intervention_id?: StringFilter<"intervention_note"> | string
    teacher_id?: StringFilter<"intervention_note"> | string
    content?: StringFilter<"intervention_note"> | string
    created_at?: DateTimeFilter<"intervention_note"> | Date | string
  }

  export type interventionCreateWithoutNotes_listInput = {
    id?: string
    student_id: string
    priority?: number
    status?: $Enums.intervention_status
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
    skill: skillCreateNestedOneWithoutInterventionsInput
  }

  export type interventionUncheckedCreateWithoutNotes_listInput = {
    id?: string
    student_id: string
    skill_id: string
    priority?: number
    status?: $Enums.intervention_status
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
  }

  export type interventionCreateOrConnectWithoutNotes_listInput = {
    where: interventionWhereUniqueInput
    create: XOR<interventionCreateWithoutNotes_listInput, interventionUncheckedCreateWithoutNotes_listInput>
  }

  export type interventionUpsertWithoutNotes_listInput = {
    update: XOR<interventionUpdateWithoutNotes_listInput, interventionUncheckedUpdateWithoutNotes_listInput>
    create: XOR<interventionCreateWithoutNotes_listInput, interventionUncheckedCreateWithoutNotes_listInput>
    where?: interventionWhereInput
  }

  export type interventionUpdateToOneWithWhereWithoutNotes_listInput = {
    where?: interventionWhereInput
    data: XOR<interventionUpdateWithoutNotes_listInput, interventionUncheckedUpdateWithoutNotes_listInput>
  }

  export type interventionUpdateWithoutNotes_listInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: Enumintervention_statusFieldUpdateOperationsInput | $Enums.intervention_status
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    skill?: skillUpdateOneRequiredWithoutInterventionsNestedInput
  }

  export type interventionUncheckedUpdateWithoutNotes_listInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: Enumintervention_statusFieldUpdateOperationsInput | $Enums.intervention_status
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type diagnosisCreateManySkillInput = {
    id?: string
    student_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.diagnosis_status
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type interventionCreateManySkillInput = {
    id?: string
    student_id: string
    priority?: number
    status?: $Enums.intervention_status
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
  }

  export type diagnosisUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: Enumdiagnosis_statusFieldUpdateOperationsInput | $Enums.diagnosis_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: evidenceUpdateManyWithoutDiagnosisNestedInput
  }

  export type diagnosisUncheckedUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: Enumdiagnosis_statusFieldUpdateOperationsInput | $Enums.diagnosis_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: evidenceUncheckedUpdateManyWithoutDiagnosisNestedInput
  }

  export type diagnosisUncheckedUpdateManyWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: Enumdiagnosis_statusFieldUpdateOperationsInput | $Enums.diagnosis_status
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type interventionUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: Enumintervention_statusFieldUpdateOperationsInput | $Enums.intervention_status
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes_list?: intervention_noteUpdateManyWithoutInterventionNestedInput
  }

  export type interventionUncheckedUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: Enumintervention_statusFieldUpdateOperationsInput | $Enums.intervention_status
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes_list?: intervention_noteUncheckedUpdateManyWithoutInterventionNestedInput
  }

  export type interventionUncheckedUpdateManyWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: Enumintervention_statusFieldUpdateOperationsInput | $Enums.intervention_status
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type evidenceCreateManyDiagnosisInput = {
    id?: string
    item_id: string
    extracted_answer?: string | null
    correct?: boolean | null
    confidence?: number
    quality?: $Enums.evidence_quality
    created_at?: Date | string
  }

  export type evidenceUpdateWithoutDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: Enumevidence_qualityFieldUpdateOperationsInput | $Enums.evidence_quality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type evidenceUncheckedUpdateWithoutDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: Enumevidence_qualityFieldUpdateOperationsInput | $Enums.evidence_quality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type evidenceUncheckedUpdateManyWithoutDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: Enumevidence_qualityFieldUpdateOperationsInput | $Enums.evidence_quality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type intervention_noteCreateManyInterventionInput = {
    id?: string
    teacher_id: string
    content: string
    created_at?: Date | string
  }

  export type intervention_noteUpdateWithoutInterventionInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type intervention_noteUncheckedUpdateWithoutInterventionInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type intervention_noteUncheckedUpdateManyWithoutInterventionInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use SkillCountOutputTypeDefaultArgs instead
     */
    export type SkillCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SkillCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DiagnosisCountOutputTypeDefaultArgs instead
     */
    export type DiagnosisCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DiagnosisCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InterventionCountOutputTypeDefaultArgs instead
     */
    export type InterventionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InterventionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use skillDefaultArgs instead
     */
    export type skillArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = skillDefaultArgs<ExtArgs>
    /**
     * @deprecated Use diagnosisDefaultArgs instead
     */
    export type diagnosisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = diagnosisDefaultArgs<ExtArgs>
    /**
     * @deprecated Use evidenceDefaultArgs instead
     */
    export type evidenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = evidenceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use interventionDefaultArgs instead
     */
    export type interventionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = interventionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use intervention_noteDefaultArgs instead
     */
    export type intervention_noteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = intervention_noteDefaultArgs<ExtArgs>

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