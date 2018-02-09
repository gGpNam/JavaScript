var router = {
    currentView: {
        contentView: {
        }
    }
}

$(function() {
var FlowDiagramView =  Backbone.View.extend({
    initialize: function() {
        this.CONTEXT_MENU_ITEM_TEMPLATE = "<div class='diagram-context-menu-item'>\
            <div class='cm-float-left diagram-context-menu-front-icon icon'><%= leftIcon %></div>\
            <div class='cm-float-left diagram-context-menu-item-text'><%= menuText %></div>\
            <div class='cm-float-right diagram-context-menu-extend-icon icon <%= rightIcon %>'></div>\
            </div>";
        this.FlowChartTreeData = [];
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
            Finally: "FinallyBlock",
            Switch: "SWITCH",
            Case: "caseBlock"
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
        defaultFont: "9pt arial, meiryo, 'nanum gothic'",
        collapseFont: "Bold 12pt arial, meiryo, 'nanum gothic'",
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
            columnSpacing: 10,
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

    
    insertMemo: function() {
        var memo_data = {
            category: "memo",
            text: "Input Data",
            color: "gold",
            loc: this.diagram.lastInput.documentPoint.x.toString() + " " + this.diagram.lastInput.documentPoint.y.toString()
        };

        this.diagram.model.addNodeData(memo_data);
    },

    toggleShowOverview: function() {
        targetEl = $(".diagram-overview-container");

        if (targetEl.hasClass("cm-hide")) {
            targetEl.removeClass("cm-hide");
            $(".cm-classdiagram-toolbar-overview-btn").addClass("dl-default-icon-btn-selected");
        } else {
            targetEl.addClass("cm-hide");
            $(".cm-classdiagram-toolbar-overview-btn").removeClass("dl-default-icon-btn-selected");
        }
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
        var targetEl = $(".diagram-overview-content")[0];
        var overview = this.$go(go.Overview, targetEl, { observed: this.diagram, contentAlignment: go.Spot.Center });
        overview.box.elt(0).stroke = "cadetblue";
        overview.box.elt(0).strokeWidth = 0.5;
        overview.drawsTemporaryLayers = false;

        targetEl = $(".diagram-overview-title");
        targetEl.text = "overview";
        targetEl = $(".diagram-overview-container");
        // targetEl.draggable({
        //     containment: $(".diagram-content-container")
        // });
        targetEl = $(".diagram-overview-closebtn");
        targetEl.bind('click', this.toggleShowOverview);

        this.toggleShowOverview();

        // if (!GTSaasCM.Constant.Diagram.Default.isShowOverview) {
        //     this.toggleShowOverview();
        // }
    },

    initTools: function() {
        this.diagram.toolManager.hoverDelay = 500;
        this.diagram.toolManager.toolTipDuration = 10000;
    },

    // BOOKMARK: TEMPLATE > initNodeTemplate
    initNodeTemplate: function() {

        var defaultToolTip = this.$go(go.Adornment, "Auto", 
                                      new go.Binding("visible", "tooltip", function(t) { return t.length > 0; }),
                                      this.$go(go.Shape, { fill: "#FFFFCC" }),
                                      this.$go(go.TextBlock,
                                               {
                                                    font: this.properties.defaultFont,
                                                    stroke: "black",
                                                    textAlign: "left",
                                                    margin: new go.Margin(2, 2, 2, 2),
                                                    width: 300,
                                                    wrap: go.TextBlock.WrapDesiredSize
                                                },
                                                new go.Binding("text", "name")));

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
                                                  })));
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
                                          {
                                              doubleClick: function(e, node) {
                                                  router.currentView.contentView.onNodeDoubleClick(e, node.part);
                                              }
                                          },
                                          this.nodeStype(),
                                          this.$go(go.Shape, "RoundedRectangle", 
                                                   {
                                                       fill: "gold",
                                                       minSize: new go.Size(150, 20)
                                                    }),
                                          this.$go(go.TextBlock,
                                                   {
                                                       font: this.properties.defaultFont,
                                                       margin: 5,
                                                       stroke: "black",
                                                       isMultiline: true,
                                                       maxSize: new go.Size(200, 100),
                                                       //maxSize: new go.Size(160, NaN),
                                                   },
                                                   new go.Binding("text", "name")),
                                          {
                                              toolTip: defaultToolTip
                                          });
        var ifNodeTemplate = this.$go(go.Node, "Auto", {maxSize: new go.Size(100, 40)},
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
                                                        new go.Binding("text", "name")),
                                      {
                                          toolTip: defaultToolTip
                                      }));
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
                                                               stroke: "whitesmoke",
                                                               maxSize: new go.Size(100, 40),
                                                           },
                                                           new go.Binding("text", "name"))),
                                        {
                                                toolTip: defaultToolTip
                                        });

        var breakBlockTemplate = this.$go(go.Node, "Auto",
                                          {
                                              doubleClick: function(e, node) {
                                                  router.currentView.contentView.onNodeDoubleClick(e, node.part);
                                              }
                                          },
                                          this.nodeStype(),
                                          this.$go(go.Shape, "RoundedRectangle", 
                                                   {
                                                       fill: "gold",
                                                       minSize: new go.Size(150, 20)
                                                    }),
                                          this.$go(go.TextBlock,
                                                   {
                                                       font: this.properties.defaultFont,
                                                       margin: 5,
                                                       stroke: "black",
                                                       isMultiline: true,
                                                       maxSize: new go.Size(200, 100),
                                                       //maxSize: new go.Size(160, NaN),
                                                   },
                                                   new go.Binding("text", "name")),
                                          {
                                              toolTip: defaultToolTip
                                          });

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
        templmap.add(this.nodeType.Break, breakBlockTemplate);
        templmap.add("", this.diagram.nodeTemplate);

        this.diagram.nodeTemplateMap = templmap;
        this.diagram.nodeTemplate = startNodeTemplate;
    },

    // BOOKMARK: TEMPLATE > initLinkTemplate
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
                                                                 editable: false
                                                              },
                                                    new go.Binding("text", "text"))));
        var linkTemplateMap = new go.Map("string", go.Link);
        linkTemplateMap.add("", defaultLinkTemplate);
        this.diagram.linkTemplateMap = linkTemplateMap;
    },
    
    initMemoTemplate: function() {
        var memoSelectionAdornmentTemplate = this.$go(go.Adornment,
                                                      "Spot",
                                                      this.$go(go.Panel,
                                                               "Auto",
                                                               this.$go(go.Shape, { fill: null, stroke: this.properties.highlightMemoNodeColor, strokeWidth: 2.0 }),
                                                               this.$go(go.Placeholder)));
        var memoNodeTemplate = this.$go(go.Node,
                                        "Auto",
                                        {
                                           resizable: true,
                                           layerName: "MemoLayer",
                                           isShadowed: true,
                                           shadowBlur: 3,
                                           shadowColor: "rgba(0, 0, 0, 0.4)",
                                           shadowOffset: new go.Point(4, 4),
                                           selectionAdornmentTemplate: memoSelectionAdornmentTemplate
                                        },
                                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                                        this.$go(go.Shape,
                                                 "RoundedRectangle",
                                                 {
                                                    strokeWidth: 1,
                                                    stroke: "black",
                                                    fill: "Wheat"
                                                 },
                                                 new go.Binding("fill", "color")),
                                        this.$go(go.TextBlock,
                                                 {
                                                    margin: 8,
                                                    editable: true,
                                                    textValidation: function(o, oldString, newString) {
                                                        o.part.data.text = newString;
                                                        return true;
                                                    }
                                                 },
                                                 new go.Binding("text", "text")));

        this.diagram.nodeTemplateMap.add("memo", memoNodeTemplate);
    },
    
    // BOOKMARK: TEMPLATE > initGroupTemplate
    initGroupTemplate: function() {
        var defaultGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.layoutStyle(),
                                                subGraphExpandedChanged: this.subGraphExpandedChanged,
                                                //computesBoundsIncludingLinks: false
                                            },
                                            new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                            this.$go(go.Shape, "RoundedRectangle",
                                                        { parameter1: 10, fill: "rgba(128,128,128,0.13)" }),
                                            this.$go(go.Panel, "Vertical",  { defaultAlignment: go.Spot.Left },
                                                    this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top  },
                                                                this.$go("SubGraphExpanderButton"),
                                                                this.$go(go.TextBlock, 
                                                                         { 
                                                                             font: this.properties.defaultFont,
                                                                             wrap: go.TextBlock.WrapFit,
                                                                             visible: true,
                                                                         },
                                                                         new go.Binding("text", "cid")
                                                                    )
                                                                ),
                                                    this.$go(go.Placeholder,
                                                                { padding: new go.Margin(0, 10), alignment: go.Spot.Center })));

        var catchGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.layoutStyle(),
                                                subGraphExpandedChanged: this.subGraphExpandedChanged
                                            },
                                            new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                            this.$go(go.Shape, "RoundedRectangle",
                                                        { parameter1: 10, fill: "rgba(128,128,128,0.13)" }),
                                            this.$go(go.Panel, "Vertical",  { defaultAlignment: go.Spot.Left },
                                                    this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top  },
                                                                this.$go("SubGraphExpanderButton"),
                                                                this.$go(go.TextBlock, 
                                                                        { 
                                                                            font: this.properties.defaultFont,
                                                                            wrap: go.TextBlock.WrapFit,
                                                                            visible: true,
                                                                            isMultiline: true,
                                                                            maxSize: new go.Size(180, NaN), 
                                                                        },
                                                                        new go.Binding("text", "name"),
                                                                    ),
                                                                ),
                                                    this.$go(go.Placeholder,
                                                                { padding: new go.Margin(0, 10), alignment: go.Spot.Center })));

        var collapseGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.layoutStyle(),
                                                isSubGraphExpanded: false,
                                                subGraphExpandedChanged: this.subGraphExpandedChanged,
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
                                    layout:  this.layoutStyle(),
                                    isSubGraphExpanded: false,
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
        var loopWhileCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                {
                                    layout: this.layoutStyle(),
                                    isSubGraphExpanded: false,
                                    subGraphExpandedChanged: this.subGraphExpandedChanged
                                },
                                new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                this.$go(go.Shape, "LoopLimit", 
                                            { width: 150, height: 50, parameter1: 5, fill: "#79C900" }),
                                this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                            this.$go(go.Panel, "Horizontal",
                                                    { defaultAlignment: go.Spot.Top },
                                                    this.$go("SubGraphExpanderButton"),  
                                                    this.$go(go.TextBlock, 
                                                            { font: this.properties.collapseFont, text: "Loop", verticalAlignment: go.Spot.Center,
                                                            alignment: go.Spot.Center })
                                                    )));
        var loopDoCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                {
                                    layout: this.layoutStyle(),
                                    isSubGraphExpanded: false,
                                    subGraphExpandedChanged: this.subGraphExpandedChanged
                                },
                                new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                this.$go(go.Shape, "LoopLimit", 
                                            { width: 150, height: 50, parameter1: 5, fill: "#79C900" }),
                                this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                            this.$go(go.Panel, "Horizontal",
                                                    { defaultAlignment: go.Spot.Top },
                                                    this.$go("SubGraphExpanderButton"),  
                                                    this.$go(go.TextBlock, 
                                                            { font: this.properties.collapseFont, text: "LoopDo", verticalAlignment: go.Spot.Center,
                                                            alignment: go.Spot.Center })
                                                    )));

        var tryCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.layoutStyle(),
                                                isSubGraphExpanded: false,
                                                subGraphExpandedChanged: this.subGraphExpandedChanged
                                            },
                                            new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                            this.$go(go.Shape, "Rectangle",
                                                        { width: 150, height: 50, parameter1: 5, fill: "rgba(128,128,128,0.33)" }),
                                            this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                                        this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top },
                                                                this.$go("SubGraphExpanderButton"), 
                                                                this.$go(go.TextBlock, 
                                                                        { font: this.properties.collapseFont, text: "Try", verticalAlignment: go.Spot.Center,
                                                                        alignment: go.Spot.Center })
                                                                )));

        var tryCatchCollapseTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.layoutStyle(),
                                                isSubGraphExpanded: false,
                                                subGraphExpandedChanged: this.subGraphExpandedChanged
                                            },
                                            new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                            this.$go(go.Shape, "Rectangle",
                                                        { width: 150, height: 50, parameter1: 5, fill: "rgba(128,128,128,0.33)" }),
                                            this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                                        this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top },
                                                                this.$go("SubGraphExpanderButton"), 
                                                                this.$go(go.TextBlock, 
                                                                        { font: this.properties.collapseFont, text: "TryCatch", verticalAlignment: go.Spot.Center,
                                                                        alignment: go.Spot.Center })
                                                                )));

        var catchListCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.layoutStyle(),
                                                isSubGraphExpanded: false,
                                                subGraphExpandedChanged: this.subGraphExpandedChanged
                                            },
                                            new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                            this.$go(go.Shape, "MultiProcess",
                                                        { width: 150, height: 50, parameter1: 5, fill: "rgba(128,128,128,0.33)" }),
                                            this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                                        this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top },
                                                                this.$go("SubGraphExpanderButton"), 
                                                                this.$go(go.TextBlock, 
                                                                        { font: this.properties.collapseFont, text: "CatchList", verticalAlignment: go.Spot.Center,
                                                                        alignment: go.Spot.Center })
                                                                )));
        var catchBlockCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.layoutStyle(),
                                                isSubGraphExpanded: false,
                                                subGraphExpandedChanged: this.subGraphExpandedChanged
                                            },
                                            new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                            this.$go(go.Shape, "Rectangle",
                                                        { width: 150, height: 50, parameter1: 5, fill: "rgba(128,128,128,0.33)" }),
                                            this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                                        this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top },
                                                                this.$go("SubGraphExpanderButton"), 
                                                                this.$go(go.TextBlock, 
                                                                        { font: this.properties.collapseFont, text: "Catch", verticalAlignment: go.Spot.Center,
                                                                        alignment: go.Spot.Center })
                                                                )));
        var finallyCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.layoutStyle(),
                                                isSubGraphExpanded: false,
                                                subGraphExpandedChanged: this.subGraphExpandedChanged
                                            },
                                            new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                            this.$go(go.Shape, "Rectangle",
                                                        { width: 150, height: 50, parameter1: 5, fill: "rgba(128,128,128,0.33)" }),
                                            this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                                        this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top },
                                                                this.$go("SubGraphExpanderButton"), 
                                                                this.$go(go.TextBlock, 
                                                                        { font: this.properties.collapseFont, text: "Finally", verticalAlignment: go.Spot.Center,
                                                                        alignment: go.Spot.Center })
                                                                )));

        var switchCollapseGroupTemplate = this.$go(go.Group, "Auto",
                                            {
                                                layout: this.layoutStyle(),
                                                isSubGraphExpanded: false,
                                                subGraphExpandedChanged: this.subGraphExpandedChanged
                                            },
                                            new go.Binding("isSubGraphExpanded").makeTwoWay(),
                                            this.$go(go.Shape, "Output",
                                                        { width: 150, height: 50, parameter1: 5, fill: "#79C900" }),
                                            this.$go(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
                                                        this.$go(go.Panel, "Horizontal",
                                                                { defaultAlignment: go.Spot.Top },
                                                                this.$go("SubGraphExpanderButton"), 
                                                                this.$go(go.TextBlock, 
                                                                        { font: this.properties.collapseFont, text: "Switch", verticalAlignment: go.Spot.Center,
                                                                        alignment: go.Spot.Center })
                                                                )));

        var groupTemplateMap = new go.Map("string", go.Group);
        groupTemplateMap.add(this.blockType.None, defaultGroupTemplate);
        groupTemplateMap.add(this.blockType.CatchGroup, catchGroupTemplate);
        groupTemplateMap.add(this.blockType.Try, tryCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.TryCatchFinally, tryCatchCollapseTemplate);
        groupTemplateMap.add(this.blockType.Statement, collapseGroupTemplate);
        groupTemplateMap.add(this.blockType.If, ifCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.LoopWhile, loopWhileCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.LoopDo, loopDoCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.CatchList, catchListCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.CatchBlock , catchBlockCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.Finally, finallyCollapseGroupTemplate);
        groupTemplateMap.add(this.blockType.Switch, switchCollapseGroupTemplate);
        this.diagram.groupTemplateMap = groupTemplateMap;
    }, 

    // BOOKMARK: FUNC > subGraphExpandedChanged
    subGraphExpandedChanged: function(group) {
        try {
            router.currentView.contentView.diagram.startTransaction("changeCategory");
            if (group.isSubGraphExpanded) {
                if(group.data.type === router.currentView.contentView.blockType.CatchBlock ||
                   group.data.type === router.currentView.contentView.blockType.Case)
                    router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, router.currentView.contentView.blockType.CatchGroup);
                else 
                    router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, "");
            } else {
                switch(group.data.type) {
                    case router.currentView.contentView.blockType.Statement:
                        router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, router.currentView.contentView.blockType.Statement);
                        break;
                    case router.currentView.contentView.blockType.If:
                        router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, router.currentView.contentView.blockType.If);
                        break;
                    case router.currentView.contentView.blockType.Loop:
                    case router.currentView.contentView.blockType.LoopWhile:
                    case router.currentView.contentView.blockType.LoopFor:
                        router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, router.currentView.contentView.blockType.LoopWhile);
                        break;
                    case router.currentView.contentView.blockType.LoopDo:
                        router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, router.currentView.contentView.blockType.LoopDo);
                        break;
                    case router.currentView.contentView.blockType.TryCatchFinally:
                        router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, router.currentView.contentView.blockType.TryCatchFinally);
                        break;
                    case router.currentView.contentView.blockType.Try:
                        router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, router.currentView.contentView.blockType.Try);
                        break;
                    case router.currentView.contentView.blockType.CatchList:
                        router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, router.currentView.contentView.blockType.CatchList);
                        break;
                    case router.currentView.contentView.blockType.Finally:
                        router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, router.currentView.contentView.blockType.Finally);
                        break;
                    case router.currentView.contentView.blockType.Switch:
                        router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, router.currentView.contentView.blockType.Switch);
                        break;
                    default:
                        router.currentView.contentView.diagram.model.setCategoryForNodeData(group.data, router.currentView.contentView.blockType.Statement);
                        break;
                }
            }
            router.currentView.contentView.diagram.layoutDiagram(true);
        } catch(err) {
            console.log(err.message);
        } finally {
            router.currentView.contentView.diagram.commitTransaction("changeCategory");
        }
    },

    onNodeDoubleClick : function(e, node) {
        var routerPath = "project/" + router.currentView.contentView.projectId + "/" + router.currentView.contentView.sid + "/source/viewer/" + router.currentView.contentView.path + "/" + node.data.sln;
        router.navigate(routerPath, {trigger: true, replace: false});
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
        this.initLinkData(response.edge, response.node);
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
                child.name = child.btp;
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
                node.txt = text[0].txt;
        });

        _.each(block.children, function(_block){
            router.currentView.contentView.fillText(_block, textList);
        });
    },

    // BOOKMARK INIT > initLinkData
    initLinkData: function(edgeList, nodeList) {
        _.each(router.currentView.contentView.FlowChartTreeData, function(object) {
            router.currentView.contentView.fillEdge(object.block, edgeList, nodeList);
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

    findBlockOfNode: function(nid) {
        for(var i=0; router.currentView.contentView.FlowChartTreeData.length > i; i++){
            var object = router.currentView.contentView.FlowChartTreeData[i];
            
            if(!_.isUndefined(object.block)) {
                var block = router.currentView.contentView.findBlockOfNid(object.block, nid);
                if(!_.isUndefined(block))
                    return block;
            }
        }
    },

    findBlockOfNid: function(block, nid) {
        var findNode = _.find(block.node, { nid: nid });
        
        if(!_.isUndefined(findNode))
            return block;

        if(_.isUndefined(block.children))
            return;

        for(var i=0; block.children.length > i; i++){
            var child = block.children[i];

            findNode = router.currentView.contentView.findBlockOfNid(child, nid);
            if(!_.isUndefined(findNode))
                return findNode;
        }
    },

    findBlock: function(bid) {
        for(var i=0; router.currentView.contentView.FlowChartTreeData.length > i; i++){
            var object = router.currentView.contentView.FlowChartTreeData[i];
            
            if(!_.isUndefined(object.block)) {
                var block = router.currentView.contentView.findBlockObj(object.block, bid);

                if(!_.isUndefined(block))
                    return block;
            }
        }
    },

    findBlockObj: function(block, bid) {
        if(block.bid === bid) 
            return block;

        if(_.isUndefined(block.children))
            return;

        var findBlock = _.find(block.children, function(_block) { return  _block.bid === bid});
        if(!_.isUndefined(findBlock)) 
            return findBlock;

        for(var i=0; block.children.length > i; i++){
            var children = block.children[i];
            var result = router.currentView.contentView.findBlockObj(children, bid);
            if(!_.isUndefined(result))
                return result;
        }
    },

    // #endregion

    // #region function
    // BOOKMARK TYPE > getBlockType
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

            case "LOOP_loop_START":
                return router.currentView.contentView.nodeType.StartJoint;
            case "LOOP_loop_END":
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
                return router.currentView.contentView.nodeType.Loop;
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
            case "break":
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
    
    findNode: function(nid) {
        _.each(router.currentView.contentView.FlowChartTreeData, function(object) {

            var node = router.currentView.contentView.findNodeInBlock(object.block, nid);

            if(!_.isUndefined(node))
                return node;
        });
    },

    findNodeInBlock: function(block, nid) {
        if(_.isUndefined(block))
            return;

        var findNode = _.find(block.node, { nid: nid } );
        
        if(!_.isUndefined(findNode)) {
            return findNode;
        } else {
            _.each(block.children, function(_block){
                router.currentView.contentView.findNodeInBlock(_block, nid);
            });
        }
    },

    // #endregion

    // BOOKMARK: MAKE > makeBlock
    makeBlock: function(objectId) {
        //router.currentView.contentView.clearData();
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

        _.each(object.block.edge, function(edge) {
            router.currentView.contentView.addEdgeCell(edge);
        });

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

        //router.currentView.contentView.diagram.model.addNodeDataCollection(router.currentView.contentView.FlowChartData);
        //router.currentView.contentView.diagram.model.addLinkDataCollection(router.currentView.contentView.FlowLinkData);

    },

    // BOOKMARK: MAKE > makeSubBlock
    makeSubBlock: function(subBlock) {
        var type = router.currentView.contentView.getBlockType(subBlock.btp);
        if(type === router.currentView.contentView.blockType.Statement) {
            this.makeStateMentBlock(subBlock);
        } else if(type === router.currentView.contentView.blockType.If) {
            this.makeIfElseBlock(subBlock);
        } else if(type === router.currentView.contentView.blockType.Loop) {
            this.makeLoopWhileBlock(subBlock);
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
        } else if(type ===  router.currentView.contentView.blockType.Finally) {
            this.makeFinallyBlock(subBlock);
        } else if(type ===  router.currentView.contentView.blockType.Switch) {
            this.makeSwitchBlock(subBlock);
        } else if(type === router.currentView.contentView.blockType.Case) {
            this.makeCaseBlock(subBlock);
        }
    },

    makeSubLink: function(subBlock) {
        var block = subBlock;
        _.each(subBlock.node, function(node) {
            var type = router.currentView.contentView.getNodeType(node.ntp);
            if(type === router.currentView.contentView.nodeType.EndJoint) {
                var edge = _.find(block.edge, { fnid : node.nid });
                
                if(_.isUndefined(edge))
                    return;

                edge.fnid = edge.fbid;
                edge.tnid = edge.tbid;

                if(edge.tbid === block.pbid)
                    return;

                console.log(edge.fnid + " -> " + edge.tnid );
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
    //         link.fromSpot = router.currentView.contentView.spotType.Bottom;
    //         link.toSpot = router.currentView.contentView.spotType.Top;
            
    //         router.currentView.contentView.FlowLinkData.push(link);
    //     });
    // },

    // BOOKMARK: ADD > addBlockCell
    addBlockCell: function(block) {
        var blockCell = {};
        blockCell.cid = block.bid;
        blockCell.isGroup = true,
        blockCell.group = block.pbid;
        blockCell.name = block.name;
        blockCell.isSubGraphExpanded = false;
        blockCell.type = router.currentView.contentView.getBlockType(block.btp);

        this.setCategory(blockCell);
        // if(blockCell.type ===  router.currentView.contentView.blockType.CatchBlock) {
        //     blockCell.category = router.currentView.contentView.blockType.CatchGroup;
        // } else {
        //     blockCell.category = router.currentView.contentView.blockType.None;
        // }

        router.currentView.contentView.FlowChartData.push(blockCell);
    },

    setCategory: function(blockCell) {
        switch(blockCell.type) {
            case router.currentView.contentView.blockType.Statement:
                blockCell.category = router.currentView.contentView.blockType.Statement;
                break;
            case router.currentView.contentView.blockType.If:
                blockCell.category = router.currentView.contentView.blockType.If;
                break;
            case router.currentView.contentView.blockType.Loop:
            case router.currentView.contentView.blockType.LoopWhile:
            case router.currentView.contentView.blockType.LoopFor:
                blockCell.category = router.currentView.contentView.blockType.LoopWhile;
                break;
            case router.currentView.contentView.blockType.LoopDo:
                blockCell.category = router.currentView.contentView.blockType.LoopDo;
                break;
            case router.currentView.contentView.blockType.TryCatchFinally:
                blockCell.category = router.currentView.contentView.blockType.TryCatchFinally;
                break;
            case router.currentView.contentView.blockType.Try:
                blockCell.category = router.currentView.contentView.blockType.Try;
                break;
            case router.currentView.contentView.blockType.CatchList:
                blockCell.category = router.currentView.contentView.blockType.CatchList;
                break;
            case router.currentView.contentView.blockType.CatchBlock:
                blockCell.category = router.currentView.contentView.blockType.CatchGroup;
                break;
            case router.currentView.contentView.blockType.Finally:
                blockCell.category = router.currentView.contentView.blockType.Finally;
                break;
            case router.currentView.contentView.blockType.Switch:
                blockCell.category = router.currentView.contentView.blockType.Switch;
                break;
            default:
                blockCell.category = router.currentView.contentView.blockType.None;
                break;
        }
    },

    // BOOKMARK: ADD > addNodeCell
    addNodeCell: function (node) {
        var nodeCell = {};
        nodeCell.cid = node.nid;
        nodeCell.isGroup = false;
        nodeCell.group = node.bid;
        nodeCell.category = router.currentView.contentView.getNodeType(node.ntp);
        nodeCell.name = node.txt;
        nodeCell.sln = node.sln;

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
        link.fromSpot = router.currentView.contentView.spotType.Bottom;
        link.toSpot = router.currentView.contentView.spotType.Top;
        link.visible = false;
        router.currentView.contentView.FlowLinkData.push(link);
    },

    isParentBlock: function(fbid, tbid) {
        var fromBlock = router.currentView.contentView.findBlock(fbid);

        if(fromBlock.pbid === tbid)
            return true;
        else 
            return false;
    },

    // #region makeStateMent 
    // BOOKMARK: MAKE > makeStateMentBlock
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

        router.currentView.contentView.makeStatementLink(block);
    },

    // BOOKMARK: MAKE > makeStatementLink
    makeStatementLink: function(block) {
         _.each(block.edge, function(edge) {
            if(_.isUndefined(edge))
                return;
            
            var link = {};
            var fromNodeType = router.currentView.contentView.getNodeType(edge.fntp);
            if(fromNodeType === router.currentView.contentView.nodeType.StartJoint) {
                link.from = edge.fnid;
                link.to = edge.tnid;
            } else if (fromNodeType === router.currentView.contentView.nodeType.Break){
                link.from = edge.fnid;
                link.to = edge.tnid;
            } else {
                if(edge.fbid === edge.tbid) {
                    link.from = edge.fnid;
                    link.to = edge.tnid;
                } else {
                    if(router.currentView.contentView.isParentBlock(edge.fbid, edge.tbid)) {
                        link.from = edge.fbid;
                        link.to = edge.tnid;
                    } else {
                        link.from = edge.fbid;
                        link.to = edge.tbid;
                    }
                }
            }

            link.fromSpot = router.currentView.contentView.spotType.Bottom;
            link.toSpot = router.currentView.contentView.spotType.Top;
            link.visible = false;
            router.currentView.contentView.FlowLinkData.push(link);
        });
    },

    // #endregion
    // #region IfElse 
    // BOOKMARK: MAKE > makeIfElseBlock
    makeIfElseBlock: function(block) {
        var conditionNode = null;
        var endIfNode = null;
        var thenBlock = null;
        var elseBlock = null;
        var haveOnlyThenBlock = true;

        router.currentView.contentView.addBlockCell(block);

        _.each(block.node, function(node) {
            var nodeType = router.currentView.contentView.getNodeType(node.ntp);
            if(nodeType === router.currentView.contentView.nodeType.If) {
                conditionNode = node;
            } else if(nodeType === router.currentView.contentView.nodeType.EndJoint) {
                endIfNode = node;
            } else {
                if(_.isNull(thenBlock)) {
                    thenBlock = node;
                } else {
                    elseBlock = node;
                }
            }

            router.currentView.contentView.addNodeCell(node);
        });
        
        _.each(block.children, function(childBlock) {
            if(_.isNull(thenBlock)) {
                thenBlock = childBlock;
            } else {
                elseBlock = childBlock;
                haveOnlyThenBlock = false;
            }
            router.currentView.contentView.makeSubBlock(childBlock);
        });

        if(haveOnlyThenBlock) {
            var s_then_link = {};
            s_then_link.from = conditionNode.nid;
            s_then_link.to = thenBlock.bid;
            s_then_link.fromSpot = router.currentView.contentView.spotType.Bottom;
            s_then_link.toSpot = router.currentView.contentView.spotType.Top;
            s_then_link.text = "Y";
            s_then_link.visible = true;
            router.currentView.contentView.FlowLinkData.push(s_then_link);

            var s_e_link = {};
            s_e_link.from = conditionNode.nid;
            s_e_link.to = endIfNode.nid;
            s_e_link.fromSpot = router.currentView.contentView.spotType.Right;
            s_e_link.toSpot = router.currentView.contentView.spotType.Right;
            s_e_link.text = "N";
            s_e_link.visible = true;
            router.currentView.contentView.FlowLinkData.push(s_e_link);
        }
        else {
            var s_then_link = {};
            s_then_link.from = conditionNode.nid;
            s_then_link.to = thenBlock.bid;
            s_then_link.fromSpot = router.currentView.contentView.spotType.Bottom;
            s_then_link.toSpot = router.currentView.contentView.spotType.Top;
            s_then_link.text = "Y";
            s_then_link.visible = true;
            router.currentView.contentView.FlowLinkData.push(s_then_link);

            var s_else_link = {};
            s_else_link.from = conditionNode.nid;
            s_else_link.to = elseBlock.bid;
            s_else_link.fromSpot = router.currentView.contentView.spotType.Right;
            s_else_link.toSpot = router.currentView.contentView.spotType.Top;
            s_else_link.text = "N";
            s_else_link.visible = true;
            router.currentView.contentView.FlowLinkData.push(s_else_link);

            // var then_e_link = {};
            // then_e_link.from = thenBlock.bid;
            // then_e_link.to = endIfNode.nid;
            // then_e_link.fromSpot = router.currentView.contentView.spotType.Bottom;
            // then_e_link.toSpot = router.currentView.contentView.spotType.Top;
            // router.currentView.contentView.FlowLinkData.push(then_e_link);

            // var else_e_link = {};
            // else_e_link.from = elseBlock.bid;
            // else_e_link.to = endIfNode.nid;
            // else_e_link.fromSpot = router.currentView.contentView.spotType.Bottom;
            // else_e_link.toSpot = router.currentView.contentView.spotType.Top;
            // router.currentView.contentView.FlowLinkData.push(else_e_link);
        }
        
        router.currentView.contentView.makeIfElseLink(block);
    },

    makeIfElseLink: function(block) {
        _.each(block.edge, function(edge) {
            if(_.isUndefined(edge))
                return;
            
            var link = {};
            var fromNodeType = router.currentView.contentView.getNodeType(edge.fntp);
            if(fromNodeType === router.currentView.contentView.nodeType.EndJoint) {
                if(router.currentView.contentView.isParentBlock(edge.fbid, edge.tbid)) {
                    return;
                }

                link.from = edge.fbid;
                link.to = edge.tbid;
            } else {
                return;
            }

            link.fromSpot = router.currentView.contentView.spotType.Bottom;
            link.toSpot = router.currentView.contentView.spotType.Top;
            link.visible = false;
            router.currentView.contentView.FlowLinkData.push(link);
        });
    },

    // #endregion

    // #region Loop
    // BOOKMARK: MAKE > makeLoopWhileBlock
    makeLoopWhileBlock: function(block) {
        var resultBlock = null;
        var startLoop = null;
        var endLoop = null;
        
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
        
        var loopCondition = router.currentView.contentView.makeLoopConditionNode(block, startLoop.txt);

        _.each(block.children, function(childBlock) {
            resultBlock = childBlock;
            router.currentView.contentView.makeSubBlock(childBlock);
        });

        var startLink = {};
        startLink.from = startLoop.nid;
        startLink.to = loopCondition.cid;
        startLink.fromSpot = router.currentView.contentView.spotType.Bottom;
        startLink.toSpot = router.currentView.contentView.spotType.Top;
        router.currentView.contentView.FlowLinkData.push(startLink);

        var ifLink = {};
        ifLink.from = loopCondition.cid;
        ifLink.to = resultBlock.bid;
        ifLink.fromSpot = router.currentView.contentView.spotType.Bottom;
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

        // var endLink = {};
        // endLink.from = resultBlock.bid;
        // endLink.to = endLoop.nid;
        // endLink.fromSpot = router.currentView.contentView.spotType.Bottom;
        // endLink.toSpot = router.currentView.contentView.spotType.Top; 
        // endLink.visible = false;
        // router.currentView.contentView.FlowLinkData.push(endLink);

        router.currentView.contentView.makeLoopWhileLink(block);
    },

    makeLoopWhileLink: function(block) {
        _.each(block.edge, function(edge) {
            if(_.isUndefined(edge))
                return;
            
            var link = {};
            var fromNodeType = router.currentView.contentView.getNodeType(edge.fntp);
            if(fromNodeType === router.currentView.contentView.nodeType.StartJoint) {
                return;
            } else {
                if(edge.fbid === edge.tbid) {
                    link.from = edge.fnid;
                    link.to = edge.tnid;
                } else {
                    if(router.currentView.contentView.isParentBlock(edge.fbid, edge.tbid)) {
                        link.from = edge.fbid;
                        link.to = edge.tnid;
                    } else {
                        link.from = edge.fbid;
                        link.to = edge.tbid;
                    }
                }
            }

            link.fromSpot = router.currentView.contentView.spotType.Bottom;
            link.toSpot = router.currentView.contentView.spotType.Top;
            link.visible = false;
            router.currentView.contentView.FlowLinkData.push(link);
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
        startLink.fromSpot = router.currentView.contentView.spotType.Bottom;
        startLink.toSpot = router.currentView.contentView.spotType.Top;
        router.currentView.contentView.FlowLinkData.push(startLink);

        var loopLink = {};
        loopLink.from = resultBlock.bid;
        loopLink.to = loopCondition.cid;
        loopLink.fromSpot = router.currentView.contentView.spotType.Bottom;
        loopLink.toSpot = router.currentView.contentView.spotType.Top;
        router.currentView.contentView.FlowLinkData.push(loopLink);

        // var elseLink = {};
        // elseLink.from = loopCondition.cid;
        // elseLink.to = endLoop.nid;
        // elseLink.fromSpot = router.currentView.contentView.spotType.Bottom;
        // elseLink.toSpot = router.currentView.contentView.spotType.Top;
        // elseLink.text = "N";
        // elseLink.visible = true;
        // router.currentView.contentView.FlowLinkData.push(elseLink);
        
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
            if(_.isUndefined(edge))
                return;
            
            var link = {};
            var fromNodeType = router.currentView.contentView.getNodeType(edge.fntp);
            if(fromNodeType === router.currentView.contentView.nodeType.StartJoint) {
                return;
            } else {
                if(edge.fbid === edge.tbid) {
                    link.from = edge.fnid;
                    link.to = edge.tnid;
                } else {
                    if(router.currentView.contentView.isParentBlock(edge.fbid, edge.tbid)) {
                        link.from = edge.fbid;
                        link.to = edge.tnid;
                    } else {
                        link.from = edge.fbid;
                        link.to = edge.tbid;
                    }
                }
            }

            link.fromSpot = router.currentView.contentView.spotType.Bottom;
            link.toSpot = router.currentView.contentView.spotType.Top;
            link.visible = false;
            router.currentView.contentView.FlowLinkData.push(link);
        });
    },

    makeLoopConditionNode: function(block, txt) {
        var nodeCell = {};
        nodeCell.cid = "p" + block.bid + "LOOP_condition";
        nodeCell.isGroup = false;
        nodeCell.group = block.bid;
        nodeCell.category = router.currentView.contentView.nodeType.Loop;
        nodeCell.name = _.isUndefined(txt) ?  "" : txt;
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
        var finallyBlock = null;

        router.currentView.contentView.addBlockCell(block);

        _.each(block.children, function(childBlock) {
            var type = router.currentView.contentView.getBlockType(childBlock.btp);

            if(type === router.currentView.contentView.blockType.Try) {
                tryBlock = childBlock;
                router.currentView.contentView.makeSubBlock(childBlock);
            } else if(type === router.currentView.contentView.blockType.CatchList) {
                catchBlockList = childBlock;
                router.currentView.contentView.makeSubBlock(childBlock);
            } else if(type === router.currentView.contentView.blockType.Finally) {
                finallyBlock = childBlock;
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

        if(_.isNull(finallyBlock)) {
            var start_link = {};
            start_link.from = trycatchfinallyStart.nid;
            start_link.to = tryBlock.bid;
            start_link.fromSpot = router.currentView.contentView.spotType.Bottom;
            start_link.toSpot = router.currentView.contentView.spotType.Top;
            router.currentView.contentView.FlowLinkData.push(start_link);
    
            var try_catch_link = {};
            try_catch_link.from = tryBlock.bid;
            try_catch_link.to = catchBlockList.bid;
            try_catch_link.fromSpot = router.currentView.contentView.spotType.Left;
            try_catch_link.toSpot = router.currentView.contentView.spotType.Top;
            try_catch_link.text = "Exception";
            try_catch_link.visible = true;
            router.currentView.contentView.FlowLinkData.push(try_catch_link);
            
            // var catch__end_link = {};
            // catch__end_link.from = catchBlockList.bid;
            // catch__end_link.to = trycatchfinallyEnd.nid;
            // catch__end_link.fromSpot = router.currentView.contentView.spotType.Bottom;
            // catch__end_link.toSpot = router.currentView.contentView.spotType.Top;
            // router.currentView.contentView.FlowLinkData.push(catch__end_link);
    
            var try_e_link = {};
            try_e_link.from = tryBlock.bid;
            try_e_link.to = trycatchfinallyEnd.nid;
            try_e_link.fromSpot = router.currentView.contentView.spotType.Bottom;
            try_e_link.toSpot = router.currentView.contentView.spotType.Top;
            try_e_link.text = "No Exception";
            try_e_link.visible = true;
            router.currentView.contentView.FlowLinkData.push(try_e_link);
    
            router.currentView.contentView.makeTryCatchFinalLink(block);
        } else {
            var start_link = {};
            start_link.from = trycatchfinallyStart.nid;
            start_link.to = tryBlock.bid;
            start_link.fromSpot = router.currentView.contentView.spotType.Bottom;
            start_link.toSpot = router.currentView.contentView.spotType.Top;
            router.currentView.contentView.FlowLinkData.push(start_link);
    
            var try_catch_link = {};
            try_catch_link.from = tryBlock.bid;
            try_catch_link.to = catchBlockList.bid;
            try_catch_link.fromSpot = router.currentView.contentView.spotType.Left;
            try_catch_link.toSpot = router.currentView.contentView.spotType.Top;
            try_catch_link.text = "Exception";
            try_catch_link.visible = true;
            router.currentView.contentView.FlowLinkData.push(try_catch_link);
            
            var try_final_link = {};
            try_final_link.from = tryBlock.bid;
            try_final_link.to = finallyBlock.bid;
            try_final_link.fromSpot = router.currentView.contentView.spotType.Bottom;
            try_final_link.toSpot = router.currentView.contentView.spotType.Top;
            try_final_link.text = "No Exception";
            try_final_link.visible = true;
            router.currentView.contentView.FlowLinkData.push(try_final_link);

            // var catch__final_link = {};
            // catch__final_link.from = catchBlockList.bid;
            // catch__final_link.to = finallyBlock.bid;
            // catch__final_link.fromSpot = router.currentView.contentView.spotType.Bottom;
            // catch__final_link.toSpot = router.currentView.contentView.spotType.Top;
            // router.currentView.contentView.FlowLinkData.push(catch__final_link);
    
            router.currentView.contentView.makeTryCatchFinalLink(block);
        }
    },

    makeTryCatchFinalLink: function(block) {
        _.each(block.edge, function(edge) {
            if(_.isUndefined(edge))
                return;
            
            var link = {};
            var fromNodeType = router.currentView.contentView.getNodeType(edge.fntp);
            if(fromNodeType === router.currentView.contentView.nodeType.StartJoint) {
                return 
                //link.from = edge.fnid;
                //link.to = edge.tbid;
            } else {
                if(edge.fbid === edge.tbid) {
                    link.from = edge.fnid;
                    link.to = edge.tnid;
                } else {
                    if(router.currentView.contentView.isParentBlock(edge.fbid, edge.tbid)) {
                        link.from = edge.fbid;
                        link.to = edge.tnid;
                    } else {
                        link.from = edge.fbid;
                        link.to = edge.tbid;
                    }
                }
            }

            link.fromSpot = router.currentView.contentView.spotType.Bottom;
            link.toSpot = router.currentView.contentView.spotType.Top;
            link.visible = false;
            router.currentView.contentView.FlowLinkData.push(link);
        });

    },

    // BOOKMARK: MAKE > makeTryBlock
    makeTryBlock: function(block) {
        router.currentView.contentView.addBlockCell(block);

        _.each(block.children, function(childBlock) {
            router.currentView.contentView.makeSubBlock(childBlock);
        });
        
        _.each(block.node, function(node) {
            var nodeType = router.currentView.contentView.getNodeType(node.ntp);
            if(nodeType === router.currentView.contentView.nodeType.StartJoint || 
               nodeType === router.currentView.contentView.nodeType.EndJoint)
               return;
            router.currentView.contentView.addNodeCell(node);
        });

        router.currentView.contentView.makeTryLink(block);
    },

    makeTryLink: function(block) {
        _.each(block.edge, function(edge) {
            if(_.isUndefined(edge))
                return;
            
            var link = {};
            var fromNodeType = router.currentView.contentView.getNodeType(edge.fntp);
            if(fromNodeType === router.currentView.contentView.nodeType.StartJoint) {
                link.from = edge.fnid;
                link.to = edge.tbid;
            } else {
                if(edge.fbid === edge.tbid) {
                    link.from = edge.fnid;
                    link.to = edge.tnid;
                } else {
                    if(router.currentView.contentView.isParentBlock(edge.fbid, edge.tbid)) {
                        link.from = edge.fbid;
                        link.to = edge.tnid;
                    } else {
                        link.from = edge.fbid;
                        link.to = edge.tbid;
                    }
                }
            }

            link.fromSpot = router.currentView.contentView.spotType.Bottom;
            link.toSpot = router.currentView.contentView.spotType.Top;
            link.visible = false;
            router.currentView.contentView.FlowLinkData.push(link);
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
        
        this.makeCatchBlockLink(block);
    },

    makeCatchBlockLink: function (block) {
        _.each(block.edge, function(edge) {
            if(_.isUndefined(edge))
                return;
            
            var link = {};
            var fromNodeType = router.currentView.contentView.getNodeType(edge.fntp);
            if(fromNodeType === router.currentView.contentView.nodeType.StartJoint) {
                link.from = edge.fnid;
                link.to = edge.tbid;
            } else {
                if(edge.fbid === edge.tbid) {
                    link.from = edge.fnid;
                    link.to = edge.tbid;
                } else {
                    if(router.currentView.contentView.isParentBlock(edge.fbid, edge.tbid)) {
                        link.from = edge.fbid;
                        link.to = edge.tnid;
                    } else {
                        link.from = edge.fbid;
                        link.to = edge.tbid;
                    }
                }
            }

            //link.fromSpot = router.currentView.contentView.spotType.Bottom;
            link.fromSpot =  router.currentView.contentView.spotType.Bottom;
            link.toSpot = router.currentView.contentView.spotType.Top;
            link.visible = false;
            router.currentView.contentView.FlowLinkData.push(link);
        });
    },

    // BOOKMARK MAKE > makeCatchBlock
    makeCatchBlock: function(block) {
        _.each(block.children, function(block) {
            router.currentView.contentView.makeSubBlock(block);
        });

        var catchText = "";
        _.each(block.node, function(node) {
            var nodeType = router.currentView.contentView.getNodeType(node.ntp); 
            if(nodeType === router.currentView.contentView.nodeType.StartJoint) {
                catchText = node.txt;
            } else if(nodeType === router.currentView.contentView.nodeType.EndJoint) {
                return;
            }
        });

        if(catchText.length > 0) {
            block.name = "Catch(" + catchText  + ")";
        } else {
            block.name = "Catch";
        }
        router.currentView.contentView.addBlockCell(block);
        router.currentView.contentView.makeCatchLink(block);
    },

    makeCatchLink: function (block) {
        _.each(block.edge, function(edge) {
            if(_.isUndefined(edge))
                return;
            
            var link = {};
            var fromNodeType = router.currentView.contentView.getNodeType(edge.fntp);
            if(fromNodeType === router.currentView.contentView.nodeType.StartJoint) {
                link.from = edge.fnid;
                link.to = edge.tbid;
            } else {
                if(edge.fbid === edge.tbid) {
                    link.from = edge.fnid;
                    link.to = edge.tnid;
                } else {
                    if(router.currentView.contentView.isParentBlock(edge.fbid, edge.tbid)) {
                        link.from = edge.fbid;
                        link.to = edge.tnid;
                    } else {
                        link.from = edge.fbid;
                        link.to = edge.tbid;
                    }
                }
            }

            link.fromSpot = router.currentView.contentView.spotType.Bottom;
            link.toSpot = router.currentView.contentView.spotType.Top;
            link.visible = false;
            router.currentView.contentView.FlowLinkData.push(link);
        });
    },

    makeFinallyBlock: function(block) {
        router.currentView.contentView.addBlockCell(block);
        _.each(block.children, function(block) {
            router.currentView.contentView.makeSubBlock(block);
        });
    
        _.each(block.node, function(node) {
            var nodeType = router.currentView.contentView.getNodeType(node.ntp); 
            if(nodeType === router.currentView.contentView.nodeType.StartJoint) {
                catchText = node.txt;
            } else if(nodeType === router.currentView.contentView.nodeType.EndJoint) {
                return;
            }
        });
    
        router.currentView.contentView.makeCatchLink(block);
    },

    makeFinallyLink: function (block) {
        _.each(block.edge, function(edge) {
            if(_.isUndefined(edge))
                return;
            
            var link = {};
            var fromNodeType = router.currentView.contentView.getNodeType(edge.fntp);
            if(fromNodeType === router.currentView.contentView.nodeType.StartJoint) {
                link.from = edge.fnid;
                link.to = edge.tbid;
            } else {
                if(edge.fbid === edge.tbid) {
                    link.from = edge.fnid;
                    link.to = edge.tnid;
                } else {
                    if(router.currentView.contentView.isParentBlock(edge.fbid, edge.tbid)) {
                        link.from = edge.fbid;
                        link.to = edge.tnid;
                    } else {
                        link.from = edge.fbid;
                        link.to = edge.tbid;
                    }
                }
            }

            link.fromSpot = router.currentView.contentView.spotType.Bottom;
            link.toSpot = router.currentView.contentView.spotType.Top;
            link.visible = false;
            router.currentView.contentView.FlowLinkData.push(link);
        });
    },

    // BOOKMARK MAKE > makeSwitchBlock
    makeSwitchBlock: function(block) {
        var switchConditionNode = null;
        var endSwitchNode = null;
        var caseBlockList = [];
        
        router.currentView.contentView.addBlockCell(block);

        _.each(block.node, function(node) {
            var nodeType = router.currentView.contentView.getNodeType(node.ntp); 
            if(nodeType === router.currentView.contentView.nodeType.Loop) {
                switchConditionNode = node;
            } else if(nodeType === router.currentView.contentView.nodeType.EndJoint) {
                endSwitchNode = node;
            }
            router.currentView.contentView.addNodeCell(node);
        });

        _.each(block.children, function(block) {
            caseBlockList.push(block);
            router.currentView.contentView.makeSubBlock(block);
        });

        _.each(caseBlockList, function(caseBlock) {
            var link = {};
            link.from = switchConditionNode.nid;
            link.to = caseBlock.bid;
            link.fromSpot = router.currentView.contentView.spotType.Bottom;
            link.toSpot = router.currentView.contentView.spotType.Top;
            router.currentView.contentView.FlowLinkData.push(link);
        });
    },

    makeSwitchLink: function (block) {
        // statementEnd를 endSwitch로 이동하도록 변경

        // _.each(block.edge, function(edge) {
        //     if(_.isUndefined(edge))
        //         return;
            
        //     var link = {};
        //     var fromNodeType = router.currentView.contentView.getNodeType(edge.fntp);
        //     if(fromNodeType === router.currentView.contentView.nodeType.StartJoint) {
        //         link.from = edge.fnid;
        //         link.to = edge.tbid;
        //     } else {
        //         if(edge.fbid === edge.tbid) {
        //             link.from = edge.fnid;
        //             link.to = edge.tnid;
        //         } else {
        //             if(router.currentView.contentView.isParentBlock(edge.fbid, edge.tbid)) {
        //                 link.from = edge.fbid;
        //                 link.to = edge.tnid;
        //             } else {
        //                 link.from = edge.fbid;
        //                 link.to = edge.tbid;
        //             }
        //         }
        //     }

        //     link.fromSpot = router.currentView.contentView.spotType.Bottom;
        //     link.toSpot = router.currentView.contentView.spotType.Top;
        //     link.visible = false;
        //     router.currentView.contentView.FlowLinkData.push(link);
        // });
    },

    makeCaseBlock: function(block) {
        var catchText = "";
        _.each(block.node, function(node) {
            var nodeType = router.currentView.contentView.getNodeType(node.ntp); 
            if(nodeType === router.currentView.contentView.nodeType.StartJoint) {
                catchText = node.txt;
            } else if(nodeType === router.currentView.contentView.nodeType.EndJoint) {
                return;
            }
        });

        block.isSubGraphExpanded = true;
        
        if(catchText.length > 0) {
            block.name = "Case :" + catchText;
        } else {
            block.name = "Case :";
        }
        router.currentView.contentView.addBlockCell(block);
        //router.currentView.contentView.makeCatchLink(block);
        
        _.each(block.children, function(block) {
            router.currentView.contentView.makeSubBlock(block);
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
        link.fromSpot = this.spotType.Bottom;
        link.toSpot = this.spotType.Top;

        router.currentView.contentView.FlowLinkData.push(link);
    },

    makeEndLink: function(rootBlockBid) {
        var link = {};

        link.from = rootBlockBid;
        link.to = this.nodeType.End;
        link.fromSpot = this.spotType.Bottom;
        link.toSpot = this.spotType.Top;

        router.currentView.contentView.FlowLinkData.push(link);
    },

    // BOOKMARK INIT > initNode
    initNode: function() {
        router.currentView.contentView.generateData(DATA);

        //CallSPDAO
        // 6: if
        // 2: try
        // 5: loop

        // UserDAO asds
        // try: 9
        this.makeBlock("2");

        // CybercenterAction
        // 2: case 
        
        //this.makeLink(object_id);

        router.currentView.contentView.initModel();
    
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

    showContextMenu: function(contextMenu, obj) {
        if (_.isEmpty(this.diagram)) {
            return;
        }

        this.contextMenuTemplate.hide();

        if (_.isEmpty(obj)) {
            this.contextMenuTemplate.option('dataSource', this.diagramContextMenuItems);
            this.contextMenuTemplate.option('selectNode', null);
        } else {
            this.contextMenuTemplate.option('dataSource', this.makeContextMenuDataStore());

            if (obj instanceof go.Node) {
                router.currentView.contentView.contextMenuTemplate.option('selectNode', obj.part);
            } else {
                router.currentView.contentView.contextMenuTemplate.option('selectNode', obj);
            }
        }

        var mousePos = this.diagram.lastInput.viewPoint;

        this.contextMenuTemplate.option('position', { boundary: $(".diagram-container"), offset: mousePos.x + ' ' + mousePos.y });
        this.contextMenuTemplate.option('disabled', false);
        this.contextMenuTemplate.show();
        this.contextMenuTool.currentContextMenu = contextMenu;
        $(".diagram-context-menu").contextmenu(function(e) {
            return false;
        });
    },

    hideContextMenu: function() {
        this.contextMenuTool.currentContextMenu = null;
        this.contextMenuTemplate.hide();
        this.contextMenuTemplate.option('disabled', true);
    },

    initContextMenuItems: function() {
        this.diagramContextMenuItems = [{
            text: "insert_memo",
            code: "insertMemo"
        }, {
            text: "overview",
            beginGroup: true,
            code: "overview"
        }];
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

    initContextMenu: function() {
        this.initContextMenuItems();
        this.contextMenuTool = this.diagram.toolManager.contextMenuTool;
        this.contextMenuTool.showContextMenu = function(contextMenu, obj) {
            return router.currentView.contentView.showContextMenu(contextMenu, obj);
        };
        this.contextMenuTool.hideContextMenu = function() {
            return router.currentView.contentView.hideContextMenu();
        };
        // this.diagram.click = function(e) {
        //     return router.currentView.contentView.onDiagramClick(e);
        // };
        this.diagram.contextMenu = this.$go(go.Adornment);

        var contextMenuItemTemplate = _.template(this.CONTEXT_MENU_ITEM_TEMPLATE);

        this.contextMenuTemplate = $(".diagram-context-menu").dxContextMenu({
            target: $(".flow-diagram-content-container"),
            selectNode: null,
            disabled: true,
            cssClass: "diagram-context-menu",
            itemTemplate: function (itemData, itemIndex, itemElement) {
                return contextMenuItemTemplate({
                    leftIcon: _.isEmpty(itemData.icon) ? "" : "<img src=" + itemData.icon + "/>",
                     menuText: itemData.text,
                     rightIcon: _.isEmpty(itemData.items) ? "" : "dx-icon-spinright"
                });
            }
        }).dxContextMenu("instance");
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
        this.initTools();
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
