docCookies = require('../lib/doc-cookies')
data = require('../data/posts')

Component.define 'posts',
  init: ->
    result = data[docCookies.getItem('resultQuizKey') || 'smart']
    posts = result.posts
    @$block.html(posts.map((post) ->Templates.post(post)).join(''))

    # trash style
    $title = $('.posts_title')
    $title.text("#{$title.text()} #{result.title}")