var router = {
    currentView: {
        contentView: {
        }
    }
};

var MainView =  Backbone.View.extend({
    initialize: function() {
        this.template = _.template($("#backbone-templates-sql-search").html());
    },

    destroy: function() {
        this.$el.remove();
    },

    initComponents: function() {
        this.$el.find(".gridContainer").dxDataGrid({
            dataSource: employees,
            keyExpr: "ID",
            showBorders: true,
            columns: [{
                    dataField: "Prefix",
                    caption: "Title",
                    width: 70
                },
                "FirstName",
                "LastName", {
                    dataField: "Position",
                    width: 170
                }, {
                    dataField: "State",
                    width: 125
                }, {
                    dataField: "BirthDate",
                    dataType: "date"
                }
            ],
            masterDetail: {
                enabled: true,
                template: function(container, options) { 
                    var currentEmployeeData = options.data;

                    $("<div>")
                        .addClass("master-detail-caption")
                        .text(currentEmployeeData.FirstName + " " + currentEmployeeData.LastName + "'s Tasks:")
                        .appendTo(container);

                    $("<div>")
                        .dxDataGrid({
                            columnAutoWidth: true,
                            showBorders: true,
                            columns: ["Subject", {
                                dataField: "StartDate",
                                dataType: "date"
                            }, {
                                dataField: "DueDate",
                                dataType: "date"
                            }, "Priority", {
                                caption: "Completed",
                                dataType: "boolean",
                                calculateCellValue: function(rowData) {
                                    return rowData.Status == "Completed";
                                }
                            }],
                            dataSource: new DevExpress.data.DataSource({
                                store: new DevExpress.data.ArrayStore({
                                    key: "ID",
                                    data: tasks
                                }),
                                filter: ["EmployeeID", "=", options.key]
                            })
                        }).appendTo(container);
                }
            }
        });
    },

    render: function() {
        this.$el.html(this.template);
        this.initComponents();
        return this;
    }
});

$(document).ready(function() {
    var view = new MainView();
    router.currentView.contentView = view;
    $("#content").append(view.render().el);
});
