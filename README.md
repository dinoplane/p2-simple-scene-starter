# Ice Cold Freedom
![Picture of cavern](https://static1.thetravelimages.com/wordpress/wp-content/uploads/2022/01/ice-cave.jpg)

## Description
A generated scene of the sunset from inside an ice cavern mouth.

## Features

### Breakdown
The scene can be broken down into 3 parts: the sky, the cavern ceiling, and the ground. I added 2 new features to the scene: the torches and the cursor light. 


### How was randomness used?
1. The ice caverns were generated randomly with the help of quatric(4th power) and zenzicubic(6th power) polynomials because they had distinct wave like shapes. In code, these are generated lambda functions. To generate the functions, I randomly selected n x-intercepts and a coefficient and combined them into a single lambda representing that function (or iceCurve).

2. When drawing each iceCurve, I randomly chose the number of peaks + depressions and offset the y values a bit to create peaks. 

3. The ground uses a similar technique as the above but is flatter due to a larger coefficient (the coefficient divides).

4. The torch position/scale is random.

For the above, i used noise whenever I the seed shouldn't be changed (as in drawing) and random when generating new functions. To put it simply, random was used in function generation and noise was used in draw time.


### How was reactivity used? 
1. I included parallax for the different layers of cavern. My reasoning was that I wanted the user to look around in a way.

2. I also had a orb of light follow the cursor. This was used to reinforce free static exploration. 


### Artist Statement

I was trying to make the user explore their enclosed surroundings. I achieved this effect, but I can improve with the use of shadows. 

Credit: Arrian Chi using template https://github.com/julinas/p2-simple-scene-starter
