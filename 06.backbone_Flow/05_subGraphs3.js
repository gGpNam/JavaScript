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
            this.FlowLinkData = [];

            this.blockType = {
                None: "",
                Statement: "StatementBlock",
                If: "IF",
                Loop: "LOOP_loop",
                LoopWhile: "LOOP_while",
                LoopFor: "LOOP_for",
                LoopDo: "LOOP_do",
                TryCatchFinally: "TryCatchFinally",
                Try: "TryBlock",
                CatchGroup: "CatchGroup",
                CatchList: "CatchList",
                CatchBlock: "CatchBlock",
                Finally: "FinallyBlock"
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
                Bottom: "Bottom",
                Left: "Left",
                Right: "Right"
            };
        },
        
        properties: {
            highlightMemoNodeColor : "MediumBlue",
            defaultJointColor: "#FFFFFF",
            defaultFont: "9pt arial, meiryo, 'nanum gothic'",
            collapseFont: "Bold 12pt arial, meiryo, 'nanum gothic'",
            diagramPaddingTop: 70
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
            //this.diagram.addModelChangedListener(this.loggingMap);
        },
        
        initNodeTemplate: function() {
        var stateBlockTemplate = this.$go(go.Node, "Auto", {maxSize: new go.Size(100, 40)},
                                      this.nodeStype(),
                                      this.$go(go.Panel, "Auto", {maxSize: new go.Size(100, 40)},  
                                               this.$go(go.Shape, "Diamond",
                                                        {
                                                            minSize: new go.Size(100, 40),
                                                            fill: "#79C900",
                                                            stroke: null,
                                                         }),
                                               this.$go(go.TextBlock, "IF",
                                                        {
                                                            font: this.properties.defaultFont,
                                                            stroke: "black",
                                                            isMultiline: true,
                                                            maxSize: new go.Size(100, 40),
                                                        },
                                                        new go.Binding("text", "name"))));



            var templmap = new go.Map("string", go.Node);

            // TODO: this.NodeType 의 타입만큼 템플릿을 작성해야 함.
            templmap.add(this.nodeType.Statement, stateBlockTemplate);
            templmap.add("", stateBlockTemplate);

            this.diagram.nodeTemplateMap = templmap;
            this.diagram.nodeTemplate = stateBlockTemplate;
        },

        initLinkTemplate: function() {
                    var defaultLinkTemplate = this.$go(go.Link,
                                           {
                                               //curve: go.Link.JumpGap, // 속성 추가시 그룹 접을때 오류발생.
                                               routing: go.Link.AvoidsNodes,
                                               corner: 5, 
                                               fromShortLength: 0,
                                               toShortLength: 4,
                                               //fromEndSegmentLength: 65,
                                               //toEndSegmentLength: 30,
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

        initGroupTemplate: function() {
        var defaultGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.layoutStyle(),
                                                //isSubGraphExpanded: true,
                                                subGraphExpandedChanged: this.subGraphExpandedChanged,
                                                //subGraphExpanded: this.subGraphExpanded,
                                                //computesBoundsIncludingLinks: false
                                            },
                                            new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                            this.$go(go.Shape,
                                                     new go.Binding("figure", "figure"),
                                                     //new go.Binding("width", "width").makeTwoWay(),
                                                     //new go.Binding("height", "height").makeTwoWay(),
                                                     { fill: "rgba(128,128,128,0.13)" }),
                                            this.$go(go.Panel, "Vertical",  { defaultAlignment: go.Spot.Left, margin: 5  },
                                                    this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top  },
                                                                this.$go("SubGraphExpanderButton"),
                                                                this.$go(go.TextBlock, 
                                                                         {
                                                                             font: this.properties.defaultFont,
                                                                             margin: 4 ,
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
                                                subGraphExpandedChanged: this.subGraphExpandedChanged,
                                                //subGraphExpanded: this.subGraphExpanded,
                                                //wasSubGraphExpanded: this.wasSubGraphExpanded,
                                            },
                                            new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                            this.$go(go.Shape, "MultiProcess",
                                                        { width: 150, height: 50, parameter1: 5, fill: "rgba(128,128,128,0.23)" }),
                                            this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                                        this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top },
                                                                this.$go("SubGraphExpanderButton"),
                                                                this.$go(go.TextBlock, 
                                                                        { font: this.properties.collapseFont, text: "Statement", verticalAlignment: go.Spot.Center,
                                                                        alignment: go.Spot.Center })
                                                                )));

        var ifCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                {
                                    layout: this.$go(go.TreeLayout, { angle: 90 }),
                                    subGraphExpandedChanged: this.subGraphExpandedChanged
                                },
                                new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                this.$go(go.Shape, "Decision", 
                                            { width: 150, height: 50, parameter1: 5, fill: "#79C900" }),
                                this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                            this.$go(go.Panel, "Horizontal",
                                                    { defaultAlignment: go.Spot.Top },
                                                    this.$go("SubGraphExpanderButton"),  
                                                    this.$go(go.TextBlock, 
                                                            { font: this.properties.collapseFont, text: "If", verticalAlignment: go.Spot.Center,
                                                            alignment: go.Spot.Center })
                                                    )));



                                                        
            var groupTemplateMap = new go.Map("string", go.Group);
            groupTemplateMap.add("", defaultGroupTemplate);
            groupTemplateMap.add("Collapsed", collapseGroupTemplate);
            groupTemplateMap.add("Expand", ifCollapseGroupTemplate);

            this.diagram.groupTemplateMap = groupTemplateMap;
        },

        subGraphExpandedChanged: function(group) {
            console.log("subGraphExpandedChanged");

            try {
                router.currentView.contentView.diagram.startTransaction("changeCategory");

                if (group.isSubGraphExpanded === true) {
                    //group.data.figure = "RoundedRectangle";
                    //group.category = "";
                    router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, "");

                } else {
                    //group.data.figure = "Decision";
                    //group.category = "Collapsed";
                    router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, "Collapsed");
                }

                
                router.currentView.contentView.diagram.layoutDiagram(true);


            } catch(err) {
                console.log(err.message);
            } finally {
                router.currentView.contentView.diagram.commitTransaction("changeCategory");
            }

            //router.currentView.contentView.diagram.requestUpdate(); 
            //router.currentView.contentView.diagram.model.setCategoryForNodeData(); 
            // var shp = grp.selectionObject;
            // if (grp.diagram.undoManager.isUndoingRedoing) return;
            // if (grp.isSubGraphExpanded === true) {
            //     //group.expandSubGraph();
            //     //group.data.figure = "RoundedRectangle";
            //     shp.width = grp._savedBreadth;
            //     //router.currentView.contentView.diagram.requestUpdate(); 
            //     //group.category = "";
            //     //group.expandSubGraph();
            //     //group.width = NaN;
            //     //group.height = NaN;
            // } else {
            //     grp._savedBreadth = shp.width;
            //     shp.width = NaN;
            //     //group.category = "Collapsed";
            // }

            //     group.category = "Collapsed";
            // }
            // else {
            //     //group.data.isSubGraphExpanded = true;
            //     //group.data.figure = "RoundedRectangle";

            //     group.category = "";
 
            //     //group.expandSubGraph();
            // }
        },

        initNode: function() {
            var rootCell = {};
            rootCell.cid = "1"
            rootCell.isGroup = true,
            rootCell.name = "ROOT"
            rootCell.group = "-12";
            //rootCell.category = "";
            //rootCell.type = "Statement";
            rootCell.figure = "RoundedRectangle";
            rootCell.category = "";
            rootCell.isSubGraphExpanded = true;
            router.currentView.contentView.FlowChartData.push(rootCell);

            var folder1 = {};
            folder1.cid = "2"
            folder1.isGroup = true,
            folder1.name = "STATEMENT"
            folder1.group = "1";
            //folder1.width = 150;
            //folder1.height = 50;

            //folder1.type = "StatementBlock11";
            folder1.figure = "RoundedRectangle";
            folder1.category = "Collapsed";
            folder1.isSubGraphExpanded = false;
            router.currentView.contentView.FlowChartData.push(folder1);

            var folder2 = {};
            folder2.cid = "3"
            folder2.isGroup = true,
            folder2.name = "STATEMENT"
            folder2.group = "1";
            folder2.category = "Collapsed";
            folder2.isSubGraphExpanded = false;
            router.currentView.contentView.FlowChartData.push(folder2);

            var child1 = {};
            child1.cid = "21"
            child1.isGroup = false,
            child1.name = "AAAA"
            child1.group = "2";
            child1.category = "State";
            child1.isSubGraphExpanded = true;
            router.currentView.contentView.FlowChartData.push(child1);

            router.currentView.contentView.initModel();

            router.currentView.contentView.diagram.model.addNodeDataCollection(router.currentView.contentView.FlowChartData);
            router.currentView.contentView.diagram.model.addLinkDataCollection(router.currentView.contentView.FlowLinkData);
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
            //this.initMemoTemplate();
            this.initGroupTemplate();
        },

        initComponents: function() {
            this.initDiagram();
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
