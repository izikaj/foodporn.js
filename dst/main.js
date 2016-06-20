(function(w) {
  var $, $$, bindAll, buildDay, buildScaffold, getDaily, getPrice, graph, loadCss, loadScripts, root_el;
  $$ = function(selector, root) {
    if (root == null) {
      root = void 0;
    }
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  };
  $ = function(selector, root) {
    if (root == null) {
      root = void 0;
    }
    return (root || document).querySelector(selector);
  };
  getPrice = function(element) {
    var _arr, r, res, title;
    r = /\d+((\.|\,)\d+)?/g;
    title = element.attributes['aria-label'].value;
    _arr = title.match(r);
    res = parseFloat(_arr[_arr.length - 1]);
    return parseFloat(_arr[_arr.length - 1] || 0);
  };
  getDaily = function(group) {
    var daily_cost, items, ref, title;
    daily_cost = 0;
    title = (ref = $('[role="heading"]', group)) != null ? ref.textContent : void 0;
    items = $$('[role="checkbox"][aria-checked="true"]', group).map(function(item) {
      daily_cost += getPrice(item);
      return item.attributes['aria-label'].value;
    });
    return {
      title: title,
      items: items,
      total: daily_cost
    };
  };
  bindAll = function(func) {
    $$('[role="checkbox"]').map(function(checkbox) {
      checkbox.addEventListener('click', (function(e) {
        setTimeout(((function(_this) {
          return function() {
            return func.call(_this);
          };
        })(this)), 200);
      }), false);
    });
  };
  buildDay = function(root, data) {
    var day, leastcost, notify, title, total, total_cost, ul;
    ul = void 0;
    leastcost = 50 - data.total;
    if (data.items) {
      ul = document.createElement('ul');
      data.items.forEach(function(item) {
        var li;
        li = document.createElement('li');
        li.appendChild(document.createTextNode(item));
        ul.appendChild(li);
      });
    }
    title = document.createElement('strong');
    title.appendChild(document.createTextNode(data.title));
    total = document.createElement('i');
    total.appendChild(document.createTextNode('Total: '));
    total_cost = document.createElement('b');
    total_cost.appendChild(document.createTextNode(data.total.toFixed(2)));
    total.appendChild(total_cost);
    day = document.createElement('div');
    day.appendChild(title);
    if (ul) {
      day.appendChild(ul);
    }
    day.appendChild(total);
    if (leastcost < 0) {
      day.setAttribute('class', 'day error');
    } else {
      if (leastcost < 5) {
        day.setAttribute('class', 'day warning');
      } else {
        day.setAttribute('class', 'day acceptable');
      }
      notify = document.createElement('i');
      notify.appendChild(document.createTextNode('(' + leastcost.toFixed(2) + ')'));
      total_cost.appendChild(notify);
    }
    root.appendChild(day);
  };
  graph = function(root, e) {
    var leastcost, res;
    $$('div', root).forEach(function(element, index) {
      element.remove();
    });
    leastcost = 50 - getDaily(this.closest('[role="listitem"]')).total;
    $$('[role="checkbox"][aria-checked="false"]', this.closest('[role="listitem"]')).forEach(function(item) {
      var p;
      p = getPrice(item);
      if (p > leastcost) {
        return item.closest('label').setAttribute('style', 'opacity: 0.4;');
      } else {
        return item.closest('label').setAttribute('style', '');
      }
    });
    res = $$('[role="listitem"]').map(function(e) {
      return getDaily(e);
    }).filter(function(e) {
      return e.total > 0;
    }).forEach(function(day, index) {
      buildDay(root, day);
    });
  };
  loadScripts = function(scripts, complete) {
    var loadScript;
    loadScript = function(src) {
      var e, error, next, xmlhttp;
      xmlhttp = void 0;
      next = void 0;
      if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest;
      } else {
        try {
          xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (error) {
          e = error;
          return;
        }
      }
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          w["eval"](xmlhttp.responseText);
          next = scripts.shift();
          if (next) {
            loadScript(next);
          } else if (typeof complete === 'function') {
            complete();
          }
        }
      };
      xmlhttp.open('GET', src, true);
      xmlhttp.send();
    };
    loadScript(scripts.shift());
  };
  loadCss = function() {
    var style;
    style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', 'https://izikaj.github.io/foodporn.js/dst/main.min.css');
    return document.body.appendChild(style);
  };
  buildScaffold = function() {
    var body, root_el;
    body = document.getElementsByTagName('body')[0];
    root_el = document.createElement('div');
    root_el.setAttribute('class', 'foodporn_root');
    body.appendChild(root_el);
    return root_el;
  };
  loadCss();
  root_el = buildScaffold();
  loadScripts(['https://izikaj.github.io/foodporn.js/vendor/mustache.min.js'], function() {
    return bindAll(function(e) {
      graph.call(this, root_el);
    });
  });
  return this;
})(this);
