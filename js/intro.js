// Intro scene
// (c) 2018 Jani Nykänen

// Intro scene object
intro = {};


// Initialize
intro.init = function() {

    // ...
}


// Update
intro.update = function(tm) {

}


// Draw
intro.draw = function() {

    // Set view
    tr.identity();
    cam.set_scale(1, 1);
    cam.use();
    tr.use_transform();
 
    // Draw background
    bg.draw();
}


// Add scene
core.add_scene(new Scene(intro.init, intro.update, intro.draw, null), "intro");
