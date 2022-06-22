import { Context } from '@nuxt/types'
import Swal, { SweetAlertOptions } from 'sweetalert2'

const arrayToHtmlString = (title: string, arr: string[]): string => {
  if (!arr || !arr.length) return ''

  const ul = document.createElement('ul')
  ul.className = 'list-group'

  const header = document.createElement('li')
  header.className = 'list-group-item active'
  header.setAttribute('aria-current', 'true')
  header.innerText = title
  ul.appendChild(header)

  arr.forEach((item) => {
    const li = document.createElement('li')
    li.className = 'list-group-item'
    li.innerText = item

    ul.appendChild(li)
  })

  return ul.outerHTML
}

export default function ({ $axios }: Context) {
  $axios.onError((error) => {
    const hasErrors = !!error.response?.data?.errors
    let timerInterval: number | undefined
    const swalOptions: SweetAlertOptions = {
      icon: 'error',
      timer: 10000,
      footer: 'Este diálogo se cerrará en&nbsp;<b></b>&nbsp;segundos.',
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getFooter()?.querySelector('b')
        timerInterval = window.setInterval(() => {
          const timerLeft = Swal.getTimerLeft()
          if (!b || !timerLeft) return
          b.textContent = `${(timerLeft / 1000).toFixed(0)}`
        }, 1000)
      },
      willClose: () => {
        window.clearInterval(timerInterval)
      },
    }

    if (hasErrors) {
      const html = arrayToHtmlString(
        error.response?.data.title,
        error.response?.data.errors
      )
      Swal.fire({
        html,
        ...swalOptions,
      })
    } else {
      Swal.fire({
        title: error.response?.data.title,
        text: 'Ha ocurrido un error inesperado',
        ...swalOptions,
      })
    }
  })
}
