import * as Mustache from 'mustache';
import configObject, { ConfigType } from './config';

export function render(fileData: string, config?: ConfigType): string {
    configObject.merge(config)
    
    return Mustache.render(fileData, configObject.config, {}, ['{@', '@}'])
}