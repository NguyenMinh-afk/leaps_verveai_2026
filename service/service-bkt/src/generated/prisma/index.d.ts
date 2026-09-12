
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
 * Model Skill
 * A learnable skill. `prereq_skills` is a flat list of skill codes
 * (TEXT[]) so we can resolve a dependency graph without a join table.
 */
export type Skill = $Result.DefaultSelection<Prisma.$SkillPayload>
/**
 * Model Diagnosis
 * Per-(student, skill) mastery snapshot. The engine upserts this on
 * every evidence observation; `confidence` reflects how many
 * observations the snapshot is based on.
 */
export type Diagnosis = $Result.DefaultSelection<Prisma.$DiagnosisPayload>
/**
 * Model EvidenceItem
 * A single piece of evidence (one item answered) attached to a
 * diagnosis. Carries the LLM-extracted answer (Lớp 1), the binary
 * correctness signal, and an engine-assigned quality tag.
 */
export type EvidenceItem = $Result.DefaultSelection<Prisma.$EvidenceItemPayload>
/**
 * Model Intervention
 * A recommended teaching action surfaced to the dashboard when a
 * student is stuck or has a mastery gap. Created automatically by the
 * engine, can be edited or resolved by a teacher (FR-17 override).
 */
export type Intervention = $Result.DefaultSelection<Prisma.$InterventionPayload>
/**
 * Model InterventionNote
 * Free-form teacher note attached to an intervention. Append-only.
 */
export type InterventionNote = $Result.DefaultSelection<Prisma.$InterventionNotePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const DiagnosisStatus: {
  PENDING: 'PENDING',
  DIAGNOSED: 'DIAGNOSED',
  MASTERED: 'MASTERED',
  STRUGGLING: 'STRUGGLING'
};

export type DiagnosisStatus = (typeof DiagnosisStatus)[keyof typeof DiagnosisStatus]


export const EvidenceQuality: {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  UNKNOWN: 'UNKNOWN'
};

export type EvidenceQuality = (typeof EvidenceQuality)[keyof typeof EvidenceQuality]


export const InterventionStatus: {
  ACTIVE: 'ACTIVE',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED'
};

export type InterventionStatus = (typeof InterventionStatus)[keyof typeof InterventionStatus]

}

export type DiagnosisStatus = $Enums.DiagnosisStatus

export const DiagnosisStatus: typeof $Enums.DiagnosisStatus

export type EvidenceQuality = $Enums.EvidenceQuality

export const EvidenceQuality: typeof $Enums.EvidenceQuality

export type InterventionStatus = $Enums.InterventionStatus

export const InterventionStatus: typeof $Enums.InterventionStatus

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
   * `prisma.skill`: Exposes CRUD operations for the **Skill** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Skills
    * const skills = await prisma.skill.findMany()
    * ```
    */
  get skill(): Prisma.SkillDelegate<ExtArgs>;

  /**
   * `prisma.diagnosis`: Exposes CRUD operations for the **Diagnosis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Diagnoses
    * const diagnoses = await prisma.diagnosis.findMany()
    * ```
    */
  get diagnosis(): Prisma.DiagnosisDelegate<ExtArgs>;

  /**
   * `prisma.evidenceItem`: Exposes CRUD operations for the **EvidenceItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EvidenceItems
    * const evidenceItems = await prisma.evidenceItem.findMany()
    * ```
    */
  get evidenceItem(): Prisma.EvidenceItemDelegate<ExtArgs>;

  /**
   * `prisma.intervention`: Exposes CRUD operations for the **Intervention** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Interventions
    * const interventions = await prisma.intervention.findMany()
    * ```
    */
  get intervention(): Prisma.InterventionDelegate<ExtArgs>;

  /**
   * `prisma.interventionNote`: Exposes CRUD operations for the **InterventionNote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InterventionNotes
    * const interventionNotes = await prisma.interventionNote.findMany()
    * ```
    */
  get interventionNote(): Prisma.InterventionNoteDelegate<ExtArgs>;
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
    Skill: 'Skill',
    Diagnosis: 'Diagnosis',
    EvidenceItem: 'EvidenceItem',
    Intervention: 'Intervention',
    InterventionNote: 'InterventionNote'
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
      modelProps: "skill" | "diagnosis" | "evidenceItem" | "intervention" | "interventionNote"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Skill: {
        payload: Prisma.$SkillPayload<ExtArgs>
        fields: Prisma.SkillFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SkillFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SkillFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          findFirst: {
            args: Prisma.SkillFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SkillFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          findMany: {
            args: Prisma.SkillFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          create: {
            args: Prisma.SkillCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          createMany: {
            args: Prisma.SkillCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SkillCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          delete: {
            args: Prisma.SkillDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          update: {
            args: Prisma.SkillUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          deleteMany: {
            args: Prisma.SkillDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SkillUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SkillUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          aggregate: {
            args: Prisma.SkillAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSkill>
          }
          groupBy: {
            args: Prisma.SkillGroupByArgs<ExtArgs>
            result: $Utils.Optional<SkillGroupByOutputType>[]
          }
          count: {
            args: Prisma.SkillCountArgs<ExtArgs>
            result: $Utils.Optional<SkillCountAggregateOutputType> | number
          }
        }
      }
      Diagnosis: {
        payload: Prisma.$DiagnosisPayload<ExtArgs>
        fields: Prisma.DiagnosisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiagnosisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiagnosisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>
          }
          findFirst: {
            args: Prisma.DiagnosisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiagnosisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>
          }
          findMany: {
            args: Prisma.DiagnosisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>[]
          }
          create: {
            args: Prisma.DiagnosisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>
          }
          createMany: {
            args: Prisma.DiagnosisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DiagnosisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>[]
          }
          delete: {
            args: Prisma.DiagnosisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>
          }
          update: {
            args: Prisma.DiagnosisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>
          }
          deleteMany: {
            args: Prisma.DiagnosisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiagnosisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DiagnosisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>
          }
          aggregate: {
            args: Prisma.DiagnosisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiagnosis>
          }
          groupBy: {
            args: Prisma.DiagnosisGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiagnosisGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiagnosisCountArgs<ExtArgs>
            result: $Utils.Optional<DiagnosisCountAggregateOutputType> | number
          }
        }
      }
      EvidenceItem: {
        payload: Prisma.$EvidenceItemPayload<ExtArgs>
        fields: Prisma.EvidenceItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EvidenceItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidenceItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EvidenceItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidenceItemPayload>
          }
          findFirst: {
            args: Prisma.EvidenceItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidenceItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EvidenceItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidenceItemPayload>
          }
          findMany: {
            args: Prisma.EvidenceItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidenceItemPayload>[]
          }
          create: {
            args: Prisma.EvidenceItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidenceItemPayload>
          }
          createMany: {
            args: Prisma.EvidenceItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EvidenceItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidenceItemPayload>[]
          }
          delete: {
            args: Prisma.EvidenceItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidenceItemPayload>
          }
          update: {
            args: Prisma.EvidenceItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidenceItemPayload>
          }
          deleteMany: {
            args: Prisma.EvidenceItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EvidenceItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EvidenceItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvidenceItemPayload>
          }
          aggregate: {
            args: Prisma.EvidenceItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvidenceItem>
          }
          groupBy: {
            args: Prisma.EvidenceItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<EvidenceItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.EvidenceItemCountArgs<ExtArgs>
            result: $Utils.Optional<EvidenceItemCountAggregateOutputType> | number
          }
        }
      }
      Intervention: {
        payload: Prisma.$InterventionPayload<ExtArgs>
        fields: Prisma.InterventionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InterventionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InterventionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionPayload>
          }
          findFirst: {
            args: Prisma.InterventionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InterventionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionPayload>
          }
          findMany: {
            args: Prisma.InterventionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionPayload>[]
          }
          create: {
            args: Prisma.InterventionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionPayload>
          }
          createMany: {
            args: Prisma.InterventionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InterventionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionPayload>[]
          }
          delete: {
            args: Prisma.InterventionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionPayload>
          }
          update: {
            args: Prisma.InterventionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionPayload>
          }
          deleteMany: {
            args: Prisma.InterventionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InterventionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InterventionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionPayload>
          }
          aggregate: {
            args: Prisma.InterventionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIntervention>
          }
          groupBy: {
            args: Prisma.InterventionGroupByArgs<ExtArgs>
            result: $Utils.Optional<InterventionGroupByOutputType>[]
          }
          count: {
            args: Prisma.InterventionCountArgs<ExtArgs>
            result: $Utils.Optional<InterventionCountAggregateOutputType> | number
          }
        }
      }
      InterventionNote: {
        payload: Prisma.$InterventionNotePayload<ExtArgs>
        fields: Prisma.InterventionNoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InterventionNoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionNotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InterventionNoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionNotePayload>
          }
          findFirst: {
            args: Prisma.InterventionNoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionNotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InterventionNoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionNotePayload>
          }
          findMany: {
            args: Prisma.InterventionNoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionNotePayload>[]
          }
          create: {
            args: Prisma.InterventionNoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionNotePayload>
          }
          createMany: {
            args: Prisma.InterventionNoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InterventionNoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionNotePayload>[]
          }
          delete: {
            args: Prisma.InterventionNoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionNotePayload>
          }
          update: {
            args: Prisma.InterventionNoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionNotePayload>
          }
          deleteMany: {
            args: Prisma.InterventionNoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InterventionNoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InterventionNoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterventionNotePayload>
          }
          aggregate: {
            args: Prisma.InterventionNoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInterventionNote>
          }
          groupBy: {
            args: Prisma.InterventionNoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<InterventionNoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.InterventionNoteCountArgs<ExtArgs>
            result: $Utils.Optional<InterventionNoteCountAggregateOutputType> | number
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
    where?: DiagnosisWhereInput
  }

  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeCountInterventionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InterventionWhereInput
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
    where?: EvidenceItemWhereInput
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
    where?: InterventionNoteWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Skill
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
     * Filter which Skill to aggregate.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Skills
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




  export type SkillGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillWhereInput
    orderBy?: SkillOrderByWithAggregationInput | SkillOrderByWithAggregationInput[]
    by: SkillScalarFieldEnum[] | SkillScalarFieldEnum
    having?: SkillScalarWhereWithAggregatesInput
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

  type GetSkillGroupByPayload<T extends SkillGroupByArgs> = Prisma.PrismaPromise<
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


  export type SkillSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    difficulty?: boolean
    description?: boolean
    prereq_skills?: boolean
    created_at?: boolean
    updated_at?: boolean
    diagnoses?: boolean | Skill$diagnosesArgs<ExtArgs>
    interventions?: boolean | Skill$interventionsArgs<ExtArgs>
    _count?: boolean | SkillCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    difficulty?: boolean
    description?: boolean
    prereq_skills?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    difficulty?: boolean
    description?: boolean
    prereq_skills?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type SkillInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diagnoses?: boolean | Skill$diagnosesArgs<ExtArgs>
    interventions?: boolean | Skill$interventionsArgs<ExtArgs>
    _count?: boolean | SkillCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SkillIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SkillPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Skill"
    objects: {
      diagnoses: Prisma.$DiagnosisPayload<ExtArgs>[]
      interventions: Prisma.$InterventionPayload<ExtArgs>[]
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

  type SkillGetPayload<S extends boolean | null | undefined | SkillDefaultArgs> = $Result.GetResult<Prisma.$SkillPayload, S>

  type SkillCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SkillFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SkillCountAggregateInputType | true
    }

  export interface SkillDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Skill'], meta: { name: 'Skill' } }
    /**
     * Find zero or one Skill that matches the filter.
     * @param {SkillFindUniqueArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SkillFindUniqueArgs>(args: SelectSubset<T, SkillFindUniqueArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Skill that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SkillFindUniqueOrThrowArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SkillFindUniqueOrThrowArgs>(args: SelectSubset<T, SkillFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Skill that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindFirstArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SkillFindFirstArgs>(args?: SelectSubset<T, SkillFindFirstArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Skill that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindFirstOrThrowArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SkillFindFirstOrThrowArgs>(args?: SelectSubset<T, SkillFindFirstOrThrowArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Skills that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindManyArgs} args - Arguments to filter and select certain fields only.
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
    findMany<T extends SkillFindManyArgs>(args?: SelectSubset<T, SkillFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Skill.
     * @param {SkillCreateArgs} args - Arguments to create a Skill.
     * @example
     * // Create one Skill
     * const Skill = await prisma.skill.create({
     *   data: {
     *     // ... data to create a Skill
     *   }
     * })
     * 
     */
    create<T extends SkillCreateArgs>(args: SelectSubset<T, SkillCreateArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Skills.
     * @param {SkillCreateManyArgs} args - Arguments to create many Skills.
     * @example
     * // Create many Skills
     * const skill = await prisma.skill.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SkillCreateManyArgs>(args?: SelectSubset<T, SkillCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Skills and returns the data saved in the database.
     * @param {SkillCreateManyAndReturnArgs} args - Arguments to create many Skills.
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
    createManyAndReturn<T extends SkillCreateManyAndReturnArgs>(args?: SelectSubset<T, SkillCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Skill.
     * @param {SkillDeleteArgs} args - Arguments to delete one Skill.
     * @example
     * // Delete one Skill
     * const Skill = await prisma.skill.delete({
     *   where: {
     *     // ... filter to delete one Skill
     *   }
     * })
     * 
     */
    delete<T extends SkillDeleteArgs>(args: SelectSubset<T, SkillDeleteArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Skill.
     * @param {SkillUpdateArgs} args - Arguments to update one Skill.
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
    update<T extends SkillUpdateArgs>(args: SelectSubset<T, SkillUpdateArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Skills.
     * @param {SkillDeleteManyArgs} args - Arguments to filter Skills to delete.
     * @example
     * // Delete a few Skills
     * const { count } = await prisma.skill.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SkillDeleteManyArgs>(args?: SelectSubset<T, SkillDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Skills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillUpdateManyArgs} args - Arguments to update one or more rows.
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
    updateMany<T extends SkillUpdateManyArgs>(args: SelectSubset<T, SkillUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Skill.
     * @param {SkillUpsertArgs} args - Arguments to update or create a Skill.
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
    upsert<T extends SkillUpsertArgs>(args: SelectSubset<T, SkillUpsertArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Skills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillCountArgs} args - Arguments to filter Skills to count.
     * @example
     * // Count the number of Skills
     * const count = await prisma.skill.count({
     *   where: {
     *     // ... the filter for the Skills we want to count
     *   }
     * })
    **/
    count<T extends SkillCountArgs>(
      args?: Subset<T, SkillCountArgs>,
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
     * @param {SkillGroupByArgs} args - Group by arguments.
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
      T extends SkillGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SkillGroupByArgs['orderBy'] }
        : { orderBy?: SkillGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SkillGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSkillGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Skill model
   */
  readonly fields: SkillFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Skill.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SkillClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    diagnoses<T extends Skill$diagnosesArgs<ExtArgs> = {}>(args?: Subset<T, Skill$diagnosesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findMany"> | Null>
    interventions<T extends Skill$interventionsArgs<ExtArgs> = {}>(args?: Subset<T, Skill$interventionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Skill model
   */ 
  interface SkillFieldRefs {
    readonly id: FieldRef<"Skill", 'String'>
    readonly code: FieldRef<"Skill", 'String'>
    readonly name: FieldRef<"Skill", 'String'>
    readonly difficulty: FieldRef<"Skill", 'Int'>
    readonly description: FieldRef<"Skill", 'String'>
    readonly prereq_skills: FieldRef<"Skill", 'String[]'>
    readonly created_at: FieldRef<"Skill", 'DateTime'>
    readonly updated_at: FieldRef<"Skill", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Skill findUnique
   */
  export type SkillFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill findUniqueOrThrow
   */
  export type SkillFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill findFirst
   */
  export type SkillFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill findFirstOrThrow
   */
  export type SkillFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill findMany
   */
  export type SkillFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skills to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill create
   */
  export type SkillCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The data needed to create a Skill.
     */
    data: XOR<SkillCreateInput, SkillUncheckedCreateInput>
  }

  /**
   * Skill createMany
   */
  export type SkillCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Skills.
     */
    data: SkillCreateManyInput | SkillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Skill createManyAndReturn
   */
  export type SkillCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Skills.
     */
    data: SkillCreateManyInput | SkillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Skill update
   */
  export type SkillUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The data needed to update a Skill.
     */
    data: XOR<SkillUpdateInput, SkillUncheckedUpdateInput>
    /**
     * Choose, which Skill to update.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill updateMany
   */
  export type SkillUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Skills.
     */
    data: XOR<SkillUpdateManyMutationInput, SkillUncheckedUpdateManyInput>
    /**
     * Filter which Skills to update
     */
    where?: SkillWhereInput
  }

  /**
   * Skill upsert
   */
  export type SkillUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The filter to search for the Skill to update in case it exists.
     */
    where: SkillWhereUniqueInput
    /**
     * In case the Skill found by the `where` argument doesn't exist, create a new Skill with this data.
     */
    create: XOR<SkillCreateInput, SkillUncheckedCreateInput>
    /**
     * In case the Skill was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SkillUpdateInput, SkillUncheckedUpdateInput>
  }

  /**
   * Skill delete
   */
  export type SkillDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter which Skill to delete.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill deleteMany
   */
  export type SkillDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Skills to delete
     */
    where?: SkillWhereInput
  }

  /**
   * Skill.diagnoses
   */
  export type Skill$diagnosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    where?: DiagnosisWhereInput
    orderBy?: DiagnosisOrderByWithRelationInput | DiagnosisOrderByWithRelationInput[]
    cursor?: DiagnosisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DiagnosisScalarFieldEnum | DiagnosisScalarFieldEnum[]
  }

  /**
   * Skill.interventions
   */
  export type Skill$interventionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: InterventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionInclude<ExtArgs> | null
    where?: InterventionWhereInput
    orderBy?: InterventionOrderByWithRelationInput | InterventionOrderByWithRelationInput[]
    cursor?: InterventionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InterventionScalarFieldEnum | InterventionScalarFieldEnum[]
  }

  /**
   * Skill without action
   */
  export type SkillDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
  }


  /**
   * Model Diagnosis
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
    status: $Enums.DiagnosisStatus | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type DiagnosisMaxAggregateOutputType = {
    id: string | null
    student_id: string | null
    skill_id: string | null
    p_known: number | null
    confidence: number | null
    status: $Enums.DiagnosisStatus | null
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
     * Filter which Diagnosis to aggregate.
     */
    where?: DiagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Diagnoses to fetch.
     */
    orderBy?: DiagnosisOrderByWithRelationInput | DiagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Diagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Diagnoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Diagnoses
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




  export type DiagnosisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiagnosisWhereInput
    orderBy?: DiagnosisOrderByWithAggregationInput | DiagnosisOrderByWithAggregationInput[]
    by: DiagnosisScalarFieldEnum[] | DiagnosisScalarFieldEnum
    having?: DiagnosisScalarWhereWithAggregatesInput
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
    status: $Enums.DiagnosisStatus
    created_at: Date
    updated_at: Date
    _count: DiagnosisCountAggregateOutputType | null
    _avg: DiagnosisAvgAggregateOutputType | null
    _sum: DiagnosisSumAggregateOutputType | null
    _min: DiagnosisMinAggregateOutputType | null
    _max: DiagnosisMaxAggregateOutputType | null
  }

  type GetDiagnosisGroupByPayload<T extends DiagnosisGroupByArgs> = Prisma.PrismaPromise<
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


  export type DiagnosisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    skill_id?: boolean
    p_known?: boolean
    confidence?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    skill?: boolean | SkillDefaultArgs<ExtArgs>
    evidence?: boolean | Diagnosis$evidenceArgs<ExtArgs>
    _count?: boolean | DiagnosisCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["diagnosis"]>

  export type DiagnosisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    skill_id?: boolean
    p_known?: boolean
    confidence?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["diagnosis"]>

  export type DiagnosisSelectScalar = {
    id?: boolean
    student_id?: boolean
    skill_id?: boolean
    p_known?: boolean
    confidence?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type DiagnosisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skill?: boolean | SkillDefaultArgs<ExtArgs>
    evidence?: boolean | Diagnosis$evidenceArgs<ExtArgs>
    _count?: boolean | DiagnosisCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DiagnosisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }

  export type $DiagnosisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Diagnosis"
    objects: {
      skill: Prisma.$SkillPayload<ExtArgs>
      evidence: Prisma.$EvidenceItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      student_id: string
      skill_id: string
      p_known: number
      confidence: number
      status: $Enums.DiagnosisStatus
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["diagnosis"]>
    composites: {}
  }

  type DiagnosisGetPayload<S extends boolean | null | undefined | DiagnosisDefaultArgs> = $Result.GetResult<Prisma.$DiagnosisPayload, S>

  type DiagnosisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DiagnosisFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DiagnosisCountAggregateInputType | true
    }

  export interface DiagnosisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Diagnosis'], meta: { name: 'Diagnosis' } }
    /**
     * Find zero or one Diagnosis that matches the filter.
     * @param {DiagnosisFindUniqueArgs} args - Arguments to find a Diagnosis
     * @example
     * // Get one Diagnosis
     * const diagnosis = await prisma.diagnosis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiagnosisFindUniqueArgs>(args: SelectSubset<T, DiagnosisFindUniqueArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Diagnosis that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DiagnosisFindUniqueOrThrowArgs} args - Arguments to find a Diagnosis
     * @example
     * // Get one Diagnosis
     * const diagnosis = await prisma.diagnosis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiagnosisFindUniqueOrThrowArgs>(args: SelectSubset<T, DiagnosisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Diagnosis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisFindFirstArgs} args - Arguments to find a Diagnosis
     * @example
     * // Get one Diagnosis
     * const diagnosis = await prisma.diagnosis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiagnosisFindFirstArgs>(args?: SelectSubset<T, DiagnosisFindFirstArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Diagnosis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisFindFirstOrThrowArgs} args - Arguments to find a Diagnosis
     * @example
     * // Get one Diagnosis
     * const diagnosis = await prisma.diagnosis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiagnosisFindFirstOrThrowArgs>(args?: SelectSubset<T, DiagnosisFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Diagnoses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisFindManyArgs} args - Arguments to filter and select certain fields only.
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
    findMany<T extends DiagnosisFindManyArgs>(args?: SelectSubset<T, DiagnosisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Diagnosis.
     * @param {DiagnosisCreateArgs} args - Arguments to create a Diagnosis.
     * @example
     * // Create one Diagnosis
     * const Diagnosis = await prisma.diagnosis.create({
     *   data: {
     *     // ... data to create a Diagnosis
     *   }
     * })
     * 
     */
    create<T extends DiagnosisCreateArgs>(args: SelectSubset<T, DiagnosisCreateArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Diagnoses.
     * @param {DiagnosisCreateManyArgs} args - Arguments to create many Diagnoses.
     * @example
     * // Create many Diagnoses
     * const diagnosis = await prisma.diagnosis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiagnosisCreateManyArgs>(args?: SelectSubset<T, DiagnosisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Diagnoses and returns the data saved in the database.
     * @param {DiagnosisCreateManyAndReturnArgs} args - Arguments to create many Diagnoses.
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
    createManyAndReturn<T extends DiagnosisCreateManyAndReturnArgs>(args?: SelectSubset<T, DiagnosisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Diagnosis.
     * @param {DiagnosisDeleteArgs} args - Arguments to delete one Diagnosis.
     * @example
     * // Delete one Diagnosis
     * const Diagnosis = await prisma.diagnosis.delete({
     *   where: {
     *     // ... filter to delete one Diagnosis
     *   }
     * })
     * 
     */
    delete<T extends DiagnosisDeleteArgs>(args: SelectSubset<T, DiagnosisDeleteArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Diagnosis.
     * @param {DiagnosisUpdateArgs} args - Arguments to update one Diagnosis.
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
    update<T extends DiagnosisUpdateArgs>(args: SelectSubset<T, DiagnosisUpdateArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Diagnoses.
     * @param {DiagnosisDeleteManyArgs} args - Arguments to filter Diagnoses to delete.
     * @example
     * // Delete a few Diagnoses
     * const { count } = await prisma.diagnosis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiagnosisDeleteManyArgs>(args?: SelectSubset<T, DiagnosisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Diagnoses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisUpdateManyArgs} args - Arguments to update one or more rows.
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
    updateMany<T extends DiagnosisUpdateManyArgs>(args: SelectSubset<T, DiagnosisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Diagnosis.
     * @param {DiagnosisUpsertArgs} args - Arguments to update or create a Diagnosis.
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
    upsert<T extends DiagnosisUpsertArgs>(args: SelectSubset<T, DiagnosisUpsertArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Diagnoses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisCountArgs} args - Arguments to filter Diagnoses to count.
     * @example
     * // Count the number of Diagnoses
     * const count = await prisma.diagnosis.count({
     *   where: {
     *     // ... the filter for the Diagnoses we want to count
     *   }
     * })
    **/
    count<T extends DiagnosisCountArgs>(
      args?: Subset<T, DiagnosisCountArgs>,
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
     * @param {DiagnosisGroupByArgs} args - Group by arguments.
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
      T extends DiagnosisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiagnosisGroupByArgs['orderBy'] }
        : { orderBy?: DiagnosisGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DiagnosisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiagnosisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Diagnosis model
   */
  readonly fields: DiagnosisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Diagnosis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiagnosisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    skill<T extends SkillDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SkillDefaultArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    evidence<T extends Diagnosis$evidenceArgs<ExtArgs> = {}>(args?: Subset<T, Diagnosis$evidenceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvidenceItemPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Diagnosis model
   */ 
  interface DiagnosisFieldRefs {
    readonly id: FieldRef<"Diagnosis", 'String'>
    readonly student_id: FieldRef<"Diagnosis", 'String'>
    readonly skill_id: FieldRef<"Diagnosis", 'String'>
    readonly p_known: FieldRef<"Diagnosis", 'Float'>
    readonly confidence: FieldRef<"Diagnosis", 'Float'>
    readonly status: FieldRef<"Diagnosis", 'DiagnosisStatus'>
    readonly created_at: FieldRef<"Diagnosis", 'DateTime'>
    readonly updated_at: FieldRef<"Diagnosis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Diagnosis findUnique
   */
  export type DiagnosisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which Diagnosis to fetch.
     */
    where: DiagnosisWhereUniqueInput
  }

  /**
   * Diagnosis findUniqueOrThrow
   */
  export type DiagnosisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which Diagnosis to fetch.
     */
    where: DiagnosisWhereUniqueInput
  }

  /**
   * Diagnosis findFirst
   */
  export type DiagnosisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which Diagnosis to fetch.
     */
    where?: DiagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Diagnoses to fetch.
     */
    orderBy?: DiagnosisOrderByWithRelationInput | DiagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Diagnoses.
     */
    cursor?: DiagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Diagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Diagnoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Diagnoses.
     */
    distinct?: DiagnosisScalarFieldEnum | DiagnosisScalarFieldEnum[]
  }

  /**
   * Diagnosis findFirstOrThrow
   */
  export type DiagnosisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which Diagnosis to fetch.
     */
    where?: DiagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Diagnoses to fetch.
     */
    orderBy?: DiagnosisOrderByWithRelationInput | DiagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Diagnoses.
     */
    cursor?: DiagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Diagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Diagnoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Diagnoses.
     */
    distinct?: DiagnosisScalarFieldEnum | DiagnosisScalarFieldEnum[]
  }

  /**
   * Diagnosis findMany
   */
  export type DiagnosisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which Diagnoses to fetch.
     */
    where?: DiagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Diagnoses to fetch.
     */
    orderBy?: DiagnosisOrderByWithRelationInput | DiagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Diagnoses.
     */
    cursor?: DiagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Diagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Diagnoses.
     */
    skip?: number
    distinct?: DiagnosisScalarFieldEnum | DiagnosisScalarFieldEnum[]
  }

  /**
   * Diagnosis create
   */
  export type DiagnosisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * The data needed to create a Diagnosis.
     */
    data: XOR<DiagnosisCreateInput, DiagnosisUncheckedCreateInput>
  }

  /**
   * Diagnosis createMany
   */
  export type DiagnosisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Diagnoses.
     */
    data: DiagnosisCreateManyInput | DiagnosisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Diagnosis createManyAndReturn
   */
  export type DiagnosisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Diagnoses.
     */
    data: DiagnosisCreateManyInput | DiagnosisCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Diagnosis update
   */
  export type DiagnosisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * The data needed to update a Diagnosis.
     */
    data: XOR<DiagnosisUpdateInput, DiagnosisUncheckedUpdateInput>
    /**
     * Choose, which Diagnosis to update.
     */
    where: DiagnosisWhereUniqueInput
  }

  /**
   * Diagnosis updateMany
   */
  export type DiagnosisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Diagnoses.
     */
    data: XOR<DiagnosisUpdateManyMutationInput, DiagnosisUncheckedUpdateManyInput>
    /**
     * Filter which Diagnoses to update
     */
    where?: DiagnosisWhereInput
  }

  /**
   * Diagnosis upsert
   */
  export type DiagnosisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * The filter to search for the Diagnosis to update in case it exists.
     */
    where: DiagnosisWhereUniqueInput
    /**
     * In case the Diagnosis found by the `where` argument doesn't exist, create a new Diagnosis with this data.
     */
    create: XOR<DiagnosisCreateInput, DiagnosisUncheckedCreateInput>
    /**
     * In case the Diagnosis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiagnosisUpdateInput, DiagnosisUncheckedUpdateInput>
  }

  /**
   * Diagnosis delete
   */
  export type DiagnosisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * Filter which Diagnosis to delete.
     */
    where: DiagnosisWhereUniqueInput
  }

  /**
   * Diagnosis deleteMany
   */
  export type DiagnosisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Diagnoses to delete
     */
    where?: DiagnosisWhereInput
  }

  /**
   * Diagnosis.evidence
   */
  export type Diagnosis$evidenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidenceItem
     */
    select?: EvidenceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceItemInclude<ExtArgs> | null
    where?: EvidenceItemWhereInput
    orderBy?: EvidenceItemOrderByWithRelationInput | EvidenceItemOrderByWithRelationInput[]
    cursor?: EvidenceItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EvidenceItemScalarFieldEnum | EvidenceItemScalarFieldEnum[]
  }

  /**
   * Diagnosis without action
   */
  export type DiagnosisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
  }


  /**
   * Model EvidenceItem
   */

  export type AggregateEvidenceItem = {
    _count: EvidenceItemCountAggregateOutputType | null
    _avg: EvidenceItemAvgAggregateOutputType | null
    _sum: EvidenceItemSumAggregateOutputType | null
    _min: EvidenceItemMinAggregateOutputType | null
    _max: EvidenceItemMaxAggregateOutputType | null
  }

  export type EvidenceItemAvgAggregateOutputType = {
    confidence: number | null
  }

  export type EvidenceItemSumAggregateOutputType = {
    confidence: number | null
  }

  export type EvidenceItemMinAggregateOutputType = {
    id: string | null
    diagnosis_id: string | null
    item_id: string | null
    extracted_answer: string | null
    correct: boolean | null
    confidence: number | null
    quality: $Enums.EvidenceQuality | null
    created_at: Date | null
  }

  export type EvidenceItemMaxAggregateOutputType = {
    id: string | null
    diagnosis_id: string | null
    item_id: string | null
    extracted_answer: string | null
    correct: boolean | null
    confidence: number | null
    quality: $Enums.EvidenceQuality | null
    created_at: Date | null
  }

  export type EvidenceItemCountAggregateOutputType = {
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


  export type EvidenceItemAvgAggregateInputType = {
    confidence?: true
  }

  export type EvidenceItemSumAggregateInputType = {
    confidence?: true
  }

  export type EvidenceItemMinAggregateInputType = {
    id?: true
    diagnosis_id?: true
    item_id?: true
    extracted_answer?: true
    correct?: true
    confidence?: true
    quality?: true
    created_at?: true
  }

  export type EvidenceItemMaxAggregateInputType = {
    id?: true
    diagnosis_id?: true
    item_id?: true
    extracted_answer?: true
    correct?: true
    confidence?: true
    quality?: true
    created_at?: true
  }

  export type EvidenceItemCountAggregateInputType = {
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

  export type EvidenceItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EvidenceItem to aggregate.
     */
    where?: EvidenceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvidenceItems to fetch.
     */
    orderBy?: EvidenceItemOrderByWithRelationInput | EvidenceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EvidenceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvidenceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvidenceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EvidenceItems
    **/
    _count?: true | EvidenceItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EvidenceItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EvidenceItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EvidenceItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EvidenceItemMaxAggregateInputType
  }

  export type GetEvidenceItemAggregateType<T extends EvidenceItemAggregateArgs> = {
        [P in keyof T & keyof AggregateEvidenceItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvidenceItem[P]>
      : GetScalarType<T[P], AggregateEvidenceItem[P]>
  }




  export type EvidenceItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EvidenceItemWhereInput
    orderBy?: EvidenceItemOrderByWithAggregationInput | EvidenceItemOrderByWithAggregationInput[]
    by: EvidenceItemScalarFieldEnum[] | EvidenceItemScalarFieldEnum
    having?: EvidenceItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EvidenceItemCountAggregateInputType | true
    _avg?: EvidenceItemAvgAggregateInputType
    _sum?: EvidenceItemSumAggregateInputType
    _min?: EvidenceItemMinAggregateInputType
    _max?: EvidenceItemMaxAggregateInputType
  }

  export type EvidenceItemGroupByOutputType = {
    id: string
    diagnosis_id: string
    item_id: string
    extracted_answer: string | null
    correct: boolean
    confidence: number
    quality: $Enums.EvidenceQuality
    created_at: Date
    _count: EvidenceItemCountAggregateOutputType | null
    _avg: EvidenceItemAvgAggregateOutputType | null
    _sum: EvidenceItemSumAggregateOutputType | null
    _min: EvidenceItemMinAggregateOutputType | null
    _max: EvidenceItemMaxAggregateOutputType | null
  }

  type GetEvidenceItemGroupByPayload<T extends EvidenceItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EvidenceItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EvidenceItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EvidenceItemGroupByOutputType[P]>
            : GetScalarType<T[P], EvidenceItemGroupByOutputType[P]>
        }
      >
    >


  export type EvidenceItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    diagnosis_id?: boolean
    item_id?: boolean
    extracted_answer?: boolean
    correct?: boolean
    confidence?: boolean
    quality?: boolean
    created_at?: boolean
    diagnosis?: boolean | DiagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evidenceItem"]>

  export type EvidenceItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    diagnosis_id?: boolean
    item_id?: boolean
    extracted_answer?: boolean
    correct?: boolean
    confidence?: boolean
    quality?: boolean
    created_at?: boolean
    diagnosis?: boolean | DiagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evidenceItem"]>

  export type EvidenceItemSelectScalar = {
    id?: boolean
    diagnosis_id?: boolean
    item_id?: boolean
    extracted_answer?: boolean
    correct?: boolean
    confidence?: boolean
    quality?: boolean
    created_at?: boolean
  }

  export type EvidenceItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diagnosis?: boolean | DiagnosisDefaultArgs<ExtArgs>
  }
  export type EvidenceItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diagnosis?: boolean | DiagnosisDefaultArgs<ExtArgs>
  }

  export type $EvidenceItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EvidenceItem"
    objects: {
      diagnosis: Prisma.$DiagnosisPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      diagnosis_id: string
      item_id: string
      extracted_answer: string | null
      correct: boolean
      confidence: number
      quality: $Enums.EvidenceQuality
      created_at: Date
    }, ExtArgs["result"]["evidenceItem"]>
    composites: {}
  }

  type EvidenceItemGetPayload<S extends boolean | null | undefined | EvidenceItemDefaultArgs> = $Result.GetResult<Prisma.$EvidenceItemPayload, S>

  type EvidenceItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EvidenceItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EvidenceItemCountAggregateInputType | true
    }

  export interface EvidenceItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EvidenceItem'], meta: { name: 'EvidenceItem' } }
    /**
     * Find zero or one EvidenceItem that matches the filter.
     * @param {EvidenceItemFindUniqueArgs} args - Arguments to find a EvidenceItem
     * @example
     * // Get one EvidenceItem
     * const evidenceItem = await prisma.evidenceItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EvidenceItemFindUniqueArgs>(args: SelectSubset<T, EvidenceItemFindUniqueArgs<ExtArgs>>): Prisma__EvidenceItemClient<$Result.GetResult<Prisma.$EvidenceItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EvidenceItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EvidenceItemFindUniqueOrThrowArgs} args - Arguments to find a EvidenceItem
     * @example
     * // Get one EvidenceItem
     * const evidenceItem = await prisma.evidenceItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EvidenceItemFindUniqueOrThrowArgs>(args: SelectSubset<T, EvidenceItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EvidenceItemClient<$Result.GetResult<Prisma.$EvidenceItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EvidenceItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceItemFindFirstArgs} args - Arguments to find a EvidenceItem
     * @example
     * // Get one EvidenceItem
     * const evidenceItem = await prisma.evidenceItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EvidenceItemFindFirstArgs>(args?: SelectSubset<T, EvidenceItemFindFirstArgs<ExtArgs>>): Prisma__EvidenceItemClient<$Result.GetResult<Prisma.$EvidenceItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EvidenceItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceItemFindFirstOrThrowArgs} args - Arguments to find a EvidenceItem
     * @example
     * // Get one EvidenceItem
     * const evidenceItem = await prisma.evidenceItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EvidenceItemFindFirstOrThrowArgs>(args?: SelectSubset<T, EvidenceItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__EvidenceItemClient<$Result.GetResult<Prisma.$EvidenceItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EvidenceItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EvidenceItems
     * const evidenceItems = await prisma.evidenceItem.findMany()
     * 
     * // Get first 10 EvidenceItems
     * const evidenceItems = await prisma.evidenceItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const evidenceItemWithIdOnly = await prisma.evidenceItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EvidenceItemFindManyArgs>(args?: SelectSubset<T, EvidenceItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvidenceItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EvidenceItem.
     * @param {EvidenceItemCreateArgs} args - Arguments to create a EvidenceItem.
     * @example
     * // Create one EvidenceItem
     * const EvidenceItem = await prisma.evidenceItem.create({
     *   data: {
     *     // ... data to create a EvidenceItem
     *   }
     * })
     * 
     */
    create<T extends EvidenceItemCreateArgs>(args: SelectSubset<T, EvidenceItemCreateArgs<ExtArgs>>): Prisma__EvidenceItemClient<$Result.GetResult<Prisma.$EvidenceItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EvidenceItems.
     * @param {EvidenceItemCreateManyArgs} args - Arguments to create many EvidenceItems.
     * @example
     * // Create many EvidenceItems
     * const evidenceItem = await prisma.evidenceItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EvidenceItemCreateManyArgs>(args?: SelectSubset<T, EvidenceItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EvidenceItems and returns the data saved in the database.
     * @param {EvidenceItemCreateManyAndReturnArgs} args - Arguments to create many EvidenceItems.
     * @example
     * // Create many EvidenceItems
     * const evidenceItem = await prisma.evidenceItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EvidenceItems and only return the `id`
     * const evidenceItemWithIdOnly = await prisma.evidenceItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EvidenceItemCreateManyAndReturnArgs>(args?: SelectSubset<T, EvidenceItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvidenceItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EvidenceItem.
     * @param {EvidenceItemDeleteArgs} args - Arguments to delete one EvidenceItem.
     * @example
     * // Delete one EvidenceItem
     * const EvidenceItem = await prisma.evidenceItem.delete({
     *   where: {
     *     // ... filter to delete one EvidenceItem
     *   }
     * })
     * 
     */
    delete<T extends EvidenceItemDeleteArgs>(args: SelectSubset<T, EvidenceItemDeleteArgs<ExtArgs>>): Prisma__EvidenceItemClient<$Result.GetResult<Prisma.$EvidenceItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EvidenceItem.
     * @param {EvidenceItemUpdateArgs} args - Arguments to update one EvidenceItem.
     * @example
     * // Update one EvidenceItem
     * const evidenceItem = await prisma.evidenceItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EvidenceItemUpdateArgs>(args: SelectSubset<T, EvidenceItemUpdateArgs<ExtArgs>>): Prisma__EvidenceItemClient<$Result.GetResult<Prisma.$EvidenceItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EvidenceItems.
     * @param {EvidenceItemDeleteManyArgs} args - Arguments to filter EvidenceItems to delete.
     * @example
     * // Delete a few EvidenceItems
     * const { count } = await prisma.evidenceItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EvidenceItemDeleteManyArgs>(args?: SelectSubset<T, EvidenceItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EvidenceItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EvidenceItems
     * const evidenceItem = await prisma.evidenceItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EvidenceItemUpdateManyArgs>(args: SelectSubset<T, EvidenceItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EvidenceItem.
     * @param {EvidenceItemUpsertArgs} args - Arguments to update or create a EvidenceItem.
     * @example
     * // Update or create a EvidenceItem
     * const evidenceItem = await prisma.evidenceItem.upsert({
     *   create: {
     *     // ... data to create a EvidenceItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EvidenceItem we want to update
     *   }
     * })
     */
    upsert<T extends EvidenceItemUpsertArgs>(args: SelectSubset<T, EvidenceItemUpsertArgs<ExtArgs>>): Prisma__EvidenceItemClient<$Result.GetResult<Prisma.$EvidenceItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EvidenceItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceItemCountArgs} args - Arguments to filter EvidenceItems to count.
     * @example
     * // Count the number of EvidenceItems
     * const count = await prisma.evidenceItem.count({
     *   where: {
     *     // ... the filter for the EvidenceItems we want to count
     *   }
     * })
    **/
    count<T extends EvidenceItemCountArgs>(
      args?: Subset<T, EvidenceItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EvidenceItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EvidenceItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EvidenceItemAggregateArgs>(args: Subset<T, EvidenceItemAggregateArgs>): Prisma.PrismaPromise<GetEvidenceItemAggregateType<T>>

    /**
     * Group by EvidenceItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvidenceItemGroupByArgs} args - Group by arguments.
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
      T extends EvidenceItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EvidenceItemGroupByArgs['orderBy'] }
        : { orderBy?: EvidenceItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EvidenceItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEvidenceItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EvidenceItem model
   */
  readonly fields: EvidenceItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EvidenceItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EvidenceItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    diagnosis<T extends DiagnosisDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DiagnosisDefaultArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the EvidenceItem model
   */ 
  interface EvidenceItemFieldRefs {
    readonly id: FieldRef<"EvidenceItem", 'String'>
    readonly diagnosis_id: FieldRef<"EvidenceItem", 'String'>
    readonly item_id: FieldRef<"EvidenceItem", 'String'>
    readonly extracted_answer: FieldRef<"EvidenceItem", 'String'>
    readonly correct: FieldRef<"EvidenceItem", 'Boolean'>
    readonly confidence: FieldRef<"EvidenceItem", 'Float'>
    readonly quality: FieldRef<"EvidenceItem", 'EvidenceQuality'>
    readonly created_at: FieldRef<"EvidenceItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EvidenceItem findUnique
   */
  export type EvidenceItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidenceItem
     */
    select?: EvidenceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceItemInclude<ExtArgs> | null
    /**
     * Filter, which EvidenceItem to fetch.
     */
    where: EvidenceItemWhereUniqueInput
  }

  /**
   * EvidenceItem findUniqueOrThrow
   */
  export type EvidenceItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidenceItem
     */
    select?: EvidenceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceItemInclude<ExtArgs> | null
    /**
     * Filter, which EvidenceItem to fetch.
     */
    where: EvidenceItemWhereUniqueInput
  }

  /**
   * EvidenceItem findFirst
   */
  export type EvidenceItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidenceItem
     */
    select?: EvidenceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceItemInclude<ExtArgs> | null
    /**
     * Filter, which EvidenceItem to fetch.
     */
    where?: EvidenceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvidenceItems to fetch.
     */
    orderBy?: EvidenceItemOrderByWithRelationInput | EvidenceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EvidenceItems.
     */
    cursor?: EvidenceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvidenceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvidenceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EvidenceItems.
     */
    distinct?: EvidenceItemScalarFieldEnum | EvidenceItemScalarFieldEnum[]
  }

  /**
   * EvidenceItem findFirstOrThrow
   */
  export type EvidenceItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidenceItem
     */
    select?: EvidenceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceItemInclude<ExtArgs> | null
    /**
     * Filter, which EvidenceItem to fetch.
     */
    where?: EvidenceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvidenceItems to fetch.
     */
    orderBy?: EvidenceItemOrderByWithRelationInput | EvidenceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EvidenceItems.
     */
    cursor?: EvidenceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvidenceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvidenceItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EvidenceItems.
     */
    distinct?: EvidenceItemScalarFieldEnum | EvidenceItemScalarFieldEnum[]
  }

  /**
   * EvidenceItem findMany
   */
  export type EvidenceItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidenceItem
     */
    select?: EvidenceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceItemInclude<ExtArgs> | null
    /**
     * Filter, which EvidenceItems to fetch.
     */
    where?: EvidenceItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvidenceItems to fetch.
     */
    orderBy?: EvidenceItemOrderByWithRelationInput | EvidenceItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EvidenceItems.
     */
    cursor?: EvidenceItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvidenceItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvidenceItems.
     */
    skip?: number
    distinct?: EvidenceItemScalarFieldEnum | EvidenceItemScalarFieldEnum[]
  }

  /**
   * EvidenceItem create
   */
  export type EvidenceItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidenceItem
     */
    select?: EvidenceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceItemInclude<ExtArgs> | null
    /**
     * The data needed to create a EvidenceItem.
     */
    data: XOR<EvidenceItemCreateInput, EvidenceItemUncheckedCreateInput>
  }

  /**
   * EvidenceItem createMany
   */
  export type EvidenceItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EvidenceItems.
     */
    data: EvidenceItemCreateManyInput | EvidenceItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EvidenceItem createManyAndReturn
   */
  export type EvidenceItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidenceItem
     */
    select?: EvidenceItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EvidenceItems.
     */
    data: EvidenceItemCreateManyInput | EvidenceItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EvidenceItem update
   */
  export type EvidenceItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidenceItem
     */
    select?: EvidenceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceItemInclude<ExtArgs> | null
    /**
     * The data needed to update a EvidenceItem.
     */
    data: XOR<EvidenceItemUpdateInput, EvidenceItemUncheckedUpdateInput>
    /**
     * Choose, which EvidenceItem to update.
     */
    where: EvidenceItemWhereUniqueInput
  }

  /**
   * EvidenceItem updateMany
   */
  export type EvidenceItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EvidenceItems.
     */
    data: XOR<EvidenceItemUpdateManyMutationInput, EvidenceItemUncheckedUpdateManyInput>
    /**
     * Filter which EvidenceItems to update
     */
    where?: EvidenceItemWhereInput
  }

  /**
   * EvidenceItem upsert
   */
  export type EvidenceItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidenceItem
     */
    select?: EvidenceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceItemInclude<ExtArgs> | null
    /**
     * The filter to search for the EvidenceItem to update in case it exists.
     */
    where: EvidenceItemWhereUniqueInput
    /**
     * In case the EvidenceItem found by the `where` argument doesn't exist, create a new EvidenceItem with this data.
     */
    create: XOR<EvidenceItemCreateInput, EvidenceItemUncheckedCreateInput>
    /**
     * In case the EvidenceItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EvidenceItemUpdateInput, EvidenceItemUncheckedUpdateInput>
  }

  /**
   * EvidenceItem delete
   */
  export type EvidenceItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidenceItem
     */
    select?: EvidenceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceItemInclude<ExtArgs> | null
    /**
     * Filter which EvidenceItem to delete.
     */
    where: EvidenceItemWhereUniqueInput
  }

  /**
   * EvidenceItem deleteMany
   */
  export type EvidenceItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EvidenceItems to delete
     */
    where?: EvidenceItemWhereInput
  }

  /**
   * EvidenceItem without action
   */
  export type EvidenceItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvidenceItem
     */
    select?: EvidenceItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvidenceItemInclude<ExtArgs> | null
  }


  /**
   * Model Intervention
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
    status: $Enums.InterventionStatus | null
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
    status: $Enums.InterventionStatus | null
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
     * Filter which Intervention to aggregate.
     */
    where?: InterventionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Interventions to fetch.
     */
    orderBy?: InterventionOrderByWithRelationInput | InterventionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InterventionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Interventions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Interventions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Interventions
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




  export type InterventionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InterventionWhereInput
    orderBy?: InterventionOrderByWithAggregationInput | InterventionOrderByWithAggregationInput[]
    by: InterventionScalarFieldEnum[] | InterventionScalarFieldEnum
    having?: InterventionScalarWhereWithAggregatesInput
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
    status: $Enums.InterventionStatus
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

  type GetInterventionGroupByPayload<T extends InterventionGroupByArgs> = Prisma.PrismaPromise<
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


  export type InterventionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    skill_id?: boolean
    priority?: boolean
    status?: boolean
    teacher_id?: boolean
    notes?: boolean
    created_at?: boolean
    resolved_at?: boolean
    skill?: boolean | SkillDefaultArgs<ExtArgs>
    notes_list?: boolean | Intervention$notes_listArgs<ExtArgs>
    _count?: boolean | InterventionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["intervention"]>

  export type InterventionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    skill_id?: boolean
    priority?: boolean
    status?: boolean
    teacher_id?: boolean
    notes?: boolean
    created_at?: boolean
    resolved_at?: boolean
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["intervention"]>

  export type InterventionSelectScalar = {
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

  export type InterventionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skill?: boolean | SkillDefaultArgs<ExtArgs>
    notes_list?: boolean | Intervention$notes_listArgs<ExtArgs>
    _count?: boolean | InterventionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InterventionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }

  export type $InterventionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Intervention"
    objects: {
      skill: Prisma.$SkillPayload<ExtArgs>
      notes_list: Prisma.$InterventionNotePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      student_id: string
      skill_id: string
      priority: number
      status: $Enums.InterventionStatus
      teacher_id: string | null
      notes: string | null
      created_at: Date
      resolved_at: Date | null
    }, ExtArgs["result"]["intervention"]>
    composites: {}
  }

  type InterventionGetPayload<S extends boolean | null | undefined | InterventionDefaultArgs> = $Result.GetResult<Prisma.$InterventionPayload, S>

  type InterventionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InterventionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InterventionCountAggregateInputType | true
    }

  export interface InterventionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Intervention'], meta: { name: 'Intervention' } }
    /**
     * Find zero or one Intervention that matches the filter.
     * @param {InterventionFindUniqueArgs} args - Arguments to find a Intervention
     * @example
     * // Get one Intervention
     * const intervention = await prisma.intervention.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InterventionFindUniqueArgs>(args: SelectSubset<T, InterventionFindUniqueArgs<ExtArgs>>): Prisma__InterventionClient<$Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Intervention that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InterventionFindUniqueOrThrowArgs} args - Arguments to find a Intervention
     * @example
     * // Get one Intervention
     * const intervention = await prisma.intervention.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InterventionFindUniqueOrThrowArgs>(args: SelectSubset<T, InterventionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InterventionClient<$Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Intervention that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionFindFirstArgs} args - Arguments to find a Intervention
     * @example
     * // Get one Intervention
     * const intervention = await prisma.intervention.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InterventionFindFirstArgs>(args?: SelectSubset<T, InterventionFindFirstArgs<ExtArgs>>): Prisma__InterventionClient<$Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Intervention that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionFindFirstOrThrowArgs} args - Arguments to find a Intervention
     * @example
     * // Get one Intervention
     * const intervention = await prisma.intervention.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InterventionFindFirstOrThrowArgs>(args?: SelectSubset<T, InterventionFindFirstOrThrowArgs<ExtArgs>>): Prisma__InterventionClient<$Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Interventions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionFindManyArgs} args - Arguments to filter and select certain fields only.
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
    findMany<T extends InterventionFindManyArgs>(args?: SelectSubset<T, InterventionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Intervention.
     * @param {InterventionCreateArgs} args - Arguments to create a Intervention.
     * @example
     * // Create one Intervention
     * const Intervention = await prisma.intervention.create({
     *   data: {
     *     // ... data to create a Intervention
     *   }
     * })
     * 
     */
    create<T extends InterventionCreateArgs>(args: SelectSubset<T, InterventionCreateArgs<ExtArgs>>): Prisma__InterventionClient<$Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Interventions.
     * @param {InterventionCreateManyArgs} args - Arguments to create many Interventions.
     * @example
     * // Create many Interventions
     * const intervention = await prisma.intervention.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InterventionCreateManyArgs>(args?: SelectSubset<T, InterventionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Interventions and returns the data saved in the database.
     * @param {InterventionCreateManyAndReturnArgs} args - Arguments to create many Interventions.
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
    createManyAndReturn<T extends InterventionCreateManyAndReturnArgs>(args?: SelectSubset<T, InterventionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Intervention.
     * @param {InterventionDeleteArgs} args - Arguments to delete one Intervention.
     * @example
     * // Delete one Intervention
     * const Intervention = await prisma.intervention.delete({
     *   where: {
     *     // ... filter to delete one Intervention
     *   }
     * })
     * 
     */
    delete<T extends InterventionDeleteArgs>(args: SelectSubset<T, InterventionDeleteArgs<ExtArgs>>): Prisma__InterventionClient<$Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Intervention.
     * @param {InterventionUpdateArgs} args - Arguments to update one Intervention.
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
    update<T extends InterventionUpdateArgs>(args: SelectSubset<T, InterventionUpdateArgs<ExtArgs>>): Prisma__InterventionClient<$Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Interventions.
     * @param {InterventionDeleteManyArgs} args - Arguments to filter Interventions to delete.
     * @example
     * // Delete a few Interventions
     * const { count } = await prisma.intervention.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InterventionDeleteManyArgs>(args?: SelectSubset<T, InterventionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Interventions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionUpdateManyArgs} args - Arguments to update one or more rows.
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
    updateMany<T extends InterventionUpdateManyArgs>(args: SelectSubset<T, InterventionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Intervention.
     * @param {InterventionUpsertArgs} args - Arguments to update or create a Intervention.
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
    upsert<T extends InterventionUpsertArgs>(args: SelectSubset<T, InterventionUpsertArgs<ExtArgs>>): Prisma__InterventionClient<$Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Interventions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionCountArgs} args - Arguments to filter Interventions to count.
     * @example
     * // Count the number of Interventions
     * const count = await prisma.intervention.count({
     *   where: {
     *     // ... the filter for the Interventions we want to count
     *   }
     * })
    **/
    count<T extends InterventionCountArgs>(
      args?: Subset<T, InterventionCountArgs>,
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
     * @param {InterventionGroupByArgs} args - Group by arguments.
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
      T extends InterventionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InterventionGroupByArgs['orderBy'] }
        : { orderBy?: InterventionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InterventionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInterventionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Intervention model
   */
  readonly fields: InterventionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Intervention.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InterventionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    skill<T extends SkillDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SkillDefaultArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    notes_list<T extends Intervention$notes_listArgs<ExtArgs> = {}>(args?: Subset<T, Intervention$notes_listArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterventionNotePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Intervention model
   */ 
  interface InterventionFieldRefs {
    readonly id: FieldRef<"Intervention", 'String'>
    readonly student_id: FieldRef<"Intervention", 'String'>
    readonly skill_id: FieldRef<"Intervention", 'String'>
    readonly priority: FieldRef<"Intervention", 'Int'>
    readonly status: FieldRef<"Intervention", 'InterventionStatus'>
    readonly teacher_id: FieldRef<"Intervention", 'String'>
    readonly notes: FieldRef<"Intervention", 'String'>
    readonly created_at: FieldRef<"Intervention", 'DateTime'>
    readonly resolved_at: FieldRef<"Intervention", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Intervention findUnique
   */
  export type InterventionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: InterventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionInclude<ExtArgs> | null
    /**
     * Filter, which Intervention to fetch.
     */
    where: InterventionWhereUniqueInput
  }

  /**
   * Intervention findUniqueOrThrow
   */
  export type InterventionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: InterventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionInclude<ExtArgs> | null
    /**
     * Filter, which Intervention to fetch.
     */
    where: InterventionWhereUniqueInput
  }

  /**
   * Intervention findFirst
   */
  export type InterventionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: InterventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionInclude<ExtArgs> | null
    /**
     * Filter, which Intervention to fetch.
     */
    where?: InterventionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Interventions to fetch.
     */
    orderBy?: InterventionOrderByWithRelationInput | InterventionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Interventions.
     */
    cursor?: InterventionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Interventions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Interventions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Interventions.
     */
    distinct?: InterventionScalarFieldEnum | InterventionScalarFieldEnum[]
  }

  /**
   * Intervention findFirstOrThrow
   */
  export type InterventionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: InterventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionInclude<ExtArgs> | null
    /**
     * Filter, which Intervention to fetch.
     */
    where?: InterventionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Interventions to fetch.
     */
    orderBy?: InterventionOrderByWithRelationInput | InterventionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Interventions.
     */
    cursor?: InterventionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Interventions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Interventions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Interventions.
     */
    distinct?: InterventionScalarFieldEnum | InterventionScalarFieldEnum[]
  }

  /**
   * Intervention findMany
   */
  export type InterventionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: InterventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionInclude<ExtArgs> | null
    /**
     * Filter, which Interventions to fetch.
     */
    where?: InterventionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Interventions to fetch.
     */
    orderBy?: InterventionOrderByWithRelationInput | InterventionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Interventions.
     */
    cursor?: InterventionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Interventions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Interventions.
     */
    skip?: number
    distinct?: InterventionScalarFieldEnum | InterventionScalarFieldEnum[]
  }

  /**
   * Intervention create
   */
  export type InterventionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: InterventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionInclude<ExtArgs> | null
    /**
     * The data needed to create a Intervention.
     */
    data: XOR<InterventionCreateInput, InterventionUncheckedCreateInput>
  }

  /**
   * Intervention createMany
   */
  export type InterventionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Interventions.
     */
    data: InterventionCreateManyInput | InterventionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Intervention createManyAndReturn
   */
  export type InterventionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: InterventionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Interventions.
     */
    data: InterventionCreateManyInput | InterventionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Intervention update
   */
  export type InterventionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: InterventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionInclude<ExtArgs> | null
    /**
     * The data needed to update a Intervention.
     */
    data: XOR<InterventionUpdateInput, InterventionUncheckedUpdateInput>
    /**
     * Choose, which Intervention to update.
     */
    where: InterventionWhereUniqueInput
  }

  /**
   * Intervention updateMany
   */
  export type InterventionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Interventions.
     */
    data: XOR<InterventionUpdateManyMutationInput, InterventionUncheckedUpdateManyInput>
    /**
     * Filter which Interventions to update
     */
    where?: InterventionWhereInput
  }

  /**
   * Intervention upsert
   */
  export type InterventionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: InterventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionInclude<ExtArgs> | null
    /**
     * The filter to search for the Intervention to update in case it exists.
     */
    where: InterventionWhereUniqueInput
    /**
     * In case the Intervention found by the `where` argument doesn't exist, create a new Intervention with this data.
     */
    create: XOR<InterventionCreateInput, InterventionUncheckedCreateInput>
    /**
     * In case the Intervention was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InterventionUpdateInput, InterventionUncheckedUpdateInput>
  }

  /**
   * Intervention delete
   */
  export type InterventionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: InterventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionInclude<ExtArgs> | null
    /**
     * Filter which Intervention to delete.
     */
    where: InterventionWhereUniqueInput
  }

  /**
   * Intervention deleteMany
   */
  export type InterventionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Interventions to delete
     */
    where?: InterventionWhereInput
  }

  /**
   * Intervention.notes_list
   */
  export type Intervention$notes_listArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionNote
     */
    select?: InterventionNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionNoteInclude<ExtArgs> | null
    where?: InterventionNoteWhereInput
    orderBy?: InterventionNoteOrderByWithRelationInput | InterventionNoteOrderByWithRelationInput[]
    cursor?: InterventionNoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InterventionNoteScalarFieldEnum | InterventionNoteScalarFieldEnum[]
  }

  /**
   * Intervention without action
   */
  export type InterventionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: InterventionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionInclude<ExtArgs> | null
  }


  /**
   * Model InterventionNote
   */

  export type AggregateInterventionNote = {
    _count: InterventionNoteCountAggregateOutputType | null
    _min: InterventionNoteMinAggregateOutputType | null
    _max: InterventionNoteMaxAggregateOutputType | null
  }

  export type InterventionNoteMinAggregateOutputType = {
    id: string | null
    intervention_id: string | null
    teacher_id: string | null
    content: string | null
    created_at: Date | null
  }

  export type InterventionNoteMaxAggregateOutputType = {
    id: string | null
    intervention_id: string | null
    teacher_id: string | null
    content: string | null
    created_at: Date | null
  }

  export type InterventionNoteCountAggregateOutputType = {
    id: number
    intervention_id: number
    teacher_id: number
    content: number
    created_at: number
    _all: number
  }


  export type InterventionNoteMinAggregateInputType = {
    id?: true
    intervention_id?: true
    teacher_id?: true
    content?: true
    created_at?: true
  }

  export type InterventionNoteMaxAggregateInputType = {
    id?: true
    intervention_id?: true
    teacher_id?: true
    content?: true
    created_at?: true
  }

  export type InterventionNoteCountAggregateInputType = {
    id?: true
    intervention_id?: true
    teacher_id?: true
    content?: true
    created_at?: true
    _all?: true
  }

  export type InterventionNoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InterventionNote to aggregate.
     */
    where?: InterventionNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InterventionNotes to fetch.
     */
    orderBy?: InterventionNoteOrderByWithRelationInput | InterventionNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InterventionNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InterventionNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InterventionNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InterventionNotes
    **/
    _count?: true | InterventionNoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InterventionNoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InterventionNoteMaxAggregateInputType
  }

  export type GetInterventionNoteAggregateType<T extends InterventionNoteAggregateArgs> = {
        [P in keyof T & keyof AggregateInterventionNote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInterventionNote[P]>
      : GetScalarType<T[P], AggregateInterventionNote[P]>
  }




  export type InterventionNoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InterventionNoteWhereInput
    orderBy?: InterventionNoteOrderByWithAggregationInput | InterventionNoteOrderByWithAggregationInput[]
    by: InterventionNoteScalarFieldEnum[] | InterventionNoteScalarFieldEnum
    having?: InterventionNoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InterventionNoteCountAggregateInputType | true
    _min?: InterventionNoteMinAggregateInputType
    _max?: InterventionNoteMaxAggregateInputType
  }

  export type InterventionNoteGroupByOutputType = {
    id: string
    intervention_id: string
    teacher_id: string
    content: string
    created_at: Date
    _count: InterventionNoteCountAggregateOutputType | null
    _min: InterventionNoteMinAggregateOutputType | null
    _max: InterventionNoteMaxAggregateOutputType | null
  }

  type GetInterventionNoteGroupByPayload<T extends InterventionNoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InterventionNoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InterventionNoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InterventionNoteGroupByOutputType[P]>
            : GetScalarType<T[P], InterventionNoteGroupByOutputType[P]>
        }
      >
    >


  export type InterventionNoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    intervention_id?: boolean
    teacher_id?: boolean
    content?: boolean
    created_at?: boolean
    intervention?: boolean | InterventionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["interventionNote"]>

  export type InterventionNoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    intervention_id?: boolean
    teacher_id?: boolean
    content?: boolean
    created_at?: boolean
    intervention?: boolean | InterventionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["interventionNote"]>

  export type InterventionNoteSelectScalar = {
    id?: boolean
    intervention_id?: boolean
    teacher_id?: boolean
    content?: boolean
    created_at?: boolean
  }

  export type InterventionNoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    intervention?: boolean | InterventionDefaultArgs<ExtArgs>
  }
  export type InterventionNoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    intervention?: boolean | InterventionDefaultArgs<ExtArgs>
  }

  export type $InterventionNotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InterventionNote"
    objects: {
      intervention: Prisma.$InterventionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      intervention_id: string
      teacher_id: string
      content: string
      created_at: Date
    }, ExtArgs["result"]["interventionNote"]>
    composites: {}
  }

  type InterventionNoteGetPayload<S extends boolean | null | undefined | InterventionNoteDefaultArgs> = $Result.GetResult<Prisma.$InterventionNotePayload, S>

  type InterventionNoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InterventionNoteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InterventionNoteCountAggregateInputType | true
    }

  export interface InterventionNoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InterventionNote'], meta: { name: 'InterventionNote' } }
    /**
     * Find zero or one InterventionNote that matches the filter.
     * @param {InterventionNoteFindUniqueArgs} args - Arguments to find a InterventionNote
     * @example
     * // Get one InterventionNote
     * const interventionNote = await prisma.interventionNote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InterventionNoteFindUniqueArgs>(args: SelectSubset<T, InterventionNoteFindUniqueArgs<ExtArgs>>): Prisma__InterventionNoteClient<$Result.GetResult<Prisma.$InterventionNotePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InterventionNote that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InterventionNoteFindUniqueOrThrowArgs} args - Arguments to find a InterventionNote
     * @example
     * // Get one InterventionNote
     * const interventionNote = await prisma.interventionNote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InterventionNoteFindUniqueOrThrowArgs>(args: SelectSubset<T, InterventionNoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InterventionNoteClient<$Result.GetResult<Prisma.$InterventionNotePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InterventionNote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionNoteFindFirstArgs} args - Arguments to find a InterventionNote
     * @example
     * // Get one InterventionNote
     * const interventionNote = await prisma.interventionNote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InterventionNoteFindFirstArgs>(args?: SelectSubset<T, InterventionNoteFindFirstArgs<ExtArgs>>): Prisma__InterventionNoteClient<$Result.GetResult<Prisma.$InterventionNotePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InterventionNote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionNoteFindFirstOrThrowArgs} args - Arguments to find a InterventionNote
     * @example
     * // Get one InterventionNote
     * const interventionNote = await prisma.interventionNote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InterventionNoteFindFirstOrThrowArgs>(args?: SelectSubset<T, InterventionNoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__InterventionNoteClient<$Result.GetResult<Prisma.$InterventionNotePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InterventionNotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionNoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InterventionNotes
     * const interventionNotes = await prisma.interventionNote.findMany()
     * 
     * // Get first 10 InterventionNotes
     * const interventionNotes = await prisma.interventionNote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const interventionNoteWithIdOnly = await prisma.interventionNote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InterventionNoteFindManyArgs>(args?: SelectSubset<T, InterventionNoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterventionNotePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InterventionNote.
     * @param {InterventionNoteCreateArgs} args - Arguments to create a InterventionNote.
     * @example
     * // Create one InterventionNote
     * const InterventionNote = await prisma.interventionNote.create({
     *   data: {
     *     // ... data to create a InterventionNote
     *   }
     * })
     * 
     */
    create<T extends InterventionNoteCreateArgs>(args: SelectSubset<T, InterventionNoteCreateArgs<ExtArgs>>): Prisma__InterventionNoteClient<$Result.GetResult<Prisma.$InterventionNotePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InterventionNotes.
     * @param {InterventionNoteCreateManyArgs} args - Arguments to create many InterventionNotes.
     * @example
     * // Create many InterventionNotes
     * const interventionNote = await prisma.interventionNote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InterventionNoteCreateManyArgs>(args?: SelectSubset<T, InterventionNoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InterventionNotes and returns the data saved in the database.
     * @param {InterventionNoteCreateManyAndReturnArgs} args - Arguments to create many InterventionNotes.
     * @example
     * // Create many InterventionNotes
     * const interventionNote = await prisma.interventionNote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InterventionNotes and only return the `id`
     * const interventionNoteWithIdOnly = await prisma.interventionNote.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InterventionNoteCreateManyAndReturnArgs>(args?: SelectSubset<T, InterventionNoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterventionNotePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InterventionNote.
     * @param {InterventionNoteDeleteArgs} args - Arguments to delete one InterventionNote.
     * @example
     * // Delete one InterventionNote
     * const InterventionNote = await prisma.interventionNote.delete({
     *   where: {
     *     // ... filter to delete one InterventionNote
     *   }
     * })
     * 
     */
    delete<T extends InterventionNoteDeleteArgs>(args: SelectSubset<T, InterventionNoteDeleteArgs<ExtArgs>>): Prisma__InterventionNoteClient<$Result.GetResult<Prisma.$InterventionNotePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InterventionNote.
     * @param {InterventionNoteUpdateArgs} args - Arguments to update one InterventionNote.
     * @example
     * // Update one InterventionNote
     * const interventionNote = await prisma.interventionNote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InterventionNoteUpdateArgs>(args: SelectSubset<T, InterventionNoteUpdateArgs<ExtArgs>>): Prisma__InterventionNoteClient<$Result.GetResult<Prisma.$InterventionNotePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InterventionNotes.
     * @param {InterventionNoteDeleteManyArgs} args - Arguments to filter InterventionNotes to delete.
     * @example
     * // Delete a few InterventionNotes
     * const { count } = await prisma.interventionNote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InterventionNoteDeleteManyArgs>(args?: SelectSubset<T, InterventionNoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InterventionNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionNoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InterventionNotes
     * const interventionNote = await prisma.interventionNote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InterventionNoteUpdateManyArgs>(args: SelectSubset<T, InterventionNoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InterventionNote.
     * @param {InterventionNoteUpsertArgs} args - Arguments to update or create a InterventionNote.
     * @example
     * // Update or create a InterventionNote
     * const interventionNote = await prisma.interventionNote.upsert({
     *   create: {
     *     // ... data to create a InterventionNote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InterventionNote we want to update
     *   }
     * })
     */
    upsert<T extends InterventionNoteUpsertArgs>(args: SelectSubset<T, InterventionNoteUpsertArgs<ExtArgs>>): Prisma__InterventionNoteClient<$Result.GetResult<Prisma.$InterventionNotePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InterventionNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionNoteCountArgs} args - Arguments to filter InterventionNotes to count.
     * @example
     * // Count the number of InterventionNotes
     * const count = await prisma.interventionNote.count({
     *   where: {
     *     // ... the filter for the InterventionNotes we want to count
     *   }
     * })
    **/
    count<T extends InterventionNoteCountArgs>(
      args?: Subset<T, InterventionNoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InterventionNoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InterventionNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionNoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InterventionNoteAggregateArgs>(args: Subset<T, InterventionNoteAggregateArgs>): Prisma.PrismaPromise<GetInterventionNoteAggregateType<T>>

    /**
     * Group by InterventionNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterventionNoteGroupByArgs} args - Group by arguments.
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
      T extends InterventionNoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InterventionNoteGroupByArgs['orderBy'] }
        : { orderBy?: InterventionNoteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InterventionNoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInterventionNoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InterventionNote model
   */
  readonly fields: InterventionNoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InterventionNote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InterventionNoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    intervention<T extends InterventionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InterventionDefaultArgs<ExtArgs>>): Prisma__InterventionClient<$Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the InterventionNote model
   */ 
  interface InterventionNoteFieldRefs {
    readonly id: FieldRef<"InterventionNote", 'String'>
    readonly intervention_id: FieldRef<"InterventionNote", 'String'>
    readonly teacher_id: FieldRef<"InterventionNote", 'String'>
    readonly content: FieldRef<"InterventionNote", 'String'>
    readonly created_at: FieldRef<"InterventionNote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InterventionNote findUnique
   */
  export type InterventionNoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionNote
     */
    select?: InterventionNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionNoteInclude<ExtArgs> | null
    /**
     * Filter, which InterventionNote to fetch.
     */
    where: InterventionNoteWhereUniqueInput
  }

  /**
   * InterventionNote findUniqueOrThrow
   */
  export type InterventionNoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionNote
     */
    select?: InterventionNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionNoteInclude<ExtArgs> | null
    /**
     * Filter, which InterventionNote to fetch.
     */
    where: InterventionNoteWhereUniqueInput
  }

  /**
   * InterventionNote findFirst
   */
  export type InterventionNoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionNote
     */
    select?: InterventionNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionNoteInclude<ExtArgs> | null
    /**
     * Filter, which InterventionNote to fetch.
     */
    where?: InterventionNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InterventionNotes to fetch.
     */
    orderBy?: InterventionNoteOrderByWithRelationInput | InterventionNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InterventionNotes.
     */
    cursor?: InterventionNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InterventionNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InterventionNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InterventionNotes.
     */
    distinct?: InterventionNoteScalarFieldEnum | InterventionNoteScalarFieldEnum[]
  }

  /**
   * InterventionNote findFirstOrThrow
   */
  export type InterventionNoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionNote
     */
    select?: InterventionNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionNoteInclude<ExtArgs> | null
    /**
     * Filter, which InterventionNote to fetch.
     */
    where?: InterventionNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InterventionNotes to fetch.
     */
    orderBy?: InterventionNoteOrderByWithRelationInput | InterventionNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InterventionNotes.
     */
    cursor?: InterventionNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InterventionNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InterventionNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InterventionNotes.
     */
    distinct?: InterventionNoteScalarFieldEnum | InterventionNoteScalarFieldEnum[]
  }

  /**
   * InterventionNote findMany
   */
  export type InterventionNoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionNote
     */
    select?: InterventionNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionNoteInclude<ExtArgs> | null
    /**
     * Filter, which InterventionNotes to fetch.
     */
    where?: InterventionNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InterventionNotes to fetch.
     */
    orderBy?: InterventionNoteOrderByWithRelationInput | InterventionNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InterventionNotes.
     */
    cursor?: InterventionNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InterventionNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InterventionNotes.
     */
    skip?: number
    distinct?: InterventionNoteScalarFieldEnum | InterventionNoteScalarFieldEnum[]
  }

  /**
   * InterventionNote create
   */
  export type InterventionNoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionNote
     */
    select?: InterventionNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionNoteInclude<ExtArgs> | null
    /**
     * The data needed to create a InterventionNote.
     */
    data: XOR<InterventionNoteCreateInput, InterventionNoteUncheckedCreateInput>
  }

  /**
   * InterventionNote createMany
   */
  export type InterventionNoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InterventionNotes.
     */
    data: InterventionNoteCreateManyInput | InterventionNoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InterventionNote createManyAndReturn
   */
  export type InterventionNoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionNote
     */
    select?: InterventionNoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InterventionNotes.
     */
    data: InterventionNoteCreateManyInput | InterventionNoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionNoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InterventionNote update
   */
  export type InterventionNoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionNote
     */
    select?: InterventionNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionNoteInclude<ExtArgs> | null
    /**
     * The data needed to update a InterventionNote.
     */
    data: XOR<InterventionNoteUpdateInput, InterventionNoteUncheckedUpdateInput>
    /**
     * Choose, which InterventionNote to update.
     */
    where: InterventionNoteWhereUniqueInput
  }

  /**
   * InterventionNote updateMany
   */
  export type InterventionNoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InterventionNotes.
     */
    data: XOR<InterventionNoteUpdateManyMutationInput, InterventionNoteUncheckedUpdateManyInput>
    /**
     * Filter which InterventionNotes to update
     */
    where?: InterventionNoteWhereInput
  }

  /**
   * InterventionNote upsert
   */
  export type InterventionNoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionNote
     */
    select?: InterventionNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionNoteInclude<ExtArgs> | null
    /**
     * The filter to search for the InterventionNote to update in case it exists.
     */
    where: InterventionNoteWhereUniqueInput
    /**
     * In case the InterventionNote found by the `where` argument doesn't exist, create a new InterventionNote with this data.
     */
    create: XOR<InterventionNoteCreateInput, InterventionNoteUncheckedCreateInput>
    /**
     * In case the InterventionNote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InterventionNoteUpdateInput, InterventionNoteUncheckedUpdateInput>
  }

  /**
   * InterventionNote delete
   */
  export type InterventionNoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionNote
     */
    select?: InterventionNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionNoteInclude<ExtArgs> | null
    /**
     * Filter which InterventionNote to delete.
     */
    where: InterventionNoteWhereUniqueInput
  }

  /**
   * InterventionNote deleteMany
   */
  export type InterventionNoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InterventionNotes to delete
     */
    where?: InterventionNoteWhereInput
  }

  /**
   * InterventionNote without action
   */
  export type InterventionNoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterventionNote
     */
    select?: InterventionNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterventionNoteInclude<ExtArgs> | null
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


  export const EvidenceItemScalarFieldEnum: {
    id: 'id',
    diagnosis_id: 'diagnosis_id',
    item_id: 'item_id',
    extracted_answer: 'extracted_answer',
    correct: 'correct',
    confidence: 'confidence',
    quality: 'quality',
    created_at: 'created_at'
  };

  export type EvidenceItemScalarFieldEnum = (typeof EvidenceItemScalarFieldEnum)[keyof typeof EvidenceItemScalarFieldEnum]


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


  export const InterventionNoteScalarFieldEnum: {
    id: 'id',
    intervention_id: 'intervention_id',
    teacher_id: 'teacher_id',
    content: 'content',
    created_at: 'created_at'
  };

  export type InterventionNoteScalarFieldEnum = (typeof InterventionNoteScalarFieldEnum)[keyof typeof InterventionNoteScalarFieldEnum]


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
   * Reference to a field of type 'DiagnosisStatus'
   */
  export type EnumDiagnosisStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DiagnosisStatus'>
    


  /**
   * Reference to a field of type 'DiagnosisStatus[]'
   */
  export type ListEnumDiagnosisStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DiagnosisStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'EvidenceQuality'
   */
  export type EnumEvidenceQualityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EvidenceQuality'>
    


  /**
   * Reference to a field of type 'EvidenceQuality[]'
   */
  export type ListEnumEvidenceQualityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EvidenceQuality[]'>
    


  /**
   * Reference to a field of type 'InterventionStatus'
   */
  export type EnumInterventionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InterventionStatus'>
    


  /**
   * Reference to a field of type 'InterventionStatus[]'
   */
  export type ListEnumInterventionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InterventionStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type SkillWhereInput = {
    AND?: SkillWhereInput | SkillWhereInput[]
    OR?: SkillWhereInput[]
    NOT?: SkillWhereInput | SkillWhereInput[]
    id?: StringFilter<"Skill"> | string
    code?: StringFilter<"Skill"> | string
    name?: StringFilter<"Skill"> | string
    difficulty?: IntFilter<"Skill"> | number
    description?: StringNullableFilter<"Skill"> | string | null
    prereq_skills?: StringNullableListFilter<"Skill">
    created_at?: DateTimeFilter<"Skill"> | Date | string
    updated_at?: DateTimeFilter<"Skill"> | Date | string
    diagnoses?: DiagnosisListRelationFilter
    interventions?: InterventionListRelationFilter
  }

  export type SkillOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    difficulty?: SortOrder
    description?: SortOrderInput | SortOrder
    prereq_skills?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    diagnoses?: DiagnosisOrderByRelationAggregateInput
    interventions?: InterventionOrderByRelationAggregateInput
  }

  export type SkillWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: SkillWhereInput | SkillWhereInput[]
    OR?: SkillWhereInput[]
    NOT?: SkillWhereInput | SkillWhereInput[]
    name?: StringFilter<"Skill"> | string
    difficulty?: IntFilter<"Skill"> | number
    description?: StringNullableFilter<"Skill"> | string | null
    prereq_skills?: StringNullableListFilter<"Skill">
    created_at?: DateTimeFilter<"Skill"> | Date | string
    updated_at?: DateTimeFilter<"Skill"> | Date | string
    diagnoses?: DiagnosisListRelationFilter
    interventions?: InterventionListRelationFilter
  }, "id" | "code">

  export type SkillOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    difficulty?: SortOrder
    description?: SortOrderInput | SortOrder
    prereq_skills?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: SkillCountOrderByAggregateInput
    _avg?: SkillAvgOrderByAggregateInput
    _max?: SkillMaxOrderByAggregateInput
    _min?: SkillMinOrderByAggregateInput
    _sum?: SkillSumOrderByAggregateInput
  }

  export type SkillScalarWhereWithAggregatesInput = {
    AND?: SkillScalarWhereWithAggregatesInput | SkillScalarWhereWithAggregatesInput[]
    OR?: SkillScalarWhereWithAggregatesInput[]
    NOT?: SkillScalarWhereWithAggregatesInput | SkillScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Skill"> | string
    code?: StringWithAggregatesFilter<"Skill"> | string
    name?: StringWithAggregatesFilter<"Skill"> | string
    difficulty?: IntWithAggregatesFilter<"Skill"> | number
    description?: StringNullableWithAggregatesFilter<"Skill"> | string | null
    prereq_skills?: StringNullableListFilter<"Skill">
    created_at?: DateTimeWithAggregatesFilter<"Skill"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Skill"> | Date | string
  }

  export type DiagnosisWhereInput = {
    AND?: DiagnosisWhereInput | DiagnosisWhereInput[]
    OR?: DiagnosisWhereInput[]
    NOT?: DiagnosisWhereInput | DiagnosisWhereInput[]
    id?: StringFilter<"Diagnosis"> | string
    student_id?: StringFilter<"Diagnosis"> | string
    skill_id?: StringFilter<"Diagnosis"> | string
    p_known?: FloatFilter<"Diagnosis"> | number
    confidence?: FloatFilter<"Diagnosis"> | number
    status?: EnumDiagnosisStatusFilter<"Diagnosis"> | $Enums.DiagnosisStatus
    created_at?: DateTimeFilter<"Diagnosis"> | Date | string
    updated_at?: DateTimeFilter<"Diagnosis"> | Date | string
    skill?: XOR<SkillRelationFilter, SkillWhereInput>
    evidence?: EvidenceItemListRelationFilter
  }

  export type DiagnosisOrderByWithRelationInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    p_known?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    skill?: SkillOrderByWithRelationInput
    evidence?: EvidenceItemOrderByRelationAggregateInput
  }

  export type DiagnosisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    student_id_skill_id?: DiagnosisStudent_idSkill_idCompoundUniqueInput
    AND?: DiagnosisWhereInput | DiagnosisWhereInput[]
    OR?: DiagnosisWhereInput[]
    NOT?: DiagnosisWhereInput | DiagnosisWhereInput[]
    student_id?: StringFilter<"Diagnosis"> | string
    skill_id?: StringFilter<"Diagnosis"> | string
    p_known?: FloatFilter<"Diagnosis"> | number
    confidence?: FloatFilter<"Diagnosis"> | number
    status?: EnumDiagnosisStatusFilter<"Diagnosis"> | $Enums.DiagnosisStatus
    created_at?: DateTimeFilter<"Diagnosis"> | Date | string
    updated_at?: DateTimeFilter<"Diagnosis"> | Date | string
    skill?: XOR<SkillRelationFilter, SkillWhereInput>
    evidence?: EvidenceItemListRelationFilter
  }, "id" | "student_id_skill_id">

  export type DiagnosisOrderByWithAggregationInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    p_known?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: DiagnosisCountOrderByAggregateInput
    _avg?: DiagnosisAvgOrderByAggregateInput
    _max?: DiagnosisMaxOrderByAggregateInput
    _min?: DiagnosisMinOrderByAggregateInput
    _sum?: DiagnosisSumOrderByAggregateInput
  }

  export type DiagnosisScalarWhereWithAggregatesInput = {
    AND?: DiagnosisScalarWhereWithAggregatesInput | DiagnosisScalarWhereWithAggregatesInput[]
    OR?: DiagnosisScalarWhereWithAggregatesInput[]
    NOT?: DiagnosisScalarWhereWithAggregatesInput | DiagnosisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Diagnosis"> | string
    student_id?: StringWithAggregatesFilter<"Diagnosis"> | string
    skill_id?: StringWithAggregatesFilter<"Diagnosis"> | string
    p_known?: FloatWithAggregatesFilter<"Diagnosis"> | number
    confidence?: FloatWithAggregatesFilter<"Diagnosis"> | number
    status?: EnumDiagnosisStatusWithAggregatesFilter<"Diagnosis"> | $Enums.DiagnosisStatus
    created_at?: DateTimeWithAggregatesFilter<"Diagnosis"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Diagnosis"> | Date | string
  }

  export type EvidenceItemWhereInput = {
    AND?: EvidenceItemWhereInput | EvidenceItemWhereInput[]
    OR?: EvidenceItemWhereInput[]
    NOT?: EvidenceItemWhereInput | EvidenceItemWhereInput[]
    id?: StringFilter<"EvidenceItem"> | string
    diagnosis_id?: StringFilter<"EvidenceItem"> | string
    item_id?: StringFilter<"EvidenceItem"> | string
    extracted_answer?: StringNullableFilter<"EvidenceItem"> | string | null
    correct?: BoolFilter<"EvidenceItem"> | boolean
    confidence?: FloatFilter<"EvidenceItem"> | number
    quality?: EnumEvidenceQualityFilter<"EvidenceItem"> | $Enums.EvidenceQuality
    created_at?: DateTimeFilter<"EvidenceItem"> | Date | string
    diagnosis?: XOR<DiagnosisRelationFilter, DiagnosisWhereInput>
  }

  export type EvidenceItemOrderByWithRelationInput = {
    id?: SortOrder
    diagnosis_id?: SortOrder
    item_id?: SortOrder
    extracted_answer?: SortOrderInput | SortOrder
    correct?: SortOrder
    confidence?: SortOrder
    quality?: SortOrder
    created_at?: SortOrder
    diagnosis?: DiagnosisOrderByWithRelationInput
  }

  export type EvidenceItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EvidenceItemWhereInput | EvidenceItemWhereInput[]
    OR?: EvidenceItemWhereInput[]
    NOT?: EvidenceItemWhereInput | EvidenceItemWhereInput[]
    diagnosis_id?: StringFilter<"EvidenceItem"> | string
    item_id?: StringFilter<"EvidenceItem"> | string
    extracted_answer?: StringNullableFilter<"EvidenceItem"> | string | null
    correct?: BoolFilter<"EvidenceItem"> | boolean
    confidence?: FloatFilter<"EvidenceItem"> | number
    quality?: EnumEvidenceQualityFilter<"EvidenceItem"> | $Enums.EvidenceQuality
    created_at?: DateTimeFilter<"EvidenceItem"> | Date | string
    diagnosis?: XOR<DiagnosisRelationFilter, DiagnosisWhereInput>
  }, "id">

  export type EvidenceItemOrderByWithAggregationInput = {
    id?: SortOrder
    diagnosis_id?: SortOrder
    item_id?: SortOrder
    extracted_answer?: SortOrderInput | SortOrder
    correct?: SortOrder
    confidence?: SortOrder
    quality?: SortOrder
    created_at?: SortOrder
    _count?: EvidenceItemCountOrderByAggregateInput
    _avg?: EvidenceItemAvgOrderByAggregateInput
    _max?: EvidenceItemMaxOrderByAggregateInput
    _min?: EvidenceItemMinOrderByAggregateInput
    _sum?: EvidenceItemSumOrderByAggregateInput
  }

  export type EvidenceItemScalarWhereWithAggregatesInput = {
    AND?: EvidenceItemScalarWhereWithAggregatesInput | EvidenceItemScalarWhereWithAggregatesInput[]
    OR?: EvidenceItemScalarWhereWithAggregatesInput[]
    NOT?: EvidenceItemScalarWhereWithAggregatesInput | EvidenceItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EvidenceItem"> | string
    diagnosis_id?: StringWithAggregatesFilter<"EvidenceItem"> | string
    item_id?: StringWithAggregatesFilter<"EvidenceItem"> | string
    extracted_answer?: StringNullableWithAggregatesFilter<"EvidenceItem"> | string | null
    correct?: BoolWithAggregatesFilter<"EvidenceItem"> | boolean
    confidence?: FloatWithAggregatesFilter<"EvidenceItem"> | number
    quality?: EnumEvidenceQualityWithAggregatesFilter<"EvidenceItem"> | $Enums.EvidenceQuality
    created_at?: DateTimeWithAggregatesFilter<"EvidenceItem"> | Date | string
  }

  export type InterventionWhereInput = {
    AND?: InterventionWhereInput | InterventionWhereInput[]
    OR?: InterventionWhereInput[]
    NOT?: InterventionWhereInput | InterventionWhereInput[]
    id?: StringFilter<"Intervention"> | string
    student_id?: StringFilter<"Intervention"> | string
    skill_id?: StringFilter<"Intervention"> | string
    priority?: IntFilter<"Intervention"> | number
    status?: EnumInterventionStatusFilter<"Intervention"> | $Enums.InterventionStatus
    teacher_id?: StringNullableFilter<"Intervention"> | string | null
    notes?: StringNullableFilter<"Intervention"> | string | null
    created_at?: DateTimeFilter<"Intervention"> | Date | string
    resolved_at?: DateTimeNullableFilter<"Intervention"> | Date | string | null
    skill?: XOR<SkillRelationFilter, SkillWhereInput>
    notes_list?: InterventionNoteListRelationFilter
  }

  export type InterventionOrderByWithRelationInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    teacher_id?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    created_at?: SortOrder
    resolved_at?: SortOrderInput | SortOrder
    skill?: SkillOrderByWithRelationInput
    notes_list?: InterventionNoteOrderByRelationAggregateInput
  }

  export type InterventionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InterventionWhereInput | InterventionWhereInput[]
    OR?: InterventionWhereInput[]
    NOT?: InterventionWhereInput | InterventionWhereInput[]
    student_id?: StringFilter<"Intervention"> | string
    skill_id?: StringFilter<"Intervention"> | string
    priority?: IntFilter<"Intervention"> | number
    status?: EnumInterventionStatusFilter<"Intervention"> | $Enums.InterventionStatus
    teacher_id?: StringNullableFilter<"Intervention"> | string | null
    notes?: StringNullableFilter<"Intervention"> | string | null
    created_at?: DateTimeFilter<"Intervention"> | Date | string
    resolved_at?: DateTimeNullableFilter<"Intervention"> | Date | string | null
    skill?: XOR<SkillRelationFilter, SkillWhereInput>
    notes_list?: InterventionNoteListRelationFilter
  }, "id">

  export type InterventionOrderByWithAggregationInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    teacher_id?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    created_at?: SortOrder
    resolved_at?: SortOrderInput | SortOrder
    _count?: InterventionCountOrderByAggregateInput
    _avg?: InterventionAvgOrderByAggregateInput
    _max?: InterventionMaxOrderByAggregateInput
    _min?: InterventionMinOrderByAggregateInput
    _sum?: InterventionSumOrderByAggregateInput
  }

  export type InterventionScalarWhereWithAggregatesInput = {
    AND?: InterventionScalarWhereWithAggregatesInput | InterventionScalarWhereWithAggregatesInput[]
    OR?: InterventionScalarWhereWithAggregatesInput[]
    NOT?: InterventionScalarWhereWithAggregatesInput | InterventionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Intervention"> | string
    student_id?: StringWithAggregatesFilter<"Intervention"> | string
    skill_id?: StringWithAggregatesFilter<"Intervention"> | string
    priority?: IntWithAggregatesFilter<"Intervention"> | number
    status?: EnumInterventionStatusWithAggregatesFilter<"Intervention"> | $Enums.InterventionStatus
    teacher_id?: StringNullableWithAggregatesFilter<"Intervention"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Intervention"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Intervention"> | Date | string
    resolved_at?: DateTimeNullableWithAggregatesFilter<"Intervention"> | Date | string | null
  }

  export type InterventionNoteWhereInput = {
    AND?: InterventionNoteWhereInput | InterventionNoteWhereInput[]
    OR?: InterventionNoteWhereInput[]
    NOT?: InterventionNoteWhereInput | InterventionNoteWhereInput[]
    id?: StringFilter<"InterventionNote"> | string
    intervention_id?: StringFilter<"InterventionNote"> | string
    teacher_id?: StringFilter<"InterventionNote"> | string
    content?: StringFilter<"InterventionNote"> | string
    created_at?: DateTimeFilter<"InterventionNote"> | Date | string
    intervention?: XOR<InterventionRelationFilter, InterventionWhereInput>
  }

  export type InterventionNoteOrderByWithRelationInput = {
    id?: SortOrder
    intervention_id?: SortOrder
    teacher_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    intervention?: InterventionOrderByWithRelationInput
  }

  export type InterventionNoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InterventionNoteWhereInput | InterventionNoteWhereInput[]
    OR?: InterventionNoteWhereInput[]
    NOT?: InterventionNoteWhereInput | InterventionNoteWhereInput[]
    intervention_id?: StringFilter<"InterventionNote"> | string
    teacher_id?: StringFilter<"InterventionNote"> | string
    content?: StringFilter<"InterventionNote"> | string
    created_at?: DateTimeFilter<"InterventionNote"> | Date | string
    intervention?: XOR<InterventionRelationFilter, InterventionWhereInput>
  }, "id">

  export type InterventionNoteOrderByWithAggregationInput = {
    id?: SortOrder
    intervention_id?: SortOrder
    teacher_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    _count?: InterventionNoteCountOrderByAggregateInput
    _max?: InterventionNoteMaxOrderByAggregateInput
    _min?: InterventionNoteMinOrderByAggregateInput
  }

  export type InterventionNoteScalarWhereWithAggregatesInput = {
    AND?: InterventionNoteScalarWhereWithAggregatesInput | InterventionNoteScalarWhereWithAggregatesInput[]
    OR?: InterventionNoteScalarWhereWithAggregatesInput[]
    NOT?: InterventionNoteScalarWhereWithAggregatesInput | InterventionNoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InterventionNote"> | string
    intervention_id?: StringWithAggregatesFilter<"InterventionNote"> | string
    teacher_id?: StringWithAggregatesFilter<"InterventionNote"> | string
    content?: StringWithAggregatesFilter<"InterventionNote"> | string
    created_at?: DateTimeWithAggregatesFilter<"InterventionNote"> | Date | string
  }

  export type SkillCreateInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: SkillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    diagnoses?: DiagnosisCreateNestedManyWithoutSkillInput
    interventions?: InterventionCreateNestedManyWithoutSkillInput
  }

  export type SkillUncheckedCreateInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: SkillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    diagnoses?: DiagnosisUncheckedCreateNestedManyWithoutSkillInput
    interventions?: InterventionUncheckedCreateNestedManyWithoutSkillInput
  }

  export type SkillUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: SkillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: DiagnosisUpdateManyWithoutSkillNestedInput
    interventions?: InterventionUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: SkillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: DiagnosisUncheckedUpdateManyWithoutSkillNestedInput
    interventions?: InterventionUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type SkillCreateManyInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: SkillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type SkillUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: SkillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: SkillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosisCreateInput = {
    id?: string
    student_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.DiagnosisStatus
    created_at?: Date | string
    updated_at?: Date | string
    skill: SkillCreateNestedOneWithoutDiagnosesInput
    evidence?: EvidenceItemCreateNestedManyWithoutDiagnosisInput
  }

  export type DiagnosisUncheckedCreateInput = {
    id?: string
    student_id: string
    skill_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.DiagnosisStatus
    created_at?: Date | string
    updated_at?: Date | string
    evidence?: EvidenceItemUncheckedCreateNestedManyWithoutDiagnosisInput
  }

  export type DiagnosisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: EnumDiagnosisStatusFieldUpdateOperationsInput | $Enums.DiagnosisStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    skill?: SkillUpdateOneRequiredWithoutDiagnosesNestedInput
    evidence?: EvidenceItemUpdateManyWithoutDiagnosisNestedInput
  }

  export type DiagnosisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: EnumDiagnosisStatusFieldUpdateOperationsInput | $Enums.DiagnosisStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: EvidenceItemUncheckedUpdateManyWithoutDiagnosisNestedInput
  }

  export type DiagnosisCreateManyInput = {
    id?: string
    student_id: string
    skill_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.DiagnosisStatus
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DiagnosisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: EnumDiagnosisStatusFieldUpdateOperationsInput | $Enums.DiagnosisStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: EnumDiagnosisStatusFieldUpdateOperationsInput | $Enums.DiagnosisStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidenceItemCreateInput = {
    id?: string
    item_id: string
    extracted_answer?: string | null
    correct: boolean
    confidence?: number
    quality?: $Enums.EvidenceQuality
    created_at?: Date | string
    diagnosis: DiagnosisCreateNestedOneWithoutEvidenceInput
  }

  export type EvidenceItemUncheckedCreateInput = {
    id?: string
    diagnosis_id: string
    item_id: string
    extracted_answer?: string | null
    correct: boolean
    confidence?: number
    quality?: $Enums.EvidenceQuality
    created_at?: Date | string
  }

  export type EvidenceItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: BoolFieldUpdateOperationsInput | boolean
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: EnumEvidenceQualityFieldUpdateOperationsInput | $Enums.EvidenceQuality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnosis?: DiagnosisUpdateOneRequiredWithoutEvidenceNestedInput
  }

  export type EvidenceItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    diagnosis_id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: BoolFieldUpdateOperationsInput | boolean
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: EnumEvidenceQualityFieldUpdateOperationsInput | $Enums.EvidenceQuality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidenceItemCreateManyInput = {
    id?: string
    diagnosis_id: string
    item_id: string
    extracted_answer?: string | null
    correct: boolean
    confidence?: number
    quality?: $Enums.EvidenceQuality
    created_at?: Date | string
  }

  export type EvidenceItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: BoolFieldUpdateOperationsInput | boolean
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: EnumEvidenceQualityFieldUpdateOperationsInput | $Enums.EvidenceQuality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidenceItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    diagnosis_id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: BoolFieldUpdateOperationsInput | boolean
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: EnumEvidenceQualityFieldUpdateOperationsInput | $Enums.EvidenceQuality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterventionCreateInput = {
    id?: string
    student_id: string
    priority?: number
    status?: $Enums.InterventionStatus
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
    skill: SkillCreateNestedOneWithoutInterventionsInput
    notes_list?: InterventionNoteCreateNestedManyWithoutInterventionInput
  }

  export type InterventionUncheckedCreateInput = {
    id?: string
    student_id: string
    skill_id: string
    priority?: number
    status?: $Enums.InterventionStatus
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
    notes_list?: InterventionNoteUncheckedCreateNestedManyWithoutInterventionInput
  }

  export type InterventionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: EnumInterventionStatusFieldUpdateOperationsInput | $Enums.InterventionStatus
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    skill?: SkillUpdateOneRequiredWithoutInterventionsNestedInput
    notes_list?: InterventionNoteUpdateManyWithoutInterventionNestedInput
  }

  export type InterventionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: EnumInterventionStatusFieldUpdateOperationsInput | $Enums.InterventionStatus
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes_list?: InterventionNoteUncheckedUpdateManyWithoutInterventionNestedInput
  }

  export type InterventionCreateManyInput = {
    id?: string
    student_id: string
    skill_id: string
    priority?: number
    status?: $Enums.InterventionStatus
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
  }

  export type InterventionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: EnumInterventionStatusFieldUpdateOperationsInput | $Enums.InterventionStatus
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InterventionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: EnumInterventionStatusFieldUpdateOperationsInput | $Enums.InterventionStatus
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InterventionNoteCreateInput = {
    id?: string
    teacher_id: string
    content: string
    created_at?: Date | string
    intervention: InterventionCreateNestedOneWithoutNotes_listInput
  }

  export type InterventionNoteUncheckedCreateInput = {
    id?: string
    intervention_id: string
    teacher_id: string
    content: string
    created_at?: Date | string
  }

  export type InterventionNoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    intervention?: InterventionUpdateOneRequiredWithoutNotes_listNestedInput
  }

  export type InterventionNoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    intervention_id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterventionNoteCreateManyInput = {
    id?: string
    intervention_id: string
    teacher_id: string
    content: string
    created_at?: Date | string
  }

  export type InterventionNoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterventionNoteUncheckedUpdateManyInput = {
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
    every?: DiagnosisWhereInput
    some?: DiagnosisWhereInput
    none?: DiagnosisWhereInput
  }

  export type InterventionListRelationFilter = {
    every?: InterventionWhereInput
    some?: InterventionWhereInput
    none?: InterventionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DiagnosisOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InterventionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SkillCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    prereq_skills?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SkillAvgOrderByAggregateInput = {
    difficulty?: SortOrder
  }

  export type SkillMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SkillMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SkillSumOrderByAggregateInput = {
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

  export type EnumDiagnosisStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DiagnosisStatus | EnumDiagnosisStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DiagnosisStatus[] | ListEnumDiagnosisStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DiagnosisStatus[] | ListEnumDiagnosisStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDiagnosisStatusFilter<$PrismaModel> | $Enums.DiagnosisStatus
  }

  export type SkillRelationFilter = {
    is?: SkillWhereInput
    isNot?: SkillWhereInput
  }

  export type EvidenceItemListRelationFilter = {
    every?: EvidenceItemWhereInput
    some?: EvidenceItemWhereInput
    none?: EvidenceItemWhereInput
  }

  export type EvidenceItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DiagnosisStudent_idSkill_idCompoundUniqueInput = {
    student_id: string
    skill_id: string
  }

  export type DiagnosisCountOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    p_known?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DiagnosisAvgOrderByAggregateInput = {
    p_known?: SortOrder
    confidence?: SortOrder
  }

  export type DiagnosisMaxOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    p_known?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DiagnosisMinOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    skill_id?: SortOrder
    p_known?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DiagnosisSumOrderByAggregateInput = {
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

  export type EnumDiagnosisStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DiagnosisStatus | EnumDiagnosisStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DiagnosisStatus[] | ListEnumDiagnosisStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DiagnosisStatus[] | ListEnumDiagnosisStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDiagnosisStatusWithAggregatesFilter<$PrismaModel> | $Enums.DiagnosisStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDiagnosisStatusFilter<$PrismaModel>
    _max?: NestedEnumDiagnosisStatusFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumEvidenceQualityFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceQuality | EnumEvidenceQualityFieldRefInput<$PrismaModel>
    in?: $Enums.EvidenceQuality[] | ListEnumEvidenceQualityFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvidenceQuality[] | ListEnumEvidenceQualityFieldRefInput<$PrismaModel>
    not?: NestedEnumEvidenceQualityFilter<$PrismaModel> | $Enums.EvidenceQuality
  }

  export type DiagnosisRelationFilter = {
    is?: DiagnosisWhereInput
    isNot?: DiagnosisWhereInput
  }

  export type EvidenceItemCountOrderByAggregateInput = {
    id?: SortOrder
    diagnosis_id?: SortOrder
    item_id?: SortOrder
    extracted_answer?: SortOrder
    correct?: SortOrder
    confidence?: SortOrder
    quality?: SortOrder
    created_at?: SortOrder
  }

  export type EvidenceItemAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type EvidenceItemMaxOrderByAggregateInput = {
    id?: SortOrder
    diagnosis_id?: SortOrder
    item_id?: SortOrder
    extracted_answer?: SortOrder
    correct?: SortOrder
    confidence?: SortOrder
    quality?: SortOrder
    created_at?: SortOrder
  }

  export type EvidenceItemMinOrderByAggregateInput = {
    id?: SortOrder
    diagnosis_id?: SortOrder
    item_id?: SortOrder
    extracted_answer?: SortOrder
    correct?: SortOrder
    confidence?: SortOrder
    quality?: SortOrder
    created_at?: SortOrder
  }

  export type EvidenceItemSumOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumEvidenceQualityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceQuality | EnumEvidenceQualityFieldRefInput<$PrismaModel>
    in?: $Enums.EvidenceQuality[] | ListEnumEvidenceQualityFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvidenceQuality[] | ListEnumEvidenceQualityFieldRefInput<$PrismaModel>
    not?: NestedEnumEvidenceQualityWithAggregatesFilter<$PrismaModel> | $Enums.EvidenceQuality
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEvidenceQualityFilter<$PrismaModel>
    _max?: NestedEnumEvidenceQualityFilter<$PrismaModel>
  }

  export type EnumInterventionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InterventionStatus | EnumInterventionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InterventionStatus[] | ListEnumInterventionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InterventionStatus[] | ListEnumInterventionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInterventionStatusFilter<$PrismaModel> | $Enums.InterventionStatus
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

  export type InterventionNoteListRelationFilter = {
    every?: InterventionNoteWhereInput
    some?: InterventionNoteWhereInput
    none?: InterventionNoteWhereInput
  }

  export type InterventionNoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InterventionCountOrderByAggregateInput = {
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

  export type InterventionAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type InterventionMaxOrderByAggregateInput = {
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

  export type InterventionMinOrderByAggregateInput = {
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

  export type InterventionSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type EnumInterventionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InterventionStatus | EnumInterventionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InterventionStatus[] | ListEnumInterventionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InterventionStatus[] | ListEnumInterventionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInterventionStatusWithAggregatesFilter<$PrismaModel> | $Enums.InterventionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInterventionStatusFilter<$PrismaModel>
    _max?: NestedEnumInterventionStatusFilter<$PrismaModel>
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
    is?: InterventionWhereInput
    isNot?: InterventionWhereInput
  }

  export type InterventionNoteCountOrderByAggregateInput = {
    id?: SortOrder
    intervention_id?: SortOrder
    teacher_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
  }

  export type InterventionNoteMaxOrderByAggregateInput = {
    id?: SortOrder
    intervention_id?: SortOrder
    teacher_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
  }

  export type InterventionNoteMinOrderByAggregateInput = {
    id?: SortOrder
    intervention_id?: SortOrder
    teacher_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
  }

  export type SkillCreateprereq_skillsInput = {
    set: string[]
  }

  export type DiagnosisCreateNestedManyWithoutSkillInput = {
    create?: XOR<DiagnosisCreateWithoutSkillInput, DiagnosisUncheckedCreateWithoutSkillInput> | DiagnosisCreateWithoutSkillInput[] | DiagnosisUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: DiagnosisCreateOrConnectWithoutSkillInput | DiagnosisCreateOrConnectWithoutSkillInput[]
    createMany?: DiagnosisCreateManySkillInputEnvelope
    connect?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
  }

  export type InterventionCreateNestedManyWithoutSkillInput = {
    create?: XOR<InterventionCreateWithoutSkillInput, InterventionUncheckedCreateWithoutSkillInput> | InterventionCreateWithoutSkillInput[] | InterventionUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: InterventionCreateOrConnectWithoutSkillInput | InterventionCreateOrConnectWithoutSkillInput[]
    createMany?: InterventionCreateManySkillInputEnvelope
    connect?: InterventionWhereUniqueInput | InterventionWhereUniqueInput[]
  }

  export type DiagnosisUncheckedCreateNestedManyWithoutSkillInput = {
    create?: XOR<DiagnosisCreateWithoutSkillInput, DiagnosisUncheckedCreateWithoutSkillInput> | DiagnosisCreateWithoutSkillInput[] | DiagnosisUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: DiagnosisCreateOrConnectWithoutSkillInput | DiagnosisCreateOrConnectWithoutSkillInput[]
    createMany?: DiagnosisCreateManySkillInputEnvelope
    connect?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
  }

  export type InterventionUncheckedCreateNestedManyWithoutSkillInput = {
    create?: XOR<InterventionCreateWithoutSkillInput, InterventionUncheckedCreateWithoutSkillInput> | InterventionCreateWithoutSkillInput[] | InterventionUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: InterventionCreateOrConnectWithoutSkillInput | InterventionCreateOrConnectWithoutSkillInput[]
    createMany?: InterventionCreateManySkillInputEnvelope
    connect?: InterventionWhereUniqueInput | InterventionWhereUniqueInput[]
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

  export type SkillUpdateprereq_skillsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DiagnosisUpdateManyWithoutSkillNestedInput = {
    create?: XOR<DiagnosisCreateWithoutSkillInput, DiagnosisUncheckedCreateWithoutSkillInput> | DiagnosisCreateWithoutSkillInput[] | DiagnosisUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: DiagnosisCreateOrConnectWithoutSkillInput | DiagnosisCreateOrConnectWithoutSkillInput[]
    upsert?: DiagnosisUpsertWithWhereUniqueWithoutSkillInput | DiagnosisUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: DiagnosisCreateManySkillInputEnvelope
    set?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    disconnect?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    delete?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    connect?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    update?: DiagnosisUpdateWithWhereUniqueWithoutSkillInput | DiagnosisUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: DiagnosisUpdateManyWithWhereWithoutSkillInput | DiagnosisUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: DiagnosisScalarWhereInput | DiagnosisScalarWhereInput[]
  }

  export type InterventionUpdateManyWithoutSkillNestedInput = {
    create?: XOR<InterventionCreateWithoutSkillInput, InterventionUncheckedCreateWithoutSkillInput> | InterventionCreateWithoutSkillInput[] | InterventionUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: InterventionCreateOrConnectWithoutSkillInput | InterventionCreateOrConnectWithoutSkillInput[]
    upsert?: InterventionUpsertWithWhereUniqueWithoutSkillInput | InterventionUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: InterventionCreateManySkillInputEnvelope
    set?: InterventionWhereUniqueInput | InterventionWhereUniqueInput[]
    disconnect?: InterventionWhereUniqueInput | InterventionWhereUniqueInput[]
    delete?: InterventionWhereUniqueInput | InterventionWhereUniqueInput[]
    connect?: InterventionWhereUniqueInput | InterventionWhereUniqueInput[]
    update?: InterventionUpdateWithWhereUniqueWithoutSkillInput | InterventionUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: InterventionUpdateManyWithWhereWithoutSkillInput | InterventionUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: InterventionScalarWhereInput | InterventionScalarWhereInput[]
  }

  export type DiagnosisUncheckedUpdateManyWithoutSkillNestedInput = {
    create?: XOR<DiagnosisCreateWithoutSkillInput, DiagnosisUncheckedCreateWithoutSkillInput> | DiagnosisCreateWithoutSkillInput[] | DiagnosisUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: DiagnosisCreateOrConnectWithoutSkillInput | DiagnosisCreateOrConnectWithoutSkillInput[]
    upsert?: DiagnosisUpsertWithWhereUniqueWithoutSkillInput | DiagnosisUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: DiagnosisCreateManySkillInputEnvelope
    set?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    disconnect?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    delete?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    connect?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    update?: DiagnosisUpdateWithWhereUniqueWithoutSkillInput | DiagnosisUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: DiagnosisUpdateManyWithWhereWithoutSkillInput | DiagnosisUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: DiagnosisScalarWhereInput | DiagnosisScalarWhereInput[]
  }

  export type InterventionUncheckedUpdateManyWithoutSkillNestedInput = {
    create?: XOR<InterventionCreateWithoutSkillInput, InterventionUncheckedCreateWithoutSkillInput> | InterventionCreateWithoutSkillInput[] | InterventionUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: InterventionCreateOrConnectWithoutSkillInput | InterventionCreateOrConnectWithoutSkillInput[]
    upsert?: InterventionUpsertWithWhereUniqueWithoutSkillInput | InterventionUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: InterventionCreateManySkillInputEnvelope
    set?: InterventionWhereUniqueInput | InterventionWhereUniqueInput[]
    disconnect?: InterventionWhereUniqueInput | InterventionWhereUniqueInput[]
    delete?: InterventionWhereUniqueInput | InterventionWhereUniqueInput[]
    connect?: InterventionWhereUniqueInput | InterventionWhereUniqueInput[]
    update?: InterventionUpdateWithWhereUniqueWithoutSkillInput | InterventionUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: InterventionUpdateManyWithWhereWithoutSkillInput | InterventionUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: InterventionScalarWhereInput | InterventionScalarWhereInput[]
  }

  export type SkillCreateNestedOneWithoutDiagnosesInput = {
    create?: XOR<SkillCreateWithoutDiagnosesInput, SkillUncheckedCreateWithoutDiagnosesInput>
    connectOrCreate?: SkillCreateOrConnectWithoutDiagnosesInput
    connect?: SkillWhereUniqueInput
  }

  export type EvidenceItemCreateNestedManyWithoutDiagnosisInput = {
    create?: XOR<EvidenceItemCreateWithoutDiagnosisInput, EvidenceItemUncheckedCreateWithoutDiagnosisInput> | EvidenceItemCreateWithoutDiagnosisInput[] | EvidenceItemUncheckedCreateWithoutDiagnosisInput[]
    connectOrCreate?: EvidenceItemCreateOrConnectWithoutDiagnosisInput | EvidenceItemCreateOrConnectWithoutDiagnosisInput[]
    createMany?: EvidenceItemCreateManyDiagnosisInputEnvelope
    connect?: EvidenceItemWhereUniqueInput | EvidenceItemWhereUniqueInput[]
  }

  export type EvidenceItemUncheckedCreateNestedManyWithoutDiagnosisInput = {
    create?: XOR<EvidenceItemCreateWithoutDiagnosisInput, EvidenceItemUncheckedCreateWithoutDiagnosisInput> | EvidenceItemCreateWithoutDiagnosisInput[] | EvidenceItemUncheckedCreateWithoutDiagnosisInput[]
    connectOrCreate?: EvidenceItemCreateOrConnectWithoutDiagnosisInput | EvidenceItemCreateOrConnectWithoutDiagnosisInput[]
    createMany?: EvidenceItemCreateManyDiagnosisInputEnvelope
    connect?: EvidenceItemWhereUniqueInput | EvidenceItemWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumDiagnosisStatusFieldUpdateOperationsInput = {
    set?: $Enums.DiagnosisStatus
  }

  export type SkillUpdateOneRequiredWithoutDiagnosesNestedInput = {
    create?: XOR<SkillCreateWithoutDiagnosesInput, SkillUncheckedCreateWithoutDiagnosesInput>
    connectOrCreate?: SkillCreateOrConnectWithoutDiagnosesInput
    upsert?: SkillUpsertWithoutDiagnosesInput
    connect?: SkillWhereUniqueInput
    update?: XOR<XOR<SkillUpdateToOneWithWhereWithoutDiagnosesInput, SkillUpdateWithoutDiagnosesInput>, SkillUncheckedUpdateWithoutDiagnosesInput>
  }

  export type EvidenceItemUpdateManyWithoutDiagnosisNestedInput = {
    create?: XOR<EvidenceItemCreateWithoutDiagnosisInput, EvidenceItemUncheckedCreateWithoutDiagnosisInput> | EvidenceItemCreateWithoutDiagnosisInput[] | EvidenceItemUncheckedCreateWithoutDiagnosisInput[]
    connectOrCreate?: EvidenceItemCreateOrConnectWithoutDiagnosisInput | EvidenceItemCreateOrConnectWithoutDiagnosisInput[]
    upsert?: EvidenceItemUpsertWithWhereUniqueWithoutDiagnosisInput | EvidenceItemUpsertWithWhereUniqueWithoutDiagnosisInput[]
    createMany?: EvidenceItemCreateManyDiagnosisInputEnvelope
    set?: EvidenceItemWhereUniqueInput | EvidenceItemWhereUniqueInput[]
    disconnect?: EvidenceItemWhereUniqueInput | EvidenceItemWhereUniqueInput[]
    delete?: EvidenceItemWhereUniqueInput | EvidenceItemWhereUniqueInput[]
    connect?: EvidenceItemWhereUniqueInput | EvidenceItemWhereUniqueInput[]
    update?: EvidenceItemUpdateWithWhereUniqueWithoutDiagnosisInput | EvidenceItemUpdateWithWhereUniqueWithoutDiagnosisInput[]
    updateMany?: EvidenceItemUpdateManyWithWhereWithoutDiagnosisInput | EvidenceItemUpdateManyWithWhereWithoutDiagnosisInput[]
    deleteMany?: EvidenceItemScalarWhereInput | EvidenceItemScalarWhereInput[]
  }

  export type EvidenceItemUncheckedUpdateManyWithoutDiagnosisNestedInput = {
    create?: XOR<EvidenceItemCreateWithoutDiagnosisInput, EvidenceItemUncheckedCreateWithoutDiagnosisInput> | EvidenceItemCreateWithoutDiagnosisInput[] | EvidenceItemUncheckedCreateWithoutDiagnosisInput[]
    connectOrCreate?: EvidenceItemCreateOrConnectWithoutDiagnosisInput | EvidenceItemCreateOrConnectWithoutDiagnosisInput[]
    upsert?: EvidenceItemUpsertWithWhereUniqueWithoutDiagnosisInput | EvidenceItemUpsertWithWhereUniqueWithoutDiagnosisInput[]
    createMany?: EvidenceItemCreateManyDiagnosisInputEnvelope
    set?: EvidenceItemWhereUniqueInput | EvidenceItemWhereUniqueInput[]
    disconnect?: EvidenceItemWhereUniqueInput | EvidenceItemWhereUniqueInput[]
    delete?: EvidenceItemWhereUniqueInput | EvidenceItemWhereUniqueInput[]
    connect?: EvidenceItemWhereUniqueInput | EvidenceItemWhereUniqueInput[]
    update?: EvidenceItemUpdateWithWhereUniqueWithoutDiagnosisInput | EvidenceItemUpdateWithWhereUniqueWithoutDiagnosisInput[]
    updateMany?: EvidenceItemUpdateManyWithWhereWithoutDiagnosisInput | EvidenceItemUpdateManyWithWhereWithoutDiagnosisInput[]
    deleteMany?: EvidenceItemScalarWhereInput | EvidenceItemScalarWhereInput[]
  }

  export type DiagnosisCreateNestedOneWithoutEvidenceInput = {
    create?: XOR<DiagnosisCreateWithoutEvidenceInput, DiagnosisUncheckedCreateWithoutEvidenceInput>
    connectOrCreate?: DiagnosisCreateOrConnectWithoutEvidenceInput
    connect?: DiagnosisWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumEvidenceQualityFieldUpdateOperationsInput = {
    set?: $Enums.EvidenceQuality
  }

  export type DiagnosisUpdateOneRequiredWithoutEvidenceNestedInput = {
    create?: XOR<DiagnosisCreateWithoutEvidenceInput, DiagnosisUncheckedCreateWithoutEvidenceInput>
    connectOrCreate?: DiagnosisCreateOrConnectWithoutEvidenceInput
    upsert?: DiagnosisUpsertWithoutEvidenceInput
    connect?: DiagnosisWhereUniqueInput
    update?: XOR<XOR<DiagnosisUpdateToOneWithWhereWithoutEvidenceInput, DiagnosisUpdateWithoutEvidenceInput>, DiagnosisUncheckedUpdateWithoutEvidenceInput>
  }

  export type SkillCreateNestedOneWithoutInterventionsInput = {
    create?: XOR<SkillCreateWithoutInterventionsInput, SkillUncheckedCreateWithoutInterventionsInput>
    connectOrCreate?: SkillCreateOrConnectWithoutInterventionsInput
    connect?: SkillWhereUniqueInput
  }

  export type InterventionNoteCreateNestedManyWithoutInterventionInput = {
    create?: XOR<InterventionNoteCreateWithoutInterventionInput, InterventionNoteUncheckedCreateWithoutInterventionInput> | InterventionNoteCreateWithoutInterventionInput[] | InterventionNoteUncheckedCreateWithoutInterventionInput[]
    connectOrCreate?: InterventionNoteCreateOrConnectWithoutInterventionInput | InterventionNoteCreateOrConnectWithoutInterventionInput[]
    createMany?: InterventionNoteCreateManyInterventionInputEnvelope
    connect?: InterventionNoteWhereUniqueInput | InterventionNoteWhereUniqueInput[]
  }

  export type InterventionNoteUncheckedCreateNestedManyWithoutInterventionInput = {
    create?: XOR<InterventionNoteCreateWithoutInterventionInput, InterventionNoteUncheckedCreateWithoutInterventionInput> | InterventionNoteCreateWithoutInterventionInput[] | InterventionNoteUncheckedCreateWithoutInterventionInput[]
    connectOrCreate?: InterventionNoteCreateOrConnectWithoutInterventionInput | InterventionNoteCreateOrConnectWithoutInterventionInput[]
    createMany?: InterventionNoteCreateManyInterventionInputEnvelope
    connect?: InterventionNoteWhereUniqueInput | InterventionNoteWhereUniqueInput[]
  }

  export type EnumInterventionStatusFieldUpdateOperationsInput = {
    set?: $Enums.InterventionStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type SkillUpdateOneRequiredWithoutInterventionsNestedInput = {
    create?: XOR<SkillCreateWithoutInterventionsInput, SkillUncheckedCreateWithoutInterventionsInput>
    connectOrCreate?: SkillCreateOrConnectWithoutInterventionsInput
    upsert?: SkillUpsertWithoutInterventionsInput
    connect?: SkillWhereUniqueInput
    update?: XOR<XOR<SkillUpdateToOneWithWhereWithoutInterventionsInput, SkillUpdateWithoutInterventionsInput>, SkillUncheckedUpdateWithoutInterventionsInput>
  }

  export type InterventionNoteUpdateManyWithoutInterventionNestedInput = {
    create?: XOR<InterventionNoteCreateWithoutInterventionInput, InterventionNoteUncheckedCreateWithoutInterventionInput> | InterventionNoteCreateWithoutInterventionInput[] | InterventionNoteUncheckedCreateWithoutInterventionInput[]
    connectOrCreate?: InterventionNoteCreateOrConnectWithoutInterventionInput | InterventionNoteCreateOrConnectWithoutInterventionInput[]
    upsert?: InterventionNoteUpsertWithWhereUniqueWithoutInterventionInput | InterventionNoteUpsertWithWhereUniqueWithoutInterventionInput[]
    createMany?: InterventionNoteCreateManyInterventionInputEnvelope
    set?: InterventionNoteWhereUniqueInput | InterventionNoteWhereUniqueInput[]
    disconnect?: InterventionNoteWhereUniqueInput | InterventionNoteWhereUniqueInput[]
    delete?: InterventionNoteWhereUniqueInput | InterventionNoteWhereUniqueInput[]
    connect?: InterventionNoteWhereUniqueInput | InterventionNoteWhereUniqueInput[]
    update?: InterventionNoteUpdateWithWhereUniqueWithoutInterventionInput | InterventionNoteUpdateWithWhereUniqueWithoutInterventionInput[]
    updateMany?: InterventionNoteUpdateManyWithWhereWithoutInterventionInput | InterventionNoteUpdateManyWithWhereWithoutInterventionInput[]
    deleteMany?: InterventionNoteScalarWhereInput | InterventionNoteScalarWhereInput[]
  }

  export type InterventionNoteUncheckedUpdateManyWithoutInterventionNestedInput = {
    create?: XOR<InterventionNoteCreateWithoutInterventionInput, InterventionNoteUncheckedCreateWithoutInterventionInput> | InterventionNoteCreateWithoutInterventionInput[] | InterventionNoteUncheckedCreateWithoutInterventionInput[]
    connectOrCreate?: InterventionNoteCreateOrConnectWithoutInterventionInput | InterventionNoteCreateOrConnectWithoutInterventionInput[]
    upsert?: InterventionNoteUpsertWithWhereUniqueWithoutInterventionInput | InterventionNoteUpsertWithWhereUniqueWithoutInterventionInput[]
    createMany?: InterventionNoteCreateManyInterventionInputEnvelope
    set?: InterventionNoteWhereUniqueInput | InterventionNoteWhereUniqueInput[]
    disconnect?: InterventionNoteWhereUniqueInput | InterventionNoteWhereUniqueInput[]
    delete?: InterventionNoteWhereUniqueInput | InterventionNoteWhereUniqueInput[]
    connect?: InterventionNoteWhereUniqueInput | InterventionNoteWhereUniqueInput[]
    update?: InterventionNoteUpdateWithWhereUniqueWithoutInterventionInput | InterventionNoteUpdateWithWhereUniqueWithoutInterventionInput[]
    updateMany?: InterventionNoteUpdateManyWithWhereWithoutInterventionInput | InterventionNoteUpdateManyWithWhereWithoutInterventionInput[]
    deleteMany?: InterventionNoteScalarWhereInput | InterventionNoteScalarWhereInput[]
  }

  export type InterventionCreateNestedOneWithoutNotes_listInput = {
    create?: XOR<InterventionCreateWithoutNotes_listInput, InterventionUncheckedCreateWithoutNotes_listInput>
    connectOrCreate?: InterventionCreateOrConnectWithoutNotes_listInput
    connect?: InterventionWhereUniqueInput
  }

  export type InterventionUpdateOneRequiredWithoutNotes_listNestedInput = {
    create?: XOR<InterventionCreateWithoutNotes_listInput, InterventionUncheckedCreateWithoutNotes_listInput>
    connectOrCreate?: InterventionCreateOrConnectWithoutNotes_listInput
    upsert?: InterventionUpsertWithoutNotes_listInput
    connect?: InterventionWhereUniqueInput
    update?: XOR<XOR<InterventionUpdateToOneWithWhereWithoutNotes_listInput, InterventionUpdateWithoutNotes_listInput>, InterventionUncheckedUpdateWithoutNotes_listInput>
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

  export type NestedEnumDiagnosisStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DiagnosisStatus | EnumDiagnosisStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DiagnosisStatus[] | ListEnumDiagnosisStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DiagnosisStatus[] | ListEnumDiagnosisStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDiagnosisStatusFilter<$PrismaModel> | $Enums.DiagnosisStatus
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

  export type NestedEnumDiagnosisStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DiagnosisStatus | EnumDiagnosisStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DiagnosisStatus[] | ListEnumDiagnosisStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DiagnosisStatus[] | ListEnumDiagnosisStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDiagnosisStatusWithAggregatesFilter<$PrismaModel> | $Enums.DiagnosisStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDiagnosisStatusFilter<$PrismaModel>
    _max?: NestedEnumDiagnosisStatusFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumEvidenceQualityFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceQuality | EnumEvidenceQualityFieldRefInput<$PrismaModel>
    in?: $Enums.EvidenceQuality[] | ListEnumEvidenceQualityFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvidenceQuality[] | ListEnumEvidenceQualityFieldRefInput<$PrismaModel>
    not?: NestedEnumEvidenceQualityFilter<$PrismaModel> | $Enums.EvidenceQuality
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumEvidenceQualityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceQuality | EnumEvidenceQualityFieldRefInput<$PrismaModel>
    in?: $Enums.EvidenceQuality[] | ListEnumEvidenceQualityFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvidenceQuality[] | ListEnumEvidenceQualityFieldRefInput<$PrismaModel>
    not?: NestedEnumEvidenceQualityWithAggregatesFilter<$PrismaModel> | $Enums.EvidenceQuality
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEvidenceQualityFilter<$PrismaModel>
    _max?: NestedEnumEvidenceQualityFilter<$PrismaModel>
  }

  export type NestedEnumInterventionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InterventionStatus | EnumInterventionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InterventionStatus[] | ListEnumInterventionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InterventionStatus[] | ListEnumInterventionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInterventionStatusFilter<$PrismaModel> | $Enums.InterventionStatus
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

  export type NestedEnumInterventionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InterventionStatus | EnumInterventionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InterventionStatus[] | ListEnumInterventionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InterventionStatus[] | ListEnumInterventionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInterventionStatusWithAggregatesFilter<$PrismaModel> | $Enums.InterventionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInterventionStatusFilter<$PrismaModel>
    _max?: NestedEnumInterventionStatusFilter<$PrismaModel>
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

  export type DiagnosisCreateWithoutSkillInput = {
    id?: string
    student_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.DiagnosisStatus
    created_at?: Date | string
    updated_at?: Date | string
    evidence?: EvidenceItemCreateNestedManyWithoutDiagnosisInput
  }

  export type DiagnosisUncheckedCreateWithoutSkillInput = {
    id?: string
    student_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.DiagnosisStatus
    created_at?: Date | string
    updated_at?: Date | string
    evidence?: EvidenceItemUncheckedCreateNestedManyWithoutDiagnosisInput
  }

  export type DiagnosisCreateOrConnectWithoutSkillInput = {
    where: DiagnosisWhereUniqueInput
    create: XOR<DiagnosisCreateWithoutSkillInput, DiagnosisUncheckedCreateWithoutSkillInput>
  }

  export type DiagnosisCreateManySkillInputEnvelope = {
    data: DiagnosisCreateManySkillInput | DiagnosisCreateManySkillInput[]
    skipDuplicates?: boolean
  }

  export type InterventionCreateWithoutSkillInput = {
    id?: string
    student_id: string
    priority?: number
    status?: $Enums.InterventionStatus
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
    notes_list?: InterventionNoteCreateNestedManyWithoutInterventionInput
  }

  export type InterventionUncheckedCreateWithoutSkillInput = {
    id?: string
    student_id: string
    priority?: number
    status?: $Enums.InterventionStatus
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
    notes_list?: InterventionNoteUncheckedCreateNestedManyWithoutInterventionInput
  }

  export type InterventionCreateOrConnectWithoutSkillInput = {
    where: InterventionWhereUniqueInput
    create: XOR<InterventionCreateWithoutSkillInput, InterventionUncheckedCreateWithoutSkillInput>
  }

  export type InterventionCreateManySkillInputEnvelope = {
    data: InterventionCreateManySkillInput | InterventionCreateManySkillInput[]
    skipDuplicates?: boolean
  }

  export type DiagnosisUpsertWithWhereUniqueWithoutSkillInput = {
    where: DiagnosisWhereUniqueInput
    update: XOR<DiagnosisUpdateWithoutSkillInput, DiagnosisUncheckedUpdateWithoutSkillInput>
    create: XOR<DiagnosisCreateWithoutSkillInput, DiagnosisUncheckedCreateWithoutSkillInput>
  }

  export type DiagnosisUpdateWithWhereUniqueWithoutSkillInput = {
    where: DiagnosisWhereUniqueInput
    data: XOR<DiagnosisUpdateWithoutSkillInput, DiagnosisUncheckedUpdateWithoutSkillInput>
  }

  export type DiagnosisUpdateManyWithWhereWithoutSkillInput = {
    where: DiagnosisScalarWhereInput
    data: XOR<DiagnosisUpdateManyMutationInput, DiagnosisUncheckedUpdateManyWithoutSkillInput>
  }

  export type DiagnosisScalarWhereInput = {
    AND?: DiagnosisScalarWhereInput | DiagnosisScalarWhereInput[]
    OR?: DiagnosisScalarWhereInput[]
    NOT?: DiagnosisScalarWhereInput | DiagnosisScalarWhereInput[]
    id?: StringFilter<"Diagnosis"> | string
    student_id?: StringFilter<"Diagnosis"> | string
    skill_id?: StringFilter<"Diagnosis"> | string
    p_known?: FloatFilter<"Diagnosis"> | number
    confidence?: FloatFilter<"Diagnosis"> | number
    status?: EnumDiagnosisStatusFilter<"Diagnosis"> | $Enums.DiagnosisStatus
    created_at?: DateTimeFilter<"Diagnosis"> | Date | string
    updated_at?: DateTimeFilter<"Diagnosis"> | Date | string
  }

  export type InterventionUpsertWithWhereUniqueWithoutSkillInput = {
    where: InterventionWhereUniqueInput
    update: XOR<InterventionUpdateWithoutSkillInput, InterventionUncheckedUpdateWithoutSkillInput>
    create: XOR<InterventionCreateWithoutSkillInput, InterventionUncheckedCreateWithoutSkillInput>
  }

  export type InterventionUpdateWithWhereUniqueWithoutSkillInput = {
    where: InterventionWhereUniqueInput
    data: XOR<InterventionUpdateWithoutSkillInput, InterventionUncheckedUpdateWithoutSkillInput>
  }

  export type InterventionUpdateManyWithWhereWithoutSkillInput = {
    where: InterventionScalarWhereInput
    data: XOR<InterventionUpdateManyMutationInput, InterventionUncheckedUpdateManyWithoutSkillInput>
  }

  export type InterventionScalarWhereInput = {
    AND?: InterventionScalarWhereInput | InterventionScalarWhereInput[]
    OR?: InterventionScalarWhereInput[]
    NOT?: InterventionScalarWhereInput | InterventionScalarWhereInput[]
    id?: StringFilter<"Intervention"> | string
    student_id?: StringFilter<"Intervention"> | string
    skill_id?: StringFilter<"Intervention"> | string
    priority?: IntFilter<"Intervention"> | number
    status?: EnumInterventionStatusFilter<"Intervention"> | $Enums.InterventionStatus
    teacher_id?: StringNullableFilter<"Intervention"> | string | null
    notes?: StringNullableFilter<"Intervention"> | string | null
    created_at?: DateTimeFilter<"Intervention"> | Date | string
    resolved_at?: DateTimeNullableFilter<"Intervention"> | Date | string | null
  }

  export type SkillCreateWithoutDiagnosesInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: SkillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    interventions?: InterventionCreateNestedManyWithoutSkillInput
  }

  export type SkillUncheckedCreateWithoutDiagnosesInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: SkillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    interventions?: InterventionUncheckedCreateNestedManyWithoutSkillInput
  }

  export type SkillCreateOrConnectWithoutDiagnosesInput = {
    where: SkillWhereUniqueInput
    create: XOR<SkillCreateWithoutDiagnosesInput, SkillUncheckedCreateWithoutDiagnosesInput>
  }

  export type EvidenceItemCreateWithoutDiagnosisInput = {
    id?: string
    item_id: string
    extracted_answer?: string | null
    correct: boolean
    confidence?: number
    quality?: $Enums.EvidenceQuality
    created_at?: Date | string
  }

  export type EvidenceItemUncheckedCreateWithoutDiagnosisInput = {
    id?: string
    item_id: string
    extracted_answer?: string | null
    correct: boolean
    confidence?: number
    quality?: $Enums.EvidenceQuality
    created_at?: Date | string
  }

  export type EvidenceItemCreateOrConnectWithoutDiagnosisInput = {
    where: EvidenceItemWhereUniqueInput
    create: XOR<EvidenceItemCreateWithoutDiagnosisInput, EvidenceItemUncheckedCreateWithoutDiagnosisInput>
  }

  export type EvidenceItemCreateManyDiagnosisInputEnvelope = {
    data: EvidenceItemCreateManyDiagnosisInput | EvidenceItemCreateManyDiagnosisInput[]
    skipDuplicates?: boolean
  }

  export type SkillUpsertWithoutDiagnosesInput = {
    update: XOR<SkillUpdateWithoutDiagnosesInput, SkillUncheckedUpdateWithoutDiagnosesInput>
    create: XOR<SkillCreateWithoutDiagnosesInput, SkillUncheckedCreateWithoutDiagnosesInput>
    where?: SkillWhereInput
  }

  export type SkillUpdateToOneWithWhereWithoutDiagnosesInput = {
    where?: SkillWhereInput
    data: XOR<SkillUpdateWithoutDiagnosesInput, SkillUncheckedUpdateWithoutDiagnosesInput>
  }

  export type SkillUpdateWithoutDiagnosesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: SkillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    interventions?: InterventionUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateWithoutDiagnosesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: SkillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    interventions?: InterventionUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type EvidenceItemUpsertWithWhereUniqueWithoutDiagnosisInput = {
    where: EvidenceItemWhereUniqueInput
    update: XOR<EvidenceItemUpdateWithoutDiagnosisInput, EvidenceItemUncheckedUpdateWithoutDiagnosisInput>
    create: XOR<EvidenceItemCreateWithoutDiagnosisInput, EvidenceItemUncheckedCreateWithoutDiagnosisInput>
  }

  export type EvidenceItemUpdateWithWhereUniqueWithoutDiagnosisInput = {
    where: EvidenceItemWhereUniqueInput
    data: XOR<EvidenceItemUpdateWithoutDiagnosisInput, EvidenceItemUncheckedUpdateWithoutDiagnosisInput>
  }

  export type EvidenceItemUpdateManyWithWhereWithoutDiagnosisInput = {
    where: EvidenceItemScalarWhereInput
    data: XOR<EvidenceItemUpdateManyMutationInput, EvidenceItemUncheckedUpdateManyWithoutDiagnosisInput>
  }

  export type EvidenceItemScalarWhereInput = {
    AND?: EvidenceItemScalarWhereInput | EvidenceItemScalarWhereInput[]
    OR?: EvidenceItemScalarWhereInput[]
    NOT?: EvidenceItemScalarWhereInput | EvidenceItemScalarWhereInput[]
    id?: StringFilter<"EvidenceItem"> | string
    diagnosis_id?: StringFilter<"EvidenceItem"> | string
    item_id?: StringFilter<"EvidenceItem"> | string
    extracted_answer?: StringNullableFilter<"EvidenceItem"> | string | null
    correct?: BoolFilter<"EvidenceItem"> | boolean
    confidence?: FloatFilter<"EvidenceItem"> | number
    quality?: EnumEvidenceQualityFilter<"EvidenceItem"> | $Enums.EvidenceQuality
    created_at?: DateTimeFilter<"EvidenceItem"> | Date | string
  }

  export type DiagnosisCreateWithoutEvidenceInput = {
    id?: string
    student_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.DiagnosisStatus
    created_at?: Date | string
    updated_at?: Date | string
    skill: SkillCreateNestedOneWithoutDiagnosesInput
  }

  export type DiagnosisUncheckedCreateWithoutEvidenceInput = {
    id?: string
    student_id: string
    skill_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.DiagnosisStatus
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DiagnosisCreateOrConnectWithoutEvidenceInput = {
    where: DiagnosisWhereUniqueInput
    create: XOR<DiagnosisCreateWithoutEvidenceInput, DiagnosisUncheckedCreateWithoutEvidenceInput>
  }

  export type DiagnosisUpsertWithoutEvidenceInput = {
    update: XOR<DiagnosisUpdateWithoutEvidenceInput, DiagnosisUncheckedUpdateWithoutEvidenceInput>
    create: XOR<DiagnosisCreateWithoutEvidenceInput, DiagnosisUncheckedCreateWithoutEvidenceInput>
    where?: DiagnosisWhereInput
  }

  export type DiagnosisUpdateToOneWithWhereWithoutEvidenceInput = {
    where?: DiagnosisWhereInput
    data: XOR<DiagnosisUpdateWithoutEvidenceInput, DiagnosisUncheckedUpdateWithoutEvidenceInput>
  }

  export type DiagnosisUpdateWithoutEvidenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: EnumDiagnosisStatusFieldUpdateOperationsInput | $Enums.DiagnosisStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    skill?: SkillUpdateOneRequiredWithoutDiagnosesNestedInput
  }

  export type DiagnosisUncheckedUpdateWithoutEvidenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: EnumDiagnosisStatusFieldUpdateOperationsInput | $Enums.DiagnosisStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillCreateWithoutInterventionsInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: SkillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    diagnoses?: DiagnosisCreateNestedManyWithoutSkillInput
  }

  export type SkillUncheckedCreateWithoutInterventionsInput = {
    id?: string
    code: string
    name: string
    difficulty?: number
    description?: string | null
    prereq_skills?: SkillCreateprereq_skillsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    diagnoses?: DiagnosisUncheckedCreateNestedManyWithoutSkillInput
  }

  export type SkillCreateOrConnectWithoutInterventionsInput = {
    where: SkillWhereUniqueInput
    create: XOR<SkillCreateWithoutInterventionsInput, SkillUncheckedCreateWithoutInterventionsInput>
  }

  export type InterventionNoteCreateWithoutInterventionInput = {
    id?: string
    teacher_id: string
    content: string
    created_at?: Date | string
  }

  export type InterventionNoteUncheckedCreateWithoutInterventionInput = {
    id?: string
    teacher_id: string
    content: string
    created_at?: Date | string
  }

  export type InterventionNoteCreateOrConnectWithoutInterventionInput = {
    where: InterventionNoteWhereUniqueInput
    create: XOR<InterventionNoteCreateWithoutInterventionInput, InterventionNoteUncheckedCreateWithoutInterventionInput>
  }

  export type InterventionNoteCreateManyInterventionInputEnvelope = {
    data: InterventionNoteCreateManyInterventionInput | InterventionNoteCreateManyInterventionInput[]
    skipDuplicates?: boolean
  }

  export type SkillUpsertWithoutInterventionsInput = {
    update: XOR<SkillUpdateWithoutInterventionsInput, SkillUncheckedUpdateWithoutInterventionsInput>
    create: XOR<SkillCreateWithoutInterventionsInput, SkillUncheckedCreateWithoutInterventionsInput>
    where?: SkillWhereInput
  }

  export type SkillUpdateToOneWithWhereWithoutInterventionsInput = {
    where?: SkillWhereInput
    data: XOR<SkillUpdateWithoutInterventionsInput, SkillUncheckedUpdateWithoutInterventionsInput>
  }

  export type SkillUpdateWithoutInterventionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: SkillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: DiagnosisUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateWithoutInterventionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    prereq_skills?: SkillUpdateprereq_skillsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: DiagnosisUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type InterventionNoteUpsertWithWhereUniqueWithoutInterventionInput = {
    where: InterventionNoteWhereUniqueInput
    update: XOR<InterventionNoteUpdateWithoutInterventionInput, InterventionNoteUncheckedUpdateWithoutInterventionInput>
    create: XOR<InterventionNoteCreateWithoutInterventionInput, InterventionNoteUncheckedCreateWithoutInterventionInput>
  }

  export type InterventionNoteUpdateWithWhereUniqueWithoutInterventionInput = {
    where: InterventionNoteWhereUniqueInput
    data: XOR<InterventionNoteUpdateWithoutInterventionInput, InterventionNoteUncheckedUpdateWithoutInterventionInput>
  }

  export type InterventionNoteUpdateManyWithWhereWithoutInterventionInput = {
    where: InterventionNoteScalarWhereInput
    data: XOR<InterventionNoteUpdateManyMutationInput, InterventionNoteUncheckedUpdateManyWithoutInterventionInput>
  }

  export type InterventionNoteScalarWhereInput = {
    AND?: InterventionNoteScalarWhereInput | InterventionNoteScalarWhereInput[]
    OR?: InterventionNoteScalarWhereInput[]
    NOT?: InterventionNoteScalarWhereInput | InterventionNoteScalarWhereInput[]
    id?: StringFilter<"InterventionNote"> | string
    intervention_id?: StringFilter<"InterventionNote"> | string
    teacher_id?: StringFilter<"InterventionNote"> | string
    content?: StringFilter<"InterventionNote"> | string
    created_at?: DateTimeFilter<"InterventionNote"> | Date | string
  }

  export type InterventionCreateWithoutNotes_listInput = {
    id?: string
    student_id: string
    priority?: number
    status?: $Enums.InterventionStatus
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
    skill: SkillCreateNestedOneWithoutInterventionsInput
  }

  export type InterventionUncheckedCreateWithoutNotes_listInput = {
    id?: string
    student_id: string
    skill_id: string
    priority?: number
    status?: $Enums.InterventionStatus
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
  }

  export type InterventionCreateOrConnectWithoutNotes_listInput = {
    where: InterventionWhereUniqueInput
    create: XOR<InterventionCreateWithoutNotes_listInput, InterventionUncheckedCreateWithoutNotes_listInput>
  }

  export type InterventionUpsertWithoutNotes_listInput = {
    update: XOR<InterventionUpdateWithoutNotes_listInput, InterventionUncheckedUpdateWithoutNotes_listInput>
    create: XOR<InterventionCreateWithoutNotes_listInput, InterventionUncheckedCreateWithoutNotes_listInput>
    where?: InterventionWhereInput
  }

  export type InterventionUpdateToOneWithWhereWithoutNotes_listInput = {
    where?: InterventionWhereInput
    data: XOR<InterventionUpdateWithoutNotes_listInput, InterventionUncheckedUpdateWithoutNotes_listInput>
  }

  export type InterventionUpdateWithoutNotes_listInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: EnumInterventionStatusFieldUpdateOperationsInput | $Enums.InterventionStatus
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    skill?: SkillUpdateOneRequiredWithoutInterventionsNestedInput
  }

  export type InterventionUncheckedUpdateWithoutNotes_listInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    skill_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: EnumInterventionStatusFieldUpdateOperationsInput | $Enums.InterventionStatus
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DiagnosisCreateManySkillInput = {
    id?: string
    student_id: string
    p_known?: number
    confidence?: number
    status?: $Enums.DiagnosisStatus
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type InterventionCreateManySkillInput = {
    id?: string
    student_id: string
    priority?: number
    status?: $Enums.InterventionStatus
    teacher_id?: string | null
    notes?: string | null
    created_at?: Date | string
    resolved_at?: Date | string | null
  }

  export type DiagnosisUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: EnumDiagnosisStatusFieldUpdateOperationsInput | $Enums.DiagnosisStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: EvidenceItemUpdateManyWithoutDiagnosisNestedInput
  }

  export type DiagnosisUncheckedUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: EnumDiagnosisStatusFieldUpdateOperationsInput | $Enums.DiagnosisStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: EvidenceItemUncheckedUpdateManyWithoutDiagnosisNestedInput
  }

  export type DiagnosisUncheckedUpdateManyWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    p_known?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: EnumDiagnosisStatusFieldUpdateOperationsInput | $Enums.DiagnosisStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterventionUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: EnumInterventionStatusFieldUpdateOperationsInput | $Enums.InterventionStatus
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes_list?: InterventionNoteUpdateManyWithoutInterventionNestedInput
  }

  export type InterventionUncheckedUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: EnumInterventionStatusFieldUpdateOperationsInput | $Enums.InterventionStatus
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes_list?: InterventionNoteUncheckedUpdateManyWithoutInterventionNestedInput
  }

  export type InterventionUncheckedUpdateManyWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    student_id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    status?: EnumInterventionStatusFieldUpdateOperationsInput | $Enums.InterventionStatus
    teacher_id?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EvidenceItemCreateManyDiagnosisInput = {
    id?: string
    item_id: string
    extracted_answer?: string | null
    correct: boolean
    confidence?: number
    quality?: $Enums.EvidenceQuality
    created_at?: Date | string
  }

  export type EvidenceItemUpdateWithoutDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: BoolFieldUpdateOperationsInput | boolean
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: EnumEvidenceQualityFieldUpdateOperationsInput | $Enums.EvidenceQuality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidenceItemUncheckedUpdateWithoutDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: BoolFieldUpdateOperationsInput | boolean
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: EnumEvidenceQualityFieldUpdateOperationsInput | $Enums.EvidenceQuality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvidenceItemUncheckedUpdateManyWithoutDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    item_id?: StringFieldUpdateOperationsInput | string
    extracted_answer?: NullableStringFieldUpdateOperationsInput | string | null
    correct?: BoolFieldUpdateOperationsInput | boolean
    confidence?: FloatFieldUpdateOperationsInput | number
    quality?: EnumEvidenceQualityFieldUpdateOperationsInput | $Enums.EvidenceQuality
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterventionNoteCreateManyInterventionInput = {
    id?: string
    teacher_id: string
    content: string
    created_at?: Date | string
  }

  export type InterventionNoteUpdateWithoutInterventionInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterventionNoteUncheckedUpdateWithoutInterventionInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacher_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterventionNoteUncheckedUpdateManyWithoutInterventionInput = {
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
     * @deprecated Use SkillDefaultArgs instead
     */
    export type SkillArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SkillDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DiagnosisDefaultArgs instead
     */
    export type DiagnosisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DiagnosisDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EvidenceItemDefaultArgs instead
     */
    export type EvidenceItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EvidenceItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InterventionDefaultArgs instead
     */
    export type InterventionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InterventionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InterventionNoteDefaultArgs instead
     */
    export type InterventionNoteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InterventionNoteDefaultArgs<ExtArgs>

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