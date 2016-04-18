precision highp float;

uniform vec2 uScreen;
uniform vec2 uMousePos;
uniform float uTime;

vec3 color;

//soft should be 0 to 1.0)
float softInt(float f, float soft)
{
	float r = mod(f,1.0);
	if (r<soft)
		return floor(f)+r*(1.0-soft);//smoothstep(0.0,1.0,(1.0-r+soft)/soft);
	else
		return f;
}
void main()
{
   	vec2 ouv = gl_FragCoord.xy/uScreen.xy;
	vec2 ocoord = (ouv-vec2(.5,.5))*uScreen.xy;
	vec2 uv = (ouv-vec2(.5,.5))*vec2(1.0,uScreen.y/uScreen.x)*3.14159*.5;
	vec2 coord = ocoord;
	
    vec3 color = vec3(0,0,0);
		uv.y += .003*sin(uv.x*25.0+mod(3.0*uTime,6.28318530718))
		  + .005*sin(uv.x*3.0+mod(3.5*uTime,6.28318530718))
		  + .002*sin(uv.x*156.0+mod(4.0*uTime,6.28318530718))
		  + .0005*sin(uv.x*300.0+mod(5.0*uTime,6.28318530718))
		  ;

	float o = mod(uTime,6.28318530718);
	float s = cos(uv.x*20.0+o)+cos(uv.x*100.0+o)*.5+cos(uv.y*20.0+o)+cos(uv.y*100.0+o)*.5;
	s/=3.0;
	//s+=.5;
	s=abs(s);

	//color = vec3(s,s,s);

	float m = sin(uTime/2.0)*.5+.5;
	m = mix(1.0,12.0,m); // dont make this less than 1.0
	//s=ceil(s*4.0)/8.0+.5;
	s=softInt(s*4.0,sin(uTime*.05)*.5+.5)/8.0+.5;
	//s=softInt(s*4.0,1.0)/8.0+.5;
	float b = mod(uv.y*(s*m),1.0);

	b = mix(step(b,.9),b,sin(uTime*.17)*.5+.5);


	color = mix(vec3(0,.8,1.0),vec3(0,.5,.9),b);
    
	gl_FragColor = vec4(color,1.0);
}