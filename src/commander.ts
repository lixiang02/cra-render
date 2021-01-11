#!/usr/bin/env node

import program from 'commander';
import * as packageObj from '../package.json';
import configObject from './config';
import {renderTemplate} from './index';

program
  .version(packageObj.version)
  .description('渲染项目')
  .option('-r --render-project <moudleName>', '渲染项目名称')
  .option('-t --template-dir <templateDir>', '模版路径')
  .option('-n --new-render-project-dir <newRenderProjectDir>', '新生成的模版路径')
  .action((commander) => {
    configObject.merge({
        namespace: commander.renderProject || '',
        templateDir: commander.templateDir || '',
        newRenderProjectDir: commander.newRenderProjectDir || ''
      })
      renderTemplate()
  })
  .on('--help', () => {
    console.log('');
    console.log('');
    console.log('');
  })
  program.parse(process.argv);


