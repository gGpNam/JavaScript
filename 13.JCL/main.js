var GTSaasCMRouter = Backbone.Router.extend({
    routes: {
        "": "switchToProjectList",
    },

    initialize: function() {
        this.currentView = null;
    },

    switchToProjectList: function() {
        console.log("switchToProjectList");

        // GTONESpinner.show();

        // if (! router.isProjectList) {
        //     router.switchToProjectMain(null, router.switchToProjectList, arguments);
        //     return;
        // }

        // var fetchedProjectList = new $.Deferred;
        var targetContent = null;

        // targetContent = new GTSaasCM.Views.Project.ProjectListView({
        //     collections: {
        //         group: router.collections.group,
        //         project: router.collections.project
        //     },
        //     fetched: fetchedProjectList
        // });

        // fetchedProjectList.done(function() {
        //     router.currentView.updateStatusSourcePathLink();
        //     router.currentView.changeContentView(targetContent);
        //     GTONESpinner.hide();
        // });

        targetContent = new GTSaasCM.Views.Project.ProjectListView({
            
        });

        fetchedProjectList.done(function() {
        
        });
    },

});

$(document).ready(function() {
    window.router = new GTSaasCMRouter();
    Backbone.history.start({pushState: false});
});
