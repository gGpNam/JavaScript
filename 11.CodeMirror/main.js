var router = {
    currentView: {
        contentView: {
        }
    }
}

$(function() {
var SourceView =  Backbone.View.extend({
    initialize: function() {
    },

    initComponents: function() {

        $(".btn-line").dxButton({
            text: "LINE",
            onClick: function(e) {
                router.currentView.contentView.scrollToLine(1);
            }
        });
    },

    initViewer: function() {
        var textarea = $(".source-code")[0];

        this.editor = CodeMirror.fromTextArea(textarea, {
            mode: "text/x-java",
            lineNumbers: true,
            lineWrapping: false,
            readOnly: true,
            theme: "eclipse",
            styleActiveLine: true,
            showCursorWhenSelecting: true
        });
        //this.editor.setSize(null, 600);

        this.editor.getDoc().setValue(DATA.src[0].code);
    },

    scrollToLine: function(data) {
        var doc = this.editor.getDoc();
        var line = this.line - 1;
        //var marginFromTop = doc.cm.display.cachedTextHeight * 20;

        //doc.setCursor({line: line, ch: 0});
        //window.scrollTo(0, doc.cm.heightAtLine(line) - marginFromTop);
        
        this.editor.setCursor(line);
        //this.editor.scrollIntoView(line);
    },

    render: function() {
        this.initComponents();
        this.initViewer();
        return this;
    }
});

    var SourceView = new SourceView();
    router.currentView.contentView = SourceView;

    SourceView.render();
});
