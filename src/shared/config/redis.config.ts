export const redisConfig = () => ({
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    ttl: {
      stock: 300, // 5 minutes
      warehouse: 600, // 10 minutes
      alerts: 900, // 15 minutes
    },
  },
});
