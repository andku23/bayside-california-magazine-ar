///////////////////////////////////////////////////////////////////////////
/*
Name: 			playcanvas.js

Description: 	-

Usage:			How to Integrate Exported Scene:

                    Files to Copy:
                        - "files" folder
                        - "__game-scripts.js"
                        - "__modules__.js"
                        - The scene json files. They'll be long number scene IDs like "890048.json"
                        - "ammo.dcab07b.js"
                        - "playcanvas-stable.min.js" (if not already there)

                    From the index.html file:
                        - Copy "<script src="playcanvas-stable.min.js"></script>" into our index.html file if not already there.
                        - Copy the text in the below "<script>" tag into our index.html
                        - Copy any "external dependencies" you defined in playcanvas into our index.html
                            (you'll see addition <script> tags)

                    Files to Ignore:
                        - "__loading__.js"
                        - "__start__.js"
                            (Note: I'm not sure if this file changes from export to export. If it does, you'll
                            have to copy that code into the "playcanvasExportedStart.js" function)
                        - "styles.css"
                        - "manifest.json"
                        - "logo.png"

*/
///////////////////////////////////////////////////////////////////////////

const PlayCanvasAR = {
	sceneURL: "https://playcanv.as/p/h2X5l45E/",
	
	iframe: null,
	app: null,
	async init()
	{

		// Fixes playcanvas asset prefixes
		if(window.ASSET_PREFIX != null){
			console.log("setting asset prefix")
			window.ASSET_PREFIX = "./playcanvas/"
		}
		if(window.SCRIPT_PREFIX != null){
			window.SCRIPT_PREFIX = "./playcanvas/"
		}
		if(window.SCENE_PATH != null){
			window.SCENE_PATH = `./${window.SCENE_PATH}`
		}
		if(window.CONFIG_FILENAME != null){
			window.CONFIG_FILENAME = `./playcanvas/${window.CONFIG_FILENAME}`
		}
		if(window.PRELOAD_MODULES != null && window.PRELOAD_MODULES.length > 0){
			if(window.PRELOAD_MODULES[0].glueUrl != null){
				window.PRELOAD_MODULES[0].glueUrl = `./${window.PRELOAD_MODULES[0].glueUrl}`
			}
			if(window.PRELOAD_MODULES[0].wasmUrl != null){
				window.PRELOAD_MODULES[0].wasmUrl = `./${window.PRELOAD_MODULES[0].wasmUrl}`
			}
			if(window.PRELOAD_MODULES[0].fallbackUrl != null){
				window.PRELOAD_MODULES[0].fallbackUrl = `./${window.PRELOAD_MODULES[0].fallbackUrl}`
			}

		}
	},
	getDomParent()
	{
		return document.getElementById("application-canvas");
	},
	getCanvas()
	{
		return document.getElementById("application-canvas");
	},
	forceRenderFrame()
	{
		pc.Application.getApplication().render();
	},
	async loadScene(onXRReady, onXRError)
	{
		return new Promise(
			function(resolve)
			{
				playcanvasExportedStart();
				
				this.app = pc.Application.getApplication();
				
				//Because these canvases are auto generated, if we leave everything at z-index 0 they will appear on top of UI.
				let app = document.getElementById("application-canvas");
				app.style.zIndex = 1;

				const onReady = function()
				{
					if (window.XR8)
					{
						let camerafeed = document.getElementById("camerafeed");
						//I think camera feed doesnt exist anymore but just in case ill put if in an if
						if(camerafeed){
							camerafeed.style.zIndex = - 2;
							//I don't know for the life of me why I have to manually set this but I do
							camerafeed.style.position = "absolute";
							camerafeed.width = app.width;
							camerafeed.height = app.height;
						}

					}
					onXRReady();
					resolve();
				};
				pc.Application.getApplication().on("xr:realityready", onReady);
				pc.Application.getApplication().on("xr:realityerror", onXRError);
			}.bind(this)
		);
	},
	scale()
	{
	},
	rotate()
	{
	},
	recenter()
	{
	},
	restartPlace(onPlaced)
	{
		this.app.fire("arRestartPlace");
		this.app.once("arPlaced", onPlaced);
	},
	
	changeScene(sceneConfig, onLoadFinish, onProgress)
	{
		//Initiates scene change. Sumerian handles most of the work on its side using the SceneLoader
		window.sumerian.SystemBus.emit("changeScene", {
			sceneConfig: sceneConfig,
			onProgress: onProgress,
			addToWorld: true,
			onLoadFinish: () =>
			{
				onLoadFinish();
			}
		});
	},
	changeSceneByName()
	{
		this.app.fire("changescene");
	}
};

function playcanvasExportedStart()
{
	var CANVAS_ID = "application-canvas";
	
	var canvas, devices, app;
	
	var createCanvas = function()
	{
		canvas = document.createElement("canvas");
		canvas.setAttribute("id", CANVAS_ID);
		canvas.setAttribute("tabindex", 0);
		// canvas.style.visibility = 'hidden';
		
		// Disable I-bar cursor on click+drag
		canvas.onselectstart = function()
		{
			return false;
		};
		
		document.body.appendChild(canvas);
		
		return canvas;
	};
	
	var createInputDevices = function(canvas)
	{
		var devices = {
			elementInput: new pc.ElementInput(canvas, {
				useMouse: INPUT_SETTINGS.useMouse,
				useTouch: INPUT_SETTINGS.useTouch
			}),
			keyboard: INPUT_SETTINGS.useKeyboard ? new pc.Keyboard(window) : null,
			mouse: INPUT_SETTINGS.useMouse ? new pc.Mouse(canvas) : null,
			gamepads: INPUT_SETTINGS.useGamepads ? new pc.GamePads() : null,
			touch:
				INPUT_SETTINGS.useTouch && pc.platform.touch
				? new pc.TouchDevice(canvas)
				: null
		};
		
		return devices;
	};
	
	var configureCss = function(fillMode, width, height)
	{
		// Configure resolution and resize event
		if (canvas.classList)
		{
			canvas.classList.add("fill-mode-" + fillMode);
		}
		
		// css media query for aspect ratio changes
		var css =
			"@media screen and (min-aspect-ratio: " + width + "/" + height + ") {";
		css += "    #application-canvas.fill-mode-KEEP_ASPECT {";
		css += "        width: auto;";
		css += "        height: 100%;";
		css += "        margin: 0 auto;";
		css += "    }";
		css += "}";
		
		var style = document.createElement("style");
		document.head.appendChild(style);
		style.innerHTML = css;
		// append css to style
		/*
			if (document.head.querySelector) {
				document.head.querySelector('style').innerHTML += css;
			}
	
			 */
	};
	
	var reflow = function()
	{
		app.resizeCanvas(canvas.width, canvas.height);
		canvas.style.width = "";
		canvas.style.height = "";
		
		var fillMode = app._fillMode;
		
		if (fillMode == pc.FILLMODE_NONE || fillMode == pc.FILLMODE_KEEP_ASPECT)
		{
			if (
				(fillMode == pc.FILLMODE_NONE &&
				 canvas.clientHeight < window.innerHeight) ||
				canvas.clientWidth / canvas.clientHeight >=
				window.innerWidth / window.innerHeight
			)
			{
				canvas.style.marginTop =
					Math.floor((window.innerHeight - canvas.clientHeight) / 2) + "px";
			}
			else
			{
				canvas.style.marginTop = "";
			}
		}
	};
	
	var displayError = function(html)
	{
		var div = document.createElement("div");
		
		div.innerHTML = [
			"<table style=\"background-color: #8CE; width: 100%; height: 100%;\">",
			"  <tr>",
			"      <td align=\"center\">",
			"          <div style=\"display: table-cell; vertical-align: middle;\">",
			"              <div style=\"\">" + html + "</div>",
			"          </div>",
			"      </td>",
			"  </tr>",
			"</table>"
		].join("\n");
		
		document.body.appendChild(div);
	};
	canvas = createCanvas();
	devices = createInputDevices(canvas);
	
	try
	{
		app = new pc.Application(canvas, {
			elementInput: devices.elementInput,
			keyboard: devices.keyboard,
			mouse: devices.mouse,
			gamepads: devices.gamepads,
			touch: devices.touch,
			graphicsDeviceOptions: window.CONTEXT_OPTIONS,
			assetPrefix: window.ASSET_PREFIX || "",
			scriptPrefix: window.SCRIPT_PREFIX || "",
			scriptsOrder: window.SCRIPTS || []
		});
	}
	catch (e)
	{
		console.log(e);
		if (e instanceof pc.UnsupportedBrowserError)
		{
			displayError(
				"This page requires a browser that supports WebGL.<br/>" +
				"<a href=\"http://get.webgl.org\">Click here to find out more.</a>"
			);
		}
		else if (e instanceof pc.ContextCreationError)
		{
			displayError(
				"It doesn't appear your computer can support WebGL.<br/>" +
				"<a href=\"http://get.webgl.org/troubleshooting/\">Click here for more information.</a>"
			);
		}
		else
		{
			displayError("Could not initialize application. Error: " + e);
		}
		
		return;
	}
	
	var configure = function()
	{
		app.configure(CONFIG_FILENAME, function(err)
		{
			if (err)
			{
				console.error(err);
			}
			
			configureCss(app._fillMode, app._width, app._height);
			
			// do the first reflow after a timeout because of
			// iOS showing a squished iframe sometimes
			setTimeout(function()
					   {
						   reflow();
				
						   window.addEventListener("resize", reflow, false);
						   window.addEventListener("orientationchange", reflow, false);
				
						   app.preload(function(err)
									   {
										   if (err)
										   {
											   console.error(err);
										   }
										   app.loadScene(SCENE_PATH, function(err)
										   {
											   if (err)
											   {
												   console.error(err);
											   }
						
											   app.start();
										   });
									   });
					   });
		});
	};
	
	if (PRELOAD_MODULES.length > 0)
	{
		loadModules(PRELOAD_MODULES, ASSET_PREFIX, configure);
	}
	else
	{
		configure();
	}
}

export default PlayCanvasAR;
