function Compile(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el);
    this.fragment = null;
    this.init();
}

Compile.prototype = {
    init: function () {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            console.log('Dom元素不存在');
        }
    },
    // 将el中的内容全部放到内存中
    nodeToFragment: function (el) {
        var fragment = document.createDocumentFragment();
        var child = el.firstChild;
        while (child) {
            // 将Dom元素移入fragment中
            // 把真实DOM移入到内存中 fragment，因为fragment在内存中，操作比较快
            fragment.appendChild(child);
            child = el.firstChild
        }
        return fragment;
    },
    // 编译 元素节点 =》 提取想要的元素节点, 编译 元素方法`v-`指令 和文本节点
    compileElement: function (el) {
        var childNodes = el.childNodes;
        var self = this;
        [].slice.call(childNodes).forEach(function(node) {
            var reg = /\{\{(.*)\}\}/;
            var text = node.textContent;
            
            if (self.isElementNode(node)) {  // 是元素节点 编译元素方法
                self.compile(node);
            } else if (self.isTextNode(node) && reg.test(text)) { // 是文本节点 直接调用文本编译方法
                // reg.exec(text)[1]: 返回与正则表达式匹配的文本
                self.compileText(node, reg.exec(text)[1]);
            }
            // 还需要深入递归检查
            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);
            }
        });
    },
    // 编译元素方法: v-指令
    compile: function(node) {
        var nodeAttrs = node.attributes;
        var self = this;
        Array.prototype.forEach.call(nodeAttrs, function(attr) {
            var attrName = attr.name;
            // 判断属性名是否包含 `v-`指令
            if (self.isDirective(attrName)) {
                // 取到v-指令属性中的值（这个就是对应data中的key）
                var exp = attr.value;
                var dir = attrName.substring(2);
                if (self.isEventDirective(dir)) {  // v-on: 事件指令
                    self.compileEvent(node, self.vm, exp, dir);
                } else {  // `v-model` 指令
                    self.compileModel(node, self.vm, exp, dir);
                }
                node.removeAttribute(attrName);
            }
        });
    },
    // 这里需要编译文本
    compileText: function(node, exp) {
        var self = this;
        // 取文本节点中的文本
        var initText = this.vm[exp];
        this.updateText(node, initText);
        new Watcher(this.vm, exp, function (value) {
            self.updateText(node, value);
        });
    },
    // 编译事件指令
    compileEvent: function (node, vm, exp, dir) {
        var eventType = dir.split(':')[1];
        var cb = vm.methods && vm.methods[exp];
        // 挂载对应的更新函数
        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false);
            console.log('compileEvent kkk ---');
        }
    },
    // 编译v-model 指令
    compileModel: function (node, vm, exp, dir) {
        var self = this;
        var val = this.vm[exp];
        this.modelUpdater(node, val);
        new Watcher(this.vm, exp, function (value) {
            self.modelUpdater(node, value);
        });
        node.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            self.vm[exp] = newValue;
            val = newValue;
        });
    },
    // 文本赋值
    updateText: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    // 输入框value赋值
    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    },
    // 是不是指令
    isDirective: function(attr) {
        return attr.indexOf('v-') == 0;
    },
    // 判断是否为 事件指令
    isEventDirective: function(dir) {
        return dir.indexOf('on:') === 0;
    },
    // 判断是否为 元素节点
    isElementNode: function (node) {
        return node.nodeType == 1;
    },
    // 判断是否为 文本节点
    isTextNode: function(node) {
        return node.nodeType == 3;
    }
}

