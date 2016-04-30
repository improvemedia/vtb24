data = require('../data/quiz')

Component.define 'quiz',
  events:
    'click on %start': 'start'
    'click on %next': 'nextQuestion'
    'click on %answer': 'checkAnswer'

  start: ->
    @questionIndex = @score = 0

    @renderQuestion(@question = @quiz.questions[0])
    @sendStatStart()

  nextQuestion: (e) ->
    e.preventDefault()

    if ++@questionIndex == @quiz.questions.length
      @renderResult()
    else
      @renderQuestion(@question = @quiz.questions[@questionIndex])

  checkAnswer: (e, $el) ->
    e.preventDefault()

    return if $(e.target).is(':checkbox')

    $el.addClass('is-checked')

    @$("%answer:eq(#{ @question.correct })").addClass('is-correct')

    if $el.index() == @question.correct
      @score++
    else
      @$("%answer:eq(#{ $el.index() })").addClass('is-error')

    @$('%question').addClass('is-answered')
    @$('%next').removeClass('is-disabled')

    @sendStatAnswer($el.index())

  # Рендеринг шаблонов

  renderResult: ->
    result = @quiz.results[@score]

    @$('%view').html(Templates.result(
      result: result
      cover_url: @quiz.logo_url
      quiz: @quiz
      score: @score
      totalQuestions: @quiz.questions.length
      socialTypes: ['fb', 'tw', 'vk']
    ))

    @$('%%shareBtn').attr
      'data-url': @quiz.share_url
      'data-title': @quiz.title || ''
      'data-twitter-title': @quiz.title || ''
      'data-description': @quiz.description || ''
      'data-image': @quiz.questions[@score].result_url || ''

    Component.vitalize(@$('%view'))

  renderQuestion: (question) ->
    @$('%view').html(Templates.question(
      question: question
      questionIndex: @questionIndex + 1
      totalQuestions: @quiz.questions.length
    ))

  # Отправка статистики

  sendStatAnswer: (answer) ->
    # $.post("/quiz/#{ @quiz.id }/questions/#{ @question.id }/answer", answer: answer)

  sendStatStart: (answer) ->
    # $.post("/quiz/#{ @quiz.id }/start")
