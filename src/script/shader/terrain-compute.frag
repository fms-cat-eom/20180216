#define PHASE_DIV 12.0
#define RANDOM_TEXTURE_RESO 64.0

precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D samplerRandom;
uniform sampler2D samplerRandomStatic;

#pragma glslify: noise = require( ./noise )

vec3 iRandom( vec2 uv, float rep ) {
  vec2 d = vec2( 0.0, 1.0 ) / RANDOM_TEXTURE_RESO;
  vec2 uvi = floor( uv * RANDOM_TEXTURE_RESO ) / RANDOM_TEXTURE_RESO;
  vec2 uvf = ( uv - uvi ) * RANDOM_TEXTURE_RESO;
  vec2 uvfs = vec2(
    smoothstep( 0.0, 1.0, uvf.x ),
    smoothstep( 0.0, 1.0, uvf.y )
  );

  vec3 v00 = texture2D( samplerRandomStatic, mod( uvi, rep ) ).xyz;
  vec3 v10 = texture2D( samplerRandomStatic, mod( uvi + d.yx, rep ) ).xyz;
  vec3 v01 = texture2D( samplerRandomStatic, mod( uvi + d.xy, rep ) ).xyz;
  vec3 v11 = texture2D( samplerRandomStatic, mod( uvi + d.yy, rep ) ).xyz;

  return mix(
    mix( v00, v10, uvfs.x ),
    mix( v01, v11, uvfs.x ),
    uvfs.y
  ) - 0.5;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  vec3 pos = vec3( ( uv - 0.5 ) * 32.0, -5.0 + 20.0 * pow( length( uv - 0.5 ), 2.0 ) );
  pos.yz = vec2( 1.0, -1.0 ) * pos.zy;

  for ( int i = 0; i < 4; i ++ ) {
    float m = 0.25 * pow( 2.0, float( i ) );
    float d = 0.125 + 0.5 * float( i );
    pos += 1.0 * iRandom( uv * m + time * vec2( 0.0, d ), 1.0 * d ) / m;
  }

  gl_FragColor = vec4( pos, 1.0 );
}