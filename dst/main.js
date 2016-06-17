(function(w) {
  var bindAll, buildDay, buildScaffold, getDaily, getPrice, graph, loadCss, log, root_el;
  getPrice = function(element) {
    var _arr, r, res, title;
    r = /\d+((\.|\,)\d+)?/g;
    title = element.attributes['aria-label'].value;
    _arr = title.match(r);
    res = parseFloat(_arr[_arr.length - 1]);
    return parseFloat(_arr[_arr.length - 1] || 0);
  };
  getDaily = function(group) {
    var daily_cost, items, title, title_c;
    daily_cost = 0;
    title_c = group.querySelector('[role="heading"]');
    title = title_c ? title_c.textContent : '';
    items = Array.prototype.slice.call(group.querySelectorAll('[role="checkbox"][aria-checked="true"]')).map(function(item) {
      daily_cost += getPrice(item);
      return item.attributes['aria-label'].value;
    });
    return {
      title: title,
      items: items,
      total: daily_cost
    };
  };
  log = function() {
    console.log(Array.prototype.slice.call(document.querySelectorAll('[role="checkbox"]')).map(function(e) {
      return getDaily(e);
    }).filter(function(e) {
      return e.total > 0;
    }).map(function(day) {
      return [day.title, day.items, ['Total:', day.total].join(' ')].join('\n');
    }).join('*****\n'));
  };
  bindAll = function(func) {
    Array.prototype.slice.call(document.querySelectorAll('[role="checkbox"]')).map(function(checkbox) {
      checkbox.addEventListener('click', (function() {
        setTimeout(func, 200);
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
    if (leastcost === 0) {
      day.setAttribute('class', 'day warning');
    } else if (leastcost < 0) {
      day.setAttribute('class', 'day error');
    } else {
      day.setAttribute('class', 'day acceptable');
      notify = document.createElement('i');
      notify.appendChild(document.createTextNode('(' + leastcost.toFixed(2) + ')'));
      total_cost.appendChild(notify);
    }
    root.appendChild(day);
  };
  graph = function(root) {
    var res;
    Array.prototype.slice.call(root.childNodes).forEach(function(element, index) {
      element.remove();
    });
    res = Array.prototype.slice.call(document.querySelectorAll('[role="listitem"]')).map(function(e) {
      return getDaily(e);
    }).filter(function(e) {
      return e.total > 0;
    }).forEach(function(day, index) {
      buildDay(root, day);
    });
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
  bindAll(function() {
    graph(root_el);
  });
  return this;
})(this);
