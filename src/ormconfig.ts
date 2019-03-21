export const ormconfig = {
   type: "postgres",
   url: process.env.DATABASE_URL,
   synchronize: false,
   logging: false,
   entities: [
      "./**/**.entity{.ts,.js}"
   ],
   migrations: [
      "./dist/migration/**/*.js"
   ],
   subscribers: [
      "./dist/subscriber/**/*.js"
   ],
   cli: {
      entitiesDir: "./src/entity",
      migrationsDir: "./src/migration",
      subscribersDir: "./src/subscriber"
   }
}
