'use strict';

var FLXS = {
    userToken: localStorage.getItem('token'),
    userProfile: JSON.parse(localStorage.getItem('profile')),

    profileLoaded: new Event('FLXSProfileLoaded'),
    initComplete: new Event('FLXSInitComplete'),
    
    loadProfile: function () {
        // If we have a user token but no profile in local storage, then cache
        // the profile into local storage.
        if ((this.userToken) && (!this.userProfile)) {
            var req = $.post(
                    FLXSEnv.authService + '/a1/verifyjws',
                    JSON.stringify({jws: this.userToken}),
                    null,
                    'json'
                    );
            req.done(data => {
                localStorage.setItem('profile', JSON.stringify(data));
                this.userProfile = data;
                this.initTopNav();
                window.dispatchEvent(FLXS.profileLoaded);
            });
        }
    },

    initTopNav: function () {
        if (this.userProfile !== null) {
            $('#navbarLoginLink').addClass('d-none');
            $('#navbarProfileLink').removeClass('d-none');
            $('#navbarProfileLink a.nav-link').html(this.userProfile.nickname);
        }
    },

    logout: function () {
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
        this.userProfile = null;
        this.userToken = null;

        var url = new URL(window.location.href);
        window.location = url.origin + '';
    }
};

$(function () {
    FLXS.loadProfile();
    FLXS.initTopNav();
    window.dispatchEvent(FLXS.initComplete);
});
