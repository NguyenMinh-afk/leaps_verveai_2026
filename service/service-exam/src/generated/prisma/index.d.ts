
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
 * Model Exam
 * An exam created by a teacher for a class.
 */
export type Exam = $Result.DefaultSelection<Prisma.$ExamPayload>
/**
 * Model ExamQuestion
 * A question included in an exam.
 */
export type ExamQuestion = $Result.DefaultSelection<Prisma.$ExamQuestionPayload>
/**
 * Model ExamAttempt
 * A student's attempt at an exam.
 */
export type ExamAttempt = $Result.DefaultSelection<Prisma.$ExamAttemptPayload>
/**
 * Model ExamAnswer
 * A student's answer to a specific question in an attempt.
 */
export type ExamAnswer = $Result.DefaultSelection<Prisma.$ExamAnswerPayload>
/**
 * Model QuestionSkillMapping
 * Maps content service questions to BKT skills for evidence tracking.
 * This allows exam answers to generate BKT evidence for the corresponding skill.
 */
export type QuestionSkillMapping = $Result.DefaultSelection<Prisma.$QuestionSkillMappingPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ExamStatus: {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

export type ExamStatus = (typeof ExamStatus)[keyof typeof ExamStatus]


export const ExamAttemptStatus: {
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  GRADED: 'GRADED',
  MANUAL_REVIEW: 'MANUAL_REVIEW',
  COMPLETED: 'COMPLETED'
};

export type ExamAttemptStatus = (typeof ExamAttemptStatus)[keyof typeof ExamAttemptStatus]

}

export type ExamStatus = $Enums.ExamStatus

export const ExamStatus: typeof $Enums.ExamStatus

export type ExamAttemptStatus = $Enums.ExamAttemptStatus

export const ExamAttemptStatus: typeof $Enums.ExamAttemptStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Exams
 * const exams = await prisma.exam.findMany()
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
   * // Fetch zero or more Exams
   * const exams = await prisma.exam.findMany()
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
   * `prisma.exam`: Exposes CRUD operations for the **Exam** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Exams
    * const exams = await prisma.exam.findMany()
    * ```
    */
  get exam(): Prisma.ExamDelegate<ExtArgs>;

  /**
   * `prisma.examQuestion`: Exposes CRUD operations for the **ExamQuestion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExamQuestions
    * const examQuestions = await prisma.examQuestion.findMany()
    * ```
    */
  get examQuestion(): Prisma.ExamQuestionDelegate<ExtArgs>;

  /**
   * `prisma.examAttempt`: Exposes CRUD operations for the **ExamAttempt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExamAttempts
    * const examAttempts = await prisma.examAttempt.findMany()
    * ```
    */
  get examAttempt(): Prisma.ExamAttemptDelegate<ExtArgs>;

  /**
   * `prisma.examAnswer`: Exposes CRUD operations for the **ExamAnswer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExamAnswers
    * const examAnswers = await prisma.examAnswer.findMany()
    * ```
    */
  get examAnswer(): Prisma.ExamAnswerDelegate<ExtArgs>;

  /**
   * `prisma.questionSkillMapping`: Exposes CRUD operations for the **QuestionSkillMapping** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuestionSkillMappings
    * const questionSkillMappings = await prisma.questionSkillMapping.findMany()
    * ```
    */
  get questionSkillMapping(): Prisma.QuestionSkillMappingDelegate<ExtArgs>;
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
    Exam: 'Exam',
    ExamQuestion: 'ExamQuestion',
    ExamAttempt: 'ExamAttempt',
    ExamAnswer: 'ExamAnswer',
    QuestionSkillMapping: 'QuestionSkillMapping'
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
      modelProps: "exam" | "examQuestion" | "examAttempt" | "examAnswer" | "questionSkillMapping"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Exam: {
        payload: Prisma.$ExamPayload<ExtArgs>
        fields: Prisma.ExamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>
          }
          findFirst: {
            args: Prisma.ExamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>
          }
          findMany: {
            args: Prisma.ExamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>[]
          }
          create: {
            args: Prisma.ExamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>
          }
          createMany: {
            args: Prisma.ExamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>[]
          }
          delete: {
            args: Prisma.ExamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>
          }
          update: {
            args: Prisma.ExamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>
          }
          deleteMany: {
            args: Prisma.ExamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ExamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>
          }
          aggregate: {
            args: Prisma.ExamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExam>
          }
          groupBy: {
            args: Prisma.ExamGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExamGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExamCountArgs<ExtArgs>
            result: $Utils.Optional<ExamCountAggregateOutputType> | number
          }
        }
      }
      ExamQuestion: {
        payload: Prisma.$ExamQuestionPayload<ExtArgs>
        fields: Prisma.ExamQuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExamQuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamQuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExamQuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamQuestionPayload>
          }
          findFirst: {
            args: Prisma.ExamQuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamQuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExamQuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamQuestionPayload>
          }
          findMany: {
            args: Prisma.ExamQuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamQuestionPayload>[]
          }
          create: {
            args: Prisma.ExamQuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamQuestionPayload>
          }
          createMany: {
            args: Prisma.ExamQuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExamQuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamQuestionPayload>[]
          }
          delete: {
            args: Prisma.ExamQuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamQuestionPayload>
          }
          update: {
            args: Prisma.ExamQuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamQuestionPayload>
          }
          deleteMany: {
            args: Prisma.ExamQuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExamQuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ExamQuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamQuestionPayload>
          }
          aggregate: {
            args: Prisma.ExamQuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExamQuestion>
          }
          groupBy: {
            args: Prisma.ExamQuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExamQuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExamQuestionCountArgs<ExtArgs>
            result: $Utils.Optional<ExamQuestionCountAggregateOutputType> | number
          }
        }
      }
      ExamAttempt: {
        payload: Prisma.$ExamAttemptPayload<ExtArgs>
        fields: Prisma.ExamAttemptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExamAttemptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExamAttemptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>
          }
          findFirst: {
            args: Prisma.ExamAttemptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExamAttemptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>
          }
          findMany: {
            args: Prisma.ExamAttemptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>[]
          }
          create: {
            args: Prisma.ExamAttemptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>
          }
          createMany: {
            args: Prisma.ExamAttemptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExamAttemptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>[]
          }
          delete: {
            args: Prisma.ExamAttemptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>
          }
          update: {
            args: Prisma.ExamAttemptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>
          }
          deleteMany: {
            args: Prisma.ExamAttemptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExamAttemptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ExamAttemptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAttemptPayload>
          }
          aggregate: {
            args: Prisma.ExamAttemptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExamAttempt>
          }
          groupBy: {
            args: Prisma.ExamAttemptGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExamAttemptGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExamAttemptCountArgs<ExtArgs>
            result: $Utils.Optional<ExamAttemptCountAggregateOutputType> | number
          }
        }
      }
      ExamAnswer: {
        payload: Prisma.$ExamAnswerPayload<ExtArgs>
        fields: Prisma.ExamAnswerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExamAnswerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExamAnswerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>
          }
          findFirst: {
            args: Prisma.ExamAnswerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExamAnswerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>
          }
          findMany: {
            args: Prisma.ExamAnswerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>[]
          }
          create: {
            args: Prisma.ExamAnswerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>
          }
          createMany: {
            args: Prisma.ExamAnswerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExamAnswerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>[]
          }
          delete: {
            args: Prisma.ExamAnswerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>
          }
          update: {
            args: Prisma.ExamAnswerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>
          }
          deleteMany: {
            args: Prisma.ExamAnswerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExamAnswerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ExamAnswerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamAnswerPayload>
          }
          aggregate: {
            args: Prisma.ExamAnswerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExamAnswer>
          }
          groupBy: {
            args: Prisma.ExamAnswerGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExamAnswerGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExamAnswerCountArgs<ExtArgs>
            result: $Utils.Optional<ExamAnswerCountAggregateOutputType> | number
          }
        }
      }
      QuestionSkillMapping: {
        payload: Prisma.$QuestionSkillMappingPayload<ExtArgs>
        fields: Prisma.QuestionSkillMappingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuestionSkillMappingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionSkillMappingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuestionSkillMappingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionSkillMappingPayload>
          }
          findFirst: {
            args: Prisma.QuestionSkillMappingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionSkillMappingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuestionSkillMappingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionSkillMappingPayload>
          }
          findMany: {
            args: Prisma.QuestionSkillMappingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionSkillMappingPayload>[]
          }
          create: {
            args: Prisma.QuestionSkillMappingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionSkillMappingPayload>
          }
          createMany: {
            args: Prisma.QuestionSkillMappingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuestionSkillMappingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionSkillMappingPayload>[]
          }
          delete: {
            args: Prisma.QuestionSkillMappingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionSkillMappingPayload>
          }
          update: {
            args: Prisma.QuestionSkillMappingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionSkillMappingPayload>
          }
          deleteMany: {
            args: Prisma.QuestionSkillMappingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuestionSkillMappingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QuestionSkillMappingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionSkillMappingPayload>
          }
          aggregate: {
            args: Prisma.QuestionSkillMappingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestionSkillMapping>
          }
          groupBy: {
            args: Prisma.QuestionSkillMappingGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuestionSkillMappingGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuestionSkillMappingCountArgs<ExtArgs>
            result: $Utils.Optional<QuestionSkillMappingCountAggregateOutputType> | number
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
   * Count Type ExamCountOutputType
   */

  export type ExamCountOutputType = {
    questions: number
    attempts: number
  }

  export type ExamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | ExamCountOutputTypeCountQuestionsArgs
    attempts?: boolean | ExamCountOutputTypeCountAttemptsArgs
  }

  // Custom InputTypes
  /**
   * ExamCountOutputType without action
   */
  export type ExamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamCountOutputType
     */
    select?: ExamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExamCountOutputType without action
   */
  export type ExamCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamQuestionWhereInput
  }

  /**
   * ExamCountOutputType without action
   */
  export type ExamCountOutputTypeCountAttemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamAttemptWhereInput
  }


  /**
   * Count Type ExamAttemptCountOutputType
   */

  export type ExamAttemptCountOutputType = {
    answers: number
  }

  export type ExamAttemptCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    answers?: boolean | ExamAttemptCountOutputTypeCountAnswersArgs
  }

  // Custom InputTypes
  /**
   * ExamAttemptCountOutputType without action
   */
  export type ExamAttemptCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttemptCountOutputType
     */
    select?: ExamAttemptCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExamAttemptCountOutputType without action
   */
  export type ExamAttemptCountOutputTypeCountAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamAnswerWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Exam
   */

  export type AggregateExam = {
    _count: ExamCountAggregateOutputType | null
    _avg: ExamAvgAggregateOutputType | null
    _sum: ExamSumAggregateOutputType | null
    _min: ExamMinAggregateOutputType | null
    _max: ExamMaxAggregateOutputType | null
  }

  export type ExamAvgAggregateOutputType = {
    time_limit: number | null
    passing_score: number | null
    max_score: number | null
    max_attempts: number | null
  }

  export type ExamSumAggregateOutputType = {
    time_limit: number | null
    passing_score: number | null
    max_score: number | null
    max_attempts: number | null
  }

  export type ExamMinAggregateOutputType = {
    id: string | null
    class_id: string | null
    teacher_id: string | null
    title: string | null
    description: string | null
    status: $Enums.ExamStatus | null
    time_limit: number | null
    passing_score: number | null
    max_score: number | null
    max_attempts: number | null
    shuffle_questions: boolean | null
    show_results_immediately: boolean | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type ExamMaxAggregateOutputType = {
    id: string | null
    class_id: string | null
    teacher_id: string | null
    title: string | null
    description: string | null
    status: $Enums.ExamStatus | null
    time_limit: number | null
    passing_score: number | null
    max_score: number | null
    max_attempts: number | null
    shuffle_questions: boolean | null
    show_results_immediately: boolean | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type ExamCountAggregateOutputType = {
    id: number
    class_id: number
    teacher_id: number
    title: number
    description: number
    status: number
    time_limit: number
    passing_score: number
    max_score: number
    max_attempts: number
    shuffle_questions: number
    show_results_immediately: number
    created_at: number
    updated_at: number
    deleted_at: number
    _all: number
  }


  export type ExamAvgAggregateInputType = {
    time_limit?: true
    passing_score?: true
    max_score?: true
    max_attempts?: true
  }

  export type ExamSumAggregateInputType = {
    time_limit?: true
    passing_score?: true
    max_score?: true
    max_attempts?: true
  }

  export type ExamMinAggregateInputType = {
    id?: true
    class_id?: true
    teacher_id?: true
    title?: true
    description?: true
    status?: true
    time_limit?: true
    passing_score?: true
    max_score?: true
    max_attempts?: true
    shuffle_questions?: true
    show_results_immediately?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type ExamMaxAggregateInputType = {
    id?: true
    class_id?: true
    teacher_id?: true
    title?: true
    description?: true
    status?: true
    time_limit?: true
    passing_score?: true
    max_score?: true
    max_attempts?: true
    shuffle_questions?: true
    show_results_immediately?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type ExamCountAggregateInputType = {
    id?: true
    class_id?: true
    teacher_id?: true
    title?: true
    description?: true
    status?: true
    time_limit?: true
    passing_score?: true
    max_score?: true
    max_attempts?: true
    shuffle_questions?: true
    show_results_immediately?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    _all?: true
  }

  export type ExamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Exam to aggregate.
     */
    where?: ExamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exams to fetch.
     */
    orderBy?: ExamOrderByWithRelationInput | ExamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Exams
    **/
    _count?: true | ExamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExamAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExamSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExamMaxAggregateInputType
  }

  export type GetExamAggregateType<T extends ExamAggregateArgs> = {
        [P in keyof T & keyof AggregateExam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExam[P]>
      : GetScalarType<T[P], AggregateExam[P]>
  }




  export type ExamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamWhereInput
    orderBy?: ExamOrderByWithAggregationInput | ExamOrderByWithAggregationInput[]
    by: ExamScalarFieldEnum[] | ExamScalarFieldEnum
    having?: ExamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExamCountAggregateInputType | true
    _avg?: ExamAvgAggregateInputType
    _sum?: ExamSumAggregateInputType
    _min?: ExamMinAggregateInputType
    _max?: ExamMaxAggregateInputType
  }

  export type ExamGroupByOutputType = {
    id: string
    class_id: string
    teacher_id: string
    title: string
    description: string | null
    status: $Enums.ExamStatus
    time_limit: number | null
    passing_score: number
    max_score: number
    max_attempts: number
    shuffle_questions: boolean
    show_results_immediately: boolean
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
    _count: ExamCountAggregateOutputType | null
    _avg: ExamAvgAggregateOutputType | null
    _sum: ExamSumAggregateOutputType | null
    _min: ExamMinAggregateOutputType | null
    _max: ExamMaxAggregateOutputType | null
  }

  type GetExamGroupByPayload<T extends ExamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExamGroupByOutputType[P]>
            : GetScalarType<T[P], ExamGroupByOutputType[P]>
        }
      >
    >


  export type ExamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    class_id?: boolean
    teacher_id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    time_limit?: boolean
    passing_score?: boolean
    max_score?: boolean
    max_attempts?: boolean
    shuffle_questions?: boolean
    show_results_immediately?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    questions?: boolean | Exam$questionsArgs<ExtArgs>
    attempts?: boolean | Exam$attemptsArgs<ExtArgs>
    _count?: boolean | ExamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exam"]>

  export type ExamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    class_id?: boolean
    teacher_id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    time_limit?: boolean
    passing_score?: boolean
    max_score?: boolean
    max_attempts?: boolean
    shuffle_questions?: boolean
    show_results_immediately?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }, ExtArgs["result"]["exam"]>

  export type ExamSelectScalar = {
    id?: boolean
    class_id?: boolean
    teacher_id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    time_limit?: boolean
    passing_score?: boolean
    max_score?: boolean
    max_attempts?: boolean
    shuffle_questions?: boolean
    show_results_immediately?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }

  export type ExamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | Exam$questionsArgs<ExtArgs>
    attempts?: boolean | Exam$attemptsArgs<ExtArgs>
    _count?: boolean | ExamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ExamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Exam"
    objects: {
      questions: Prisma.$ExamQuestionPayload<ExtArgs>[]
      attempts: Prisma.$ExamAttemptPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      class_id: string
      teacher_id: string
      title: string
      description: string | null
      status: $Enums.ExamStatus
      time_limit: number | null
      passing_score: number
      max_score: number
      max_attempts: number
      shuffle_questions: boolean
      show_results_immediately: boolean
      created_at: Date
      updated_at: Date
      deleted_at: Date | null
    }, ExtArgs["result"]["exam"]>
    composites: {}
  }

  type ExamGetPayload<S extends boolean | null | undefined | ExamDefaultArgs> = $Result.GetResult<Prisma.$ExamPayload, S>

  type ExamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ExamFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ExamCountAggregateInputType | true
    }

  export interface ExamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Exam'], meta: { name: 'Exam' } }
    /**
     * Find zero or one Exam that matches the filter.
     * @param {ExamFindUniqueArgs} args - Arguments to find a Exam
     * @example
     * // Get one Exam
     * const exam = await prisma.exam.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExamFindUniqueArgs>(args: SelectSubset<T, ExamFindUniqueArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Exam that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ExamFindUniqueOrThrowArgs} args - Arguments to find a Exam
     * @example
     * // Get one Exam
     * const exam = await prisma.exam.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExamFindUniqueOrThrowArgs>(args: SelectSubset<T, ExamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Exam that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamFindFirstArgs} args - Arguments to find a Exam
     * @example
     * // Get one Exam
     * const exam = await prisma.exam.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExamFindFirstArgs>(args?: SelectSubset<T, ExamFindFirstArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Exam that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamFindFirstOrThrowArgs} args - Arguments to find a Exam
     * @example
     * // Get one Exam
     * const exam = await prisma.exam.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExamFindFirstOrThrowArgs>(args?: SelectSubset<T, ExamFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Exams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Exams
     * const exams = await prisma.exam.findMany()
     * 
     * // Get first 10 Exams
     * const exams = await prisma.exam.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const examWithIdOnly = await prisma.exam.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExamFindManyArgs>(args?: SelectSubset<T, ExamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Exam.
     * @param {ExamCreateArgs} args - Arguments to create a Exam.
     * @example
     * // Create one Exam
     * const Exam = await prisma.exam.create({
     *   data: {
     *     // ... data to create a Exam
     *   }
     * })
     * 
     */
    create<T extends ExamCreateArgs>(args: SelectSubset<T, ExamCreateArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Exams.
     * @param {ExamCreateManyArgs} args - Arguments to create many Exams.
     * @example
     * // Create many Exams
     * const exam = await prisma.exam.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExamCreateManyArgs>(args?: SelectSubset<T, ExamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Exams and returns the data saved in the database.
     * @param {ExamCreateManyAndReturnArgs} args - Arguments to create many Exams.
     * @example
     * // Create many Exams
     * const exam = await prisma.exam.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Exams and only return the `id`
     * const examWithIdOnly = await prisma.exam.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExamCreateManyAndReturnArgs>(args?: SelectSubset<T, ExamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Exam.
     * @param {ExamDeleteArgs} args - Arguments to delete one Exam.
     * @example
     * // Delete one Exam
     * const Exam = await prisma.exam.delete({
     *   where: {
     *     // ... filter to delete one Exam
     *   }
     * })
     * 
     */
    delete<T extends ExamDeleteArgs>(args: SelectSubset<T, ExamDeleteArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Exam.
     * @param {ExamUpdateArgs} args - Arguments to update one Exam.
     * @example
     * // Update one Exam
     * const exam = await prisma.exam.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExamUpdateArgs>(args: SelectSubset<T, ExamUpdateArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Exams.
     * @param {ExamDeleteManyArgs} args - Arguments to filter Exams to delete.
     * @example
     * // Delete a few Exams
     * const { count } = await prisma.exam.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExamDeleteManyArgs>(args?: SelectSubset<T, ExamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Exams
     * const exam = await prisma.exam.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExamUpdateManyArgs>(args: SelectSubset<T, ExamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Exam.
     * @param {ExamUpsertArgs} args - Arguments to update or create a Exam.
     * @example
     * // Update or create a Exam
     * const exam = await prisma.exam.upsert({
     *   create: {
     *     // ... data to create a Exam
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Exam we want to update
     *   }
     * })
     */
    upsert<T extends ExamUpsertArgs>(args: SelectSubset<T, ExamUpsertArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Exams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamCountArgs} args - Arguments to filter Exams to count.
     * @example
     * // Count the number of Exams
     * const count = await prisma.exam.count({
     *   where: {
     *     // ... the filter for the Exams we want to count
     *   }
     * })
    **/
    count<T extends ExamCountArgs>(
      args?: Subset<T, ExamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Exam.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ExamAggregateArgs>(args: Subset<T, ExamAggregateArgs>): Prisma.PrismaPromise<GetExamAggregateType<T>>

    /**
     * Group by Exam.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamGroupByArgs} args - Group by arguments.
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
      T extends ExamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExamGroupByArgs['orderBy'] }
        : { orderBy?: ExamGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ExamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Exam model
   */
  readonly fields: ExamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Exam.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    questions<T extends Exam$questionsArgs<ExtArgs> = {}>(args?: Subset<T, Exam$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamQuestionPayload<ExtArgs>, T, "findMany"> | Null>
    attempts<T extends Exam$attemptsArgs<ExtArgs> = {}>(args?: Subset<T, Exam$attemptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Exam model
   */ 
  interface ExamFieldRefs {
    readonly id: FieldRef<"Exam", 'String'>
    readonly class_id: FieldRef<"Exam", 'String'>
    readonly teacher_id: FieldRef<"Exam", 'String'>
    readonly title: FieldRef<"Exam", 'String'>
    readonly description: FieldRef<"Exam", 'String'>
    readonly status: FieldRef<"Exam", 'ExamStatus'>
    readonly time_limit: FieldRef<"Exam", 'Int'>
    readonly passing_score: FieldRef<"Exam", 'Float'>
    readonly max_score: FieldRef<"Exam", 'Float'>
    readonly max_attempts: FieldRef<"Exam", 'Int'>
    readonly shuffle_questions: FieldRef<"Exam", 'Boolean'>
    readonly show_results_immediately: FieldRef<"Exam", 'Boolean'>
    readonly created_at: FieldRef<"Exam", 'DateTime'>
    readonly updated_at: FieldRef<"Exam", 'DateTime'>
    readonly deleted_at: FieldRef<"Exam", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Exam findUnique
   */
  export type ExamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * Filter, which Exam to fetch.
     */
    where: ExamWhereUniqueInput
  }

  /**
   * Exam findUniqueOrThrow
   */
  export type ExamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * Filter, which Exam to fetch.
     */
    where: ExamWhereUniqueInput
  }

  /**
   * Exam findFirst
   */
  export type ExamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * Filter, which Exam to fetch.
     */
    where?: ExamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exams to fetch.
     */
    orderBy?: ExamOrderByWithRelationInput | ExamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Exams.
     */
    cursor?: ExamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exams.
     */
    distinct?: ExamScalarFieldEnum | ExamScalarFieldEnum[]
  }

  /**
   * Exam findFirstOrThrow
   */
  export type ExamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * Filter, which Exam to fetch.
     */
    where?: ExamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exams to fetch.
     */
    orderBy?: ExamOrderByWithRelationInput | ExamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Exams.
     */
    cursor?: ExamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exams.
     */
    distinct?: ExamScalarFieldEnum | ExamScalarFieldEnum[]
  }

  /**
   * Exam findMany
   */
  export type ExamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * Filter, which Exams to fetch.
     */
    where?: ExamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exams to fetch.
     */
    orderBy?: ExamOrderByWithRelationInput | ExamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Exams.
     */
    cursor?: ExamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exams.
     */
    skip?: number
    distinct?: ExamScalarFieldEnum | ExamScalarFieldEnum[]
  }

  /**
   * Exam create
   */
  export type ExamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * The data needed to create a Exam.
     */
    data: XOR<ExamCreateInput, ExamUncheckedCreateInput>
  }

  /**
   * Exam createMany
   */
  export type ExamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Exams.
     */
    data: ExamCreateManyInput | ExamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Exam createManyAndReturn
   */
  export type ExamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Exams.
     */
    data: ExamCreateManyInput | ExamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Exam update
   */
  export type ExamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * The data needed to update a Exam.
     */
    data: XOR<ExamUpdateInput, ExamUncheckedUpdateInput>
    /**
     * Choose, which Exam to update.
     */
    where: ExamWhereUniqueInput
  }

  /**
   * Exam updateMany
   */
  export type ExamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Exams.
     */
    data: XOR<ExamUpdateManyMutationInput, ExamUncheckedUpdateManyInput>
    /**
     * Filter which Exams to update
     */
    where?: ExamWhereInput
  }

  /**
   * Exam upsert
   */
  export type ExamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * The filter to search for the Exam to update in case it exists.
     */
    where: ExamWhereUniqueInput
    /**
     * In case the Exam found by the `where` argument doesn't exist, create a new Exam with this data.
     */
    create: XOR<ExamCreateInput, ExamUncheckedCreateInput>
    /**
     * In case the Exam was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExamUpdateInput, ExamUncheckedUpdateInput>
  }

  /**
   * Exam delete
   */
  export type ExamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * Filter which Exam to delete.
     */
    where: ExamWhereUniqueInput
  }

  /**
   * Exam deleteMany
   */
  export type ExamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Exams to delete
     */
    where?: ExamWhereInput
  }

  /**
   * Exam.questions
   */
  export type Exam$questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamQuestion
     */
    select?: ExamQuestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamQuestionInclude<ExtArgs> | null
    where?: ExamQuestionWhereInput
    orderBy?: ExamQuestionOrderByWithRelationInput | ExamQuestionOrderByWithRelationInput[]
    cursor?: ExamQuestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExamQuestionScalarFieldEnum | ExamQuestionScalarFieldEnum[]
  }

  /**
   * Exam.attempts
   */
  export type Exam$attemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    where?: ExamAttemptWhereInput
    orderBy?: ExamAttemptOrderByWithRelationInput | ExamAttemptOrderByWithRelationInput[]
    cursor?: ExamAttemptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExamAttemptScalarFieldEnum | ExamAttemptScalarFieldEnum[]
  }

  /**
   * Exam without action
   */
  export type ExamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
  }


  /**
   * Model ExamQuestion
   */

  export type AggregateExamQuestion = {
    _count: ExamQuestionCountAggregateOutputType | null
    _avg: ExamQuestionAvgAggregateOutputType | null
    _sum: ExamQuestionSumAggregateOutputType | null
    _min: ExamQuestionMinAggregateOutputType | null
    _max: ExamQuestionMaxAggregateOutputType | null
  }

  export type ExamQuestionAvgAggregateOutputType = {
    points: number | null
    order_index: number | null
  }

  export type ExamQuestionSumAggregateOutputType = {
    points: number | null
    order_index: number | null
  }

  export type ExamQuestionMinAggregateOutputType = {
    id: string | null
    exam_id: string | null
    question_id: string | null
    points: number | null
    order_index: number | null
    required: boolean | null
    created_at: Date | null
  }

  export type ExamQuestionMaxAggregateOutputType = {
    id: string | null
    exam_id: string | null
    question_id: string | null
    points: number | null
    order_index: number | null
    required: boolean | null
    created_at: Date | null
  }

  export type ExamQuestionCountAggregateOutputType = {
    id: number
    exam_id: number
    question_id: number
    points: number
    order_index: number
    required: number
    created_at: number
    _all: number
  }


  export type ExamQuestionAvgAggregateInputType = {
    points?: true
    order_index?: true
  }

  export type ExamQuestionSumAggregateInputType = {
    points?: true
    order_index?: true
  }

  export type ExamQuestionMinAggregateInputType = {
    id?: true
    exam_id?: true
    question_id?: true
    points?: true
    order_index?: true
    required?: true
    created_at?: true
  }

  export type ExamQuestionMaxAggregateInputType = {
    id?: true
    exam_id?: true
    question_id?: true
    points?: true
    order_index?: true
    required?: true
    created_at?: true
  }

  export type ExamQuestionCountAggregateInputType = {
    id?: true
    exam_id?: true
    question_id?: true
    points?: true
    order_index?: true
    required?: true
    created_at?: true
    _all?: true
  }

  export type ExamQuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamQuestion to aggregate.
     */
    where?: ExamQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamQuestions to fetch.
     */
    orderBy?: ExamQuestionOrderByWithRelationInput | ExamQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExamQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExamQuestions
    **/
    _count?: true | ExamQuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExamQuestionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExamQuestionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExamQuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExamQuestionMaxAggregateInputType
  }

  export type GetExamQuestionAggregateType<T extends ExamQuestionAggregateArgs> = {
        [P in keyof T & keyof AggregateExamQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExamQuestion[P]>
      : GetScalarType<T[P], AggregateExamQuestion[P]>
  }




  export type ExamQuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamQuestionWhereInput
    orderBy?: ExamQuestionOrderByWithAggregationInput | ExamQuestionOrderByWithAggregationInput[]
    by: ExamQuestionScalarFieldEnum[] | ExamQuestionScalarFieldEnum
    having?: ExamQuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExamQuestionCountAggregateInputType | true
    _avg?: ExamQuestionAvgAggregateInputType
    _sum?: ExamQuestionSumAggregateInputType
    _min?: ExamQuestionMinAggregateInputType
    _max?: ExamQuestionMaxAggregateInputType
  }

  export type ExamQuestionGroupByOutputType = {
    id: string
    exam_id: string
    question_id: string
    points: number
    order_index: number
    required: boolean
    created_at: Date
    _count: ExamQuestionCountAggregateOutputType | null
    _avg: ExamQuestionAvgAggregateOutputType | null
    _sum: ExamQuestionSumAggregateOutputType | null
    _min: ExamQuestionMinAggregateOutputType | null
    _max: ExamQuestionMaxAggregateOutputType | null
  }

  type GetExamQuestionGroupByPayload<T extends ExamQuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExamQuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExamQuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExamQuestionGroupByOutputType[P]>
            : GetScalarType<T[P], ExamQuestionGroupByOutputType[P]>
        }
      >
    >


  export type ExamQuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    exam_id?: boolean
    question_id?: boolean
    points?: boolean
    order_index?: boolean
    required?: boolean
    created_at?: boolean
    exam?: boolean | ExamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examQuestion"]>

  export type ExamQuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    exam_id?: boolean
    question_id?: boolean
    points?: boolean
    order_index?: boolean
    required?: boolean
    created_at?: boolean
    exam?: boolean | ExamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examQuestion"]>

  export type ExamQuestionSelectScalar = {
    id?: boolean
    exam_id?: boolean
    question_id?: boolean
    points?: boolean
    order_index?: boolean
    required?: boolean
    created_at?: boolean
  }

  export type ExamQuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exam?: boolean | ExamDefaultArgs<ExtArgs>
  }
  export type ExamQuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exam?: boolean | ExamDefaultArgs<ExtArgs>
  }

  export type $ExamQuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExamQuestion"
    objects: {
      exam: Prisma.$ExamPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      exam_id: string
      question_id: string
      points: number
      order_index: number
      required: boolean
      created_at: Date
    }, ExtArgs["result"]["examQuestion"]>
    composites: {}
  }

  type ExamQuestionGetPayload<S extends boolean | null | undefined | ExamQuestionDefaultArgs> = $Result.GetResult<Prisma.$ExamQuestionPayload, S>

  type ExamQuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ExamQuestionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ExamQuestionCountAggregateInputType | true
    }

  export interface ExamQuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExamQuestion'], meta: { name: 'ExamQuestion' } }
    /**
     * Find zero or one ExamQuestion that matches the filter.
     * @param {ExamQuestionFindUniqueArgs} args - Arguments to find a ExamQuestion
     * @example
     * // Get one ExamQuestion
     * const examQuestion = await prisma.examQuestion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExamQuestionFindUniqueArgs>(args: SelectSubset<T, ExamQuestionFindUniqueArgs<ExtArgs>>): Prisma__ExamQuestionClient<$Result.GetResult<Prisma.$ExamQuestionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ExamQuestion that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ExamQuestionFindUniqueOrThrowArgs} args - Arguments to find a ExamQuestion
     * @example
     * // Get one ExamQuestion
     * const examQuestion = await prisma.examQuestion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExamQuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, ExamQuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExamQuestionClient<$Result.GetResult<Prisma.$ExamQuestionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ExamQuestion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamQuestionFindFirstArgs} args - Arguments to find a ExamQuestion
     * @example
     * // Get one ExamQuestion
     * const examQuestion = await prisma.examQuestion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExamQuestionFindFirstArgs>(args?: SelectSubset<T, ExamQuestionFindFirstArgs<ExtArgs>>): Prisma__ExamQuestionClient<$Result.GetResult<Prisma.$ExamQuestionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ExamQuestion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamQuestionFindFirstOrThrowArgs} args - Arguments to find a ExamQuestion
     * @example
     * // Get one ExamQuestion
     * const examQuestion = await prisma.examQuestion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExamQuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, ExamQuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExamQuestionClient<$Result.GetResult<Prisma.$ExamQuestionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ExamQuestions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamQuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExamQuestions
     * const examQuestions = await prisma.examQuestion.findMany()
     * 
     * // Get first 10 ExamQuestions
     * const examQuestions = await prisma.examQuestion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const examQuestionWithIdOnly = await prisma.examQuestion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExamQuestionFindManyArgs>(args?: SelectSubset<T, ExamQuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamQuestionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ExamQuestion.
     * @param {ExamQuestionCreateArgs} args - Arguments to create a ExamQuestion.
     * @example
     * // Create one ExamQuestion
     * const ExamQuestion = await prisma.examQuestion.create({
     *   data: {
     *     // ... data to create a ExamQuestion
     *   }
     * })
     * 
     */
    create<T extends ExamQuestionCreateArgs>(args: SelectSubset<T, ExamQuestionCreateArgs<ExtArgs>>): Prisma__ExamQuestionClient<$Result.GetResult<Prisma.$ExamQuestionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ExamQuestions.
     * @param {ExamQuestionCreateManyArgs} args - Arguments to create many ExamQuestions.
     * @example
     * // Create many ExamQuestions
     * const examQuestion = await prisma.examQuestion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExamQuestionCreateManyArgs>(args?: SelectSubset<T, ExamQuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExamQuestions and returns the data saved in the database.
     * @param {ExamQuestionCreateManyAndReturnArgs} args - Arguments to create many ExamQuestions.
     * @example
     * // Create many ExamQuestions
     * const examQuestion = await prisma.examQuestion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExamQuestions and only return the `id`
     * const examQuestionWithIdOnly = await prisma.examQuestion.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExamQuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, ExamQuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamQuestionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ExamQuestion.
     * @param {ExamQuestionDeleteArgs} args - Arguments to delete one ExamQuestion.
     * @example
     * // Delete one ExamQuestion
     * const ExamQuestion = await prisma.examQuestion.delete({
     *   where: {
     *     // ... filter to delete one ExamQuestion
     *   }
     * })
     * 
     */
    delete<T extends ExamQuestionDeleteArgs>(args: SelectSubset<T, ExamQuestionDeleteArgs<ExtArgs>>): Prisma__ExamQuestionClient<$Result.GetResult<Prisma.$ExamQuestionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ExamQuestion.
     * @param {ExamQuestionUpdateArgs} args - Arguments to update one ExamQuestion.
     * @example
     * // Update one ExamQuestion
     * const examQuestion = await prisma.examQuestion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExamQuestionUpdateArgs>(args: SelectSubset<T, ExamQuestionUpdateArgs<ExtArgs>>): Prisma__ExamQuestionClient<$Result.GetResult<Prisma.$ExamQuestionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ExamQuestions.
     * @param {ExamQuestionDeleteManyArgs} args - Arguments to filter ExamQuestions to delete.
     * @example
     * // Delete a few ExamQuestions
     * const { count } = await prisma.examQuestion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExamQuestionDeleteManyArgs>(args?: SelectSubset<T, ExamQuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamQuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExamQuestions
     * const examQuestion = await prisma.examQuestion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExamQuestionUpdateManyArgs>(args: SelectSubset<T, ExamQuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ExamQuestion.
     * @param {ExamQuestionUpsertArgs} args - Arguments to update or create a ExamQuestion.
     * @example
     * // Update or create a ExamQuestion
     * const examQuestion = await prisma.examQuestion.upsert({
     *   create: {
     *     // ... data to create a ExamQuestion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExamQuestion we want to update
     *   }
     * })
     */
    upsert<T extends ExamQuestionUpsertArgs>(args: SelectSubset<T, ExamQuestionUpsertArgs<ExtArgs>>): Prisma__ExamQuestionClient<$Result.GetResult<Prisma.$ExamQuestionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ExamQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamQuestionCountArgs} args - Arguments to filter ExamQuestions to count.
     * @example
     * // Count the number of ExamQuestions
     * const count = await prisma.examQuestion.count({
     *   where: {
     *     // ... the filter for the ExamQuestions we want to count
     *   }
     * })
    **/
    count<T extends ExamQuestionCountArgs>(
      args?: Subset<T, ExamQuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExamQuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExamQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamQuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ExamQuestionAggregateArgs>(args: Subset<T, ExamQuestionAggregateArgs>): Prisma.PrismaPromise<GetExamQuestionAggregateType<T>>

    /**
     * Group by ExamQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamQuestionGroupByArgs} args - Group by arguments.
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
      T extends ExamQuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExamQuestionGroupByArgs['orderBy'] }
        : { orderBy?: ExamQuestionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ExamQuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExamQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExamQuestion model
   */
  readonly fields: ExamQuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExamQuestion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExamQuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    exam<T extends ExamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExamDefaultArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ExamQuestion model
   */ 
  interface ExamQuestionFieldRefs {
    readonly id: FieldRef<"ExamQuestion", 'String'>
    readonly exam_id: FieldRef<"ExamQuestion", 'String'>
    readonly question_id: FieldRef<"ExamQuestion", 'String'>
    readonly points: FieldRef<"ExamQuestion", 'Float'>
    readonly order_index: FieldRef<"ExamQuestion", 'Int'>
    readonly required: FieldRef<"ExamQuestion", 'Boolean'>
    readonly created_at: FieldRef<"ExamQuestion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExamQuestion findUnique
   */
  export type ExamQuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamQuestion
     */
    select?: ExamQuestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamQuestionInclude<ExtArgs> | null
    /**
     * Filter, which ExamQuestion to fetch.
     */
    where: ExamQuestionWhereUniqueInput
  }

  /**
   * ExamQuestion findUniqueOrThrow
   */
  export type ExamQuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamQuestion
     */
    select?: ExamQuestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamQuestionInclude<ExtArgs> | null
    /**
     * Filter, which ExamQuestion to fetch.
     */
    where: ExamQuestionWhereUniqueInput
  }

  /**
   * ExamQuestion findFirst
   */
  export type ExamQuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamQuestion
     */
    select?: ExamQuestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamQuestionInclude<ExtArgs> | null
    /**
     * Filter, which ExamQuestion to fetch.
     */
    where?: ExamQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamQuestions to fetch.
     */
    orderBy?: ExamQuestionOrderByWithRelationInput | ExamQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamQuestions.
     */
    cursor?: ExamQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamQuestions.
     */
    distinct?: ExamQuestionScalarFieldEnum | ExamQuestionScalarFieldEnum[]
  }

  /**
   * ExamQuestion findFirstOrThrow
   */
  export type ExamQuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamQuestion
     */
    select?: ExamQuestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamQuestionInclude<ExtArgs> | null
    /**
     * Filter, which ExamQuestion to fetch.
     */
    where?: ExamQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamQuestions to fetch.
     */
    orderBy?: ExamQuestionOrderByWithRelationInput | ExamQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamQuestions.
     */
    cursor?: ExamQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamQuestions.
     */
    distinct?: ExamQuestionScalarFieldEnum | ExamQuestionScalarFieldEnum[]
  }

  /**
   * ExamQuestion findMany
   */
  export type ExamQuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamQuestion
     */
    select?: ExamQuestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamQuestionInclude<ExtArgs> | null
    /**
     * Filter, which ExamQuestions to fetch.
     */
    where?: ExamQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamQuestions to fetch.
     */
    orderBy?: ExamQuestionOrderByWithRelationInput | ExamQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExamQuestions.
     */
    cursor?: ExamQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamQuestions.
     */
    skip?: number
    distinct?: ExamQuestionScalarFieldEnum | ExamQuestionScalarFieldEnum[]
  }

  /**
   * ExamQuestion create
   */
  export type ExamQuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamQuestion
     */
    select?: ExamQuestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamQuestionInclude<ExtArgs> | null
    /**
     * The data needed to create a ExamQuestion.
     */
    data: XOR<ExamQuestionCreateInput, ExamQuestionUncheckedCreateInput>
  }

  /**
   * ExamQuestion createMany
   */
  export type ExamQuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExamQuestions.
     */
    data: ExamQuestionCreateManyInput | ExamQuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExamQuestion createManyAndReturn
   */
  export type ExamQuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamQuestion
     */
    select?: ExamQuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ExamQuestions.
     */
    data: ExamQuestionCreateManyInput | ExamQuestionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamQuestionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamQuestion update
   */
  export type ExamQuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamQuestion
     */
    select?: ExamQuestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamQuestionInclude<ExtArgs> | null
    /**
     * The data needed to update a ExamQuestion.
     */
    data: XOR<ExamQuestionUpdateInput, ExamQuestionUncheckedUpdateInput>
    /**
     * Choose, which ExamQuestion to update.
     */
    where: ExamQuestionWhereUniqueInput
  }

  /**
   * ExamQuestion updateMany
   */
  export type ExamQuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExamQuestions.
     */
    data: XOR<ExamQuestionUpdateManyMutationInput, ExamQuestionUncheckedUpdateManyInput>
    /**
     * Filter which ExamQuestions to update
     */
    where?: ExamQuestionWhereInput
  }

  /**
   * ExamQuestion upsert
   */
  export type ExamQuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamQuestion
     */
    select?: ExamQuestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamQuestionInclude<ExtArgs> | null
    /**
     * The filter to search for the ExamQuestion to update in case it exists.
     */
    where: ExamQuestionWhereUniqueInput
    /**
     * In case the ExamQuestion found by the `where` argument doesn't exist, create a new ExamQuestion with this data.
     */
    create: XOR<ExamQuestionCreateInput, ExamQuestionUncheckedCreateInput>
    /**
     * In case the ExamQuestion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExamQuestionUpdateInput, ExamQuestionUncheckedUpdateInput>
  }

  /**
   * ExamQuestion delete
   */
  export type ExamQuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamQuestion
     */
    select?: ExamQuestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamQuestionInclude<ExtArgs> | null
    /**
     * Filter which ExamQuestion to delete.
     */
    where: ExamQuestionWhereUniqueInput
  }

  /**
   * ExamQuestion deleteMany
   */
  export type ExamQuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamQuestions to delete
     */
    where?: ExamQuestionWhereInput
  }

  /**
   * ExamQuestion without action
   */
  export type ExamQuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamQuestion
     */
    select?: ExamQuestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamQuestionInclude<ExtArgs> | null
  }


  /**
   * Model ExamAttempt
   */

  export type AggregateExamAttempt = {
    _count: ExamAttemptCountAggregateOutputType | null
    _avg: ExamAttemptAvgAggregateOutputType | null
    _sum: ExamAttemptSumAggregateOutputType | null
    _min: ExamAttemptMinAggregateOutputType | null
    _max: ExamAttemptMaxAggregateOutputType | null
  }

  export type ExamAttemptAvgAggregateOutputType = {
    score: number | null
    max_score: number | null
    percentage: number | null
  }

  export type ExamAttemptSumAggregateOutputType = {
    score: number | null
    max_score: number | null
    percentage: number | null
  }

  export type ExamAttemptMinAggregateOutputType = {
    id: string | null
    exam_id: string | null
    student_id: string | null
    status: $Enums.ExamAttemptStatus | null
    score: number | null
    max_score: number | null
    percentage: number | null
    started_at: Date | null
    submitted_at: Date | null
    graded_at: Date | null
    created_at: Date | null
    updated_at: Date | null
    bkt_evidence_sent_at: Date | null
  }

  export type ExamAttemptMaxAggregateOutputType = {
    id: string | null
    exam_id: string | null
    student_id: string | null
    status: $Enums.ExamAttemptStatus | null
    score: number | null
    max_score: number | null
    percentage: number | null
    started_at: Date | null
    submitted_at: Date | null
    graded_at: Date | null
    created_at: Date | null
    updated_at: Date | null
    bkt_evidence_sent_at: Date | null
  }

  export type ExamAttemptCountAggregateOutputType = {
    id: number
    exam_id: number
    student_id: number
    status: number
    score: number
    max_score: number
    percentage: number
    started_at: number
    submitted_at: number
    graded_at: number
    created_at: number
    updated_at: number
    bkt_evidence_sent_at: number
    _all: number
  }


  export type ExamAttemptAvgAggregateInputType = {
    score?: true
    max_score?: true
    percentage?: true
  }

  export type ExamAttemptSumAggregateInputType = {
    score?: true
    max_score?: true
    percentage?: true
  }

  export type ExamAttemptMinAggregateInputType = {
    id?: true
    exam_id?: true
    student_id?: true
    status?: true
    score?: true
    max_score?: true
    percentage?: true
    started_at?: true
    submitted_at?: true
    graded_at?: true
    created_at?: true
    updated_at?: true
    bkt_evidence_sent_at?: true
  }

  export type ExamAttemptMaxAggregateInputType = {
    id?: true
    exam_id?: true
    student_id?: true
    status?: true
    score?: true
    max_score?: true
    percentage?: true
    started_at?: true
    submitted_at?: true
    graded_at?: true
    created_at?: true
    updated_at?: true
    bkt_evidence_sent_at?: true
  }

  export type ExamAttemptCountAggregateInputType = {
    id?: true
    exam_id?: true
    student_id?: true
    status?: true
    score?: true
    max_score?: true
    percentage?: true
    started_at?: true
    submitted_at?: true
    graded_at?: true
    created_at?: true
    updated_at?: true
    bkt_evidence_sent_at?: true
    _all?: true
  }

  export type ExamAttemptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamAttempt to aggregate.
     */
    where?: ExamAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAttempts to fetch.
     */
    orderBy?: ExamAttemptOrderByWithRelationInput | ExamAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExamAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExamAttempts
    **/
    _count?: true | ExamAttemptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExamAttemptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExamAttemptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExamAttemptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExamAttemptMaxAggregateInputType
  }

  export type GetExamAttemptAggregateType<T extends ExamAttemptAggregateArgs> = {
        [P in keyof T & keyof AggregateExamAttempt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExamAttempt[P]>
      : GetScalarType<T[P], AggregateExamAttempt[P]>
  }




  export type ExamAttemptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamAttemptWhereInput
    orderBy?: ExamAttemptOrderByWithAggregationInput | ExamAttemptOrderByWithAggregationInput[]
    by: ExamAttemptScalarFieldEnum[] | ExamAttemptScalarFieldEnum
    having?: ExamAttemptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExamAttemptCountAggregateInputType | true
    _avg?: ExamAttemptAvgAggregateInputType
    _sum?: ExamAttemptSumAggregateInputType
    _min?: ExamAttemptMinAggregateInputType
    _max?: ExamAttemptMaxAggregateInputType
  }

  export type ExamAttemptGroupByOutputType = {
    id: string
    exam_id: string
    student_id: string
    status: $Enums.ExamAttemptStatus
    score: number | null
    max_score: number | null
    percentage: number | null
    started_at: Date
    submitted_at: Date | null
    graded_at: Date | null
    created_at: Date
    updated_at: Date
    bkt_evidence_sent_at: Date | null
    _count: ExamAttemptCountAggregateOutputType | null
    _avg: ExamAttemptAvgAggregateOutputType | null
    _sum: ExamAttemptSumAggregateOutputType | null
    _min: ExamAttemptMinAggregateOutputType | null
    _max: ExamAttemptMaxAggregateOutputType | null
  }

  type GetExamAttemptGroupByPayload<T extends ExamAttemptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExamAttemptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExamAttemptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExamAttemptGroupByOutputType[P]>
            : GetScalarType<T[P], ExamAttemptGroupByOutputType[P]>
        }
      >
    >


  export type ExamAttemptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    exam_id?: boolean
    student_id?: boolean
    status?: boolean
    score?: boolean
    max_score?: boolean
    percentage?: boolean
    started_at?: boolean
    submitted_at?: boolean
    graded_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    bkt_evidence_sent_at?: boolean
    exam?: boolean | ExamDefaultArgs<ExtArgs>
    answers?: boolean | ExamAttempt$answersArgs<ExtArgs>
    _count?: boolean | ExamAttemptCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examAttempt"]>

  export type ExamAttemptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    exam_id?: boolean
    student_id?: boolean
    status?: boolean
    score?: boolean
    max_score?: boolean
    percentage?: boolean
    started_at?: boolean
    submitted_at?: boolean
    graded_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    bkt_evidence_sent_at?: boolean
    exam?: boolean | ExamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examAttempt"]>

  export type ExamAttemptSelectScalar = {
    id?: boolean
    exam_id?: boolean
    student_id?: boolean
    status?: boolean
    score?: boolean
    max_score?: boolean
    percentage?: boolean
    started_at?: boolean
    submitted_at?: boolean
    graded_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    bkt_evidence_sent_at?: boolean
  }

  export type ExamAttemptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exam?: boolean | ExamDefaultArgs<ExtArgs>
    answers?: boolean | ExamAttempt$answersArgs<ExtArgs>
    _count?: boolean | ExamAttemptCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExamAttemptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exam?: boolean | ExamDefaultArgs<ExtArgs>
  }

  export type $ExamAttemptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExamAttempt"
    objects: {
      exam: Prisma.$ExamPayload<ExtArgs>
      answers: Prisma.$ExamAnswerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      exam_id: string
      student_id: string
      status: $Enums.ExamAttemptStatus
      score: number | null
      max_score: number | null
      percentage: number | null
      started_at: Date
      submitted_at: Date | null
      graded_at: Date | null
      created_at: Date
      updated_at: Date
      bkt_evidence_sent_at: Date | null
    }, ExtArgs["result"]["examAttempt"]>
    composites: {}
  }

  type ExamAttemptGetPayload<S extends boolean | null | undefined | ExamAttemptDefaultArgs> = $Result.GetResult<Prisma.$ExamAttemptPayload, S>

  type ExamAttemptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ExamAttemptFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ExamAttemptCountAggregateInputType | true
    }

  export interface ExamAttemptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExamAttempt'], meta: { name: 'ExamAttempt' } }
    /**
     * Find zero or one ExamAttempt that matches the filter.
     * @param {ExamAttemptFindUniqueArgs} args - Arguments to find a ExamAttempt
     * @example
     * // Get one ExamAttempt
     * const examAttempt = await prisma.examAttempt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExamAttemptFindUniqueArgs>(args: SelectSubset<T, ExamAttemptFindUniqueArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ExamAttempt that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ExamAttemptFindUniqueOrThrowArgs} args - Arguments to find a ExamAttempt
     * @example
     * // Get one ExamAttempt
     * const examAttempt = await prisma.examAttempt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExamAttemptFindUniqueOrThrowArgs>(args: SelectSubset<T, ExamAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ExamAttempt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptFindFirstArgs} args - Arguments to find a ExamAttempt
     * @example
     * // Get one ExamAttempt
     * const examAttempt = await prisma.examAttempt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExamAttemptFindFirstArgs>(args?: SelectSubset<T, ExamAttemptFindFirstArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ExamAttempt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptFindFirstOrThrowArgs} args - Arguments to find a ExamAttempt
     * @example
     * // Get one ExamAttempt
     * const examAttempt = await prisma.examAttempt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExamAttemptFindFirstOrThrowArgs>(args?: SelectSubset<T, ExamAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ExamAttempts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExamAttempts
     * const examAttempts = await prisma.examAttempt.findMany()
     * 
     * // Get first 10 ExamAttempts
     * const examAttempts = await prisma.examAttempt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const examAttemptWithIdOnly = await prisma.examAttempt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExamAttemptFindManyArgs>(args?: SelectSubset<T, ExamAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ExamAttempt.
     * @param {ExamAttemptCreateArgs} args - Arguments to create a ExamAttempt.
     * @example
     * // Create one ExamAttempt
     * const ExamAttempt = await prisma.examAttempt.create({
     *   data: {
     *     // ... data to create a ExamAttempt
     *   }
     * })
     * 
     */
    create<T extends ExamAttemptCreateArgs>(args: SelectSubset<T, ExamAttemptCreateArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ExamAttempts.
     * @param {ExamAttemptCreateManyArgs} args - Arguments to create many ExamAttempts.
     * @example
     * // Create many ExamAttempts
     * const examAttempt = await prisma.examAttempt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExamAttemptCreateManyArgs>(args?: SelectSubset<T, ExamAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExamAttempts and returns the data saved in the database.
     * @param {ExamAttemptCreateManyAndReturnArgs} args - Arguments to create many ExamAttempts.
     * @example
     * // Create many ExamAttempts
     * const examAttempt = await prisma.examAttempt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExamAttempts and only return the `id`
     * const examAttemptWithIdOnly = await prisma.examAttempt.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExamAttemptCreateManyAndReturnArgs>(args?: SelectSubset<T, ExamAttemptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ExamAttempt.
     * @param {ExamAttemptDeleteArgs} args - Arguments to delete one ExamAttempt.
     * @example
     * // Delete one ExamAttempt
     * const ExamAttempt = await prisma.examAttempt.delete({
     *   where: {
     *     // ... filter to delete one ExamAttempt
     *   }
     * })
     * 
     */
    delete<T extends ExamAttemptDeleteArgs>(args: SelectSubset<T, ExamAttemptDeleteArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ExamAttempt.
     * @param {ExamAttemptUpdateArgs} args - Arguments to update one ExamAttempt.
     * @example
     * // Update one ExamAttempt
     * const examAttempt = await prisma.examAttempt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExamAttemptUpdateArgs>(args: SelectSubset<T, ExamAttemptUpdateArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ExamAttempts.
     * @param {ExamAttemptDeleteManyArgs} args - Arguments to filter ExamAttempts to delete.
     * @example
     * // Delete a few ExamAttempts
     * const { count } = await prisma.examAttempt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExamAttemptDeleteManyArgs>(args?: SelectSubset<T, ExamAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExamAttempts
     * const examAttempt = await prisma.examAttempt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExamAttemptUpdateManyArgs>(args: SelectSubset<T, ExamAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ExamAttempt.
     * @param {ExamAttemptUpsertArgs} args - Arguments to update or create a ExamAttempt.
     * @example
     * // Update or create a ExamAttempt
     * const examAttempt = await prisma.examAttempt.upsert({
     *   create: {
     *     // ... data to create a ExamAttempt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExamAttempt we want to update
     *   }
     * })
     */
    upsert<T extends ExamAttemptUpsertArgs>(args: SelectSubset<T, ExamAttemptUpsertArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ExamAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptCountArgs} args - Arguments to filter ExamAttempts to count.
     * @example
     * // Count the number of ExamAttempts
     * const count = await prisma.examAttempt.count({
     *   where: {
     *     // ... the filter for the ExamAttempts we want to count
     *   }
     * })
    **/
    count<T extends ExamAttemptCountArgs>(
      args?: Subset<T, ExamAttemptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExamAttemptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExamAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ExamAttemptAggregateArgs>(args: Subset<T, ExamAttemptAggregateArgs>): Prisma.PrismaPromise<GetExamAttemptAggregateType<T>>

    /**
     * Group by ExamAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAttemptGroupByArgs} args - Group by arguments.
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
      T extends ExamAttemptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExamAttemptGroupByArgs['orderBy'] }
        : { orderBy?: ExamAttemptGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ExamAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExamAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExamAttempt model
   */
  readonly fields: ExamAttemptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExamAttempt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExamAttemptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    exam<T extends ExamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExamDefaultArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    answers<T extends ExamAttempt$answersArgs<ExtArgs> = {}>(args?: Subset<T, ExamAttempt$answersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the ExamAttempt model
   */ 
  interface ExamAttemptFieldRefs {
    readonly id: FieldRef<"ExamAttempt", 'String'>
    readonly exam_id: FieldRef<"ExamAttempt", 'String'>
    readonly student_id: FieldRef<"ExamAttempt", 'String'>
    readonly status: FieldRef<"ExamAttempt", 'ExamAttemptStatus'>
    readonly score: FieldRef<"ExamAttempt", 'Float'>
    readonly max_score: FieldRef<"ExamAttempt", 'Float'>
    readonly percentage: FieldRef<"ExamAttempt", 'Float'>
    readonly started_at: FieldRef<"ExamAttempt", 'DateTime'>
    readonly submitted_at: FieldRef<"ExamAttempt", 'DateTime'>
    readonly graded_at: FieldRef<"ExamAttempt", 'DateTime'>
    readonly created_at: FieldRef<"ExamAttempt", 'DateTime'>
    readonly updated_at: FieldRef<"ExamAttempt", 'DateTime'>
    readonly bkt_evidence_sent_at: FieldRef<"ExamAttempt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExamAttempt findUnique
   */
  export type ExamAttemptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * Filter, which ExamAttempt to fetch.
     */
    where: ExamAttemptWhereUniqueInput
  }

  /**
   * ExamAttempt findUniqueOrThrow
   */
  export type ExamAttemptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * Filter, which ExamAttempt to fetch.
     */
    where: ExamAttemptWhereUniqueInput
  }

  /**
   * ExamAttempt findFirst
   */
  export type ExamAttemptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * Filter, which ExamAttempt to fetch.
     */
    where?: ExamAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAttempts to fetch.
     */
    orderBy?: ExamAttemptOrderByWithRelationInput | ExamAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamAttempts.
     */
    cursor?: ExamAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamAttempts.
     */
    distinct?: ExamAttemptScalarFieldEnum | ExamAttemptScalarFieldEnum[]
  }

  /**
   * ExamAttempt findFirstOrThrow
   */
  export type ExamAttemptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * Filter, which ExamAttempt to fetch.
     */
    where?: ExamAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAttempts to fetch.
     */
    orderBy?: ExamAttemptOrderByWithRelationInput | ExamAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamAttempts.
     */
    cursor?: ExamAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamAttempts.
     */
    distinct?: ExamAttemptScalarFieldEnum | ExamAttemptScalarFieldEnum[]
  }

  /**
   * ExamAttempt findMany
   */
  export type ExamAttemptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * Filter, which ExamAttempts to fetch.
     */
    where?: ExamAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAttempts to fetch.
     */
    orderBy?: ExamAttemptOrderByWithRelationInput | ExamAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExamAttempts.
     */
    cursor?: ExamAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAttempts.
     */
    skip?: number
    distinct?: ExamAttemptScalarFieldEnum | ExamAttemptScalarFieldEnum[]
  }

  /**
   * ExamAttempt create
   */
  export type ExamAttemptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * The data needed to create a ExamAttempt.
     */
    data: XOR<ExamAttemptCreateInput, ExamAttemptUncheckedCreateInput>
  }

  /**
   * ExamAttempt createMany
   */
  export type ExamAttemptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExamAttempts.
     */
    data: ExamAttemptCreateManyInput | ExamAttemptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExamAttempt createManyAndReturn
   */
  export type ExamAttemptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ExamAttempts.
     */
    data: ExamAttemptCreateManyInput | ExamAttemptCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamAttempt update
   */
  export type ExamAttemptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * The data needed to update a ExamAttempt.
     */
    data: XOR<ExamAttemptUpdateInput, ExamAttemptUncheckedUpdateInput>
    /**
     * Choose, which ExamAttempt to update.
     */
    where: ExamAttemptWhereUniqueInput
  }

  /**
   * ExamAttempt updateMany
   */
  export type ExamAttemptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExamAttempts.
     */
    data: XOR<ExamAttemptUpdateManyMutationInput, ExamAttemptUncheckedUpdateManyInput>
    /**
     * Filter which ExamAttempts to update
     */
    where?: ExamAttemptWhereInput
  }

  /**
   * ExamAttempt upsert
   */
  export type ExamAttemptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * The filter to search for the ExamAttempt to update in case it exists.
     */
    where: ExamAttemptWhereUniqueInput
    /**
     * In case the ExamAttempt found by the `where` argument doesn't exist, create a new ExamAttempt with this data.
     */
    create: XOR<ExamAttemptCreateInput, ExamAttemptUncheckedCreateInput>
    /**
     * In case the ExamAttempt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExamAttemptUpdateInput, ExamAttemptUncheckedUpdateInput>
  }

  /**
   * ExamAttempt delete
   */
  export type ExamAttemptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
    /**
     * Filter which ExamAttempt to delete.
     */
    where: ExamAttemptWhereUniqueInput
  }

  /**
   * ExamAttempt deleteMany
   */
  export type ExamAttemptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamAttempts to delete
     */
    where?: ExamAttemptWhereInput
  }

  /**
   * ExamAttempt.answers
   */
  export type ExamAttempt$answersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    where?: ExamAnswerWhereInput
    orderBy?: ExamAnswerOrderByWithRelationInput | ExamAnswerOrderByWithRelationInput[]
    cursor?: ExamAnswerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExamAnswerScalarFieldEnum | ExamAnswerScalarFieldEnum[]
  }

  /**
   * ExamAttempt without action
   */
  export type ExamAttemptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAttempt
     */
    select?: ExamAttemptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAttemptInclude<ExtArgs> | null
  }


  /**
   * Model ExamAnswer
   */

  export type AggregateExamAnswer = {
    _count: ExamAnswerCountAggregateOutputType | null
    _avg: ExamAnswerAvgAggregateOutputType | null
    _sum: ExamAnswerSumAggregateOutputType | null
    _min: ExamAnswerMinAggregateOutputType | null
    _max: ExamAnswerMaxAggregateOutputType | null
  }

  export type ExamAnswerAvgAggregateOutputType = {
    points_earned: number | null
  }

  export type ExamAnswerSumAggregateOutputType = {
    points_earned: number | null
  }

  export type ExamAnswerMinAggregateOutputType = {
    id: string | null
    attempt_id: string | null
    question_id: string | null
    text_answer: string | null
    is_correct: boolean | null
    points_earned: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ExamAnswerMaxAggregateOutputType = {
    id: string | null
    attempt_id: string | null
    question_id: string | null
    text_answer: string | null
    is_correct: boolean | null
    points_earned: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ExamAnswerCountAggregateOutputType = {
    id: number
    attempt_id: number
    question_id: number
    selected_options: number
    text_answer: number
    is_correct: number
    points_earned: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ExamAnswerAvgAggregateInputType = {
    points_earned?: true
  }

  export type ExamAnswerSumAggregateInputType = {
    points_earned?: true
  }

  export type ExamAnswerMinAggregateInputType = {
    id?: true
    attempt_id?: true
    question_id?: true
    text_answer?: true
    is_correct?: true
    points_earned?: true
    created_at?: true
    updated_at?: true
  }

  export type ExamAnswerMaxAggregateInputType = {
    id?: true
    attempt_id?: true
    question_id?: true
    text_answer?: true
    is_correct?: true
    points_earned?: true
    created_at?: true
    updated_at?: true
  }

  export type ExamAnswerCountAggregateInputType = {
    id?: true
    attempt_id?: true
    question_id?: true
    selected_options?: true
    text_answer?: true
    is_correct?: true
    points_earned?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ExamAnswerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamAnswer to aggregate.
     */
    where?: ExamAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAnswers to fetch.
     */
    orderBy?: ExamAnswerOrderByWithRelationInput | ExamAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExamAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExamAnswers
    **/
    _count?: true | ExamAnswerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExamAnswerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExamAnswerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExamAnswerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExamAnswerMaxAggregateInputType
  }

  export type GetExamAnswerAggregateType<T extends ExamAnswerAggregateArgs> = {
        [P in keyof T & keyof AggregateExamAnswer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExamAnswer[P]>
      : GetScalarType<T[P], AggregateExamAnswer[P]>
  }




  export type ExamAnswerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamAnswerWhereInput
    orderBy?: ExamAnswerOrderByWithAggregationInput | ExamAnswerOrderByWithAggregationInput[]
    by: ExamAnswerScalarFieldEnum[] | ExamAnswerScalarFieldEnum
    having?: ExamAnswerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExamAnswerCountAggregateInputType | true
    _avg?: ExamAnswerAvgAggregateInputType
    _sum?: ExamAnswerSumAggregateInputType
    _min?: ExamAnswerMinAggregateInputType
    _max?: ExamAnswerMaxAggregateInputType
  }

  export type ExamAnswerGroupByOutputType = {
    id: string
    attempt_id: string
    question_id: string
    selected_options: string[]
    text_answer: string | null
    is_correct: boolean | null
    points_earned: number | null
    created_at: Date
    updated_at: Date
    _count: ExamAnswerCountAggregateOutputType | null
    _avg: ExamAnswerAvgAggregateOutputType | null
    _sum: ExamAnswerSumAggregateOutputType | null
    _min: ExamAnswerMinAggregateOutputType | null
    _max: ExamAnswerMaxAggregateOutputType | null
  }

  type GetExamAnswerGroupByPayload<T extends ExamAnswerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExamAnswerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExamAnswerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExamAnswerGroupByOutputType[P]>
            : GetScalarType<T[P], ExamAnswerGroupByOutputType[P]>
        }
      >
    >


  export type ExamAnswerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    attempt_id?: boolean
    question_id?: boolean
    selected_options?: boolean
    text_answer?: boolean
    is_correct?: boolean
    points_earned?: boolean
    created_at?: boolean
    updated_at?: boolean
    attempt?: boolean | ExamAttemptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examAnswer"]>

  export type ExamAnswerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    attempt_id?: boolean
    question_id?: boolean
    selected_options?: boolean
    text_answer?: boolean
    is_correct?: boolean
    points_earned?: boolean
    created_at?: boolean
    updated_at?: boolean
    attempt?: boolean | ExamAttemptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examAnswer"]>

  export type ExamAnswerSelectScalar = {
    id?: boolean
    attempt_id?: boolean
    question_id?: boolean
    selected_options?: boolean
    text_answer?: boolean
    is_correct?: boolean
    points_earned?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ExamAnswerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attempt?: boolean | ExamAttemptDefaultArgs<ExtArgs>
  }
  export type ExamAnswerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attempt?: boolean | ExamAttemptDefaultArgs<ExtArgs>
  }

  export type $ExamAnswerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExamAnswer"
    objects: {
      attempt: Prisma.$ExamAttemptPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      attempt_id: string
      question_id: string
      selected_options: string[]
      text_answer: string | null
      is_correct: boolean | null
      points_earned: number | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["examAnswer"]>
    composites: {}
  }

  type ExamAnswerGetPayload<S extends boolean | null | undefined | ExamAnswerDefaultArgs> = $Result.GetResult<Prisma.$ExamAnswerPayload, S>

  type ExamAnswerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ExamAnswerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ExamAnswerCountAggregateInputType | true
    }

  export interface ExamAnswerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExamAnswer'], meta: { name: 'ExamAnswer' } }
    /**
     * Find zero or one ExamAnswer that matches the filter.
     * @param {ExamAnswerFindUniqueArgs} args - Arguments to find a ExamAnswer
     * @example
     * // Get one ExamAnswer
     * const examAnswer = await prisma.examAnswer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExamAnswerFindUniqueArgs>(args: SelectSubset<T, ExamAnswerFindUniqueArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ExamAnswer that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ExamAnswerFindUniqueOrThrowArgs} args - Arguments to find a ExamAnswer
     * @example
     * // Get one ExamAnswer
     * const examAnswer = await prisma.examAnswer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExamAnswerFindUniqueOrThrowArgs>(args: SelectSubset<T, ExamAnswerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ExamAnswer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerFindFirstArgs} args - Arguments to find a ExamAnswer
     * @example
     * // Get one ExamAnswer
     * const examAnswer = await prisma.examAnswer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExamAnswerFindFirstArgs>(args?: SelectSubset<T, ExamAnswerFindFirstArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ExamAnswer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerFindFirstOrThrowArgs} args - Arguments to find a ExamAnswer
     * @example
     * // Get one ExamAnswer
     * const examAnswer = await prisma.examAnswer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExamAnswerFindFirstOrThrowArgs>(args?: SelectSubset<T, ExamAnswerFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ExamAnswers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExamAnswers
     * const examAnswers = await prisma.examAnswer.findMany()
     * 
     * // Get first 10 ExamAnswers
     * const examAnswers = await prisma.examAnswer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const examAnswerWithIdOnly = await prisma.examAnswer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExamAnswerFindManyArgs>(args?: SelectSubset<T, ExamAnswerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ExamAnswer.
     * @param {ExamAnswerCreateArgs} args - Arguments to create a ExamAnswer.
     * @example
     * // Create one ExamAnswer
     * const ExamAnswer = await prisma.examAnswer.create({
     *   data: {
     *     // ... data to create a ExamAnswer
     *   }
     * })
     * 
     */
    create<T extends ExamAnswerCreateArgs>(args: SelectSubset<T, ExamAnswerCreateArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ExamAnswers.
     * @param {ExamAnswerCreateManyArgs} args - Arguments to create many ExamAnswers.
     * @example
     * // Create many ExamAnswers
     * const examAnswer = await prisma.examAnswer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExamAnswerCreateManyArgs>(args?: SelectSubset<T, ExamAnswerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExamAnswers and returns the data saved in the database.
     * @param {ExamAnswerCreateManyAndReturnArgs} args - Arguments to create many ExamAnswers.
     * @example
     * // Create many ExamAnswers
     * const examAnswer = await prisma.examAnswer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExamAnswers and only return the `id`
     * const examAnswerWithIdOnly = await prisma.examAnswer.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExamAnswerCreateManyAndReturnArgs>(args?: SelectSubset<T, ExamAnswerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ExamAnswer.
     * @param {ExamAnswerDeleteArgs} args - Arguments to delete one ExamAnswer.
     * @example
     * // Delete one ExamAnswer
     * const ExamAnswer = await prisma.examAnswer.delete({
     *   where: {
     *     // ... filter to delete one ExamAnswer
     *   }
     * })
     * 
     */
    delete<T extends ExamAnswerDeleteArgs>(args: SelectSubset<T, ExamAnswerDeleteArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ExamAnswer.
     * @param {ExamAnswerUpdateArgs} args - Arguments to update one ExamAnswer.
     * @example
     * // Update one ExamAnswer
     * const examAnswer = await prisma.examAnswer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExamAnswerUpdateArgs>(args: SelectSubset<T, ExamAnswerUpdateArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ExamAnswers.
     * @param {ExamAnswerDeleteManyArgs} args - Arguments to filter ExamAnswers to delete.
     * @example
     * // Delete a few ExamAnswers
     * const { count } = await prisma.examAnswer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExamAnswerDeleteManyArgs>(args?: SelectSubset<T, ExamAnswerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamAnswers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExamAnswers
     * const examAnswer = await prisma.examAnswer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExamAnswerUpdateManyArgs>(args: SelectSubset<T, ExamAnswerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ExamAnswer.
     * @param {ExamAnswerUpsertArgs} args - Arguments to update or create a ExamAnswer.
     * @example
     * // Update or create a ExamAnswer
     * const examAnswer = await prisma.examAnswer.upsert({
     *   create: {
     *     // ... data to create a ExamAnswer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExamAnswer we want to update
     *   }
     * })
     */
    upsert<T extends ExamAnswerUpsertArgs>(args: SelectSubset<T, ExamAnswerUpsertArgs<ExtArgs>>): Prisma__ExamAnswerClient<$Result.GetResult<Prisma.$ExamAnswerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ExamAnswers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerCountArgs} args - Arguments to filter ExamAnswers to count.
     * @example
     * // Count the number of ExamAnswers
     * const count = await prisma.examAnswer.count({
     *   where: {
     *     // ... the filter for the ExamAnswers we want to count
     *   }
     * })
    **/
    count<T extends ExamAnswerCountArgs>(
      args?: Subset<T, ExamAnswerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExamAnswerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExamAnswer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ExamAnswerAggregateArgs>(args: Subset<T, ExamAnswerAggregateArgs>): Prisma.PrismaPromise<GetExamAnswerAggregateType<T>>

    /**
     * Group by ExamAnswer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAnswerGroupByArgs} args - Group by arguments.
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
      T extends ExamAnswerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExamAnswerGroupByArgs['orderBy'] }
        : { orderBy?: ExamAnswerGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ExamAnswerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExamAnswerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExamAnswer model
   */
  readonly fields: ExamAnswerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExamAnswer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExamAnswerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    attempt<T extends ExamAttemptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExamAttemptDefaultArgs<ExtArgs>>): Prisma__ExamAttemptClient<$Result.GetResult<Prisma.$ExamAttemptPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ExamAnswer model
   */ 
  interface ExamAnswerFieldRefs {
    readonly id: FieldRef<"ExamAnswer", 'String'>
    readonly attempt_id: FieldRef<"ExamAnswer", 'String'>
    readonly question_id: FieldRef<"ExamAnswer", 'String'>
    readonly selected_options: FieldRef<"ExamAnswer", 'String[]'>
    readonly text_answer: FieldRef<"ExamAnswer", 'String'>
    readonly is_correct: FieldRef<"ExamAnswer", 'Boolean'>
    readonly points_earned: FieldRef<"ExamAnswer", 'Float'>
    readonly created_at: FieldRef<"ExamAnswer", 'DateTime'>
    readonly updated_at: FieldRef<"ExamAnswer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExamAnswer findUnique
   */
  export type ExamAnswerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ExamAnswer to fetch.
     */
    where: ExamAnswerWhereUniqueInput
  }

  /**
   * ExamAnswer findUniqueOrThrow
   */
  export type ExamAnswerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ExamAnswer to fetch.
     */
    where: ExamAnswerWhereUniqueInput
  }

  /**
   * ExamAnswer findFirst
   */
  export type ExamAnswerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ExamAnswer to fetch.
     */
    where?: ExamAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAnswers to fetch.
     */
    orderBy?: ExamAnswerOrderByWithRelationInput | ExamAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamAnswers.
     */
    cursor?: ExamAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamAnswers.
     */
    distinct?: ExamAnswerScalarFieldEnum | ExamAnswerScalarFieldEnum[]
  }

  /**
   * ExamAnswer findFirstOrThrow
   */
  export type ExamAnswerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ExamAnswer to fetch.
     */
    where?: ExamAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAnswers to fetch.
     */
    orderBy?: ExamAnswerOrderByWithRelationInput | ExamAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamAnswers.
     */
    cursor?: ExamAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamAnswers.
     */
    distinct?: ExamAnswerScalarFieldEnum | ExamAnswerScalarFieldEnum[]
  }

  /**
   * ExamAnswer findMany
   */
  export type ExamAnswerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * Filter, which ExamAnswers to fetch.
     */
    where?: ExamAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamAnswers to fetch.
     */
    orderBy?: ExamAnswerOrderByWithRelationInput | ExamAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExamAnswers.
     */
    cursor?: ExamAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamAnswers.
     */
    skip?: number
    distinct?: ExamAnswerScalarFieldEnum | ExamAnswerScalarFieldEnum[]
  }

  /**
   * ExamAnswer create
   */
  export type ExamAnswerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * The data needed to create a ExamAnswer.
     */
    data: XOR<ExamAnswerCreateInput, ExamAnswerUncheckedCreateInput>
  }

  /**
   * ExamAnswer createMany
   */
  export type ExamAnswerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExamAnswers.
     */
    data: ExamAnswerCreateManyInput | ExamAnswerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExamAnswer createManyAndReturn
   */
  export type ExamAnswerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ExamAnswers.
     */
    data: ExamAnswerCreateManyInput | ExamAnswerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamAnswer update
   */
  export type ExamAnswerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * The data needed to update a ExamAnswer.
     */
    data: XOR<ExamAnswerUpdateInput, ExamAnswerUncheckedUpdateInput>
    /**
     * Choose, which ExamAnswer to update.
     */
    where: ExamAnswerWhereUniqueInput
  }

  /**
   * ExamAnswer updateMany
   */
  export type ExamAnswerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExamAnswers.
     */
    data: XOR<ExamAnswerUpdateManyMutationInput, ExamAnswerUncheckedUpdateManyInput>
    /**
     * Filter which ExamAnswers to update
     */
    where?: ExamAnswerWhereInput
  }

  /**
   * ExamAnswer upsert
   */
  export type ExamAnswerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * The filter to search for the ExamAnswer to update in case it exists.
     */
    where: ExamAnswerWhereUniqueInput
    /**
     * In case the ExamAnswer found by the `where` argument doesn't exist, create a new ExamAnswer with this data.
     */
    create: XOR<ExamAnswerCreateInput, ExamAnswerUncheckedCreateInput>
    /**
     * In case the ExamAnswer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExamAnswerUpdateInput, ExamAnswerUncheckedUpdateInput>
  }

  /**
   * ExamAnswer delete
   */
  export type ExamAnswerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
    /**
     * Filter which ExamAnswer to delete.
     */
    where: ExamAnswerWhereUniqueInput
  }

  /**
   * ExamAnswer deleteMany
   */
  export type ExamAnswerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamAnswers to delete
     */
    where?: ExamAnswerWhereInput
  }

  /**
   * ExamAnswer without action
   */
  export type ExamAnswerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamAnswer
     */
    select?: ExamAnswerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamAnswerInclude<ExtArgs> | null
  }


  /**
   * Model QuestionSkillMapping
   */

  export type AggregateQuestionSkillMapping = {
    _count: QuestionSkillMappingCountAggregateOutputType | null
    _min: QuestionSkillMappingMinAggregateOutputType | null
    _max: QuestionSkillMappingMaxAggregateOutputType | null
  }

  export type QuestionSkillMappingMinAggregateOutputType = {
    id: string | null
    question_id: string | null
    skill_id: string | null
    created_at: Date | null
    created_by: string | null
  }

  export type QuestionSkillMappingMaxAggregateOutputType = {
    id: string | null
    question_id: string | null
    skill_id: string | null
    created_at: Date | null
    created_by: string | null
  }

  export type QuestionSkillMappingCountAggregateOutputType = {
    id: number
    question_id: number
    skill_id: number
    created_at: number
    created_by: number
    _all: number
  }


  export type QuestionSkillMappingMinAggregateInputType = {
    id?: true
    question_id?: true
    skill_id?: true
    created_at?: true
    created_by?: true
  }

  export type QuestionSkillMappingMaxAggregateInputType = {
    id?: true
    question_id?: true
    skill_id?: true
    created_at?: true
    created_by?: true
  }

  export type QuestionSkillMappingCountAggregateInputType = {
    id?: true
    question_id?: true
    skill_id?: true
    created_at?: true
    created_by?: true
    _all?: true
  }

  export type QuestionSkillMappingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuestionSkillMapping to aggregate.
     */
    where?: QuestionSkillMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuestionSkillMappings to fetch.
     */
    orderBy?: QuestionSkillMappingOrderByWithRelationInput | QuestionSkillMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuestionSkillMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuestionSkillMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuestionSkillMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuestionSkillMappings
    **/
    _count?: true | QuestionSkillMappingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuestionSkillMappingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuestionSkillMappingMaxAggregateInputType
  }

  export type GetQuestionSkillMappingAggregateType<T extends QuestionSkillMappingAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestionSkillMapping]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestionSkillMapping[P]>
      : GetScalarType<T[P], AggregateQuestionSkillMapping[P]>
  }




  export type QuestionSkillMappingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionSkillMappingWhereInput
    orderBy?: QuestionSkillMappingOrderByWithAggregationInput | QuestionSkillMappingOrderByWithAggregationInput[]
    by: QuestionSkillMappingScalarFieldEnum[] | QuestionSkillMappingScalarFieldEnum
    having?: QuestionSkillMappingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuestionSkillMappingCountAggregateInputType | true
    _min?: QuestionSkillMappingMinAggregateInputType
    _max?: QuestionSkillMappingMaxAggregateInputType
  }

  export type QuestionSkillMappingGroupByOutputType = {
    id: string
    question_id: string
    skill_id: string
    created_at: Date
    created_by: string | null
    _count: QuestionSkillMappingCountAggregateOutputType | null
    _min: QuestionSkillMappingMinAggregateOutputType | null
    _max: QuestionSkillMappingMaxAggregateOutputType | null
  }

  type GetQuestionSkillMappingGroupByPayload<T extends QuestionSkillMappingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuestionSkillMappingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuestionSkillMappingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuestionSkillMappingGroupByOutputType[P]>
            : GetScalarType<T[P], QuestionSkillMappingGroupByOutputType[P]>
        }
      >
    >


  export type QuestionSkillMappingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question_id?: boolean
    skill_id?: boolean
    created_at?: boolean
    created_by?: boolean
  }, ExtArgs["result"]["questionSkillMapping"]>

  export type QuestionSkillMappingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question_id?: boolean
    skill_id?: boolean
    created_at?: boolean
    created_by?: boolean
  }, ExtArgs["result"]["questionSkillMapping"]>

  export type QuestionSkillMappingSelectScalar = {
    id?: boolean
    question_id?: boolean
    skill_id?: boolean
    created_at?: boolean
    created_by?: boolean
  }


  export type $QuestionSkillMappingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuestionSkillMapping"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      question_id: string
      skill_id: string
      created_at: Date
      created_by: string | null
    }, ExtArgs["result"]["questionSkillMapping"]>
    composites: {}
  }

  type QuestionSkillMappingGetPayload<S extends boolean | null | undefined | QuestionSkillMappingDefaultArgs> = $Result.GetResult<Prisma.$QuestionSkillMappingPayload, S>

  type QuestionSkillMappingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<QuestionSkillMappingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: QuestionSkillMappingCountAggregateInputType | true
    }

  export interface QuestionSkillMappingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuestionSkillMapping'], meta: { name: 'QuestionSkillMapping' } }
    /**
     * Find zero or one QuestionSkillMapping that matches the filter.
     * @param {QuestionSkillMappingFindUniqueArgs} args - Arguments to find a QuestionSkillMapping
     * @example
     * // Get one QuestionSkillMapping
     * const questionSkillMapping = await prisma.questionSkillMapping.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuestionSkillMappingFindUniqueArgs>(args: SelectSubset<T, QuestionSkillMappingFindUniqueArgs<ExtArgs>>): Prisma__QuestionSkillMappingClient<$Result.GetResult<Prisma.$QuestionSkillMappingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one QuestionSkillMapping that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {QuestionSkillMappingFindUniqueOrThrowArgs} args - Arguments to find a QuestionSkillMapping
     * @example
     * // Get one QuestionSkillMapping
     * const questionSkillMapping = await prisma.questionSkillMapping.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuestionSkillMappingFindUniqueOrThrowArgs>(args: SelectSubset<T, QuestionSkillMappingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuestionSkillMappingClient<$Result.GetResult<Prisma.$QuestionSkillMappingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first QuestionSkillMapping that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionSkillMappingFindFirstArgs} args - Arguments to find a QuestionSkillMapping
     * @example
     * // Get one QuestionSkillMapping
     * const questionSkillMapping = await prisma.questionSkillMapping.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuestionSkillMappingFindFirstArgs>(args?: SelectSubset<T, QuestionSkillMappingFindFirstArgs<ExtArgs>>): Prisma__QuestionSkillMappingClient<$Result.GetResult<Prisma.$QuestionSkillMappingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first QuestionSkillMapping that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionSkillMappingFindFirstOrThrowArgs} args - Arguments to find a QuestionSkillMapping
     * @example
     * // Get one QuestionSkillMapping
     * const questionSkillMapping = await prisma.questionSkillMapping.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuestionSkillMappingFindFirstOrThrowArgs>(args?: SelectSubset<T, QuestionSkillMappingFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuestionSkillMappingClient<$Result.GetResult<Prisma.$QuestionSkillMappingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more QuestionSkillMappings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionSkillMappingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuestionSkillMappings
     * const questionSkillMappings = await prisma.questionSkillMapping.findMany()
     * 
     * // Get first 10 QuestionSkillMappings
     * const questionSkillMappings = await prisma.questionSkillMapping.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const questionSkillMappingWithIdOnly = await prisma.questionSkillMapping.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuestionSkillMappingFindManyArgs>(args?: SelectSubset<T, QuestionSkillMappingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionSkillMappingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a QuestionSkillMapping.
     * @param {QuestionSkillMappingCreateArgs} args - Arguments to create a QuestionSkillMapping.
     * @example
     * // Create one QuestionSkillMapping
     * const QuestionSkillMapping = await prisma.questionSkillMapping.create({
     *   data: {
     *     // ... data to create a QuestionSkillMapping
     *   }
     * })
     * 
     */
    create<T extends QuestionSkillMappingCreateArgs>(args: SelectSubset<T, QuestionSkillMappingCreateArgs<ExtArgs>>): Prisma__QuestionSkillMappingClient<$Result.GetResult<Prisma.$QuestionSkillMappingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many QuestionSkillMappings.
     * @param {QuestionSkillMappingCreateManyArgs} args - Arguments to create many QuestionSkillMappings.
     * @example
     * // Create many QuestionSkillMappings
     * const questionSkillMapping = await prisma.questionSkillMapping.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuestionSkillMappingCreateManyArgs>(args?: SelectSubset<T, QuestionSkillMappingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuestionSkillMappings and returns the data saved in the database.
     * @param {QuestionSkillMappingCreateManyAndReturnArgs} args - Arguments to create many QuestionSkillMappings.
     * @example
     * // Create many QuestionSkillMappings
     * const questionSkillMapping = await prisma.questionSkillMapping.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuestionSkillMappings and only return the `id`
     * const questionSkillMappingWithIdOnly = await prisma.questionSkillMapping.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuestionSkillMappingCreateManyAndReturnArgs>(args?: SelectSubset<T, QuestionSkillMappingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionSkillMappingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a QuestionSkillMapping.
     * @param {QuestionSkillMappingDeleteArgs} args - Arguments to delete one QuestionSkillMapping.
     * @example
     * // Delete one QuestionSkillMapping
     * const QuestionSkillMapping = await prisma.questionSkillMapping.delete({
     *   where: {
     *     // ... filter to delete one QuestionSkillMapping
     *   }
     * })
     * 
     */
    delete<T extends QuestionSkillMappingDeleteArgs>(args: SelectSubset<T, QuestionSkillMappingDeleteArgs<ExtArgs>>): Prisma__QuestionSkillMappingClient<$Result.GetResult<Prisma.$QuestionSkillMappingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one QuestionSkillMapping.
     * @param {QuestionSkillMappingUpdateArgs} args - Arguments to update one QuestionSkillMapping.
     * @example
     * // Update one QuestionSkillMapping
     * const questionSkillMapping = await prisma.questionSkillMapping.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuestionSkillMappingUpdateArgs>(args: SelectSubset<T, QuestionSkillMappingUpdateArgs<ExtArgs>>): Prisma__QuestionSkillMappingClient<$Result.GetResult<Prisma.$QuestionSkillMappingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more QuestionSkillMappings.
     * @param {QuestionSkillMappingDeleteManyArgs} args - Arguments to filter QuestionSkillMappings to delete.
     * @example
     * // Delete a few QuestionSkillMappings
     * const { count } = await prisma.questionSkillMapping.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuestionSkillMappingDeleteManyArgs>(args?: SelectSubset<T, QuestionSkillMappingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuestionSkillMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionSkillMappingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuestionSkillMappings
     * const questionSkillMapping = await prisma.questionSkillMapping.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuestionSkillMappingUpdateManyArgs>(args: SelectSubset<T, QuestionSkillMappingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QuestionSkillMapping.
     * @param {QuestionSkillMappingUpsertArgs} args - Arguments to update or create a QuestionSkillMapping.
     * @example
     * // Update or create a QuestionSkillMapping
     * const questionSkillMapping = await prisma.questionSkillMapping.upsert({
     *   create: {
     *     // ... data to create a QuestionSkillMapping
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuestionSkillMapping we want to update
     *   }
     * })
     */
    upsert<T extends QuestionSkillMappingUpsertArgs>(args: SelectSubset<T, QuestionSkillMappingUpsertArgs<ExtArgs>>): Prisma__QuestionSkillMappingClient<$Result.GetResult<Prisma.$QuestionSkillMappingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of QuestionSkillMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionSkillMappingCountArgs} args - Arguments to filter QuestionSkillMappings to count.
     * @example
     * // Count the number of QuestionSkillMappings
     * const count = await prisma.questionSkillMapping.count({
     *   where: {
     *     // ... the filter for the QuestionSkillMappings we want to count
     *   }
     * })
    **/
    count<T extends QuestionSkillMappingCountArgs>(
      args?: Subset<T, QuestionSkillMappingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuestionSkillMappingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuestionSkillMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionSkillMappingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuestionSkillMappingAggregateArgs>(args: Subset<T, QuestionSkillMappingAggregateArgs>): Prisma.PrismaPromise<GetQuestionSkillMappingAggregateType<T>>

    /**
     * Group by QuestionSkillMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionSkillMappingGroupByArgs} args - Group by arguments.
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
      T extends QuestionSkillMappingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuestionSkillMappingGroupByArgs['orderBy'] }
        : { orderBy?: QuestionSkillMappingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuestionSkillMappingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionSkillMappingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuestionSkillMapping model
   */
  readonly fields: QuestionSkillMappingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuestionSkillMapping.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuestionSkillMappingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the QuestionSkillMapping model
   */ 
  interface QuestionSkillMappingFieldRefs {
    readonly id: FieldRef<"QuestionSkillMapping", 'String'>
    readonly question_id: FieldRef<"QuestionSkillMapping", 'String'>
    readonly skill_id: FieldRef<"QuestionSkillMapping", 'String'>
    readonly created_at: FieldRef<"QuestionSkillMapping", 'DateTime'>
    readonly created_by: FieldRef<"QuestionSkillMapping", 'String'>
  }
    

  // Custom InputTypes
  /**
   * QuestionSkillMapping findUnique
   */
  export type QuestionSkillMappingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionSkillMapping
     */
    select?: QuestionSkillMappingSelect<ExtArgs> | null
    /**
     * Filter, which QuestionSkillMapping to fetch.
     */
    where: QuestionSkillMappingWhereUniqueInput
  }

  /**
   * QuestionSkillMapping findUniqueOrThrow
   */
  export type QuestionSkillMappingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionSkillMapping
     */
    select?: QuestionSkillMappingSelect<ExtArgs> | null
    /**
     * Filter, which QuestionSkillMapping to fetch.
     */
    where: QuestionSkillMappingWhereUniqueInput
  }

  /**
   * QuestionSkillMapping findFirst
   */
  export type QuestionSkillMappingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionSkillMapping
     */
    select?: QuestionSkillMappingSelect<ExtArgs> | null
    /**
     * Filter, which QuestionSkillMapping to fetch.
     */
    where?: QuestionSkillMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuestionSkillMappings to fetch.
     */
    orderBy?: QuestionSkillMappingOrderByWithRelationInput | QuestionSkillMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuestionSkillMappings.
     */
    cursor?: QuestionSkillMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuestionSkillMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuestionSkillMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuestionSkillMappings.
     */
    distinct?: QuestionSkillMappingScalarFieldEnum | QuestionSkillMappingScalarFieldEnum[]
  }

  /**
   * QuestionSkillMapping findFirstOrThrow
   */
  export type QuestionSkillMappingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionSkillMapping
     */
    select?: QuestionSkillMappingSelect<ExtArgs> | null
    /**
     * Filter, which QuestionSkillMapping to fetch.
     */
    where?: QuestionSkillMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuestionSkillMappings to fetch.
     */
    orderBy?: QuestionSkillMappingOrderByWithRelationInput | QuestionSkillMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuestionSkillMappings.
     */
    cursor?: QuestionSkillMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuestionSkillMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuestionSkillMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuestionSkillMappings.
     */
    distinct?: QuestionSkillMappingScalarFieldEnum | QuestionSkillMappingScalarFieldEnum[]
  }

  /**
   * QuestionSkillMapping findMany
   */
  export type QuestionSkillMappingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionSkillMapping
     */
    select?: QuestionSkillMappingSelect<ExtArgs> | null
    /**
     * Filter, which QuestionSkillMappings to fetch.
     */
    where?: QuestionSkillMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuestionSkillMappings to fetch.
     */
    orderBy?: QuestionSkillMappingOrderByWithRelationInput | QuestionSkillMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuestionSkillMappings.
     */
    cursor?: QuestionSkillMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuestionSkillMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuestionSkillMappings.
     */
    skip?: number
    distinct?: QuestionSkillMappingScalarFieldEnum | QuestionSkillMappingScalarFieldEnum[]
  }

  /**
   * QuestionSkillMapping create
   */
  export type QuestionSkillMappingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionSkillMapping
     */
    select?: QuestionSkillMappingSelect<ExtArgs> | null
    /**
     * The data needed to create a QuestionSkillMapping.
     */
    data: XOR<QuestionSkillMappingCreateInput, QuestionSkillMappingUncheckedCreateInput>
  }

  /**
   * QuestionSkillMapping createMany
   */
  export type QuestionSkillMappingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuestionSkillMappings.
     */
    data: QuestionSkillMappingCreateManyInput | QuestionSkillMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuestionSkillMapping createManyAndReturn
   */
  export type QuestionSkillMappingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionSkillMapping
     */
    select?: QuestionSkillMappingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many QuestionSkillMappings.
     */
    data: QuestionSkillMappingCreateManyInput | QuestionSkillMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuestionSkillMapping update
   */
  export type QuestionSkillMappingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionSkillMapping
     */
    select?: QuestionSkillMappingSelect<ExtArgs> | null
    /**
     * The data needed to update a QuestionSkillMapping.
     */
    data: XOR<QuestionSkillMappingUpdateInput, QuestionSkillMappingUncheckedUpdateInput>
    /**
     * Choose, which QuestionSkillMapping to update.
     */
    where: QuestionSkillMappingWhereUniqueInput
  }

  /**
   * QuestionSkillMapping updateMany
   */
  export type QuestionSkillMappingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuestionSkillMappings.
     */
    data: XOR<QuestionSkillMappingUpdateManyMutationInput, QuestionSkillMappingUncheckedUpdateManyInput>
    /**
     * Filter which QuestionSkillMappings to update
     */
    where?: QuestionSkillMappingWhereInput
  }

  /**
   * QuestionSkillMapping upsert
   */
  export type QuestionSkillMappingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionSkillMapping
     */
    select?: QuestionSkillMappingSelect<ExtArgs> | null
    /**
     * The filter to search for the QuestionSkillMapping to update in case it exists.
     */
    where: QuestionSkillMappingWhereUniqueInput
    /**
     * In case the QuestionSkillMapping found by the `where` argument doesn't exist, create a new QuestionSkillMapping with this data.
     */
    create: XOR<QuestionSkillMappingCreateInput, QuestionSkillMappingUncheckedCreateInput>
    /**
     * In case the QuestionSkillMapping was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuestionSkillMappingUpdateInput, QuestionSkillMappingUncheckedUpdateInput>
  }

  /**
   * QuestionSkillMapping delete
   */
  export type QuestionSkillMappingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionSkillMapping
     */
    select?: QuestionSkillMappingSelect<ExtArgs> | null
    /**
     * Filter which QuestionSkillMapping to delete.
     */
    where: QuestionSkillMappingWhereUniqueInput
  }

  /**
   * QuestionSkillMapping deleteMany
   */
  export type QuestionSkillMappingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuestionSkillMappings to delete
     */
    where?: QuestionSkillMappingWhereInput
  }

  /**
   * QuestionSkillMapping without action
   */
  export type QuestionSkillMappingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionSkillMapping
     */
    select?: QuestionSkillMappingSelect<ExtArgs> | null
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


  export const ExamScalarFieldEnum: {
    id: 'id',
    class_id: 'class_id',
    teacher_id: 'teacher_id',
    title: 'title',
    description: 'description',
    status: 'status',
    time_limit: 'time_limit',
    passing_score: 'passing_score',
    max_score: 'max_score',
    max_attempts: 'max_attempts',
    shuffle_questions: 'shuffle_questions',
    show_results_immediately: 'show_results_immediately',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at'
  };

  export type ExamScalarFieldEnum = (typeof ExamScalarFieldEnum)[keyof typeof ExamScalarFieldEnum]


  export const ExamQuestionScalarFieldEnum: {
    id: 'id',
    exam_id: 'exam_id',
    question_id: 'question_id',
    points: 'points',
    order_index: 'order_index',
    required: 'required',
    created_at: 'created_at'
  };

  export type ExamQuestionScalarFieldEnum = (typeof ExamQuestionScalarFieldEnum)[keyof typeof ExamQuestionScalarFieldEnum]


  export const ExamAttemptScalarFieldEnum: {
    id: 'id',
    exam_id: 'exam_id',
    student_id: 'student_id',
    status: 'status',
    score: 'score',
    max_score: 'max_score',
    percentage: 'percentage',
    started_at: 'started_at',
    submitted_at: 'submitted_at',
    graded_at: 'graded_at',
    created_at: 'created_at',
    updated_at: 'updated_at',
    bkt_evidence_sent_at: 'bkt_evidence_sent_at'
  };

  export type ExamAttemptScalarFieldEnum = (typeof ExamAttemptScalarFieldEnum)[keyof typeof ExamAttemptScalarFieldEnum]


  export const ExamAnswerScalarFieldEnum: {
    id: 'id',
    attempt_id: 'attempt_id',
    question_id: 'question_id',
    selected_options: 'selected_options',
    text_answer: 'text_answer',
    is_correct: 'is_correct',
    points_earned: 'points_earned',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ExamAnswerScalarFieldEnum = (typeof ExamAnswerScalarFieldEnum)[keyof typeof ExamAnswerScalarFieldEnum]


  export const QuestionSkillMappingScalarFieldEnum: {
    id: 'id',
    question_id: 'question_id',
    skill_id: 'skill_id',
    created_at: 'created_at',
    created_by: 'created_by'
  };

  export type QuestionSkillMappingScalarFieldEnum = (typeof QuestionSkillMappingScalarFieldEnum)[keyof typeof QuestionSkillMappingScalarFieldEnum]


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
   * Reference to a field of type 'ExamStatus'
   */
  export type EnumExamStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExamStatus'>
    


  /**
   * Reference to a field of type 'ExamStatus[]'
   */
  export type ListEnumExamStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExamStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ExamAttemptStatus'
   */
  export type EnumExamAttemptStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExamAttemptStatus'>
    


  /**
   * Reference to a field of type 'ExamAttemptStatus[]'
   */
  export type ListEnumExamAttemptStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExamAttemptStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type ExamWhereInput = {
    AND?: ExamWhereInput | ExamWhereInput[]
    OR?: ExamWhereInput[]
    NOT?: ExamWhereInput | ExamWhereInput[]
    id?: StringFilter<"Exam"> | string
    class_id?: StringFilter<"Exam"> | string
    teacher_id?: StringFilter<"Exam"> | string
    title?: StringFilter<"Exam"> | string
    description?: StringNullableFilter<"Exam"> | string | null
    status?: EnumExamStatusFilter<"Exam"> | $Enums.ExamStatus
    time_limit?: IntNullableFilter<"Exam"> | number | null
    passing_score?: FloatFilter<"Exam"> | number
    max_score?: FloatFilter<"Exam"> | number
    max_attempts?: IntFilter<"Exam"> | number
    shuffle_questions?: BoolFilter<"Exam"> | boolean
    show_results_immediately?: BoolFilter<"Exam"> | boolean
    created_at?: DateTimeFilter<"Exam"> | Date | string
    updated_at?: DateTimeFilter<"Exam"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Exam"> | Date | string | null
    questions?: ExamQuestionListRelationFilter
    attempts?: ExamAttemptListRelationFilter
  }

  export type ExamOrderByWithRelationInput = {
    id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    time_limit?: SortOrderInput | SortOrder
    passing_score?: SortOrder
    max_score?: SortOrder
    max_attempts?: SortOrder
    shuffle_questions?: SortOrder
    show_results_immediately?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    questions?: ExamQuestionOrderByRelationAggregateInput
    attempts?: ExamAttemptOrderByRelationAggregateInput
  }

  export type ExamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExamWhereInput | ExamWhereInput[]
    OR?: ExamWhereInput[]
    NOT?: ExamWhereInput | ExamWhereInput[]
    class_id?: StringFilter<"Exam"> | string
    teacher_id?: StringFilter<"Exam"> | string
    title?: StringFilter<"Exam"> | string
    description?: StringNullableFilter<"Exam"> | string | null
    status?: EnumExamStatusFilter<"Exam"> | $Enums.ExamStatus
    time_limit?: IntNullableFilter<"Exam"> | number | null
    passing_score?: FloatFilter<"Exam"> | number
    max_score?: FloatFilter<"Exam"> | number
    max_attempts?: IntFilter<"Exam"> | number
    shuffle_questions?: BoolFilter<"Exam"> | boolean
    show_results_immediately?: BoolFilter<"Exam"> | boolean
    created_at?: DateTimeFilter<"Exam"> | Date | string
    updated_at?: DateTimeFilter<"Exam"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Exam"> | Date | string | null
    questions?: ExamQuestionListRelationFilter
    attempts?: ExamAttemptListRelationFilter
  }, "id">

  export type ExamOrderByWithAggregationInput = {
    id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    time_limit?: SortOrderInput | SortOrder
    passing_score?: SortOrder
    max_score?: SortOrder
    max_attempts?: SortOrder
    shuffle_questions?: SortOrder
    show_results_immediately?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    _count?: ExamCountOrderByAggregateInput
    _avg?: ExamAvgOrderByAggregateInput
    _max?: ExamMaxOrderByAggregateInput
    _min?: ExamMinOrderByAggregateInput
    _sum?: ExamSumOrderByAggregateInput
  }

  export type ExamScalarWhereWithAggregatesInput = {
    AND?: ExamScalarWhereWithAggregatesInput | ExamScalarWhereWithAggregatesInput[]
    OR?: ExamScalarWhereWithAggregatesInput[]
    NOT?: ExamScalarWhereWithAggregatesInput | ExamScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Exam"> | string
    class_id?: StringWithAggregatesFilter<"Exam"> | string
    teacher_id?: StringWithAggregatesFilter<"Exam"> | string
    title?: StringWithAggregatesFilter<"Exam"> | string
    description?: StringNullableWithAggregatesFilter<"Exam"> | string | null
    status?: EnumExamStatusWithAggregatesFilter<"Exam"> | $Enums.ExamStatus
    time_limit?: IntNullableWithAggregatesFilter<"Exam"> | number | null
    passing_score?: FloatWithAggregatesFilter<"Exam"> | number
    max_score?: FloatWithAggregatesFilter<"Exam"> | number
    max_attempts?: IntWithAggregatesFilter<"Exam"> | number
    shuffle_questions?: BoolWithAggregatesFilter<"Exam"> | boolean
    show_results_immediately?: BoolWithAggregatesFilter<"Exam"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"Exam"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Exam"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"Exam"> | Date | string | null
  }

  export type ExamQuestionWhereInput = {
    AND?: ExamQuestionWhereInput | ExamQuestionWhereInput[]
    OR?: ExamQuestionWhereInput[]
    NOT?: ExamQuestionWhereInput | ExamQuestionWhereInput[]
    id?: StringFilter<"ExamQuestion"> | string
    exam_id?: StringFilter<"ExamQuestion"> | string
    question_id?: StringFilter<"ExamQuestion"> | string
    points?: FloatFilter<"ExamQuestion"> | number
    order_index?: IntFilter<"ExamQuestion"> | number
    required?: BoolFilter<"ExamQuestion"> | boolean
    created_at?: DateTimeFilter<"ExamQuestion"> | Date | string
    exam?: XOR<ExamRelationFilter, ExamWhereInput>
  }

  export type ExamQuestionOrderByWithRelationInput = {
    id?: SortOrder
    exam_id?: SortOrder
    question_id?: SortOrder
    points?: SortOrder
    order_index?: SortOrder
    required?: SortOrder
    created_at?: SortOrder
    exam?: ExamOrderByWithRelationInput
  }

  export type ExamQuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    exam_id_question_id?: ExamQuestionExam_idQuestion_idCompoundUniqueInput
    AND?: ExamQuestionWhereInput | ExamQuestionWhereInput[]
    OR?: ExamQuestionWhereInput[]
    NOT?: ExamQuestionWhereInput | ExamQuestionWhereInput[]
    exam_id?: StringFilter<"ExamQuestion"> | string
    question_id?: StringFilter<"ExamQuestion"> | string
    points?: FloatFilter<"ExamQuestion"> | number
    order_index?: IntFilter<"ExamQuestion"> | number
    required?: BoolFilter<"ExamQuestion"> | boolean
    created_at?: DateTimeFilter<"ExamQuestion"> | Date | string
    exam?: XOR<ExamRelationFilter, ExamWhereInput>
  }, "id" | "exam_id_question_id">

  export type ExamQuestionOrderByWithAggregationInput = {
    id?: SortOrder
    exam_id?: SortOrder
    question_id?: SortOrder
    points?: SortOrder
    order_index?: SortOrder
    required?: SortOrder
    created_at?: SortOrder
    _count?: ExamQuestionCountOrderByAggregateInput
    _avg?: ExamQuestionAvgOrderByAggregateInput
    _max?: ExamQuestionMaxOrderByAggregateInput
    _min?: ExamQuestionMinOrderByAggregateInput
    _sum?: ExamQuestionSumOrderByAggregateInput
  }

  export type ExamQuestionScalarWhereWithAggregatesInput = {
    AND?: ExamQuestionScalarWhereWithAggregatesInput | ExamQuestionScalarWhereWithAggregatesInput[]
    OR?: ExamQuestionScalarWhereWithAggregatesInput[]
    NOT?: ExamQuestionScalarWhereWithAggregatesInput | ExamQuestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExamQuestion"> | string
    exam_id?: StringWithAggregatesFilter<"ExamQuestion"> | string
    question_id?: StringWithAggregatesFilter<"ExamQuestion"> | string
    points?: FloatWithAggregatesFilter<"ExamQuestion"> | number
    order_index?: IntWithAggregatesFilter<"ExamQuestion"> | number
    required?: BoolWithAggregatesFilter<"ExamQuestion"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"ExamQuestion"> | Date | string
  }

  export type ExamAttemptWhereInput = {
    AND?: ExamAttemptWhereInput | ExamAttemptWhereInput[]
    OR?: ExamAttemptWhereInput[]
    NOT?: ExamAttemptWhereInput | ExamAttemptWhereInput[]
    id?: StringFilter<"ExamAttempt"> | string
    exam_id?: StringFilter<"ExamAttempt"> | string
    student_id?: StringFilter<"ExamAttempt"> | string
    status?: EnumExamAttemptStatusFilter<"ExamAttempt"> | $Enums.ExamAttemptStatus
    score?: FloatNullableFilter<"ExamAttempt"> | number | null
    max_score?: FloatNullableFilter<"ExamAttempt"> | number | null
    percentage?: FloatNullableFilter<"ExamAttempt"> | number | null
    started_at?: DateTimeFilter<"ExamAttempt"> | Date | string
    submitted_at?: DateTimeNullableFilter<"ExamAttempt"> | Date | string | null
    graded_at?: DateTimeNullableFilter<"ExamAttempt"> | Date | string | null
    created_at?: DateTimeFilter<"ExamAttempt"> | Date | string
    updated_at?: DateTimeFilter<"ExamAttempt"> | Date | string
    bkt_evidence_sent_at?: DateTimeNullableFilter<"ExamAttempt"> | Date | string | null
    exam?: XOR<ExamRelationFilter, ExamWhereInput>
    answers?: ExamAnswerListRelationFilter
  }

  export type ExamAttemptOrderByWithRelationInput = {
    id?: SortOrder
    exam_id?: SortOrder
    student_id?: SortOrder
    status?: SortOrder
    score?: SortOrderInput | SortOrder
    max_score?: SortOrderInput | SortOrder
    percentage?: SortOrderInput | SortOrder
    started_at?: SortOrder
    submitted_at?: SortOrderInput | SortOrder
    graded_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    bkt_evidence_sent_at?: SortOrderInput | SortOrder
    exam?: ExamOrderByWithRelationInput
    answers?: ExamAnswerOrderByRelationAggregateInput
  }

  export type ExamAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    exam_id_student_id?: ExamAttemptExam_idStudent_idCompoundUniqueInput
    AND?: ExamAttemptWhereInput | ExamAttemptWhereInput[]
    OR?: ExamAttemptWhereInput[]
    NOT?: ExamAttemptWhereInput | ExamAttemptWhereInput[]
    exam_id?: StringFilter<"ExamAttempt"> | string
    student_id?: StringFilter<"ExamAttempt"> | string
    status?: EnumExamAttemptStatusFilter<"ExamAttempt"> | $Enums.ExamAttemptStatus
    score?: FloatNullableFilter<"ExamAttempt"> | number | null
    max_score?: FloatNullableFilter<"ExamAttempt"> | number | null
    percentage?: FloatNullableFilter<"ExamAttempt"> | number | null
    started_at?: DateTimeFilter<"ExamAttempt"> | Date | string
    submitted_at?: DateTimeNullableFilter<"ExamAttempt"> | Date | string | null
    graded_at?: DateTimeNullableFilter<"ExamAttempt"> | Date | string | null
    created_at?: DateTimeFilter<"ExamAttempt"> | Date | string
    updated_at?: DateTimeFilter<"ExamAttempt"> | Date | string
    bkt_evidence_sent_at?: DateTimeNullableFilter<"ExamAttempt"> | Date | string | null
    exam?: XOR<ExamRelationFilter, ExamWhereInput>
    answers?: ExamAnswerListRelationFilter
  }, "id" | "exam_id_student_id">

  export type ExamAttemptOrderByWithAggregationInput = {
    id?: SortOrder
    exam_id?: SortOrder
    student_id?: SortOrder
    status?: SortOrder
    score?: SortOrderInput | SortOrder
    max_score?: SortOrderInput | SortOrder
    percentage?: SortOrderInput | SortOrder
    started_at?: SortOrder
    submitted_at?: SortOrderInput | SortOrder
    graded_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    bkt_evidence_sent_at?: SortOrderInput | SortOrder
    _count?: ExamAttemptCountOrderByAggregateInput
    _avg?: ExamAttemptAvgOrderByAggregateInput
    _max?: ExamAttemptMaxOrderByAggregateInput
    _min?: ExamAttemptMinOrderByAggregateInput
    _sum?: ExamAttemptSumOrderByAggregateInput
  }

  export type ExamAttemptScalarWhereWithAggregatesInput = {
    AND?: ExamAttemptScalarWhereWithAggregatesInput | ExamAttemptScalarWhereWithAggregatesInput[]
    OR?: ExamAttemptScalarWhereWithAggregatesInput[]
    NOT?: ExamAttemptScalarWhereWithAggregatesInput | ExamAttemptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExamAttempt"> | string
    exam_id?: StringWithAggregatesFilter<"ExamAttempt"> | string
    student_id?: StringWithAggregatesFilter<"ExamAttempt"> | string
    status?: EnumExamAttemptStatusWithAggregatesFilter<"ExamAttempt"> | $Enums.ExamAttemptStatus
    score?: FloatNullableWithAggregatesFilter<"ExamAttempt"> | number | null
    max_score?: FloatNullableWithAggregatesFilter<"ExamAttempt"> | number | null
    percentage?: FloatNullableWithAggregatesFilter<"ExamAttempt"> | number | null
    started_at?: DateTimeWithAggregatesFilter<"ExamAttempt"> | Date | string
    submitted_at?: DateTimeNullableWithAggregatesFilter<"ExamAttempt"> | Date | string | null
    graded_at?: DateTimeNullableWithAggregatesFilter<"ExamAttempt"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"ExamAttempt"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ExamAttempt"> | Date | string
    bkt_evidence_sent_at?: DateTimeNullableWithAggregatesFilter<"ExamAttempt"> | Date | string | null
  }

  export type ExamAnswerWhereInput = {
    AND?: ExamAnswerWhereInput | ExamAnswerWhereInput[]
    OR?: ExamAnswerWhereInput[]
    NOT?: ExamAnswerWhereInput | ExamAnswerWhereInput[]
    id?: StringFilter<"ExamAnswer"> | string
    attempt_id?: StringFilter<"ExamAnswer"> | string
    question_id?: StringFilter<"ExamAnswer"> | string
    selected_options?: StringNullableListFilter<"ExamAnswer">
    text_answer?: StringNullableFilter<"ExamAnswer"> | string | null
    is_correct?: BoolNullableFilter<"ExamAnswer"> | boolean | null
    points_earned?: FloatNullableFilter<"ExamAnswer"> | number | null
    created_at?: DateTimeFilter<"ExamAnswer"> | Date | string
    updated_at?: DateTimeFilter<"ExamAnswer"> | Date | string
    attempt?: XOR<ExamAttemptRelationFilter, ExamAttemptWhereInput>
  }

  export type ExamAnswerOrderByWithRelationInput = {
    id?: SortOrder
    attempt_id?: SortOrder
    question_id?: SortOrder
    selected_options?: SortOrder
    text_answer?: SortOrderInput | SortOrder
    is_correct?: SortOrderInput | SortOrder
    points_earned?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    attempt?: ExamAttemptOrderByWithRelationInput
  }

  export type ExamAnswerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    attempt_id_question_id?: ExamAnswerAttempt_idQuestion_idCompoundUniqueInput
    AND?: ExamAnswerWhereInput | ExamAnswerWhereInput[]
    OR?: ExamAnswerWhereInput[]
    NOT?: ExamAnswerWhereInput | ExamAnswerWhereInput[]
    attempt_id?: StringFilter<"ExamAnswer"> | string
    question_id?: StringFilter<"ExamAnswer"> | string
    selected_options?: StringNullableListFilter<"ExamAnswer">
    text_answer?: StringNullableFilter<"ExamAnswer"> | string | null
    is_correct?: BoolNullableFilter<"ExamAnswer"> | boolean | null
    points_earned?: FloatNullableFilter<"ExamAnswer"> | number | null
    created_at?: DateTimeFilter<"ExamAnswer"> | Date | string
    updated_at?: DateTimeFilter<"ExamAnswer"> | Date | string
    attempt?: XOR<ExamAttemptRelationFilter, ExamAttemptWhereInput>
  }, "id" | "attempt_id_question_id">

  export type ExamAnswerOrderByWithAggregationInput = {
    id?: SortOrder
    attempt_id?: SortOrder
    question_id?: SortOrder
    selected_options?: SortOrder
    text_answer?: SortOrderInput | SortOrder
    is_correct?: SortOrderInput | SortOrder
    points_earned?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ExamAnswerCountOrderByAggregateInput
    _avg?: ExamAnswerAvgOrderByAggregateInput
    _max?: ExamAnswerMaxOrderByAggregateInput
    _min?: ExamAnswerMinOrderByAggregateInput
    _sum?: ExamAnswerSumOrderByAggregateInput
  }

  export type ExamAnswerScalarWhereWithAggregatesInput = {
    AND?: ExamAnswerScalarWhereWithAggregatesInput | ExamAnswerScalarWhereWithAggregatesInput[]
    OR?: ExamAnswerScalarWhereWithAggregatesInput[]
    NOT?: ExamAnswerScalarWhereWithAggregatesInput | ExamAnswerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExamAnswer"> | string
    attempt_id?: StringWithAggregatesFilter<"ExamAnswer"> | string
    question_id?: StringWithAggregatesFilter<"ExamAnswer"> | string
    selected_options?: StringNullableListFilter<"ExamAnswer">
    text_answer?: StringNullableWithAggregatesFilter<"ExamAnswer"> | string | null
    is_correct?: BoolNullableWithAggregatesFilter<"ExamAnswer"> | boolean | null
    points_earned?: FloatNullableWithAggregatesFilter<"ExamAnswer"> | number | null
    created_at?: DateTimeWithAggregatesFilter<"ExamAnswer"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ExamAnswer"> | Date | string
  }

  export type QuestionSkillMappingWhereInput = {
    AND?: QuestionSkillMappingWhereInput | QuestionSkillMappingWhereInput[]
    OR?: QuestionSkillMappingWhereInput[]
    NOT?: QuestionSkillMappingWhereInput | QuestionSkillMappingWhereInput[]
    id?: StringFilter<"QuestionSkillMapping"> | string
    question_id?: StringFilter<"QuestionSkillMapping"> | string
    skill_id?: StringFilter<"QuestionSkillMapping"> | string
    created_at?: DateTimeFilter<"QuestionSkillMapping"> | Date | string
    created_by?: StringNullableFilter<"QuestionSkillMapping"> | string | null
  }

  export type QuestionSkillMappingOrderByWithRelationInput = {
    id?: SortOrder
    question_id?: SortOrder
    skill_id?: SortOrder
    created_at?: SortOrder
    created_by?: SortOrderInput | SortOrder
  }

  export type QuestionSkillMappingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    question_id_skill_id?: QuestionSkillMappingQuestion_idSkill_idCompoundUniqueInput
    AND?: QuestionSkillMappingWhereInput | QuestionSkillMappingWhereInput[]
    OR?: QuestionSkillMappingWhereInput[]
    NOT?: QuestionSkillMappingWhereInput | QuestionSkillMappingWhereInput[]
    question_id?: StringFilter<"QuestionSkillMapping"> | string
    skill_id?: StringFilter<"QuestionSkillMapping"> | string
    created_at?: DateTimeFilter<"QuestionSkillMapping"> | Date | string
    created_by?: StringNullableFilter<"QuestionSkillMapping"> | string | null
  }, "id" | "question_id_skill_id">

  export type QuestionSkillMappingOrderByWithAggregationInput = {
    id?: SortOrder
    question_id?: SortOrder
    skill_id?: SortOrder
    created_at?: SortOrder
    created_by?: SortOrderInput | SortOrder
    _count?: QuestionSkillMappingCountOrderByAggregateInput
    _max?: QuestionSkillMappingMaxOrderByAggregateInput
    _min?: QuestionSkillMappingMinOrderByAggregateInput
  }

  export type QuestionSkillMappingScalarWhereWithAggregatesInput = {
    AND?: QuestionSkillMappingScalarWhereWithAggregatesInput | QuestionSkillMappingScalarWhereWithAggregatesInput[]
    OR?: QuestionSkillMappingScalarWhereWithAggregatesInput[]
    NOT?: QuestionSkillMappingScalarWhereWithAggregatesInput | QuestionSkillMappingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuestionSkillMapping"> | string
    question_id?: StringWithAggregatesFilter<"QuestionSkillMapping"> | string
    skill_id?: StringWithAggregatesFilter<"QuestionSkillMapping"> | string
    created_at?: DateTimeWithAggregatesFilter<"QuestionSkillMapping"> | Date | string
    created_by?: StringNullableWithAggregatesFilter<"QuestionSkillMapping"> | string | null
  }

  export type ExamCreateInput = {
    id?: string
    class_id: string
    teacher_id: string
    title: string
    description?: string | null
    status?: $Enums.ExamStatus
    time_limit?: number | null
    passing_score?: number
    max_score?: number
    max_attempts?: number
    shuffle_questions?: boolean
    show_results_immediately?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    questions?: ExamQuestionCreateNestedManyWithoutExamInput
    attempts?: ExamAttemptCreateNestedManyWithoutExamInput
  }

  export type ExamUncheckedCreateInput = {
    id?: string
    class_id: string
    teacher_id: string
    title: string
    description?: string | null
    status?: $Enums.ExamStatus
    time_limit?: number | null
    passing_score?: number
    max_score?: number
    max_attempts?: number
    shuffle_questions?: boolean
    show_results_immediately?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    questions?: ExamQuestionUncheckedCreateNestedManyWithoutExamInput
    attempts?: ExamAttemptUncheckedCreateNestedManyWithoutExamInput
  }

  export type ExamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    class_id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumExamStatusFieldUpdateOperationsInput | $Enums.ExamStatus
    time_limit?: NullableIntFieldUpdateOperationsInput | number | null
    passing_score?: FloatFieldUpdateOperationsInput | number
    max_score?: FloatFieldUpdateOperationsInput | number
    max_attempts?: IntFieldUpdateOperationsInput | number
    shuffle_questions?: BoolFieldUpdateOperationsInput | boolean
    show_results_immediately?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    questions?: ExamQuestionUpdateManyWithoutExamNestedInput
    attempts?: ExamAttemptUpdateManyWithoutExamNestedInput
  }

  export type ExamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    class_id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumExamStatusFieldUpdateOperationsInput | $Enums.ExamStatus
    time_limit?: NullableIntFieldUpdateOperationsInput | number | null
    passing_score?: FloatFieldUpdateOperationsInput | number
    max_score?: FloatFieldUpdateOperationsInput | number
    max_attempts?: IntFieldUpdateOperationsInput | number
    shuffle_questions?: BoolFieldUpdateOperationsInput | boolean
    show_results_immediately?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    questions?: ExamQuestionUncheckedUpdateManyWithoutExamNestedInput
    attempts?: ExamAttemptUncheckedUpdateManyWithoutExamNestedInput
  }

  export type ExamCreateManyInput = {
    id?: string
    class_id: string
    teacher_id: string
    title: string
    description?: string | null
    status?: $Enums.ExamStatus
    time_limit?: number | null
    passing_score?: number
    max_score?: number
    max_attempts?: number
    shuffle_questions?: boolean
    show_results_immediately?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type ExamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    class_id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumExamStatusFieldUpdateOperationsInput | $Enums.ExamStatus
    time_limit?: NullableIntFieldUpdateOperationsInput | number | null
    passing_score?: FloatFieldUpdateOperationsInput | number
    max_score?: FloatFieldUpdateOperationsInput | number
    max_attempts?: IntFieldUpdateOperationsInput | number
    shuffle_questions?: BoolFieldUpdateOperationsInput | boolean
    show_results_immediately?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    class_id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumExamStatusFieldUpdateOperationsInput | $Enums.ExamStatus
    time_limit?: NullableIntFieldUpdateOperationsInput | number | null
    passing_score?: FloatFieldUpdateOperationsInput | number
    max_score?: FloatFieldUpdateOperationsInput | number
    max_attempts?: IntFieldUpdateOperationsInput | number
    shuffle_questions?: BoolFieldUpdateOperationsInput | boolean
    show_results_immediately?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExamQuestionCreateInput = {
    id?: string
    question_id: string
    points?: number
    order_index?: number
    required?: boolean
    created_at?: Date | string
    exam: ExamCreateNestedOneWithoutQuestionsInput
  }

  export type ExamQuestionUncheckedCreateInput = {
    id?: string
    exam_id: string
    question_id: string
    points?: number
    order_index?: number
    required?: boolean
    created_at?: Date | string
  }

  export type ExamQuestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    points?: FloatFieldUpdateOperationsInput | number
    order_index?: IntFieldUpdateOperationsInput | number
    required?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    exam?: ExamUpdateOneRequiredWithoutQuestionsNestedInput
  }

  export type ExamQuestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    exam_id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    points?: FloatFieldUpdateOperationsInput | number
    order_index?: IntFieldUpdateOperationsInput | number
    required?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamQuestionCreateManyInput = {
    id?: string
    exam_id: string
    question_id: string
    points?: number
    order_index?: number
    required?: boolean
    created_at?: Date | string
  }

  export type ExamQuestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    points?: FloatFieldUpdateOperationsInput | number
    order_index?: IntFieldUpdateOperationsInput | number
    required?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamQuestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    exam_id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    points?: FloatFieldUpdateOperationsInput | number
    order_index?: IntFieldUpdateOperationsInput | number
    required?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamAttemptCreateInput = {
    id?: string
    student_id: string
    status?: $Enums.ExamAttemptStatus
    score?: number | null
    max_score?: number | null
    percentage?: number | null
    started_at?: Date | string
    submitted_at?: Date | string | null
    graded_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    bkt_evidence_sent_at?: Date | string | null
    exam: ExamCreateNestedOneWithoutAttemptsInput
    answers?: ExamAnswerCreateNestedManyWithoutAttemptInput
  }

  export type ExamAttemptUncheckedCreateInput = {
    id?: string
    exam_id: string
    student_id: string
    status?: $Enums.ExamAttemptStatus
    score?: number | null
    max_score?: number | null
    percentage?: number | null
    started_at?: Date | string
    submitted_at?: Date | string | null
    graded_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    bkt_evidence_sent_at?: Date | string | null
    answers?: ExamAnswerUncheckedCreateNestedManyWithoutAttemptInput
  }

  export type ExamAttemptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    status?: EnumExamAttemptStatusFieldUpdateOperationsInput | $Enums.ExamAttemptStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    max_score?: NullableFloatFieldUpdateOperationsInput | number | null
    percentage?: NullableFloatFieldUpdateOperationsInput | number | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    graded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bkt_evidence_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    exam?: ExamUpdateOneRequiredWithoutAttemptsNestedInput
    answers?: ExamAnswerUpdateManyWithoutAttemptNestedInput
  }

  export type ExamAttemptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    exam_id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    status?: EnumExamAttemptStatusFieldUpdateOperationsInput | $Enums.ExamAttemptStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    max_score?: NullableFloatFieldUpdateOperationsInput | number | null
    percentage?: NullableFloatFieldUpdateOperationsInput | number | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    graded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bkt_evidence_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: ExamAnswerUncheckedUpdateManyWithoutAttemptNestedInput
  }

  export type ExamAttemptCreateManyInput = {
    id?: string
    exam_id: string
    student_id: string
    status?: $Enums.ExamAttemptStatus
    score?: number | null
    max_score?: number | null
    percentage?: number | null
    started_at?: Date | string
    submitted_at?: Date | string | null
    graded_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    bkt_evidence_sent_at?: Date | string | null
  }

  export type ExamAttemptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    status?: EnumExamAttemptStatusFieldUpdateOperationsInput | $Enums.ExamAttemptStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    max_score?: NullableFloatFieldUpdateOperationsInput | number | null
    percentage?: NullableFloatFieldUpdateOperationsInput | number | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    graded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bkt_evidence_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExamAttemptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    exam_id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    status?: EnumExamAttemptStatusFieldUpdateOperationsInput | $Enums.ExamAttemptStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    max_score?: NullableFloatFieldUpdateOperationsInput | number | null
    percentage?: NullableFloatFieldUpdateOperationsInput | number | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    graded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bkt_evidence_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExamAnswerCreateInput = {
    id?: string
    question_id: string
    selected_options?: ExamAnswerCreateselected_optionsInput | string[]
    text_answer?: string | null
    is_correct?: boolean | null
    points_earned?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    attempt: ExamAttemptCreateNestedOneWithoutAnswersInput
  }

  export type ExamAnswerUncheckedCreateInput = {
    id?: string
    attempt_id: string
    question_id: string
    selected_options?: ExamAnswerCreateselected_optionsInput | string[]
    text_answer?: string | null
    is_correct?: boolean | null
    points_earned?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ExamAnswerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    selected_options?: ExamAnswerUpdateselected_optionsInput | string[]
    text_answer?: NullableStringFieldUpdateOperationsInput | string | null
    is_correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    points_earned?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    attempt?: ExamAttemptUpdateOneRequiredWithoutAnswersNestedInput
  }

  export type ExamAnswerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    attempt_id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    selected_options?: ExamAnswerUpdateselected_optionsInput | string[]
    text_answer?: NullableStringFieldUpdateOperationsInput | string | null
    is_correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    points_earned?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamAnswerCreateManyInput = {
    id?: string
    attempt_id: string
    question_id: string
    selected_options?: ExamAnswerCreateselected_optionsInput | string[]
    text_answer?: string | null
    is_correct?: boolean | null
    points_earned?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ExamAnswerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    selected_options?: ExamAnswerUpdateselected_optionsInput | string[]
    text_answer?: NullableStringFieldUpdateOperationsInput | string | null
    is_correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    points_earned?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamAnswerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    attempt_id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    selected_options?: ExamAnswerUpdateselected_optionsInput | string[]
    text_answer?: NullableStringFieldUpdateOperationsInput | string | null
    is_correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    points_earned?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestionSkillMappingCreateInput = {
    id?: string
    question_id: string
    skill_id: string
    created_at?: Date | string
    created_by?: string | null
  }

  export type QuestionSkillMappingUncheckedCreateInput = {
    id?: string
    question_id: string
    skill_id: string
    created_at?: Date | string
    created_by?: string | null
  }

  export type QuestionSkillMappingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuestionSkillMappingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuestionSkillMappingCreateManyInput = {
    id?: string
    question_id: string
    skill_id: string
    created_at?: Date | string
    created_by?: string | null
  }

  export type QuestionSkillMappingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuestionSkillMappingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type EnumExamStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExamStatus | EnumExamStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExamStatus[] | ListEnumExamStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExamStatus[] | ListEnumExamStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExamStatusFilter<$PrismaModel> | $Enums.ExamStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type ExamQuestionListRelationFilter = {
    every?: ExamQuestionWhereInput
    some?: ExamQuestionWhereInput
    none?: ExamQuestionWhereInput
  }

  export type ExamAttemptListRelationFilter = {
    every?: ExamAttemptWhereInput
    some?: ExamAttemptWhereInput
    none?: ExamAttemptWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ExamQuestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExamAttemptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExamCountOrderByAggregateInput = {
    id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    time_limit?: SortOrder
    passing_score?: SortOrder
    max_score?: SortOrder
    max_attempts?: SortOrder
    shuffle_questions?: SortOrder
    show_results_immediately?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type ExamAvgOrderByAggregateInput = {
    time_limit?: SortOrder
    passing_score?: SortOrder
    max_score?: SortOrder
    max_attempts?: SortOrder
  }

  export type ExamMaxOrderByAggregateInput = {
    id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    time_limit?: SortOrder
    passing_score?: SortOrder
    max_score?: SortOrder
    max_attempts?: SortOrder
    shuffle_questions?: SortOrder
    show_results_immediately?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type ExamMinOrderByAggregateInput = {
    id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    time_limit?: SortOrder
    passing_score?: SortOrder
    max_score?: SortOrder
    max_attempts?: SortOrder
    shuffle_questions?: SortOrder
    show_results_immediately?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type ExamSumOrderByAggregateInput = {
    time_limit?: SortOrder
    passing_score?: SortOrder
    max_score?: SortOrder
    max_attempts?: SortOrder
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

  export type EnumExamStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExamStatus | EnumExamStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExamStatus[] | ListEnumExamStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExamStatus[] | ListEnumExamStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExamStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExamStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExamStatusFilter<$PrismaModel>
    _max?: NestedEnumExamStatusFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type ExamRelationFilter = {
    is?: ExamWhereInput
    isNot?: ExamWhereInput
  }

  export type ExamQuestionExam_idQuestion_idCompoundUniqueInput = {
    exam_id: string
    question_id: string
  }

  export type ExamQuestionCountOrderByAggregateInput = {
    id?: SortOrder
    exam_id?: SortOrder
    question_id?: SortOrder
    points?: SortOrder
    order_index?: SortOrder
    required?: SortOrder
    created_at?: SortOrder
  }

  export type ExamQuestionAvgOrderByAggregateInput = {
    points?: SortOrder
    order_index?: SortOrder
  }

  export type ExamQuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    exam_id?: SortOrder
    question_id?: SortOrder
    points?: SortOrder
    order_index?: SortOrder
    required?: SortOrder
    created_at?: SortOrder
  }

  export type ExamQuestionMinOrderByAggregateInput = {
    id?: SortOrder
    exam_id?: SortOrder
    question_id?: SortOrder
    points?: SortOrder
    order_index?: SortOrder
    required?: SortOrder
    created_at?: SortOrder
  }

  export type ExamQuestionSumOrderByAggregateInput = {
    points?: SortOrder
    order_index?: SortOrder
  }

  export type EnumExamAttemptStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExamAttemptStatus | EnumExamAttemptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExamAttemptStatus[] | ListEnumExamAttemptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExamAttemptStatus[] | ListEnumExamAttemptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExamAttemptStatusFilter<$PrismaModel> | $Enums.ExamAttemptStatus
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ExamAnswerListRelationFilter = {
    every?: ExamAnswerWhereInput
    some?: ExamAnswerWhereInput
    none?: ExamAnswerWhereInput
  }

  export type ExamAnswerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExamAttemptExam_idStudent_idCompoundUniqueInput = {
    exam_id: string
    student_id: string
  }

  export type ExamAttemptCountOrderByAggregateInput = {
    id?: SortOrder
    exam_id?: SortOrder
    student_id?: SortOrder
    status?: SortOrder
    score?: SortOrder
    max_score?: SortOrder
    percentage?: SortOrder
    started_at?: SortOrder
    submitted_at?: SortOrder
    graded_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    bkt_evidence_sent_at?: SortOrder
  }

  export type ExamAttemptAvgOrderByAggregateInput = {
    score?: SortOrder
    max_score?: SortOrder
    percentage?: SortOrder
  }

  export type ExamAttemptMaxOrderByAggregateInput = {
    id?: SortOrder
    exam_id?: SortOrder
    student_id?: SortOrder
    status?: SortOrder
    score?: SortOrder
    max_score?: SortOrder
    percentage?: SortOrder
    started_at?: SortOrder
    submitted_at?: SortOrder
    graded_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    bkt_evidence_sent_at?: SortOrder
  }

  export type ExamAttemptMinOrderByAggregateInput = {
    id?: SortOrder
    exam_id?: SortOrder
    student_id?: SortOrder
    status?: SortOrder
    score?: SortOrder
    max_score?: SortOrder
    percentage?: SortOrder
    started_at?: SortOrder
    submitted_at?: SortOrder
    graded_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    bkt_evidence_sent_at?: SortOrder
  }

  export type ExamAttemptSumOrderByAggregateInput = {
    score?: SortOrder
    max_score?: SortOrder
    percentage?: SortOrder
  }

  export type EnumExamAttemptStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExamAttemptStatus | EnumExamAttemptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExamAttemptStatus[] | ListEnumExamAttemptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExamAttemptStatus[] | ListEnumExamAttemptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExamAttemptStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExamAttemptStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExamAttemptStatusFilter<$PrismaModel>
    _max?: NestedEnumExamAttemptStatusFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type ExamAttemptRelationFilter = {
    is?: ExamAttemptWhereInput
    isNot?: ExamAttemptWhereInput
  }

  export type ExamAnswerAttempt_idQuestion_idCompoundUniqueInput = {
    attempt_id: string
    question_id: string
  }

  export type ExamAnswerCountOrderByAggregateInput = {
    id?: SortOrder
    attempt_id?: SortOrder
    question_id?: SortOrder
    selected_options?: SortOrder
    text_answer?: SortOrder
    is_correct?: SortOrder
    points_earned?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ExamAnswerAvgOrderByAggregateInput = {
    points_earned?: SortOrder
  }

  export type ExamAnswerMaxOrderByAggregateInput = {
    id?: SortOrder
    attempt_id?: SortOrder
    question_id?: SortOrder
    text_answer?: SortOrder
    is_correct?: SortOrder
    points_earned?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ExamAnswerMinOrderByAggregateInput = {
    id?: SortOrder
    attempt_id?: SortOrder
    question_id?: SortOrder
    text_answer?: SortOrder
    is_correct?: SortOrder
    points_earned?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ExamAnswerSumOrderByAggregateInput = {
    points_earned?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type QuestionSkillMappingQuestion_idSkill_idCompoundUniqueInput = {
    question_id: string
    skill_id: string
  }

  export type QuestionSkillMappingCountOrderByAggregateInput = {
    id?: SortOrder
    question_id?: SortOrder
    skill_id?: SortOrder
    created_at?: SortOrder
    created_by?: SortOrder
  }

  export type QuestionSkillMappingMaxOrderByAggregateInput = {
    id?: SortOrder
    question_id?: SortOrder
    skill_id?: SortOrder
    created_at?: SortOrder
    created_by?: SortOrder
  }

  export type QuestionSkillMappingMinOrderByAggregateInput = {
    id?: SortOrder
    question_id?: SortOrder
    skill_id?: SortOrder
    created_at?: SortOrder
    created_by?: SortOrder
  }

  export type ExamQuestionCreateNestedManyWithoutExamInput = {
    create?: XOR<ExamQuestionCreateWithoutExamInput, ExamQuestionUncheckedCreateWithoutExamInput> | ExamQuestionCreateWithoutExamInput[] | ExamQuestionUncheckedCreateWithoutExamInput[]
    connectOrCreate?: ExamQuestionCreateOrConnectWithoutExamInput | ExamQuestionCreateOrConnectWithoutExamInput[]
    createMany?: ExamQuestionCreateManyExamInputEnvelope
    connect?: ExamQuestionWhereUniqueInput | ExamQuestionWhereUniqueInput[]
  }

  export type ExamAttemptCreateNestedManyWithoutExamInput = {
    create?: XOR<ExamAttemptCreateWithoutExamInput, ExamAttemptUncheckedCreateWithoutExamInput> | ExamAttemptCreateWithoutExamInput[] | ExamAttemptUncheckedCreateWithoutExamInput[]
    connectOrCreate?: ExamAttemptCreateOrConnectWithoutExamInput | ExamAttemptCreateOrConnectWithoutExamInput[]
    createMany?: ExamAttemptCreateManyExamInputEnvelope
    connect?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
  }

  export type ExamQuestionUncheckedCreateNestedManyWithoutExamInput = {
    create?: XOR<ExamQuestionCreateWithoutExamInput, ExamQuestionUncheckedCreateWithoutExamInput> | ExamQuestionCreateWithoutExamInput[] | ExamQuestionUncheckedCreateWithoutExamInput[]
    connectOrCreate?: ExamQuestionCreateOrConnectWithoutExamInput | ExamQuestionCreateOrConnectWithoutExamInput[]
    createMany?: ExamQuestionCreateManyExamInputEnvelope
    connect?: ExamQuestionWhereUniqueInput | ExamQuestionWhereUniqueInput[]
  }

  export type ExamAttemptUncheckedCreateNestedManyWithoutExamInput = {
    create?: XOR<ExamAttemptCreateWithoutExamInput, ExamAttemptUncheckedCreateWithoutExamInput> | ExamAttemptCreateWithoutExamInput[] | ExamAttemptUncheckedCreateWithoutExamInput[]
    connectOrCreate?: ExamAttemptCreateOrConnectWithoutExamInput | ExamAttemptCreateOrConnectWithoutExamInput[]
    createMany?: ExamAttemptCreateManyExamInputEnvelope
    connect?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumExamStatusFieldUpdateOperationsInput = {
    set?: $Enums.ExamStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ExamQuestionUpdateManyWithoutExamNestedInput = {
    create?: XOR<ExamQuestionCreateWithoutExamInput, ExamQuestionUncheckedCreateWithoutExamInput> | ExamQuestionCreateWithoutExamInput[] | ExamQuestionUncheckedCreateWithoutExamInput[]
    connectOrCreate?: ExamQuestionCreateOrConnectWithoutExamInput | ExamQuestionCreateOrConnectWithoutExamInput[]
    upsert?: ExamQuestionUpsertWithWhereUniqueWithoutExamInput | ExamQuestionUpsertWithWhereUniqueWithoutExamInput[]
    createMany?: ExamQuestionCreateManyExamInputEnvelope
    set?: ExamQuestionWhereUniqueInput | ExamQuestionWhereUniqueInput[]
    disconnect?: ExamQuestionWhereUniqueInput | ExamQuestionWhereUniqueInput[]
    delete?: ExamQuestionWhereUniqueInput | ExamQuestionWhereUniqueInput[]
    connect?: ExamQuestionWhereUniqueInput | ExamQuestionWhereUniqueInput[]
    update?: ExamQuestionUpdateWithWhereUniqueWithoutExamInput | ExamQuestionUpdateWithWhereUniqueWithoutExamInput[]
    updateMany?: ExamQuestionUpdateManyWithWhereWithoutExamInput | ExamQuestionUpdateManyWithWhereWithoutExamInput[]
    deleteMany?: ExamQuestionScalarWhereInput | ExamQuestionScalarWhereInput[]
  }

  export type ExamAttemptUpdateManyWithoutExamNestedInput = {
    create?: XOR<ExamAttemptCreateWithoutExamInput, ExamAttemptUncheckedCreateWithoutExamInput> | ExamAttemptCreateWithoutExamInput[] | ExamAttemptUncheckedCreateWithoutExamInput[]
    connectOrCreate?: ExamAttemptCreateOrConnectWithoutExamInput | ExamAttemptCreateOrConnectWithoutExamInput[]
    upsert?: ExamAttemptUpsertWithWhereUniqueWithoutExamInput | ExamAttemptUpsertWithWhereUniqueWithoutExamInput[]
    createMany?: ExamAttemptCreateManyExamInputEnvelope
    set?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    disconnect?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    delete?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    connect?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    update?: ExamAttemptUpdateWithWhereUniqueWithoutExamInput | ExamAttemptUpdateWithWhereUniqueWithoutExamInput[]
    updateMany?: ExamAttemptUpdateManyWithWhereWithoutExamInput | ExamAttemptUpdateManyWithWhereWithoutExamInput[]
    deleteMany?: ExamAttemptScalarWhereInput | ExamAttemptScalarWhereInput[]
  }

  export type ExamQuestionUncheckedUpdateManyWithoutExamNestedInput = {
    create?: XOR<ExamQuestionCreateWithoutExamInput, ExamQuestionUncheckedCreateWithoutExamInput> | ExamQuestionCreateWithoutExamInput[] | ExamQuestionUncheckedCreateWithoutExamInput[]
    connectOrCreate?: ExamQuestionCreateOrConnectWithoutExamInput | ExamQuestionCreateOrConnectWithoutExamInput[]
    upsert?: ExamQuestionUpsertWithWhereUniqueWithoutExamInput | ExamQuestionUpsertWithWhereUniqueWithoutExamInput[]
    createMany?: ExamQuestionCreateManyExamInputEnvelope
    set?: ExamQuestionWhereUniqueInput | ExamQuestionWhereUniqueInput[]
    disconnect?: ExamQuestionWhereUniqueInput | ExamQuestionWhereUniqueInput[]
    delete?: ExamQuestionWhereUniqueInput | ExamQuestionWhereUniqueInput[]
    connect?: ExamQuestionWhereUniqueInput | ExamQuestionWhereUniqueInput[]
    update?: ExamQuestionUpdateWithWhereUniqueWithoutExamInput | ExamQuestionUpdateWithWhereUniqueWithoutExamInput[]
    updateMany?: ExamQuestionUpdateManyWithWhereWithoutExamInput | ExamQuestionUpdateManyWithWhereWithoutExamInput[]
    deleteMany?: ExamQuestionScalarWhereInput | ExamQuestionScalarWhereInput[]
  }

  export type ExamAttemptUncheckedUpdateManyWithoutExamNestedInput = {
    create?: XOR<ExamAttemptCreateWithoutExamInput, ExamAttemptUncheckedCreateWithoutExamInput> | ExamAttemptCreateWithoutExamInput[] | ExamAttemptUncheckedCreateWithoutExamInput[]
    connectOrCreate?: ExamAttemptCreateOrConnectWithoutExamInput | ExamAttemptCreateOrConnectWithoutExamInput[]
    upsert?: ExamAttemptUpsertWithWhereUniqueWithoutExamInput | ExamAttemptUpsertWithWhereUniqueWithoutExamInput[]
    createMany?: ExamAttemptCreateManyExamInputEnvelope
    set?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    disconnect?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    delete?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    connect?: ExamAttemptWhereUniqueInput | ExamAttemptWhereUniqueInput[]
    update?: ExamAttemptUpdateWithWhereUniqueWithoutExamInput | ExamAttemptUpdateWithWhereUniqueWithoutExamInput[]
    updateMany?: ExamAttemptUpdateManyWithWhereWithoutExamInput | ExamAttemptUpdateManyWithWhereWithoutExamInput[]
    deleteMany?: ExamAttemptScalarWhereInput | ExamAttemptScalarWhereInput[]
  }

  export type ExamCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<ExamCreateWithoutQuestionsInput, ExamUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: ExamCreateOrConnectWithoutQuestionsInput
    connect?: ExamWhereUniqueInput
  }

  export type ExamUpdateOneRequiredWithoutQuestionsNestedInput = {
    create?: XOR<ExamCreateWithoutQuestionsInput, ExamUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: ExamCreateOrConnectWithoutQuestionsInput
    upsert?: ExamUpsertWithoutQuestionsInput
    connect?: ExamWhereUniqueInput
    update?: XOR<XOR<ExamUpdateToOneWithWhereWithoutQuestionsInput, ExamUpdateWithoutQuestionsInput>, ExamUncheckedUpdateWithoutQuestionsInput>
  }

  export type ExamCreateNestedOneWithoutAttemptsInput = {
    create?: XOR<ExamCreateWithoutAttemptsInput, ExamUncheckedCreateWithoutAttemptsInput>
    connectOrCreate?: ExamCreateOrConnectWithoutAttemptsInput
    connect?: ExamWhereUniqueInput
  }

  export type ExamAnswerCreateNestedManyWithoutAttemptInput = {
    create?: XOR<ExamAnswerCreateWithoutAttemptInput, ExamAnswerUncheckedCreateWithoutAttemptInput> | ExamAnswerCreateWithoutAttemptInput[] | ExamAnswerUncheckedCreateWithoutAttemptInput[]
    connectOrCreate?: ExamAnswerCreateOrConnectWithoutAttemptInput | ExamAnswerCreateOrConnectWithoutAttemptInput[]
    createMany?: ExamAnswerCreateManyAttemptInputEnvelope
    connect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
  }

  export type ExamAnswerUncheckedCreateNestedManyWithoutAttemptInput = {
    create?: XOR<ExamAnswerCreateWithoutAttemptInput, ExamAnswerUncheckedCreateWithoutAttemptInput> | ExamAnswerCreateWithoutAttemptInput[] | ExamAnswerUncheckedCreateWithoutAttemptInput[]
    connectOrCreate?: ExamAnswerCreateOrConnectWithoutAttemptInput | ExamAnswerCreateOrConnectWithoutAttemptInput[]
    createMany?: ExamAnswerCreateManyAttemptInputEnvelope
    connect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
  }

  export type EnumExamAttemptStatusFieldUpdateOperationsInput = {
    set?: $Enums.ExamAttemptStatus
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ExamUpdateOneRequiredWithoutAttemptsNestedInput = {
    create?: XOR<ExamCreateWithoutAttemptsInput, ExamUncheckedCreateWithoutAttemptsInput>
    connectOrCreate?: ExamCreateOrConnectWithoutAttemptsInput
    upsert?: ExamUpsertWithoutAttemptsInput
    connect?: ExamWhereUniqueInput
    update?: XOR<XOR<ExamUpdateToOneWithWhereWithoutAttemptsInput, ExamUpdateWithoutAttemptsInput>, ExamUncheckedUpdateWithoutAttemptsInput>
  }

  export type ExamAnswerUpdateManyWithoutAttemptNestedInput = {
    create?: XOR<ExamAnswerCreateWithoutAttemptInput, ExamAnswerUncheckedCreateWithoutAttemptInput> | ExamAnswerCreateWithoutAttemptInput[] | ExamAnswerUncheckedCreateWithoutAttemptInput[]
    connectOrCreate?: ExamAnswerCreateOrConnectWithoutAttemptInput | ExamAnswerCreateOrConnectWithoutAttemptInput[]
    upsert?: ExamAnswerUpsertWithWhereUniqueWithoutAttemptInput | ExamAnswerUpsertWithWhereUniqueWithoutAttemptInput[]
    createMany?: ExamAnswerCreateManyAttemptInputEnvelope
    set?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    disconnect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    delete?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    connect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    update?: ExamAnswerUpdateWithWhereUniqueWithoutAttemptInput | ExamAnswerUpdateWithWhereUniqueWithoutAttemptInput[]
    updateMany?: ExamAnswerUpdateManyWithWhereWithoutAttemptInput | ExamAnswerUpdateManyWithWhereWithoutAttemptInput[]
    deleteMany?: ExamAnswerScalarWhereInput | ExamAnswerScalarWhereInput[]
  }

  export type ExamAnswerUncheckedUpdateManyWithoutAttemptNestedInput = {
    create?: XOR<ExamAnswerCreateWithoutAttemptInput, ExamAnswerUncheckedCreateWithoutAttemptInput> | ExamAnswerCreateWithoutAttemptInput[] | ExamAnswerUncheckedCreateWithoutAttemptInput[]
    connectOrCreate?: ExamAnswerCreateOrConnectWithoutAttemptInput | ExamAnswerCreateOrConnectWithoutAttemptInput[]
    upsert?: ExamAnswerUpsertWithWhereUniqueWithoutAttemptInput | ExamAnswerUpsertWithWhereUniqueWithoutAttemptInput[]
    createMany?: ExamAnswerCreateManyAttemptInputEnvelope
    set?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    disconnect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    delete?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    connect?: ExamAnswerWhereUniqueInput | ExamAnswerWhereUniqueInput[]
    update?: ExamAnswerUpdateWithWhereUniqueWithoutAttemptInput | ExamAnswerUpdateWithWhereUniqueWithoutAttemptInput[]
    updateMany?: ExamAnswerUpdateManyWithWhereWithoutAttemptInput | ExamAnswerUpdateManyWithWhereWithoutAttemptInput[]
    deleteMany?: ExamAnswerScalarWhereInput | ExamAnswerScalarWhereInput[]
  }

  export type ExamAnswerCreateselected_optionsInput = {
    set: string[]
  }

  export type ExamAttemptCreateNestedOneWithoutAnswersInput = {
    create?: XOR<ExamAttemptCreateWithoutAnswersInput, ExamAttemptUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: ExamAttemptCreateOrConnectWithoutAnswersInput
    connect?: ExamAttemptWhereUniqueInput
  }

  export type ExamAnswerUpdateselected_optionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type ExamAttemptUpdateOneRequiredWithoutAnswersNestedInput = {
    create?: XOR<ExamAttemptCreateWithoutAnswersInput, ExamAttemptUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: ExamAttemptCreateOrConnectWithoutAnswersInput
    upsert?: ExamAttemptUpsertWithoutAnswersInput
    connect?: ExamAttemptWhereUniqueInput
    update?: XOR<XOR<ExamAttemptUpdateToOneWithWhereWithoutAnswersInput, ExamAttemptUpdateWithoutAnswersInput>, ExamAttemptUncheckedUpdateWithoutAnswersInput>
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

  export type NestedEnumExamStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExamStatus | EnumExamStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExamStatus[] | ListEnumExamStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExamStatus[] | ListEnumExamStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExamStatusFilter<$PrismaModel> | $Enums.ExamStatus
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedEnumExamStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExamStatus | EnumExamStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExamStatus[] | ListEnumExamStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExamStatus[] | ListEnumExamStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExamStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExamStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExamStatusFilter<$PrismaModel>
    _max?: NestedEnumExamStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumExamAttemptStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExamAttemptStatus | EnumExamAttemptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExamAttemptStatus[] | ListEnumExamAttemptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExamAttemptStatus[] | ListEnumExamAttemptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExamAttemptStatusFilter<$PrismaModel> | $Enums.ExamAttemptStatus
  }

  export type NestedEnumExamAttemptStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExamAttemptStatus | EnumExamAttemptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExamAttemptStatus[] | ListEnumExamAttemptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExamAttemptStatus[] | ListEnumExamAttemptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExamAttemptStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExamAttemptStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExamAttemptStatusFilter<$PrismaModel>
    _max?: NestedEnumExamAttemptStatusFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type ExamQuestionCreateWithoutExamInput = {
    id?: string
    question_id: string
    points?: number
    order_index?: number
    required?: boolean
    created_at?: Date | string
  }

  export type ExamQuestionUncheckedCreateWithoutExamInput = {
    id?: string
    question_id: string
    points?: number
    order_index?: number
    required?: boolean
    created_at?: Date | string
  }

  export type ExamQuestionCreateOrConnectWithoutExamInput = {
    where: ExamQuestionWhereUniqueInput
    create: XOR<ExamQuestionCreateWithoutExamInput, ExamQuestionUncheckedCreateWithoutExamInput>
  }

  export type ExamQuestionCreateManyExamInputEnvelope = {
    data: ExamQuestionCreateManyExamInput | ExamQuestionCreateManyExamInput[]
    skipDuplicates?: boolean
  }

  export type ExamAttemptCreateWithoutExamInput = {
    id?: string
    student_id: string
    status?: $Enums.ExamAttemptStatus
    score?: number | null
    max_score?: number | null
    percentage?: number | null
    started_at?: Date | string
    submitted_at?: Date | string | null
    graded_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    bkt_evidence_sent_at?: Date | string | null
    answers?: ExamAnswerCreateNestedManyWithoutAttemptInput
  }

  export type ExamAttemptUncheckedCreateWithoutExamInput = {
    id?: string
    student_id: string
    status?: $Enums.ExamAttemptStatus
    score?: number | null
    max_score?: number | null
    percentage?: number | null
    started_at?: Date | string
    submitted_at?: Date | string | null
    graded_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    bkt_evidence_sent_at?: Date | string | null
    answers?: ExamAnswerUncheckedCreateNestedManyWithoutAttemptInput
  }

  export type ExamAttemptCreateOrConnectWithoutExamInput = {
    where: ExamAttemptWhereUniqueInput
    create: XOR<ExamAttemptCreateWithoutExamInput, ExamAttemptUncheckedCreateWithoutExamInput>
  }

  export type ExamAttemptCreateManyExamInputEnvelope = {
    data: ExamAttemptCreateManyExamInput | ExamAttemptCreateManyExamInput[]
    skipDuplicates?: boolean
  }

  export type ExamQuestionUpsertWithWhereUniqueWithoutExamInput = {
    where: ExamQuestionWhereUniqueInput
    update: XOR<ExamQuestionUpdateWithoutExamInput, ExamQuestionUncheckedUpdateWithoutExamInput>
    create: XOR<ExamQuestionCreateWithoutExamInput, ExamQuestionUncheckedCreateWithoutExamInput>
  }

  export type ExamQuestionUpdateWithWhereUniqueWithoutExamInput = {
    where: ExamQuestionWhereUniqueInput
    data: XOR<ExamQuestionUpdateWithoutExamInput, ExamQuestionUncheckedUpdateWithoutExamInput>
  }

  export type ExamQuestionUpdateManyWithWhereWithoutExamInput = {
    where: ExamQuestionScalarWhereInput
    data: XOR<ExamQuestionUpdateManyMutationInput, ExamQuestionUncheckedUpdateManyWithoutExamInput>
  }

  export type ExamQuestionScalarWhereInput = {
    AND?: ExamQuestionScalarWhereInput | ExamQuestionScalarWhereInput[]
    OR?: ExamQuestionScalarWhereInput[]
    NOT?: ExamQuestionScalarWhereInput | ExamQuestionScalarWhereInput[]
    id?: StringFilter<"ExamQuestion"> | string
    exam_id?: StringFilter<"ExamQuestion"> | string
    question_id?: StringFilter<"ExamQuestion"> | string
    points?: FloatFilter<"ExamQuestion"> | number
    order_index?: IntFilter<"ExamQuestion"> | number
    required?: BoolFilter<"ExamQuestion"> | boolean
    created_at?: DateTimeFilter<"ExamQuestion"> | Date | string
  }

  export type ExamAttemptUpsertWithWhereUniqueWithoutExamInput = {
    where: ExamAttemptWhereUniqueInput
    update: XOR<ExamAttemptUpdateWithoutExamInput, ExamAttemptUncheckedUpdateWithoutExamInput>
    create: XOR<ExamAttemptCreateWithoutExamInput, ExamAttemptUncheckedCreateWithoutExamInput>
  }

  export type ExamAttemptUpdateWithWhereUniqueWithoutExamInput = {
    where: ExamAttemptWhereUniqueInput
    data: XOR<ExamAttemptUpdateWithoutExamInput, ExamAttemptUncheckedUpdateWithoutExamInput>
  }

  export type ExamAttemptUpdateManyWithWhereWithoutExamInput = {
    where: ExamAttemptScalarWhereInput
    data: XOR<ExamAttemptUpdateManyMutationInput, ExamAttemptUncheckedUpdateManyWithoutExamInput>
  }

  export type ExamAttemptScalarWhereInput = {
    AND?: ExamAttemptScalarWhereInput | ExamAttemptScalarWhereInput[]
    OR?: ExamAttemptScalarWhereInput[]
    NOT?: ExamAttemptScalarWhereInput | ExamAttemptScalarWhereInput[]
    id?: StringFilter<"ExamAttempt"> | string
    exam_id?: StringFilter<"ExamAttempt"> | string
    student_id?: StringFilter<"ExamAttempt"> | string
    status?: EnumExamAttemptStatusFilter<"ExamAttempt"> | $Enums.ExamAttemptStatus
    score?: FloatNullableFilter<"ExamAttempt"> | number | null
    max_score?: FloatNullableFilter<"ExamAttempt"> | number | null
    percentage?: FloatNullableFilter<"ExamAttempt"> | number | null
    started_at?: DateTimeFilter<"ExamAttempt"> | Date | string
    submitted_at?: DateTimeNullableFilter<"ExamAttempt"> | Date | string | null
    graded_at?: DateTimeNullableFilter<"ExamAttempt"> | Date | string | null
    created_at?: DateTimeFilter<"ExamAttempt"> | Date | string
    updated_at?: DateTimeFilter<"ExamAttempt"> | Date | string
    bkt_evidence_sent_at?: DateTimeNullableFilter<"ExamAttempt"> | Date | string | null
  }

  export type ExamCreateWithoutQuestionsInput = {
    id?: string
    class_id: string
    teacher_id: string
    title: string
    description?: string | null
    status?: $Enums.ExamStatus
    time_limit?: number | null
    passing_score?: number
    max_score?: number
    max_attempts?: number
    shuffle_questions?: boolean
    show_results_immediately?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    attempts?: ExamAttemptCreateNestedManyWithoutExamInput
  }

  export type ExamUncheckedCreateWithoutQuestionsInput = {
    id?: string
    class_id: string
    teacher_id: string
    title: string
    description?: string | null
    status?: $Enums.ExamStatus
    time_limit?: number | null
    passing_score?: number
    max_score?: number
    max_attempts?: number
    shuffle_questions?: boolean
    show_results_immediately?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    attempts?: ExamAttemptUncheckedCreateNestedManyWithoutExamInput
  }

  export type ExamCreateOrConnectWithoutQuestionsInput = {
    where: ExamWhereUniqueInput
    create: XOR<ExamCreateWithoutQuestionsInput, ExamUncheckedCreateWithoutQuestionsInput>
  }

  export type ExamUpsertWithoutQuestionsInput = {
    update: XOR<ExamUpdateWithoutQuestionsInput, ExamUncheckedUpdateWithoutQuestionsInput>
    create: XOR<ExamCreateWithoutQuestionsInput, ExamUncheckedCreateWithoutQuestionsInput>
    where?: ExamWhereInput
  }

  export type ExamUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: ExamWhereInput
    data: XOR<ExamUpdateWithoutQuestionsInput, ExamUncheckedUpdateWithoutQuestionsInput>
  }

  export type ExamUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    class_id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumExamStatusFieldUpdateOperationsInput | $Enums.ExamStatus
    time_limit?: NullableIntFieldUpdateOperationsInput | number | null
    passing_score?: FloatFieldUpdateOperationsInput | number
    max_score?: FloatFieldUpdateOperationsInput | number
    max_attempts?: IntFieldUpdateOperationsInput | number
    shuffle_questions?: BoolFieldUpdateOperationsInput | boolean
    show_results_immediately?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attempts?: ExamAttemptUpdateManyWithoutExamNestedInput
  }

  export type ExamUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    class_id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumExamStatusFieldUpdateOperationsInput | $Enums.ExamStatus
    time_limit?: NullableIntFieldUpdateOperationsInput | number | null
    passing_score?: FloatFieldUpdateOperationsInput | number
    max_score?: FloatFieldUpdateOperationsInput | number
    max_attempts?: IntFieldUpdateOperationsInput | number
    shuffle_questions?: BoolFieldUpdateOperationsInput | boolean
    show_results_immediately?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attempts?: ExamAttemptUncheckedUpdateManyWithoutExamNestedInput
  }

  export type ExamCreateWithoutAttemptsInput = {
    id?: string
    class_id: string
    teacher_id: string
    title: string
    description?: string | null
    status?: $Enums.ExamStatus
    time_limit?: number | null
    passing_score?: number
    max_score?: number
    max_attempts?: number
    shuffle_questions?: boolean
    show_results_immediately?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    questions?: ExamQuestionCreateNestedManyWithoutExamInput
  }

  export type ExamUncheckedCreateWithoutAttemptsInput = {
    id?: string
    class_id: string
    teacher_id: string
    title: string
    description?: string | null
    status?: $Enums.ExamStatus
    time_limit?: number | null
    passing_score?: number
    max_score?: number
    max_attempts?: number
    shuffle_questions?: boolean
    show_results_immediately?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    questions?: ExamQuestionUncheckedCreateNestedManyWithoutExamInput
  }

  export type ExamCreateOrConnectWithoutAttemptsInput = {
    where: ExamWhereUniqueInput
    create: XOR<ExamCreateWithoutAttemptsInput, ExamUncheckedCreateWithoutAttemptsInput>
  }

  export type ExamAnswerCreateWithoutAttemptInput = {
    id?: string
    question_id: string
    selected_options?: ExamAnswerCreateselected_optionsInput | string[]
    text_answer?: string | null
    is_correct?: boolean | null
    points_earned?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ExamAnswerUncheckedCreateWithoutAttemptInput = {
    id?: string
    question_id: string
    selected_options?: ExamAnswerCreateselected_optionsInput | string[]
    text_answer?: string | null
    is_correct?: boolean | null
    points_earned?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ExamAnswerCreateOrConnectWithoutAttemptInput = {
    where: ExamAnswerWhereUniqueInput
    create: XOR<ExamAnswerCreateWithoutAttemptInput, ExamAnswerUncheckedCreateWithoutAttemptInput>
  }

  export type ExamAnswerCreateManyAttemptInputEnvelope = {
    data: ExamAnswerCreateManyAttemptInput | ExamAnswerCreateManyAttemptInput[]
    skipDuplicates?: boolean
  }

  export type ExamUpsertWithoutAttemptsInput = {
    update: XOR<ExamUpdateWithoutAttemptsInput, ExamUncheckedUpdateWithoutAttemptsInput>
    create: XOR<ExamCreateWithoutAttemptsInput, ExamUncheckedCreateWithoutAttemptsInput>
    where?: ExamWhereInput
  }

  export type ExamUpdateToOneWithWhereWithoutAttemptsInput = {
    where?: ExamWhereInput
    data: XOR<ExamUpdateWithoutAttemptsInput, ExamUncheckedUpdateWithoutAttemptsInput>
  }

  export type ExamUpdateWithoutAttemptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    class_id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumExamStatusFieldUpdateOperationsInput | $Enums.ExamStatus
    time_limit?: NullableIntFieldUpdateOperationsInput | number | null
    passing_score?: FloatFieldUpdateOperationsInput | number
    max_score?: FloatFieldUpdateOperationsInput | number
    max_attempts?: IntFieldUpdateOperationsInput | number
    shuffle_questions?: BoolFieldUpdateOperationsInput | boolean
    show_results_immediately?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    questions?: ExamQuestionUpdateManyWithoutExamNestedInput
  }

  export type ExamUncheckedUpdateWithoutAttemptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    class_id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumExamStatusFieldUpdateOperationsInput | $Enums.ExamStatus
    time_limit?: NullableIntFieldUpdateOperationsInput | number | null
    passing_score?: FloatFieldUpdateOperationsInput | number
    max_score?: FloatFieldUpdateOperationsInput | number
    max_attempts?: IntFieldUpdateOperationsInput | number
    shuffle_questions?: BoolFieldUpdateOperationsInput | boolean
    show_results_immediately?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    questions?: ExamQuestionUncheckedUpdateManyWithoutExamNestedInput
  }

  export type ExamAnswerUpsertWithWhereUniqueWithoutAttemptInput = {
    where: ExamAnswerWhereUniqueInput
    update: XOR<ExamAnswerUpdateWithoutAttemptInput, ExamAnswerUncheckedUpdateWithoutAttemptInput>
    create: XOR<ExamAnswerCreateWithoutAttemptInput, ExamAnswerUncheckedCreateWithoutAttemptInput>
  }

  export type ExamAnswerUpdateWithWhereUniqueWithoutAttemptInput = {
    where: ExamAnswerWhereUniqueInput
    data: XOR<ExamAnswerUpdateWithoutAttemptInput, ExamAnswerUncheckedUpdateWithoutAttemptInput>
  }

  export type ExamAnswerUpdateManyWithWhereWithoutAttemptInput = {
    where: ExamAnswerScalarWhereInput
    data: XOR<ExamAnswerUpdateManyMutationInput, ExamAnswerUncheckedUpdateManyWithoutAttemptInput>
  }

  export type ExamAnswerScalarWhereInput = {
    AND?: ExamAnswerScalarWhereInput | ExamAnswerScalarWhereInput[]
    OR?: ExamAnswerScalarWhereInput[]
    NOT?: ExamAnswerScalarWhereInput | ExamAnswerScalarWhereInput[]
    id?: StringFilter<"ExamAnswer"> | string
    attempt_id?: StringFilter<"ExamAnswer"> | string
    question_id?: StringFilter<"ExamAnswer"> | string
    selected_options?: StringNullableListFilter<"ExamAnswer">
    text_answer?: StringNullableFilter<"ExamAnswer"> | string | null
    is_correct?: BoolNullableFilter<"ExamAnswer"> | boolean | null
    points_earned?: FloatNullableFilter<"ExamAnswer"> | number | null
    created_at?: DateTimeFilter<"ExamAnswer"> | Date | string
    updated_at?: DateTimeFilter<"ExamAnswer"> | Date | string
  }

  export type ExamAttemptCreateWithoutAnswersInput = {
    id?: string
    student_id: string
    status?: $Enums.ExamAttemptStatus
    score?: number | null
    max_score?: number | null
    percentage?: number | null
    started_at?: Date | string
    submitted_at?: Date | string | null
    graded_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    bkt_evidence_sent_at?: Date | string | null
    exam: ExamCreateNestedOneWithoutAttemptsInput
  }

  export type ExamAttemptUncheckedCreateWithoutAnswersInput = {
    id?: string
    exam_id: string
    student_id: string
    status?: $Enums.ExamAttemptStatus
    score?: number | null
    max_score?: number | null
    percentage?: number | null
    started_at?: Date | string
    submitted_at?: Date | string | null
    graded_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    bkt_evidence_sent_at?: Date | string | null
  }

  export type ExamAttemptCreateOrConnectWithoutAnswersInput = {
    where: ExamAttemptWhereUniqueInput
    create: XOR<ExamAttemptCreateWithoutAnswersInput, ExamAttemptUncheckedCreateWithoutAnswersInput>
  }

  export type ExamAttemptUpsertWithoutAnswersInput = {
    update: XOR<ExamAttemptUpdateWithoutAnswersInput, ExamAttemptUncheckedUpdateWithoutAnswersInput>
    create: XOR<ExamAttemptCreateWithoutAnswersInput, ExamAttemptUncheckedCreateWithoutAnswersInput>
    where?: ExamAttemptWhereInput
  }

  export type ExamAttemptUpdateToOneWithWhereWithoutAnswersInput = {
    where?: ExamAttemptWhereInput
    data: XOR<ExamAttemptUpdateWithoutAnswersInput, ExamAttemptUncheckedUpdateWithoutAnswersInput>
  }

  export type ExamAttemptUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    status?: EnumExamAttemptStatusFieldUpdateOperationsInput | $Enums.ExamAttemptStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    max_score?: NullableFloatFieldUpdateOperationsInput | number | null
    percentage?: NullableFloatFieldUpdateOperationsInput | number | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    graded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bkt_evidence_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    exam?: ExamUpdateOneRequiredWithoutAttemptsNestedInput
  }

  export type ExamAttemptUncheckedUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    exam_id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    status?: EnumExamAttemptStatusFieldUpdateOperationsInput | $Enums.ExamAttemptStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    max_score?: NullableFloatFieldUpdateOperationsInput | number | null
    percentage?: NullableFloatFieldUpdateOperationsInput | number | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    graded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bkt_evidence_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExamQuestionCreateManyExamInput = {
    id?: string
    question_id: string
    points?: number
    order_index?: number
    required?: boolean
    created_at?: Date | string
  }

  export type ExamAttemptCreateManyExamInput = {
    id?: string
    student_id: string
    status?: $Enums.ExamAttemptStatus
    score?: number | null
    max_score?: number | null
    percentage?: number | null
    started_at?: Date | string
    submitted_at?: Date | string | null
    graded_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    bkt_evidence_sent_at?: Date | string | null
  }

  export type ExamQuestionUpdateWithoutExamInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    points?: FloatFieldUpdateOperationsInput | number
    order_index?: IntFieldUpdateOperationsInput | number
    required?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamQuestionUncheckedUpdateWithoutExamInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    points?: FloatFieldUpdateOperationsInput | number
    order_index?: IntFieldUpdateOperationsInput | number
    required?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamQuestionUncheckedUpdateManyWithoutExamInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    points?: FloatFieldUpdateOperationsInput | number
    order_index?: IntFieldUpdateOperationsInput | number
    required?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamAttemptUpdateWithoutExamInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    status?: EnumExamAttemptStatusFieldUpdateOperationsInput | $Enums.ExamAttemptStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    max_score?: NullableFloatFieldUpdateOperationsInput | number | null
    percentage?: NullableFloatFieldUpdateOperationsInput | number | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    graded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bkt_evidence_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: ExamAnswerUpdateManyWithoutAttemptNestedInput
  }

  export type ExamAttemptUncheckedUpdateWithoutExamInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    status?: EnumExamAttemptStatusFieldUpdateOperationsInput | $Enums.ExamAttemptStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    max_score?: NullableFloatFieldUpdateOperationsInput | number | null
    percentage?: NullableFloatFieldUpdateOperationsInput | number | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    graded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bkt_evidence_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    answers?: ExamAnswerUncheckedUpdateManyWithoutAttemptNestedInput
  }

  export type ExamAttemptUncheckedUpdateManyWithoutExamInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    status?: EnumExamAttemptStatusFieldUpdateOperationsInput | $Enums.ExamAttemptStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    max_score?: NullableFloatFieldUpdateOperationsInput | number | null
    percentage?: NullableFloatFieldUpdateOperationsInput | number | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    graded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bkt_evidence_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExamAnswerCreateManyAttemptInput = {
    id?: string
    question_id: string
    selected_options?: ExamAnswerCreateselected_optionsInput | string[]
    text_answer?: string | null
    is_correct?: boolean | null
    points_earned?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ExamAnswerUpdateWithoutAttemptInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    selected_options?: ExamAnswerUpdateselected_optionsInput | string[]
    text_answer?: NullableStringFieldUpdateOperationsInput | string | null
    is_correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    points_earned?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamAnswerUncheckedUpdateWithoutAttemptInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    selected_options?: ExamAnswerUpdateselected_optionsInput | string[]
    text_answer?: NullableStringFieldUpdateOperationsInput | string | null
    is_correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    points_earned?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamAnswerUncheckedUpdateManyWithoutAttemptInput = {
    id?: StringFieldUpdateOperationsInput | string
    question_id?: StringFieldUpdateOperationsInput | string
    selected_options?: ExamAnswerUpdateselected_optionsInput | string[]
    text_answer?: NullableStringFieldUpdateOperationsInput | string | null
    is_correct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    points_earned?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ExamCountOutputTypeDefaultArgs instead
     */
    export type ExamCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ExamCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ExamAttemptCountOutputTypeDefaultArgs instead
     */
    export type ExamAttemptCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ExamAttemptCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ExamDefaultArgs instead
     */
    export type ExamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ExamDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ExamQuestionDefaultArgs instead
     */
    export type ExamQuestionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ExamQuestionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ExamAttemptDefaultArgs instead
     */
    export type ExamAttemptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ExamAttemptDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ExamAnswerDefaultArgs instead
     */
    export type ExamAnswerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ExamAnswerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QuestionSkillMappingDefaultArgs instead
     */
    export type QuestionSkillMappingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QuestionSkillMappingDefaultArgs<ExtArgs>

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