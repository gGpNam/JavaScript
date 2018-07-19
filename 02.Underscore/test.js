var router = {
    currentView: {
        contentView: {
        }
    }
};

var MainView =  Backbone.View.extend({
    initialize: function() {
        this.template = _.template($("#backbone-templates-flow-diagram").html());
    },

    initComponents: function() {
        
        var personList = [];


        var person1 = {};
        person1.type = 1;
        personList.push(person1);

        var person2 = {};
        person2.type = 2;
        personList.push(person2);

        _.each(personList, function(person) {
            if(person.type == 1) {
                person.id = 2;
                person.name = "A";
            } else if (person.type == 2 ) {
                person.name = "B";
            }

            console.log(person.id);
            console.log(person.name);
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
