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
            Try: "TryBlock",
            Loop: "LOOP",
        };

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
                Break: "Break"
        };

        this.spotType = {
            Top: "T",
            Buttom: "B",
            Left: "L",
            Right: "R"
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
        nodesWidthSpacing : 140,
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
                    fill: "transparent",
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
                allowDelete: true,
                allowRelink: false,
                padding: new go.Margin(this.properties.diagramPaddingTop, 5, 5, 5),
                //resizingTool: new fnResizeMultipleTool(),
                layout: this.$go(go.TreeLayout, {
                    angle: 90,
                    //setsPortSpot: false,
                    //setsChildPortSpot: false,
                    //treeStyle: go.TreeLayout.StyleLayered,
                    //nodeSpacing: router.currentView.contentView.properties.nodesHeightSpacing,
                    //layerSpacing: router.currentView.contentView.properties.nodesWidthSpacing,
                    arrangement: go.TreeLayout.ArrangementHorizontal
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

    // BOOKMARK: initNodeTemplate
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
                                         this.makePort("L", go.Spot.Left, true, false),
                                         this.makePort("R", go.Spot.Right, true, false),
                                         this.makePort("B", go.Spot.Bottom, true, false));

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
                                                           })),
                                         this.makePort("L", go.Spot.Left, true, false),
                                         this.makePort("R", go.Spot.Right, true, false),
                                         this.makePort("B", go.Spot.Bottom, true, false));

        var startJointNodeTemplate = this.$go(go.Node, "Spot",
                                       this.nodeStype(),
                                       this.$go(go.Panel, "Auto",
                                                this.$go(go.Shape, "Ellipse",
                                                         {
                                                             minSize: new go.Size(1, 1),
                                                             maxSize: new go.Size(2, 2),
                                                             fill: "whitesmoke",
                                                             stroke: null 
                                                         })));

        var endJointNodeTemplate = this.$go(go.Node, "Spot",
                                       this.nodeStype(),
                                       this.$go(go.Panel, "Auto",
                                                this.$go(go.Shape, "Ellipse",
                                                         {
                                                             minSize: new go.Size(1, 1),
                                                             maxSize: new go.Size(2, 2),
                                                             fill: "whitesmoke",
                                                             stroke: null 
                                                         })));

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

    // BOOKMARK: initLinkTemplate
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
                                           new go.Binding("points").makeTwoWay(),
                                           this.$go(go.Shape,  // the highlight shape, normally transparent
                                                   { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
                                           this.$go(go.Shape,  // the link path shape
                                                   { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
                                           this.$go(go.Shape,  // the arrowhead
                                                   { toArrow: "standard", stroke: null, fill: "gray"}),
                                           this.$go(go.Panel, "Auto",  // the link label, normally not visible
                                                   { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                                                   new go.Binding("visible", "visible").makeTwoWay(),
                                                   this.$go(go.Shape, "RoundedRectangle",
                                                            { fill: "#F8F8F8", stroke: null }),
                                                            this.$go(go.TextBlock, "Yes",
                                                                     {
                                                                         textAlign: "center",
                                                                         font: "10pt helvetica, arial, sans-serif",
                                                                         stroke: "#333333",
                                                                         editable: true
                                                                     },
                                                                     new go.Binding("text").makeTwoWay())));

                                                            
        var linkTemplateMap = new go.Map("string", go.Link);

        linkTemplateMap.add("", defaultLinkTemplate);
        this.diagram.linkTemplateMap = linkTemplateMap;
    },
    
    initMemoTemplate: function() {
    },
    
    // BOOKMARK: initGroupTemplate
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
                                                                        { font: "Bold 12pt Sans-Serif", }),
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
                                                                        { font: "Bold 12pt Sans-Serif", text: "StateMent", verticalAlignment: go.Spot.Center,
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

            //var block = this.findBlock(node.bid);
            var block = null;
            _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
                _.each(object.block, function(_block) {
                    if(_block.bid === node.bid)
                        block = _block;
                })
            });

            if(_.isUndefined(block)) 
                return;

            var _node = {};
            _node.bid = node.bid;
            _node.nid = node.nid;
            _node.ntp = node.ntp;
            _node.sid = node.sid;
            _node.sln = node.sln;
            _node.eln = node.eln;
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

    getObject: function(objectId) {
        return _.find(router.currentView.contentView.FlowChartTreeData, { oid: objectId } );
    },

    makeBlock: function(objectId) {
        
        var object =  this.getObject(objectId);
        var rootBlock = _.find(object.block, { pbid: "-1"});

        if(_.isUndefined(rootBlock))
            return;

        this.makeStartLink(rootBlock);
        this.makeEndLink(rootBlock);

        _.each(object.block, function(block) {
            var blockCell = {};

            blockCell.cid = block.bid;
            blockCell.isGroup = true,
            blockCell.group = block.pbid;
            blockCell.name = block.btp;
            blockCell.type = router.currentView.contentView.getBlockType(block.btp);
            blockCell.category = router.currentView.contentView.blockType.None;

            // rootBlock
            if(rootBlock.bid === block.bid) {
                blockCell.group = "";
            } else {
                router.currentView.contentView.makeNode(blockCell);
            }

            router.currentView.contentView.FlowChartData.push(blockCell);
        });

        this.makeStartNode();
        this.makeEndNode();
    },

    makeNode: function(groupCell) {
        var block = this.findBlock(groupCell.cid);
            if(_.isUndefined(block)) 
                return;

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

    getBlockType: function(blockTypeName) {
        // TODO: CM > InitBlockTypeDic()  동일하게 설정
        switch(blockTypeName) {
            case "StatementBlock":
                return router.currentView.contentView.blockType.Statement;
            case "IF":
                return router.currentView.contentView.blockType.If;
            case "SWITCH":
                return router.currentView.contentView.blockType.Switch;
            case "TryBlock":
                return router.currentView.contentView.blockType.Try;
            default: 
                return router.currentView.contentView.blockType.Statement;
        }
    },

    getNodeType: function(nodeType) {
        switch(nodeType) {
            case "IF_START":
                return router.currentView.contentView.nodeType.If;
            case "STBLOCK_START":
            case "_START": 
                return router.currentView.contentView.nodeType.StartJoint;
            case "SWITCH_START":
                return router.currentView.contentView.nodeType.Switch;
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
            case "IF_END":
            case "STBLOCK_END":
            case "SWITCH_END":
            case "_END":
                return router.currentView.contentView.nodeType.EndJoint;
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

        var object_id = "2";
        this.generateData();
        this.makeBlock(object_id);
        this.makeLink(object_id);

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
