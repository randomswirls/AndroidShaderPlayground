precision highp float;

uniform vec2 uScreen;
uniform vec2 uMousePos;
uniform float uTime;

vec3 color;


#define PHI 1.57079632679

#define SAMPLES 3.0
#define RADIUS 70.0
#define SPEED .4

float hash( float n )
{
    return mod(sin(n)*31.1254523,1.0);
}

vec3 hash3( float n )
{
    return mod(sin(vec3(n,n+1.0,n+2.0))*vec3(9.5668844,45.64864123,16.458823),1.0);
}

float circle(vec2 p, vec2 c, float r)
{
	if(length(p-c)<r)
	{
		return 1.0;
	}
	return 0.0;
}

void main() {

vec2 ouv = gl_FragCoord.xy/uScreen.xy;
	vec2 ocoord = (ouv-vec2(.5,.5))*uScreen.xy;
	vec2 uv = ouv;
	vec2 coord = ocoord;

	float a,b,d,t,speed;
    b=5.0;
	float ctotal = 0.0;

    for(float i=0.0; i<SAMPLES; i=i+1.0){
        uv =ouv + fract(ocoord/vec2((i+1.0)*26.84591217,(i+1.0)*33.2555217));
        t = uTime-pow(hash(uTime*38.23+uv.x*838.1+uv.y*36.3),4.0)*.25;
        speed= t*SPEED;
        a=(sin(t*.222)*.5+.5);
        d = 3.14159*(sin(t*.5)*.5+.5);
        vec2 lissajou = vec2(sin(a*speed+d),sin(b*speed))*(uScreen.xy/2.0-RADIUS);
        ctotal = ctotal+circle (coord,lissajou,RADIUS);
    }

    ctotal/=SAMPLES*.5;
    color =vec3(0.0,0.0,ctotal);
   // float power = pow(1.0-abs(clamp(ctotal,0.0,.5)-.25)/.25,3.0)*.5;
    //color+=vec3(power,power,power)*vec3(.5,1.0,.5);
    color+=vec3(pow(1.0-abs(clamp(ctotal,0.0,.5)-.25)/.25,3.0)*.5)*vec3(.5,1.0,.5);

    gl_FragColor = vec4(color,1.0);

//    color = vec3(uv, 0.5 + 0.5 * sin(uTime));
  //  gl_FragColor = vec4(color,1);
}
