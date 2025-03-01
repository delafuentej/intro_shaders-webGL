
    //uniform mat4 projectionMatrix;
   // uniform mat4 viewMatrix;
   // uniform mat4 modelMatrix;

    uniform vec2 uFrecuency;
    uniform float uTime;

       // 3 uniforms matrices because they are the same for all the vertices:
       // -modelMatrix: apply transformations relative to the Mesh(position, rotation, scale)
       // -viewMatrix: apply transformations relative to the Camera (position, rotation, field of view, near, far)
       //- projectionMatrix:  apply transformations to the clip space coordinates

    //attribute vec3 position;
    //attribute vec3 position => provide us the position attibute, contains x,y,z coordinates from the attribute, different between each vertex
   // attribute vec2 uv;

    varying vec2 vUv;
    varying float vElevation;


  //  attribute float aRandom;

// we can use varying to send data from the vertex shader to the fragment shader => varying
   // varying float vRandom;

// void function will be automatically called; void => does not  return anything
    void main(){
       //gl_Position var is a very important, will contain the position of the vertex on the screen(render coordinates) 
       // 4 values is needed because the coordinates on in fact in clip space
       // we have gl_Position to a vec4 converted
       vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // to store the wind elevation in a variable
    float elevation = sin(modelPosition.x * uFrecuency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrecuency.y - uTime) * 0.1;

        modelPosition.z += sin(modelPosition.x * uFrecuency.x - uTime)* 0.1;
        modelPosition.z += sin(modelPosition.y * uFrecuency.y - uTime)* 0.1;

        modelPosition.z += elevation;

       
  
       //modelPosition.z  += aRandom * 0.1;
       vec4 viewPosition = viewMatrix  * modelPosition;
       vec4 projectedPosition = projectionMatrix * viewPosition;
       gl_Position = projectedPosition;
        //gl_Position = projectionMatrix * viewMatrix;
        // gl_Position.x  += 0.5;
        // gl_Position.y += 0.5;
          
        //vRandom = aRandom;
        vUv = uv;
        vElevation = elevation;
    }

