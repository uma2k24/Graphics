// Utsav Anantbhat


var gl;
var program;
const attrib_pos_loc = 0;
const attrib_col_loc = 1;

// Shader compilation: WebGL2 Boilerplate (https://webgl2fundamentals.org/webgl/lessons/webgl-boilerplate.html)
// Common shader files not used

// Create the vertex and fragment shaders
function compileShader(gl, shaderType, shaderSource) {
    // Create the shader object
    shader = gl.createShader(shaderType);
   
    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);
    
    // Compile the shader
    gl.compileShader(shader);
   
    // Check if it compiled
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      // Something went wrong during compilation; get the error
      throw ("could not compile shader:" + gl.getShaderInfoLog(shader));
    }
   
    return shader;
}
// Create the program
function createProgram(gl, vertexShader, fragmentShader) {
    // create a program.
    program = gl.createProgram();
   
    // attach the shaders.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
   
    // link the program.
    gl.linkProgram(program);
   
    // Check if it linked.
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        // something went wrong with the link; get the error
        throw ("program failed to link:" + gl.getProgramInfoLog(program));
    }
}

// Vertex + Fragment shader source: https://webgl2fundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
const vertexShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: vert

in vec2 attrib_pos;
in vec3 attrib_color;
out vec3 vert_color;

uniform float ent_dim; //entity dimension

void main(){
    vert_color = attrib_color;
    gl_Position = vec4(attrib_pos, 0.0, 1.0);
    gl_PointSize = ent_dim;
}`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision lowp float; // low precision for fragment shader (https://webgl2fundamentals.org/webgl/lessons/webgl-precision-issues.html)

in vec3 vert_color;
out vec4 frag_color;

void main(){
    frag_color = vec4(vert_color, 1.0);
}`;

// Create the canvas and intialize it
function init(){
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl2");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 0);
    return gl;
}
// Call all intialization functions and draw initial scene
function game_init(pac_move, pac_state, ghost_move, ghost, board){
    gl = init();
    
    vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    gl.enableVertexAttribArray(attrib_pos_loc);
    gl.enableVertexAttribArray(attrib_col_loc);
    
    render_game(pac_move, pac_state, ghost_move, ghost, board);
}


var pac_side_len = 0.15;
var pac_pos = [0,-.76];
var ghost1_pos = [0, 0.081]
var ghost2_pos = [0, -0.081]

const bg_dim = 1;
const play_area_dim = 0.8 * bg_dim;
const out_margin = 0.6 * bg_dim;
const in_margin = 0.3 * bg_dim;
const corr_margin = 0.085 * bg_dim;
const corr_margin2 = (corr_margin*10)/2;
const in_margin2 = in_margin/2;

// Set the vertex positions and colours for the background
const background_vertex_buffer = new Float32Array([
    // Background
    -bg_dim,-bg_dim,      0.4, 0.4, 0.4,
    bg_dim,-bg_dim,       0.4, 0.4, 0.4,
    -bg_dim,bg_dim,       0.4, 0.4, 0.4,
    bg_dim,bg_dim,        0.4, 0.4, 0.4,
    // Play Area
    -play_area_dim,-play_area_dim,    0.9, 0.9, 0.9,
    play_area_dim,-play_area_dim,     0.9, 0.9, 0.9,
    -play_area_dim,play_area_dim,     0.9, 0.9, 0.9,
    play_area_dim,play_area_dim,      0.9, 0.9, 0.9,
    // Top Left Wall
    -out_margin,in_margin,      0.0, 1.0, 0.0,
    -corr_margin,in_margin,     0.0, 1.0, 0.0,
    -out_margin,out_margin,     0.0, 1.0, 0.0,
    -corr_margin,out_margin,    0.0, 1.0, 0.0,
    // Center Left Wall
    -out_margin,-in_margin2,      0.0, 1.0, 0.0,
    -corr_margin2,-in_margin2,    0.0, 1.0, 0.0,
    -out_margin,in_margin2,       0.0, 1.0, 0.0,
    -corr_margin2,in_margin2,     0.0, 1.0, 0.0,
    // Bottom Left Wall
    -out_margin,-in_margin,     0.0, 1.0, 0.0,
    -corr_margin,-in_margin,    0.0, 1.0, 0.0,
    -out_margin,-out_margin,    0.0, 1.0, 0.0,
    -corr_margin,-out_margin,   0.0, 1.0, 0.0,
    // Top Right Wall
    out_margin,in_margin,       0.0, 1.0, 0.0,
    corr_margin,in_margin,      0.0, 1.0, 0.0,
    out_margin,out_margin,      0.0, 1.0, 0.0,
    corr_margin,out_margin,     0.0, 1.0, 0.0,
    // Center Right Wall
    out_margin,-in_margin2,       0.0, 1.0, 0.0,
    corr_margin2,-in_margin2,     0.0, 1.0, 0.0,
    out_margin,in_margin2,        0.0, 1.0, 0.0,
    corr_margin2,in_margin2,      0.0, 1.0, 0.0,
    // Bottom Right Wall
    out_margin,-in_margin,      0.0, 1.0, 0.0,
    corr_margin,-in_margin,     0.0, 1.0, 0.0,
    out_margin,-out_margin,     0.0, 1.0, 0.0,
    corr_margin,-out_margin,    0.0, 1.0, 0.0,
]);
// Set the indices used to draw shapes for background
const board_indices = new Uint8Array([
    0,1,2,3, // Background

    1,2, // Number pairs -> skip to next shape

    4,5,6,7, // Play Area

    5,6,

    8,9,10,11, // Top Left Wall

    9,10,

    12,13,14,15, // Center Left Wall

    13,14,

    16,17,18,19, // Bottom Left Wall

    17,18,
    
    20,21,22,23, // Top Right Wall

    21,22,

    24,25,26,27, // Center Right Wall

    25,26,

    28,29,30,31, // Bottom Right Wall

    29,30
]);

// Set the vertex positions and colours for the ghost box
const ghost_box_vertex_buffer = new Float32Array([
// Top Side
-corr_margin,in_margin2,                    0.0, 0.0, 1.0,
-corr_margin + 0.0450,in_margin2,           0.0, 0.0, 1.0,
corr_margin - 0.0450,in_margin2,            0.0, 0.0, 1.0,
corr_margin,in_margin2,                     0.0, 0.0, 1.0,
// Left Side
-corr_margin,in_margin2,             0.0, 0.0, 1.0,
-corr_margin,in_margin2 - 0.02,      0.0, 0.0, 1.0,
-corr_margin,in_margin2 - 0.04,      0.0, 0.0, 1.0,
-corr_margin,in_margin2 - 0.12,      0.0, 0.0, 1.0,
-corr_margin,-in_margin2 + 0.12,     0.0, 0.0, 1.0,
-corr_margin,-in_margin2 + 0.04,     0.0, 0.0, 1.0,
-corr_margin,-in_margin2 + 0.02,     0.0, 0.0, 1.0,
-corr_margin,-in_margin2,            0.0, 0.0, 1.0,
// Bottom Side
-corr_margin,-in_margin2,                   0.0, 0.0, 1.0,
-corr_margin + 0.0450,-in_margin2,          0.0, 0.0, 1.0,
corr_margin - 0.0450,-in_margin2,           0.0, 0.0, 1.0,
corr_margin,-in_margin2,                    0.0, 0.0, 1.0,
// Right Side
corr_margin,in_margin2,             0.0, 0.0, 1.0,
corr_margin,in_margin2 - 0.02,      0.0, 0.0, 1.0,
corr_margin,in_margin2 - 0.04,      0.0, 0.0, 1.0,
corr_margin,in_margin2 - 0.12,      0.0, 0.0, 1.0,
corr_margin,-in_margin2 + 0.12,     0.0, 0.0, 1.0,
corr_margin,-in_margin2 + 0.04,     0.0, 0.0, 1.0,
corr_margin,-in_margin2 + 0.02,     0.0, 0.0, 1.0,
corr_margin,-in_margin2,            0.0, 0.0, 1.0,
]);

// Set the indices used to draw the shapes for the ghost box
const bgLineIndexData = new Uint8Array(48);

// Generate the indices for the ghost box
for (var i = 0; i < 12; i++) {
    const startIndex = i * 4;
    bgLineIndexData[i * 4] = startIndex;
    bgLineIndexData[i * 4 + 1] = startIndex + 1;
    bgLineIndexData[i * 4 + 2] = startIndex + 2;
    bgLineIndexData[i * 4 + 3] = startIndex + 3;
}


// Draw the Ghosts
function draw_ghosts(input, ghost){
    // Set the size of the ghosts
    const uPointSizeLoc = gl.getUniformLocation(program, 'ent_dim');
    gl.uniform1f(uPointSizeLoc, 30);
    // Get which ghost moved and move them according to the input

    const x_move = 0.18;
    const y_move = 0.165;
    if(ghost === 1){
        if(input === 'left'){
            ghost1_pos[0] -= x_move;
        }else if(input === 'right'){
            ghost1_pos[0] += x_move;
        }else if(input === 'up'){
            ghost1_pos[1] += y_move;
        }else if(input === 'down'){
            ghost1_pos[1] -= y_move;
        }else if(input === 'reset'){
            ghost1_pos[0] = 0;
            ghost1_pos[1] = .081;
        }
    }else if(ghost === 2){
        if(input === 'left'){
            ghost2_pos[0] -= x_move;
        }else if(input === 'right'){
            ghost2_pos[0] += x_move;
        }else if(input === 'up'){
            ghost2_pos[1] += y_move;
        }else if(input === 'down'){
            ghost2_pos[1] -= y_move;
        }else if(input === 'reset'){
            ghost2_pos[0] = 0;
            ghost2_pos[1] = -.081;
        }
    }else if(ghost === 3){ // Reset position after catching pacman
        ghost1_pos[0] = 0;
        ghost1_pos[1] = .08;
        ghost2_pos[0] = 0;
        ghost2_pos[1] = -.08;
    }
    
    const ghostVertexBuffer = new Float32Array([
        ghost1_pos[0],ghost1_pos[1],      1.00, 0.5, 0.5, // Ghost 1: light red
        ghost2_pos[0],ghost2_pos[1],      0.5, 0.7, 1.00 // Ghost 2: light blue
    ]);

    const ghostVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ghostVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, ghostVertexBuffer, gl.STATIC_DRAW);
    gl.vertexAttribPointer(attrib_pos_loc, 2, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(attrib_col_loc, 3, gl.FLOAT, false, 20, 8);

    gl.drawArrays(gl.POINTS, 0, 2);

}

var pac_face_x = pac_pos[0];
var pac_face_y = pac_pos[1]+pac_side_len/2;
var pac_hor_L = pac_pos[0]-pac_side_len/2;
var pac_ver_L = pac_pos[1]-pac_side_len/5;
var pac_hor_R = pac_pos[0]+pac_side_len/2;
var pac_ver_R = pac_pos[1]-pac_side_len/5;

// Draw Pacman
function draw_pac(){
    pac_face_x = pac_pos[0];
    pac_face_y = pac_pos[1]+pac_side_len/2;
    pac_hor_L = pac_pos[0]-pac_side_len/2;
    pac_ver_L = pac_pos[1]-pac_side_len/5;
    pac_hor_R = pac_pos[0]+pac_side_len/2;
    pac_ver_R = pac_pos[1]-pac_side_len/5;
}

function draw_player(input, _){

    const x_move = 0.18;
    const y_move = 0.165;
    if(input === 'left'){
        pac_pos[0] -= x_move; // Move along the x-axis
        draw_pac()
    } else if(input === 'right'){
        pac_pos[0] += x_move;
        draw_pac()
    }else if(input === 'up'){
        pac_pos[1] += y_move; // Move along the y-axis
        draw_pac()
    }else if(input === 'down'){
        pac_pos[1] -=y_move;
        draw_pac()
    }else if(input === 'reset'){
        pac_pos = [0,-.74];
        draw_pac()
    }

    const playerVertexBuffer = new Float32Array([
        pac_face_x,pac_face_y,            0,0,1,
        pac_hor_L,pac_ver_L,              0,0,1,
        pac_hor_R,pac_ver_R,              0,0,1
    ]);

    const playerVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, playerVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, playerVertexBuffer, gl.STATIC_DRAW);

    gl.vertexAttribPointer(attrib_pos_loc, 2, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(attrib_col_loc, 3, gl.FLOAT, false, 20, 8);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
// Draw the dots
function draw_dot(x_offset, y_offset){

    // Dot radius
    const radius = .025;

    // Create the vertex buffer to draw triangles around a center
    const vert_x_offset = .1851*x_offset;
    const vert_y_offset = .164*y_offset;
    const dot_vert_buff = [-vert_x_offset,-vert_y_offset,1, 1, radius];
    var angle = 90;
    for(i = 0; i <= 10; i++){  // 10 edges
        dot_vert_buff.push(Math.cos(angle*Math.PI/180)*radius - vert_x_offset);
        dot_vert_buff.push(Math.sin(angle*Math.PI/180)*radius - vert_y_offset);
        dot_vert_buff.push(1);
        dot_vert_buff.push(1);
        dot_vert_buff.push(0);
        angle -= 36;
    }

    const dot_indices = [];

    for(i = 0; i <= 10; i++){
        dot_indices.push(0);
        dot_indices.push(i+1);
        dot_indices.push(i+2);
    }

    dot_indices.push(0);
    dot_indices.push(10);
    dot_indices.push(1);

    dotVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, dotVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dot_vert_buff), gl.STATIC_DRAW);

    dotIndBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dotIndBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(dot_indices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(attrib_pos_loc, 2, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(attrib_col_loc, 3, gl.FLOAT, false, 20, 8);

    gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_BYTE, 0);
}

// Draw the power up
function draw_power(x_offset, y_offset){

    // Power up radius
    const radius = .04;

    // Create the vertex buffer to draw triangles around a center
    // Each circle has 20 edges
    const vert_x_offset = .1851*x_offset;
    const vert_y_offset = .164*y_offset;
    const dot_vert_buff = [-vert_x_offset,-vert_y_offset, 1.00, 0, 0];
    var angle = 90;
    for(i = 0; i <= 10; i++){
        dot_vert_buff.push(Math.cos(angle*Math.PI/180)*radius - vert_x_offset);
        dot_vert_buff.push(Math.sin(angle*Math.PI/180)*radius - vert_y_offset);
        dot_vert_buff.push(1.0);
        dot_vert_buff.push(0);
        dot_vert_buff.push(0);
        angle -= 36;
    }

    const dot_indices = [];

    for(i = 0; i <= 10; i++){
        dot_indices.push(0);
        dot_indices.push(i+1);
        dot_indices.push(i+2);
    }

    dot_indices.push(0);
    dot_indices.push(10);
    dot_indices.push(1);

    dotVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, dotVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dot_vert_buff), gl.STATIC_DRAW);

    dotIndBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dotIndBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(dot_indices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(attrib_pos_loc, 2, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(attrib_col_loc, 3, gl.FLOAT, false, 20, 8);

    gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_BYTE, 0);
}


// Gameplay

function start_game(){
    var board = [
        ['_','_','_','_','_','_','_','_','_','_','_'],
        ['_','.','.','.','.','.','.','.','.','.','_'],
        ['_','.','_','_','_','.','_','_','_','.','_'],
        ['_','.','_','_','_','.','_','_','_','.','_'],
        ['_','.','.','.','.','.','.','.','.','.','_'],
        ['_','.','_','.','.','_','.','o','_','.','_'],
        ['_','.','_','.','.','_','.','.','_','.','_'],
        ['_','.','.','.','.','.','.','.','.','.','_'],
        ['_','.','_','_','_','.','_','_','_','.','_'],
        ['_','.','_','_','_','.','_','_','_','.','_'],
        ['_','.','.','.','.','p','.','.','.','.','_'],
        ['_','_','_','_','_','_','_','_','_','_','_'],
    ];

    // . = dot
    // o = power up
    // p = pacman spawn
    // _ = wall/boundary

    var pac_state = {time: 60, score: 0, dots: 58, state: ''};
    var pacman = {pos: [10, 5], move: '', pacman_move: true, state: 0};
    var ghost1 = {initPos: [5, 5], pos: [5, 5], tag: 1};
    var ghost2 = {initPos: [6, 5], pos: [6, 5], tag: 2};

    // Start webgl drawing
    game_init(0, 0, 0, board, pacman.state);
    
    // Enable the game state listener to Start game
    stateEventListener(pac_state, board, pacman, ghost1, ghost2);
}

// Draw background and board
function draw_bg(board){

    // Background/Board
    board_vert_buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, board_vert_buff);
    gl.bufferData(gl.ARRAY_BUFFER, background_vertex_buffer, gl.STATIC_DRAW);

    board_ind_buff = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, board_ind_buff);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, board_indices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(attrib_pos_loc, 2, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(attrib_col_loc, 3, gl.FLOAT, false, 20, 8);
    
    gl.drawElements(gl.TRIANGLES, 48, gl.UNSIGNED_BYTE, 0);

    // Ghost Box
    ghost_box_vert_buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ghost_box_vert_buff);
    gl.bufferData(gl.ARRAY_BUFFER, ghost_box_vertex_buffer, gl.STATIC_DRAW);

    ghost_box_ind_buff = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ghost_box_ind_buff);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bgLineIndexData, gl.STATIC_DRAW);

    gl.vertexAttribPointer(attrib_pos_loc, 2, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(attrib_col_loc, 3, gl.FLOAT, false, 20, 8);

    gl.drawElements(gl.LINES, 48, gl.UNSIGNED_BYTE, 0);
    
    // Populate the board with the collectibles using a nested for loop and switch cases
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            switch (board[i][j]) {
                case '.':
                  draw_dot(5 - j, -1 * (5.6 - i));
                  break;
                case 'o':
                  draw_power(5 - j, -1 * (5.6 - i));
                  break;
            }
        }
    }
}

// Game over conditions
function endgame(pac_state){
    document.removeEventListener('keydown', move);
    var Instructions = document.getElementById('Instructions');
    if(pac_state.state === 'win'){ // Win state
        // The final score = score + remaining time * 100
        //var final_score = pac_state.score + (pac_state.time * 100)
        Instructions.innerHTML = 'Winner!<br>Your Score: ' + pac_state.score + '<br>Press Shift + R to Restart';
    }else if(pac_state.state === 'lose'){
        Instructions.innerHTML = 'Loser!<br>Press Shift + R to Restart';
    }
}
// Create the game loop
function game(pac_state, pacman, ghost1, ghost2, board){
    const tick = 0.333; // Each tick is 0.333s
    if(pac_state.state === 'run'){
        random(ghost1, pacman, board, pac_state);
        random(ghost2, pacman, board, pac_state);
        pac_state.time-=tick;
        if(Math.ceil(pac_state.time) === 0){ // Game ends after game_time hits 0
            pac_state.state = 'win';
            endgame(pac_state);
        }
        var game_time = document.getElementById("time");
        game_time.innerHTML = Math.ceil(pac_state.time);
    }
    
}

// Check if pacman is caught by a ghost
function checkCaught(pac_state, board, ghost, pacman){
    var score = document.getElementById('score');
    
    if(ghost.pos[0] === pacman.pos[0] && ghost.pos[1] === pacman.pos[1]){
        // Lose 500 points when caught
        pac_state.score -= 500;

        score.innerHTML = pac_state.score;
        // Check if the pacman has less than 0 points
        if(pac_state.score <= 0){
            pac_state.state = 'lose';
            endgame(pac_state);
        }

        // Reset ghost position to middle
        ghost.pos = ghost.initPos;
        render_game(0, 'reset', ghost.tag, board, pacman.state);
    }
}

//Check if pacman eats a dot or power up
function checkDot(pac_state, board, pacman){
    var score = document.getElementById('score');

    // Check if pacman eats a dot
    if(board[pacman.pos[0]][pacman.pos[1]] === '.'){
        pac_state.score += 100; // Increase score by 100 for each dot
        pac_state.dots --; // Eat dot (one less dot in the array)
        score.innerHTML = pac_state.score;

        // Check if the pacman caught all dots to end game
        if(pac_state.dots === 0){
            pac_state.state = 'win';
            pac_state.score = pac_state.score + pac_state.time*100 // Final score = score + (time remaining * 100)
            endgame(pac_state);
        }

    // Check if pacman eats a power up
    }else if(board[pacman.pos[0]][pacman.pos[1]] === 'o'){
        pac_state.score += 500; // Increase score by 500 for power up
        score.innerHTML = pac_state.score;
    }
}

// Player movement
function playerMove(pac_state, board, pacman, ghost1, ghost2){
    board[pacman.pos[0]][pacman.pos[1]] = 'p'; // Board is a 2D grid/array
    // Move Pacman
    if(pacman.move === 'left'){
        pacman.pos = [pacman.pos[0], pacman.pos[1] - 1];
    }else if(pacman.move === 'right'){
        pacman.pos = [pacman.pos[0], pacman.pos[1] + 1];
    }else if(pacman.move === 'up'){
        pacman.pos = [pacman.pos[0] - 1, pacman.pos[1]];
    }else if(pacman.move === 'down'){
        pacman.pos = [pacman.pos[0] + 1, pacman.pos[1]];
    }

    // Check conditions
    checkCaught(pac_state, board, ghost1, pacman);
    checkCaught(pac_state, board, ghost2, pacman);
    checkDot(pac_state, board, pacman);

    render_game(pacman.move, 0, 0, board, pacman.state);

    board[pacman.pos[0]][pacman.pos[1]] = 'pacman'; // Movement delay
    pacman.pacman_move = false;
}

// Event Listener to check for pacman input to move Pacman
function keyEventListener(pac_state, board, pacman, ghost1, ghost2) {
	document.addEventListener('keydown', move = (e) => {
		const keyName = e.key;
        if(!pacman.pacman_move) return;
        // Set pacman movement delay
        setTimeout(function() { pacman.pacman_move = true; }, 150);
        // Left movement
		if (keyName === 'ArrowLeft' && board[pacman.pos[0]][pacman.pos[1] - 1] !== '_') {
            pacman.move = 'left';
            playerMove(pac_state, board, pacman, ghost1, ghost2);
        // Right movement
		} else if (keyName === 'ArrowRight'  && board[pacman.pos[0]][pacman.pos[1] + 1] !== '_') {
            pacman.move = 'right';
            playerMove(pac_state, board, pacman, ghost1, ghost2);
        // Up movement
		} else if (keyName === 'ArrowUp'  && board[pacman.pos[0] - 1][pacman.pos[1]] !== '_') {
            pacman.move = 'up';
            playerMove(pac_state, board, pacman, ghost1, ghost2);
        // Down movement
		} else if (keyName === 'ArrowDown'  && board[pacman.pos[0] + 1][pacman.pos[1]] !== '_') {
            pacman.move = 'down';
            playerMove(pac_state, board, pacman, ghost1, ghost2);
		}
	});
}
// State Listener to check when pacman inputs a state key (start, pause, resume, restart)
var gamePlay;
function stateEventListener(pac_state, board, pacman, ghost1, ghost2){
    var Instructions = document.getElementById('Instructions');

    document.addEventListener('keydown', (event) => {
        const keyName = event.key;
        // Start 
        if(keyName === 's' && pac_state.state === ''){
            keyEventListener(pac_state, board, pacman, ghost1, ghost2);
            gamePlay = setInterval(game, 333, pac_state, pacman, ghost1, ghost2, board);
            pac_state.state = 'run';
        // Pause 
        }else if(keyName === 'p' && pac_state.state === 'run'){
            Instructions.innerHTML = 'Game Paused<br>Press R to Resume<br>Press Shift + R to Restart';
            pacman.pacman_move = false;
            pac_state.state = 'pause';
        // Resume 
        }else if(keyName === 'r' && pac_state.state === 'pause'){
            Instructions.innerHTML = "Instructions: <br> Arrow Keys = Move <br>S = Start <br>P = Pause <br>R = Resume <br>Shift + R = Restart";
            pacman.pacman_move = true;
            pac_state.state = 'run';
        // Restart 
        }else if(keyName === 'R'){
            document.removeEventListener('keydown', move);
            clearInterval(gamePlay);
            // Reinitialize all game features
            board = [
                ['_','_','_','_','_','_','_','_','_','_','_'],
                ['_','.','.','.','.','.','.','.','.','.','_'],
                ['_','.','_','_','_','.','_','_','_','.','_'],
                ['_','.','_','_','_','.','_','_','_','.','_'],
                ['_','.','.','.','.','.','.','.','.','.','_'],
                ['_','.','_','.','.','_','.','o','_','.','_'],
                ['_','.','_','.','.','_','.','.','_','.','_'],
                ['_','.','.','.','.','.','.','.','.','.','_'],
                ['_','.','_','_','_','.','_','_','_','.','_'],
                ['_','.','_','_','_','.','_','_','_','.','_'],
                ['_','.','.','.','.','p','.','.','.','.','_'],
                ['_','_','_','_','_','_','_','_','_','_','_'],
            ];
        
            pac_state = {time: 60, score: 0, dots: 58, state: ''};
            pacman = {pos: [10, 5], move: '', pacman_move: true, state: 0};
            ghost1 = {initPos: [5, 5], pos: [5, 5], tag: 1};
            ghost2 = {initPos: [6, 5], pos: [6, 5], tag: 2};
            var time = document.getElementById('time');
            var score = document.getElementById('score');
            time.innerHTML = pac_state.time;
            score.innerHTML = pac_state.score;
            render_game('reset', 'reset', 3, board, pacman.state);
            Instructions.innerHTML = "Instructions: <br> Arrow Keys = Move <br>S = Start <br>P = Pause <br>R = Resume <br>Shift + R = Restart";
        }
    });
}

// Random ghost movement
function random(ghost, pacman, board, pac_state){
    var possible_moves = [];

    // List of possible moves:
    if(board[ghost.pos[0]][ghost.pos[1] - 1] !== '_') possible_moves.push('left');
    if(board[ghost.pos[0]][ghost.pos[1] + 1] !== '_') possible_moves.push('right');
    if(board[ghost.pos[0] - 1][ghost.pos[1]] !== '_') possible_moves.push('up');
    if(board[ghost.pos[0] + 1][ghost.pos[1]] !== '_') possible_moves.push('down');

    // Select random direction
    var move = Math.floor(Math.random() * possible_moves.length);

    // Move ghost in chosen direction
    if(possible_moves[move] === 'left'){
        ghost.pos = [ghost.pos[0], ghost.pos[1] - 1];
    }else if(possible_moves[move] === 'right'){
        ghost.pos = [ghost.pos[0], ghost.pos[1] + 1];
    }else if(possible_moves[move] === 'up'){
        ghost.pos = [ghost.pos[0] - 1, ghost.pos[1]];
    }else if(possible_moves[move] === 'down'){
        ghost.pos = [ghost.pos[0] + 1, ghost.pos[1]];
    }
    
    render_game(0, possible_moves[move], ghost.tag, board, pacman.state); // Render game

    checkCaught(pac_state, board, ghost, pacman); // Check if a ghost catches pacman
}

// Draw all items
function render_game(pac_move, ghost_move, ghost, board, pac_state){
    draw_bg(board);
    draw_ghosts(ghost_move, ghost);
    draw_player(pac_move, pac_state);
}

start_game();