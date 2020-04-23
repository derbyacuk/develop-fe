import $ from 'jquery';
import YouTubePlayer from 'youtube-player';

function getRandomVid() {

    if (!!self.vid == true) {
        return Math.floor(Math.random()*self.vid.length);
    }

    return false;
}

var currVid = getRandomVid();

function getNextVid() {

    if (currVid == self.vid.length - 1) {
        currVid = 0;
    } else {
        currVid += 1;
    }

}

var tv,
stateNames;
/**
 * @see https://developers.google.com/youtube/iframe_api_reference#Events
 */
 stateNames = {
    '-1': 'unstarted',
    0: 'ended',
    1: 'playing',
    2: 'paused',
    3: 'buffering',
    5: 'video cued'
};

if ($('.tv').length && !!self.vid === true) {

    tv = YouTubePlayer('tv', {
        playerVars: {autoplay: 1, autohide: 1, modestbranding: 1, rel: 0, showinfo: 0, controls: 0, disablekb: 1, enablejsapi: 0, iv_load_policy: 3},
    });

    if ($('.tv').is(":visible")) {

        tv.loadVideoById(self.vid[currVid]);
        tv.mute();
        tv.on('ready', function () {
            vidRescale();
        });


        tv.playVideo();

        tv.on('stateChange', function (event) {
            if (!stateNames[event.data]) {
                throw new Error('Unknown state (' + event.data + ').');
            }

            if (event.data == 1) {
                vidRescale();
                $("#tv").addClass("active");
            }

            if (event.data == 2 || event.data == 0) {
                $("#tv").removeClass("active");
                getNextVid();
                tv.loadVideoById(self.vid[currVid]);
                tv.playVideo();
            }
        });
    }

    $(window).on('resize', vidRescale);
}

function vidRescale(){
    var w = $('.video-hero').first().width()+200,
    h = $('.video-hero').first().height()+200;

    if (w/h > 16/9){
        tv.setSize(w, w/16*9);
        $('.tv .screen').css({'left': '0px'});
    } else {
        tv.setSize(h/9*16, h);
        $('.tv .screen').css({'left': -($('.tv .screen').outerWidth()-w)/2});
    }
}