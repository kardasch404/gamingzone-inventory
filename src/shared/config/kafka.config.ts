export const kafkaConfig = () => ({
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: 'inventory-service',
    groupId: 'inventory-group',
  },
});
