precision highp float;

uniform vec2 uScreen;
uniform vec2 uMousePos;
uniform float uTime;

vec3 color;
float prob;


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
 vec3 sparkles(vec2 coord, float timeScale)
    {

        float h = hash(coord.x*.1+coord.y*1.345);
        float i  = 0.0;

        if(h>.995)
        {
            i = .5+.5*sin(6.28*hash(coord.x*1.2568+coord.y*.1578)+uTime*timeScale);
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
vec3 carlines(vec2 coord,vec2 p0, vec2 v0, bool away,float seed)
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


    z *= 5.0;
    z+=hash(seed);
    
    float iseed = floor(z);
	float ihash = hash(iseed+seed)/prob;
    
	float interval = mod(z,1.0);
	if(away) 
		interval = 1.0-interval;
	if(ihash < 0.0 || ihash > 1.0 || mod(iseed,2.0)<1.0)
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

	color  = vec3(0,0,0);
    
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

	return vec4(color,0.0);
}
vec4 nightcars2(vec2 ouv)
{
    vec2 ocoord = (ouv-vec2(.5,.5))*uScreen.xy;
    vec2 uv = ouv;
    vec2 coord = ocoord;

    color  = vec3(0,0,0);

    vec2 p1 = vec2(uScreen.x/2.5,0);
    vec2 p0 = vec2(0,-uScreen.y/2.0-00.0)+sin(uv.y)*1.5*uScreen.x;
    color += carlines(coord, p0, normalize(p1-p0), false);
    p0.x+=uScreen.x*.05;
    color += carlines(coord, p0, normalize(p1-p0), false);
    p0.x+=uScreen.x*.1;
    color += carlines(coord, p0, normalize(p1-p0), true);
    p0.x+=uScreen.x*.05;
    color += carlines(coord, p0, normalize(p1-p0), true);

    // small city lights
    //if(abs(uv.y-.5)<.05)
    {
        vec3 citylights = sparkles(floor(coord*2.0),1.5);
        citylights.z *= max(0.9,sin(uv.x+uv.y));
        citylights*=clamp(1.0-pow((uv.y-.5)/.2,2.0),0.0,1.0);
        citylights*=1.0-coord.x/uScreen.x*3.0;
        color += citylights;
    }
    // larger city lights
    //if(abs(uv.y-.35)<.1)
    {
        vec3 citylights = sparkles(floor(coord/2.0),0.8);
        citylights.y *= max(0.9,sin(uv.x+uv.y));
        citylights.z *= max(0.8,sin(uv.x+uv.y));
        citylights*=clamp(2.0-pow((uv.y-.35)/.04,2.0),0.0,1.0);
        citylights*=1.0-coord.x/uScreen.x*8.0;
        color += citylights;
    }

    // Mountains and Sky
    if(
        (uv.y>abs(mod(uv.x,.6)-.3)*.8+.65)
        && (uv.y>abs(mod(uv.x,.11)-.055)*.8+.65+.03)){
        float skymix =  (1.0-uv.y)/.5+hash(uv.x+uv.y)*.05;
        color  = mix(vec3(.01,.01,.01),vec3(.08,.06,.12), skymix);
        color += sparkles(floor(coord),4.0)*mix(.3, .0,skymix);
        color += sparkles(floor(coord))*mix(.3, .0,skymix);

    }

    return vec4(color,0.0);
    
}
vec4 nightcars3(vec2 ouv)
{
	vec2 ocoord = (ouv-vec2(.5,.5))*uScreen.xy;
	vec2 uv = ouv;
	vec2 coord = ocoord;

	color  = vec3(0,0,0);

	float s = uScreen.x*.05;
	vec2 p1 = vec2(0.0,0.0);
	vec2 p0 = vec2(0.0,-uScreen.y/2.0);

	prob = 0.5; // prob is a global variable because I am lazy, set between 0 and 1
	p0.x = s*-9.0;
	color += carlines(coord, p0, normalize(p1-p0), false,47.9);
	p0.x= s*-8.0;
	color += carlines(coord, p0, normalize(p1-p0), false,47.9);
	p0.x = s*-6.0;
	color += carlines(coord, p0, normalize(p1-p0), false,678.11);
	p0.x= s*-5.0;
	color += carlines(coord, p0, normalize(p1-p0), false,678.11);
	p0.x = s*-3.0;
	color += carlines(coord, p0, normalize(p1-p0), false,4.3);
	p0.x= s*-2.0;
	color += carlines(coord, p0, normalize(p1-p0), false,4.3);
	p0.x= s*2.0;
	color += carlines(coord, p0, normalize(p1-p0), true,7.34);
	p0.x= s*3.0;
	color += carlines(coord, p0, normalize(p1-p0), true,7.34);
	p0.x= s*5.0;
	color += carlines(coord, p0, normalize(p1-p0), true, 2.154);
	p0.x= s*6.0;
	color += carlines(coord, p0, normalize(p1-p0), true, 2.154);
	p0.x= s*8.0;
	color += carlines(coord, p0, normalize(p1-p0), true, 1.0);
	p0.x= s*9.0;
	color += carlines(coord, p0, normalize(p1-p0), true, 1.0);

	//Buildings and Sky
	float b1 = floor(mod(uv.x*7.0+.7,2.0))*.4+.51;
	float b2 = floor(mod(uv.x*3.8+1.0,2.0))*.26+.51;
	float b3 = floor(mod(uv.x*10.0+1.4,1.2))*.36+.51;
	float b4 = floor(mod(uv.x*11.0+.7,1.8))*.312+.51;
	float b5 = floor(mod(uv.x*3.0+1.0,2.0))*.162+.51;


	if(uv.y>b1 && uv.y>b2 && uv.y>b3 && uv.y>b4 && uv.y>b5){
			float skymix =  (1.0-uv.y)/.5+hash(uv.x+uv.y)*.01;
		color  = mix(vec3(.03,.003,.04),vec3(.1,.1,.09), skymix);
		color += sparkles(floor(coord))*mix(.3, 0.0,skymix);
    }

	return vec4(color,0.0);
}
vec4 nightcars4(vec2 ouv)
{
    vec2 ocoord = (ouv-vec2(.5,.5))*uScreen.xy;
    vec2 uv = ouv;
    vec2 coord = ocoord;

    color  = vec3(0,0,0);
    
    
  
    
    coord.y+=uScreen.y*.15;
    coord.x-=sin(uv.x*3.0)*.15*uScreen.x;
    vec2 p1 = vec2(0.0-uScreen.x*.6,0.0);
    vec2 p0 = vec2(uScreen.x*2.0,-uScreen.y/2.0);

    
    color += carlines(coord, p0, normalize(p1-p0), false);//, 534.345);
    p0.x+=uScreen.x*.1;
    color += carlines(coord, p0, normalize(p1-p0), false);//, 7423.423);
    p0.x+=uScreen.x*.3;
    color += carlines(coord, p0, normalize(p1-p0), true);//, 4562.23);
    p0.x+=uScreen.x*.1;
    color += carlines(coord, p0, normalize(p1-p0), true);//, 634.53);
    
    
    


    coord = (ouv-vec2(.8,.8))*uScreen.xy;
    
    
    // larger city lights
    //if(abs(uv.y-.35)<.1)
    {
        vec3 citylights = sparkles(floor(coord/2.0),0.8);
        citylights.x *= max(0.4,sin(uv.x*2813.23+uv.y*611.234));
        citylights.y *= max(0.4,sin(uv.x*5712.435+uv.y*112.345));
        citylights.z *= max(0.4,sin(uv.x*4511.324+uv.y*213.53));
        citylights*=clamp(3.0-pow((uv.y-.42)/.05,1.2),0.0,1.0);
        citylights*=(uv.x-.4)*8.0;
        color += citylights;
    }

    // Mountains and Sky
    if((uv.y>0.6+0.12*sin((1.0-uv.x)*5.0)+0.01*sin((1.0-uv.x)*20.0+uv.y*0.2))) { 
        float skymix =  (1.0-uv.y)/.5+hash(uv.x+uv.y)*.05;
        color  = mix(vec3(.008,.001,.012),vec3(.08,.01,.12), skymix);
        if (uv.y < 0.45+0.2*sin(uv.x*4.0+0.5)+0.01*sin(uv.x*15.0)) {
            color = vec3(.03,.03,.03); 
            vec3 citylights = sparkles(floor(coord*2.0),1.5);
            citylights.x *= max(0.4,sin(uv.x*2813.23+uv.y*611.234));
            citylights.y *= max(0.4,sin(uv.x*5712.435+uv.y*112.345));
            citylights.z *= max(0.4,sin(uv.x*4511.324+uv.y*213.53));
            citylights*=clamp(1.0-pow(max(uv.y-.4,0.0)/.2,2.0),0.0,1.0);
            citylights*=1.0-coord.x/uScreen.x*3.0;
            color += citylights;
        } else {

            color += sparkles(floor(coord),4.0)*mix(.3, .0,skymix);
        }
    }

    return vec4(color,0.0);

}
void main( )
{
	vec2 ouv = gl_FragCoord.xy / uScreen.xy;
    
	gl_FragColor = vec4(0,0,0,0);
      gl_FragColor = nightcars4(ouv);

}