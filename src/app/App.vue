<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>LearningApp</h1>
      <nav aria-label="Navegação principal"></nav>
    </header>

    <main aria-label="Conteúdo principal"></main>
  </div>
</template>

<style>
:root {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  color: #202124;
  background: #f7f8fa;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
}

.app-shell {
  min-height: 100vh;
}

.app-header {
  display: flex;
  min-height: 4rem;
  align-items: center;
  border-bottom: 1px solid #dfe3e8;
  padding-inline: 1.5rem;
  background: #fff;
}

.app-header h1 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 650;
}
</style>
