module.exports = {
   type: "postgres",
   url: process.env.DATABASE_URL,
   synchronize: false,
   logging: false,
   entities: [
      "./**/**.entity{.ts,.js}",
      "./**/**Entity{.ts,.js}"
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
