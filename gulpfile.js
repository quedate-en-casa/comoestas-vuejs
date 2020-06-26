const { parseConfig, parseCredentials, configure, getCloudFrontConfig } = require('./gulp/aws-util')
const gulp = require('gulp')
const awspublish = require('gulp-awspublish')
const cloudfront = require('gulp-cloudfront-invalidate-aws-publish')
const parallelize = require('concurrent-transform')
const run = require('gulp-run')
const path = require('path')
const log = require('fancy-log')
const fs = require('fs')
const inquirer = require('inquirer')

const buffer = fs.readFileSync(path.join(__dirname, 'package.json'))
const packageJson = JSON.parse(buffer)
const awsPath = (process.platform === 'win32') ? process.env.USERPROFILE : process.env.HOME
const project = packageJson.name
const awsConfig = parseConfig(path.join(awsPath, '.aws', 'config'))
const awsCredentials = parseCredentials(path.join(awsPath, '.aws', 'credentials'))

let env;
let cloudFrontConfig = {
  bucketName: 's3-comoestas-ui-dev'
}

gulp.task('configure', (callback) => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'profile',
        message: 'AWS credentials profile name: '
      },
      {
        type: 'list',
        name: 'env',
        message: 'Choose environment used by this profile: ',
        default: 'dev',
        choices: ['dev', 'test', 'prod']
      }
    ])
    .then(answer => {
      log.info(`Starting deploy with profile '${answer.profile}' for environment '${answer.env}'`)
      configure(project,
        answer.env,
        awsConfig,
        awsCredentials,
        answer.profile,
        __dirname,
        callback)
    }).catch(error => {
      log.error('Error al configurar ambiente: ', error)
      callback(error)
    })
})

gulp.task('generate', () => {
  log.info(`Generating application distribution for environment '${env}'`)
  return run(
    'yarn build'
  ).exec()
})

gulp.task('choose', (callback) => {
  inquirer
    .prompt([{
      type: 'list',
      name: 'env',
      message: 'Choose environment for deploy: ',
      default: 'dev',
      choices: ['dev', 'test', 'prod']
    }
    ]).then(answer => {
      env = answer.env
      getCloudFrontConfig(__dirname, env).then(config => {
        cloudFrontConfig = config
        callback()
      }).catch(error => {
        log.error('Error getting cloudfront config file: ', error)
        callback(error)
      })
    }).catch(error => {
      log.error('Error choosing environment: ', error)
      callback(error)
    })
})

gulp.task('cloudfront', async () => {
  log.info(`Starting deploy with profile '${cloudFrontConfig.profile}' for environment '${env}'`)
  const isNotProduction = env !== 'prod'
  const config = {
    params: {
      Bucket: cloudFrontConfig.bucketName
    },
    credentials: {
      accessKeyId: awsCredentials[cloudFrontConfig.profile].aws_access_key_id,
      secretAccessKey: awsCredentials[cloudFrontConfig.profile].aws_secret_access_key,
      signatureVersion: 'v3'
    },
    deleteOldVersions: isNotProduction,
    distribution: cloudFrontConfig.distributionId,
    region: awsConfig[cloudFrontConfig.profile].region,
    headers: {},
    distDir: 'dist',
    indexRootPath: true,
    cacheFileName: '.aws-publish',
    concurrentUploads: 10,
    wait: true
  }
  const publisher = awspublish.create(config)
  let g = gulp.src('./' + config.distDir + '/**')
  g = g.pipe(parallelize(publisher.publish(config.headers), config.concurrentUploads))
  if (config.distribution) {
    log.info('Configured with CloudFront distribution')
    g = g.pipe(cloudfront(config))
  } else {
    log.info('No CloudFront distribution configured - skipping CDN invalidation')
  }
  if (config.deleteOldVersions) { g = g.pipe(publisher.sync()) }
  g = g.pipe(publisher.cache())
  g = g.pipe(awspublish.reporter())
  return g
})

gulp.task('deploy', gulp.series('choose', 'generate','cloudfront'))

