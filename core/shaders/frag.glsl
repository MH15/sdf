precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform float u_test;
uniform float u_smooth_factor;

uniform vec2 u_coords[10];
// uniform float u_y_coords[10];
// int xLength = 10;
// int yLength = 10;

float plot(vec2 st, float pct){
	return smoothstep( pct-0.02, pct, st.y) -
			smoothstep( pct, pct+0.02, st.y);
}

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



// https://www.shadertoy.com/view/ll2GD3
vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d)
{
	t = clamp(t, 0., 1.);
	return a + b*cos(6.28318*(c*t+d));
}


vec3 shade(float sd)
{
	float maxDist = 2.0;
	vec3 palCol = palette(clamp(0.5-sd*0.4, -maxDist,maxDist), 
					  vec3(0.3,0.3,0.0),vec3(0.8,0.8,0.1),vec3(0.9,0.7,0.0),vec3(0.3,0.9,0.8));

	vec3 col = palCol;

	// Backdrop color
	col = vec3(1,1,1);

	// Shadows around shapes, last parameter is intensity
	col = mix(col, col*1.0-exp(-30.0*abs(sd)), 0.5);
	// repeating lines
	// col *= 0.8 + 0.2*cos(150.0*sd);
	// White outline at surface
	col = mix(col, vec3(1.0), 1.0-smoothstep(0.0,0.01,abs(sd)));

	// Shape color
	float t = 1.0/u_resolution.y;
	col = mix(col, vec3(1.0), 1.-smoothstep(-t*1.5, t*1.5, sd));

	// float c = smoothstep(-t*1.5,t*1.5,d)-length(p)/3.0;
    
    // grid lines
    // c -= saturate(repeat(p.x*20.0) - 0.92)*1.5;
    // c -= saturate(repeat(p.y*20.0) - 0.92)*1.5;




	return col;
}

float opRoundBox( in vec2 p, in vec2 pos, in float radius )
{
  return sdBox(p, pos, vec2(.05)) - radius;
}

float opUnion( float d1, float d2 ) {  return min(d1,d2); }


// exponential smooth min (k = 32);
float sminExp( float a, float b, float k )
{
    float res = exp2( -k*a ) + exp2( -k*b );
    return -log2( res )/k;
}
// polynomial smooth min (k = 0.1);
float sminPoly( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}
// power smooth min (k = 8);
float sminPow( float a, float b, float k )
{
    a = pow( a, k ); b = pow( b, k );
    return pow( (a*b)/(a+b), 1.0/k );
}



float sdf(vec2 p)
{
	float d = 1000.0;

	// d = opSmoothUnion(d, sdBox(p, vec2(0,0), vec2(.1,.1)),
	// .1);

	float left = sdBox(p, vec2(-1,0), vec2(1,2));
	float right = sdBox(p, vec2(3,0), vec2(1,2));
	float top = sdBox(p, vec2(0,-1), vec2(2,1));
	float bottom = sdBox(p, vec2(0,3), vec2(2,1));

	d = opSmoothUnion(d, left, u_smooth_factor * .1);
	d = opSmoothUnion(d, right, u_smooth_factor * .1);
	d = opSmoothUnion(d, top, u_smooth_factor * .1);
	d = opSmoothUnion(d, bottom, u_smooth_factor * .1);

	for(int i = 0; i < 10; i++) {
		vec2 pos = u_coords[i];
		pos.x *= .2;
		pos.y *= .2;
		pos.x += .1;
		pos.y += .1;
		float box = opRoundBox(p, pos, .05);
		// float box = sdBox(p, pos, vec2(.1));
		d = opSmoothUnion(d, box, u_smooth_factor * .5);
		// d = sminPoly(d, box,.1);
		// d = sminExp(d, box,u_smooth_factor * 32.);
	}

	return d;
}

vec2 screenToWorld(vec2 screen)
{
	// [0,2] should be the canvas width/height
	vec2 result = 2.0 * (screen/u_resolution.xy - .5);
	result.x *= u_resolution.x/u_resolution.y;
	// orgin should be in top-right corner
	result.x += 1.;
	result.y -= 1.;
	result.y *= -1.;
	return result;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

	float y = st.x;

	vec3 color = vec3(y);

	// Plot a line
	float pct = plot(st,y);
	color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

	gl_FragColor = vec4(st.x,st.y,0.0,1.0);

	vec2 fragCoord = gl_FragCoord.xy;

	// project screen coordinate into world
	vec2 p = screenToWorld(fragCoord);

	// signed distance for scene
	float sd = sdf(p);

	// compute signed distance to a colour
	vec3 col = shade(sd);



	gl_FragColor = vec4(col, 1.0);

	//if (distance(fragCoord, vec2(0,0)) < 1000.) {
	//	gl_FragColor = vec4(1,0,0,0);
	//}

}
