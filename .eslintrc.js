module.exports = {
    "extends" : ["eslint:recommended"],
    "rules" : {
        //no-console是自己给规则起的名字
        "no-console": ["error",{
            //仅运行使用以下3种log
            "allow" : ["warn","info","error"]
        }]
    },
    "env": {
        //"browser" : true,  //基本环境配置
        "node": true,  //例如开启了node环境，则代码中使用window对象，编辑器会立刻报错
        "es6": true,
        "mocha": true
    }
}
