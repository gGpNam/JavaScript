
$(function() {
 
    var oVendingMachine = null;
    var DEFAULT_MONEY = 2000;

    QUnit.module('VendingMachine', {
        beforeEach : function(assert){
            oVendingMachine = new VendingMachine();
            oVendingMachine.supply({
                "Coke": 1,
                "Sprite": 1,
                "Orange Juice": 1,
                "Apple Juice": 1,
                "NonExistingDrink": 0,
            });
            oVendingMachine.setPrice({
                "Coke": 500,
                "Sprite" : 300,
                "Orange Juice" : 200,
                "Apple Juice" : 100
            });
            oVendingMachine.insertCoin(DEFAULT_MONEY);
        },
        afterEach : function(assert){
            /* 리소스 정리 */
            oVendingMachine = null;
        }
    });

    QUnit.test("자판기에서 원하는 음료를 뽑을 수 있다.", function(assert) {
        // Given
        // When
        var sBeverage1 = oVendingMachine.buy("Coke");
        var sBeverage2 = oVendingMachine.buy("Sprite");
        var sBeverage3 = oVendingMachine.buy("Orange Juice");
        var sBeverage4 = oVendingMachine.buy("Apple Juice");

        // Then
        assert.equal(sBeverage1, "Coke");
        assert.equal(sBeverage2, "Sprite");
        assert.equal(sBeverage3, "Orange Juice");
        assert.equal(sBeverage4, "Apple Juice");
    });

    QUnit.test("재고가 있는 음료만 뽑을 수 있다.", function(assert) {
        // Given
        // When
        var sBeverage1 = oVendingMachine.buy("NonExistingDrink");
       
        // Then
        assert.equal(sBeverage1, null);
    });

    QUnit.test("재고 만큼 음료를 구매할 수 있다.", function(assert) {
        // Given
        // When
        var sBeverage1 = oVendingMachine.buy("Coke");
        var sBeverage2 = oVendingMachine.buy("Coke");

        // Then
        assert.equal(sBeverage1, "Coke");
        assert.equal(sBeverage2, null);
    });

    QUnit.test("동전을 여러 번 넣을 수 있다.", function(assert) {
        // Given
        // When
        oVendingMachine.insertCoin(500);
        oVendingMachine.insertCoin(100);

        // Then
        assert.equal(oVendingMachine.balance(), DEFAULT_MONEY + 600);
    });

    QUnit.test("동전을 넣은 만큼만 음료를 구매할 수 있다.", function(assert) {
        // Given
        oVendingMachine.supply({ "Coke": 100 });
        oVendingMachine.buy("Coke");
        oVendingMachine.buy("Coke");
        oVendingMachine.buy("Coke");

        // When
        var sBeverage1 = oVendingMachine.buy("Coke");
        var sBeverage2 = oVendingMachine.buy("Coke");

        // Then
        assert.equal(sBeverage1, "Coke");
        assert.equal(sBeverage2, null);
    });
});