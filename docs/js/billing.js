
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
    updateDocumentName();
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
    var days = getUserNumberValue('days');
    if (! days) {
      return false;
    }
    paymentDate.setDate(paymentDate.getDate() + days);
    return paymentDate;
  }

  // DOCUMENT NAME
  function updateDocumentName() {
    var title = [];

    var documentName = getUserValue('document-name');
    if (documentName) {
      title.push(documentName);
    }
    setComputedValue(documentName, 'document-name');

    var documentNumber = getUserNumberValue('document-number');
    if (documentNumber !== false) {
      title.push(documentNumber);
    }

    var customerName = getUserValue('customer-name');
    if (customerName) {
      title.push(customerName);
    }

    document.title = title.join(' ');
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

    var AmountPaid = getUserNumberValue('amount-paid');
    if (AmountPaid === false) {
      var toPaid = total;
    } else {
      var toPaid = total - AmountPaid;
    }
    setComputedValue(toCurrency(toPaid), 'to-paid');
  }

  function updateVAT(totalExVAT) {
    var percentVAT = getUserNumberValue('VAT') / 100;
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
      var quantity = getUserNumberValue('quantity-value', line);
      var price = getUserNumberValue('unit-price-value', line);
      total = quantity * price;
    }
    setComputedValue(toCurrency(total), 'line-total', line);
    return total;
  }

  // DOM Access
  function getUserValue(name, context) {
    context = context || document;
    var element = context.querySelector('[name^="' + name + '"]');
    return element.value;
  }

  function getUserNumberValue(name, context) {
    var value = parseFloat(getUserValue(name, context).replace(/,/g, '.').replace(/ /g, ''));
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
    return price + ' €';
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

