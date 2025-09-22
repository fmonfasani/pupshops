export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'development-secret',
    ttl: process.env.TOKEN_TTL ?? '7d'
  }
});
