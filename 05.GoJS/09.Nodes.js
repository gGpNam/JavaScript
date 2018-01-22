
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
            { direction: 90, layerSpacing: 10, isRealtime: false });

    },

    initNodeTemplate: function() {
        var startJointNodeTemplate = this.$go(go.Part, 
                                              { 
                                                  locationSpot: go.Spot.Center,
                                                  locationObjectName: "SHAPE",
                                                  layerName: "Background",
                                                  mouseOver: function (e, obj) { router.currentView.contentView.showPoint(obj.part.location); },
                                             },
                                             new go.Binding("location", "loc", go.Point.parse),
                                             this.$go(go.Shape, "PlusLine",
                                                      { name: "SHAPE", width: 8, height: 8 }));

        this.diagram.nodeTemplate = startJointNodeTemplate;
    },
    
    initGroupTemplate: function() {
        
    },

    initNode: function() {
        this.initModel();
    },

    initModel: function() {
        var nodeDataArray2 = [
        { loc: "0 0" },
        { loc: "100 0" },
        { loc: "100 50" }
        ];

        this.diagram.model.nodeDataArray = nodeDataArray2;
    },

    showPoint(loc) {
        var docloc = this.diagram.transformDocToView(loc);
        var elt = document.getElementById("Message1");
        elt.textContent = "Selected node location,\ndocument coordinates: " + loc.x.toFixed(2) + " " + loc.y.toFixed(2) +
                      "\nview coordinates: " + docloc.x.toFixed(2) + " " + docloc.y.toFixed(2);
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