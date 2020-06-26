const fs = require('fs')
const AWS = require('aws-sdk')
const log = require('fancy-log')
const path = require('path')

const getFileLines = (path) => {
  const data = fs.readFileSync(path, 'UTF-8')
  return data.split(/\r?\n/)
}

const parseConfig = (path) => {
  if (!fs.existsSync(path)) {
    throw new Error(`AWS CLI config file don't exists: '${path}'`)
  }
  const config = {}
  const configLines = getFileLines(path)
  let lastConfigEntryName
  for (let i = 0; i < configLines.length; i++) {
    const line = configLines[i]
    const configEntryMatch = line.match(/^\[([a-zA-Z-_]*)\s([a-zA-Z-_0-9]*)\]$/)
    const configFieldMatch = line.match(/^([a-zA-Z-_]*)\s?=\s?([a-zA-Z-_0-9]*)$/)
    if (configEntryMatch) {
      const profile = configEntryMatch[2]
      config[profile] = {}
      lastConfigEntryName = profile
    } else if (lastConfigEntryName !== undefined && configFieldMatch) {
      const fieldName = configFieldMatch[1]
      const fieldValue = configFieldMatch[2]
      config[lastConfigEntryName][fieldName] = fieldValue
    }
  }
  return config
}

const parseCredentials = (path) => {
  if (!fs.existsSync(path)) {
    throw new Error(`AWS CLI credentials file not exists: '${path}'`)
  }
  const credentials = {}
  const credentialsLines = getFileLines(path)
  let lastCredentialEntryName
  for (let i = 0; i < credentialsLines.length; i++) {
    const line = credentialsLines[i]
    const credentialEntryMatch = line.match(/^\[([a-zA-Z-_]*)\]$/)
    const credentialFieldMatch = line.match(/^([a-zA-Z-_]*)\s?=\s?(.*)$/)
    if (credentialEntryMatch) {
      const profile = credentialEntryMatch[1]
      credentials[profile] = {}
      lastCredentialEntryName = profile
    } else if (lastCredentialEntryName !== undefined && credentialFieldMatch) {
      const fieldName = credentialFieldMatch[1]
      const fieldValue = credentialFieldMatch[2]
      credentials[lastCredentialEntryName][fieldName] = fieldValue
    }
  }
  return credentials
}

const getProjectBucket = async (project, env, config) => {
  const s3 = new AWS.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
  })
  return new Promise((resolve, reject) => {
    s3.listBuckets((error, data) => {
      if (error) {
        reject(error)
      } else {
        const buckets = data.Buckets.filter((bucket) => {
          return bucket.Name.indexOf(project) > -1 &&
            bucket.Name.indexOf(env) > -1
        })
        if (buckets.length > 0) {
          resolve(buckets[0].Name)
        } else {
          resolve(null)
        }
      }
    })
  })
}

const getBucketDistribution = async (bucketName, config) => {
  const cloudFront = new AWS.CloudFront({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
  })
  return new Promise((resolve, reject) => {
    cloudFront.listDistributions((error, data) => {
      if (error) {
        reject(error)
      } else {
        const distributions = data.Items
        let distributionId
        for (let i = 0; i < distributions.length; i++) {
          const distribution = distributions[i]
          const origins = distribution.Origins.Items.filter((origin) => {
            return origin.DomainName.indexOf(bucketName) > -1
          })
          if (origins.length > 0) {
            distributionId = distribution.Id
          }
        }
        resolve(distributionId)
      }
    })
  })
}

const buildCloudFrontFileName = (rootPath, env) => {
  return path.join(rootPath, `.aws_cloudfront_${env}.json`)
}

const getCloudFrontConfig = async (path, env) => {
  const fileName = buildCloudFrontFileName(path, env)
  if (!fs.existsSync(fileName)) {
    throw Error(`Cloudfront configuration file not found: '${fileName}'`)
  }
  const data = fs.readFileSync(fileName)
  return JSON.parse(data)
}

const configure = (project,
  env,
  awsConfig,
  awsCredentials,
  profile,
  path,
  gulpCallback) => {
  const config = {
    accessKeyId: awsCredentials[profile].aws_access_key_id,
    secretAccessKey: awsCredentials[profile].aws_secret_access_key,
    region: awsConfig[profile].region
  }
  getProjectBucket(project, env, config)
    .then((bucketName) => {
      log.info('Bucket name: ', bucketName)
      getBucketDistribution(bucketName, config)
        .then(distributionId => {
          log.info('Distribution id: ', distributionId)
          const data = {
            bucketName,
            distributionId,
            profile
          }
          const fileName = buildCloudFrontFileName(path, env)
          fs.writeFileSync(fileName, JSON.stringify(data, undefined, 2))
          log.info(`Configuration saved on '${fileName}'`)
          gulpCallback()
        }).catch((error) => {
          log.error('Error getting distribution id: ', error)
          gulpCallback(error)
        })
    }).catch(error => {
      log.error('Error getting bucket name: ', error)
      gulpCallback(error)
    })
}

module.exports.parseConfig = parseConfig
module.exports.parseCredentials = parseCredentials
module.exports.getBucketDistribution = getBucketDistribution
module.exports.getProjectBucket = getProjectBucket
module.exports.configure = configure
module.exports.getCloudFrontConfig = getCloudFrontConfig