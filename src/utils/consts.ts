// list of available models: https://github.com/mlc-ai/web-llm/blob/d8b25fed8e81d6f6b27cdc07e839c1c09cfaa43d/src/config.ts#L330
export const AVAILABLE_MODELS = [
  {
    id: "Llama-3.2-1B-Instruct-q4f32_1-MLC",
    name: "Llama 3.2 1B (Small)",
    description: "Quantization: Q4 / FP32",
    sizeGB: 1.1,
  },
  {
    id: "Llama-3.2-1B-Instruct-q0f16-MLC",
    name: "Llama 3.2 1B (Medium)",
    description: "Quantization: Full / FP16",
    sizeGB: 2.5,
  },
  {
    id: "Llama-3.2-1B-Instruct-q0f32-MLC",
    name: "Llama 3.2 1B (Large)",
    description: "Quantization: Full / FP32",
    sizeGB: 5.1,
  },
  {
    id: "Mistral-7B-Instruct-v0.3-q4f16_1-MLC",
    name: "Mistral 7B (Medium)",
    description: "Quantization: Q4 / FP16",
    sizeGB: 5.5,
  },
];
