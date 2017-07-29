'use strict';

const dynamoose = require('dynamoose');
const modelConsts = require('../model/consts')

if (process.env.IS_OFFLINE) {
  // dev env
  // setup local dynamodb
  // seed dummy AWS settings
  dynamoose.AWS.config.update({
    accessKeyId: 'AKID',
    secretAccessKey: 'SECRET',
    region: 'liberty'
  });
  dynamoose.local();
}

// connection settings
dynamoose.AWS.config.update({
  httpOptions: {
    connectTimeout: 300
  }});

// retry strategy
dynamoose.AWS.config.update({
  maxRetries: 3,
  retryDelayOptions: {
    customBackoff: (count) => 50
  }
});

// set default settings
dynamoose.setDefaults({
  create: false,
  update: false,
  waitForActive: false,
  waitForActiveTimeout: 1,
  prefix: `${modelConsts.env_name}-`,
  useDocumentTypes: true,
  useNativeBooleans: true
});

module.exports = dynamoose;