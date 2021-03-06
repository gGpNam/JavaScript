
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
            columnSpacing: 6,
            setsPortSpots: false,
            isRealtime: false
        });
    },

    initNodeTemplate: function() {
        var ifNodeTemplate = this.$go(go.Node, "Auto", 
                                      {
                                         width: 90, height: 90,
                                         selectionAdorned: false
                                      },
                                      new go.Binding("location", "loc", go.Point.parse),
                                      this.$go(go.Shape, "FivePointedStar", { fill: "lightgray" }),
                                      this.$go(go.TextBlock,
                                                new go.Binding("text", "key")))

        this.diagram.nodeTemplate = ifNodeTemplate;
    },

    initLinkTemplate : function() {
        var defaultLinkTemplate = this.$go(go.Link,
                                           this.$go(go.Shape),
                                           this.$go(go.Shape,  // the "from" end arrowhead
                                                    { fromArrow: "Chevron" }),
                                           this.$go(go.Shape,  // the arrowhead
                                                    { toArrow: "StretchedDiamond", fill: "red" }));

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
        startCell.cid = "Alpah";
        startCell.loc=  "0 0";
        router.currentView.contentView.FlowChartData.push(startCell);

        var cell1 = {};
        cell1.cid = "Beta"
        cell1.loc=  "100 50";
        router.currentView.contentView.FlowChartData.push(cell1);
    },

    generateLink: function() {

        // var link = {};
        // link.from = "condition";
        // link.to = "statement";
        // link.fromSpot = router.currentView.contentView.spotType.Buttom;
        // link.toSpot = router.currentView.contentView.spotType.Top;
        // router.currentView.contentView.FlowLinkData.push(link);

        var link2 = {};
        link2.from = "Alpha";
        link2.to = "Beta";
        router.currentView.contentView.FlowLinkData.push(link2);
    },

    initNode: function() {

        this.initModel();

        this.generateData();
        this.generateLink();

        router.currentView.contentView.diagram.model.addNodeDataCollection(router.currentView.contentView.FlowChartData);
        router.currentView.contentView.diagram.model.addLinkDataCollection(router.currentView.contentView.FlowLinkData);

        
        var nodeDataArray = [
            { cid: "Alpha" }, { cid: "Beta" }
        ];

        var linkDataArray = [
            { from: "Alpha", to: "Beta", fromSpot: router.currentView.contentView.spotType.Buttom , toSpot: router.currentView.contentView.spotType.Top, text: "a->B" },
            { from: "Beta", to: "Alpha", fromSpot: router.currentView.contentView.spotType.Right, toSpot: router.currentView.contentView.spotType.Right, text: "b->a" },
        ];


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