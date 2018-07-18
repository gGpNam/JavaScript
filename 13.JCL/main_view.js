var router = {
    currentView: {
        contentView: {
        }
    }
};


// branch 에서 수정

$(function() {
var MainView =  Backbone.View.extend({
    initialize: function() {
        this.template = _.template($("#backbone-templates-flow-diagram").html());
        this.TraceStackItems = []; // 트리로 가공한 데이터
        this.FCBlockData = [];
        this.FlowChartData = [];
        this.FlowLinkData = [];

        this.blockType = {
            None: "",
            Statement: "StatementBlock",
        };
        this.nodeType = {
            Start: "Start",
            End: "End",
            StartJoint: "StartJoint",
            EndJoint: "EndJoint",
            Statement: "Statement",
        };

        this.ExecPgmType = {
            None: "None",                               // default
            IBMDataSetUtiltity: "IBMDataSetUtiltity",   // GoFigure.Process, _back.Size = this.ExecSize;
            IBMRelatedCobol: "IBMRelatedCobol",         // GoFigure.Subroutine,  _back.Size = this.ExecSize; this._Background.PenColor = Color.Brown;
            Sort: "Sort",                               // GoFigure.Sort,  _back.Size = this.SortSize;
            CobolProgram: "CobolProgram",               // GoFigure.Process, this.ExecSize;
            Empty: "Empty"                              // this.ExecSize;
        };
        this.DataSourceType = {
            Unknown: "",
            STREAM: "STREAM",
            DSN: "DSN",
            INSTREAM: "INSTREAM"
        };
    },

    destroy: function() {
        this.diagram.div = null;
        this.$el.remove();
    },

    properties: {
        highlightMemoNodeColor: "MediumBlue",
        defaultJointColor: "#000000",
        defaultFont: "9pt arial, meiryo, 'nanum gothic'",
        collapseFont: "Bold 12pt arial, meiryo, 'nanum gothic'",
        diagramPaddingTop: 70
    },

    loggingMap: function(evt) {
        if (evt.propertyName === "StartedTransaction"
            || evt.propertyName === "CommittedTransaction"
            || evt.propertyName === "RolledBackTransaction"
            || evt.propertyName === "StartingUndo"
            || evt.propertyName === "FinishedUndo"
            || evt.propertyName === "StartingRedo"
            || evt.propertyName === "FinishedRedo")
         console.log(evt.propertyName + (_.isEmpty(evt.Qs) || _.isEmpty(evt.Qs.name) ? "" : " - " + evt.Qs.name) + (_.isEmpty(evt.Ss) ? "" : " - " + evt.Ss));
    },

    nodeStype: function() {
        return [
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                {
                    locationSpot: go.Spot.Center,
                }];
    },

    layoutStyle: function() {
        return this.$go(go.LayeredDigraphLayout, {
            direction: 90,
            layerSpacing: 10,
            columnSpacing: 10,
            setsPortSpots: false,
            isRealtime: false,
            layeringOption: go.LayeredDigraphLayout.LayerLongestPathSink,
        });
    },

    initLayout: function() {
        this.$el.find(".diagram-layout-box").dxBox({
            direction: "row",
            width: "100%"
        });
    },

    initDiagram: function() {
        var fnResizeMultipleTool = function() {
            go.ResizingTool.call(this);
            this.name = "ResizeMultiple";
        };

        //go.licenseKey = GTSaasCM.License.gojs;
        go.Diagram.inherit(fnResizeMultipleTool, go.ResizingTool);

        this.$go = go.GraphObject.make;
        var targetEl = this.$el.find(".diagram-content-container")[0];
        var panelOptions = {
                gridCellSize: new go.Size(30, 30)
            };
        var shapeOptions = {
                stroke: "gray",
                interval: 1,
                strokeWidth: 1.0,
                strokeDashArray: [1, 30]
            };
        var diagramOptions = {
                initialContentAlignment: go.Spot.Center,
                validCycle: go.Diagram.CycleNotDirected,
                "grid": this.$go(go.Panel, go.Panel.Grid, panelOptions, this.$go(go.Shape, "LineH", shapeOptions)),
                "grid.visible": true,
                "ModelChanged": function(e) {
                },
                "undoManager.isEnabled": true,
                "animationManager.isEnabled": false,
                allowCopy: false,
                allowDelete: false,
                allowRelink: false,
                padding: new go.Margin(this.properties.diagramPaddingTop, 5, 5, 5),
                layout: this.layoutStyle()
            };
        this.diagram = this.$go(go.Diagram, targetEl, diagramOptions);
        this.diagram.addModelChangedListener(this.loggingMap);
    },

    initTraceStackList: function() {
        this.$el.find(".diagram-trace-stack-list").dxDataGrid({
            dataSource: router.currentView.contentView.TraceStackItems,
            width: "100%",
            height: "100%",
            allowColumnResizing: true,
            columnResizingMode: "nextColumn",
            allowColumnReordering: true,
            showRowLines: true,
            noDataText: "",
            showColumnHeaders: false,
            keyExpr: "cmoid",
            paging: {
                enabled: false
            },
            selection: {
                mode: "single"
            },
            headerFilter: {
                visible: false
            },
            columns: [{
                dataField: "onm",
                caption: "onm",
                width: "30%",
            }],
            onContentReady: function (e) {
                e.component.option("selectedRowKeys", [ "3703000002" ]);
            },
            onSelectionChanged: function(e) {
                router.currentView.contentView.diagram.clear();
                router.currentView.contentView.diagram.model.clear()
                router.currentView.contentView.FlowChartData = [];
                router.currentView.contentView.FlowLinkData = [];

                // GOTO: makeBlock 호출
                router.currentView.contentView.makeBlock(e.selectedRowsData[0].oid);
                router.currentView.contentView.initModel();
                router.currentView.contentView.diagram.model.addNodeDataCollection(router.currentView.contentView.FlowChartData);
                //router.currentView.contentView.diagram.model.addLinkDataCollection(router.currentView.contentView.FlowLinkData);
            }
        });
    },

    initObjectList: function(objList) {
        this.$el.find(".diagram-object-list").dxTreeList({
            dataSource: OBJ_LIST,
            width: "100%",
            height: "100%",
            keyExpr: "oid",
            rootValue: "3703",
            parentIdExpr: "poid",
            showColumnLines: true,
            dataStructure: "plain",
            autoExpandAll: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            noDataText: "no_data",
            selection: {
                mode: "single"
            },
            scrolling: {
                mode: "virtual",
                useNative: false ? true : "auto"
            },
            columns: [{
                dataField: "onm",
                caption: "onm",
            }],
            expandedRowKeys: [1],
        });
    },

    getTree: function(array, parent, tree ) {
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
                child.name = child.btp;
                child.node = [];
                child.edge = [];
                router.currentView.contentView.getTree( array, child ) 
            });
        }
        return tree;
    },

    initObjectData: function(response) {
        var fcObjectList = [];
        
        _.each(response.obj, function(object) {
            if(object.poid === "-1" )
                return;

            if(!_.findWhere(response.block, {'oid' : object.oid }))
                return;

            var _object = {};
            _object.oid = object.oid;
            _object.poid = object.poid;
            _object.onm = object.onm;
            _object.ogid = object.ogid;
            _object.otp = object.otp;
            _object.cmoid = object.cmoid;
            _object.block = {};
            fcObjectList.push(_object);

            router.currentView.contentView.TraceStackItems = _.sortBy(fcObjectList,  function(obj) {
                return parseInt(obj.oid);
            });
        });
    },

    // GOTO: initBlockData 블럭 정보 생성
    initBlockData: function(blockList) {
        var blockTree = this.getTree(blockList);

        _.each(blockTree, function(tree) {
            var sortedChildren = _.sortBy(tree.children, function(block) { return parseInt(block.bid)})
            tree.children = sortedChildren;
        });

        _.each(router.currentView.contentView.TraceStackItems, function(object){
            object.block = _.find(blockTree, { oid: object.oid });
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

    initNodeData: function(nodeList) {
        _.each(router.currentView.contentView.TraceStackItems, function(object) {
            router.currentView.contentView.fillNode(object.block, nodeList);
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
                node.txt = text[0].txt;
        });

        _.each(block.children, function(_block){
            router.currentView.contentView.fillText(_block, textList);
        });
    },

    initTextData: function(textList) {
        _.each(router.currentView.contentView.TraceStackItems, function(object) {
            router.currentView.contentView.fillText(object.block, textList);
        });
    },

    fillEdge: function(block, edgeList, nodeList) {
        if(_.isUndefined(block))
            return;

        _.each(block.node, function(node) {
            var edges = _.filter(edgeList, function(edge){ return edge.fnid === node.nid; });
            var nodeType = node.ntp;

            if(edges.length === 0 )
                return;

            _.each(edges, function(_edge) {
                var edge = {};
                var fromBlock = _.find(nodeList, {nid : _edge.fnid });
                var toBlock = _.find(nodeList, {nid : _edge.tnid });

                edge.fnid = _edge.fnid;
                edge.fntp = nodeType;
                edge.fbid = fromBlock.bid;
                edge.tnid = _edge.tnid;
                edge.tbid = toBlock.bid;
                edge.etp = _edge.etp;
                edge.visible = true;
                block.edge.push(edge);
            })
        });

        _.each(block.children, function(_block){
            router.currentView.contentView.fillEdge(_block, edgeList, nodeList);
        });
    },

    initLinkData: function(edgeList, nodeList) {
        _.each(router.currentView.contentView.TraceStackItems, function(object) {
            router.currentView.contentView.fillEdge(object.block, edgeList, nodeList);
        });
    },

    generateData: function(response) {
        this.initObjectData(response);
        this.initBlockData(response.block);
        this.initNodeData(response.node);
        this.initTextData(response.text);
        this.initLinkData(response.edge, response.node);
    },

    // GOTO: makeStepData 스탭 테이터 생성
    makeStepData: function(response) {
        var orgRootBlock = _.find(this.TraceStackItems, function(object) { return object.block.pbid == "-1" }).block;
        
        var rootFCBlock = [];  // FCJCLJobData;
        rootFCBlock.id = orgRootBlock.bid;
        rootFCBlock.pbid = orgRootBlock.pbid;
        rootFCBlock.btp = orgRootBlock.ptp;
        rootFCBlock.child = [];


        _.each(orgRootBlock.children, function(childBlock) {

            if(childBlock.btp.indexOf("LOOP_EXEC") > -1) {
                var stepData = [];  //  FCJCLStepData
                stepData.bid = childBlock.sln;
                stepData.eln = childBlock.sln;
                stepData.execPgmNm = "????";

                // rootFCBlock  push 
                
            } else if (childBlock.btp.indexOf("StatementBlock") > -1) {

                var orgJobNode = null;

                _.each(childBlock.child, function(item) {


                    console.log(item);

                    if(item.btp.indexOf("JOB[")) {
                        orgJobNode = item;
                        return;
                    }
                });

                if(_.isNull(orgJobNode)) {
                    return;
                }
            }

            // TODO: SORT
        });
        

        // FCBlockData 에 트리로 된 데이터를 채워야 한다....

    },

    initNode: function() {
        this.generateData(DATA);
        this.makeStepData(DATA);
        this.initTraceStackList();
        this.initObjectList();
        this.initModel();

        // GTSaasCM.Utils.Ajax.getInstance().getFDNodes(this.pid, this.sid, function(response) {
        //     router.currentView.contentView.generateData(response);
        //     router.currentView.contentView.initObjectList();
        //     router.currentView.contentView.initModel();
        // }, null);
    },

    initModel: function() {
        var graphLinkModelOptions = {
            nodeKeyProperty: "cid",
        };

        this.diagram.model = this.$go(go.GraphLinksModel, graphLinkModelOptions);
    },

    initContextMenu: function() {
    
    },

    findObject: function(objectId) {
        return _.find(router.currentView.contentView.TraceStackItems, { oid: objectId } );
    },

    getBlockType: function(blockTypeName) {
        if(_.contains(router.currentView.contentView.blockType, blockTypeName)) {
            return _.find(router.currentView.contentView.blockType, function(name) { return name === blockTypeName });
        } else {
            return router.currentView.contentView.blockType.Statement;
        }
    },

    getNodeType: function(nodeType) {
        switch(nodeType) {
            case "_START": 
                return router.currentView.contentView.nodeType.StartJoint;
            case "_END":
                return router.currentView.contentView.nodeType.EndJoint;
            case "STBLOCK_START":
                return router.currentView.contentView.nodeType.StartJoint;
            case "STBLOCK_END":
                return router.currentView.contentView.nodeType.EndJoint;
        }
    },

    addNodeCell: function (node) {
        var nodeCell = {};
        nodeCell.cid = node.nid;
        nodeCell.isGroup = false;
        nodeCell.group = node.bid;
        nodeCell.category = router.currentView.contentView.getNodeType(node.ntp);
        nodeCell.name = node.onm;
        nodeCell.sln = node.sln;

        router.currentView.contentView.FlowChartData.push(nodeCell);
    },

    // GOTO: makeBlock 블럭 생성
    makeBlock: function(objectId) {
        var object =  this.findObject(objectId);
        router.currentView.contentView.objectType = object.otp;

        if(_.isUndefined(object) ||  _.isUndefined(object.block))
            return;

        //this.makeStartNode();
        //this.makeEndNode();
        //this.makeStartLink(object.block.bid);
        //this.makeEndLink(object.block.bid);

        var rootCell = {};
        rootCell.cid = object.block.bid;
        rootCell.isGroup = true,
        rootCell.group = object.block.pbid;
        rootCell.name = object.block.btp;
        //rootCell.type = router.currentView.contentView.getBlockType(object.block.btp);
        rootCell.isSubGraphExpanded = true;
        rootCell.category = "";
        router.currentView.contentView.FlowChartData.push(rootCell);

        _.each(object.block.node, function(node) {
            var type = router.currentView.contentView.getNodeType(node.ntp);
            if(type === router.currentView.contentView.nodeType.StartJoint ||
               type === router.currentView.contentView.nodeType.EndJoint) {
                return;
            } else {
                router.currentView.contentView.addNodeCell(node);
            }
        });

        // _.each(object.block.edge, function(edge) {
        //     router.currentView.contentView.addEdgeCell(edge);
        // });

        _.each(object.block.children, function(block) {
            router.currentView.contentView.makeSubBlock(block);
        });
    },

    makeSubBlock: function(subBlock) {
        var type = router.currentView.contentView.getBlockType(subBlock.btp);
        if(type === router.currentView.contentView.blockType.Statement) {
            this.makeStateMentBlock(subBlock);
        }
    },

    makeStateMentBlock: function(block) {
        router.currentView.contentView.addBlockCell(block);

        _.each(block.node, function(node) {
            var nodeType = router.currentView.contentView.getNodeType(node.ntp); 
            if(nodeType === router.currentView.contentView.nodeType.StartJoint ||
               nodeType === router.currentView.contentView.nodeType.EndJoint)
               return;
            router.currentView.contentView.addNodeCell(node);
        });

        _.each(block.children, function(childBlock) {
            router.currentView.contentView.makeSubBlock(childBlock);
        });

        //router.currentView.contentView.makeStatementLink(block);
    },

    addBlockCell: function(block) {
        var blockCell = {};
        blockCell.cid = block.bid;
        blockCell.isGroup = true,
        blockCell.group = block.pbid;
        blockCell.name = block.name;
        blockCell.isSubGraphExpanded = false;
        blockCell.type = router.currentView.contentView.getBlockType(block.btp);
        //this.setCategory(blockCell);
        router.currentView.contentView.FlowChartData.push(blockCell);
    },

    
    // #endregion

    // #region initTemplate

    initNodeTemplate: function() {
        var stateBlockTemplate = this.$go(go.Node, "Auto",
                                    
                                    this.nodeStype(),
                                    this.$go(go.Shape, "RoundedRectangle", 
                                            {
                                                //fill: "transparent",
                                                fill: "transparent",
                                                minSize: new go.Size(150, 20)
                                            }),
                                    this.$go(go.TextBlock,
                                            {
                                                margin: 5,
                                                stroke: "black",
                                                isMultiline: true,
                                                maxSize: new go.Size(200, 100),
                                            },
                                            new go.Binding("text", "name"))
                                    );
        var templmap = new go.Map("string", go.Node);
        templmap.add("", stateBlockTemplate);
        this.diagram.nodeTemplateMap = templmap;
        //this.diagram.nodeTemplate = startNodeTemplate;
    },
    initLinkTemplate: function() {
    },
    initMemoTemplate: function() {
    },

    initGroupTemplate: function() {
        var defaultGroupTemplate = this.$go(go.Group, "Auto",
                                    {
                                        layout: this.layoutStyle(),
                                        contextClick: function(e, node) {
                                        },
                                        contextMenu: this.$go(go.Adornment)
                                    },
                                    this.$go(go.Shape, "RoundedRectangle",
                                                { parameter1: 10, fill: "rgba(128,128,128,0.13)" }),
                                    this.$go(go.Panel, "Vertical",  { defaultAlignment: go.Spot.Left },
                                                this.$go(go.Panel, "Horizontal",
                                                        { defaultAlignment: go.Spot.Top  },
                                                        this.$go(go.TextBlock, 
                                                                { 
                                                                    font: this.properties.defaultFont,
                                                                    wrap: go.TextBlock.WrapFit,
                                                                    visible: false,
                                                                },
                                                                new go.Binding("text", "cid"))),
                                            this.$go(go.Placeholder,
                                                        { padding: new go.Margin(0, 10), alignment: go.Spot.Center })));


        var groupTemplateMap = new go.Map("string", go.Group);
        groupTemplateMap.add(this.DataSourceType.Unknown, defaultGroupTemplate);

        this.diagram.groupTemplateMap = groupTemplateMap;
    },

    initTemplate: function() {
        this.initNodeTemplate();
        //this.initLinkTemplate();
        //this.initMemoTemplate();
        this.initGroupTemplate();
    },

    // #endregion

    initComponents: function() {
        this.initLayout();
        this.initDiagram();
        //this.initLar();
        //this.initOverview();
        //this.initTools();
        this.initTemplate();
        this.initNode();

        //this.initContextMenu();

        // $(".btn-line").dxButton({
        //     text: "LINE",
        //     onClick: function(e) {
        //         //router.currentView.contentView.scrollToLine(100);
        //         //window.open("http://google.com", "newWindow", "width=300, height=300, toolbar=yes");
        //         //window.open("http://google.com", "_top", "toolbar=yes, menubar=yes, status=yes");
        //         window.open("", "newWin", "width=300, height=300");
        //         window.location.href = "http://google.com";
        //     }
        // });

        var targetHeight = parseInt(($("html").outerHeight() * 0.8), 10);

        if (GTSaasCM.Constant.Diagram.minHeight < targetHeight) {
            this.$el.find(".diagram-content-container").css("min-height", targetHeight);
        } else {
            this.$el.find(".diagram-content-container").css("min-height", GTSaasCM.Constant.Diagram.minHeight);
        }
    },

    render: function() {
        this.$el.html(this.template);
        this.initComponents();
        return this;
    }
});

var MainView = new MainView();
router.currentView.contentView = MainView;
$("#content").append(MainView.render().el);
});
