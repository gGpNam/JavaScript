$(function() {
    var DocumentView =  Backbone.View.extend({
        initialize: function(options) {
            //this.template = _.template($("#backbone-templates-flow-diagram").html());
            this.projectId = options.projectId;
            this.path = options.path;
            this.pid = options.pid;
            this.sid = options.sid;
        },
    
        properties: {
            linkColor: "DarkRed",
            nodeStrokeColor: "DarkRed",
            nodeFillColor: "LightYellow",
            groupWidth: 130,
            groupHeight: 50,
            groupSpace: 250,
            groupTitleMargin: 5,
            startGroupPos: 100,
            linePrefix: 30,
            lineSuffix: 30,
            messageSpace: 20,
            activityWidth: 16,
            activityStart: 5,
            activityEnd: 5,
            activitySpace: 2,
            diagramPaddingTop: 70,
            diagramHeight: "80%",
            fixedLifeLineHeadHeight: 57,
            initDiagramX: 29.5,
            initDiagramY: -56
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
            var foreLayer = this.diagram.findLayer("Foreground");
    
            this.diagram.addLayerBefore(this.$go(go.Layer, { name: "LinkLayer" }), foreLayer);
            this.diagram.addLayerBefore(this.$go(go.Layer, { name: "NodeLayer" }), foreLayer);
            this.diagram.addLayerBefore(this.$go(go.Layer, { name: "MemoLayer" }), foreLayer);
        },
    
        initOverview: function() {
        },
        
        initMemoTemplate: function() {
        },
    
        initNodeTemplate: function() {
            this.diagram.add(
                this.$go(go.Part, "Vertical",
                         this.$go(go.TextBlock, { text: "memset(& cond1,'\0',sizeof(  & cond1 ))"}),
                         this.$go(go.TextBlock, { text: "a Text Block", stroke: "red"}),
                         this.$go(go.TextBlock, { text: "a Text Block", background: "lightblue" }),
                         this.$go(go.TextBlock, { text: "a Text Block", font: "bold 14pt serif" })
                )
            )

            this.diagram.add(
                this.$go(go.Part, "Vertical",
                         this.$go(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2 }),
                         this.$go(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2 },
                                  { width: 100, height: 33 }
                        )
                )
            )
        },

        computeActivityHeight: function(duration) {
            return this.properties.activityStart + duration * this.properties.messageSpace + this.properties.activityEnd;
        },
    
        backComputeActivityHeight: function(height) {
            return (height - this.properties.activityStart - this.properties.activityEnd) / this.properties.messageSpace;
        },
    
        makePort: function(name, spot, output, input) {
            return $(go.Shape, "Circle",
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
    
        initLinkTemplate: function() {
        },
        
        initNode: function() {
            this.initModel();
        },
    
        initModel: function() {
            var graphLinkModelOptions = {
                copiesArrays: true,
                copiesArrayObjects: true,
                nodeKeyProperty: "nid"
            };

            var myModel = this.$go(go.Model);
            this.diagram.model = myModel;
        },
    
        initTemplate: function() {
            this.initNodeTemplate();
            this.initLinkTemplate();
            this.initMemoTemplate();
        },
    
        initComponents: function() {
            this.initDiagram();
            //this.initLayer();
            //this.initOverview();
            this.initTemplate();
            this.initNode();
        },
    
        render: function() {
            //this.$el.html(this.template);
            this.initComponents();
            return this;
        }
    });
        var option = {
            projectId : "",
            path: "..",
            pid: 13,
            sid: 9999
        }
        var documentView = new DocumentView(option);
        documentView.render();
    });