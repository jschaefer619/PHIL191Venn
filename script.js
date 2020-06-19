import {Interactive} from "https://vectorjs.org/index.js";

/*
Hi there! you are reading a comment for this code. 
These initial lines of code are adding interactive GUI elements
*/


let myInteractive = new Interactive("my-interactive");
myInteractive.border = true;

myInteractive.height = 1000;
myInteractive.width = 700;


myInteractive.text(30, 25, "Select (min 2, max 4) Interactive Sets:");

myInteractive.text(30, 56, "Set A");
myInteractive.text(110, 56, "Set B");

let checkSetC = myInteractive.checkBox(200, 50, "Set C", false);

let checkSetD = myInteractive.checkBox(300, 50, "Set D", false);

myInteractive.text(30, 87, "Select number of sentences:")

let dropdownNumSentences = myInteractive.dropdownControl (250, 87, ["1", "2", "3", "4"]);

let beginButton = myInteractive.button(330, 87, "Begin!")



finalDiagramButton = myInteractive.button(800, 300, "Generate Final Diagram")

var finalDiagramButton;
myInteractive.addDependency(checkSetC, checkSetD);

var yMod;


let setArray = []; // this array is where we wil store the sets to interact with

let sentenceArray = []; //this array is where we will store the sentences

//no matter what, the user is interacting with sets A and B, so lets add these to our array
setArray.push("A's"); 
setArray.push("B's");

//function checks if users interact with the checkboxes to add more interactive sets
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
	//function adds interactive sentences corresonding to the user selection from the sentence dropdown

	sentenceArray.splice(0, sentenceArray.length) //first we empty the sentence array

	//loop through the number of sentences the user selects
	for(let i = 0; i < parseInt(dropdownNumSentences.getCurrentSelection()); i++){ 
		
		//then generate a sentence GUI elementto appear, and add that sentence to our array
		sentenceArray.push(new Sentence(60 + (130 * i), setArray)); 
	}
	//then position the final diagram button appropriately
	finalDiagramButton.y = 130 + (130 * parseInt(dropdownNumSentences.getCurrentSelection()))
	finalDiagramButton.x = 30
	yMod = 250 + (130 * parseInt(dropdownNumSentences.getCurrentSelection()))
}

function Sentence(axisYadjust, optionsSetInput){
	//this function creates a sentence object (called 'prototype' in javascript)
	//as an input, takes in a formatting adjuster and a list of what sets are interactive

	this.optionsQuantifiers = ["All", "No", "Some", "Some(n)"];
	this.optionsSet = optionsSetInput;
	this.Button = myInteractive.button(120, axisYadjust + 135, "Generate Diagram");
	this.DropdownQuant = myInteractive.dropdownControl(5, axisYadjust + 85, this.optionsQuantifiers, 0);
	this.DropdownSetOne = myInteractive.dropdownControl(190, axisYadjust + 85, this.optionsSet, 0);
	this.textSentenceOne = myInteractive.text(295, axisYadjust + 90, "are");
	this.DropdownSetTwo = myInteractive.dropdownControl(335, axisYadjust + 85, this.optionsSet, 0)


	let parent = this;
	

	this.Button.onclick = function(event) {
		//this function generates a diagram that represents the content of these two sets

		//generate labels for each of the sentences
		let textCircleOne = myInteractive.text(420, axisYadjust + 125, parent.DropdownSetOne.getCurrentSelection())
		let textCircleTwo = myInteractive.text(610, axisYadjust + 125, parent.DropdownSetTwo.getCurrentSelection())

		let circleSetOne = myInteractive.circle(500, axisYadjust + 120, 50)
		circleSetOne.style.fill = "#FFFFFF00"
		circleSetOne.style.stroke = "black"


		let circleSetTwo = myInteractive.circle(550, axisYadjust + 120, 50)
		circleSetTwo.style.fill = "#FFFFFF00"
		circleSetTwo.style.stroke = "black"

		let dummyArray = [];

		//the following conditional statements correspond to each quantifier

		//if it is an ALL quant, shade the leftmost circle, and nothing else!
		if(parent.DropdownQuant.getCurrentSelection() == "All")
			shadeExclusive(450, 600, axisYadjust + 70, axisYadjust + 175, circleSetOne, circleSetTwo);

		//if it is a NO quant, shade the overlap of two circles
		if(parent.DropdownQuant.getCurrentSelection() == "No")
			shadeOverlap(450, 600, axisYadjust + 75, axisYadjust + 175, circleSetOne, circleSetTwo);
		
		//if it is a SOME quant, shade the overlap of two circles in blue
		if(parent.DropdownQuant.getCurrentSelection() == "Some")
			generatePierceOverlap(450, 600, axisYadjust + 75, axisYadjust + 175, circleSetOne, circleSetTwo, dummyArray)
		
		//if it is a SOME quant with the 'are not' copula, shade the leftmost circle in blue, and nothing else!
		if(parent.DropdownQuant.getCurrentSelection() == "Some(n)"){
			dummyArray = [circleSetTwo]
			generatePierceExclusive (450, 600, axisYadjust + 75, axisYadjust + 175, circleSetOne, dummyArray)
		}
	}
}


finalDiagramButton.onclick = function(event){
	//this function sets up the circles for the final diagram

	let finalCircleArray = []

	//based on the number of circles...
	if(setArray.length == 2){
		console.log("Generate Two Circles")

		//generates circles for the final diagram, then stores them in an array
		finalCircleArray.push(new CircleForFinalDiagram(setArray[0], 325, yMod, 75)) 
		finalCircleArray.push(new CircleForFinalDiagram(setArray[1], 400, yMod, 75))

		//generates labels for these circles
		myInteractive.text(215, yMod + 5, finalCircleArray[0].setRepresented)
		myInteractive.text(490, yMod + 5, finalCircleArray[1].setRepresented)

		/*passes the neccessary information to a a function, including the sentences themselves 
		and references to the final cirles
		*/
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

/* constructor for object to represent the final circles - implementation was neccessary because
the final diagram function needs to know not only that a circle in general is being shaded,
but which set each circle represents circle represents
*/
function CircleForFinalDiagram(setRepresentedString, cx, cy, radius){
	this.setRepresented = setRepresentedString;
	this.circle = myInteractive.circle(cx, cy, radius);
	this.circle.style.fill = "#FFFFFF00";
	this.circle.style.stroke = "black";
}

function generateFinalDiagram(sentenceArray, finalCircleArray, xMin, xMax, yMin, yMax){
	//this function is a bit tricky and could use a bit more readable implementation, but here it goes...

	for(let i = 0; i < sentenceArray.length; i++){
		//begin by looping through our array of sentences, each sentence is a shading process

		//the next two for loops locate the two circles associated with the two sets in each sentence
		for(let j = 0; j < finalCircleArray.length; j++){

			if(sentenceArray[i].DropdownSetOne.getCurrentSelection() == finalCircleArray[j].setRepresented){
				
				for(let k = 0; k < finalCircleArray.length; k++){

					if(sentenceArray[i].DropdownSetTwo.getCurrentSelection() == finalCircleArray[k].setRepresented){
						
						//console debug demonstrates that we have located the sets in each sentence within the final circle array
						console.log("Set one is: " + finalCircleArray[j].setRepresented); 
						console.log("Set two is: " + finalCircleArray[k].setRepresented);

						//depending on the quantifier, perform a type of shading
						if(sentenceArray[i].DropdownQuant.getCurrentSelection() == "All")
							shadeExclusive(xMin, xMax, yMin, yMax, finalCircleArray[j].circle, finalCircleArray[k].circle);
							
						if(sentenceArray[i].DropdownQuant.getCurrentSelection() == "No")
							shadeOverlap(xMin, xMax, yMin, yMax, finalCircleArray[j].circle, finalCircleArray[k].circle);
							
						if(sentenceArray[i].DropdownQuant.getCurrentSelection() == "Some"){

							//the following loop identifies the all of the shapes are not in a given sentence
							//this is necdessary because the pierce shading occurs where there are ONLY the two shapes in sentence, not others
							var excludeArray = [];
							for(let l = 0; l < finalCircleArray.length; l++){
								//loop through all of the shapes in final diagram
								
								//do not include the shapes in the sentence in the exluding array
								if(finalCircleArray[l].setRepresented == sentenceArray[i].DropdownSetOne.getCurrentSelection() || finalCircleArray[l].setRepresented == sentenceArray[i].DropdownSetTwo.getCurrentSelection())
									continue;
								excludeArray.push(finalCircleArray[l].circle)
							}
							console.log(excludeArray)
							generatePierceOverlap(xMin, xMax, yMin, yMax, finalCircleArray[j].circle, finalCircleArray[k].circle, excludeArray);
						}
						
						//same process as above, except the SOME with 'not' exclusively shades one shape in the sentence
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

//though not used in the code, this function demonstrates a fundamental technique in this implementation
//to determine if your two shapes are overlapping...
function isOverlapping (shape1, shape2){

	//use the distance formula to calculate the distance between shapes
	let distanceBetweenShapes = Math.sqrt((Math.pow((shape1.cx - shape2.cx),2)) +  Math.pow((shape1.cy - shape2.cy),2))

	//if the distance between shapes is less than the two radii, then the two shapes are overlapping
	if (distanceBetweenShapes < (shape1.r + shape2.r)){
		return true;
	}
	else 
		return false;
}

//similar technique as above
function coordinateInsideCircle (x, y, shape){
	
	let distanceBetweenCoordinateAndShape = Math.sqrt((Math.pow((x - shape.cx),2)) +  Math.pow((y - shape.cy),2))

	if (distanceBetweenCoordinateAndShape < shape.r)
		return true;
	else 
		return false;
}

//function associated with the NO quant - shading is done by creating many small vector circles
function shadeOverlap(startingX, endX, startingY, endY, shape1, shape2){
	var x;
	var y;

	for(x = startingX; x <= endX; x = x+2){
		for(y = startingY; y <= endY; y = y+2){
			if(coordinateInsideCircle(x, y, shape1) == true && coordinateInsideCircle(x, y, shape2) == true){
				var circleShade = myInteractive.circle(x, y, 1);
			} 	
		}
	}
}	

//function associated with the ALL quant
function shadeExclusive(startingX, endX, startingY, endY, shadeShape, shapeExclude){
	var x;
	var y;

	for(x = startingX; x <= endX; x = x+2)
		for(y = startingY; y <= endY; y = y+2)
			if(coordinateInsideCircle(x, y, shadeShape) == true && coordinateInsideCircle(x, y, shapeExclude) == false)
				myInteractive.circle(x, y, 1);

}

//functon associated with the SOME - remember, can only shade the overlapping area of two circles, nothing else
function generatePierceOverlap(startingX, endX, startingY, endY, shape1, shape2, shapeArrayExclude){

	var x;
	var y;
	var shade;

	for(x = startingX; x <= endX; x = x+2)
		for(y = startingY; y <= endY; y = y+2)
			//if inside both circles...
			if(coordinateInsideCircle(x, y, shape1) == true && coordinateInsideCircle(x, y, shape2) == true){
				//shade unless..
				shade = true; 
				for(let i = 0; i < shapeArrayExclude.length; i++){
					//that point is inside another shape
					if(coordinateInsideCircle(x, y, shapeArrayExclude[i]) == true)
						shade = false;
				}
				if(shade == true){
					let pierceShade = myInteractive.circle(x, y, 1);
					pierceShade.style.fill = "#0918F5"
				}	
			}	
}

//functon associated with the SOME w 'not' - remember, can only shade the designated shape, nothing else
function generatePierceExclusive(startingX, endX, startingY, endY, shape1, shapeArrayExclude){
	var x;
	var y;
	var shade;
	console.log(shapeArrayExclude.length)

	for(x = startingX; x <= endX; x = x+2)
		for(y = startingY; y <= endY; y = y+2)
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

//thanks for reading!
console.log(myInteractive);

