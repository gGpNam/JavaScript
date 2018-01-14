var router = {
    currentView: {
        contentView: {
        }
    }
}

$(function() {
var FlowDiagramView =  Backbone.View.extend({
    initialize: function() {
        this.blockType = {
            Statement: "StatementBlock",
            If: "IF",
            Loop: "LOOP"
        }

        this.blockTypeDic = [{
            key: "NONE", 
            value: this.blockType.Statement
        }, {
            key: "IF",
            value: this.blockType.If
        }, {
            key: "_LOOP",
            value: this.blockType.Loop
        }, {
            key: "LOOP_FOR", 
            value: this.blockType.Loop
        }];
    },

    dicTest: function () {
        var type = _.find(router.currentView.contentView.blockTypeDic, { key: "IF" });
        console.log(type.value);
    },

    initComponents: function() {
        this.dicTest();
    },

    render: function() {
        this.initComponents();
        return this;
    }
});
    
    var FlowDiagramView = new FlowDiagramView();
    router.currentView.contentView = FlowDiagramView;

    FlowDiagramView.render();
});
