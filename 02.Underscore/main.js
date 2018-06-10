var router = {
    currentView: {
        contentView: {
        }
    }
}

$(function() {
var FlowDiagramView =  Backbone.View.extend({
    initialize: function() {
        this.FlowChartTreeData = [];
    },


    sortTetst: function(list) {

        var newList = [];

        var root_item = {
            bmid: -1,
            pbmid: -1,
            bmnm: "root",
            gryn: "Y",
            usr: null,
            edit: "Y"
        }

        newList.push(root_item);

        _.each(list, function(item) {
            item.expanded = true;
            newList.push(item);
        });

        return newList;

    },

    initComponents: function() {
        
        // $(".diagram-content-container").dxTextBox({
        //     value: "asd"
        // });

        var dummyList = [
            {
                bmid: 10000,
                pbmid: -1,
                bmnm: "parent",
                gryn: "Y",
                usr: null,
                edit: "Y"
            }, {
                bmid: 10001,
                pbmid: 10000,
                bmnm: "child",
                gryn: "Y",
                usr: null,
                edit: "Y"
            }]

        var sortedList = this.sortTetst(dummyList);
        
        console.log(sortedList.length);
    
        
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
