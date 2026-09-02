function sizeLunchMapFrame() {
  const topbar = document.querySelector('.topbar');
  const frame = document.getElementById('lunchMapFrame');
  frame.style.height = (window.innerHeight - topbar.offsetHeight) + 'px';
}
sizeLunchMapFrame();
window.addEventListener('resize', sizeLunchMapFrame);
