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
        this.$el.find(".cm-sql-keyword-search-keyword-text-container").dxTextBox({
            placeholder: "Enter Keyword",
        });
        
        this.$el.find(".cm-search-keyword-reg-container").dxCheckBox({
            elementAttr: { class: "cm-font" },
            height: "28px",
            text: "regular_expression"
        });

        this.$el.find(".cm-search-keyword-exclude-container").dxCheckBox({
            elementAttr: { class: "cm-font" },
            height: "28px",
            text: "exclude"
        });

        this.$el.find(".cm-search-keyword-casesensitive-container").dxCheckBox({
            elementAttr: { class: "cm-font" },
            height: "28px",
            text: "case_sensitive"
        });

        this.$el.find(".cm-search-table-text-container").dxTextBox({
            placeholder: "Enter table name",
        });

        this.$el.find(".cm-search-table-reg-container").dxCheckBox({
            elementAttr: { class: "cm-font" },
            height: "28px",
            text: "regular_expression"
        });

        this.$el.find(".cm-search-table-exclude-container").dxCheckBox({
            elementAttr: { class: "cm-font" },
            height: "28px",
            text: "exclude"
        });

        this.$el.find(".cm-search-column-text-container").dxTextBox({
            placeholder: "Enter column name",
        });

        this.$el.find(".cm-search-column-reg-container").dxCheckBox({
            elementAttr: { class: "cm-font" },
            height: "28px",
            text: "regular_expression"
        });

        this.$el.find(".cm-search-column-exclude-container").dxCheckBox({
            elementAttr: { class: "cm-font" },
            height: "28px",
            text: "exclude"
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
