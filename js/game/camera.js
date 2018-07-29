// Camera
// (c) 2018 Jani Nykänen

// Constants
const CAMERA_HEIGHT = 720.0;
const CAM_ZOOM_SPEED = 0.5 / 60.0;
const CAM_ZOOM_GAME_OVER = 0.05;

// Camera object
cam = {
    x: 0,
    y: 0,
    sx: 1.5,
    sy: 1.5,
    left: 0,
    top: 0,
    w: 1,
    h: 1,
};


// Reset camera
cam.reset = function() {

    cam.x = 0;
    cam.y = 0;
    cam.sx = 1.5;
    cam.sy = 1.5;
}
cam.reset();


// Use camera
cam.use = function() {

    tr.fit_view_height_center(CAMERA_HEIGHT);
    tr.scale(cam.sx, cam.sy);
    tr.translate(-cam.x, -cam.y);

    cam.w = tr.viewport.w / cam.sx;
    cam.h = tr.viewport.h / cam.sy;

    cam.left = cam.x - cam.w/2;
    cam.top = cam.y - cam.h/2;
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


// Called when fading
cam.zoom = function(tm) {

    if(_status.gameOver ) {

        cam.sx += CAM_ZOOM_GAME_OVER * tm;
        cam.sy = cam.sx;
    }
    else {

        if(cam.sx > 1.0) {

            cam.sx -= CAM_ZOOM_SPEED * tm;
            if(cam.sx <= 1.0) {

                cam.sx = 1.0;
            }
        }
        cam.sy = cam.sx;

    }
}
