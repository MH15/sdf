// Companion shader for Raymarching Workshop run at Electric Square

// Workshop site: https://github.com/ajweeks/RaymarchingWorkshop

// MIT license


// This shader provides a playground for designing Signed Distance Functions (SDFs) in
// 2D. Your goal is to fill in the sdf() function below and generate an image on the left
// which is red inside your scene surfaces and green outside. The surface itself has a
// white line.




// SDF utility library functions
float opU(float d1, float d2);
float sdCircle(in vec2 p, in vec2 pos, float radius);
float sdBox(in vec2 p, in vec2 pos, in vec2 size);
float sminCubic(float a, float b, float k);
float opBlend(float d1, float d2);


// --- SDF - TODO! --------------------------------------------------------------

/*float sdf(vec2 p)
{
    return length(vec2(p.x*.25, p.y)) - .25;
}*/

// ------------------------------------------------------------------------------


// useful functions defined below
vec2 screenToWorld(vec2 screen);
vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d);
vec3 shade(float sd);




// --- SDF utility library

float sdCircle(in vec2 p, in vec2 pos, float radius)
{
    return length(p-pos)-radius;
}

float sdBox(in vec2 p, in vec2 pos, in vec2 size)
{
    vec2 d = abs(p-pos)-size;
    return min(0.0, max(d.x, d.y))+length(max(d,0.0));
}

// polynomial smooth min (k = 0.1);
float sminCubic(float a, float b, float k)
{
    float h = max(k-abs(a-b), 0.0);
    return min(a, b) - h*h*h/(6.0*k*k);
}

float opU(float d1, float d2)
{
    return min(d1, d2);
}

float opBlend(float d1, float d2)
{
    float k = 0.2;
    return sminCubic(d1, d2, k);
}

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }


float sdRoundedBox( in vec2 p, in vec2 b, in vec4 r )
{
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}

float opRound( in vec2 p, in float r )
{
  return sdBox(p, vec2(1., 0.), vec2(.1)) - r;
}

float opRoundBox( in vec2 p, in vec2 pos, in vec2 size, in float r )
{
  return sdBox(p, pos, size) - r;
}


float sdf(vec2 p)
{
    float d = 1000.0;
    
    //float a = sdCircle(p, vec2(-0.1, 0.4+sin(iTime/2.)/1.5), 0.35);
    //float b = sdCircle(p, vec2( 0.7 + sin(iTime/2.)/2., 0.1), 0.55);
    //float c = sdBox(p, vec2( -0.7 + sin(iTime/2.)/2., -.4), vec2(.5));
    
    //return sminCubic(sminCubic(a,b,.2),c,.6);
    
   //float a = sdBox(p, vec2(0., -1.), vec2(.5));
    float a = opRoundBox(p, vec2(1,1), vec2(.5),.1);
    float b = opRoundBox(p, vec2(1,0), vec2(.5),.1);
	return opSmoothUnion(a,b,.3); 
}

// compute pixel colour
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // project screen coordinate into world
	vec2 p = screenToWorld(fragCoord);
    
    // signed distance for scene
    float sd = sdf(p);
    
    // compute signed distance to a colour
    vec3 col = shade(sd);
    
    fragColor = vec4(col, 1.0);
}



// --- Misc functions


// https://www.shadertoy.com/view/ll2GD3
vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d)
{
    t = clamp(t, 0., 1.);
    return a + b*cos(6.28318*(c*t+d));
}

vec2 screenToWorld(vec2 screen)
{
    vec2 result = 2.0 * (screen/iResolution.xy - 0.5);
    result.x *= iResolution.x/iResolution.y;
    return result;
}

vec3 shade(float sd)
{
    float maxDist = 2.0;
    vec3 palCol = palette(clamp(0.5-sd*0.4, -maxDist,maxDist), 
                      vec3(0.3,0.3,0.0),vec3(0.8,0.8,0.1),vec3(0.9,0.7,0.0),vec3(0.3,0.9,0.8));

    vec3 col = palCol;
    
    // Darken around surface
	col = mix(col, col*1.0-exp(-10.0*abs(sd)), 0.4);
	// repeating lines
    col *= 0.8 + 0.2*cos(150.0*sd);
    // White outline at surface
    col = mix(col, vec3(1.0), 1.0-smoothstep(0.0,0.01,abs(sd)));
    
    return col;
}
