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
                //router.currentView.contentView.scrollToLine(100);
                //window.open("http://google.com", "newWindow", "width=300, height=300, toolbar=yes");
                //window.open("http://google.com", "_top", "toolbar=yes, menubar=yes, status=yes");
                window.open("", "newWin", "width=300, height=300");
                window.location.href = "http://google.com";
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
        var line = data ;
        var marginFromTop = doc.cm.display.cachedTextHeight * 20;

        console.log("doc.cm.heightAtLine(line) = " +  doc.cm.heightAtLine(line));
        console.log("marginFromTop = " +  marginFromTop); 

        this.editor.getDoc().setCursor({line: line, ch: 0});

        var y = this.editor.charCoords({line: line, ch:0}, "text/x-java").top;
        var halfHeight = this.editor.getScrollerElement().offsetHeight / 2; 
        console.log("y = " +  y);
        console.log("halfHeight = " +  halfHeight); 

        var scroll = this.editor.getScrollInfo();
        console.log("left = " +  scroll.left);
        console.log("top = " +  scroll.top); 

        //window.scrollTo(0, y- marginFromTop);


        window.setTimeout(function() {
            router.currentView.contentView.editor.addLineClass(data, null, "center-me");
            var line = $('.CodeMirror-lines .center-me');
            var h = line.parent();
     
            $('.CodeMirror-scroll').scrollTop(0).scrollTop(line.offset().top - $('.CodeMirror-scroll').offset().top - Math.round($('.CodeMirror-scroll').height()/2));
        }, 200);


        //this.editor.scrollTo(null, y - halfHeight - 5); 
        //this.editor.scrollTo(null, 500);
        //this.editor.scrollTo(null, y - halfHeight - 5);
        
//        this.editor.scrollIntoView({line: line, ch: 0});

        //var scroll = this.editor.getScrollInfo();
        //this.editor.scrollTo(scroll.left, scroll.top);

        

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
