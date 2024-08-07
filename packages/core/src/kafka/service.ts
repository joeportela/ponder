import type { Common } from "@/common/common.js";
import type { KafkaConfig } from "@/config/kafka.js";
import { type Admin, Kafka, type Producer, logLevel } from "kafkajs";

export class KafkaService {
  private common: Common;

  private kafkaConfig: KafkaConfig;
  private kafka: Kafka;
  private admin: Admin;
  private producer: Producer;

  constructor({
    common,
    kafkaConfig,
  }: {
    common: Common;
    kafkaConfig: KafkaConfig;
  }) {
    this.common = common;

    this.kafkaConfig = kafkaConfig;
    this.kafka = new Kafka({
      clientId: "ponder",
      brokers: kafkaConfig.cluster.brokers,
      ssl: true,
      sasl: {
        mechanism: "scram-sha-256",
        username: kafkaConfig.cluster.sasl.username,
        password: kafkaConfig.cluster.sasl.password,
      },
      logLevel: logLevel.INFO,
    });
    this.admin = this.kafka.admin();
    this.producer = this.kafka.producer();
  }

  async setup(): Promise<void> {
    const producerTopics = Object.keys(this.kafkaConfig.topics);
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

  async send(): Promise<void> {
    this.producer.send({
      topic: "foobar",
      messages: [],
    });
  }
}
