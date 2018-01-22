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

    main: function() {

        // var block = this.findBlock("89");
        // if(_.isUndefined(block))
        //     console.log("isUndefined");
        // else
        //     console.log("Exist");

        var block2 = this.findBlockOfNode("p259");
        if(_.isUndefined(block2)) 
            console.log("isUndefined");
        else
            console.log("Exist");

    },

    generateData: function() {  
        this.initObjectData();
        this.initBlockData();
        this.initNodeData();
    },

    initObjectData: function() {
        _.each(FC.obj, function(object) {
            var _object = {};
            _object.oid = object.oid;
            _object.poid = object.poid;
            _object.onm = object.onm;
            _object.ogid = object.ogid;
            _object.otp = object.otp;
            _object.block = [];
            router.currentView.contentView.FlowChartTreeData.push(_object);
        });
    },

    initBlockData: function() {
        _.each(FC.block, function(block) {
            var object =  _.find(router.currentView.contentView.FlowChartTreeData, { oid: block.oid} );
            if(_.isUndefined(object)) 
                return;

            var _block = {};
            _block.oid = block.oid;
            _block.bid = block.bid;
            _block.pbid = block.pbid;
            _block.btp = block.btp;
            _block.node = [];
            object.block.push(_block);
        });
    },

    initNodeData: function() {
        _.each(FC.node, function(node) {
            var block =  router.currentView.contentView.findBlock(node.bid);
            if(_.isUndefined(block)) 
                return;

            var _node = {};
            _node.bid = node.bid;
            _node.nid = node.nid;
            _node.ntp = node.ntp;
            _node.sid = node.sid;
            _node.sln = node.sln;
            _node.eln = node.eln;
            _node.edge = [];

            block.node.push(_node);
        });
    },

    printNode: function() {
        console.log("############# <START> #############");
        _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
            console.log(object.oid);
            _.each(object.block, function(block) {
                console.log(">> " + block.bid);
                _.each(block.node, function(node) {
                    console.log(">>>> " + node.nid);
                });
            });
        });
        console.log("############# <END> #############");
    },

    findBlock: function(bid) {
        var block = null;
        _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
            _.each(object.block, function(_block) {
                if(_block.bid === bid)
                    block = _block;
            })
        });
        return block;
    },

    findBlockOfNode: function(nid) {
        var block = null;
        _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
            console.log("obj " + object.oid);
            _.each(object.block, function(_block) {
                console.log(" >> bid " + _block.bid);
                _.each(_block.node, function(_node) {
                    console.log(" >> nid " + _node.nid);
                    if(_node.nid === nid) {
                        block = _block;
                    }
                });
            })
        });
        return block;
    },

    initComponents: function() {
        this.generateData();
        this.main();
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
