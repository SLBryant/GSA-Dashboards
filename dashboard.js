/** GWAC 5 **/

var tabName,
    swfName,
    tokenReqURL;

$(function() {
    var styleSheet = "<link rel='stylesheet' href='/resources/css/gwac.css' type='text/css' media='screen' />";
    $('body').append(styleSheet);

    $('.launch').click(function() {

        var bodyHeight = $('body').height();
        var windowHeight = $(window).height();
        if (windowHeight > bodyHeight) {
            var curtainHeight = windowHeight
        } else {
            var curtainHeight = bodyHeight
        }
        $('#popupCurtain').css('height', curtainHeight + 100).fadeIn(200);

        $('#popup').delay(400).fadeIn(300);
        if (parseInt(windowHeight) < 740) {
            $('#popup').css('height', windowHeight);
        }
        $('#popup div').first().show();
        tabName = $('#popup ul li').first().attr('tab'); //'gwac';
        swfName = $('#popup ul li').first().attr('swf'); //'https://dashboards.fas.gsa.gov/Publicationapp/GWAC_Dashboard.swf'
        tokenReqURL = $('#popup ul li').first().attr('token');
        gwacRequest(swfName, tabName, tokenReqURL);
        if (typeof(dataLayer) != "undefined") {
            var virtualEvent = {
                'event': 'virtualEvent'
            }

            //Apply event params (remove lines that do not apply)
            virtualEvent.eventCategory = 'GWACs Dashboard';
            virtualEvent.eventAction = 'Launch';

            //Push to GTM dataLayer
            dataLayer.push(virtualEvent)
        }
    });

    $('#close,.gwac-close').click(function() {
        $('#popup div').html('');
        $('#popup li').first().click();
        setTimeout(function() {
            $('#popup').fadeOut(200);
            $('#popupCurtain').delay(400).fadeOut(300);
        }, 500);
    })

    $('#popup li').click(function() {
        var tabName = $(this).attr('tab');
        $('#popup div#' + tabName).show().siblings('div').hide();
        $('#popup div#' + tabName).siblings('div.swf').html('');
        $(this).addClass('active').siblings('li').removeClass('active');

        var swfName = $(this).attr('swf');
        var tokenReqURL = $(this).attr('token')

        if (typeof(dataLayer) != "undefined") {
            var virtualEvent = {
                'event': 'virtualEvent'
            }

            //Apply event params (remove lines that do not apply)
            virtualEvent.eventCategory = 'GWACs Dashboard';
            virtualEvent.eventAction = 'Tab Link';
            virtualEvent.eventLabel = tabName;

            //Push to GTM dataLayer
            dataLayer.push(virtualEvent)
        }

        if ($(this).attr('swf')) {
            gwacRequest(swfName, tabName, tokenReqURL);
        };
    });

});

function gwacRequest(swf, tab, tokenReqURL) {

    if (tokenReqURL) {
        requestToken(tokenReqURL)
    } else {
        embed(swf)
    }

    function requestToken() {
        $.ajax({
            type: "POST",
            url: tokenReqURL,
            success: appendToken,
            dataType: 'json'
        });
    }

    function appendToken(data) {
        var token = 'CELogonToken=' + data.token;
        embed(swf, token)

    }

    function embed(url, token) {
        var embed = '<object width="1200" height="666"><param name="movie" value="{{url}}"><param name="flashvars" value="{{token}}"><embed src="{{url}}" flashvars="{{token}}" width="1200" height="666"></embed></object>';
        embed = embed.replace(/\{\{url\}\}/g, url).replace(/\{\{token\}\}/g, token);
        $('#popup div#' + tab).html(embed);
    }
}
