
function initGlobalParam() {
    window.GTSaasCM = {
        Build: {},
        Models: {},
        Collections: {},
        Views: {},
        UserInfos: {},
        Apps: {},
        Utils: {},
        Constant: {},
    };
};

function initConstant() {
    GTSaasCM.Constant = {};
    GTSaasCM.Constant.YES = "Y";
    GTSaasCM.Constant.NO = "N";

    GTSaasCM.Constant.Diagram = {};
    GTSaasCM.Constant.Diagram.minHeight = 600;
}

$(document).ready(function() {
    initGlobalParam();
    initConstant();
});
