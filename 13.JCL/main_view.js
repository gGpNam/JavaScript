var router = {
    currentView: {
        contentView: {
        }
    }
}


// branch 에서 수정

$(function() {
var MainView =  Backbone.View.extend({
    initialize: function() {
        this.template = _.template($("#backbone-templates-flow-diagram").html());
        this.FlowChartTreeData = []; // 트리로 가공한 데이터
        this.FlowChartData = [];
        this.FlowLinkData = [];

        this.DataSourceType = {
            Unknown: "",
            STREAM: "STREAM",
            DSN: "DSN",
            INSTREAM: "INSTREAM"
        }
    },

    destroy: function() {
        this.diagram.div = null;
        this.$el.remove();
    },

    properties: {
        highlightMemoNodeColor: "MediumBlue",
        defaultJointColor: "#000000",
        defaultFont: "9pt arial, meiryo, 'nanum gothic'",
        collapseFont: "Bold 12pt arial, meiryo, 'nanum gothic'",
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

    initLayout: function() {
        this.$el.find(".diagram-layout-box").dxBox({
            direction: "row",
            width: "100%"
        });
    },

    initDiagram: function() {
        var fnResizeMultipleTool = function() {
            go.ResizingTool.call(this);
            this.name = "ResizeMultiple";
        };

        //go.licenseKey = GTSaasCM.License.gojs;
        go.Diagram.inherit(fnResizeMultipleTool, go.ResizingTool);

        this.$go = go.GraphObject.make;
        var targetEl = this.$el.find(".diagram-content-container")[0];
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
                layout: this.layoutStyle()
            };
        this.diagram = this.$go(go.Diagram, targetEl, diagramOptions);
        this.diagram.addModelChangedListener(this.loggingMap);
    },

    initTraceStackList: function() {
        var traceStaceList = [{
            oid: "3703000002",
            onm: "AFBARENA",
            otype: "130003",
        }];
        this.$el.find(".diagram-trace-stack-list").dxDataGrid({
            dataSource: traceStaceList,
            width: "100%",
            height: "100%",
            allowColumnResizing: true,
            columnResizingMode: "nextColumn",
            allowColumnReordering: true,
            showRowLines: true,
            noDataText: "",
            showColumnHeaders: false,
            keyExpr: "oid",
            paging: {
                enabled: false
            },
            selection: {
                mode: "single"
            },
            headerFilter: {
                visible: false
            },
            columns: [{
                dataField: "onm",
                caption: "onm",
                width: "30%",
            }],
        });
    },

    initObjectList: function(objList) {
        console.log(OBJ_LIST.length);
        // this.$el.find(".diagram-object-list").dxButton({
        //     text: "LINE",
        // });

        var OBJ_LIST2 = [{
            "oid": "3703000002",
            "onm": "AFBARENA",
            "poid": "3703",
        }];
        
        this.$el.find(".diagram-object-list").dxTreeList({
            dataSource: OBJ_LIST2,
            width: "100%",
            height: "100%",
            keyExpr: "oid",
            parentIdExpr: "poid",
            columns: [{
                dataField: "oid",
                caption: "oid",
            }],
            expandedRowKeys: [1],
            showRowLines: true,
            columnAutoWidth: true
        });
    },

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
            _object.cmoid = object.cmoid;
            _object.block = {};
            router.currentView.contentView.FlowChartTreeData.push(_object);
        });
    },


    generateData:function(response) {
        this.initObjectData(response.obj);  
        // this.initBlockData(response.block);
        // this.initNodeData(response.node);
        // this.initTextData(response.text);
        // this.initLinkData(response.edge, response.node);
    },

    initNode: function() {
        //this.generateData(DATA);
        this.initObjectList();
        this.initTraceStackList();
        this.initModel();

        // GTSaasCM.Utils.Ajax.getInstance().getFDNodes(this.pid, this.sid, function(response) {
        //     router.currentView.contentView.generateData(response);
        //     router.currentView.contentView.initObjectList();
        //     router.currentView.contentView.initModel();
        // }, null);
    },

    initModel: function() {
        var graphLinkModelOptions = {
            nodeKeyProperty: "cid",
        };

        this.diagram.model = this.$go(go.GraphLinksModel, graphLinkModelOptions);
    },

    initContextMenu: function() {
    
    },

    // #region MakeBlock 
    
    makeBlock: function() {
        router.currentView.contentView.FlowChartData.push(rootCell);
    },

    // #endregion

    // #region initTemplate

    initNodeTemplate: function() {
    },
    initLinkTemplate: function() {
    },
    initMemoTemplate: function() {
    },
    initGroupTemplate: function() {
        var defaultGroupTemplate = this.$go(go.Group, "Auto",
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
                                                                        visible: false,
                                                                    },
                                                                    new go.Binding("text", "cid"))),
                                                    this.$go(go.Placeholder,
                                                            { padding: new go.Margin(0, 10), alignment: go.Spot.Center })));

        var groupTemplateMap = new go.Map("string", go.Group);
        groupTemplateMap.add(this.DataSourceType.Unknown, defaultGroupTemplate);

        this.diagram.groupTemplateMap = groupTemplateMap;
    },

    initTemplate: function() {
        //this.initNodeTemplate();
        //this.initLinkTemplate();
        //this.initMemoTemplate();
        //this.initGroupTemplate();
    },

    // #endregion

    initComponents: function() {
        this.initLayout();
        this.initDiagram();
        //this.initLayer();
        //this.initOverview();
        //this.initTools();
        this.initTemplate();
        this.initNode();

        //this.initContextMenu();

        // $(".btn-line").dxButton({
        //     text: "LINE",
        //     onClick: function(e) {
        //         //router.currentView.contentView.scrollToLine(100);
        //         //window.open("http://google.com", "newWindow", "width=300, height=300, toolbar=yes");
        //         //window.open("http://google.com", "_top", "toolbar=yes, menubar=yes, status=yes");
        //         window.open("", "newWin", "width=300, height=300");
        //         window.location.href = "http://google.com";
        //     }
        // });

        var targetHeight = parseInt(($("html").outerHeight() * 0.8), 10);

        if (GTSaasCM.Constant.Diagram.minHeight < targetHeight) {
            this.$el.find(".diagram-content-container").css("min-height", targetHeight);
        } else {
            this.$el.find(".diagram-content-container").css("min-height", GTSaasCM.Constant.Diagram.minHeight);
        }
    },

    render: function() {
        this.$el.html(this.template);
        this.initComponents();
        return this;
    }
});

var MainView = new MainView();
router.currentView.contentView = MainView;
$("#content").append(MainView.render().el);
});
