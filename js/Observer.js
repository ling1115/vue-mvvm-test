/*
// 接收所有属性对象
class Observer {
    constructor(data){
        var self = this;
        this.data = data;
        this.walk.apply(this,data);
    }
    walk(data){
        var self = this;
        Object.keys(data).forEach(function(key) {
            self.defineReactive(data, key, data[key]);
        });
    }
    defineReactive(data, key, val) {
        var dep = new Dep();
        // 递归遍历所有子属性
        var childObj = observe(val);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function getter () {
                // 为了让Watcher初始化进行触发，添加订阅者watcher到主题对象Dep
                if(Dep.target) {
                    // JS的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set: function setter (newVal) {
                // 如果数据变化，就会去通知所有订阅者，订阅者们就会去执行对应的更新的函数
                if (newVal === val) {
                    return;
                }
                val = newVal;
                // 作为发布者发出通知
                dep.notify();//通知后dep会循环调用各自订阅者的update方法更新视图
            }
        });
    }
}

export default function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};
*/
/*
    需要创建一个可以容纳订阅者的消息订阅器Dep，订阅器Dep主要负责收集订阅者
    然后在属性变化的时候执行对应订阅者的更新函数。
    所以显然订阅器需要有一个容器，这个容器就是list
*/
/*
class Dep{
    constructor(){
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    notify(){
        this.subs.forEach(function(sub) {
            // 执行对应订阅者的更新函数
            sub.update();
        });
    }
}
Dep.target = null;
*/

// 接收所有属性对象
function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    walk: function(data) {
        var self = this;
        Object.keys(data).forEach(function(key) {
            self.defineReactive(data, key, data[key]);
        });
    },
    defineReactive: function(data, key, val) {
        var dep = new Dep();
        // 递归遍历所有子属性
        var childObj = observe(val);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function getter () {
                console.log('111 ---');
                // 为了让Watcher初始化进行触发，添加订阅者watcher到主题对象Dep
                console.log(Dep)
                if(Dep.target) {
                    // JS的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
                    dep.addSub(Dep.target);
                    console.log("getter -> dep", dep)
                }
                console.log('222 ---');
                return val;
            },
            set: function setter (newVal) {
                // 如果数据变化，就会去通知所有订阅者，订阅者们就会去执行对应的更新的函数
                if (newVal === val) {
                    return;
                }
                val = newVal;
                // 作为发布者发出通知
                dep.notify();//通知后dep会循环调用各自订阅者的update方法更新视图
            }
        });
    }
};

function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};
/*
    需要创建一个可以容纳订阅者的消息订阅器Dep，订阅器Dep主要负责收集订阅者
    然后在属性变化的时候执行对应订阅者的更新函数。
    所以显然订阅器需要有一个容器，这个容器就是list
*/
function Dep () {
    this.id = Dep.uid++;
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        if(this.subs.length){
            this.subs = this.subs.filter(item=>item.id!=sub.id);
        }
        this.subs.push(sub);
    },
    removeSub(sub) {
        const subIdx = this.subs.indexOf(sub);
        this.subs.splice(subIdx, 1);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            // 执行对应订阅者的更新函数
            sub.update();
        });
    }
};
Dep.uid = 0;
Dep.target = null;