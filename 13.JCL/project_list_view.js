var ProjectListView = Backbone.View.extend({
    initialize: function(options) {
        
    },

    initComponents: function() {
        console.log("ProjectListView initComponents");
    },

    render: function() {
        //this.$el.html(this.template);
        this.initComponents();
        //this.$el.i18n();
        return this;
    },

});

$(document).ready(function() {
    GTSaasCM.Views.Project || (GTSaasCM.Views.Project = {});
    GTSaasCM.Views.Project.ProjectListView = ProjectListView;
});

