
var router = {
    currentView: {
        contentView: {
        }
    }
}

$(function() {
var DocumentView =  Backbone.View.extend({
    initialize: function() {
        this.blockType = {
            Statement: "StatementBlock",
            If: "IF",
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
        }
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
        this.diagram = this.$go(go.Diagram, targetEl, {
            initialContentAlignment: go.Spot.Center,
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            "undoManager.isEnabled": true 
        });
    },

    initLayer: function() {
        //this.diagram.layout = this.$go(go.TreeLayout);
    
        this.diagram.layout = this.$go(go.LayeredDigraphLayout,
            { direction: 90, layerSpacing: 10, isRealtime: false });

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

                                            
        var startJointNodeTemplate = this.$go(go.Node, "Spot",
                                              new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                                              {
                                                    locationSpot: go.Spot.TopLeft,
                                                    location: "0 0"
                                              },
                                              this.$go(go.Shape, "PlusLine",
                                                       { name: "SHAPE", width: 8, height: 8 }));

        // var startJointNodeTemplate = this.$go(go.Node, "Spot",
        //                                       this.nodeStype(),
        //                                       this.$go(go.TextBlock, { stroke: "red" },
        //                                                new go.Binding("text", "cid"),
        //                                                new go.Binding("visible", "visible")));

        var templmap = new go.Map("string", go.Node);

        // TODO: this.NodeType 의 타입만큼 템플릿을 작성해야 함.
        templmap.add(this.nodeType.Start, startNodeTemplate);
        templmap.add(this.nodeType.End, endNodeTemplate);
        templmap.add(this.nodeType.Statement, stateBlockTemplate);
        templmap.add(this.nodeType.If, ifNodeTemplate);
        templmap.add(this.nodeType.StartJoint, startJointNodeTemplate);
        templmap.add("", this.diagram.nodeTemplate);

        this.diagram.nodeTemplateMap = templmap;
        this.diagram.nodeTemplate = startNodeTemplate;
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
            
            group.data.group = "Start";


            //group.text = "stateMent";
            
            console.log("Collspand");
        }
        else {
            console.log("Expand");
        } 
    },

    initNode: function() {
        this.initModel();
    },

    initModel: function() {

        var nodeDataArray = [
            { key: "Start", ntp: "start" },
            
            { key: "89", ntp: "", isGroup: true },
                { key: "90", ntp: "", isGroup: true, group: "89" },
                { key: "91", ntp: "", isGroup: true, group: "89" },
                    // { key: "IF", ntp: "", group: "91" },
                    // { key: "92", ntp: "", isGroup: true, group: "91" },
                    // { key: "93", ntp: "", isGroup: true, group: "91" },
                    // { key: "ENDIF", ntp: "", group: "91" },

                //{ key: "94", ntp: "", isGroup: true, group: "89" },

            // Node
            { key: "p256", category : router.currentView.contentView.nodeType.StartJoint, ntp: "db.CallSPDAO", group: "90" },
            { key: "p257", category : router.currentView.contentView.nodeType.Statement, ntp: "db.CallSPDAO", group: "90" },
            { key: "p258", category : router.currentView.contentView.nodeType.Statement, ntp: "db.CallSPDAO", group: "90" },
            { key: "p259", category : router.currentView.contentView.nodeType.Statement, ntp: "db.CallSPDAO", group: "90" },
            { key: "p268", category : router.currentView.contentView.nodeType.StartJoint, ntp: "db.CallSPDAO", group: "90" },

            //{ key: "p260", category : "state", ntp: "callSP()", group: "92" },

            { key: "End", ntp: "end"}
            ];

            var linkDataArray = [
            { from: "Start", to: "89" },
            
            //{ from: "p256", to: "p257" },
            { from: "p257", to: "p258" },
            { from: "p258", to: "p259" },
            //{ from: "p259", to: "p268" },
            
            { from: "90", to: "91" },   // "p260 to 91"


            // { from: "IF", to: "92" },
            // { from: "IF", to: "93" },
            // { from: "92", to: "ENDIF" },
            // { from: "93", to: "ENDIF" },

            { from: "89", to: "End" }

            ];

        this.diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    },

    
    initTemplate: function() {
        this.initNodeTemplate();
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