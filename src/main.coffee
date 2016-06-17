((w) ->
  getPrice = (element) ->
    r = /\d+((\.|\,)\d+)?/g
    title = element.attributes['aria-label'].value
    _arr = title.match(r)
    res = parseFloat(_arr[_arr.length - 1])
    parseFloat _arr[_arr.length - 1] or 0

  getDaily = (group) ->
    daily_cost = 0
    title_c = group.querySelector('[role="heading"]')
    title = if title_c then title_c.textContent else ''
    items = Array::slice.call(group.querySelectorAll('[role="checkbox"][aria-checked="true"]')).map((item) ->
      daily_cost += getPrice(item)
      item.attributes['aria-label'].value
    )
    {
      title: title
      items: items
      total: daily_cost
    }

  log = ->
    console.log Array::slice.call(document.querySelectorAll('[role="checkbox"]')).map((e) ->
      getDaily e
    ).filter((e) ->
      e.total > 0
    ).map((day) ->
      [
        day.title
        day.items
        [
          'Total:'
          day.total
        ].join(' ')
      ].join '\n'
    ).join('*****\n')
    return

  bindAll = (func) ->
    Array::slice.call(document.querySelectorAll('[role="checkbox"]')).map (checkbox) ->
      checkbox.addEventListener 'click', (->
        setTimeout func, 200
        return
      ), false
      return
    return

  buildDay = (root, data) ->
    ul = undefined
    leastcost = 50 - (data.total)
    if data.items
      ul = document.createElement('ul')
      data.items.forEach (item) ->
        li = document.createElement('li')
        li.appendChild document.createTextNode(item)
        ul.appendChild li
        return
    title = document.createElement('strong')
    title.appendChild document.createTextNode(data.title)
    total = document.createElement('i')
    total.appendChild document.createTextNode('Total: ')
    total_cost = document.createElement('b')
    total_cost.appendChild document.createTextNode(data.total.toFixed(2))
    total.appendChild total_cost
    day = document.createElement('div')
    day.appendChild title
    if ul
      day.appendChild ul
    day.appendChild total
    if leastcost < 0
      day.setAttribute 'class', 'day error'
    else
      if leastcost < 5
        day.setAttribute 'class', 'day warning'
      else
        day.setAttribute 'class', 'day acceptable'
      notify = document.createElement('i')
      notify.appendChild document.createTextNode('(' + leastcost.toFixed(2) + ')')
      total_cost.appendChild notify
    root.appendChild day
    return

  graph = (root) ->
    Array::slice.call(root.childNodes).forEach (element, index) ->
      element.remove()
      return
    res = Array::slice.call(document.querySelectorAll('[role="listitem"]')).map((e) ->
      getDaily e
    ).filter((e) ->
      e.total > 0
    ).forEach((day, index) ->
      buildDay root, day
      return
    )
    return

  loadCss = ->
    style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', 'https://izikaj.github.io/foodporn.js/dst/main.min.css');
    document.body.appendChild(style);

  buildScaffold = ->
    body = document.getElementsByTagName('body')[0]
    root_el = document.createElement('div')
    root_el.setAttribute 'class', 'foodporn_root'
    body.appendChild root_el
    root_el

  loadCss()
  root_el = buildScaffold()
  bindAll ->
    graph root_el
    return
  this
)(this)
