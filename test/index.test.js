import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import chai from 'chai'
import chailint from 'chai-lint'
import { cli as krawler } from '@kalisio/krawler'
import arpegeWorldJobDefinition from '../jobfile-arpege-world.js'
import arpegeEuropeJobDefinition from '../jobfile-arpege-europe.js'
import aromeFranceJobDefinition from '../jobfile-arome-france.js'
import loader from '../index.js'

const { util, expect } = chai
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Avoid archiving for testing
process.env.S3_BUCKET = ''

// Helper function to get tasks generation options
function getJobOptions (job) {
  const beforeHooks = job.hooks.jobs.before
  return beforeHooks.generateTasks
}

// Helper function to update tasks generation options
function updateJobOptions (job) {
  const afterHooks = job.hooks.jobs.after
  // Keep track of intermediate files
  delete afterHooks.clearOutputs
  const options = getJobOptions(job)
  // Simplify job for testing and only request 1 package and 1 forecast time
  options.runTimes.splice(1)
  options.packages.splice(1)
  options.forecastTimes.splice(1)
  return job
}

describe('k-meteo-france-loader', () => {
  const outputPath = path.join(__dirname, '..', 'forecast-data')
  const arpegeWorldJob = updateJobOptions(arpegeWorldJobDefinition)
  const arpegeEuropeJob = updateJobOptions(arpegeEuropeJobDefinition)
  const aromeFranceJob = updateJobOptions(aromeFranceJobDefinition)

  function expectFiles (model, pkg, forecastTime, present) {
    // Check final product are here
    expect(fs.existsSync(path.join(outputPath, model, pkg, `${forecastTime}.grb`))).to.equal(present)
  }

  before(async () => {
    chailint(chai, util)
  })

  it('is ES module compatible', () => {
    expect(typeof loader.createArpegeJob).to.equal('function')
    expect(typeof loader.createAromeJob).to.equal('function')
  })

  it('run ARPEGE WORLD dowloader', async () => {
    const tasks = await krawler(arpegeWorldJob)
    const options = getJobOptions(arpegeWorldJob)
    expect(tasks.length).to.equal(1)
    // Check intermediate products have been produced and final product are here
    expectFiles('arpege-world', options.packages[0], options.forecastTimes[0], true)
    fs.emptyDirSync(outputPath)
  })
  // Let enough time to process
    .timeout(180000)

  it('run ARPEGE EUROPE downloader', async () => {
    const tasks = await krawler(arpegeEuropeJob)
    const options = getJobOptions(arpegeEuropeJob)
    expect(tasks.length).to.equal(1)
    // Check intermediate products have been produced and final product are here
    expectFiles('arpege-europe', options.packages[0], options.forecastTimes[0], true)
    fs.emptyDirSync(outputPath)
  })
  // Let enough time to process
    .timeout(180000)

  it('run AROME FRANCE downloader', async () => {
    const tasks = await krawler(aromeFranceJob)
    const options = getJobOptions(aromeFranceJob)
    expect(tasks.length).to.equal(1)
    // Check intermediate products have been produced and final product are here
    expectFiles('arome-france', options.packages[0], options.forecastTimes[0], true)
    fs.emptyDirSync(outputPath)
  })
  // Let enough time to process
    .timeout(180000)

  // Cleanup
  after(async function () {
    // Let enough time to process
    this.timeout(30000)
    fs.emptyDirSync(outputPath)
  })
})
