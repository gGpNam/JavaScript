var router = {
    currentView: {
        contentView: {
        }
    }
};

var MainView =  Backbone.View.extend({
    initialize: function() {
        this.template = _.template($("#backbone-template-issue-project-summary").html());
    },

    destroy: function() {
        this.$el.remove();
    },

    initComponents: function() {
        this.summaryGridList = this.$el.find(".cm-issue-project-summary-grid").dxDataGrid({
            dataSource: customers,
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
