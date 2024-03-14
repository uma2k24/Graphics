How to Run:
1.	Extract the folder and open in an IDE (recommended: VS Code)
2.	Open folder in an integrated terminal
3.	Install parcel using the following command: npm install parcel -g
4.	After parcel is installed, install the three.js library using the following command: npm install three
5.	Run the code using the following command: parcel ./src/threejs.html 
6.	The terminal will provide a URL to the server where the code is running. Press ctrl+left mouse button to on the URL to open it in your default browser (recommended: Google Chrome):
7.	To stop the process, click on the terminal and press ctrl+c

References:
•	Parcel documentation: https://parceljs.org/docs/
•	Three.js documentation: https://threejs.org/docs/index.html#manual/en/introduction/Installation

Interaction: simply use the mouse features 
	Left mouse button + drag = rotate camera
	Right mouse button + drag = pan camera
	Scroll up/down = zoom in/zoom out

Additional Notes:

I implemented some ambient lighting in the scene. The original idea was to have the nucleus be the light source and have it illuminate the electrons but I had technical difficulties with it (most likely hardware issue). I also wanted to implement more features in the project such as ray-tracing and the model the interior of the nucleus, showing the protons and neutrons. However, due to time constraints and other coursework, this is all I could implement. The model has some inaccuracies with the electron power levels and their orbits. Regardless, the animation turned out to be quite smooth.