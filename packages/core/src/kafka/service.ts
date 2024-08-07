import type { KafkaConfig } from "@/config/kafka.js";

export class KafkaService {
  private kafkaConfig: KafkaConfig;

  constructor({ kafkaConfig }: { kafkaConfig: KafkaConfig }) {
    this.kafkaConfig = kafkaConfig;
  }

  async setup(): Promise<void> {}
}
