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
                                                { layout: this.$go(go.TreeLayout) },
                                                this.$go(go.Shape, "Rectangle",  // surrounds everything
                                                         { fill: "orange", stroke: "darkorange" }),
                                                this.$go(go.Panel, "Table",  // position header above the subgraph
                                                        { margin: 0.5 },
                                                        this.$go(go.RowColumnDefinition, { row: 0, background: "white" }),  // header is white
                                                        this.$go("SubGraphExpanderButton", { row: 0, column: 0, margin: 3 }),
                                                        this.$go(go.TextBlock,
                                                                 {
                                                                    row: 0, column: 1, font: "bold 14px Sans-Serif", stroke: "darkorange",
                                                                    textAlign: "center", stretch: go.GraphObject.Horizontal 
                                                                 },
                                                                 new go.Binding("text")),
                                                        this.$go(go.Placeholder, 
                                                                 {
                                                                     row: 1, columnSpan: 2, padding: 10, alignment: go.Spot.TopLeft
                                                                 })));

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