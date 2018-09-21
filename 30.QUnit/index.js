function VendingMachine() {
    this._htStocks = {};
    this._htPriceTable = {};
    this._nBalance = 0;
};

VendingMachine.prototype = {
    _$init : function(){
    },

    buy : function(sBeverage){
        if( this._canNotBuyIt(sBeverage) ){
            return null;
        }

        this._deductBalnceByPriceOf(sBeverage);
        this._reduceStockByOne(sBeverage);

        return sBeverage;
    },

    supply: function(htStocks) {
        this._htStocks = htStocks;
    },

    insertCoin: function(nCoin) {
        this._nBalance += nCoin;
    },

    balance: function() {
        return this._nBalance;
    },

    setPrice: function(htPriceTable) {
        this._htPriceTable = htPriceTable
    },

    _canNotBuyIt: function (sBeverage) {
        return this._hasNoMoney(sBeverage) || this._hasNoStocks(sBeverage);
    },

    _deductBalnceByPriceOf: function (sBeverage) {
        this._nBalance -= this._htPriceTable[sBeverage];
    },

    _reduceStockByOne: function (sBeverage) {
        this._htStocks[sBeverage]--;
    },

    _hasNoMoney: function(sBeverage) {
        return this._htPriceTable[sBeverage] > this._nBalance;
    },

    _hasNoStocks: function(sBeverage) {
        return !this._htStocks[sBeverage] || this._htStocks[sBeverage] < 1;
    },
}
