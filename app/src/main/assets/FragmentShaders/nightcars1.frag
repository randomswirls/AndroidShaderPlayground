precision highp float;

uniform vec2 uScreen;
uniform vec2 uMousePos;
uniform float uTime;

vec3 color;


float hash( float n )
{
    return fract(sin(n)*43758.5453123);
}
vec2 closestpointHorizontal(vec2 p, vec2 p0, vec2 v)
{
	float t1 = (p.x-p0.x)/v.x;
	return p0+v*t1; // closest point 
}
vec3 sparkles(vec2 coord)
{

	float h = hash(coord.x*.1+coord.y*1.345);
	float i  = 0.0;

	if(h>.995)
	{
		i = .5+.5*sin(6.28*hash(coord.x*1.2568+coord.y*.1578)+uTime);
	}

	return vec3(i,i,i);
}
vec3 carlines(vec2 coord,vec2 p0, vec2 v0, bool away)
{

	vec2 linepoint = closestpointHorizontal(coord,p0,v0);

	float d = length(linepoint-coord);

	float threshold = max(0.0,-linepoint.y)*.02;

	float intensity = 0.0;
	if(d<threshold)
		intensity = 1.0;

	float z=threshold;
	z = 1.0/(-z);
	if(away)
		z+=uTime;
	else
		z-=uTime;


	float interval = mod(5.0*z,2.0);
	if(away) 
		interval = 1.0-interval;
	if(interval < 0.0 || interval > 1.0)
		interval = 0.0;
	
	interval = clamp(interval,0.0,1.0);
	
	intensity = intensity*interval;
	if(away)
		return vec3(intensity,0,0);
	else
		return vec3(intensity,intensity,intensity);

}
vec4 nightcars1(vec2 ouv)
{
	vec2 ocoord = (ouv-vec2(.5,.5))*uScreen.xy;
	vec2 uv = ouv;
	vec2 coord = ocoord;

	color  = vec3(0.0,0.0,0.0);

    coord.x += .05*uScreen.x*sin(uv.y*20.0);
	vec2 p1 = vec2(uScreen.x/2.5,0.0);
	vec2 p0 = vec2(0,-uScreen.y/2.0);
	color += carlines(coord, p0, normalize(p1-p0), false);
	p0.x+=uScreen.x*.05;
	color += carlines(coord, p0, normalize(p1-p0), false);
	p0.x+=uScreen.x*.1;
	color += carlines(coord, p0, normalize(p1-p0), true);
	p0.x+=uScreen.x*.05;
	color += carlines(coord, p0, normalize(p1-p0), true);

    // reset coord value
    coord.x = ocoord.x;


    uv.y += .01*sin(uv.x*20.0);
	// small city lights
	if(abs(uv.y-.5)<.05)
	{
		vec3 citylights = sparkles(floor(coord*2.0))*.8;
		citylights*=clamp(1.0-pow((uv.y-.5)/.03,2.0),0.0,1.0);
		citylights*=1.0-coord.x/uScreen.x*2.0;
		color += citylights;
	}
	// larger city lights
	if(abs(uv.y-.35)<.1)
	{
		vec3 citylights = sparkles(floor(coord/2.0));
		citylights*=clamp(1.0-pow((uv.y-.35)/.08,2.0),0.0,1.0);
		citylights*=(.4-uv.x)*5.0;
		color += citylights;
	}
    uv.y = ouv.y;

	// Mountains and Sky
    uv.y += -.03*cos(uv.x*6.28);
	if(
		(uv.y>abs(mod(uv.x,.3)-.15)*.4+.65)
		&& (uv.y>abs(mod(uv.x,.11)-.055)*.4+.65+.025)){
			float skymix =  (1.0-uv.y)/.35+hash(uv.x+uv.y)*.05;
		color  = mix(vec3(.01,.01,.01),vec3(.1,.1,.1), skymix);
		color += sparkles(floor(coord))*mix(.3, .0,skymix);
	}

	return vec4(color,1.0);
}

void main( )
{
	vec2 ouv = gl_FragCoord.xy / uScreen.xy;
    
	gl_FragColor = vec4(0,0,0,1);

    gl_FragColor = nightcars1(ouv);
}