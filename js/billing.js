
contentFormable('billing');

var bill = (function() {

  return {
    init: init,
    update: update
  };

  function init() {
    update();
  }

  function update() {
    updateTotal();
  }

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

  }

  function updateVAT(totalExVAT) {
    var percentVAT = parseFloat(getUserValue('VAT')) / 100;
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
      total = parseFloat(quantity) * parseFloat(price);
    }
    setComputedValue(toCurrency(total), 'line-total', line);
    return total;
  }

  function getUserValue(name, context) {
    context = context || document;
    var element = context.querySelector('[data-cf-editable^="' + name + '"]');
    return element.children[0].value;
  }

  function setComputedValue(value, role, context) {
    var elements = getElementsByRole(role, context);
    for (var i=0; i<elements.length; i++) {
      elements[i].innerHTML = value;
    }
  }

  function getElementsByRole(role, context) {
    context = context || document;
    var elements = context.querySelectorAll('[data-bill="' + role + '"]');
    return Array.prototype.slice.call(elements, 0);
  }

  function toCurrency(price) {
    if (typeof price != 'number' || isNaN(price)) {
      return '';
    }
    return price + '€';
  }
})();

bill.init();
document.addEventListener('keyup', function(){
  bill.update();
});

