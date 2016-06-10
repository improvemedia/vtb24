$ = require('jquery')
docCookies = require('../lib/doc-cookies.js')

Component.define 'carousel',
  events:
    'click on %item': 'goTo'

  init: ->
    @setCurrent()

    @$block.css(
      position: 'relative'
      height: @$block.height()
    )

    @$('%item').css(
      position: 'absolute'
    )

    @setPositions()

  setCurrent: ->
    result = docCookies.getItem('resultQuizKey') || 'fast'
    $current = @$('%item').filter("[data-type='#{result}']").addClass('is-active is-his')
    $current.after(@$('%item:first-child')) if $current.index() == 2
    $current.before(@$('%item:last-child')) if $current.index() == 0

    $current.find('.js-desc').fadeIn()

  getActiveItem: ->
    @$('%item').filter('.is-active')

  getContWidth: ->
    return @contWidth if @contWidth
    @contWidth = @$block.outerWidth()

  getOffsetSize: ->
    return @offsetSize if @offsetSize
    @itemSize = @$('%item').first().outerWidth()
    @offsetSize = @itemSize + 20

  setPositions: ->
    col = @getOffsetSize()
    offset = 0

    @$('%item').each(->
      $(@).css(left: offset)
      offset = offset + col
    )

  goTo: (e, $el) ->
    return if $el.hasClass('is-active')
    @getActiveItem().find('.js-desc').fadeOut()

    @$('%item').removeClass('is-active')
    $el.addClass('is-active')
    $el.find('.js-desc').fadeIn()

    if parseInt($el.css('left')) < @getContWidth()/2
      @moveLeft()
    else
      @moveRight()

  moveLeft: ->
    @$('%item').each (i, el) =>
      cp = parseInt($(el).css('left'))
      np = if cp <= @getContWidth() - @getOffsetSize() then cp + @getOffsetSize() else 0
      $(el).animate(left: np, { duration: 800 })

  moveRight: ->
    @$('%item').each (i, el) =>
      cp = parseInt($(el).css('left'))
      np = if cp == 0 then @getContWidth() - @itemSize else cp - @getOffsetSize()
      $(el).animate(left: np, { duration: 800 })
