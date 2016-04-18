precision highp float;

uniform vec2 uScreen;
uniform vec2 uMousePos;
uniform float uTime;

vec3 color;



float hash( float n )
{
    return fract(sin(n)*43758.5453123);
}

vec3 hash3( float n )
{
    return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(43758.5453123,22578.1459123,19642.3490423));
}

float noise( vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*157.0;
	//return smoothstep(mix(0.0,.5,f.x),
     //          mix( 0.5,1.0,f.x),f.y);
    return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
               mix( hash(n+157.0), hash(n+158.0),f.x),f.y);
}
float absnoise6(vec2 coord)
{
	float n =0.0;
	const float samples = 1.0;

	for(float i = 0.0; i<samples; i+=1.0){
		vec2 uv = (coord+i/samples)/uScreen;
		uv.x *=uScreen.x/uScreen.y;

        // add sample jitter
		uv+=(vec2(hash(uv.x*132.133+uv.y*4782.11457),
				hash(uv.x*832.183+uv.y*532.51457))*2.0-1.0)/uScreen*1.5;

		float layermult = 1.0;
		for(float i = 0.0; i<6.0; i+=1.0){//should be LAYERS
			layermult*=.5;
			n += noise(uv*11.0/layermult)*layermult;
		}
		n += noise(uv*20.0/layermult)*layermult;

	}
	n/=samples;
	n=n*2.0-1.0;
	n=abs(n);
	n=smoothstep(0.0,.3+.1*sin(uTime*6.5),n);
	n=abs(n-.15+.15*sin(uTime*10.0))/
		(.85-.15*sin(uTime*10.0));
	n = 1.0-n;

	return n;


}
float absnoise(vec2 coord)
{
	float n =0.0;
	const float samples = 1.0;

	for(float i = 0.0; i<samples; i+=1.0){
		vec2 uv = (coord+i/samples)/uScreen;
		uv.x *=uScreen.x/uScreen.y;

		// add sample jitter
		uv+=(vec2(hash(uv.x*132.133+uv.y*4782.11457),
				hash(uv.x*832.183+uv.y*532.51457))*2.0-1.0)/uScreen;


		float layermult = 1.0;
		for(float i = 0.0; i<2.0; i+=1.0){//should be LAYERS
			layermult*=.5;
			n += noise(uv*11.0/layermult)*layermult;
		}
		n += noise(uv*20.0/layermult)*layermult;

	}
	n/=samples;
	n=n*2.0-1.0;
	n=abs(n);
	n=smoothstep(0.0,.3+.1*sin(uTime*6.5),n);
	n=abs(n-.15+.15*sin(uTime*10.0))/
		(.85-.15*sin(uTime*10.0));
	n = 1.0-n;

	return n;


}
vec3 over(vec3 a, vec3 b, float q)
{
	return a+b*vec3(1.0-q);

}
vec2 scale(float s, vec2 v)
{
	//v-=uScreen/2.0;
	v*=s;
	v+=uScreen/vec2(2.0);
	return v;
}
vec2 rotate(float a, vec2 v)
{
	return vec2(
		v.x*cos(a)-v.y*sin(a),
		v.x*sin(a)+v.y*cos(a));
}

void main() {

	vec2 uv = gl_FragCoord.xy/uScreen.xy;

    // rotate angle for the first layer
    float angle = cos(uTime*.45)*2.5+cos(uTime*2.65)*.1;

    // variables to help scale
    float m =  abs(sin(uTime*.8))+.3;
    float d0 = .1*m;
    float d = .1;

    // scales
    float s1 =.5*m;
    float s2 = s1/d0*(d0+d);
    float s3 = s1/d0*(d0+2.0*d);
    float s4 = s1/d0*(d0+3.0*d);

    // coordinates, start with a camera distortion
    vec2 ocoord = gl_FragCoord.xy-uScreen.xy/2.0;
    float lc = length(ocoord);
    ocoord = pow(cos(lc/uScreen.y*.5),1.6)*(ocoord);

    // Layer 1
    vec2 coord = rotate(angle,ocoord);
    float n1 = absnoise6(scale(s1,coord));
    vec3 c=vec3(1,0,1)*n1*(1.05-.2*vec3(uv,0.5+0.5*sin(uTime)));
    float a = n1;

    // Layer 2
    if(a<.9){
        coord = rotate(angle*.5,coord);
        float n2 = absnoise(scale(s2,coord)-500.0);
        c = over(c,vec3(0,.6,.8)*n2*(1.0-.1*vec3(0.5+0.5*sin(uTime),uv.x,uv.y))
                 ,a);
        a = max(a,n2);

    // Layer 3
    if(a<.9){
        coord = rotate(angle*.5,coord);
        float n3 = absnoise(scale(s3,coord)-1000.0);
        c = over(c,vec3(.6,.5,0)*n3,a);
        a = max(a,n3);

    // Layer 4
    float taper = hash(uv.x*3324.1134+uv.y*1258.1);
    if(a<.9 && taper>.3){
        coord = rotate(angle*.5,coord);
        float n4 = absnoise(scale(s4,coord)+1000.0);
        c = over(c,vec3(.3,.2,.4)*n4*taper,a);
        a = max(a,n4);
    }
    }
    }

    gl_FragColor = vec4(c,1.0);

}
