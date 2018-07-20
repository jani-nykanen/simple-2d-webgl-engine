// Camera
// (c) 2018 Jani Nykänen

// Constants
const CAMERA_HEIGHT = 720.0;

// Camera object
cam = {
    x: 0,
    y: 0,
    sx: 1,
    sy: 1,
};

// Use camera
cam.use = function() {

    tr.fit_view_height_center(CAMERA_HEIGHT);
    tr.scale(cam.sx, cam.sy);
    tr.translate(-cam.x, -cam.y);
    
}

// Limit camera 
cam.limit = function(w, h) {

    var minx = -w/2;
    var maxx = -minx;
    var miny = -h/2;
    var maxy = -miny;
    
    var tw = tr.viewport.w / 2;
    var th = tr.viewport.h / 2;

    var left = cam.x - tw/cam.sx;
    var top = cam.y - th/cam.sy;
    var right = cam.x + tw/cam.sx;
    var bottom = cam.y + th/cam.sy;

    if(left < minx) {

        cam.x = minx + tw/cam.sx;
    }
    else if(right > maxx) {

        cam.x = maxx - tw/cam.sx;
    }

    if(top < miny) {

        cam.y = miny + th/cam.sy;
    }
    else if(bottom > maxy) {

        cam.y = maxy- th/cam.sy;
    }
}
