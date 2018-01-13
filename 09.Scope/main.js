$(function() {
var FlowDiagramView =  Backbone.View.extend({
    initialize: function() {
        var scope = 10;
    },

    initComponents: function() {
        //this.scopeTest();
        this.makeBlock();
    },

    scopeTest: function() {
        var a = 0;
        if (true) {
            var b = 0;
            for (var c = 0; c < 5; c++) {
                console.log("c=" + c);
            }
            console.log("c=" + c);
        }
        console.log("b=" + b);
    },

    makeBlock: function() {
        var blockList = [{
            bid: "1",
            bnm: "A"
        }, {
            bid: "2",
            bnm: "B"
        }];

        _.each(blockList, function(block) {
            super.makeNode();
        });
    },

    makeNode: function() {
        console.log("call makeNode function");
    },

    render: function() {
        this.initComponents();
        return this;
    }
});

    var FlowDiagramView = new FlowDiagramView();
    FlowDiagramView.render();
});
