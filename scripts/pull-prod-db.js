const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function dump() {
  let result
  
  console.log(`Dumping prod database to 'latest.dump(.n)' ... Be patient ... this will take minutes to connect to the heroku database`)

  result = await exec(`heroku pg:backups:capture`)
  result = await exec(`heroku pg:backups:download`)
  result = await exec(`pg_restore --verbose --clean --no-acl --no-owner -h localhost -d notusapi latest.dump`)

  // console.log(result)
  console.log('... done!')
}

dump()
