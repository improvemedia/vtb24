window.jQuery = window.$ = require('jquery')
page = require('page')
attachFastClick = require('fastclick')

docCookies = require('./lib/doc-cookies.js')
window.jade = require('./lib/pug-runtime')

require('./lib/component')
require('./components/header')
require('./components/quiz')
require('./components/share-btn')
require('./components/carousel')
require('./components/posts')
require('./ga')

data = require('./data/quiz')

attachFastClick(document.body)
$(document).ready -> Component.vitalize(); $('#page').addClass('is-ready')

page('*', (ctx,  next) ->
  return next() if ctx.init

  $('#page').addClass('is-hidding').removeClass('is-ready')

  setTimeout((->
    next()
    $('#page').removeClass('is-hidding')
    setTimeout((-> $('#page').addClass('is-ready')), 0)
    Component.vitalize()
  ), 600)
)

makeComponent = (name) ->
  $("<div data-component='#{name}'></div>")

appendToPage = (content) ->
  $('#page').html(content)

page('/', -> appendToPage(makeComponent('quiz')))

page('/result', ->
  ga('send', 'event', 'quiz', 'finish', 'yeah')
  page('/') unless key = docCookies.getItem('resultQuizKey')
  result = data.results[docCookies.getItem('resultQuizKey')]
  result.url = location.protocol + "//" + location.host
  result.image = location.protocol + "//" + location.host + result.image
  appendToPage(Templates.result(result))
)

page('/finances', -> appendToPage(Templates.finances()))

page(hashbang: true)