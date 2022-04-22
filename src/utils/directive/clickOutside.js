
let nodeList = {}

function createDocumentHandler(
  el,
  binding
) {
  return function (e) {
    const target = e.target
    if (el.contains(target)) {
      return false
    }
    if (binding.arg) {
      binding.value(e)
    }
  }
}

const handler = (e) => {
  const { documentHandler } = nodeList
  if (documentHandler) {
    documentHandler(e)
  }
}

window.addEventListener('click', handler)

const ClickOutSide = {
  beforeMount(el, binding) {
    nodeList = {
      documentHandler: createDocumentHandler(el, binding)
    }
  },
  updated(el, binding) {
    nodeList = {
      documentHandler: createDocumentHandler(el, binding)
    }
  },
  unmounted() {
    window.removeEventListener('click', handler)
  }
}

export default ClickOutSide

