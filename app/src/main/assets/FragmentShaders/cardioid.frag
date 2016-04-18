precision highp float;

uniform vec2 uScreen;
uniform vec2 uMousePos;
uniform float uTime;

vec3 color;



float hash( float n )
{
    return fract(sin(n)*58.5453123);
}

vec3 hash3( float n )
{
    return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(458.5423,278.1459123,192.3490423));
}

float noise( vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*157.0;
    return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
               mix( hash(n+157.0), hash(n+158.0),f.x),f.y);
}

vec2 rotate(float a, vec2 v)
{
	return vec2(
		v.x*cos(a)-v.y*sin(a),
		v.x*sin(a)+v.y*cos(a));
}
void cardioid2()
{

	vec2 uv = gl_FragCoord.xy/uScreen.xy;
	vec2 ocoord = gl_FragCoord.xy-uScreen/2.0;
	ocoord.y=ocoord.y*-1.0;

	color = vec3(0.0);
	float a = 200.0;
	float maxlayers = 10.0;
	for (float i=0.0; i<maxlayers; i+=1.0)
	{
	
		float j = i-uTime*8.0;
		 float ii = i+fract(uTime*8.0);

		a = 70.0*(pow(ii,2.5)+.5)/maxlayers;
		
		float t = uTime-0.0*i/maxlayers;
		vec2 coord = ocoord-vec2(0,a)
			+vec2(sin(2.4*t),sin(4.1*t))*uScreen*vec2(1.0/2.0*(ii+.5)/maxlayers);

		coord = rotate(sin(t/1.5)*.5*(1.0+.01*ii),coord);

		float cr = length(coord);
		float costheta = coord.y/cr;
		float r = a*(1.0-costheta);

		float sz = 3.0*(i+.5);
		
		vec3 layercolor = vec3(
			fract(j/6.0)<.5,
			fract((j+2.0)/6.0)<.5,
			fract((j+4.0)/6.0)<.5);
		layercolor.z = max(.5,layercolor.z);
		layercolor.x = max(.5,layercolor.x);
		float mask = max(0.0,1.0-abs(r-cr+sz)/sz);
		mask = pow(.5-.5*cos(3.149*mask),5.0);
		color += layercolor*vec3(mask);
	
	
	}

}
void main() {


	cardioid2();
	//color=vec3(.5+.5*sin(r),.5+.5*sin(1.1*r),.5);

	gl_FragColor = vec4(color,1);

}
