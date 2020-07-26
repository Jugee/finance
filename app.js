// Дэлгэцтэй ажиллах контроллер
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensLabel: ".budget__expenses--value",
    percentagaLabel: ".budget__expenses--percentage",
    containerDiv: ".container",


  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //  exp, inc
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    getDOMstrings: function () {
      return DOMstrings;
    },

    clearFields: function () {
      var fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue,);

      // Conver to array
      var fieldArr = Array.prototype.slice.call(fields);
      fieldArr.forEach(function (el) {
        el.value = "";
      });
      fieldArr[0].focus();
      // for (var i = 0; i < fieldArr.length; i++) {
      //   fieldArr[i].value = "";
      // }

    },


    //
    tusviigUzuulekh: function (tusuv) {
      document.querySelector(DOMstrings.tusuvLabel).textContent = tusuv.tusuv;
      document.querySelector(DOMstrings.incomeLabel).textContent = tusuv.totalsInc;
      document.querySelector(DOMstrings.expensLabel).textContent = tusuv.totalsExp;
      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstrings.percentagaLabel).textContent = tusuv.huvi + "%";
      }
      else {
        document.querySelector(DOMstrings.percentagaLabel).textContent = tusuv.huvi;
      }

    },

    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el)

    },

    addListItem: function (item, type) {
      // Орлого зарлагын элементийн агуулсан html ийг бэлтгэнэ.
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>        </div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div>          <div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">                <i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Тэр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглаж өөрчилж
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", item.value);

      // Бэлтгэсэн HTML ээ DOM руу хийж өгнө.
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    }
  };
})();

// Санхүүтэй ажиллах контроллер
// private data
var financeController = (function () {
  // private func baiguulagch
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // private func baiguulagch
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum = sum + el.value;
    });
    // Нийт орлого зарлага data.total.inc && exp рүү нэмж байгаа
    data.totals[type] = sum;
  }

  // private data
  var data = {
    items: {
      inc: [],
      exp: [],
    },

    totals: {
      inc: 0,
      exp: 0,
    },

    tusuv: 0,

    huvi: 0,
  };

  return {
    tusuvTootsooloh: function () {
      // Нийт орлогын нийлбэрийг тооцооло.
      calculateTotal('inc');

      // Нийт зарлагын нийлбэрийг тооцооло.
      calculateTotal('exp');

      // Төсвийг шинээр тооцооло.
      data.tusuv = data.totals.inc - data.totals.exp;

      // Орлого зарлагын хувийг тооцооло.
      data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);

    },

    tusviigAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalsInc: data.totals.inc,
        totalsExp: data.totals.exp,

      }
    },

    deletItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });

      var index = ids.indexOf(id);

      if (index !== -1) {
        data.items[type].splice(index, 1)
      }
    },

    addItem: function (type, desc, val) {
      var item, id;
      // identification
      if (data.items[type].length === 0) id = 1;

      else {
        // массив хамгийн урт аас 1 ийг хасхад тухайн массив дах хамгийн сүүлийн элемент заагаад тухайг тэр элемент дээр 1 ийг нэмж шинэ id үүсгэж байгаа. 
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        // type === exp
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);
      return item
    },

    seeData: function () {
      return data;
    }

  };
})();

// Програмын холбогч контроллер
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    // 1. Оруулах өгөгдлийг дэлгэцээс олж авна.
    var input = uiController.getInput();
    if (input.description !== 0 && input.value) {
      // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
      var item = financeController.addItem(input.type, input.description, input.value);
      // 3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана
      uiController.addListItem(item, input.type);
      uiController.clearFields();

      // 4. Төсвийг тооцоолно
      financeController.tusuvTootsooloh();

      // 5. Эцсийн үлдэгдэл, 
      var tusuv = financeController.tusviigAvah();

      // 6. Тооцоог дэлгэцэнд гаргана.

      uiController.tusviigUzuulekh(tusuv);

    } else {
      alert("Та талбарын утга дутуу байна.")
    }


  };

  var setupEventListeners = function () {
    var DOM = uiController.getDOMstrings();
    // Орлого зарлага нэмэх үед
    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });
    // Орлого зарлага нэмэх үед буюу enter товч дарах үед
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    // Орлого зарлага жагсаалтаас тус бүрэээс устгах товч дарах үед
    document.querySelector(DOM.containerDiv).addEventListener("click", function (event) {
      var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
      // if id хоосон биш бол доорх нөхцөл ажилллана.
      if (id) {
        var arr = id.split('-');
        var type = arr[0];
        var itemId = parseInt(arr[1]);

        console.log(type + " ===> " + itemId)

        // 1. Санхүүгийн модулиа с type, id ашиглаад устгана.
        financeController.deletItem(type, itemId);

        // 2. Дэлгэц дээрх энэ элементийг устгана.
        uiController.deleteListItem(id)
        // 3. Үлдэгдэл тооцоог шинэчилж харуулна.
      }

    })

  };
  return {
    init: function () {
      console.log("Application started...");
      uiController.tusviigUzuulekh({
        tusuv: 0,
        huvi: 0,
        totalsInc: 0,
        totalsExp: 0,
      });
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
