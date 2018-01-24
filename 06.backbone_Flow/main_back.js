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
            CatchBlock: "CatchBlock"
        };

        // 
        this.nodeType = {
                Start: "Start",
                End: "End",
                Statement: "Statement",
                If: "If_Condition",
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
            Buttom: "Buttom",
            Left: "Left",
            Right: "Right"
        };
    },

    properties: {
        highlightMemoNodeColor : "MediumBlue",
        aggregationArrowHead: "StretchedDiamond",
        associationArrowHead: "",
        compositionArrowHead: "StretchedDiamond",
        dependencyArrowHead: "OpenTriangle",
        directedAssociationArrowHead: "OpenTriangle",
        generalizationArrowHead: "Triangle",
        realizationArrowHead: "Triangle",
        defaultArrowHeadColor: "white",
        linkColor: "DarkRed",
        nodeColor: "DarkRed",
        nodeWidth: 140,
        nodeMinWidth: 80,
        nodesWidthSpacing : 10,
        nodesHeightSpacing : 30,
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
    
    makePort: function(name, spot, output, input) {
        // the port is basically just a small circle that has a white stroke when it is made visible
        return this.$go(go.Shape, "Circle",
                 {
                    fill: "Black",  //transparent/ declare whether
                    stroke: null,  // this is changed to "white" in the showPorts function
                    desiredSize: new go.Size(8, 8),
                    alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                    portId: name,  // declare this object to be a "port"
                    fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                    fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                    cursor: "pointer"  // show a different cursor to indicate potential link point
                 });
    },

    initDiagram: function() {
        this.$go = go.GraphObject.make;
        var targetEl = $(".diagram-content-container")[0];
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
                layout: this.$go(go.LayeredDigraphLayout, {
                    direction: 90,
                    layerSpacing: 10,
                    columnSpacing: 6,
                    setsPortSpots: false,
                    isRealtime: false
                    //setsChildPortSpot: false,
                    //treeStyle: go.TreeLayout.StyleLayered,
                    //nodeSpacing: router.currentView.contentView.properties.nodesHeightSpacing,
                    //layerSpacing: router.currentView.contentView.properties.nodesWidthSpacing,
                    //arrangement: go.TreeLayout.ArrangementHorizontal
                })
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
        var simpletemplate =
            this.$go(go.Node, "Auto",
            this.$go(go.Shape, "Ellipse",
                new go.Binding("fill", "color")),
                this.$go(go.TextBlock,
                new go.Binding("text", "nid")),
              {
                toolTip:
                this.$go(go.Adornment, "Auto",
                this.$go(go.Shape, { fill: "#FFFFCC" }),
                this.$go(go.TextBlock, { margin: 4 },
                      new go.Binding("text", "nid"))
                  )
              }
            );

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
                                                               font: "bold 11pt Helvetica, Arial, sans-serif",
                                                               stroke: "whitesmoke"
                                                           })),
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
                                                            font: "bold 11pt Helvetica, Arial, sans-serif",
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
                                                       font: "bold 11pt Helvetica, Arial, sans-serif",
                                                       margin: 5,
                                                       stroke: "whitesmoke"
                                                   },
                                                   new go.Binding("text", "cid")));

        var ifNodeTemplate = this.$go(go.Node, "Spot",
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
                                                               font: "bold 11pt Helvetica, Arial, sans-serif",
                                                               stroke: "whitesmoke"
                                                           })));

        // var startJointNodeTemplate = this.$go(go.Node, "Spot",
        //                                this.nodeStype(),
        //                                this.$go(go.Panel, "Auto",
        //                                         this.$go(go.Shape, "Ellipse",
        //                                                  {
        //                                                      minSize: new go.Size(10, 10),
        //                                                      maxSize: new go.Size(10, 10),
        //                                                      fill: "whitesmoke",
        //                                                      stroke: null 
        //                                                  })));

        // var endJointNodeTemplate = this.$go(go.Node, "Spot",
        //                                this.nodeStype(),
        //                                this.$go(go.Panel, "Auto",
        //                                         this.$go(go.Shape, "Ellipse",
        //                                                  {
        //                                                      minSize: new go.Size(10, 10),
        //                                                      maxSize: new go.Size(10, 10),
        //                                                      fill: "Red",
        //                                                      stroke: null 
        //                                                  })));

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
                                               curve: go.Link.JumpOver,
                                               corner: 5, toShortLength: 4,
                                               relinkableFrom: true,
                                               relinkableTo: true,
                                               reshapable: true,
                                               resegmentable: true,
                                           },
                                           //new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
                                           //new go.Binding("toSpot", "toSpot", go.Spot.parse),
                                           //new go.Binding("points").makeTwoWay(),
                                           this.$go(go.Shape),
                                           this.$go(go.Shape, 
                                                    { toArrow: "Standard" }),
                                           this.$go(go.TextBlock),
                                                    new go.Binding("text", "text"));
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
                                                layout: this.$go(go.TreeLayout, { angle: 90 }),
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
                                                                        { font: "Bold 10pt Sans-Serif"}),
                                                                ),
                                                    this.$go(go.Placeholder,
                                                                { padding: new go.Margin(0, 10) })));
                                                        
        var catchBlockTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.$go(go.TreeLayout, { angle: 90 }),
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
                                                                        { font: "Bold 10pt Sans-Serif"},
                                                                        new go.Binding("text", "name"),
                                                                        new go.Binding("visible", "visible")
                                                                    ),
                                                                ),
                                                    this.$go(go.Placeholder,
                                                                { padding: new go.Margin(0, 10) })));


        var collapseGroupTemplate = this.$go(go.Group, "Auto",
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
                                                                        { font: "Bold 12pt Sans-Serif", text: "Statement", verticalAlignment: go.Spot.Center,
                                                                        alignment: go.Spot.Center }),
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
                                                            alignment: go.Spot.Center }),
                                                    )));

        var loopCollapseGroupTemplate = this.$go(go.Group, "Auto",
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
                                                            { font: "Bold 12pt Sans-Serif", text: "Loop", verticalAlignment: go.Spot.Center,
                                                            alignment: go.Spot.Center }),
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
                                                                        alignment: go.Spot.Center }),
                                                                )));

        var groupTemplateMap = new go.Map("string", go.Group);
        //TODO: 블럭 템플릿 추가 작성
        groupTemplateMap.add(this.blockType.None, defaultGroupTemplate);
        groupTemplateMap.add(this.blockType.CatchBlock, catchBlockTemplate);
        groupTemplateMap.add(this.blockType.Statement, collapseGroupTemplate);
        groupTemplateMap.add(this.blockType.If, ifCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.Try, tryCollapseGroupTemplate)
        this.diagram.groupTemplateMap = groupTemplateMap;
    },

    subGraphExpandedChanged: function(group) {
        //var groupData = this.diagram.model.findNodeDataForKey(group.key);
        if (group.isSubGraphExpanded === false) {
            if(group.data.type === router.currentView.contentView.blockType.Statement) {
                group.category = router.currentView.contentView.blockType.Statement;
            } else if(group.data.type === router.currentView.contentView.blockType.If) {
                group.category = router.currentView.contentView.blockType.If;
            } else 
                group.category = router.currentView.contentView.blockType.Statement;
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

    generateData: function() {  
        this.initObjectData();
        this.initBlockData();
        this.initNodeData();
        this.initLinkData();
        //this.printNode();
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

    // #region data generate
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

    // BOOKMARK INIT > initLinkData
    initLinkData: function() {
        _.each(router.currentView.contentView.FlowChartTreeData, function(object){
            _.each(object.block, function(block) {
                _.each(block.node, function(node) {
                    var edgeDataList  = _.filter(FC.edge, { fnid: node.nid });
                    if(_.isUndefined(edgeDataList))
                        return;

                    _.each(edgeDataList, function(edgeData) {
                        var fromBlock = router.currentView.contentView.findBlockOfNode(edgeData.fnid);
                        var toBlock = router.currentView.contentView.findBlockOfNode(edgeData.tnid);
    
                        if(_.isUndefined(fromBlock))
                             return;
    
                        edgeData.category = router.currentView.contentView.getNodeType(node.ntp);
                        edgeData.fromBid = fromBlock.bid;
                        edgeData.toBid = toBlock.bid;
    
                        node.edge.push(edgeData);
                    })
                });
            });
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

    
    findObject: function(objectId) {
        return _.find(router.currentView.contentView.FlowChartTreeData, { oid: objectId } );
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

    findNode: function(nid) {
        var node = null;
        _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
            _.each(object.block, function(block) {
                _.each(block.node, function(_node) {
                    if(_node.nid === nid)
                        node = _node; 
                });
            })
        });
        return node;
    },

    // 노드가 호출 당하는 EDGE ID
    findCallingNodeId: function(nid) {
        var edge = _.filter(FC.edge, { tnid: nid });
        return edge[0].fnid;
    },

    // 노드가 호출하는 EDGE ID
    findCalleeNodeId: function(nid) {
        var edge = _.filter(FC.edge, { tnid: nid });
        return edge[0].fnid;
    },

    findBlockOfNode: function(nid) {
        var block = null;
        _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
            _.each(object.block, function(_block) {
                _.each(_block.node, function(_node) {
                    if(_node.nid === nid) {
                        block = _block;
                    }
                });
            })
        });
        return block;
    },

    // 블럭에 포함된 노드의 링크 정보를 보낸다. DUPLICATED
    findLink: function(blockId) {
        var linkList = [];

        _.each(FC.edge, function(edge) {
            var link = {};
            var nodeCell = router.currentView.contentView.findNodeCell(edge.fnid);
            if(_.isUndefined(nodeCell)) 
                return;

            //if(nodeCell.category === router.currentView.contentView.nodeType.StartJoint)
            //    return;

            link.from = edge.fnid;
            link.to = edge.tnid;
            link.fromSpot = router.currentView.contentView.spotType.Buttom;
            link.toSpot = router.currentView.contentView.spotType.Top;

            linkList.push(link);
        });
    },

    // #endregion

    // BOOKMARK: MAKE > makeBlock    
    makeBlock: function(objectId) {
        var object =  this.findObject(objectId);
        var rootBlock = _.find(object.block, { pbid: "-1"});

        if(_.isUndefined(rootBlock))
            return;

        this.makeStartNode();
        this.makeEndNode();
        this.makeStartLink(rootBlock);
        this.makeEndLink(rootBlock);

        _.each(object.block, function(block) {
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

            // rootBlock
            if(rootBlock.bid === block.bid) {
                blockCell.group = "";
            } else {
                router.currentView.contentView.makeNode(blockCell);
            }
        });
    },

    // BOOKMARK: MAKE > makeNode
    makeNode: function(groupCell) {
        var block = this.findBlock(groupCell.cid);
            if(_.isUndefined(block)) 
                return;

        //console.log("^^^^^ " + block.bid + " : " + block.btp + " : " + groupCell.type );
        
        // TODO: 블럭의 타입별로 데이터/링크를 보정한다.
        switch(groupCell.type) {
            case router.currentView.contentView.blockType.Statement:
                this.makeStateMentBlock(block);
                this.makeStatementLink(block);
                break;
            case router.currentView.contentView.blockType.If:
                this.makeIfElseBlock(block);
                this.makeIfElseLink(block);
                break;
            case router.currentView.contentView.blockType.LoopWhile:
                this.makeLoopWhileBlock(block);
                this.makeLoopWhileLink(block);
                break;
            case router.currentView.contentView.blockType.LoopDo:
                this.makeLoopDoBlock(block);
                this.makeLoopDoLink(block);
                break;
            case router.currentView.contentView.blockType.TryCatchFinally:
                this.makeTryCatchFinallyBlock(block);
                this.makeTryCatchFinallyLink(block);
                break;
            case router.currentView.contentView.blockType.Try:
                this.makeTryBlock(block);
                this.makeTryLink(block);
                break;
            case router.currentView.contentView.blockType.CatchList:
                this.makeCatchListBlock(block);
                this.makeCatchListLink(block);
                break;
            case router.currentView.contentView.blockType.CatchBlock: 
                this.makeCatchBlock(block);
                this.makeCatchLink(block);
                break;
            default: 
                this.makeStateMentBlock(block);
                break;
        }
    },

    mekeLinkBetweenBlocks:function() {
        // EDGE를 순회하면서 node -> node이동시 블럭이 변경된다면 해당 edge는 
        // 블럭간 이동이라고 판단.
    },

    isLinkBetweenBlocks: function(edge) {
        if(edge.fromBid === edge.toBid)
            return false;
        else 
            return true;
    },

    makeStateMentBlock: function(block) {
        // * startJoint, EndJoint 생성하지 않음.
        _.each(block.node, function(node) {
            var nodeCell = {};

            var type = router.currentView.contentView.getNodeType(node.ntp);
            if(type === router.currentView.contentView.nodeType.StartJoint ||
               type === router.currentView.contentView.nodeType.EndJoint ) {
                //nodeCell.visible = false;
                return;
               }

            nodeCell.cid = node.nid;
            nodeCell.isGroup = false;
            nodeCell.group = block.bid;
            nodeCell.category = type;
            nodeCell.name = node.btp;
            router.currentView.contentView.FlowChartData.push(nodeCell);
        });
    },

    // #region Statement 
    // BOOKMARK: MAKE > makeStatementLink
    makeStatementLink: function(block) {
        if(_.isUndefined(block))
            return;

        _.each(block.node, function(node) {
            var fromNodeType = router.currentView.contentView.getNodeType(node.ntp);
           
            // from노드가 숨겨진 노드면 블럭에서 이동
            // 마지막 노드가 시작노드로 이동하는 경우 블럭to블럭으로 이동설정
            if(fromNodeType == router.currentView.contentView.nodeType.EndJoint) {
                _.each(node.edge, function(edge) {
                    var toNode = router.currentView.contentView.findNode(edge.tnid);
                    if( _.isUndefined(toNode))
                        return;

                    var toNodeType = router.currentView.contentView.getNodeType(toNode.ntp);
                    var link = {};

                    if(router.currentView.contentView.isStartJointType(toNodeType)) {
                        link.from = edge.fromBid;
                        link.to = edge.toBid;
                    } else {
                        link.from = edge.fromBid;
                        link.to = edge.tnid; 
                    }

                    link.fromSpot = router.currentView.contentView.spotType.Buttom;
                    link.toSpot = router.currentView.contentView.spotType.Top;
                    router.currentView.contentView.FlowLinkData.push(link);
                });
            } else 
            {
                _.each(node.edge, function(edge) {
                    var link = {};
                    link.from = edge.fnid;
                    link.to = edge.tnid;
                    link.fromSpot = router.currentView.contentView.spotType.Buttom;
                    link.toSpot = router.currentView.contentView.spotType.Top;
                    router.currentView.contentView.FlowLinkData.push(link);
                });
            }

            // _.each(node.edge, function(edge) {
            //         var link = {};
            //         link.from = edge.fnid;
            //         link.to = edge.tnid;
            //         link.fromSpot = router.currentView.contentView.spotType.Buttom;
            //         link.toSpot = router.currentView.contentView.spotType.Top;
            //         router.currentView.contentView.FlowLinkData.push(link);
            //     });
        });
    },

    isStartJointType: function(nodeType) {
        if(nodeType === this.nodeType.StartJoint || nodeType === this.nodeType.If) {
            return true;
        } else {
            return false;
        }
    },
    // #endregion

    // #region IfElse 
    makeIfElseBlock: function(block) {
        _.each(block.node, function(node) {
            var nodeCell = {};
            nodeCell.cid = node.nid;
            nodeCell.isGroup = false;
            nodeCell.group = block.bid;
            nodeCell.category = router.currentView.contentView.getNodeType(node.ntp);
            nodeCell.name = node.btp;

            router.currentView.contentView.FlowChartData.push(nodeCell);
        });
    },

    makeIfElseLink: function(block) {
        if(_.isUndefined(block))
            return;

        _.each(block.node, function(node) {
            var fromNodeType = router.currentView.contentView.getNodeType(node.ntp);

            // 마지막 노드가 시작노드로 이동하는 경우 블럭으로 이동설정
            if(fromNodeType == router.currentView.contentView.nodeType.If ) {
                _.each(node.edge, function(edge) {
                    var link = {};
                    link.from = edge.fnid;
                    link.to = edge.toBid;
                    link.fromSpot = router.currentView.contentView.spotType.Buttom;
                    link.toSpot = router.currentView.contentView.spotType.Top;
                    router.currentView.contentView.FlowLinkData.push(link);
                });
            } else {
                _.each(node.edge, function(edge) {
                    var link = {};
                    link.from = edge.fromBid;
                    link.to = edge.toBid;
                    link.fromSpot = router.currentView.contentView.spotType.Buttom;
                    link.toSpot = router.currentView.contentView.spotType.Top;
                    router.currentView.contentView.FlowLinkData.push(link);
                });
            }
        });
    },
    // endregion

    // #region LoopWhile
    makeLoopWhileBlock: function(block) {
        // * conditionNode를 추가한다. 모양은 마름모
        // * p221start는 Y링크, N링크 데이터를 추가 생성한다. (Y: this- > nextNode, N: this -> EndJoint)
        // * Statement에서 StartJoint로 이동하는 데이터를 추가

        // nextNode -> endJoint
        // nextNode -> startJoin

        _.each(block.node, function(node) {
            var nodeCell = {};
            nodeCell.cid = node.nid;
            nodeCell.isGroup = false;
            nodeCell.group = block.bid;
            nodeCell.category = router.currentView.contentView.getNodeType(node.ntp);
            nodeCell.name = node.btp;

            router.currentView.contentView.FlowChartData.push(nodeCell);
        });
    },

    makeLoopConditionNode: function(block) {
        var nodeCell = {};
        nodeCell.cid = "p" + block.bid + "LOOP_condition";
        nodeCell.isGroup = false;
        nodeCell.group = block.bid;
        nodeCell.category = router.currentView.contentView.nodeType.If;
        nodeCell.name = " i > 10";

        router.currentView.contentView.FlowChartData.push(nodeCell);
        return nodeCell;
    },

    makeLoopWhileLink: function(block) {
        var startJoint = block.node[0];
        var endJoint = block.node[1];
        var conditionNode = this.makeLoopConditionNode(block);
        var startJointEdge = startJoint.edge[0];
        var endJointEdge = endJoint.edge[0];
        var callingEndJointNid = this.findCallingNodeId(endJointEdge.fnid);

        if(!_.isUndefined(startJointEdge)) {
            var startLink = {};
            startLink.from = startJointEdge.fnid;
            startLink.to = conditionNode.cid;
            startLink.fromSpot = router.currentView.contentView.spotType.Buttom;
            startLink.toSpot = router.currentView.contentView.spotType.Top;
            router.currentView.contentView.FlowLinkData.push(startLink);
        }

        var ifLink = {};
        ifLink.from = conditionNode.cid;
        ifLink.to = startJoint.edge[0].toBid;
        ifLink.fromSpot = router.currentView.contentView.spotType.Buttom;
        ifLink.toSpot = router.currentView.contentView.spotType.Top;
        ifLink.text = "Y";
        router.currentView.contentView.FlowLinkData.push(ifLink);

        var elseLink = {};
        elseLink.from = conditionNode.cid;
        elseLink.to = endJoint.nid;
        elseLink.fromSpot = router.currentView.contentView.spotType.Right;
        elseLink.toSpot = router.currentView.contentView.spotType.Buttom;
        elseLink.text = "Y";
        router.currentView.contentView.FlowLinkData.push(elseLink);

        var loopLink = {};
        loopLink.from = callingEndJointNid;
        loopLink.to = conditionNode.cid;
        loopLink.fromSpot = router.currentView.contentView.spotType.Buttom;
        loopLink.toSpot = router.currentView.contentView.spotType.Left;
        router.currentView.contentView.FlowLinkData.push(loopLink);

        if(!_.isUndefined(endJointEdge)) { 
            var endLine = {};
            endLine.from = endJointEdge.fromBid;
            endLine.to = endJointEdge.toBid;
            endLine.fromSpot = router.currentView.contentView.spotType.Right;
            endLine.toSpot = router.currentView.contentView.spotType.Buttom;
            router.currentView.contentView.FlowLinkData.push(endLine);
        }
    },
    // #endregion

    // #region LoopDo
    // BOOKMARK: MAKE > makeLoopDoBlock
    makeLoopDoBlock: function(block) {
        _.each(block.node, function(node) {
            var nodeCell = {};
            nodeCell.cid = node.nid;
            nodeCell.isGroup = false;
            nodeCell.group = block.bid;
            nodeCell.category = router.currentView.contentView.getNodeType(node.ntp);
            nodeCell.name = node.btp;

            router.currentView.contentView.FlowChartData.push(nodeCell);
        });
    },

    // BOOKMARK: MAKE > makeLoopDoLink
    makeLoopDoLink: function(block) {
        var startJoint = block.node[0];
        var endJoint = block.node[1];
        var conditionNode = this.makeLoopConditionNode(block);
        var startJointEdge = startJoint.edge[0];
        var endJointEdge = endJoint.edge[0];
        var callingEndJointNid = this.findCallingNodeId(endJointEdge.fnid);

        if(!_.isUndefined(startJointEdge)) {
            var startLink = {};
            startLink.from = startJointEdge.fnid;
            startLink.to = startJointEdge.toBid;
            startLink.fromSpot = router.currentView.contentView.spotType.Buttom;
            startLink.toSpot = router.currentView.contentView.spotType.Top;
            router.currentView.contentView.FlowLinkData.push(startLink);
        }

         //statement end -> condition으로 나가는 것을 막아야..... statement에서 처리(타입에따라 그릴수 있도록)

        var endLink = _.find(FC.edge, { tnid: endJointEdge.fnid});
        var conditionLink = {};
        conditionLink.from = endLink.fromBid;
        conditionLink.to = conditionNode.cid;
        conditionLink.fromSpot = router.currentView.contentView.spotType.Right;
        conditionLink.toSpot = router.currentView.contentView.spotType.Buttom;
        router.currentView.contentView.FlowLinkData.push(conditionLink);

        var ifLink = {};
        ifLink.from = conditionNode.cid;
        ifLink.to = startJoint.nid;
        ifLink.fromSpot = router.currentView.contentView.spotType.Left;
        ifLink.toSpot = router.currentView.contentView.spotType.Top;
        ifLink.text = "Y";
        router.currentView.contentView.FlowLinkData.push(ifLink);

        var elseLink = {};
        elseLink.from = conditionNode.cid;
        elseLink.to = endJoint.nid;
        elseLink.fromSpot = router.currentView.contentView.spotType.Right;
        elseLink.toSpot = router.currentView.contentView.spotType.Buttom;
        elseLink.text = "N";
        router.currentView.contentView.FlowLinkData.push(elseLink);

        if(!_.isUndefined(endJointEdge)) {
            var endLine = {};
            endLine.from = endJointEdge.fromBid;
            endLine.to = endJointEdge.toBid;
            endLine.fromSpot = router.currentView.contentView.spotType.Right;
            endLine.toSpot = router.currentView.contentView.spotType.Buttom;
            router.currentView.contentView.FlowLinkData.push(endLine);
        }
        else {
            console.log("Loop While EndJoint is Undefined");
        }
    },
    // #endregion

    // #region TryCatchFinally
    makeTryCatchFinallyBlock: function(block) {
        // TODO: start, end 제외
    },

    makeTryCatchFinallyLink: function(block) {
    },

    makeTryBlock: function(block) {
        _.each(block.node, function(node) {
            // TODO: start, end 제외
            var nodeCell = {};
            nodeCell.cid = node.nid;
            nodeCell.isGroup = false;
            nodeCell.group = block.bid;
            nodeCell.category = router.currentView.contentView.getNodeType(node.ntp);
            nodeCell.name = node.ntp;

            router.currentView.contentView.FlowChartData.push(nodeCell);
        });
    },

    makeTryLink: function(block) {

    },

    makeCatchListBlock: function(block) {
        _.each(block.node, function(node) {
            // TODO: start, end 제외
            var nodeCell = {};
            nodeCell.cid = node.nid;
            nodeCell.isGroup = false;
            nodeCell.group = block.bid;
            nodeCell.category = router.currentView.contentView.getNodeType(node.ntp);
            nodeCell.name = node.ntp;

            router.currentView.contentView.FlowChartData.push(nodeCell);
        });
    },

    makeCatchListLink: function(block) {
        _.each(block.node, function(node) {
            var type = router.currentView.contentView.getNodeType(node.ntp);

            if(type === router.currentView.contentView.nodeType.StartJoint) {
                console.log("Start Joint");
                _.each(node.edge, function(edge) {
                    var link = {};
                    link.from = edge.fnid;
                    link.to = edge.toBid;
                    link.fromSpot = router.currentView.contentView.spotType.Buttom;
                    link.toSpot = router.currentView.contentView.spotType.Top;
                    router.currentView.contentView.FlowLinkData.push(link);
                });
            } else if(type === router.currentView.contentView.nodeType.EndJoint) {
                // console.log(" End Joint");
                // _.each(node.edge, function(edge) {
                //     var link = {};
                //     link.from = edge.fromBid;
                //     link.to = edge.toBid;    // find final,re turn Node
                //     link.fromSpot = router.currentView.contentView.spotType.Buttom;
                //     link.toSpot = router.currentView.contentView.spotType.Top;
                //     router.currentView.contentView.FlowLinkData.push(link);
                // });
            }
        });
    },

    makeCatchBlock: function(block) {
        var text = "java.lang.ClassNotFoundException e";
        router.currentView.contentView.changeBlockName(block, "Catch(" + text +  ")");
    },

    changeBlockName: function(block, text) {
        var nodeCell = router.currentView.contentView.findNodeCell(block.bid)
        if(_.isUndefined(nodeCell)) 
            return;

        nodeCell.name = text;
    },

    makeCatchLink: function(block) {

    },
    // #endregion

    // BOOKMARK TYPE > getBlockType
    getBlockType: function(blockTypeName) {

        switch(blockTypeName) {
            case router.currentView.contentView.blockType.Statement:
                return router.currentView.contentView.blockType.Statement;
            case  router.currentView.contentView.blockType.If:
                return router.currentView.contentView.blockType.If;
            
            // Loop
            // LoopDo
            // LoopR    // Y N label 변경
            // DOLoopR  // Y N label 변경
            case router.currentView.contentView.blockType.LoopWhile:
                return router.currentView.contentView.blockType.LoopWhile;
            case router.currentView.contentView.blockType.LoopFor:
                return router.currentView.contentView.blockType.LoopFor;
            case router.currentView.contentView.blockType.LoopDo:
                return router.currentView.contentView.blockType.LoopDo; 
        
            // Try
            // TryCatch
            // Catch
            // Final
            // CatchList
            case router.currentView.contentView.blockType.TryCatchFinally:
                return router.currentView.contentView.blockType.TryCatchFinally;
            case router.currentView.contentView.blockType.Try:
                return router.currentView.contentView.blockType.Try;
            case router.currentView.contentView.blockType.CatchList:
                return router.currentView.contentView.blockType.CatchList;
            case router.currentView.contentView.blockType.CatchBlock:
                return router.currentView.contentView.blockType.CatchBlock;
            
            // Switch
            // Case
            case router.currentView.contentView.blockType.Switch:
                return router.currentView.contentView.blockType.Switch;
            case router.currentView.contentView.blockType.Case:
            return router.currentView.contentView.blockType.Case;

            default: 
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

    findNodeCell: function(cellId) {
        return _.find(router.currentView.contentView.FlowChartData, { cid: cellId });
    },

    makeLink: function(objectId) {
        // p256 to p257 not visible
        // p57 to p258 visible

        _.each(FC.edge, function(edge) {
            var link = {};
            var nodeCell = router.currentView.contentView.findNodeCell(edge.fnid);
            if(_.isUndefined(nodeCell)) 
                return;

            //if(nodeCell.category === router.currentView.contentView.nodeType.StartJoint)
            //    return;
                
            link.from = edge.fnid;
            link.to = edge.tnid;
            link.fromSpot = router.currentView.contentView.spotType.Buttom;
            link.toSpot = router.currentView.contentView.spotType.Top;
            
            router.currentView.contentView.FlowLinkData.push(link);
        });
    },

    makeStartLink: function(rootBlock) {
        var link = {};

        link.from = this.nodeType.Start;
        link.to = rootBlock.bid;
        link.fromSpot = this.spotType.Buttom;
        link.toSpot = this.spotType.Top;

        router.currentView.contentView.FlowLinkData.push(link);
    },

    makeEndLink: function(rootBlock) {
        var link = {};

        link.from = rootBlock.bid;
        link.to = this.nodeType.End;
        link.fromSpot = this.spotType.Buttom;
        link.toSpot = this.spotType.Top;

        router.currentView.contentView.FlowLinkData.push(link);
    },

    initNode: function() {
        // 6: if
        // 2: try
        // 5: loop
        var object_id = "2";
        this.generateData();
        this.makeBlock(object_id);
        //this.makeLink(object_id);

        this.initModel();
    
        // router.currentView.contentView.nodeInfos = response;
        // router.currentView.contentView.visitLinks(null, router.currentView.contentView.oid);
        // router.currentView.contentView.setGroupNodeInfos();
        router.currentView.contentView.diagram.model.addNodeDataCollection(router.currentView.contentView.FlowChartData);
        router.currentView.contentView.diagram.model.addLinkDataCollection(router.currentView.contentView.FlowLinkData);
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
