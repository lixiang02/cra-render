import * as fs from 'fs-extra';
import * as path from 'path';
import configObject, { ConfigType } from './config';
import { render } from './render';

export function renderTemplate(config?: ConfigType) {
    try {
        configObject.merge(config)

        configObject.defaultValue({
            namespace: 'demoTemplate',
            templateDir: path.resolve(configObject.get('pwd'), 'template'),
            newRenderProjectDir: path.resolve(configObject.get('pwd'), `packages/${configObject.get('namespace')}`)
        })
        
        if (!fs.existsSync(configObject.get('newRenderProjectDir'))) {
            fs.mkdirpSync(configObject.get('newRenderProjectDir'))
        } else {
          throw new Error(`模块已存在: ${configObject.get('newRenderProjectDir')}`)
        }
        fs.copySync(configObject.get('templateDir'), configObject.get('newRenderProjectDir'))

        // 渲染
        renderDirs(configObject.get('newRenderProjectDir'))
    } catch (err) {
        throw new Error(`渲染模版错误：, ${err.message}`)
    }
}

const renderDirs = (dir: string) => {
    const result = fs.readdirSync(dir)
    for (const name of result) {
      var filePath = path.resolve(dir, name)
      if (/node_modules|\.git|\.jpg$|\.png$/.test(filePath)) {
        continue
      }
      var stats = fs.statSync(filePath)
      var isFile = stats.isFile() // 是文件
      var isDir = stats.isDirectory() // 是文件夹
      if (isFile) {
        fs.writeFileSync(
            filePath,
            render(fs.readFileSync(filePath, 'utf-8'))
        )
      }
      if (isDir) {
        renderDirs(filePath)
      }
    }
}