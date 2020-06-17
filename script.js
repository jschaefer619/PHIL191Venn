import {Interactive} from "https://vectorjs.org/index.js";
//import math from "http://api.mathjs.org/v4/";

// Construct an interactive within the HTML element with the id "my-interactive"
let myInteractive = new Interactive("my-interactive");
myInteractive.border = true;

myInteractive.height = 1000;
myInteractive.width = 700;

let setArray = [];

setArray.push("A's");
setArray.push("B's");

myInteractive.text(30, 25, "Select (min 2, max 4) Interactive Sets:");

myInteractive.text(30, 56, "Set A");
myInteractive.text(110, 56, "Set B");

let checkSetC = myInteractive.checkBox(200, 50, "Set C", false);

let checkSetD = myInteractive.checkBox(300, 50, "Set D", false);

myInteractive.text(30, 87, "Select number of sentences:")

let dropdownNumSentences = myInteractive.dropdownControl (250, 87, ["1", "2", "3", "4"]);

let beginButton = myInteractive.button(330, 87, "Begin!")

let sentenceArray = [];

finalDiagramButton = myInteractive.button(30, 300, "Generate Final Diagram")

var finalDiagramButton;
myInteractive.addDependency(checkSetC, checkSetD);

var yMod;

myInteractive.update = function(){

	if (checkSetC.value == true && setArray.includes("C's") == false)
		setArray.splice(2, 0, "C's")
	if(checkSetC.value == false && setArray.includes("C's") == true)
		setArray.splice(2, 1)
	if(checkSetD.value == true && setArray.includes("D's") == false)
		setArray.push("D's")
	if(checkSetD.value == false && setArray.includes("D's") == true)
		setArray.pop()
}

beginButton.onclick = function(event){
	sentenceArray.splice(0, sentenceArray.length)
	for(let i = 0; i < parseInt(dropdownNumSentences.getCurrentSelection()); i++){
		sentenceArray.push(new Sentence(60 + (130 * i), setArray));
	}
	finalDiagramButton.y = 130 + (130 * parseInt(dropdownNumSentences.getCurrentSelection()))
	yMod = 250 + (130 * parseInt(dropdownNumSentences.getCurrentSelection()))
}

finalDiagramButton.onclick = function(event){

	let sentenceArrayCopy = sentenceArray
	let finalCircleArray = []

	if(setArray.length == 2){
		console.log("Generate Two Circles")

		finalCircleArray.push(new CircleForFinalDiagram(setArray[0], 325, yMod, 75))
		finalCircleArray.push(new CircleForFinalDiagram(setArray[1], 400, yMod, 75))

		myInteractive.text(215, yMod + 5, finalCircleArray[0].setRepresented)
		myInteractive.text(490, yMod + 5, finalCircleArray[1].setRepresented)

		generateFinalDiagram(sentenceArray, finalCircleArray, 250, 475, yMod - 75, yMod + 75)
		
	}
	if(setArray.length == 3){
		console.log("Generate Three Circles")

		finalCircleArray.push(new CircleForFinalDiagram(setArray[0], 325, yMod, 75))
		finalCircleArray.push(new CircleForFinalDiagram(setArray[1], 400, yMod, 75))
		finalCircleArray.push(new CircleForFinalDiagram(setArray[2], 362, yMod + 75, 75))

		myInteractive.text(215, yMod + 5, finalCircleArray[0].setRepresented)
		myInteractive.text(490, yMod + 5, finalCircleArray[1].setRepresented)
		myInteractive.text(350, yMod + 170, finalCircleArray[2].setRepresented)


		generateFinalDiagram(sentenceArray, finalCircleArray, 250, 475, yMod - 75, yMod + 150)
	}
	if(setArray.length == 4){
		console.log("Generate Four Circles")

		finalCircleArray.push(new CircleForFinalDiagram(setArray[0], 362 + 17, yMod, 75))
		finalCircleArray.push(new CircleForFinalDiagram(setArray[1], 325 + 12, yMod + 37 + 12, 75))
		finalCircleArray.push(new CircleForFinalDiagram(setArray[2], 400 + 25, yMod + 37 + 12, 75))
		finalCircleArray.push(new CircleForFinalDiagram(setArray[3], 362 + 17, yMod + 75 + 25, 75))

		myInteractive.text(372, yMod - 85, finalCircleArray[0].setRepresented)
		myInteractive.text(230, yMod + 55, finalCircleArray[1].setRepresented)
		myInteractive.text(510, yMod + 55, finalCircleArray[2].setRepresented)
		myInteractive.text(372, yMod + 200, finalCircleArray[3].setRepresented)

		generateFinalDiagram(sentenceArray, finalCircleArray, 250, 500, yMod - 75, yMod + 175)
	}
}


function CircleForFinalDiagram(setRepresentedString, cx, cy, radius){
	this.setRepresented = setRepresentedString;
	this.circle = myInteractive.circle(cx, cy, radius);
	this.circle.style.fill = "#FFFFFF00";
	this.circle.style.stroke = "black";
}

function generateFinalDiagram(sentenceArray, finalCircleArray, xMin, xMax, yMin, yMax){
	for(let i = 0; i < sentenceArray.length; i++){

			for(let j = 0; j < finalCircleArray.length; j++){

				if(sentenceArray[i].DropdownSetOne.getCurrentSelection() == finalCircleArray[j].setRepresented){
					for(let k = 0; k < finalCircleArray.length; k++){

						if(sentenceArray[i].DropdownSetTwo.getCurrentSelection() == finalCircleArray[k].setRepresented){
							console.log("Set one is: " + finalCircleArray[j].setRepresented);
							console.log("Set two is: " + finalCircleArray[k].setRepresented);

							if(sentenceArray[i].DropdownQuant.getCurrentSelection() == "All")
								shadeExclusive(xMin, xMax, yMin, yMax, finalCircleArray[j].circle, finalCircleArray[k].circle);
							
							if(sentenceArray[i].DropdownQuant.getCurrentSelection() == "No")
								shadeOverlap(xMin, xMax, yMin, yMax, finalCircleArray[j].circle, finalCircleArray[k].circle);
							
							if(sentenceArray[i].DropdownQuant.getCurrentSelection() == "Some"){
								var excludeArray = [];
								for(let l = 0; l < finalCircleArray.length; l++){
									if(finalCircleArray[l].setRepresented == sentenceArray[i].DropdownSetOne.getCurrentSelection() || finalCircleArray[l].setRepresented == sentenceArray[i].DropdownSetTwo.getCurrentSelection())
										continue;
									excludeArray.push(finalCircleArray[l].circle)
								}
								console.log(excludeArray)
								generatePierceOverlap(xMin, xMax, yMin, yMax, finalCircleArray[j].circle, finalCircleArray[k].circle, excludeArray);
							}
							if(sentenceArray[i].DropdownQuant.getCurrentSelection() == "Some(n)"){
								var excludeArray = [];
								for(let l = 0; l < finalCircleArray.length; l++){
									if(finalCircleArray[l].setRepresented == sentenceArray[i].DropdownSetOne.getCurrentSelection())
										continue;
									excludeArray.push(finalCircleArray[l].circle)
								}
								console.log(excludeArray)
								generatePierceExclusive(xMin, xMax, yMin, yMax, finalCircleArray[j].circle, excludeArray);
							}
							
							
							break;
						}
					}
					break;
				}
			}
		}
}

function Sentence(axisYadjust, optionsSetInput){
	this.optionsQuantifiers = ["All", "No", "Some", "Some(n)"];
	this.optionsSet = optionsSetInput;
	this.Button = myInteractive.button(120, axisYadjust + 135, "Generate Diagram");
	this.DropdownQuant = myInteractive.dropdownControl(5, axisYadjust + 85, this.optionsQuantifiers, 0);
	this.DropdownSetOne = myInteractive.dropdownControl(190, axisYadjust + 85, this.optionsSet, 0);
	this.textSentenceOne = myInteractive.text(295, axisYadjust + 90, "are");
	this.DropdownSetTwo = myInteractive.dropdownControl(335, axisYadjust + 85, this.optionsSet, 0)


	let parent = this;
	
	this.Button.onclick = function(event) {

		//let testAreaRectangle = myInteractive.rectangle()

		let textCircleOne = myInteractive.text(420, axisYadjust + 125, parent.DropdownSetOne.getCurrentSelection())
		let textCircleTwo = myInteractive.text(610, axisYadjust + 125, parent.DropdownSetTwo.getCurrentSelection())

		let circleSetOne = myInteractive.circle(500, axisYadjust + 120, 50)
		circleSetOne.style.fill = "#FFFFFF00"
		circleSetOne.style.stroke = "black"


		let circleSetTwo = myInteractive.circle(550, axisYadjust + 120, 50)
		circleSetTwo.style.fill = "#FFFFFF00"
		circleSetTwo.style.stroke = "black"

		let dummyArray = [];

		if(parent.DropdownQuant.getCurrentSelection() == "All"){
			shadeExclusive(450, 600, axisYadjust + 70, axisYadjust + 175, circleSetOne, circleSetTwo);
		}
		if(parent.DropdownQuant.getCurrentSelection() == "No")
			shadeOverlap(450, 600, axisYadjust + 75, axisYadjust + 175, circleSetOne, circleSetTwo);
		if(parent.DropdownQuant.getCurrentSelection() == "Some")
			generatePierceOverlap(450, 600, axisYadjust + 75, axisYadjust + 175, circleSetOne, circleSetTwo, dummyArray)
		if(parent.DropdownQuant.getCurrentSelection() == "Some(n)"){
			dummyArray = [circleSetTwo]
			generatePierceExclusive (450, 600, axisYadjust + 75, axisYadjust + 175, circleSetOne, dummyArray)
		}
	}
}

function isOverlapping (shape1, shape2){

	let distanceBetweenShapes = Math.sqrt((Math.pow((shape1.cx - shape2.cx),2)) +  Math.pow((shape1.cy - shape2.cy),2))

	if (distanceBetweenShapes < (shape1.r + shape2.r)){
		return true;
	}
	else 
		return false;
}

function coordinateInsideCircle (x, y, shape){
	
	let distanceBetweenCoordinateAndShape = Math.sqrt((Math.pow((x - shape.cx),2)) +  Math.pow((y - shape.cy),2))

	if (distanceBetweenCoordinateAndShape < shape.r)
		return true;
	else 
		return false;
}

function shadeOverlap(startingX, endX, startingY, endY, shape1, shape2){
	var x;
	var y;

	for(x = startingX; x <= endX; x = x+2){
		for(y = startingY; y <= endY; y = y+2){
			//console.log("Testing X: " + x + " Y: " + y);
			if(coordinateInsideCircle(x, y, shape1) == true && coordinateInsideCircle(x, y, shape2) == true){
				var circleShade = myInteractive.circle(x, y, 1);
			} 	
		}
	}
}

function shadeExclusive(startingX, endX, startingY, endY, shadeShape, shapeExclude){
	var x;
	var y;

	console.log("Running Shade Exclusive Function!")

	for(x = startingX; x <= endX; x = x+2){
		for(y = startingY; y <= endY; y = y+2){
			//console.log("Testing X: " + x + " Y: " + y);
			if(coordinateInsideCircle(x, y, shadeShape) == true && coordinateInsideCircle(x, y, shapeExclude) == false){
				myInteractive.circle(x, y, 1);
			} 	
		}
	}
}

function myCoordinate(inputX, inputY){
	this.x = inputX;
	this.y = inputY;
}

function generatePierceOverlap(startingX, endX, startingY, endY, shape1, shape2, shapeArrayExclude){

	var x;
	var y;
	var shade;

	for(x = startingX; x <= endX; x = x+2){
		for(y = startingY; y <= endY; y = y+2){
			if(coordinateInsideCircle(x, y, shape1) == true && coordinateInsideCircle(x, y, shape2) == true){
				shade = true;
				for(let i = 0; i < shapeArrayExclude.length; i++){
					if(coordinateInsideCircle(x, y, shapeArrayExclude[i]) == true)
						shade = false;
				}
				if(shade == true){
					let pierceShade = myInteractive.circle(x, y, 1);
					pierceShade.style.fill = "#0918F5"
				}	
			}	
		}
	}
}

function generatePierceExclusive(startingX, endX, startingY, endY, shape1, shapeArrayExclude){
	var x;
	var y;
	var shade;
	console.log(shapeArrayExclude.length)

	for(x = startingX; x <= endX; x = x+2){
		for(y = startingY; y <= endY; y = y+2){
			if(coordinateInsideCircle(x, y, shape1) == true){
				shade = true;

				for(let i = 0; i < shapeArrayExclude.length; i++)

					if(coordinateInsideCircle(x, y, shapeArrayExclude[i]) == true)
						shade = false;
					
				if(shade == true){
					let pierceShade = myInteractive.circle(x, y, 1);
					pierceShade.style.fill = "#0918F5"
				}	
			}	
		}
	}

}

console.log(myInteractive);

