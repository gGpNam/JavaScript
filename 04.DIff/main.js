var router = {
    currentView: {
        contentView: {
        }
    }
}

$(function() {
var HistoryView =  Backbone.View.extend({
    initialize: function() {

    },

    setDiffSource: function(sourceMeta, lSource, rSource) {
        if(_.isEmpty(lSource) || lSource.chgseq == 0) {
            lSource = {
                code: "",
                chgseq: 0,
                snm: rSource.snm
            };
        }

        if(_.isEmpty(rSource) || rSource.chgseq == 0) {
            rSource = {
                code: "",
                chgseq: 0,
                snm: lSource.snm
            }
        }

        //this.clear();
        this.lDiff.getDoc().setValue(lSource.code);
        this.rDiff.getDoc().setValue(rSource.code);

        // var dmp = new diff_match_patch();
        // var leftSource = router.currentView.contentView.replaceWhitespace(lSource.code);
        // var rightSource = router.currentView.contentView.replaceWhitespace(rSource.code);
        // var diffs = dmp.diff_main(leftSource, rightSource, false);
        // dmp.diff_cleanupSemanticLossless(diffs);

        // router.currentView.contentView.makeDiffBuild(diffs);
        // router.currentView.contentView.setBase(this.baseDiffLines, lSource.code);
        // router.currentView.contentView.setTarget(this.targetDiffLines, rSource.code);
        // router.currentView.contentView.calcFinalDiffType(this.diffTable)
        // router.currentView.contentView.diffViewLines(this.lDiff, this.rDiff, this.diffTable);
    },

    initSource: function() {
        var lTextarea = $(".change-history-diff-left")[0];
        var rTextarea = $(".change-history-diff-right")[0];
        
        this.lDiff = CodeMirror(lTextarea, {
            mode: "text/x-java",
            lineNumbers: true,
            lineWrapping: true,
            readOnly: true,
            theme: "eclipse",
            styleActiveLine: true,
            showCursorWhenSelecting: false
        });
        this.lDiff.setSize(null, 700);
        
        this.rDiff = CodeMirror(rTextarea, {
            mode: "text/x-java",
            lineNumbers: true,
            lineWrapping: true,
            readOnly: true,
            theme: "eclipse",
            styleActiveLine: true,
            showCursorWhenSelecting: false
        });
        this.rDiff.setSize(null, 700);
    },

    initComponents: function() {
        this.initSource();
        var sourceMeta = "";
        var lSourceData = "";
        var rSourceData = "";
        router.currentView.contentView.setDiffSource(sourceMeta, lSourceData, rSourceData);


    },

    render: function() {
        this.initComponents();
        return this;
    }
});
    
    var HistoryView = new HistoryView();
    router.currentView.contentView = HistoryView;

    HistoryView.render();
});
