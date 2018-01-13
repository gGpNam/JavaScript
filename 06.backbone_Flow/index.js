var GTSaasCMRouter = Backbone.Router.extend({
    routes: {
        "": "switchToMain",
    },

    initialize: function() {
    },

    destroyCurrentView: function() { 
        if (!this.currentView) {
            return;
        }

        this.currentView.destroy();
        this.currentView = null;
    },

    changeCurrentView: function(targetView) {
    },

    switchToMain: function() {
        var targetView = null;

        targetView = new GTSaasCM.Views.Home.MainView({
            
        });
    }
});

$(document).ready(function() {
    window.router = new GTSaasCMRouter();
    Backbone.history.start({pushState: false});
});