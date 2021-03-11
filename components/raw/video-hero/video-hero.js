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
stateNames,
timer;
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
        playerVars: {autoplay: 1, autohide: 1, modestbranding: 1, rel: 0, showinfo: 0, controls: 0, disablekb: 0, enablejsapi: 0, iv_load_policy: 3},
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
                activateVideo();
                // if we don't want the video to loop set timeout to deactivate the video a second before it stops
                // this will stop the YouTube related videos flashing up at the end
                if (!self.vid[currVid]['loop']){
                    timer = new Timer(deactivateVideo, ((self.vid[currVid]['endSeconds'] - 1) * 1000));
                }
            }

            if (event.data == 0) {
                deactivateVideo();
                if (self.vid[currVid]['loop']){
                    getNextVid();
                    tv.loadVideoById(self.vid[currVid]);
                    tv.playVideo();
                }
            }
        });

        $("#pause").click(function(e){
            e.preventDefault();
            if ($(this).text().indexOf('Pause') != -1) {
                tv.pauseVideo();
                if (typeof(timer) !== 'undefined') timer.pause();
                $(this).html('Play<span class="button-overlay"><span>Play</span></span>');
            } else {
                tv.playVideo();
                if (typeof(timer) !== 'undefined') timer.resume();
                $(this).html('Pause<span class="button-overlay"><span>Pause</span></span>');
            }
        });
    }

    function activateVideo() {
        $("#tv, #pause").addClass("active");
        $(".video-hero-scroll-to-content-arrow").removeClass("active");
    }

    function deactivateVideo() {
        $("#tv, #pause").removeClass("active");
        $(".video-hero-scroll-to-content-arrow").addClass("active");
    }

    $(window).on('resize', vidRescale);
}

var Timer = function(callback, delay) {
        var timerId, start, remaining = delay;

        this.pause = function() {
            window.clearTimeout(timerId);
            remaining -= Date.now() - start;
        };

        this.resume = function() {
            start = Date.now();
            window.clearTimeout(timerId);
            timerId = window.setTimeout(callback, remaining);
        };

        this.resume();
    };

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
