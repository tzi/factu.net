const bill = (function() {
  const langSelect = document.querySelector('[data-select-lang]');
  const printButton = document.querySelector('[data-button-print]');
  const saveButton = document.querySelector('[data-button-save]');
  let unsavedChanges = false;

  return {
    init: init,
    update: update
  };

  function init() {
    contentFormable('billing');
    initButtons();
    initDate();
    updateBill();
    updateI18n();
  }

  function update() {
    unsavedChanges = true;
    updateBill();
  }

  function updateBill() {
    updateDate();
    updateDocumentName();
    updateTotal();
    updateSaveButton();
  }

  // BUTTONS
  function initButtons() {
    langSelect.addEventListener('input', function() {
      updateI18n();
    });
    printButton.addEventListener('click', function() {
      window.print();

      return false;
    });
    saveButton.addEventListener('click', function() {
      unsavedChanges = false;
      updateSaveButton();
    });
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveButton.click();
      }
    });
  }

  function updateSaveButton() {
    if (unsavedChanges) {
      saveButton.innerHTML = '⭐️ Sauvegarder';
      saveButton.classList.remove('button--unactive');
    } else {
      saveButton.innerHTML = '⭐️ Sauvegardé';
      saveButton.classList.add('button--unactive');
    }
  }

  // I18N
  function updateI18n() {
    const dictionary = (window.i18n || {})[langSelect.value] || {};
    Array.from(document.querySelectorAll('[data-i18n]')).forEach(function(element) {
      const key = element.getAttribute('data-i18n');
      const value = typeof dictionary[key] === 'undefined' ? '🚫 unknown label' : dictionary[key];
      if (element.firstChild && element.firstChild.tagName === 'TEXTAREA') {
        element.firstChild.innerHTML = value;
      } else {
        element.innerHTML = value;
      }
    });
    updateDocumentName();
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

    const documentNameOf = (isVowel(documentName[0]) ? 'd’' : 'de ') + documentName
    setComputedValue(documentNameOf, 'document-name-of');

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
    var number = stripFloatingNumber(price);
    var string = Number.isInteger(number) ? number : number.toFixed(2);
    
    return string + ' €';
  }
  
  function stripFloatingNumber(number) {
    return parseFloat(number);
  }

  function isVowel(letter) {
    return ['a', 'e', 'i', 'o', 'u'].includes(letter.toLowerCase());
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
document.forms.billing.addEventListener('keyup', function() {
  bill.update();
});

