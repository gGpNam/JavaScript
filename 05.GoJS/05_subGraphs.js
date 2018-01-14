$(function() {
    var DocumentView =  Backbone.View.extend({
        initialize: function() {
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
            var stateBlockTemplate = this.$go(go.Node, "Horizontal",
                                              this.$go(go.Panel, "Auto",
                                                       this.$go(go.Shape, "Ellipse",
                                                                {
                                                                    fill: null
                                                                }),
                                                       this.$go(go.TextBlock,
                                                       {
                                                           margin: 5
                                                       },
                                                       new go.Binding("text", "key"))),
                                              this.$go("TreeExpanderButton"));
    
            this.diagram.nodeTemplate = stateBlockTemplate;
        },
        
        initGroupTemplate: function() {
            
            var defaultGroupTemplate = this.$go(go.Group,  "Auto",
                                                {
                                                    layout: this.$go(go.LayeredDigraphLayout,
                                                                     { direction: 0, columnSpacing: 10 })
                                                },
                                                this.$go(go.Shape, "RoundedRectangle",  // surrounds everything
                                                         { parameter1: 10, fill: "rgba(128,128,128,0.33)" }),
                                                this.$go(go.Panel, "Vertical",  // position header above the subgraph
                                                        { defaultAlignment: go.Spot.Left },
                                                        this.$go(go.Panel, "Horizontal", // the header
                                                                 { defaultAlignment: go.Spot.Top  },
                                                                 this.$go("SubGraphExpanderButton"),  // this Panel acts as a Button
                                                                 this.$go(go.TextBlock, 
                                                                          { font: "Bold 12pt Sans-Serif"  },
                                                                          new go.Binding("text", "key"))),
                                                        this.$go(go.Placeholder, 
                                                                 { padding: new go.Margin(0, 10), background: "white" })));

            var groupTemplateMap = new go.Map("string", go.Group);

            groupTemplateMap.add("", defaultGroupTemplate);
            this.diagram.groupTemplateMap = groupTemplateMap;
        },

        initNode: function() {
            this.initModel();
        },
    
        initModel: function() {

            var nodeDataArray = [
                { key: "Alpha" },
                { key: "Omega", isGroup: true },
                { key: "Beta", group: "Omega" },
                { key: "Gamma", group: "Omega" },
                { key: "Epsilon", group: "Omega" },
                { key: "Zeta", group: "Omega" },
                { key: "Delta" }
              ];

              var linkDataArray = [
                { from: "Alpha", to: "Omega" }, // from a Node to the Group
                { from: "Beta", to: "Gamma" },  // this link is a member of the Group
                { from: "Beta", to: "Epsilon" },  // this link is a member of the Group
                { from: "Gamma", to: "Zeta" },  // this link is a member of the Group
                { from: "Epsilon", to: "Zeta" },  // this link is a member of the Group
                { from: "Omega", to: "Delta" }  // from the Group to a Node
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
        documentView.render();
    });