const gardenCanvas = document.getElementById("gardenCanvas");
// retrieve all prev drawings
const gctx = gardenCanvas.getContext("2d");

const drawCanvas = document.getElementById("drawCanvas");
//get current drawing
const dctx = drawCanvas.getContext("2d");

let isErasing = false;

//connects js to html elements
const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const closeBtn = document.getElementById("closeBtn");
const colorPicker = document.getElementById("colorPicker");
const eraseBtn = document.getElementById("eraseBtn");
const nextBtn = document.getElementById("nextBtn");
const plantBtn = document.getElementById("plantBtn");
const wishPopup = document.getElementById("wishPopup");
const closeWishPopup = document.getElementById("closeWishPopup");
const wishText = document.getElementById("wishText");
const wishAuthor = document.getElementById("wishAuthor");

let gardenWishes = [];

//set up garden
gardenCanvas.width = window.innerWidth;
gardenCanvas.height = window.innerHeight;

// load existing garden (wishes)
async function loadGarden() {
    try {
        const res = await fetch("/api/wishes");
        const data = await res.json();
        gardenWishes = data;

        //clears screen before rendering everyth
        gctx.clearRect(0, 0, gardenCanvas.width, gardenCanvas.height);

        data.forEach(wish => {
            wish.strokes.forEach(stroke => {
                drawStroke(gctx, stroke.points, stroke.color, wish.position.x, wish.position.y);
            });
        });
    }
    catch(err){
        console.error('Error reading database', err);
    }
}

// reconstruct drawing from saved strokes (points)
function drawStroke(ctx, points, color, offsetX=0, offsetY=0) {
    if (!points.length) {
        return; }

    //glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;

    // start new drawing path, positioning it in garden
    ctx.beginPath();
    //  -150 to retreive center of drawing panel, + offset to adjust to garden position
    ctx.moveTo(points[0].x - 150 + offsetX, points[0].y - 150 + offsetY);

    //connect points tgt --> form path
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(
            points[i].x - 150 + offsetX,
            points[i].y - 150 + offsetY
        );
    }

    // set style before actl drawing it
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
}

// drawing system
let isDrawing = false;
let currentStroke = [];
let strokes = [];

//erasing
eraseBtn.onclick = () => {
    isErasing = !isErasing;
    eraseBtn.style.background = isErasing ? "#a7d8ff" : "";
};

drawCanvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    currentStroke = [];

    const rect = drawCanvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // store first point
    currentStroke.push({ x, y });

    dctx.beginPath();
    dctx.moveTo(x, y);
});

drawCanvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) {
        return;
    }

    //returns obj that provides canvas position
    const rect = drawCanvas.getBoundingClientRect();

    //converts browser coord to canvas coord (drawing canvas doesnt start at 0,0 of window)
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    //store every pt
    currentStroke.push({ x, y });

    // check whether is erasing or doing another stroke
    if (isErasing) {
        // draws on top of existing pixels OR remove drawn pixels
        dctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";       
    } else {
        dctx.strokeStyle = colorPicker.value;
        dctx.lineWidth = 2;
    }

    //draws visually in real time (ui)
    dctx.lineTo(x, y);
    dctx.stroke();
});

// once finished
function stopDrawing() {
    if (!isDrawing) return;

    isDrawing = false;

    //reset path
    dctx.beginPath();

    //save each stroke
    if (currentStroke.length > 0) {
        strokes.push({
            points: currentStroke,
            color: colorPicker.value
        });
    }
}

drawCanvas.addEventListener("mouseup", stopDrawing);
drawCanvas.addEventListener("mouseleave", stopDrawing);

// ui controls
//opens drawing panel when 'add wish' is clicked
addBtn.onclick = () => {
    modal.style.display = "block";
};

//closes drawing panel and resets sketchpad
closeBtn.onclick = () => {
    modal.style.display = "none";
    dctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    strokes = [];
    document.getElementById("drawingStep").style.display = "block";
    document.getElementById("wishStep").style.display = "none";
};

nextBtn.onclick = () => {
    if (!strokes.length) {
        alert("draw a flower first ! ");
        return;
    }
    //hides drawing panel, makes wish box visible
    document.getElementById("drawingStep").style.display = "none";
    document.getElementById("wishStep").style.display = "block";
};

plantBtn.onclick = async () => {
    try {
        const message = document.getElementById("wishMessage").value;
        const createdBy = document.getElementById("createdBy").value || "Anonymous";

        //send data to backend
        await fetch("/api/wishes", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ strokes, message, createdBy })
        });

        //once sent, close text panel & reset stroke data
        modal.style.display = "none";
        dctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

        strokes = [];

        //reset all values
        document.getElementById("wishMessage").value = "";
        document.getElementById("createdBy").value = "";
        document.getElementById("drawingStep").style.display = "block";
        document.getElementById("wishStep").style.display = "none";

        loadGarden();

    } catch (err) {
        console.error('Error reading database', err);
    }
};

// for wish/message
gardenCanvas.addEventListener("click", (e) => {
    try {
        const x = e.offsetX;
        const y = e.offsetY;
        const clickedWish = gardenWishes.find(wish => {
            const dx = x - wish.position.x;
            const dy = y - wish.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            return distance < 50;
        });

        if (!clickedWish) return;
        
        // set text
        wishText.textContent = clickedWish.message;
        wishAuthor.textContent = `— ${clickedWish.createdBy}`;

        // show popup
        wishPopup.style.display = "block";

        // position popup near click
        const popupX = e.clientX;
        const popupY = e.clientY;

        wishPopup.style.left = `${popupX + 10}px`;
        wishPopup.style.top = `${popupY - 10}px`;

    } catch (err) {
        console.error('Error reading database', err);
    }

});

//close wish textbox
closeWishPopup.onclick = () => {
    wishPopup.style.display = "none";
};

// start
loadGarden();

