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
    tr.translate(-cam.x, -cam.y);
    tr.scale(cam.sx, cam.sy);
}
