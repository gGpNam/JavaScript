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
        this.FlowChartData = [];
        this.FlowLinkData = [];

        this.blockType = {
            None: "",
            Statement: "StatementBlock",
            If: "IF",
            LoopWhile: "LOOP_while",
            LoopFor: "LOOP_for",
            LoopDo: "LOOP_do",
            TryCatchFinally: "TryCatchFinally",
            Try: "TryBlock",
            CatchList: "CatchList",
            CatchBlock: "CatchBlock",
            Finally: "FinalBlock"
        };

        this.nodeType = {
                Start: "Start",
                End: "End",
                Statement: "Statement",
                If: "If_Condition",
                Loop: "Loop_Condition",
                StartJoint: "StartJoint",
                EndJoint: "EndJoint",
                Switch: "Switch",
                Return: "Return",
                Goto: "Goto",
                Continue: "Continue",
                Break: "Break",
        };

        this.spotType = {
            Top: "Top",
            Buttom: "None",
            Left: "Left",
            Right: "Right"
        };
    },

    properties: {
        // highlightMemoNodeColor : "MediumBlue",
        // aggregationArrowHead: "StretchedDiamond",
        // associationArrowHead: "",
        // compositionArrowHead: "StretchedDiamond",
        // dependencyArrowHead: "OpenTriangle",
        // directedAssociationArrowHead: "OpenTriangle",
        // generalizationArrowHead: "Triangle",
        // realizationArrowHead: "Triangle",
        // defaultArrowHeadColor: "white",
        // linkColor: "DarkRed",
        // nodeColor: "DarkRed",
        // nodeWidth: 140,
        // nodeMinWidth: 80,
        // nodesWidthSpacing : 10,
        // nodesHeightSpacing : 30,
        defaultJointColor: "#FFFFFF",
        defaultFont: "9pt Helvetica, Arial, sans-serif",
        diagramPaddingTop: 70
    },

    loggingMap: function(evt) {
        // if (evt.propertyName === "StartedTransaction"
        //     || evt.propertyName === "CommittedTransaction"
        //     || evt.propertyName === "RolledBackTransaction"
        //     || evt.propertyName === "StartingUndo"
        //     || evt.propertyName === "FinishedUndo"
        //     || evt.propertyName === "StartingRedo"
        //     || evt.propertyName === "FinishedRedo")
        //  console.log(evt.propertyName + (_.isEmpty(evt.Qs) || _.isEmpty(evt.Qs.name) ? "" : " - " + evt.Qs.name) + (_.isEmpty(evt.Ss) ? "" : " - " + evt.Ss));
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
            columnSpacing: 6,
            setsPortSpots: false,
            isRealtime: false,
            //arrangement:  go.TreeLayout.ArrangementHorizontal
            layeringOption: go.LayeredDigraphLayout.LayerLongestPathSink,
            //layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource,
            //layeringOption: go.LayeredDigraphLayout.LayerOptimalLinkLength,
            //initializeOption = go.LayeredDigraphLayout.InitDepthFirstOut,
            //initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn,
            //initializeOption = go.LayeredDigraphLayout.InitNaive,
            //aggressiveOption = go.LayeredDigraphLayout.AggressiveLess,
            //aggressiveOption = go.LayeredDigraphLayout.AggressiveNone,
            //aggressiveOption = go.LayeredDigraphLayout.AggressiveMore
            //packOption : 10
        });
    },

    // layoutStyle: function() {
    //     return this.$go(go.ParallelLayout, {
    //         layerSpacing: 20,
    //         nodeSpacing: 10,
    //     });
    // },

    initDiagram: function() {
        this.$go = go.GraphObject.make;
        var targetEl = $(".flow-diagram-content-container")[0];
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
                //resizingTool: new fnResizeMultipleTool(),
                layout: this.layoutStyle()
            };
        this.diagram = this.$go(go.Diagram, targetEl, diagramOptions);
        this.diagram.addModelChangedListener(this.loggingMap);
    },

    initLayer: function() {
        var foreLayer = this.diagram.findLayer("Foreground");

        this.diagram.addLayerBefore(this.$go(go.Layer, { name: "GroupLayer" }), foreLayer);
        this.diagram.addLayerBefore(this.$go(go.Layer, { name: "LinkLayer" }), foreLayer);
        this.diagram.addLayerBefore(this.$go(go.Layer, { name: "NodeLayer" }), foreLayer);
        this.diagram.addLayerBefore(this.$go(go.Layer, { name: "MemoLayer" }), foreLayer);
    },

    initOverview: function() {
        var targetEl = this.$el.find(".diagram-overview-content")[0];
        var overview = this.$go(go.Overview, targetEl, { observed: this.diagram, contentAlignment: go.Spot.Center });
        overview.box.elt(0).stroke = "cadetblue";
        overview.box.elt(0).strokeWidth = 0.5;
        overview.drawsTemporaryLayers = false;

        targetEl = this.$el.find(".diagram-overview-title");
        targetEl.text($.t("label:overview"));
        targetEl = this.$el.find(".diagram-overview-container");
        targetEl.draggable({
            containment: this.$el.find(".diagram-content-container")
        });
        targetEl = this.$el.find(".diagram-overview-closebtn");
        targetEl.bind('click', this.toggleShowOverview);

        if (!GTSaasCM.Constant.Diagram.Default.isShowOverview) {
            this.toggleShowOverview();
        }
    },

    // BOOKMARK: TEMPLATE > initNodeTemplate
    initNodeTemplate: function() {
        var startNodeTemplate = this.$go(go.Node, "Spot",
                                         this.nodeStype(),
                                         this.$go(go.Panel, "Auto",
                                                  this.$go(go.Shape, "RoundedRectangle",
                                                           {
                                                               minSize: new go.Size(100, 40),
                                                               fill: "#79C900",
                                                               stroke: null 
                                                            }),
                                                  this.$go(go.TextBlock, "Start",
                                                           {
                                                               font: this.properties.defaultFont,
                                                               stroke: "whitesmoke"
                                                           }))
                                         );

        var endNodeTemplate = this.$go(go.Node, "Spot",
                                       this.nodeStype(),
                                       this.$go(go.Panel, "Auto",
                                                this.$go(go.Shape, "RoundedRectangle",
                                                         {
                                                             minSize: new go.Size(100, 40),
                                                             fill: "#DC3C00",
                                                             stroke: null 
                                                         }),
                                               this.$go(go.TextBlock, "End",
                                                        {
                                                            font: this.properties.defaultFont,
                                                            stroke: "whitesmoke"
                                                        })));

        var stateBlockTemplate = this.$go(go.Node, "Auto",
                                          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                                          this.$go(go.Shape, "RoundedRectangle", 
                                                   {
                                                       fill: "gold",
                                                       minSize: new go.Size(150, 20)
                                                    }),
                                          this.$go(go.TextBlock,
                                                   {
                                                       font: this.properties.defaultFont,
                                                       margin: 5,
                                                       stroke: "black"
                                                   },
                                                   new go.Binding("text", "cid")));

        var ifNodeTemplate = this.$go(go.Node, "Auto",
                                         this.nodeStype(),
                                         this.$go(go.Panel, "Auto",
                                                  this.$go(go.Shape, "Diamond",
                                                           {
                                                               minSize: new go.Size(100, 40),
                                                               fill: "#79C900",
                                                               stroke: null 
                                                            }),
                                                  this.$go(go.TextBlock, "IF",
                                                           {
                                                               font: this.properties.defaultFont,
                                                               stroke: "whitesmoke"
                                                           })));

        var loopNodeTemplate = this.$go(go.Node, "Auto",
                                         this.nodeStype(),
                                         this.$go(go.Panel, "Auto",
                                                  this.$go(go.Shape, "Diamond",
                                                           {
                                                               minSize: new go.Size(100, 40),
                                                               fill: "#79C900",
                                                               stroke: null 
                                                            }),
                                                  this.$go(go.TextBlock, "",
                                                           {
                                                               font: this.properties.defaultFont,
                                                               stroke: "whitesmoke"
                                                           },
                                                           new go.Binding("text", "name"))));

        // var startJointNodeTemplate = this.$go(go.Node, "Spot",
        //                                       this.nodeStype(),
        //                                       this.$go(go.Shape, "Ellipse",
        //                                                {
        //                                                    minSize: new go.Size(10, 10),
        //                                                    maxSize: new go.Size(10, 10),
        //                                                    fill: this.properties.defaultJointColor,
        //                                                    stroke: null 
        //                                                 }));

        // var endJointNodeTemplate = this.$go(go.Node, "Spot",
        //                                     this.nodeStype(),
        //                                     this.$go(go.Shape, "Ellipse",
        //                                              {
        //                                                  minSize: new go.Size(10, 10),
        //                                                  maxSize: new go.Size(10, 10),
        //                                                  fill: "red",
        //                                                  stroke: null
        //                                              }));

        var startJointNodeTemplate = this.$go(go.Node, "Spot",
                                              this.nodeStype(),
                                              this.$go(go.TextBlock, { stroke: "red" },
                                                       new go.Binding("text", "cid"),
                                                       new go.Binding("visible", "visible")));

        var endJointNodeTemplate = this.$go(go.Node, "Spot",
                                       this.nodeStype(),
                                       this.$go(go.TextBlock, { stroke: "white" },
                                                       new go.Binding("text", "cid"),
                                                       new go.Binding("visible", "visible"))); 

        var templmap = new go.Map("string", go.Node);

        // TODO: this.NodeType 의 타입만큼 템플릿을 작성해야 함.
        templmap.add(this.nodeType.Start, startNodeTemplate);
        templmap.add(this.nodeType.End, endNodeTemplate);
        templmap.add(this.nodeType.Statement, stateBlockTemplate);
        templmap.add(this.nodeType.If, ifNodeTemplate);
        templmap.add(this.nodeType.Loop, loopNodeTemplate);
        templmap.add(this.nodeType.StartJoint, startJointNodeTemplate);
        templmap.add(this.nodeType.EndJoint, endJointNodeTemplate);
        templmap.add("", this.diagram.nodeTemplate);

        this.diagram.nodeTemplateMap = templmap;
        this.diagram.nodeTemplate = startNodeTemplate;
    },

    // BOOKMARK: TEMPLATE > initLinkTemplate
    initLinkTemplate: function() {
        var defaultLinkTemplate = this.$go(go.Link,
                                           {
                                               routing: go.Link.AvoidsNodes,
                                               curve: go.Link.JumpGap ,
                                               corner: 5, toShortLength: 4,
                                               relinkableFrom: false,
                                               relinkableTo: false,
                                               reshapable: false,
                                               resegmentable: false,
                                           },
                                           new go.Binding("points").makeTwoWay(),
                                           new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
                                           new go.Binding("toSpot", "toSpot", go.Spot.parse),
                                           this.$go(go.Shape,  // the highlight shape, normally transparent
                                                    { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
                                           this.$go(go.Shape,  // the link path shape
                                                    { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
                                           this.$go(go.Shape,  // the arrowhead
                                                    { toArrow: "standard", stroke: null, fill: "gray"}),
                                           this.$go(go.Panel, "Auto",  // the link label, normally not visible
                                                    { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                                                    new go.Binding("visible", "visible").makeTwoWay(),
                                                    this.$go(go.Shape, "RoundedRectangle",  // the label shape
                                                             { fill: "#C6C6C6", stroke: null }),
                                                    this.$go(go.TextBlock,  // the label
                                                             {
                                                                 textAlign: "center",
                                                                 font: "10pt helvetica, arial, sans-serif",
                                                                 stroke: "#333333",
                                                                 editable: true
                                                              },
                                                    new go.Binding("text", "text"))));
        var linkTemplateMap = new go.Map("string", go.Link);
        linkTemplateMap.add("", defaultLinkTemplate);
        this.diagram.linkTemplateMap = linkTemplateMap;
    },
    
    initMemoTemplate: function() {
    },
    
    // BOOKMARK: TEMPLATE > initGroupTemplate
    initGroupTemplate: function() {
        var groupSelectionAdornmentTemplate = this.$go(go.Adornment,
                "Spot",
                this.$go(go.Panel,
                         "Auto",
                         this.$go(go.Shape, { fill: null, stroke: "lightsteelblue", strokeWidth: 1.5 }),
                         this.$go(go.Placeholder)));

        var defaultGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.layoutStyle(),
                                                isSubGraphExpanded: true,
                                                subGraphExpandedChanged: this.subGraphExpandedChanged
                                            },
                                            this.$go(go.Shape, "RoundedRectangle",  // surrounds everything
                                                        { parameter1: 10, fill: "rgba(128,128,128,0.33)" }),
                                            this.$go(go.Panel, "Vertical",  { defaultAlignment: go.Spot.Left },
                                                    this.$go(go.Panel, "Horizontal", // the header
                                                                { defaultAlignment: go.Spot.Top  },
                                                                this.$go("SubGraphExpanderButton"),  // this Panel acts as a Button
                                                                this.$go(go.TextBlock, 
                                                                         { 
                                                                             font: "Bold 10pt Sans-Serif",
                                                                             wrap: go.TextBlock.WrapFit,
                                                                             visible: true,
                                                                         },
                                                                         new go.Binding("text", "cid")
                                                                    )
                                                                ),
                                                    this.$go(go.Placeholder,
                                                                { padding: new go.Margin(0, 10), alignment: go.Spot.Center })));
                                                        
        var collapseGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.layoutStyle(),
                                                isSubGraphExpanded: false,
                                                subGraphExpandedChanged: this.subGraphExpandedChanged
                                            },
                                            this.$go(go.Shape, "MultiProcess",
                                                        { width: 150, height: 50, parameter1: 5, fill: "rgba(128,128,128,0.33)" }),
                                            this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                                        this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top },
                                                                this.$go("SubGraphExpanderButton"), 
                                                                this.$go(go.TextBlock, 
                                                                        { font: "Bold 12pt Sans-Serif", text: "Statement", verticalAlignment: go.Spot.Center,
                                                                        alignment: go.Spot.Center })
                                                                )));

        var ifCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                {
                                    layout: this.$go(go.TreeLayout, { angle: 90 }),
                                                        isSubGraphExpanded: false,
                                                        subGraphExpandedChanged: this.subGraphExpandedChanged
                                },
                                this.$go(go.Shape, "Decision", 
                                            { width: 150, height: 50, parameter1: 5, fill: "#79C900" }),
                                this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                            this.$go(go.Panel, "Horizontal",
                                                    { defaultAlignment: go.Spot.Top },
                                                    this.$go("SubGraphExpanderButton"),  
                                                    this.$go(go.TextBlock, 
                                                            { font: "Bold 12pt Sans-Serif", text: "If", verticalAlignment: go.Spot.Center,
                                                            alignment: go.Spot.Center })
                                                    )));

        var loopWhileCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                {
                                    layout: this.$go(go.TreeLayout, { angle: 90 }),
                                                        isSubGraphExpanded: false,
                                                        subGraphExpandedChanged: this.subGraphExpandedChanged
                                },
                                this.$go(go.Shape, "LoopLimit", 
                                            { width: 150, height: 50, parameter1: 5, fill: "#79C900" }),
                                this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                            this.$go(go.Panel, "Horizontal",
                                                    { defaultAlignment: go.Spot.Top },
                                                    this.$go("SubGraphExpanderButton"),  
                                                    this.$go(go.TextBlock, 
                                                            { font: "Bold 12pt Sans-Serif", text: "Loop", verticalAlignment: go.Spot.Center,
                                                            alignment: go.Spot.Center })
                                                    )));

        var loopDoCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                {
                                    layout: this.$go(go.TreeLayout, { angle: 90 }),
                                                        isSubGraphExpanded: false,
                                                        subGraphExpandedChanged: this.subGraphExpandedChanged
                                },
                                this.$go(go.Shape, "LoopLimit", 
                                            { width: 150, height: 50, parameter1: 5, fill: "#79C900" }),
                                this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                            this.$go(go.Panel, "Horizontal",
                                                    { defaultAlignment: go.Spot.Top },
                                                    this.$go("SubGraphExpanderButton"),  
                                                    this.$go(go.TextBlock, 
                                                            { font: "Bold 12pt Sans-Serif", text: "LoopDo", verticalAlignment: go.Spot.Center,
                                                            alignment: go.Spot.Center })
                                                    )));


        var tryCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.$go(go.TreeLayout, { angle: 90 }),
                                                                    isSubGraphExpanded: false,
                                                                    subGraphExpandedChanged: this.subGraphExpandedChanged
                                            },
                                            this.$go(go.Shape, "Rectangle",
                                                        { width: 150, height: 50, parameter1: 5, fill: "rgba(128,128,128,0.33)" }),
                                            this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                                        this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top },
                                                                this.$go("SubGraphExpanderButton"), 
                                                                this.$go(go.TextBlock, 
                                                                        { font: "Bold 12pt Sans-Serif", text: "Try", verticalAlignment: go.Spot.Center,
                                                                        alignment: go.Spot.Center })
                                                                )));

        var catchListCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.$go(go.TreeLayout, { angle: 90 }),
                                                                    isSubGraphExpanded: false,
                                                                    subGraphExpandedChanged: this.subGraphExpandedChanged
                                            },
                                            this.$go(go.Shape, "MultiProcess",
                                                        { width: 150, height: 50, parameter1: 5, fill: "rgba(128,128,128,0.33)" }),
                                            this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                                        this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top },
                                                                this.$go("SubGraphExpanderButton"), 
                                                                this.$go(go.TextBlock, 
                                                                        { font: "Bold 12pt Sans-Serif", text: "CatchList", verticalAlignment: go.Spot.Center,
                                                                        alignment: go.Spot.Center })
                                                                )));

        var finallyCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.$go(go.TreeLayout, { angle: 90 }),
                                                                    isSubGraphExpanded: false,
                                                                    subGraphExpandedChanged: this.subGraphExpandedChanged
                                            },
                                            this.$go(go.Shape, "Rectangle",
                                                        { width: 150, height: 50, parameter1: 5, fill: "rgba(128,128,128,0.33)" }),
                                            this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                                        this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top },
                                                                this.$go("SubGraphExpanderButton"), 
                                                                this.$go(go.TextBlock, 
                                                                        { font: "Bold 12pt Sans-Serif", text: "Finally", verticalAlignment: go.Spot.Center,
                                                                        alignment: go.Spot.Center })
                                                                )));



        var groupTemplateMap = new go.Map("string", go.Group);
        //TODO: 블럭 템플릿 추가 작성
        groupTemplateMap.add(this.blockType.None, defaultGroupTemplate);
        groupTemplateMap.add(this.blockType.Statement, collapseGroupTemplate);
        groupTemplateMap.add(this.blockType.If, ifCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.LoopWhile, loopWhileCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.LoopDo, loopDoCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.Try, tryCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.CatchList, catchListCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.Finally, finallyCollapseGroupTemplate);

        this.diagram.groupTemplateMap = groupTemplateMap;
    },

    // BOOKMARK: FUNC > subGraphExpandedChanged
    subGraphExpandedChanged: function(group) {
        if (group.isSubGraphExpanded === false) {
            switch(group.data.type) {
                case router.currentView.contentView.blockType.Statement:
                    group.category = router.currentView.contentView.blockType.Statement;
                    break;
                case router.currentView.contentView.blockType.If:
                    group.category = router.currentView.contentView.blockType.If;
                    break;
                case router.currentView.contentView.blockType.LoopWhile:
                case router.currentView.contentView.blockType.LoopFor:
                    group.category = router.currentView.contentView.blockType.LoopWhile;
                    break;
                case router.currentView.contentView.blockType.LoopDo:
                    group.category = router.currentView.contentView.blockType.LoopDo;
                    break;
                case router.currentView.contentView.blockType.TryCatchFinally:
                    group.category = router.currentView.contentView.blockType.LoopDo;
                    break;
                case router.currentView.contentView.blockType.Try:
                    group.category = router.currentView.contentView.blockType.Try;
                    break;
                case router.currentView.contentView.blockType.CatchList:
                    group.category = router.currentView.contentView.blockType.CatchList;
                    break;
                case router.currentView.contentView.blockType.Final:
                    group.category = router.currentView.contentView.blockType.Final;
                    break;
                default:
                    return router.currentView.contentView.nodeType.Statement;
                    break;
            }
        }
        else {
            group.category = router.currentView.contentView.blockType.None;
        }
    },

    makeStartNode: function() {
        var startCell = {};
        startCell.cid = this.nodeType.Start;
        startCell.isGroup = false,
        startCell.name = this.nodeType.Start;
        startCell.category = this.nodeType.Start;
        router.currentView.contentView.FlowChartData.push(startCell);
    },

    makeEndNode: function() {
        var endCell = {};
        endCell.cid = this.nodeType.End;
        endCell.isGroup = false,
        endCell.name = this.nodeType.End;
        endCell.category = this.nodeType.End;
        router.currentView.contentView.FlowChartData.push(endCell);
    },

    generateData : function(response) {
    	this.initObjectData(response.obj);
        this.initBlockData(response.block);
        this.initNodeData(response.node);
        this.initTextData(response.text);
        this.initLinkData(response.edge);
    },

    clearData: function() {
        this.diagram.clear();
        router.currentView.contentView.FlowChartData = [];
        router.currentView.contentView.FlowLinkData = [];
    },

    // #region data generate
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
            if(edges.length === 0 ) 
                return;

            _.each(edges, function(_edge) {
                block.edge.push(_edge);
            })
            
        });

        _.each(block.children, function(_block){
            router.currentView.contentView.fillEdge(_block, edgeList);
        });
    },

    // #endregion

    // #region function

    getBlockType: function(blockTypeName) {
        if(_.contains(router.currentView.contentView.blockType, blockTypeName)) {
            return _.find(router.currentView.contentView.blockType, function(name) { return name === blockTypeName });
        } else {
            return router.currentView.contentView.blockType.Statement;
        }
    },

    // BOOKMARK TYPE > getNodeType
    getNodeType: function(nodeType) {
        switch(nodeType) {
            case "_START": 
                return router.currentView.contentView.nodeType.StartJoint;
            case "_END":
                return router.currentView.contentView.nodeType.EndJoint;

            case "IF_START":
                return router.currentView.contentView.nodeType.If;
            case "IF_END":
                return router.currentView.contentView.nodeType.EndJoint;
                
            case "STBLOCK_START":
                return router.currentView.contentView.nodeType.StartJoint;
            case "STBLOCK_END":
                return router.currentView.contentView.nodeType.EndJoint;

            case "LOOP_while_START":
                return router.currentView.contentView.nodeType.StartJoint;
            case "LOOP_while_END":
                return router.currentView.contentView.nodeType.EndJoint;
            
            case "LOOP_do_START":
                return router.currentView.contentView.nodeType.StartJoint;
            case "LOOP_do_END":
                return router.currentView.contentView.nodeType.EndJoint;

            case "LOOP_for_START":
                return router.currentView.contentView.nodeType.StartJoint;
            case "LOOP_for_END":
                return router.currentView.contentView.nodeType.EndJoint;

            case "SWITCH_START":
                return router.currentView.contentView.nodeType.Switch;
            case "SWITCH_END":
                return router.currentView.contentView.nodeType.EndJoint;

            case "TRYCATCHFINALLY_START":
                return router.currentView.contentView.nodeType.StartJoint;
            case "TRYCATCHFINALLY_END":
                return router.currentView.contentView.nodeType.EndJoint;

            case "CATCHLIST_START":
                return router.currentView.contentView.nodeType.StartJoint;
            case "CATCHLIST_END":
                return router.currentView.contentView.nodeType.EndJoint;

            case "CATCH": 
                return router.currentView.contentView.nodeType.EndJoint;

            case "RETURN":
                return router.currentView.contentView.nodeType.Return;
            case "GOTO":
                return router.currentView.contentView.nodeType.Goto;
            case "CONTINUE":
                return router.currentView.contentView.nodeType.Continue;
            case "BREAK":
                return router.currentView.contentView.nodeType.Break;
            case "NONE":
                return router.currentView.contentView.nodeType.Statement;
            default:
                return router.currentView.contentView.nodeType.Statement;
        }
    },

    findObject: function(objectId) {
        return _.find(router.currentView.contentView.FlowChartTreeData, { oid: objectId } );
    },
    
    // #endregion

    // BOOKMARK: MAKE > makeBlock
    makeBlock: function(objectId) {
        router.currentView.contentView.clearData();
        var object =  this.findObject(objectId);
    
        if(_.isUndefined(object))
            return;

        this.makeStartNode();
        this.makeEndNode();
        this.makeStartLink(object.block.bid);
        this.makeEndLink(object.block.bid);

        var rootCell = {};
        rootCell.cid = object.block.bid;
        rootCell.isGroup = true,
        rootCell.group = object.block.pbid;
        rootCell.name = object.block.btp;
        rootCell.type = router.currentView.contentView.getBlockType(object.block.btp);
        rootCell.group = "";
        router.currentView.contentView.FlowChartData.push(rootCell);

        _.each(object.block.children, function(block) {
            // var groupCell = {};

            // groupCell.cid = block.bid;
            // groupCell.isGroup = true,
            // groupCell.group = block.pbid;
            // groupCell.name = block.btp;
            // groupCell.type = router.currentView.contentView.getBlockType(block.btp);
            // groupCell.category = router.currentView.contentView.blockType.None;
//            router.currentView.contentView.FlowChartData.push(groupCell);
            router.currentView.contentView.makeSubBlock(block);
            //router.currentView.contentView.makeSubLink(block);
        });

        router.currentView.contentView.diagram.model.addNodeDataCollection(router.currentView.contentView.FlowChartData);
        router.currentView.contentView.diagram.model.addLinkDataCollection(router.currentView.contentView.FlowLinkData);

    },

    // BOOKMARK: MAKE > makeSubBlock
    makeSubBlock: function(subBlock) {
        var type = router.currentView.contentView.getBlockType(subBlock.btp);
        if(type === router.currentView.contentView.blockType.Statement) {
            this.makeStateMentBlock(subBlock);
        } else if(type === router.currentView.contentView.blockType.If) {
            this.makeIfElseBlock(subBlock);
        } else if(type === router.currentView.contentView.blockType.LoopWhile) {
            this.makeLoopWhileBlock(subBlock);
        } else if(type === router.currentView.contentView.blockType.LoopFor) {
            this.makeLoopWhileBlock(subBlock);
        } else if(type === router.currentView.contentView.blockType.LoopDo) {
            this.makeLoopDoBlock(subBlock);
        } else if(type ===  router.currentView.contentView.blockType.TryCatchFinally) {
            this.makeTryCatchFinalBlock(subBlock);
        } else if(type ===  router.currentView.contentView.blockType.Try) {
            this.makeTryBlock(subBlock);
        } else if(type ===  router.currentView.contentView.blockType.CatchList) {
            this.makeCatchBlockList(subBlock);
        } else if(type ===  router.currentView.contentView.blockType.CatchBlock) {
            this.makeCatchBlock(subBlock);
        }
    },

    makeSubLink: function(subBlock) {
        var block = subBlock;
        _.each(subBlock.node, function(node) {
            var type = router.currentView.contentView.getNodeType(node.ntp);
            if(type === router.currentView.contentView.nodeType.EndJoint) {
                var edge = _.find(block.edge, { fnid : node.nid });
                router.currentView.contentView.addEdgeCell(edge);
            }
        });
    },

    // DUPLICATE
    // makeLink: function(objectId) {
    //     _.each(FC.edge, function(edge) {
    //         var link = {};
    //         var nodeCell = router.currentView.contentView.findNodeCell(edge.fnid);
    //         if(_.isUndefined(nodeCell)) 
    //             return;

    //         //if(nodeCell.category === router.currentView.contentView.nodeType.StartJoint)
    //         //    return;

    //         link.from = edge.fnid;
    //         link.to = edge.tnid;
    //         link.fromSpot = router.currentView.contentView.spotType.Buttom;
    //         link.toSpot = router.currentView.contentView.spotType.Top;
            
    //         router.currentView.contentView.FlowLinkData.push(link);
    //     });
    // },

    addBlockCell: function(block) {
        var blockCell = {};
        blockCell.cid = block.bid;
        blockCell.isGroup = true,
        blockCell.group = block.pbid;
        blockCell.name = block.btp;
        blockCell.type = router.currentView.contentView.getBlockType(block.btp);

        if(blockCell.type ===  router.currentView.contentView.blockType.CatchBlock) {
            blockCell.category = router.currentView.contentView.blockType.CatchBlock;
        } else {
            blockCell.category = router.currentView.contentView.blockType.None;
        }

        router.currentView.contentView.FlowChartData.push(blockCell);
    },

    addNodeCell: function (node) {
        var nodeCell = {};
        nodeCell.cid = node.nid;
        nodeCell.isGroup = false;
        nodeCell.group = node.bid;
        nodeCell.category = router.currentView.contentView.getNodeType(node.ntp);
        nodeCell.name = node.ntp;

        router.currentView.contentView.FlowChartData.push(nodeCell);
    },

    // BOOKMARK: ADD > addEdgeCell
    addEdgeCell: function(edge) {
        if(_.isUndefined(edge))
            return;

        if(_.contains(router.currentView.contentView.FlowLinkData, {fnid: edge.fnid, tnid: edge.tnid }))
            return;

        var link = {};
        link.from = edge.fnid;
        link.to = edge.tnid;
        link.fromSpot = router.currentView.contentView.spotType.Buttom;
        link.toSpot = router.currentView.contentView.spotType.Top;
        router.currentView.contentView.FlowLinkData.push(link);
    },

    // #region makeStateMent 
    // BOOKMARK: MAKE > makeStateMentBlock
    makeStateMentBlock: function(block) {

        router.currentView.contentView.addBlockCell(block);

        _.each(block.node, function(node) {
            router.currentView.contentView.addNodeCell(node);
        });

        router.currentView.contentView.makeStatementLink(block);
    },

    // BOOKMARK: MAKE > makeStatementLink
    makeStatementLink: function(block) {

        var nodeList = [];

        _.each(block.node, function(node) {
            nodeList.push(node.nid);
        });

        _.each(block.edge, function(edge) {
            router.currentView.contentView.addEdgeCell(edge);

            // if( _.contains(nodeList, edge.tnid)) {
            //     router.currentView.contentView.addEdgeCell(edge);
            // }
        });

        //  _.each(block.edge, function(edge) {
        //     router.currentView.contentView.addEdgeCell(edge);
        // });
    },

    // #endregion

    // #region IfElse 
    // BOOKMARK: MAKE > makeIfElseBlock
    makeIfElseBlock: function(block) {
        var conditionNode = null;
        var endIfNode = null;
        var thenBlock = null;
        var elseBlock = null;

        router.currentView.contentView.addBlockCell(block);

        _.each(block.node, function(node) {
            var nodeType = router.currentView.contentView.getNodeType(node.ntp);
            if(nodeType === router.currentView.contentView.nodeType.If) {
                conditionNode = node;
            } else if(nodeType === router.currentView.contentView.nodeType.EndJoint) {
                endIfNode = node;
            }

            router.currentView.contentView.addNodeCell(node);
        });
        
        _.each(block.children, function(childBlock) {
            router.currentView.contentView.makeSubBlock(childBlock);
        });

        router.currentView.contentView.makeIfElseLink(block);
    },

    makeIfElseLink: function(block) {

        _.each(block.edge, function(edge) {
            router.currentView.contentView.addEdgeCell(edge);
        });

        // var nodeList = [];

        // _.each(block.node, function(node) {
        //     nodeList.push(node.nid);
        // });

        // _.each(block.edge, function(edge) {
        //     if( _.contains(nodeList, edge.tnid)) {
        //         router.currentView.contentView.addEdgeCell(edge);
        //     }
        // });
    },

    // #endregion

    // #region Loop
    // BOOKMARK: MAKE > makeLoopWhileBlock
    makeLoopWhileBlock: function(block) {
        var resultBlock = null;
        var startLoop = null;
        var endLoop = null;
        var loopCondition = router.currentView.contentView.makeLoopConditionNode(block);

        router.currentView.contentView.addBlockCell(block);
        
        _.each(block.node, function(node) {
            var nodeType = router.currentView.contentView.getNodeType(node.ntp);
            if(nodeType === router.currentView.contentView.nodeType.StartJoint) {
                startLoop = node;
            } else if(nodeType === router.currentView.contentView.nodeType.EndJoint) {
                endLoop = node;
            }

            router.currentView.contentView.addNodeCell(node);
        });

        _.each(block.children, function(childBlock) {
            resultBlock = childBlock;
            router.currentView.contentView.makeSubBlock(childBlock);
        });

        var startLink = {};
        startLink.from = startLoop.nid;
        startLink.to = loopCondition.cid;
        startLink.fromSpot = router.currentView.contentView.spotType.Buttom;
        startLink.toSpot = router.currentView.contentView.spotType.Top;
        router.currentView.contentView.FlowLinkData.push(startLink);

        var ifLink = {};
        ifLink.from = loopCondition.cid;
        ifLink.to = resultBlock.bid;
        ifLink.fromSpot = router.currentView.contentView.spotType.Buttom;
        ifLink.toSpot = router.currentView.contentView.spotType.Top;
        ifLink.text = "Y";
        ifLink.visible = true;
        router.currentView.contentView.FlowLinkData.push(ifLink);

        var elseLink = {};
        elseLink.from = loopCondition.cid;
        elseLink.to = endLoop.nid;
        elseLink.fromSpot = router.currentView.contentView.spotType.Right;
        elseLink.toSpot = router.currentView.contentView.spotType.Right;
        elseLink.text = "N";
        elseLink.visible = true;
        router.currentView.contentView.FlowLinkData.push(elseLink);

        var loopLink = {};
        loopLink.from = resultBlock.bid;
        loopLink.to = loopCondition.cid;
        loopLink.fromSpot = router.currentView.contentView.spotType.Left;
        loopLink.toSpot = router.currentView.contentView.spotType.Left; 
        router.currentView.contentView.FlowLinkData.push(loopLink);

        var endLink = {};
        endLink.from = resultBlock.bid;
        endLink.to = endLoop.nid;
        endLink.fromSpot = router.currentView.contentView.spotType.Buttom;
        endLink.toSpot = router.currentView.contentView.spotType.Top; 
        endLink.visible = false;
        router.currentView.contentView.FlowLinkData.push(endLink);

        router.currentView.contentView.makeLoopWhileLink(block);
    },

    makeLoopWhileLink: function(block) {
        _.each(block.edge, function(edge) {
            router.currentView.contentView.addEdgeCell(edge);
        });
    },

    // BOOKMARK: MAKE > makeLoopDoBlock
    makeLoopDoBlock: function(block) {
        var resultBlock = null;
        var startLoop = null;
        var endLoop = null;
        var loopCondition = router.currentView.contentView.makeLoopConditionNode(block);

        router.currentView.contentView.addBlockCell(block);
        
        _.each(block.node, function(node) {
            var nodeType = router.currentView.contentView.getNodeType(node.ntp);
            if(nodeType === router.currentView.contentView.nodeType.StartJoint) {
                startLoop = node;
            } else if(nodeType === router.currentView.contentView.nodeType.EndJoint) {
                endLoop = node;
            }

            router.currentView.contentView.addNodeCell(node);
        });

        _.each(block.children, function(childBlock) {
            resultBlock = childBlock;
            router.currentView.contentView.makeSubBlock(childBlock);

        });

        var startLink = {};
        startLink.from = startLoop.nid;
        startLink.to = resultBlock.bid;
        startLink.fromSpot = router.currentView.contentView.spotType.Buttom;
        startLink.toSpot = router.currentView.contentView.spotType.Top;
        router.currentView.contentView.FlowLinkData.push(startLink);

        var loopLink = {};
        loopLink.from = resultBlock.bid;
        loopLink.to = loopCondition.cid;
        loopLink.fromSpot = router.currentView.contentView.spotType.Buttom;
        loopLink.toSpot = router.currentView.contentView.spotType.Top;
        router.currentView.contentView.FlowLinkData.push(loopLink);

        var elseLink = {};
        elseLink.from = loopCondition.cid;
        elseLink.to = endLoop.nid;
        elseLink.fromSpot = router.currentView.contentView.spotType.Buttom;
        elseLink.toSpot = router.currentView.contentView.spotType.Top;
        elseLink.text = "N";
        elseLink.visible = true;
        router.currentView.contentView.FlowLinkData.push(elseLink);
        
        var ifLink = {};
        ifLink.from = loopCondition.cid;
        ifLink.to = startLoop.nid;
        ifLink.fromSpot = router.currentView.contentView.spotType.Right;
        ifLink.toSpot = router.currentView.contentView.spotType.Right;
        ifLink.text = "Y";
        ifLink.visible = true;
        router.currentView.contentView.FlowLinkData.push(ifLink);

        router.currentView.contentView.makeLoopDoLink(block);
    },

    makeLoopDoLink: function(block) {
        _.each(block.edge, function(edge) {
            router.currentView.contentView.addEdgeCell(edge);
        });
    },

    makeLoopConditionNode: function(block) {
        var nodeCell = {};
        nodeCell.cid = "p" + block.bid + "LOOP_condition";
        nodeCell.isGroup = false;
        nodeCell.group = block.bid;
        nodeCell.category = router.currentView.contentView.nodeType.Loop;
        nodeCell.name = " i > 10";
        router.currentView.contentView.FlowChartData.push(nodeCell);
        return nodeCell;
    },
    // #endregion

    // #region makeTryCatchFinalBlock 
    // BOOKMARK: MAKE > makeTryCatchFinalBlock
    makeTryCatchFinalBlock: function(block) {
        var startJoint = null;
        var trycatchfinallyStart = null;
        var trycatchfinallyEnd = null;
        var tryBlock = null;
        var catchBlockList = null;

        router.currentView.contentView.addBlockCell(block);

        _.each(block.children, function(childBlock) {
            var type = router.currentView.contentView.getBlockType(childBlock.btp);

            if(type === router.currentView.contentView.blockType.Try) {
                tryBlock = childBlock;
                router.currentView.contentView.makeSubBlock(childBlock);
            } else if(type === router.currentView.contentView.blockType.CatchList) {
                catchBlockList = childBlock;
                router.currentView.contentView.makeSubBlock(childBlock);
            }
        });

        _.each(block.node, function(node) {
            var nodeType = router.currentView.contentView.getNodeType(node.ntp);
            if(nodeType === router.currentView.contentView.nodeType.StartJoint) {
                trycatchfinallyStart = node;
            } else if(nodeType === router.currentView.contentView.nodeType.EndJoint) {
                trycatchfinallyEnd = node;
            }

            router.currentView.contentView.addNodeCell(node);
        });

        // topology
        // CatchOnlyLayout
        // FinallyLayout
        
        var start_link = {};
        start_link.from = trycatchfinallyStart.nid;
        start_link.to = tryBlock.bid;
        start_link.fromSpot = router.currentView.contentView.spotType.Buttom;
        start_link.toSpot = router.currentView.contentView.spotType.Top;
        router.currentView.contentView.FlowLinkData.push(start_link);

        var try_catch_link = {};
        try_catch_link.from = tryBlock.bid;
        try_catch_link.to = catchBlockList.bid;
        try_catch_link.fromSpot = router.currentView.contentView.spotType.Right;
        try_catch_link.toSpot = router.currentView.contentView.spotType.Top;
        try_catch_link.text = "Exception";
        try_catch_link.visible = true;
        router.currentView.contentView.FlowLinkData.push(try_catch_link);

        var try_e_link = {};
        try_e_link.from = tryBlock.bid;
        try_e_link.to = trycatchfinallyEnd.nid;
        try_e_link.fromSpot = router.currentView.contentView.spotType.Buttom;
        try_e_link.toSpot = router.currentView.contentView.spotType.Top;
        try_e_link.text = "No Exception";
        try_e_link.visible = true;
        router.currentView.contentView.FlowLinkData.push(try_e_link);
    },

    // BOOKMARK: MAKE > makeTryBlock
    makeTryBlock: function(block) {
        var tryStart = null;
        var tryEnd = null;

        router.currentView.contentView.addBlockCell(block);

        _.each(block.node, function(node) {
            var nodeType = router.currentView.contentView.getNodeType(node.nty);
            if(nodeType === router.currentView.contentView.nodeType.StartJoint) {
                tryStart = node;
            } else if(nodeType === router.currentView.contentView.nodeType.EndJoint) {
                tryEnd = node;
            }

            router.currentView.contentView.addNodeCell(node);
        });

        this.makeTryLink(block);
    },

    makeTryLink: function(block) {
        _.each(block.edge, function(edge) {
            router.currentView.contentView.addEdgeCell(edge);
        });
    },

    // BOOKMARK MAKE > makeCatchBlockList
    makeCatchBlockList: function(block) {
        router.currentView.contentView.addBlockCell(block);
        _.each(block.children, function(block) {
            router.currentView.contentView.makeSubBlock(block);
        });

        _.each(block.node, function(node) {
            router.currentView.contentView.addNodeCell(node);
        });
        
        this.makeCatchLinkLink(block);
    },

    makeCatchLinkLink: function (block) {
        _.each(block.edge, function(edge) {
            router.currentView.contentView.addEdgeCell(edge);
        });
    },

    // BOOKMARK MAKE > makeCatchBlock
    makeCatchBlock: function(block) {

        router.currentView.contentView.addBlockCell(block);

        _.each(block.children, function(block) {
            router.currentView.contentView.makeSubBlock(block);
        });

        _.each(block.node, function(node) {
            router.currentView.contentView.addNodeCell(node);
        });

        this.makeCatchLink(block);
    },

    makeCatchLink: function (block) {
        _.each(block.edge, function(edge) {
            router.currentView.contentView.addEdgeCell(edge);
        });
    },

    // #endregion

    findNodeCell: function(cellId) {
        return _.find(router.currentView.contentView.FlowChartData, { cid: cellId });
    },

    makeStartLink: function(rootBlockBid) {
        var link = {};

        link.from = this.nodeType.Start;
        link.to = rootBlockBid;
        link.fromSpot = this.spotType.Buttom;
        link.toSpot = this.spotType.Top;

        router.currentView.contentView.FlowLinkData.push(link);
    },

    makeEndLink: function(rootBlockBid) {
        var link = {};

        link.from = rootBlockBid;
        link.to = this.nodeType.End;
        link.fromSpot = this.spotType.Buttom;
        link.toSpot = this.spotType.Top;

        router.currentView.contentView.FlowLinkData.push(link);
    },


    initNode: function() {
        router.currentView.contentView.generateData(FC);
        router.currentView.contentView.initObjectList(FC.obj);
        
        // 6: if
        // 2: try
        // 5: loop
        //this.makeBlock("6");
        //this.makeLink(object_id);

        router.currentView.contentView.initModel();
    
        // router.currentView.contentView.nodeInfos = response;
        // router.currentView.contentView.visitLinks(null, router.currentView.contentView.oid);
        // router.currentView.contentView.setGroupNodeInfos();
        //router.currentView.contentView.diagram.model.addNodeDataCollection(router.currentView.contentView.FlowChartData);
        //router.currentView.contentView.diagram.model.addLinkDataCollection(router.currentView.contentView.FlowLinkData);
        // router.currentView.contentView.diagram.scroll('pixel', 'up', router.currentView.contentView.properties.diagramPaddingTop);
    },

    initModel: function() {
        // this.diagram.commandHandler.archetypeGroupData = {
        //     nid: "Group",
        //     nnm: "Group",
        //     isGroup: true,
        //     category: "group"
        // };

        var graphLinkModelOptions = {
            nodeKeyProperty: "cid",
            //nodeParentKeyProperty: "pcid"
            //nid: "Group",
            //nnm: "Group",
            //isGroup: true,
            //category: "state",
            //linkFromPortIdProperty: "fnid",
            //linkToPortIdProperty: "tnid"
        };

        this.diagram.model = this.$go(go.GraphLinksModel, graphLinkModelOptions);
    },

    initObjectList: function(objList) {

        var traceItemList = _.filter(objList, function(trace) {
            return trace.cmoid.length > 0
        });

        $(".object-menu-list-container").dxDataGrid({
            dataSource: traceItemList,
            sorting: { mode: "none" },
            showColumnLines: false,
            showRowLines: false,
            showColumnHeaders: false,
            selection: {
                mode: "single"
            },
            columns: [{
                caption: "object",
                dataField: 'onm',
                width: "100%"
            }],
            onContentReady: function(e) {
                e.component.selectRowsByIndexes([0]);
            },
            onSelectionChanged: function(e) {
                var data = e.component.getSelectedRowsData();
                if(!_.isEmpty(data) && data.length > 0) {
                    router.currentView.contentView.makeBlock(data[0].oid);
                }
            },
        });
    },

    initTemplate: function() {
        this.initNodeTemplate();
        this.initLinkTemplate();
        this.initMemoTemplate();
        this.initGroupTemplate();
    },

    initComponents: function() {
        this.initDiagram();
        this.initLayer();
        //this.initOverview();
        this.initTemplate();
        this.initNode();
        //this.initContextMenu();

        $(".diagram-toolbar").dxToolbar({
            items: [{
                location: 'after',
                widget: 'dxButton',
                options: {
                    icon: 'chevronprev',
                    onClick: function(e) {
                        Backbone.history.history.back();
                    }
                }
            }],
            width: "100%",
        });
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
