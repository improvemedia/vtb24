(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-77654161-1', 'auto');
ga('send', 'pageview');

$(document).on('click', '.js-quizStart', function() {
  ga('send', 'event', 'quiz', 'start', 'start');
})

$(document).on('click', 'a[href="/impression.html"]', function(e) {
  ga('send', 'event', 'quiz', 'btns', 'impression');
})

$(document).on('click', 'a[href*="#!/finances"]', function(e) {
  ga('send', 'event', 'quiz', 'btns', 'plan finances');
})

$(document).on('click', 'a[href*="vtb24.ru"]', function(e) {
  ga('send', 'event', 'quiz', 'exitToVtb', $(this).attr('href'));
})