var uiController = (function () {
  var x = 100;

  function add(y) {
    return x + y;
  }
  // door bichigdsen code uiController iin public service n ym ==== closure
  return {
    publicAdd: function (a) {
      a = add(a); // zavsar dald baigaa func ashiglaj oruulj irj bg code
      console.log("Боловсруулсан утга : " + a);
    },
  };
})();

var financeController = (function () {})();

var appController = (function (uiController, financeController) {
  uiController.publicAdd(50);
})(uiController, financeController);

// var hunController = (function () {
//   // data encapsulation
//   // private data
//   var bodol = "JS tolgio erguulmeer ym";
//   // private func tsuud
//   function tsusGuikh() {}
//   function huchilTurugchiigAgaaraasSorjTsusruuOruulakh() {}
//   // door bichigdsen code hunController iin public service n ym ==== closure
//   return {
//     yarih: function (yria) {
//       bodol = "JS bol lag";
//       huchilTurugchiigAgaaraasSorjTsusruuOruulakh();
//       tsusGuikh();
//       console.log("hi");
//     },
//   };
// })();

// hunController.yarih();
