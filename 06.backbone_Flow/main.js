var router = {
    currentView: {
        contentView: {
        }
    }
}

$(function() {
var FlowDiagramView =  Backbone.View.extend({
    initialize: function() {
        this.FlowChartData = [];
        this.FlowChartTreeData = [];
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
                                                  this.$go(go.TextBlock, "Start",
                                                           {
                                                               font: "bold 11pt Helvetica, Arial, sans-serif",
                                                               stroke: "whitesmoke"
                                                           })),
                                         this.makePort("L", go.Spot.Left, true, false),
                                         this.makePort("R", go.Spot.Right, true, false),
                                         this.makePort("B", go.Spot.Bottom, true, false));

        var templmap = new go.Map("string", go.Node);
        templmap.add("Start", startNodeTemplate);
        templmap.add("End", endNodeTemplate);

        templmap.add("State", stateBlockTemplate);
        templmap.add("If", ifNodeTemplate);

        templmap.add("", this.diagram.nodeTemplate);
        this.diagram.nodeTemplateMap = templmap;
        
        this.diagram.nodeTemplate = startNodeTemplate;
    },

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
        console.log("implement meno template");
    },
    
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
                                            this.$go(go.Shape, "Subroutine",
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
                                            { width: 150, height: 50, parameter1: 5, fill: "rgba(128,128,128,0.33)" }),
                                this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                            this.$go(go.Panel, "Horizontal",
                                                    { defaultAlignment: go.Spot.Top },
                                                    this.$go("SubGraphExpanderButton"),  
                                                    this.$go(go.TextBlock, 
                                                            { font: "Bold 12pt Sans-Serif", text: "If", verticalAlignment: go.Spot.Center,
                                                            alignment: go.Spot.Center }),
                                                    )));

        var groupTemplateMap = new go.Map("string", go.Group);
        groupTemplateMap.add("", defaultGroupTemplate);
        groupTemplateMap.add("Collapsed", collapseGroupTemplate);
        groupTemplateMap.add("IfCollapsed", ifCollapseGroupTemplate);

        this.diagram.groupTemplateMap = groupTemplateMap;
    },

    subGraphExpandedChanged: function(group) {
        //var groupData = this.diagram.model.findNodeDataForKey(group.key);
        if (group.isSubGraphExpanded === false) {
            if(group.data.btype === "StatementBlock") {
                group.category = "Collapsed";
            } else if(group.data.btype === "IF") {
                group.category = "IfCollapsed";
            }
        }
        else {
            group.category = "";
        }
    },

    makeIFBlock: function () {

    },

    makeStatementBlock: function() {

    },

    makeStartNode: function() {
        var startCell = {};
        startCell.cid = "Start";
        //cell.type = block.btype;
        startCell.isGroup = false,
        //cell.group = rootBlock.bid;
        startCell.name = "Start";
        startCell.category = "Start";
        router.currentView.contentView.FlowChartData.push(startCell);
    },

    makeEndNode: function() {
        var endCell = {};
        endCell.cid = "End";
        //cell.type = block.btype;
        endCell.isGroup = false,
        //cell.group = rootBlock.bid;
        endCell.name = "End";
        endCell.category = "End";
        router.currentView.contentView.FlowChartData.push(endCell);
    },

    generateData: function() {  
        this.initObjectData();
        this.initBlockData();
        this.initNodeData();
        this.printNode();
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

    makeBlock: function(object_id) {
        
        var object =  _.find(router.currentView.contentView.FlowChartTreeData, { oid: object_id } );
        var rootBlock = _.find(object.block, { pbid: "-1"});

        if(_.isUndefined(rootBlock))
            return;

        _.each(object.block, function(block) {
            var cell = {};

            cell.cid = block.bid;
            cell.type = block.btype;
            cell.isGroup = true,
            cell.group = rootBlock.bid;
            cell.name = block.btp;
            cell.category = "state";

            // rootBlock
            if(rootBlock.bid === block.bid) {
                cell.group = "";
            } else {
                router.currentView.contentView.makeNode(cell);
                //this.makeNode(cell);
            }

            router.currentView.contentView.FlowChartData.push(cell);
        });

        this.makeStartNode();
        this.makeEndNode();

        //this.getType();
        console.log("generate Data ");
    },

    makeNode: function(groupCell) {

        // TODO: startNode, endNode는 생성하지 않음.
        
        // TODO: 일단 그대로 그려 보기
        var block = this.findBlock(groupCell.cid);
            if(_.isUndefined(block)) 
                return;

        _.each(block.node, function(node) {
            var nodeCell = {};
            nodeCell.cid = node.nid;
            nodeCell.isGroup = false;
            nodeCell.group = block.bid;
            nodeCell.category = "State";
            nodeCell.name = node.btp;

            router.currentView.contentView.FlowChartData.push(nodeCell);
        });
    },

    getType: function(type) {
        switch(type) {
            case router.currentView.contentView.BlockType.If:
                return "";
            default: return ""
        }
        
        console.log("getType");
    },

    initNode: function() {

        this.generateData();

        var object_id = "6";
        this.makeBlock(object_id);

        var linkList = [{
            from:"Start",
            to:"89",
            fromPort:"B",
            toPort: "T"
        },{
            from:"p257",
            to:"p258",
            fromPort:"B",
            toPort: "T"
        }, {
            from:"p258",
            to:"p259",
            fromPort:"B",
            toPort: "T"
        },
        {
            from:"90",
            to:"91",
            fromPort:"B",
            toPort: "T"
        }, {
            from:"IF",
            to:"92",
            fromPort:"B",
            toPort: "T"
        }, {
            from:"IF",
            to:"93",
            fromPort:"R",
            toPort: "T"
        }, {
            from:"92",
            to:"IF_END",
            fromPort:"R",
            toPort: "T"
        }, {
            from:"93",
            to:"IF_END",
            fromPort:"B",
            toPort: "T"
        }, {
            from:"89",
            to:"End",
            fromPort:"B",
            toPort: "T"
        }];

        this.initModel();
        
        this.diagram.model.addNodeDataCollection(router.currentView.contentView.FlowChartData);
        this.diagram.model.addLinkDataCollection(linkList);

        // router.currentView.contentView.nodeInfos = response;
        // router.currentView.contentView.visitLinks(null, router.currentView.contentView.oid);
        // router.currentView.contentView.setGroupNodeInfos();
        // router.currentView.contentView.diagram.model.addNodeDataCollection(router.currentView.contentView.activityList);
        // router.currentView.contentView.diagram.model.addLinkDataCollection(router.currentView.contentView.linkList);
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

