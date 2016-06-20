# foodporn.js
my implementation of foodporn.js

### just load script from github
```javascript
(function(document) {
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', 'https://izikaj.github.io/foodporn.js/dst/main.js');
  document.body.appendChild(s);
})(document);
```
### TODO
- ~~Don't use inline CSS~~
- ~~Use Gulp to compile Sass & CoffeeScript~~
- ~~Highlight available items~~
- Use JS templates
- Make save|send button (pastebin api?)
- Make code cleaner
- Make build&publish chrome extention script
