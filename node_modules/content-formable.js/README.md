content-formable.js
========

A lib to simulate content-editable with textarea, so it can be used in forms.


Quick start
--------------

```sh
npm install content-formable.js
```

```html
<form name="myFormName">
  <div data-cf-editable>
    This content is editable and could be submit.
  </div>
  <div data-cf-editable="content">
    This will be submit under the name "content"
  </div>
  <div data-cf-if="content">
    This container has a class "cf-hidden" if content is empty.
  </div>
</form>

<script>
  contentFormable('myFormName');
</script>
```


How to Contribute
--------

1. [Star](https://github.com/tzi/content-formable.js/stargazers) the project!
2. [Report a bug](https://github.com/tzi/content-formable.js/issues/new) that you have found.
3. Tweet and blog about content-formable.js and [Let me know](https://twitter.com/iamtzi) about it.
4. [Pull requests](CONTRIBUTING.md) are also highly appreciated.


Author & Community
--------

content-formable.js is under [MIT License](http://tzi.mit-license.org/).<br>
It was created & is maintained by [Thomas ZILLIOX](http://tzi.fr).