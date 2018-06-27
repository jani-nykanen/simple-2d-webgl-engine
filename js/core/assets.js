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


/**
 * Load assets
 * @param imgList A list of images
 */
assets.load = function(imgList, imgPath) {

    // Set images to be loaded
    for(var k in imgList) {

        assets.load_bitmap(k, imgPath + "/" + imgList[k]);
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
 * Are the assets loaded
 * @return True or false
 */
assets.has_loaded = function() {

    return assets.loaded >= assets.total;
}
