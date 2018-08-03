/**
 * Assets
 * @author Jani Nykänen
 */


// Assets object
assets = {};

// How many files loaded
assets.loaded = 0;
// File total
assets.total = 0;
// Image stack
assets.images = [];
// Bitmaps
assets.bitmaps = {};
// Audio
assets.audio = {};


/**
 * Load assets
 * @param imgList A list of images
 * @param imgPath Bitmap folder path
 * @param audioList A list of audio
 * @param audioPath Audio folder path
 */
assets.load = function(imgList, imgPath, audioList, audioPath) {

    // Set images to be loaded
    for(var k in imgList) {

        assets.load_bitmap(k, imgPath + "/" + imgList[k]);
    }

    if(audioList == null) return;
    // Set samples to be loaded
    for(var k in audioList) {

        assets.load_sound(k, audioPath + "/" + audioList[k]);
    }
}


/**
 * Add a bitmap to be loaded
 * @param name Bitmap name
 * @param url Url
 */
assets.load_bitmap = function(name, url) {

    ++ assets.total;

    var image = new Image();
    image.onload = function() {

        assets.bitmaps[name] = new Bitmap(image);
        ++ assets.loaded;
    }
    image.src = url;
    assets.images.push(image);
}


/**
 * Load a sound
 * @param name Asset name
 * @param url Asset url
 */
assets.load_sound = function(name, url) {

    ++ assets.total;

    assets.audio[name] = new Howl({
        src: [url],
        onload: function() {

            ++ assets.loaded;
        }
    });
}


/**
 * Are the assets loaded
 * @return True or false
 */
assets.has_loaded = function() {

    return assets.loaded >= assets.total;
}


/**
 * Get how many % of data has been loaded
 * @return Percentage
 */
assets.get_percentage = function() {

    if(assets.total == 0) return 0.0;
    return Math.round(assets.loaded / assets.total * 100.0);
}
