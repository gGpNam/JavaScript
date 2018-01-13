$(function() {
var FlowDiagramView =  Backbone.View.extend({
    initialize: function() {
        var violationData = [{
            lv: 1,
            rnm: "T",
        }];
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
                new go.Binding("text", "key")),
              {
                toolTip:
                this.$go(go.Adornment, "Auto",
                this.$go(go.Shape, { fill: "#FFFFCC" }),
                this.$go(go.TextBlock, { margin: 4 },
                      new go.Binding("text", "desc"))
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
                                                      
                                                       fill: "lightblue",
                                                    }),
                                          this.$go(go.TextBlock,
                                                   {
                                                       font: "bold 11pt Helvetica, Arial, sans-serif",
                                                       margin: 5,
                                                       stroke: "whitesmoke"
                                                   },
                                                   new go.Binding("text", "btype")));
        
        var templmap = new go.Map("string", go.Node);
        templmap.add("start", startNodeTemplate);
        templmap.add("end", endNodeTemplate);
        templmap.add("state", stateBlockTemplate);
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
        console.log("asd");
    },
    
    initGroupTemplate: function() {
        var groupSelectionAdornmentTemplate = this.$go(go.Adornment,
                "Spot",
                this.$go(go.Panel,
                         "Auto",
                         this.$go(go.Shape, { fill: null, stroke: "lightsteelblue", strokeWidth: 1.5 }),
                         this.$go(go.Placeholder)));

        var defaultGroupTemplate = this.$go(go.Group,
                                            "Auto",
                                            {
                                                layout: this.$go(go.TreeLayout,{ angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal, isRealtime: false }),
                                                isSubGraphExpanded: false,
                                                subGraphExpandedChanged: function(group) {
                                                    console.log("asdf");
                                                }
                                            },
                                            this.$go(go.Shape, "MultiProcess", { minSize: new go.Size(150, 40), parameter1: 5, fill: "rgba(128,128,128,0.33)" }),
                                            this.$go(go.Panel,
                                                     "Vertical",
                                                     {
                                                         defaultAlignment: go.Spot.Left,
                                                         margin: 4 
                                                     },
                                                     this.$go(go.Panel, "Horizontal",
                                                              {
                                                                 defaultAlignment: go.Spot.Top
                                                              },
                                                              this.$go("SubGraphExpanderButton"),
                                                              this.$go(go.TextBlock,
                                                                      {
                                                                         font: "Bold 12pt Sans-Serif",
                                                                         margin: 4 
                                                                      },
                                                                      new go.Binding("text", "category"))),
                                                     this.$go(go.Placeholder,
                                                              {
                                                                  padding: new go.Margin(0, 0),
                                                              })));
        var groupTemplateMap = new go.Map("string", go.Group);

        groupTemplateMap.add("", defaultGroupTemplate);
        this.diagram.groupTemplateMap = groupTemplateMap;
    },
    
    initNode: function() {
        var data = {
            nids: [this.sid]
        };

        var nodeData = {
                block: [{
                    bid: "S1",
                    btype: "Start",
                    category: "start",
                }, {
                    bid: "group",
                    btype: "group",
                    category: "group",
                    isGroup: true,
                }, {
                    bid: "3",
                    oid: 2,
                    btype: "Statement",
                    group: "group",
                    category: "state",
                    node: [{
                        nid: "p3",
                        ntype: "STBLOCK_START",
                        sln: 18
                    }, {
                        nid: "p4",
                        ntype: "this.result = com.javamodeling.ibatis.dao.LoginDAO.getLogin(this.loginId)",
                        sln: 18
                    }, {
                        nid: "p13",
                        ntype: "STBLOCK_END",
                        sln: 18
                    }]
                }, {
                    bid: "4",
                    oid: 2,
                    btype: "StatementBlock",
                    group: "group",
                    category: "state",
                }, {
                    bid: "E1",
                    btype: "End",
                    category: "end",
                }]
        };
        
        var linkList = [{
                            from:"S1",
                            to:"group",
                            fromPort:"B",
                            toPort: "T"
                         }, {
                             from:"group",
                             to:"E1",
                             fromPort:"B",
                             toPort: "T"
                         }];
        
        this.initModel();
        
        this.diagram.model.addNodeDataCollection(nodeData.block);
        this.diagram.model.addLinkDataCollection(linkList);

        // router.currentView.contentView.nodeInfos = response;
        // router.currentView.contentView.visitLinks(null, router.currentView.contentView.oid);
        // router.currentView.contentView.setGroupNodeInfos();
        // router.currentView.contentView.diagram.model.addNodeDataCollection(router.currentView.contentView.activityList);
        // router.currentView.contentView.diagram.model.addLinkDataCollection(router.currentView.contentView.linkList);
        // router.currentView.contentView.diagram.scroll('pixel', 'up', router.currentView.contentView.properties.diagramPaddingTop);

    },

    initModel: function() {
        var graphLinkModelOptions = {
            //nid: "Group",
            //nnm: "Group",
            //isGroup: true,
            //category: "group",
            nodeKeyProperty: "bid",
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
    FlowDiagramView.render();
});

