export type KafkaClusterConfig = {
  brokers: string[];
  sasl: {
    username: string;
    password: string;
  };
};

// export type KafkaConfig = {
//   cluster: KafkaClusterConfig;
//   topics: KafkaTopicsConfig;
// };

// // `Narrow` utility type is inferred from its usage in the NetworksConfig
// type ExampleMessageSchema = {
//   foo: string;
// };
// const exampleSchema = z.object({
//   bar: z.string(),
// });

// const x: KafkaTopicConfig = {
//   messageSchema: exampleSchema,
//   topic: "user.events",
// };

// const y: KafkaTopicsConfig = {
//   foo: x
// }

// // Example usage
// const exampleConfig: KafkaConfig = {
//   topics: {
//     userEvents: {
//       messageSchema: 1,
//       topic: "user.events",
//     },
//     transactionEvents: {
//       messageSchema: exampleSchema,
//       topic: "transaction.events",
//     },
//   },
// };
