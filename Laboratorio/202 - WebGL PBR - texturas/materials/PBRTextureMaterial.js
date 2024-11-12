class PBRTextureMaterial extends Material {
  constructor(gl, albedoImage, normalImage, metallicImage, roughnessImage, ambientOcclusionImage) {
    let vertexShaderSource =
    `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;
    in vec2 a_texcoord;

    uniform mat4 u_VM_matrix;
    uniform mat4 u_PVM_matrix;

    out vec3 v_position;
    out vec3 v_normal;
    out vec2 v_texcoord;

    void main() {
      v_position = vec3( u_VM_matrix * a_position );
      v_normal = vec3( u_VM_matrix * vec4(a_normal, 0) );
      v_texcoord = a_texcoord;

      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    out vec4 pixelColor;

    in vec3 v_position;
    in vec3 v_normal;
    in vec2 v_texcoord;

    // material parameters
    uniform sampler2D u_albedoMap;
    uniform sampler2D u_normalMap;
    uniform sampler2D u_metallicMap;
    uniform sampler2D u_roughnessMap;
    uniform sampler2D u_aoMap;

    const int NUM_LIGHTS = 4;
    // lights
    struct Light {
      vec3 position;
      vec3 color;
    };
    uniform Light u_light[NUM_LIGHTS];

    const float PI = 3.14159265359;

    // Función auxiliar que permite crear las coordenadas de los vectores tangentes y bitangenes en los shaders
    // Hay que considerar que realizar esto en el shader es costoso y usualmente se deben crear desde la aplicación
    vec3 getNormalFromMap() {
      vec3 tangentNormal = texture(u_normalMap, v_texcoord).xyz * 2.0 - 1.0;
      vec3 Q1  = dFdx(v_position);
      vec3 Q2  = dFdy(v_position);
      vec2 st1 = dFdx(v_texcoord);
      vec2 st2 = dFdy(v_texcoord);
      vec3 N   = normalize(v_normal);
      vec3 T   = normalize(Q1*st2.t - Q2*st1.t);
      vec3 B   = -normalize(cross(N, T));
      mat3 TBN = mat3(T, B, N);
      return normalize(TBN * tangentNormal);
    }

    float DistributionGGX(vec3 N, vec3 H, float roughness) {
      float a      = roughness*roughness;
      float a2     = a*a;
      float NdotH  = max(dot(N, H), 0.0);
      float NdotH2 = NdotH*NdotH;

      float num   = a2;
      float denom = (NdotH2 * (a2 - 1.0) + 1.0);
      denom = PI * denom * denom;
      return num / denom;
    }

    float GeometrySchlickGGX(float NdotV, float roughness) {
      float r = (roughness + 1.0);
      float k = (r*r) / 8.0;
      float num   = NdotV;
      float denom = NdotV * (1.0 - k) + k;
      return num / denom;
    }

    float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
      float NdotV = max(dot(N, V), 0.0);
      float NdotL = max(dot(N, L), 0.0);
      float ggx2  = GeometrySchlickGGX(NdotV, roughness);
      float ggx1  = GeometrySchlickGGX(NdotL, roughness);
      return ggx1 * ggx2;
    }

    vec3 fresnelSchlick(float cosTheta, vec3 F0) {
      return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
    }

    void main() {
      vec3 albedo     = pow(texture(u_albedoMap, v_texcoord).rgb, vec3(2.2));
      float metallic  = texture(u_metallicMap, v_texcoord).r;
      float roughness = texture(u_roughnessMap, v_texcoord).r;
      float ao        = texture(u_aoMap, v_texcoord).r;

      vec3 N = normalize(v_normal);
      vec3 V = normalize(vec3(0.0,0.0,0.0) - v_position);

      vec3 F0 = vec3(0.04); 
      F0 = mix(F0, albedo, metallic);
                
      // ecuación de reflectividad
      vec3 Lo = vec3(0.0);
      for(int i = 0; i < NUM_LIGHTS; ++i) {
        vec3 L = normalize(u_light[i].position - v_position);
        vec3 H = normalize(V + L);
        float distance = length(u_light[i].position - v_position);
        float attenuation = 1.0 / (distance * distance);
        vec3 radiance = u_light[i].color * attenuation;        

        // cook-torrance
        float NDF = DistributionGGX(N, H, roughness);        
        float G   = GeometrySmith(N, V, L, roughness);      
        vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);       

        vec3 kS = F;
        vec3 kD = vec3(1.0) - kS;
        kD *= 1.0 - metallic;	  
            
        vec3 numerator    = NDF * G * F;
        float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001;
        vec3 specular     = numerator / denominator;  
                
        // Radiancia o cantidad de luz emitido, reflejado, transmitido o recibido en la superficie
        float NdotL = max(dot(N, L), 0.0);                
        Lo += (kD * albedo / PI + specular) * radiance * NdotL;
      }   
      
      vec3 ambient = vec3(0.03) * albedo * ao;
      vec3 color = ambient + Lo;
      
      color = color / (color + vec3(1.0));
      color = pow(color, vec3(1.0/2.2));  
      
      pixelColor = vec4(color, 1.0);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, [1,1,1,1], vertexShaderSource, fragmentShaderSource);
    
    this.albedoTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.albedoTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, albedoImage);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.normalTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.normalTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, normalImage);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.metallicTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.metallicTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, metallicImage);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.roughnessTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.roughnessTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, roughnessImage);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.ambientOcclusionTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, this.ambientOcclusionTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ambientOcclusionImage);
    gl.generateMipmap(gl.TEXTURE_2D);
  }
}