import type { Common } from "@/common/common.js";
import type { KafkaClusterConfig } from "@/config/kafka.js";
import type { KafkaTopicSchema } from "@/schema/common.js";
import {
  type Admin,
  Kafka,
  type Message,
  type Producer,
  logLevel,
} from "kafkajs";

export class KafkaService {
  private common: Common;

  private kafka: Kafka;
  private admin: Admin;
  private producer: Producer;
  private topicSchema: KafkaTopicSchema;

  constructor({
    common,
    clusterConfig,
    topicSchema,
  }: {
    common: Common;
    clusterConfig: KafkaClusterConfig;
    topicSchema: KafkaTopicSchema;
  }) {
    this.common = common;

    this.kafka = new Kafka({
      clientId: "ponder",
      brokers: clusterConfig.brokers,
      ssl: true,
      sasl: {
        mechanism: "scram-sha-256",
        username: clusterConfig.sasl.username,
        password: clusterConfig.sasl.password,
      },
      logLevel: logLevel.INFO,
    });
    this.admin = this.kafka.admin();
    this.producer = this.kafka.producer();
    this.topicSchema = topicSchema;
  }

  async setup(): Promise<void> {
    const producerTopics = Object.keys(this.topicSchema);
    const serverTopics = await this.admin.listTopics();
    for (const topic of producerTopics) {
      if (!serverTopics.includes(topic)) {
        this.common.logger.info({
          service: "kafka",
          msg: `Created topic '${topic}'`,
        });
        await this.admin.createTopics({
          topics: [
            {
              topic,
              numPartitions: 1,
              replicationFactor: 2,
            },
          ],
        });
      }
    }
    this.common.logger.info({
      service: "kafka",
      msg: "All topics have been created",
    });
  }

  async send(topic: string, messages: Message[]): Promise<void> {
    await this.producer.send({
      topic,
      messages,
    });
  }
}
