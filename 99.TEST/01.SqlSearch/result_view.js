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

        this.objectStatusInfoBoxCtrl = this.$el.find(".cm-search-result-table-box").dxBox({
            elementAttr: { class: "cm-font" },
            width: "100%",
            direction: "row"
        }).dxBox("instance");

        this.$el.find(".cm-search-stack-grid").dxDataGrid({
            dataSource: [{
                "ID": 1,
                "CompanyName": "Super Mart of the West"
            }, {
                "ID": 2,
                "CompanyName": "Super Mart of the 111"
            }],
            columns: ["CompanyName", "City", "State", "Phone", "Fax"],
            showBorders: true
        });

        this.$el.find(".cm-search-stack-result-grid").dxDataGrid({
            dataSource: [{
                "ID": 1,
                "CompanyName": "AAA"
            }, {
                "ID": 2,
                "CompanyName": "BBB"
            }],
            columns: ["CompanyName", "City", "State", "Phone", "Fax"],
            showBorders: true
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
