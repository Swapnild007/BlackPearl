export type Module = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  topics: string[];
};

export const modules: Module[] = [
  { id:"01", kicker:"FOUNDATIONS", title:"Mathematical & Computational Foundations", description:"Build the mathematical language and computational intuition required to reason about modern AI.", topics:["Linear Algebra","Probability & Statistics","Multivariate Calculus","Optimization","Data Structures & Algorithms","Computational Systems"] },
  { id:"02", kicker:"CORE ML", title:"Core ML & Statistical Inference", description:"Move from statistical foundations to rigorous supervised, unsupervised and evaluation practice.", topics:["Regression","Regularization","Trees & Ensembles","SVM & Kernels","Clustering","Dimensionality Reduction","Validation & Evaluation"] },
  { id:"03", kicker:"DEEP LEARNING", title:"Deep Learning Architectures", description:"Understand neural computation from first principles through vision, sequence models and Transformers.", topics:["MLPs","Backpropagation","Normalization","CNNs","ResNet & EfficientNet","Detection & Segmentation","LSTM & GRU","Attention & Transformers"] },
  { id:"04", kicker:"SPECIALIZATIONS", title:"Advanced Specializations", description:"Explore NLP, reinforcement learning, information retrieval and distributed AI systems.", topics:["NLP","Embeddings","NER","MDPs","Bellman Equations","Q-Learning","Policy Gradients","Dense Retrieval","Vector Indexing","Spark & Ray"] },
  { id:"05", kicker:"MODERN AI", title:"Generative AI & Agentic Systems", description:"Study modern generative modeling, LLM adaptation, RAG and tool-using agent architectures.", topics:["VAEs","GANs","Diffusion","PEFT","LoRA & QLoRA","Instruction Tuning","DPO & RLHF","RAG","Reranking","ReAct","LangGraph"] },
  { id:"06", kicker:"PRODUCTION", title:"System Design, Production & MLOps", description:"Turn models into reliable systems with serving, infrastructure, monitoring and governance.", topics:["Quantization","Pruning","ONNX Runtime","TensorRT","vLLM","Docker","Kubernetes","MLflow","Feature Stores","Drift","SHAP & LIME"] }
];

export const projects = [
  "Custom Deep Learning Engine","Autonomous Vision & Perception Pipeline","Medical Image Segmentation & Diagnosis",
  "Audio Event Detection & Speech-to-Text","Streaming Fraud Detection Engine","Production-Grade Enterprise RAG",
  "Domain-Specific LLM Fine-Tuning (QLoRA)","Autonomous Multi-Agent Researcher","Controllable Image Synthesis with Latent Diffusion",
  "High-Throughput Model Serving Cluster","Continuous Learning & Drift Monitoring","Master’s Thesis / Capstone"
];

export const academic = [
  ["01","Semester 1 · Foundation","Mathematical Foundations of AI · Advanced Data Structures & Algorithms · Foundations of ML · AI Programming Lab"],
  ["02","Semester 2 · Core Deep Tech","Deep Learning · Convex Optimization · Elective I · Elective II"],
  ["03","Semester 3 · Specialization","RL / GenAI · Autonomous Navigation / Edge AI · Major Project Stage I"],
  ["04","Semester 4 · Culmination","Major Project Stage II · Thesis / Industry Capstone · Comprehensive Defense"]
];

export const studyLayers = [
  ["01","Theory","Precise definitions, assumptions and conceptual structure."],
  ["02","Intuition","Mental models that make the mathematics meaningful."],
  ["03","Mathematics","Derivations, objectives, gradients and statistical reasoning."],
  ["04","Implementation","Algorithms translated into executable systems."],
  ["05","Experiment","Controlled experiments, metrics and visual evidence."],
  ["06","Research","Failure analysis, open questions and project connections."]
];

export const lessonSeeds = [
  "Why this concept exists","Formal definition and notation","Geometric intuition","Derivation from first principles",
  "Worked numerical example","Implementation from scratch","Library implementation","Experiment design",
  "Failure modes","Evaluation methodology","Research questions","Project connection"
];