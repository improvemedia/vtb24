Component.define 'header',
  events:
    'click on %toggler': 'onToggle'

  onToggle: ->
    @$block.toggleClass('is-open')