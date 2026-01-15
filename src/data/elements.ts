export interface UIElement {
  id: string;
  name: string;
  description: string;
  category: string;
  videoUrl: string;
  code: string;
}

export const elements: UIElement[] = [
  {
    id: "1",
    name: "Botão Neon",
    description: "Botão com efeito de brilho neon animado",
    category: "Botões",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-glowing-geometric-patterns-14485-large.mp4",
    code: `<button className="relative px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-semibold rounded-lg overflow-hidden group">
  <span className="relative z-10">Hover Me</span>
  <div className="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
  <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
    Hover Me
  </span>
</button>`
  },
  {
    id: "2",
    name: "Card Glassmorphism",
    description: "Card com efeito de vidro fosco translúcido",
    category: "Cards",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-27905-large.mp4",
    code: `<div className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
  <div className="relative z-10">
    <h3 className="text-2xl font-bold text-white mb-2">Glass Card</h3>
    <p className="text-white/70">Efeito de vidro fosco moderno</p>
  </div>
</div>`
  },
  {
    id: "3",
    name: "Input Animado",
    description: "Campo de input com label flutuante animada",
    category: "Forms",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-computer-keyboard-in-close-up-4911-large.mp4",
    code: `<div className="relative group">
  <input 
    type="text" 
    className="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors peer"
    placeholder=" "
  />
  <label className="absolute left-4 top-3 text-gray-400 transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-gray-900 px-1">
    Email
  </label>
</div>`
  },
  {
    id: "4",
    name: "Loading Spinner",
    description: "Spinner de carregamento com gradiente rotativo",
    category: "Loaders",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-blue-digital-wave-moving-forward-20626-large.mp4",
    code: `<div className="relative w-16 h-16">
  <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin"></div>
  <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-400 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
</div>`
  },
  {
    id: "5",
    name: "Toggle Switch",
    description: "Switch toggle com animação suave",
    category: "Forms",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-glowing-screen-18399-large.mp4",
    code: `<label className="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" className="sr-only peer" />
  <div className="w-14 h-8 bg-gray-700 rounded-full peer peer-checked:bg-cyan-500 transition-colors duration-300">
    <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transform peer-checked:translate-x-6 transition-transform duration-300"></div>
  </div>
</label>`
  },
  {
    id: "6",
    name: "Badge Animado",
    description: "Badge com pulse de notificação",
    category: "UI",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-purple-and-green-abstract-background-loop-17806-large.mp4",
    code: `<span className="relative inline-flex">
  <span className="px-4 py-2 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-full border border-cyan-400/30">
    Novo
  </span>
  <span className="absolute -top-1 -right-1 flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
  </span>
</span>`
  },
];

export const categories = ["Todos", "Botões", "Cards", "Forms", "Loaders", "UI"];
