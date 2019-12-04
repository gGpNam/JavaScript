var GTSaasCMRouter = Backbone.Router.extend({
    routes: {
        "": "switchToProjectMain",
    },

    initialize: function() {
        this.currentView = null;
        console.log("GTSaasCMRouter initialize");
    },

    switchToProjectMain: function(id, callback, args) {
        var targetView = null;
        targetView = new MainView({
        });

        console.log("switchToProjectMain");
    }
});

