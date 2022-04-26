/*
export default class Watcher {
    constructor(vm, exp, cb){
        this.cb = cb;
        this.vm = vm;
        this.exp = exp; // 匹配的文本(属性)
        this.value = this.get().bind(this);  // 将自己添加到订阅器的操作
    }
    update() {
        this.run();
    }
    run() {
        var value = this.vm.data[this.exp];
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    }
    get() {
        Dep.target = this;  // 缓存自己
        var value = this.vm.data[this.exp]  // 强制执行监听器里的get函数
        Dep.target = null;  // 释放自己
        return value;
    }
}
*/
function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp; // 匹配的文本(属性)节点key
    this.value = this.get();  // 将自己添加到订阅器的操作
}

Watcher.prototype = {
    update: function() {
        this.run();
    },
    run: function() {
        var value = this.vm.data[this.exp];
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },
    get: function() {
        // Compile 中 compileTex时 将订阅者 Watcher 添加到到主题对象 Dep
        Dep.target = this;  // 缓存自己
        var value = this.vm.data[this.exp]  // 强制执行监听器里的get函数
        Dep.target = null;  // 释放自己

        return value;
    }
};