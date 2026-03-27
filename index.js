// Entry point redirect for Metro bundler
// This file exists so Metro can find the entry point when projectRoot is the monorepo root
module.exports = require('./packages/vega/index');
