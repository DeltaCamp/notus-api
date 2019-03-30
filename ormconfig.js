module.exports = {
   type: "postgres",
   url: process.env.DATABASE_URL,
   synchronize: false,
   logging: false,
   entities: [
      "./!(node_modules)/**/*Entity{.ts,.js}"
   ],
   migrations: [
      "./src/**/migrations/*{.ts,.js}"
   ],
   subscribers: [
      "./!(node_modules)/**/subscribers/**/*{.ts,.js}"
   ],
   cli: {
      entitiesDir: "./",
      migrationsDir: "./src/migrations",
      subscribersDir: "./src/subscribers"
   }
}
