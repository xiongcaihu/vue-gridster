var vm = new Vue({
    el: "#app",
    data: {
        items: []
    },
    beforeMount: function() {
        //请求items数据
        this.items = [{
            id: "hehe",
            class: "hi",
            style: {
                width: 1,
                height: 1,
                x: 1,
                y: 1
            },
            html: `<div></div>`
        }, {
            id: "hehe",
            class: "hi",
            style: {
                width: 1,
                height: 1,
                x: 2,
                y: 1
            },
            html: `<div></div>`
        }]
    },
    components: {
        vueGridster: {
            template: `<div class="container">
                <div :class="['item',item.class]" v-for="item in items" :style="{
                    width:(item.style.width*minWidth)+'px',
                    height:(item.style.height*minHeight)+'px',
                    left:(calcPosition(item.style.x,'x'))+'px',
                    top:(calcPosition(item.style.y,'y'))+'px'}" :id="item.id" :ref="item.id" @click="changePosition($event,item)">
                </div>
            <div>`,
            props: ["items", "minWidth", "minHeight", "minMarginleft", "minMargintop"],
            watch: {
                items: function(newVal, oldVal) {
                    console.log("change");
                }
            },
            methods: {
                /**
                 * 根据ｘ，ｙ计算位置px
                 * @param  {[type]} value [x or y ]
                 * @param  {[type]} type  ["x" or "y"]
                 * @return {[type]}       [position (px)]
                 */
                calcPosition: function(value, type) {
                    if (type == undefined) {
                        console.error("calcposition error: type is undefined");
                        return;
                    }
                    var vm = this;
                    var minWidth = vm.minWidth;
                    var minHeight = vm.minHeight;
                    var minMarginleft = vm.minMarginleft;
                    var minMargintop = vm.minMargintop;

                    if (type == "x") {
                        return (value - 1) * minWidth + (value) * minMarginleft;
                    } else {
                        return (value - 1) * minHeight + (value) * minMargintop;
                    }
                },
                changePosition: function(e, item) {
                    changePositionAnimate(e.target, item, this, {
                        y: 2,
                    }).then(function() {

                    });
                },
                buildAllItems: function() {
                    var self = this;
                    self.items.forEach(function(item, index) {
                        var target = self.$refs[item.id][0];
                        target.innerHTML = item.html;
                    });
                },
                addItem: function(item, index) {
                    if (index == undefined) {
                        index = this.items.length;
                    }
                    index = index == 0 ? 0 : index;
                    var self = this;
                    item.id = item.id || ("item" + index);
                    self.items.splice(index, 0, item);
                    self.$nextTick(function() {
                        var target = self.$refs[item.id][0];
                        target.innerHTML = item.html;
                    });
                }
            },
            beforeMount: function() {
                this.minWidth = this.minWidth || 100;
                this.minHeight = this.minHeight || 50;
                this.minMarginleft = this.minMarginleft || 10;
                this.minMargintop = this.minMargintop || 10;
            },
            mounted: function() {
                console.dir(this);
                this.items.forEach(function(item, index) {
                    item.id = item.id || ("item" + index);
                });

                this.$nextTick(function() {
                    this.buildAllItems();
                });
            },
            beforeUpdate: function() {
                console.dir("beforeUpdate");
            },
            updated: function() {
                console.dir("updated");
            }
        }
    },
    mounted: function() {

    }
});
vm.$nextTick(function() {

})

function makeChart(id) {
    $('#' + id).highcharts({
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ]
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    });
}


function changePositionAnimate(obj, item, vm, destination) {
    var defer = $.Deferred();
    var minWidth = vm.minWidth;
    var minHeight = vm.minHeight;
    var minMarginleft = vm.minMarginleft;
    var minMargintop = vm.minMargintop;

    if (obj.id == item.id) {
        var parent = $(obj);
    } else {
        var parent = $(obj).parents("div[id='" + item.id + "']");
    }

    destination.x = destination.x || item.style.x || 1;
    destination.y = destination.y || item.style.y || 1;

    //计算在画布中的准确位置
    var left = destination.x == undefined ? parent.position().left + "px" : vm.calcPosition(destination.x, "x");
    var top = destination.y == undefined ? parent.position().top + "px" : vm.calcPosition(destination.y, "y");

    var minTime = 50; //最小时间单位为100ms移动一个单位
    var step = 1;
    var time = Math.max(destination.x, destination.y) / step * minTime;

    parent.animate({
        left: left,
        top: top
    }, time, function() {
        item.style.x = destination.x;
        item.style.y = destination.y;
        defer.resolve();
    });

    return defer.promise();
}