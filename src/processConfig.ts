
import { ConfigType } from './config';

interface ImportDataType {
	package: string;
	text: string
	children: Array<string>;
}

export function processConfig(config: ConfigType): void {    
    transformArrayItemToString(config);
    transformTypetoComponentData(config);
}
function transformTypetoComponentData(config:any={}) {
    const types = ['input', 'select', 'datepicker'];
    for (const key in config) {
        if (Array.isArray(config[key])) {
            if (!config.transformTypetoComponentData || typeof config.transformTypetoComponentData !== 'object') {
                config.transformTypetoComponentData = {};
            }
            config.transformTypetoComponentData[key] = [];
            for (const item of config[key]) {
                if (item.type && types.includes(item.type)) {
                    item.commponent = getComponentbyType(item.type);
                    config.transformTypetoComponentData[key].push(item);
                    setImportByType(config, item.type);
                }
            }
        }
    }
    function getComponentbyType(type:string) {
        switch (type) {
            case 'input':
                return '<Input />';
            case 'select':
                return '<Select><Select.Option value="jack">Jack</Select.Option></Select>';
            case 'datepicker':
                return '<DatePicker />';
            default:
                break;
        }
    }
    function setImportByType(config:any, type:string) {
        if (!config.importData || !config.importData.length) {
            /**
             * @param {string} package antd
             * @param {string} text    import { Input } from 'antd'
             * @param {array} children ['Input']
            */
            config.importData = [];
        }
        let existAntd = config.importData.find((e:ImportDataType) => e.package === 'antd');
        if (!existAntd) {
            config.importData.push({ package: 'antd' });
        }
        for (const importData of config.importData) {
            if (importData.package === 'antd') {
                importData.text = '';
                if (!importData.children || !importData.children.length) {
                    importData.children = [];
                }
                setImportData(importData, type);
            }
        }

        function setImportData(importData: ImportDataType, type:string) {
            setChildrenByType(type, importData.children);
            setTextByChildren(importData);
        }
        function setChildrenByType(type: string, children:Array<string>) {
            switch (type) {
                case 'input':
                    return children.push('Input');
                case 'select':
                    return children.push('Select');
                case 'datepicker':
                    return children.push('DatePicker');
                default:
                    break;
            }
        }
        function setTextByChildren(importData:ImportDataType) {
            importData.children = Array.from(new Set(importData.children));
            importData.text = `import { ${importData.children.join(',')} } from 'antd'`;
        }
    }
}

function transformArrayItemToString(config:any={}) {
    for (const key in config) {
        if (Array.isArray(config[key])) {
            if (!config.arrayItemToStringData || typeof config.arrayItemToStringData !== 'object') {
                config.arrayItemToStringData = {};
            }
            config.arrayItemToStringData[key] = [];
            for (const item of config[key]) {
                if (typeof item !== 'string') {
                    // 去除不再tableccolumns中的数据
                    const tmpItem = Object.assign({} , item)
                    delete tmpItem.dataType;
                    config.arrayItemToStringData[key].push(JSON.stringify(tmpItem, null ,2));
                }
            }
        }
    }
}