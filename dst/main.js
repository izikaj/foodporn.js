(function (w) {
  getPrice = function(element) {
    r = /\d+((\.|\,)\d+)?/g
    var title = element.attributes["aria-label"].value
    _arr = title.match(r)
    res = parseFloat(_arr[_arr.length-1])
    return parseFloat(_arr[_arr.length-1] || 0)
  }

  getDaily = function(group) {
    var daily_cost = 0
    var title_c = group.querySelector('[role="heading"]')
    var title = title_c ? title_c.textContent : ''

    items = Array.prototype.slice
      .call(group.querySelectorAll('[role="checkbox"][aria-checked="true"]'))
      .map(function(item) {
        daily_cost += getPrice(item)
        return item.attributes["aria-label"].value
      })
    return  { title: title, items: items, total: daily_cost }
  }

  log = function() {
    res = Array.prototype.slice
      .call(document.querySelectorAll('[role="checkbox"]'))
      .map(function(e) { return getDaily(e) }).filter(function(e) { return e.total > 0 })
      .map(function(day) {
        return  [day.title, '', day.items, '', ['Total:', day.total].join(' '), ''].join('\n')
      }).join('*****\n')
    console.log(res)
  }

  bindAll = function(func) {
    Array.prototype.slice
      .call(document.querySelectorAll('[role="checkbox"]'))
      .map(function(checkbox) {
        checkbox.addEventListener('click', function(){
          setTimeout(func, 200)
        }, false);
      })
  }

  buildDay = function(root, data) {
    var ul
    var leastcost = 50 - data.total
    if(data.items) {
      ul = document.createElement('ul')
      ul.setAttribute('style', 'margin: 5px 0px; padding: 0 0 0 26px;')
      data.items.forEach( function(item) {
        var li = document.createElement('li')
        li.appendChild(document.createTextNode(item))
        ul.appendChild(li)
      })
    }
    var title = document.createElement('strong')
    title.appendChild(document.createTextNode(data.title))

    var total = document.createElement('i')
    total.setAttribute('style', 'display: block; margin: 0 0 8px 20%;')
    total.appendChild(document.createTextNode('Total: '))
    var total_cost = document.createElement('b')
    total_cost.setAttribute('style', 'font-size: 110%;')
    total_cost.appendChild(document.createTextNode(data.total.toFixed(2)))
    total.appendChild(total_cost)

    var day = document.createElement('div')
    day.appendChild(title)
    if(ul) { day.appendChild(ul) }
    day.appendChild(total)

    if (leastcost<0) {
      day.setAttribute('style', 'background: #F99F9F; padding: 0.5em;')
      // notify = document.createElement('u')
      // notify.appendChild(document.createTextNode("Total cost > 50!!! "))
      // notify.setAttribute('style', 'display: block;')
      // day.appendChild(notify)
    } else {
      day.setAttribute('style', 'background: #FFF; padding: 0.5em;')
      var notify = document.createElement('i')
      notify.setAttribute('style', 'font-size: 80%; color: #090; margin-left: 10px;')
      notify.appendChild(document.createTextNode('(' + leastcost.toFixed(2) + ')'))
      total_cost.appendChild(notify)
    }

    root.appendChild(day)
  }

  graph = function(root) {
    Array.prototype.slice
      .call(root.childNodes)
      .forEach( function(element, index) {
        element.remove()
      })
    res = Array.prototype.slice
      .call(document.querySelectorAll('[role="listitem"]'))
      .map(function(e) { return getDaily(e) }).filter(function(e) { return e.total > 0 })
      .forEach( function(day, index) {
        buildDay(root, day)
        // return  [day.title, '', day.items, '', ['Total:', day.total].join(' '), ''].join('\n')
      })
  }

  buildScaffold = function() {
    body = document.getElementsByTagName('body')[0]
    root_el = document.createElement('span')
    root_el.setAttribute('style', 'position:fixed;top:0px;right:0;width:300px;background:#FFF;opacity:0.8;')
    body.appendChild(root_el)
    return root_el
  }

  res = Array.prototype.slice
    .call(document.querySelectorAll('[role="listitem"]'))
    .map(function(e) { return getDaily(e) }).filter(function(e) { return e.total > 0 })
    .map(function(day) {
      return  [day.title, '', day.items, '', ['Total:', day.total].join(' '), ''].join('\n')
    }).join('*****\n')

  var root_el = buildScaffold()
  bindAll( function() {
    graph(root_el)
  })

  return this
})(this)
