
contentFormable('billing');

var bill = (function() {

  return {
    init: init,
    update: update
  };

  function init() {
    initDate();
    update();
  }

  function update() {
    updateDate();
    updateTotal();
  }

  // DATE DISPLAY
  function initDate() {
    setComputedValue(toLongFrenchFormat(new Date()), 'date');
  }

  function updateDate() {
    setComputedValue(toLongFrenchFormat(getPaymentDate()), 'payment');
  }

  function getPaymentDate() {
    var paymentDate = new Date();
    var days = getUserValue('days');
    if (! days) {
      return false;
    }
    paymentDate.setDate(paymentDate.getDate() + days);
    return paymentDate;
  }

  // BILL CALCULATION
  function updateTotal() {
    var lines = getElementsByRole('line');
    var totalExVAT = lines.reduce(function(sum, line) {
      var current = updateLine(line);
      if (current) {
        sum += current;
      }
      return sum;
    }, 0);
    setComputedValue(toCurrency(totalExVAT), 'totalExVAT');

    var VAT = updateVAT(totalExVAT);
    var total = totalExVAT + VAT;
    setComputedValue(toCurrency(total), 'total');

    var AmountPaid = getUserValue('amount-paid');
    if (AmountPaid === false) {
      var toPaid = total;
    } else {
      var toPaid = total - AmountPaid;
    }
    setComputedValue(toCurrency(toPaid), 'to-paid');
  }

  function updateVAT(totalExVAT) {
    var percentVAT = getUserValue('VAT') / 100;
    var VAT = percentVAT * totalExVAT;
    setComputedValue(toCurrency(VAT), 'VAT');
    if (!VAT) {
      return 0;
    }
    return VAT;
  }

  function updateLine(line) {
    var total = false;
    if (!line.classList.contains('cf-disabled') && !line.classList.contains('cf-hidden')) {
      var quantity = getUserValue('quantity-value', line);
      var price = getUserValue('unit-price-value', line);
      total = quantity * price;
    }
    setComputedValue(toCurrency(total), 'line-total', line);
    return total;
  }

  // DOM Access
  function getUserValue(name, context) {
    context = context || document;
    var element = context.querySelector('[data-cf-editable^="' + name + '"]');
    var value = parseFloat(element.children[0].value);
    return !isNaN(value) ? value : false;
  }

  function setComputedValue(value, role, context) {
    var elements = getElementsByRole(role, context);
    for (var i=0; i<elements.length; i++) {
      if (elements[i].children.length) {
        elements[i].children[0].value = value;
      } else {
        elements[i].innerHTML = value;
      }
    }
  }

  function getElementsByRole(role, context) {
    context = context || document;
    var elements = context.querySelectorAll('[data-bill="' + role + '"]');
    return Array.prototype.slice.call(elements, 0);
  }

  // DISPLAY FORMAT
  function toCurrency(price) {
    if (typeof price != 'number' || isNaN(price)) {
      return '';
    }
    return price + '€';
  }

  function toLongFrenchFormat(date) {
    if (! date || ! date instanceof Date) {
      return '';
    }
    var months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    var day = date.getDate();
    return day + " " + months[date.getMonth()] + " " + date.getFullYear();
  }
})();

bill.init();
document.addEventListener('keyup', function(){
  bill.update();
});

