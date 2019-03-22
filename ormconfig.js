module.exports = {
   type: "postgres",
   url: process.env.DATABASE_URL,
   synchronize: false,
   logging: false,
   entities: [
      "src/**/*Entity.ts"
   ],
   migrations: [
      "./dist/migrations/*{.ts,.js}"
   ],
   subscribers: [
      "./**/subscribers/**/*{.ts,.js}"
   ],
   cli: {
      entitiesDir: "./",
      migrationsDir: "./src/migrations",
      subscribersDir: "./src/subscribers"
   }
}
