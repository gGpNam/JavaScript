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

        // var block2 = this.findBlockOfNode("p259");
        // if(_.isUndefined(block2)) 
        //     console.log("isUndefined");
        // else
        //     console.log("Exist");

        this.findBlockOfNode("p15");
    },

    generateData: function(response) {  
    	this.initObjectData(response.obj);
        this.initBlockData(response.block);
        this.initNodeData(response.node);
        this.initTextData(response.text);
        this.initLinkData(response.edge);
    },

    initObjectData: function(objectList) {
        _.each(objectList, function(object) {

            if(object.poid === "-1" )
                return;

            var _object = {};
            _object.oid = object.oid;
            _object.poid = object.poid;
            _object.onm = object.onm;
            _object.ogid = object.ogid;
            _object.otp = object.otp;
            _object.block = {};
            router.currentView.contentView.FlowChartTreeData.push(_object);
        });
    },

    initBlockData: function(blockList) {
        var blockTree = this.getTree(blockList);
        _.each(router.currentView.contentView.FlowChartTreeData, function(object){
            object.block = _.find(blockTree, { oid: object.oid });
        });
    },

    getTree: function( array, parent, tree ) {
        tree = typeof tree !== 'undefined' ? tree : [];
        parent = typeof parent !== 'undefined' ? parent : { bid: "-1" };
    
        var children = _.filter( array, function(child){ return child.pbid == parent.bid; });
    
        if( !_.isEmpty( children )  ){
            if( parent.bid === "-1" ){
               tree = children;
            } else {
               parent['children'] = children;
            }
            _.each( children, function( child ){
                child.node = [];
                child.edge = [];
                router.currentView.contentView.getTree( array, child ) 
            });
        }

        return tree;
    },

    initNodeData: function(nodeList) {
         _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
            router.currentView.contentView.fillNode(object.block, nodeList);
        });
    },

    fillNode: function(block, nodeList) {
        
        if(_.isUndefined(block))
            return;
            
        var nodes = _.filter( nodeList, function(node){ return node.bid == block.bid; });

        _.each(nodes, function(node) {

            block.node.push(node);
        });

        _.each(block.children, function(_block){
            router.currentView.contentView.fillNode(_block, nodeList);
        });
    },

    // BOOKMARK INIT > initTextData
    initTextData: function(textList) {
        _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
            router.currentView.contentView.fillText(object.block, textList);
        });
    },

    fillText: function(block, textList) {
        if(_.isUndefined(block))
            return;

        _.each(block.node, function(node) {
            var text = _.filter(textList, function(text){ return text.nid === node.nid; });
            if(text.length === 0 ) 
                return;
            else 
                node.text = text[0];
        });

        _.each(block.children, function(_block){
            router.currentView.contentView.fillText(_block, textList);
        });
    },

    // BOOKMARK INIT > initLinkData
    initLinkData: function(edgeList) {
        _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
            router.currentView.contentView.fillEdge(object.block, edgeList);
        });
    },

    fillEdge: function(block, edgeList) {
        if(_.isUndefined(block))
            return;

        _.each(block.node, function(node) {
            var edges = _.filter(edgeList, function(edge){ return edge.fnid === node.nid; });
            var nodeType = node.ntp;

            if(edges.length === 0 ) 
                return;

            _.each(edges, function(_edge) {
                var edge = {};
                var fromBlock = router.currentView.contentView.findBlockOfNode(node.nid);
                var toBlock = router.currentView.contentView.findBlockOfNode(node.nid);

                edge.fnid = _edge.fnid;
                edge.fntp = nodeType;
                if(!_.isUndefined(fromBlock)) {
                    edge.fbid = fromBlock.bid;
                }

                edge.tnid = _edge.tnid;
                if(!_.isUndefined(toBlock)) {
                    edge.tbid = toBlock.bid;
                }
                
                edge.etp = _edge.etp;
                edge.visible = true;
                block.edge.push(edge);
            })
        });

        _.each(block.children, function(_block){
            router.currentView.contentView.fillEdge(_block, edgeList);
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

    // findBlock: function(bid) {
    //     var block = null;
    //     _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
    //         _.each(object.block, function(_block) {
    //             if(_block.bid === bid)
    //                 block = _block;
    //         })
    //     });
    //     return block;
    // },

    findBlockOfNode: function(nid) {
        _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
            if(_.isUndefined(object.block))
                return;

            var block = router.currentView.contentView.findBlock(object.block, nid);
            if(!_.isUndefined(block))
                return block;
        });
    },

    findBlock: function(block, nid) {
        var findNode = _.find(block.node, { nid: nid});
        
        if(!_.isUndefined(findNode))
            return block;

        if(_.isUndefined(block.children))
            return;

        for(var i=0; block.children.length > i; i++){
            var child = block.children[i];

            findNode = router.currentView.contentView.findBlock(child, nid);
            if(!_.isUndefined(findNode))
                return findNode;
        }
    },

    // findBlockOfNode: function(nid) {
    //     var block = null;
    //     _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
    //         console.log("obj " + object.oid);
    //         _.each(object.block, function(_block) {
    //             console.log(" >> bid " + _block.bid);
    //             _.each(_block.node, function(_node) {
    //                 console.log(" >> nid " + _node.nid);
    //                 if(_node.nid === nid) {
    //                     block = _block;
    //                 }
    //             });
    //         })
    //     });
    //     return block;
    // },

    initComponents: function() {
        this.generateData(FC);
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
