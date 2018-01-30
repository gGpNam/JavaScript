var router = {
    currentView: {
        contentView: {
        }
    }
}

$(function() {
var ProjectExplorerView =  Backbone.View.extend({
    initialize: function() {
        this.path = "/MicroStrategy Tutorial/AAA/BBBB/";
        this.cnt = 0;
    },


    appendExplorerItem: function(itemData, itemElement) {
        this.cnt++;
        console.log(this.cnt);

        var icoClass = "cm-project-explorer-list-item-icon";
        var nameClass = "cm-font cm-project-explorer-list-item-name";
        var routePath = "#project/" + this.projectId;

        if (_.isNull(itemData.tpid) && itemData.snm == "..") {
            nameClass += " cm-project-explorer-type-parent";
            routePath = $('.cm-project-status-path-item').eq(-2).attr("route-path");
        } else if (_.isNull(itemData.tpid) && itemData.snm) {
            icoClass += " icon dx-icon-folder";
            nameClass += " cm-project-explorer-type-folder";
            routePath += "/explorer" + this.path + itemData.snm + "/";
        } else {
            icoClass += " icon dx-icon-doc";
            nameClass += " cm-project-explorer-type-source";
            routePath += "/" + itemData.sid + "/source/viewer" + this.path + itemData.snm + "/0";
        }

        itemElement.append($("<div>").prop({
            class: icoClass
        }));

        var itemTemplate = _.template("<div class='<%= cls %>' route-path='<%= routePath %>'><%= snm %></div>");

        itemElement.append(itemTemplate({
            cls: nameClass, 
            snm: itemData.snm,
            routePath: routePath
        }));

        itemElement.append($("<div>").prop({
            class: "cm-font cm-project-explorer-list-item-type"
        }).text(_.isNull(itemData.tpid) ? "" : itemData.tpid));
    },

    initComponents: function() {
        var data = EXP;

        if (this.path.length > 1) {
            data.unshift({sid:null,snm:"..",tpid:null});
        }

        this.explorerDataSource = new DevExpress.data.DataSource({
            store: data,
            searchExpr: "data.snm",
            paginate: false,
        });

        this.projectListCtrl = $(".cm-project-explorer-content-area").dxList({
            dataSource: this.explorerDataSource,
            noDataText: "",
            activeStateEnabled: false,
            focusStateEnabled: false,
            hoverStateEnabled: true,
            scrollingEnabled: false,
            pageLoadMode: false,
            itemTemplate: function(itemData, itemIndex, itemElement) {
                router.currentView.contentView.appendExplorerItem(itemData, itemElement);
            }
        }).dxList("instance");
    },

    render: function() {
        this.initComponents();
        return this;
    }
});
    
    var ProjectExplorerView = new ProjectExplorerView();
    router.currentView.contentView = ProjectExplorerView;

    ProjectExplorerView.render();
});
