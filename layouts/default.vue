<template>
  <div class="wrapper">
    <Sidebar />
    <div class="main">
      <Header />
      <main class="content">
        <div class="container-fluid p-0">
          <Nuxt />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Sidebar from '~/components/Sidebar.vue'

export default {
  name: 'DefaultLayout',
  components: {
    Header,
    Sidebar,
  },
}
</script>
