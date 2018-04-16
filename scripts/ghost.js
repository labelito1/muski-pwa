var q = "[{ id: 0, value: 'AAC 256k VBR}, { id: 1, value: 'MP3 192k VBR}, { id: 2, value: 'Opus 96k VBR}]";
var quality = JSON.parse(q);
var audio = document.createElement('audio');
var audiosource = document.createElement('source');
fill_artists();
fill_albums();
fill_tracks();

var selectedQuality = 1;

function changeQuality() {
    if ((selectedQuality + 1) <= 2) {
        selectedQuality += 1;
    } else {
        selectedQuality = 0;
    }
    return getQualityDetails();
}

function getQualityDetails() {
    for (i = 0; i < quality.length; i++) {
        if (selectedQuality == quality[i].id) {
            return quality[i].value;
        }
    }
}

function fill_artists() {
    $.ajax({
        url: "https://raw.githubusercontent.com/labelito1/ghostadmin/master/migh.admin/bin/Debug/ghost-artists.json",
        success: function (result) {
            //alert(result);
            __artists__ = JSON.parse(result);
        }
    });
};

function fill_albums() {
    $.ajax({
        url: "https://raw.githubusercontent.com/labelito1/ghostadmin/master/migh.admin/bin/Debug/ghost-albums.json",
        success: function (result) {
            //alert(result);
            __albums__ = JSON.parse(result);
        }
    });
};

function fill_tracks() {
    $.ajax({
        url: "https://raw.githubusercontent.com/labelito1/ghostadmin/master/migh.admin/bin/Debug/ghost-tracks.json",
        success: function (result) {
            //alert(result);
            __tracks__ = JSON.parse(result);
        }
    });
};
var __artists__;
var __albums__;
var __tracks__;
var __queue__ = "";
var __nowplaying__ = -1;
var __nowplayingid__ = -1;
var __currentalbum__ = -1;

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function getAlbum(id) {
    for (var i = 0; i < __albums__.length; i++) {
        if (__albums__[i].id == id) {
            return __albums__[i];
        }
    }
    return null;
};

function getTrack(id) {
    for (var i = 0; i < __tracks__.length; i++) {
        if (__tracks__[i].id == id) {
            return __tracks__[i];
        }
    }
    return null;
};

function getArtist(id) {
    for (var i = 0; i < __artists__.length; i++) {
        if (__artists__[i].id == id) {
            return __artists__[i];
        }
    }
    return null;
};

function queueAdd(id) {
    if (__queue__ != null || __queue__ != undefined) {
        var ids = __queue__.split(";");
        __queue__ = "";
        for (var i = 0; i < ids.length; i++) {
            __queue__ += ids[i] + ";";
            if (i == __nowplaying__) {
                __queue__ += id + ";";
            }
        }
        __queue__ = __queue__.substring(0, __queue__.length - 1);
    } else {
        __queue__ += id + ";";
    }
};

function queueAddList(list) {
    if (__queue__ != null || __queue__ != undefined) {
        var ids = list.split(";");
        __queue__ = "";
        for (var i = 0; i < ids.length; i++) {
            __queue__ += ids[i] + ";";
            if (i >= __nowplaying__) {
                __queue__ += id + ";";
            }
        }
        __queue__ = __queue__.substring(0, __queue__.length - 1);
    } else {
        __queue__ = list;
    }
};

function queueAddListEnd(list) {
    var ids = list.split(";");
    for (var i = 0; i < ids.length; i++) {
        __queue__ += ";" + ids[i];
    }
    __queue__ = __queue__.substring(0, __queue__.length - 1);
};
var __prevalbum__;
$(document).ready(function () {
    if (window.location.hostname == 'ghost.somee.com') {
        window.oncontextmenu = function (event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
    }
    $("#lblAudioFormat").html(getQualityDetails());
    console.log(getQualityDetails());
    console.log(selectedQuality);
    fillArtists();
    adjustSize();
    adjustMisc();
    preLoadCovers();
    audio.appendChild(audiosource);
    audio.addEventListener("ended", __next__);

    function getTintedColor(color, v) {
        if (color.length > 6) {
            color = color.substring(1, color.length)
        }
        var rgb = parseInt(color, 16);
        var r = Math.abs(((rgb >> 16) & 0xFF) + v);
        if (r > 255) r = r - (r - 255);
        var g = Math.abs(((rgb >> 8) & 0xFF) + v);
        if (g > 255) g = g - (g - 255);
        var b = Math.abs((rgb & 0xFF) + v);
        if (b > 255) b = b - (b - 255);
        r = Number(r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r).toString(16);
        if (r.length == 1) r = '0' + r;
        g = Number(g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g).toString(16);
        if (g.length == 1) g = '0' + g;
        b = Number(b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b).toString(16);
        if (b.length == 1) b = '0' + b;
        return "#" + r + g + b;
    }
    var img = document.getElementById('imgSongCoverTop');
    img.addEventListener('load', function () {
        //        var track = getTrack(__nowplayingid__);
        //        var album = getAlbum(track.album_id);
        //        if (__prevalbum__ != album.id) {
        //            __prevalbum__ = album.id;
        //            var vibrant = new Vibrant(img);
        //            var swatches = vibrant.swatches();
        //            for (var swatch in swatches) {
        //                if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
        //                    console.log(swatches['Muted'].getHex());
        //                    $('#lblSongArtist').css('color', swatches['Muted'].getTitleTextColor());
        //                    $('#lblSongTitle').css('color', swatches['Muted'].getTitleTextColor());
        //                    $('#lblSongAlbum').css('color', swatches['Muted'].getTitleTextColor());
        //                    $('#form1').css('background', 'linear-gradient(to bottom,' + swatches['Muted'].getHex() + ' -30%,#000000 70%');
        //                    //var colors = swatches['Muted'].getRgb();
        //                    //var result = 'linear-gradient(' + getTintedColor('rgb(' + colors[0] + ', ' + colors[1] + ', ' + colors[2] + ')', 60);
        //                    //$('#topbar').css('background', result);
        //                    return;
        //                }
        //            }
        //            /*
        //             * Results into:
        //             * Vibrant #7a4426
        //             * Muted #7b9eae
        //             * DarkVibrant #348945
        //             * DarkMuted #141414
        //             * LightVibrant #f3ccb4
        //             */
        //        }
    });
    $('a').each(function () {
        $(this).data('href', $(this).attr('href')).hide();
    });
    $('div').each(function () {
        var index = $(this).css('z-index');
        if (index === '2147483647') {
            $(this).remove();
        }
        if ($(this).css('height') === '65px') {
            $(this).hide();
        }
    });
    var list = $("div");
    $('[z-index^=2147483647]').each(function () {
        divs.push($(this).html().hide());
    });
    for (var i = list.length - 1, item; item = list[i]; i--) {
        if ($(item).attr('z-index') == '2147483647') {
            $(item).hide()
        } else {}
    }
});

function changeColor() {}

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
