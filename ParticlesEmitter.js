/**
 * Create a Particles Emitter system on canvas through javascript.
 * @author Jatin Mistry
 */
 
(function() {
	var d,canvas;
    d = document;
	canvas = d.body.appendChild(d.createElement('canvas'));
    //var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var width = 0;
	var height = 0;

	var lastTime = Date.now();

	//var stats = new Stats();
	//document.body.appendChild( stats.domElement );

	// On Resize Event Handler
	window.onresize = function onresize() {
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
	}

	// Calling OnResize
	window.onresize();

	// Mouse positions
	var mouse = {
		X : canvas.width/2,
		Y : canvas.height/2
	}

	// Mouse move Event Handler
	window.onmousemove = function onmousemove(event) {
		// Update mouse position accordingly if allowed emitter movement
		if (controls.Mouse) {
			mouse.X = event.clientX;
			mouse.Y = event.clientY;
		} else {
			mouse.X = canvas.width/2;
			mouse.Y = canvas.height/2;
		}
	}
	
	//Touch events
	window.touchmove = function ontouchmove(event) {
		if(controls.Mouse) {
		   mouse.X = event.clientX;
		   mouse.Y = event.clientY;
		} else {
		    mouse.X = canvas.width/2;
		    mouse.Y = canvas.height/2;
		}
		
	}

	// Particles array
	var particles = [];

	// Controls
	var controls = {
		Quantity : 5,
		Speed : 2,
		Size : 5,
		Death : 5,
		Rotation : 2,
		Opacity : 10,
		Alpha : 10,
		Saturation : 10,
		Lightness : 5,
		Mouse : true,
		Invert : false,
		Red : 0,
		Green : 0,
		Blue : 0,
		WTF : false,
		Lighter : true,
		Stroke : false
	}

	// Performs Explosion
	function explosion(X, Y, number) {
		if (!number) {
			number = controls.Quantity;
		}
		while (number--) {
			particles.push(
			{
				velocityX : (Math.random() * 2) * controls.Speed / 10,
				velocityY : (Math.random() * 2) * controls.Speed / 10,
				X : X,
				Y : Y,
				radius : controls.Size + Math.floor(Math.random() *5),
				alpha : controls.Opacity/10,
				color : "hsl(" + Math.floor(Math.random() *360) + ","+ controls.Saturation*10 +"%, "+ controls.Lightness*10 +"%)",
				direction : ((Math.random()*7)+1)
			})
		}
	}

	// Render the canvas context
	function render(ctx) {
		ctx.save();
		if (!controls.WTF) {
			ctx.fillStyle = 'rgba('+controls.Red+','+controls.Green+','+controls.Blue+',' + controls.Alpha/10 + ')'; }
		else {
			ctx.fillStyle = 'rgba('+Math.floor(Math.random() *255)+','+Math.floor(Math.random() *255)+','+Math.floor(Math.random() *255)+',' + Math.floor(Math.random() *10)/10 + ')';
		}
		ctx.fillRect(0, 0, width, height);
		if (controls.Lighter) {
		ctx.globalCompositeOperation = "lighter"; }
		
		// Local variable
		var particlesLocal = particles;
		var twoPI = Math.PI * 2;
		
		// Render each particle
		for (var i = 0, particleActive; particleActive = particlesLocal[i]; i++) {
				
			ctx.globalAlpha = particleActive.alpha;
			if (controls.Stroke) { ctx.strokeStyle = particleActive.color; }
			else { ctx.fillStyle = particleActive.color; }
			
			ctx.beginPath();
			ctx.arc(particleActive.X, particleActive.Y, particleActive.radius, 0, twoPI);
			if (controls.Stroke) { ctx.stroke(); }
			else { ctx.fill(); }
		}
		
		ctx.restore();
	}

	// Update Canvas
	function update() {
		var particlesLocal = particles;
		var now = Date.now();
		var delta = now - lastTime;
		
		for (var i = 0, particleActive; particleActive = particlesLocal[i]; i++) {
			particleActive.X += Math.cos(particleActive.direction) * particleActive.velocityX * delta;
			particleActive.Y += Math.sin(particleActive.direction) * particleActive.velocityY * delta;
			particleActive.radius -= controls.Death/800 * delta;
			if (!controls.WTF) {
				particleActive.direction += controls.Rotation/1000 * delta; }
			else { 
				particleActive.direction += (Math.floor(Math.random() *100)-50)/1000 * delta; 
			}
			if (particleActive.alpha > 0) {
				particleActive.alpha -= controls.Death/800;
			} else {
				particleActive.alpha = 0;
			}
			if (particleActive.radius < 0 || particleActive.X < -100 || particleActive.X > canvas.width + 100 || particleActive.Y < -100 || particleActive.Y > canvas.height + 100) {
				particlesLocal.splice(i--, 1);
			}
		}
		explosion(mouse.X, mouse.Y);
		lastTime = now;
	}

	// Take a screenshot
	function Screenshot() {
		window.open(canvas.toDataURL());
	}
	
	// Perform animation
	(function animate() {
		// rAF.js
		requestAnimationFrame(animate);
		update();
		render(ctx);
	})();
	
})();
