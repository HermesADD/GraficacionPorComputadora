class FramebufferBloomMaterial extends Material {
  constructor(gl) {
    let vertexShaderSource = 
    `#version 300 es
    in vec4 a_position;
    in vec2 a_texcoord;
    out vec2 v_texcoord;

    void main() {
      v_texcoord = a_texcoord;
      gl_Position = a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    in vec2 v_texcoord;

    uniform sampler2D u_texture;
    uniform sampler2D u_bloom_texture;

    out vec4 pixelColor;

    // https://lisyarus.github.io/blog/posts/blur-coefficients-generator.html
    const int SAMPLE_COUNT = 10;

    const float OFFSETS[SAMPLE_COUNT] = float[SAMPLE_COUNT](
      -8.49966789706141,
      -6.4997459614507855,
      -4.499824008859313,
      -2.499902036120236,
      -0.49998010529097925,
      1.49994104108211,
      3.499863025223389,
      5.499784987465483,
      7.49970693119722,
      9.0
    );
    
    const float WEIGHTS[SAMPLE_COUNT] = float[SAMPLE_COUNT](
      0.08446907020899912,
      0.09809024964493693,
      0.10945598599862114,
      0.11736481550160269,
      0.12092728678145279,
      0.11972771279572147,
      0.11390770185454072,
      0.10413508295243942,
      0.09147996807272943,
      0.04044212618895644
    );

    vec4 blur(in sampler2D sourceTexture, vec2 blurDirection, vec2 pixelCoord) {
      vec4 result = vec4(0.0);
      vec2 size = vec2(textureSize(sourceTexture, 0));
      for (int i = 0; i < SAMPLE_COUNT; ++i) {
          vec2 offset = blurDirection * OFFSETS[i] / size;
          float weight = WEIGHTS[i];
          result += texture(sourceTexture, pixelCoord + offset) * weight;
        }
      return result;
    }

    void main() {
      vec4 bloomColor = (blur(u_bloom_texture, vec2(1,0), v_texcoord) + blur(u_bloom_texture, vec2(0,1), v_texcoord))/2.0;
      vec4 color = texture(u_texture, v_texcoord);

      pixelColor = mix(color, bloomColor, bloomColor.a);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, [1,1,1,1], vertexShaderSource, fragmentShaderSource);
  }
}