#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) out vec4 color;

layout (binding = 0) uniform sampler2D colorTex;

layout (location = 0 ) in VS_OUT
{
  vec2 texCoord;
} surf;

vec4 I(vec2 x)
{
  return textureLod(colorTex, x, 0);
}

float gauss(float x)
{
  return exp(-x*x);
}

vec4 bilateral(vec2 x, int size)
{
  vec2 step = 1.0 / textureSize(colorTex, 0);

  vec4 filtered = vec4(0);
  float weight = 0.0;

  for (int i = -size; i <= size; ++i)
  {
    for (int j = -size; j <= size; ++j)
    {
      vec2 x_ = x + step * vec2(i, j);

      float c = gauss(length(I(x) - I(x_))) * gauss(length(x - x_));
      filtered += I(x_) * c;
      weight += c;
    }
  }

  return filtered / weight;
}

void main()
{
  color = bilateral(surf.texCoord, 2);
}
