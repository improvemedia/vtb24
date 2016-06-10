$ = require('jquery')
page = require('page')
data = require('../data/quiz')
docCookies = require('../lib/doc-cookies.js')

Component.define 'quiz',
  events:
    'click on %start': 'start'
    'change on %answer': 'nextQuestion'

  init: ->
    @quiz = data.quiz
    @questions = data.questions
    @render()

  render: ->
    @$block.html(Templates.quiz(@quiz))
    setTimeout(@endAnimate.bind(@), 100)

  goTo: (e, $el) ->
    return if @questionIndex <= $el.index()
    @questionIndex = $el.index()
    @renderQuestion(@question = @questions[@questionIndex])

  start: ->
    @answersStat = {}
    @questionIndex = @score = 0
    @renderQuestion(@question = @questions[0])

  nextQuestion: ->
    @writeAnswer()

    if ++@questionIndex == @questions.length
      docCookies.setItem('resultQuizKey', @getResultKey())
      page('/result')
    else
      @renderQuestion(@question = @questions[@questionIndex])

  writeAnswer: ->
    $el = @$(':checked')
    variant = $el.data('variant')
    @answersStat[variant] = 0 if @answersStat[variant] == undefined
    @answersStat[variant] += 1

  renderQuestion: (question) ->
    @animate(=>
      @prepareNav()
      @$('%view').html(Templates.question(question))
    )

  prepareNav: ->
    if @hasNav
      @nav
        .find('.is-active').removeClass('is-active')
        .next().addClass('is-active')
      return

    @nav = $(Templates.nav(
      items: [0...@questions.length]
      current: @questionIndex
    )).insertBefore(@$('%view'))

    @hasNav = true

  animate: (callback) ->
    @startAnimate()

    setTimeout((=>
      callback()
      @endAnimate()
    ), 600)

  startAnimate: ->
    $('#page').removeClass('is-ready').addClass('is-hidding')

  endAnimate: ->
    $('#page').removeClass('is-hidding')
    setTimeout((->$('#page').addClass('is-ready')), 1)

  getResultKey: ->
    Object.keys(@answersStat).sort((a, b) => @answersStat[a] < @answersStat[b])[0]