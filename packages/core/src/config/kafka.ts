export type KafkaClusterConfig = {
  brokers: string[];
  sasl: {
    username: string;
    password: string;
  };
};
