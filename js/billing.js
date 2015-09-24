
initEditable();
url2form.init('billing');

function initEditable() {
  var editableElementList = document.querySelectorAll('[data-editable]');
  for (var i=0; i<editableElementList.length; i++) {
    initEditableItem(editableElementList[i], i);
  }

  function initEditableItem(el, counter) {
    var attr = el.getAttribute('data-editable');
    var id = attr ? attr : 'f' + counter;
    var textarea = document.createElement('textarea');
    textarea.setAttribute('name', id);
    textarea.innerHTML = unindentor.unindentText(el.textContent);
    el.innerHTML = '';
    el.appendChild(textarea);
    initConditionalVisibility(textarea);
  }

  function initConditionalVisibility(input) {
    updateConditionalVisibility(input);
    input.addEventListener('change', function() {
      updateConditionalVisibility(input);
    });
  }

  function updateConditionalVisibility(input) {
    var elementList = document.querySelectorAll('[data-conditional-visibility="'+input.name+'"]');
    for (var i=0; i<elementList.length; i++) {
      elementList[i].classList.toggle('hidden@print', !input.value);
    }
  }
}