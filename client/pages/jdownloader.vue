<template>
  <div>
    <b-tabs type="is-boxed" position="is-centered" expanded>
      <b-tab-item label="Series" icon="television">
        <jdownloader-table :items="series" type="serie" @refresh="refresh" />
      </b-tab-item>
      <b-tab-item label="Films" icon="filmstrip" disabled></b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import JdownloaderTable from '~/components/JdownloaderTable'

export default {
  name: 'JDownloader',

  components: { JdownloaderTable },

  async asyncData({ $axios }) {
    let series = []
    try {
      series = await $axios.$get('/series/jdl-list')
    } catch (error) {
      console.log(error)
    }

    return { series }
  },

  methods: {
    async refresh() {
      try {
        this.series = await this.$axios.$get('/series/jdl-list')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
