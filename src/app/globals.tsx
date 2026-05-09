
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Editorial Ivory Palette */
    --background: 36 27% 93%; /* #F5EFE6 */
    --foreground: 19 33% 28%; /* #5C3D2E - Warm Brown */
    
    --card: 36 27% 93%; 
    --card-foreground: 19 33% 28%;
    
    --popover: 36 27% 93%;
    --popover-foreground: 19 33% 28%;
    
    --primary: 24 55% 11%; /* #2C1A0E - Deep Brown */
    --primary-foreground: 36 27% 98%;
    
    --secondary: 31 46% 59%; /* #C4956A - Gold-Brown */
    --secondary-foreground: 0 0% 100%;
    
    --muted: 30 26% 85%;
    --muted-foreground: 30 26% 48%; /* #9B7B5B - Muted Gold-Brown */
    
    --accent: 36 27% 90%;
    --accent-foreground: 19 33% 28%;
    
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    
    --border: 30 20% 80%;
    --input: 30 20% 80%;
    --ring: 31 46% 59%; 
    --radius: 1.5rem;

    --header-height: 80px;
    --fab-safe-area: calc(1.5rem + env(safe-area-inset-bottom, 0px));
  }
}

@layer base {
  * {
    @apply border-border outline-offset-4;
  }
  body {
    @apply text-foreground font-body antialiased;
    background: linear-gradient(180deg, #F5EFE6 0%, #EDE3D6 100%);
    min-height: 100vh;
    font-size: 16px;
    line-height: 1.6;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-headline text-primary font-bold tracking-tight italic;
  }
  
  :focus-visible {
    @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background rounded-sm;
  }

  .skip-link {
    @apply absolute left-4 -top-20 z-[200] bg-primary text-white px-4 py-2 transition-all focus:top-4;
  }
}

@layer utilities {
  .hero-image-fade {
    transition: opacity 0.6s ease;
  }
  .luxury-gradient-overlay {
    background-image: linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.65));
  }
}

.font-script {
  font-family: 'Great Vibes', cursive;
}

.button-rose {
  @apply text-white transition-all duration-300 shadow-sm font-semibold tracking-wide uppercase rounded-full bg-[#C4956A] hover:bg-[#B38459] hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg disabled:opacity-50;
}

.button-collective {
  @apply bg-[#C4956A] text-white transition-all duration-300 shadow-sm font-bold tracking-widest uppercase rounded-full px-8 py-3 hover:bg-[#B38459] hover:scale-105 active:scale-95;
}

.luxury-card {
  @apply border border-border rounded-[20px] shadow-sm transition-all duration-300 hover:shadow-md hover:border-secondary/40;
}

.shadow-soft {
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
}

.shadow-glow {
  box-shadow: 0 0 20px rgba(196, 149, 106, 0.1);
}

.golden-glow-premium {
  box-shadow: 0 0 25px rgba(196, 149, 106, 0.15);
}

.golden-glow-hover {
  @apply transition-all duration-500;
}

.golden-glow-hover:hover {
  box-shadow: 
    0 0 30px rgba(196, 149, 106, 0.45),
    0 0 60px rgba(196, 149, 106, 0.25);
  border-color: rgba(196, 149, 106, 0.6);
  transform: translateY(-6px);
  z-index: 10;
}

.category-circle {
  @apply rounded-full border-2 border-border transition-all duration-500 hover:border-secondary hover:scale-105 shadow-soft relative overflow-hidden bg-white/20;
}

.chat-scrollbar ::-webkit-scrollbar {
  width: 5px;
}
.chat-scrollbar ::-webkit-scrollbar-track {
  background: transparent;
}
.chat-scrollbar ::-webkit-scrollbar-thumb {
  background: rgba(155, 123, 91, 0.2);
  border-radius: 10px;
}

.nav-active-box {
  @apply border border-[#C4956A]/50 px-3 py-1 rounded-sm;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.ai-floating-pulse {
  animation: float 3s ease-in-out infinite;
}
