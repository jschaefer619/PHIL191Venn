## Welcome

[View the Beta for the Venn Diagram Generator here.](https://jschaefer619.github.io/PHIL191Venn/) [View the source code here.](https://github.com/jschaefer619/PHIL191Venn) Note that the github link in the header of this website leads to a dummy repository at the moment, click the prior link instead!

## Introduction & The Approach

Diagrams have the power to communicate information in a visually salient manner.

This project explores the communication of logical relationships, primarily syllogisms, through Venn Diagrams. Loosely, syllogisms are a form of deductive reasoning to arrive at a conclusion based on two or more propositions that are assumed to be true.

An Example   
P1: All humans are mortal    
P2: All philosophers are humans.    

Conclusion: All philosophers are mortal.

Philosopher Sun-Joo Shin, among others, studied and systematized the use of Venn Diagrams to visually communicate this form of logical reasoning. Here is a diagram demonstrating how the Venn System displays four types of logical relationships between two sets:

![venn representations](https://user-images.githubusercontent.com/56604738/85115258-3d6ba480-b1d0-11ea-99a7-07455af2debd.jpg)

The goal of this project is to create an interactive system that can generate Venn Diagrams from logical sentences. It was motivated by:

**Pedagogy** - Digital tools provide new affordances for interactive learning. I hope others will utilize and enjoy this tool!

**Personal Development** - Programming is an exciting way to engage with this material. I would learn new skills throughout the project.

**Thoughts on the systematicity of Venn** - Implementing the Venn System computationally serves as a proof of concept. If a rule-based program can create the diagrams, this speaks to the _systematicity_ of Venn representations.

## Execution

Initially, my impulse was to find a ready-made graphics package with Venn representations already implemented. Searches in open-source repositories seemed fruitful. However, many of these packages were designed to represent large volumes of data. This was impressive in many ways - scaling venn circles to fit data ratios in real time is no small task. But ultimately, these packages were too complex and not flexible enough for my purposes.

I spent some time deliberating which programming language to use. Python was highly readable and a personal preference, but javascript would seamlessly translate to the web. Though I did not have extensive javascript experience, accessibility was a priority. Javascript it was. I used the [Vector.js library](https://vectorjs.org) to generate the graphics. It's documentation was readable and filled with implementation examples.

A major obstacle was implementing the shading of precise regions inside of vector generated circles. Unfortunately, there was no built in function to detect regions where two shapes were overlapping. I considered finding a more advanced library that was tailored for spatial analysis, but that would complicate this process considerably. Then this occured to me:

```
function coordinateInsideCircle (x, y, shape){
	let distanceBetweenCoordinateAndShape = Math.sqrt((Math.pow((x - shape.cx),2)) +  Math.pow((y - shape.cy),2))
	if (distanceBetweenCoordinateAndShape < shape.r)
		return true;
	else 
		return false;
}

```

Through using a pseudo-grid system based on pixel layout and comparing the distance between two points with the radii of a circle, I could easily determine if a given point was inside a circle.  Essentially, the program could 'scan' over a given area containing circles, then "shade" a space appropriately by generating very small circles at certain points.

On a higher level, this program would operate by analyzing a logical sentence, then applying rules to designated circles based on the quantifier.

In this case, a logical sentence contains:

The Subject Set
The Predicate Set
The Quantifier

The format is: {Quantifier} {Subject Set} are {Predicate Set}

This program generates circles for each set, then iterates through the user inputted sentence data structure and shades designated circles based on the quantifier.

- For ALL quantifier, shade the Subject Set circle in all areas except for the area where the Predicate Set circle overlaps with it
- For NO quantifier, shade the area where the Subject Set and Predicate set overlap
- For SOME quantifier, shade the area where ONLY the Subject Set and Predicate set overlap, do not shade the area overlaping with other circles
- For SOME quantifier w/ not, shade ONLY the area of the subject set, do not shade the area overlapping with other circles

To see the source code with non-programmer friendly comments, [view this project's repository.](https://github.com/jschaefer619/PHIL191Venn)

## Reflections & Improvements

Though rough around the edges, this project did succeed in creating an interactive venn diagram generator for logical sentences.

A strength of this implementation is that, with some GUI expansions, there are no limits on the number of logical sentences that can be expressed. I have limited the number of sentences to four in the current iteration to simplify the GUI. Granted, there are a limited amount of novel statements that can be formed with only four sets in the current sentence format. Additionally, this implementation may lead to longer run times when given a large number of sentences to compute, due to the somewhat computationally intense pseudo-grid method of shading.

In one sense, the current shading method could be used for a greater number of sets. However, a a deeper issue is encountered when representing four sets. 

The program represents the statements...

Some A's are B's
Some A's are C's
Some A's are D's

As such:

![limitation](https://user-images.githubusercontent.com/56604738/85112623-be27a200-b1ca-11ea-8f70-2887b0feec3e.png)

Using this layout of four circles, there is no way to shade exclusively the area in circle A and circle D, without also shading in the area of another circle. Due to geometric constraints, the Venn System cannot be properly implemented with four sets using regular circles. There are some alternatives.

![Venn's_four_ellipse_construction](https://user-images.githubusercontent.com/56604738/85115374-6be97f80-b1d0-11ea-9067-c83188f43a04.png)

Using ovals is a possibility. But attempting this solution would mandate rethinking the pseudo-grid approach to shading. Because the radius of an oval is irregular, it demands a more complex implementation of the 'coordinateInsideCircle' function.

Additionally, this program does not check for contradictory inputs. However, if a viewer knows how to interpret the final generated diagram, there are consistent patterns that indicate contradictions. For instance, the program represents the statements...

All A's are B's
No B's are A's

As such: 

![contradiction 1](https://user-images.githubusercontent.com/56604738/85112713-ec0ce680-b1ca-11ea-814e-588cb0811584.png)

The entire shading of the A circle represents, loosely, the inability for a set A instantiation to exist. Similarly, the program represents the statements...

No B's are A's
Some B's are A's

As such:

![contradiction 2](https://user-images.githubusercontent.com/56604738/85112779-0941b500-b1cb-11ea-884f-77b6db034d96.png)

It is difficult to discern here, but the blue shading overlapping the black shading indicates a contradiction too. There cannot exist an instantiation of any set in a black shaded area.

Some more improvements to make:
- Cleaner GUI
- Fix issues that require user to reload page when tweaking settings
- Allow users to give custom names to sets
- better integration of program within documentation
- better the efficiency & readability of source code


## Final Remarks

I hope you enjoy this tool! Making a Euler diagram generator is another intriguing prospect...

Thank you Professor Greenberg for your guidance throughout this project and for a great spring quarter.

**Bonus:** Here is an image generated during early testing of this program when I forgot to delete a line used to debug the distance between circles approach to shading.

![Screen Shot 2020-06-12 at 10 21 45 PM](https://user-images.githubusercontent.com/56604738/85114589-c71a7280-b1ce-11ea-93d2-1467a6d8d55d.png)
