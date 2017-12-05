$(function(){
    var sentry_dsn = $('body').data('sentry-dsn');
    if (sentry_dsn !== undefined){
        Raven.config(sentry_dsn, {
            ignoreErrors: [
                'jQuery is not defined',
                 '$ is not defined',
                 'Can\'t find variable: jQuery',
                 'Socialite is not defined',
                 'Persistent storage maximum size reached'
            ]
        }).install();
    }
});
