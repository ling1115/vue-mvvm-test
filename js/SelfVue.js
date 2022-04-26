/*
export default class SelfVue {
    constructor(options){
        var self = this;
        this.data = options.data;
        this.methods = options.methods;

        Object.keys(this.data).forEach(function(key) {
        // 绑定代理属性,直接通过`selfVue.xxx = 'jjj'`的形式来进行改变模板数据
            self.proxyKeys(key);
        });
        // 数据劫持 并在Watch初始化时 添加订阅者watcher到主题对象Dep
        observe(this.data);
        // 解析元素节点事件指令等 并生成对应的订阅者
        new Compile(options.el, this);
        options.mounted.call(this); // 所有事情处理好后执行mounted函数
    }
    // 实现：直接通过`selfVue.xxx = 'jjj'`的形式来进行改变模板数据
    proxyKeys (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function getter () {
                return self.data[key];
            },
            set: function setter (newVal) {
                self.data[key] = newVal;
            }
        });
    }
}
*/

function SelfVue (options) {
    var self = this;
    this.data = options.data;
    this.methods = options.methods;

    Object.keys(this.data).forEach(function(key) {
     // 绑定代理属性,直接通过`selfVue.xxx = 'jjj'`的形式来进行改变模板数据
        self.proxyKeys(key);
    });
    // 数据劫持 并在Watch初始化时 添加订阅者watcher到主题对象Dep
    observe(this.data);
    // 解析元素节点事件指令等 并生成对应的订阅者
    new Compile(options.el, this);
    options.mounted.call(this); // 所有事情处理好后执行mounted函数
}

SelfVue.prototype = {
    // selfVue.data.name => selfVue.name
    // 实现：直接通过`selfVue.xxx = 'jjj'`的形式来进行改变模板数据
    proxyKeys: function (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function getter () {
                return self.data[key];
            },
            set: function setter (newVal) {
                self.data[key] = newVal;
            }
        });
    }
}