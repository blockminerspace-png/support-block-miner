import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Patch DOM para tolerar modificações de extensões de tradução (Google Translate, Edge Translator)
// Sem este patch, o React lança "removeChild: node is not a child" quando o translator
// envolve text nodes em <font> tags, deslocando-os do parent esperado.
;(function patchTranslationCompat() {
  const _removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function(child) {
    if (child.parentNode !== this) return child;
    return _removeChild.apply(this, arguments);
  };
  const _insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function(newNode, refNode) {
    if (refNode && refNode.parentNode !== this) return newNode;
    return _insertBefore.apply(this, arguments);
  };
})()

// Stale CDN/browser cache: old index references missing chunks → reload once.
window.addEventListener(
  'error',
  (event) => {
    const t = event?.target
    if (t && t.tagName === 'SCRIPT' && t.src) {
      try {
        const k = 'bm_asset_reload_v1'
        if (!sessionStorage.getItem(k)) {
          sessionStorage.setItem(k, '1')
          window.location.reload()
        }
      } catch {
        /* private mode */
      }
    }
  },
  true
)

const el = document.getElementById('root')
if (!el) {
  document.body.innerHTML = '<p style="font-family:sans-serif;padding:2rem;color:#fff;background:#020617">Missing #root</p>'
} else {
  createRoot(el).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  )
}
