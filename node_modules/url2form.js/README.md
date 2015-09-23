url2form.js
==============

A JavaScript library to fill a form with the current url queries.

It allows you to create JavaScript application with sharable states without having a back-end.
Start filling your form, validate, bookmark the generated URL, and you'll be able to go back to this specific state later.



Quick start
--------------

```sh
npm install url2form.js
```

```js
<form name="myFormName">
  <input type="text" name="myInput" value="" />
  <button>Validate</button>
</form>

<script>
  url2form.init('myFormName');
</script>
```

If the URI is "?myInput=myValue" the `input` will be valued with "myValue".
Every time you click on validate, you create a new URL to bookmark.



Projects using it
-------

 * [Pajomatic](http://tut-tuuut.github.io/pajomatic/): Help for French parents who pay a nanny



How to Contribute
--------

### Get involved

1. [Star](https://github.com/tzi/url2form.js/stargazers) the project!
2. [Report a bug](https://github.com/tzi/url2form.js/issues/new) that you have found.
3. Tweet and blog about `url2form.js` and [Let me know](https://twitter.com/iamtzi) about it.
4. [Pull requests](CONTRIBUTING.md) are also highly appreciated.



Author & Community
--------

`url2form.js` is under [MIT License](http://opensource.org/licenses/MIT).<br>
It was created & is maintained by [Thomas ZILLIOX](http://tzi.fr).