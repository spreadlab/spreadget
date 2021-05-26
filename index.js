#!/usr/bin/env node
const { hideBin } = require('yargs/helpers');
const update = require('./src/update');

const argv = require('yargs/yargs')(hideBin(process.argv))
    .command(
        'update [spreadsheet]',
        'Updates local files based on Google Spreadsheet data',
        function (yargs) {
            return yargs.option('spreadsheet', {
                alias: 's',
                type: 'string',
                desc: 'Google Spreadsheet id'
            }).option('sheet', {
                alias: 'n',
                default: 1,
                type: 'number',
                desc: 'Google Spreadsheet sheet number'
            }).option('output-dir', {
                alias: 'd',
                type: 'string',
                desc: 'Output directory for files',
                default: './_posts'
            }).option('force-update', {
                alias: 'f',
                type: 'boolean',
                desc: 'Forces update regardless of versions',
                default: false
            }).option('verbose', {
                alias: 'v',
                type: 'boolean',
                desc: 'Run with verbose logging'
            }).option('adapter', {
                alias: 'a',
                type: 'string',
                default: 'posts',
                choices: ['posts', 'categories']
            })
        }
    )
    .demand(['spreadsheet'])
    .help('h')
    .example('$0 update -s 1hDR2paRr6BxX9LDzSZEmA__Y3byrUgtOOGz9BFC-sVg -n 2 -f')
    .argv;

update(argv.spreadsheet, {
    sheetNumber: argv.sheet,
    shouldForceUpdate: argv.forceUpdate,
    outputDir: argv.outputDir,
    isVerbose: argv.verbose,
    adapterName: argv.adapter
}).then(message => {
    console.info(message);
});



