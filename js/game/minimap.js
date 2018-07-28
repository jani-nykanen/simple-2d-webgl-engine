// Minimap
// (c) 2018 Jani Nykänen

// Constants
const MINIMAP_WIDTH = 256;
const MINIMAP_HEIGHT = 256;

// Minimap global object
miniMap = {};


// Get object position (and radius) projected to minimap coordinates
miniMap.get_obj_pos = function(o) {

    let x = o.pos.x;
    let y = o.pos.y;

    x += AREA_WIDTH / 2.0;
    y += AREA_HEIGHT / 2.0;

    x /= AREA_WIDTH;
    y /= AREA_HEIGHT;

    x *= MINIMAP_WIDTH;
    y *= MINIMAP_HEIGHT;

    let rad = Math.ceil( o.radius / AREA_WIDTH * MINIMAP_WIDTH );

    return {x: x, y: y, rad: rad};
}


// Draw camera area
miniMap.draw_cam_area = function() {

    const LINE_WIDTH = 3;

    let left = cam.left + AREA_WIDTH/2.0;
    let top = cam.top + AREA_HEIGHT/2.0;
    let w = cam.w;
    let h = cam.h;

    left /= AREA_WIDTH;
    top /= AREA_HEIGHT;
    w /= AREA_WIDTH;
    h /= AREA_HEIGHT;

    left *= MINIMAP_WIDTH;
    top *= MINIMAP_HEIGHT;
    w *= MINIMAP_WIDTH;
    h *= MINIMAP_HEIGHT;

    graph.set_color(1,1,1,0.75);

    // Horizontal
    graph.fill_rectangle(left, top, w, LINE_WIDTH);
    graph.fill_rectangle(left, top+h, w + LINE_WIDTH, LINE_WIDTH);

    // Vertical
    graph.fill_rectangle(left, top, LINE_WIDTH, h);
    graph.fill_rectangle(left+w, top, LINE_WIDTH, h);

    graph.set_color(1,1,1,1);
}


// Draw an object icon
miniMap.draw_object_icon = function(o, sx, sy, sw, sh, angle) {

    let p = miniMap.get_obj_pos(o);

    if(angle != null) {

        tr.push();
        tr.translate(p.x, p.y);
        tr.rotate(o.angle * angle);
        tr.use_transform();

        graph.draw_scaled_bitmap_region(assets.bitmaps.mapIcons,
            sx, sy, sw, sh, -p.rad, -p.rad, p.rad*2, p.rad*2, 0);

        tr.pop();
    }
    else {

        p.x -= p.rad;
        p.y -= p.rad;

        graph.draw_scaled_bitmap_region(assets.bitmaps.mapIcons,
            sx, sy, sw, sh, p.x, p.y, p.rad*2, p.rad*2, 0);
    }
}


// Initialize minimap
miniMap.init = function() {

    miniMap.target = new Bitmap(null, true, MINIMAP_WIDTH, MINIMAP_HEIGHT);
}


// Update minimap (may not be needed)
miniMap.update = function(tm) {

    // Draw content to the texture
    // (We do it here to avoid transformation problems)
    miniMap.target.draw_to(function() {

        miniMap.draw_content();
    })

    graph.set_color(1,1,1,1);
}


// Draw content
miniMap.draw_content = function() {

    const GRID_LOOP = 6;
    const GRID_WIDTH = 3;

    tr.identity();
    tr.set_view(MINIMAP_WIDTH, MINIMAP_HEIGHT);
    tr.use_transform();

    graph.clear(0, 0, 0);

    // Draw grid
    let jumpx = MINIMAP_WIDTH / GRID_LOOP;
    let jumpy = MINIMAP_HEIGHT / GRID_LOOP;
    graph.set_color(0,0.5,0,1);
    for(var i = 1; i < GRID_LOOP; ++ i) {

        graph.fill_rectangle(0, i * jumpy, MINIMAP_WIDTH, GRID_WIDTH);
        graph.fill_rectangle(i * jumpx, 0, GRID_WIDTH, MINIMAP_HEIGHT);
    }
    graph.set_color(1,1,1,1);

    // If hurt, make "whiter"
    if(objman.heart.hurtTimer > 0.0) {

        let s = Math.abs(Math.sin(objman.heart.hurtTimer / HEART_HURT_MAX 
            * (Math.PI*2 * HEART_HURT_MOD)));
        let t = 1 + 3*s;
        graph.set_color(t,t,t, 1);
    }

    // Draw heart
    miniMap.draw_object_icon(objman.heart, 32,0,32,32);
    graph.set_color(1,1,1,1);

    // Draw player
    miniMap.draw_object_icon(objman.player, 0,0,32,32, -1);

    // Draw creatures
    for(var i = 0; i < ANIMAL_COUNT; ++ i) {

        
        if(objman.creatures[i].exist) {

            let t = 0;
            if(objman.creatures[i].isMonster)
                t = 1;
            else if(objman.creatures[i].skeleton)
                t = 2;

            miniMap.draw_object_icon(objman.creatures[i], 
                64 + t*32,0,32,32, 1);
        }
    }

    // Draw camera area
    miniMap.draw_cam_area();
}


// Draw minimap
miniMap.draw = function(x, y, sx, sy) {

    const ALPHA = 0.5;

    // Draw map to the screen
    graph.set_color(1,1,1, ALPHA);
    graph.draw_scaled_bitmap(this.target,x,y,sx,sy, FLIP_V);
    graph.set_color(1,1,1,1);
}
