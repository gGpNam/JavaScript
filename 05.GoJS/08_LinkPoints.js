
var router = {
    currentView: {
        contentView: {
        }
    }
}

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
             { direction: 90, layerSpacing: 10, columnSpacing: 6, setsPortSpots: false, isRealtime: false });

    },

    initNodeTemplate: function() {
        var startNodeTemplate = this.$go(go.Node, "Auto",
                                         this.$go(go.Shape, "Diamond",
                                                  {
                                                      minSize: new go.Size(100, 40),
                                                      fill: "#79C900",
                                                      stroke: null 
                                                   }),
                                         this.$go(go.TextBlock,
                                                  {
                                                      font: "bold 11pt Helvetica, Arial, sans-serif",
                                                      stroke: "whitesmoke"
                                                  }, 
                                                  new go.Binding("text", "key")));

                                                  
        this.diagram.nodeTemplate = startNodeTemplate;
    },

    initLinkTemplate : function() {
        var simpletemplate = this.$go(go.Link,
                                      { routing: go.Link.AvoidsNodes,
                                        },
                                        new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
                                        new go.Binding("toSpot", "toSpot", go.Spot.parse),
                                      this.$go(go.Shape),
                                      this.$go(go.Shape, 
                                               { toArrow: "Standard" }),
                                      this.$go(go.TextBlock, 
                                        new go.Binding("text", "text"))
                                    );
        this.diagram.linkTemplate = simpletemplate;
    },

    initNode: function() {
        this.initModel();
    },

    initModel: function() {

        var nodeDataArray = [
            { key: "Alpha" }, { key: "Beta" }
        ];

        var linkDataArray = [
            { from: "Alpha", to: "Beta", fromSpot: "Buttom", toSpot: "Top" },
            { from: "Beta", to: "Alpha", fromSpot: "Left", toSpot: "Left" },
        ];

        this.diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    },

    initTemplate: function() {
        this.initNodeTemplate();
        this.initLinkTemplate();
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