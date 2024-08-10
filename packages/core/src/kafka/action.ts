import type { KafkaTopicSchema } from "@/schema/common.js";
import type { InferKafkaTopicConfig } from "@/schema/infer.js";
import type { z } from "zod";
import type { KafkaService } from "./service.js";

export type KafkaTopicProducer<T> = {
  send: (messages: T[]) => Promise<void>;
};

export const buildKafka = ({
  kafkaService,
  topicSchema,
}: {
  kafkaService: KafkaService | undefined;
  topicSchema: KafkaTopicSchema;
}): {
  [key in keyof InferKafkaTopicConfig<typeof topicSchema>]: KafkaTopicProducer<
    InferKafkaTopicConfig<typeof topicSchema>[key]
  >;
} => {
  if (!kafkaService) return {};
  const producers: {
    [key in keyof InferKafkaTopicConfig<
      typeof topicSchema
    >]: KafkaTopicProducer<InferKafkaTopicConfig<typeof topicSchema>[key]>;
  } = {};

  for (const [eventName, config] of Object.entries(topicSchema)) {
    const { topic, messageSchema } = config;
    producers[eventName] = {
      send: async (messages: z.infer<typeof messageSchema>[]) => {
        await kafkaService.send(
          topic,
          messages.map((message) => ({ value: JSON.stringify(message) })),
        );
      },
    };
  }
  return producers;
};
