let baseDir = 'src'
if (process.env.NODE_ENV === 'production') {
  baseDir = 'dist'
}

module.exports = {
   type: "postgres",
   url: process.env.DATABASE_URL,
   synchronize: false,
   entities: [
      `./${baseDir}/**/*Entity{.ts,.js}`
   ],
   migrations: [
      `./${baseDir}/**/migrations/*{.ts,.js}`
   ],
   subscribers: [
      `./${baseDir}/**/subscribers/**/*{.ts,.js}`
   ],
   cli: {
      entitiesDir: "./",
      migrationsDir: "./src/migrations",
      subscribersDir: "./src/subscribers"
   },
   logging: true,
   logger: "debug"
}
