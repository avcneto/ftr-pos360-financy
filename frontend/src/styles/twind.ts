import { observe } from 'twind/observe'
import { setup } from 'twind'

setup({
  preflight: false,
  hash: false,
})

observe(document.documentElement)
