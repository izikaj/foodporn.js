((w) ->
  $$ = (selector, root = undefined)->
    Array::slice.call((root || document).querySelectorAll(selector))
  $ = (selector, root = undefined)->
    (root || document).querySelector(selector)

  getPrice = (element) ->
    r = /\d+((\.|\,)\d+)?/g
    title = element.attributes['aria-label'].value
    _arr = title.match(r)
    res = parseFloat(_arr[_arr.length - 1])
    parseFloat _arr[_arr.length - 1] or 0

  getDaily = (group) ->
    daily_cost = 0
    title = $('[role="heading"]', group)?.textContent
    items = $$('[role="checkbox"][aria-checked="true"]', group).map((item) ->
      daily_cost += getPrice(item)
      item.attributes['aria-label'].value
    )
    {
      title: title
      items: items
      total: daily_cost
    }

  bindAll = (func) ->
    $$('[role="checkbox"]').map (checkbox) ->
      checkbox.addEventListener 'click', ((e)->
        setTimeout (=>
          func.call(this)), 200
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

  graph = (root, e) ->
    $$('div', root).forEach (element, index) ->
      element.remove()
      return

    leastcost = 50 - getDaily(this.closest('[role="listitem"]')).total
    $$('[role="checkbox"][aria-checked="false"]', this.closest('[role="listitem"]')).forEach (item)->
      p = getPrice(item)
      if (p > leastcost)
        item.closest('label').setAttribute('style', 'opacity: 0.4;')
      else
        item.closest('label').setAttribute('style', '')

    res = $$('[role="listitem"]').map((e) ->
      getDaily e
    ).filter((e) ->
      e.total > 0
    ).forEach((day, index) ->
      buildDay root, day
      return
    )
    return

  loadScripts = (scripts, complete) ->

    loadScript = (src) ->
      xmlhttp = undefined
      next = undefined
      if window.XMLHttpRequest
        xmlhttp = new XMLHttpRequest
      else
        try
          xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
        catch e
          return

      xmlhttp.onreadystatechange = ->
        if xmlhttp.readyState == 4 and xmlhttp.status == 200
          w.eval(xmlhttp.responseText)
          next = scripts.shift()
          if next
            loadScript next
          else if typeof complete == 'function'
            complete()
        return

      xmlhttp.open 'GET', src, true
      xmlhttp.send()
      return

    loadScript scripts.shift()
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

  loadScripts ['https://izikaj.github.io/foodporn.js/vendor/mustache.min.js'], ->
    bindAll (e)->
      graph.call(this, root_el)
      return

  this
)(this)
