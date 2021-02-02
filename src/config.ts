import * as fs from 'fs';
import * as path from 'path';

export interface ConfigType {
  [key:string]: any
}

class Config {
  config: ConfigType;
  configPath: string;
  configFileName: string;
  constructor() {
    this.config = {
      pwd: process.env.PWD || process.cwd() || '',
      home: process.env.HOME || process.env.HOMEPATH || ''
    }
    this.configPath = ''
    this.configFileName = '.crarc'
    this.getByFile()
  }
  get(key:string):any {
    return this.config[key]
  }
  set(key:string, value: any) {
    this.config[key] = value
  }
  getByFile() {
    this.getConifgPath(this.configFileName)
    if (!this.configPath) { return null }

    this.merge(require(this.configPath))
  }
  merge(config?: ConfigType) {
    if (!config || typeof config !== 'object') return null;

    Object.assign(this.config, config)
  }
  defaultValue(config: ConfigType) {
    if (!config || typeof config !== 'object') return null;

    Object.keys(config).map(key => {
      const value = config[key]
      if (!this.get(key)) {
        this.set(key, value)
      }
    })
  }
  getConifgPath(fileName: string) {
      if (!fileName) { return null }
      
      // 当前命令运行目录下的
      this.checkFileExist(
        path.resolve(this.config.pwd, `./${fileName}`)
      );
      
      // 全局默认路径
      this.checkFileExist(
          path.resolve(this.config.home, fileName)
      );
      
      // 包中默认模版
      this.checkFileExist(
        path.resolve(__dirname, `../${fileName}`)
      );  
  }
  checkFileExist(path:string) {
      if (this.configPath) { return }
      
      if (path && fs.existsSync(path)) {
        this.configPath = path
      }
      this.configPath = ''
  }
}

export default new Config()

