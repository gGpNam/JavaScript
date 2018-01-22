
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
    
        // this.diagram.layout = this.$go(go.LayeredDigraphLayout,
        //     { direction: 90, layerSpacing: 10, isRealtime: false });

    },

    initNodeTemplate: function() {
        var startNodeTemplate = this.$go(go.Node, "Auto",
                                         new go.Binding("location", "loc", go.Point.parse),
                                         this.$go(go.Shape, "RoundedRectangle", { fill: "lightgray" }),
                                         this.$go(go.TextBlock, { margin: 5 },
                                                  new go.Binding("text", "key")));
        this.diagram.nodeTemplate = startNodeTemplate;
    },

    initLinkTemplate : function() {
        var simpletemplate = this.$go(go.Link,
                                      { routing: go.Link.AvoidsNodes,
                                        corner: 10 },
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
            { key: "Alpha", loc: "0 0" },
            { key: "Beta", loc: "200 50" }
        ];

        var linkDataArray = [
            { from: "Alpha", to: "Beta", text: "a label" }
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