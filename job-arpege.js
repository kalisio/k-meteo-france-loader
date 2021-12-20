const path = require('path')
const util = require('util')
const moment = require('moment')
const krawler = require('@kalisio/krawler')
const hooks = krawler.hooks
const outputPath = path.join(__dirname, 'forecast-data')

// Create a custom hook to generate tasks
let generateTasks = (options) => {
  return function (hook) {
    // Compute the tasks to be performed according the settings
    let tasks = []
    options.runTimes.forEach(runTime => {
      // Convet run time from time in current day to date/time
      runTime = moment().utc().startOf('day').add(moment.duration(runTime))
      options.packages.forEach(package => {
        options.forecastTimes.forEach(forecastTime => {
          tasks.push({
            runTime, package, forecastTime,
          })
        })
      })
    })
    hook.data.tasks = tasks
    return hook
  }
}
hooks.registerHook('generateTasks', generateTasks)

const defaults = (options) => ({
  id: 'arpege-loader',
  model: 'arpege',
  request: {
    url: 'http://dcpc-nwp.meteo.fr/services/PS_GetCache_DCPCPreviNum',
    format: 'grib2',
    referencetime: `<%= runTime.format() %>`,
    package: `<%= package %>`,
    time: `<%= forecastTime %>`
  },
  // By naming files locally without refering to run time we reuse the same names and avoid having to purge
  filepath: `<%= package %>/<%= forecastTime %>`,
  archiveId: `<%= model %>/<%= runTime.format('YYYY/MM/DD/HH') %>/<%= package %>/<%= forecastTime %>`
})

module.exports = (options) => {
  options = Object.assign({}, defaults(options), options)
  const filepath = options.filepath
  const id = `${options.model}/${filepath}.grb`
  const archiveId = options.archiveId

  return {
    id: options.id,
    store: 'fs',
    options: {
      workersLimit: (process.env.WORKERS_LIMIT ? Number(process.env.WORKERS_LIMIT) : (options.workersLimit || 2)),
      faultTolerant: true
    },
    taskTemplate: {
      id,
      type: 'http',
      // Common options for models, some will be setup on a per-model basis
      options: Object.assign({
        token: process.env.TOKEN,
        model: options.model,
        grid: options.grid
      }, options.request)
    },
    hooks: {
      tasks: {
        before: {
          // Do not download data if already here
          /*
          discardIf: {
            predicate: (item) => item.previousData.runTime && (item.runTime.valueOf() === item.previousData.runTime.getTime())
          }*/
        },
        after: {
          // Upload raw archive data to S3
          copyToStore: {
            match: { predicate: () => process.env.S3_BUCKET },
            input: { key: '<%= id %>', store: 'fs' },
            output: { key: `${archiveId}.grb`,
              store: 's3'
            }
          }
        }
      },
      jobs: {
        before: {
          createFStore: {
            hook: 'createStore',
            id: 'fs',
            options: {
              path: outputPath
            }
          },
          createS3Store: {
            hook: 'createStore',
            match: { predicate: () => process.env.S3_BUCKET },
            id: 's3',
            options: {
              client: {
                endpoint: process.env.S3_ENDPOINT,
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
              },
              bucket: process.env.S3_BUCKET
            }
          },
          generateTasks: options
        },
        after: {
          clearOutputs: {},
          removeFSStore: {
            hook: 'removeStore',
            id: 'fs'
          },
          removeS3Store: {
            hook: 'removeStore',
            match: { predicate: () => process.env.S3_BUCKET },
            id: 's3'
          }
        }
      }
    }
  }
}
