
var router = {
    currentView: {
        contentView: {
        }
    }
}

$(function() {
var DocumentView =  Backbone.View.extend({
    initialize: function() {
        this.FlowChartTreeData = [];
        this.FlowChartData = [];
        this.FlowLinkData = [];

        this.spotType = {
            Top: "Top",
            Buttom: "None",
            Left: "Left",
            Right: "Right"
        };
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
        this.diagram = this.$go(go.Diagram, targetEl, {
            initialContentAlignment: go.Spot.Center,
            validCycle: go.Diagram.CycleNotDirected,
            "grid": this.$go(go.Panel, go.Panel.Grid, panelOptions, this.$go(go.Shape, "LineH", shapeOptions)),
            "grid.visible": true,
            "ModelChanged": function(e) {
            },
            "LinkDrawn": this.showLinkLabel,
            "LinkRelinked": this.showLinkLabel,
            "undoManager.isEnabled": true,
            "animationManager.isEnabled": false,
            allowCopy: false,
            allowDelete: false,
            allowRelink: false,
            padding: new go.Margin(70, 5, 5, 5),
            layout: this.layoutStyle()
        });
    },

    initLayer: function() {
        // var foreLayer = this.diagram.findLayer("Foreground");

        // this.diagram.addLayerBefore(this.$go(go.Layer, { name: "GroupLayer" }), foreLayer);
        // this.diagram.addLayerBefore(this.$go(go.Layer, { name: "LinkLayer" }), foreLayer);
        // this.diagram.addLayerBefore(this.$go(go.Layer, { name: "NodeLayer" }), foreLayer);
        // this.diagram.addLayerBefore(this.$go(go.Layer, { name: "MemoLayer" }), foreLayer);
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
            //arrangement:  go.TreeLayout.ArrangementHorizontal
            //layeringOption: go.LayeredDigraphLayout.LayerLongestPathSink,
            //layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource,
            //layeringOption: go.LayeredDigraphLayout.LayerOptimalLinkLength,
            //initializeOption: go.LayeredDigraphLayout.InitDepthFirstOut,
            //initializeOption: go.LayeredDigraphLayout.InitDepthFirstIn,
            //initializeOption: go.LayeredDigraphLayout.InitNaive,
            //aggressiveOption: go.LayeredDigraphLayout.AggressiveLess,
            //aggressiveOption: go.LayeredDigraphLayout.AggressiveNone,
            //aggressiveOption: go.LayeredDigraphLayout.AggressiveMore
            packOption : 10
        });
    },

    initNodeTemplate: function() {
        var ifNodeTemplate = this.$go(go.Node, "Auto",
                                      this.nodeStype(),
                                      this.$go(go.Shape, "Rectangle", { fill: "lightgray" }),
                                      this.$go(go.TextBlock,
                                               { margin: 5},
                                               new go.Binding("text", "cid")));
                                                  
        this.diagram.nodeTemplate = ifNodeTemplate;
    },

    initLinkTemplate : function() {
        var defaultLinkTemplate = this.$go(go.Link,
                                           {
                                               adjusting: go.Link.Stretch,
                                               routing: go.Link.AvoidsNodes,
                                               curve: go.Link.JumpOver,
                                               corner: 10, 
                                               fromShortLength: 0,
                                               toShortLength: 4,
                                               fromEndSegmentLength: 65,//15,
                                               toEndSegmentLength: 10,//15,
                                               layerName: "LinkLayer",
                                               relinkableFrom: true,
                                               relinkableTo: true,
                                               reshapable: true,
                                               resegmentable: true,
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
                                                             { fill: "#F8F8F8", stroke: null }),
                                                    this.$go(go.TextBlock, "Yes",  // the label
                                                             {
                                                                 textAlign: "center",
                                                                 font: "10pt helvetica, arial, sans-serif",
                                                                 stroke: "#333333",
                                                                 editable: true
                                                              },
                                                    new go.Binding("text", "text"))));

        var linkTemplateMap = new go.Map("string", go.Link);
        this.diagram.linkTemplate = defaultLinkTemplate;
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
                                                                        { font: "Bold 10pt Sans-Serif"},
                                                                        new go.Binding("text", "cid"),
                                                                    ),
                                                                ),
                                                    this.$go(go.Placeholder,
                                                                { padding: new go.Margin(0, 10) })));

        var groupTemplateMap = new go.Map("string", go.Group);
        //TODO: 블럭 템플릿 추가 작성
        groupTemplateMap.add("" , defaultGroupTemplate);
        this.diagram.groupTemplateMap = groupTemplateMap;
    },

    showLinkLabel: function(e) {
        var label = e.subject.findObject("LABEL");
        label.visible = true;
        // if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
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

    generateData: function() {

        var startCell = {};
        startCell.cid = "79"
        startCell.isGroup = true,
        startCell.name = "79"
        startCell.category = "";
        router.currentView.contentView.FlowChartData.push(startCell);

        var cell1 = {};
        cell1.cid = "condition"
        cell1.isGroup = false,
        cell1.group = "79"
        cell1.name = "condition"
        cell1.category = "";
        router.currentView.contentView.FlowChartData.push(cell1);

        var group1 = {};
        group1.cid = "80"
        group1.isGroup = true,
        group1.group = "79"
        group1.name = "80"
        group1.category = "";
        router.currentView.contentView.FlowChartData.push(group1);

        var cell2 = {};
        cell2.cid = "statement"
        cell2.isGroup = false,
        cell2.group = "80"
        cell2.name = "statement"
        cell2.category = "";
        router.currentView.contentView.FlowChartData.push(cell2);

        var end = {};
        end.cid = "end"
        end.isGroup = false,
        end.group = "79"
        end.name = "end"
        end.category = "";
        router.currentView.contentView.FlowChartData.push(end);

    
    },

    generateLink: function() {

        // var link = {};
        // link.from = "condition";
        // link.to = "statement";
        // link.fromSpot = router.currentView.contentView.spotType.Buttom;
        // link.toSpot = router.currentView.contentView.spotType.Top;
        // router.currentView.contentView.FlowLinkData.push(link);

        var link2 = {};
        link2.from = "condition";
        link2.to = "80";
        link2.fromSpot = router.currentView.contentView.spotType.Buttom;
        link2.toSpot =  router.currentView.contentView.spotType.Top;
        router.currentView.contentView.FlowLinkData.push(link2);

        var loop = {};
        loop.from = "80";
        loop.to = "end";
        loop.fromSpot = router.currentView.contentView.spotType.Buttom;
        loop.toSpot =  router.currentView.contentView.spotType.Top;
        router.currentView.contentView.FlowLinkData.push(loop);

        
        var link3 = {};
        link3.from = "condition";
        link3.to = "end";
        link3.fromSpot = router.currentView.contentView.spotType.Right;
        link3.toSpot =  router.currentView.contentView.spotType.Right;
        router.currentView.contentView.FlowLinkData.push(link3);
    },

    initNode: function() {

        this.initModel();

        this.generateData();
        this.generateLink();

        router.currentView.contentView.diagram.model.addNodeDataCollection(router.currentView.contentView.FlowChartData);
        router.currentView.contentView.diagram.model.addLinkDataCollection(router.currentView.contentView.FlowLinkData);

        
        // var nodeDataArray = [
        //     { cid: "Alpha" }, { cid: "Beta" }
        // ];

        // var linkDataArray = [
        //     { from: "Alpha", to: "Beta", fromSpot: router.currentView.contentView.spotType.Buttom , toSpot: router.currentView.contentView.spotType.Top, text: "a->B" },
        //     { from: "Beta", to: "Alpha", fromSpot: router.currentView.contentView.spotType.Right, toSpot: router.currentView.contentView.spotType.Right, text: "b->a" },
        // ];


        // router.currentView.contentView.diagram.model.addNodeDataCollection(nodeDataArray);
        // router.currentView.contentView.diagram.model.addLinkDataCollection(linkDataArray);
    },

    initModel: function() {

        var graphLinkModelOptions = {
            nodeKeyProperty: "cid",
            //nodeParentKeyProperty: "pcid"
            //nid: "Group",
            //nnm: "Group",
            //isGroup: true,
            //category: "state",
            // linkFromPortIdProperty: "fnid",
            // linkToPortIdProperty: "tnid"
        };

        this.diagram.model = this.$go(go.GraphLinksModel, graphLinkModelOptions);
    },

    initTemplate: function() {
        this.initNodeTemplate();
        this.initLinkTemplate();
        this.initGroupTemplate();
    },

    initComponents: function() {
        this.initDiagram();
        this.initLayer();
        this.initTemplate();
        this.initNode();
    },

    render: function() {
        this.initComponents();
        return this;
    }
});
    var documentView = new DocumentView();
    router.currentView.contentView = documentView;

    documentView.render();
});