import type { z } from "zod";
import type { KafkaTopicsConfig } from "./config.js";

export type KafkaClusterConfig = {
  brokers: string[];
  sasl: {
    username: string;
    password: string;
  };
};

export type KafkaConfig<
  topics extends Record<string, z.ZodObject<any>> = Record<
    string,
    z.ZodObject<any>
  >,
> = {
  cluster: KafkaClusterConfig;
  topics: KafkaTopicsConfig<topics>;
};

// // `Narrow` utility type is inferred from its usage in the NetworksConfig
// type ExampleMessageSchema = {
//   foo: string;
// };
// const exampleSchema = z.object({
//   foo: z.string(),
// });

// // Example usage
// const exampleConfig: KafkaConfig = {
//   enabled: true,
//   topics: {
//     userEvents: {
//       messageSchema: exampleSchema,
//       topic: "user.events",
//     },
//     transactionEvents: {
//       messageSchema: exampleSchema,
//       topic: "transaction.events",
//     },
//   },
// };
