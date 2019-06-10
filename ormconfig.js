let baseDir = 'src'
if (process.env.NODE_ENV === 'production') {
  baseDir = 'dist'
}
//
// const entitiesMap = require(`./${baseDir}/entities`)
// const entities = []
// for (var name in entitiesMap) {
//   entities.push(entitiesMap[name])
// }
//
// console.log(entities)

module.exports = {
   type: "postgres",
   url: process.env.DATABASE_URL,
   synchronize: false,
   entities: [
     `./${baseDir}/entities{.ts,.js}`
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
   extra: {
      // Max number of db connections
      max: 9
   },
   logging: true,
   logger: "debug"
}
